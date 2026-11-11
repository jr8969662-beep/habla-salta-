// offline.js — Descarga todo para usar Hablá Salta sin internet.

const OFFLINE_META_KEY = 'hablaSaltaOffline';
const TILE_URL = 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
const TILE_SUBDOMAINS = ['a', 'b', 'c', 'd'];

// Zonas a descargar: [nombre, sur, oeste, norte, este, zoomMin, zoomMax]
const OFFLINE_AREAS = [
    ['Provincia (vista general)', -26.4, -68.6, -22.0, -62.3, 6, 9],
    ['Valle de Lerma, Quebrada y Cafayate', -26.2, -66.3, -24.4, -65.1, 10, 11],
    ['Ciudad de Salta', -24.88, -65.50, -24.71, -65.33, 12, 15],
    ['Microcentro (detalle)', -24.805, -65.425, -24.775, -65.395, 16, 17]
];
// Zona donde se descargan los lugares (hospitales, comisarías, cajeros…)
const PLACES_BBOX = [-24.90, -65.52, -24.70, -65.30];

// --- Utilidades de mosaicos ---
function lng2tile(lng, z) { return Math.floor((lng + 180) / 360 * 2 ** z); }
function lat2tile(lat, z) {
    const r = lat * Math.PI / 180;
    return Math.floor((1 - Math.log(Math.tan(r) + 1 / Math.cos(r)) / Math.PI) / 2 * 2 ** z);
}
function tileUrls() {
    const urls = new Set();
    for (const [, s, w, n, e, z0, z1] of OFFLINE_AREAS) {
        for (let z = z0; z <= z1; z++) {
            const x0 = lng2tile(w, z), x1 = lng2tile(e, z);
            const y0 = lat2tile(n, z), y1 = lat2tile(s, z);
            for (let x = x0; x <= x1; x++) {
                for (let y = y0; y <= y1; y++) {
                    const sub = TILE_SUBDOMAINS[(x + y) % TILE_SUBDOMAINS.length];
                    urls.add(TILE_URL.replace('{s}', sub).replace('{z}', z).replace('{x}', x).replace('{y}', y));
                }
            }
        }
    }
    return [...urls];
}

function getOfflineMeta() {
    try { return JSON.parse(localStorage.getItem(OFFLINE_META_KEY)) || null; } catch (e) { return null; }
}
function setOfflineMeta(m) {
    try { localStorage.setItem(OFFLINE_META_KEY, JSON.stringify(m)); } catch (e) {}
}

// --- Lugares guardados ---
let offlinePlacesData = null;
async function loadOfflinePlaces() {
    if (offlinePlacesData) return offlinePlacesData;
    try {
        const cache = await caches.open('hs-data');
        const res = await cache.match('offline-places.json');
        if (res) offlinePlacesData = await res.json();
    } catch (e) {}
    return offlinePlacesData;
}

// Búsqueda de lugares sin internet (la usa searchPlaces cuando no hay conexión)
async function searchPlacesOffline(lat, lng, categoria) {
    const data = await loadOfflinePlaces();
    if (!data) return null;
    const tags = tagsFor(categoria).map(([k, v]) => [k, new RegExp(`^(${v})$`)]);
    const matches = data.filter(el => tags.some(([k, re]) => el.tags[k] && re.test(el.tags[k])));
    let places = [];
    for (const radius of SEARCH_RADII.concat([30000])) {
        places = matches.map(el => toPlace(el, lat, lng)).filter(p => p && p.distancia <= radius);
        if (places.length >= MIN_RESULTS) break;
    }
    return places.sort((a, b) => a.distancia - b.distancia);
}

// --- Descarga ---
let downloading = false;
let wakeLock = null;
const EN_CURSO_KEY = 'hablaSaltaOfflineEnCurso';

// Peso de cada paso en el porcentaje total
const STEP_WEIGHTS = { app: 3, mapa: 58, lugares: 15, resenas: 8, traductor: 12, frases: 4 };
let activeSteps = [];
const stepFrac = {};

function overallProgress() {
    const total = activeSteps.reduce((a, s) => a + STEP_WEIGHTS[s], 0) || 1;
    const hecho = activeSteps.reduce((a, s) => a + STEP_WEIGHTS[s] * Math.min(1, stepFrac[s] || 0), 0);
    return hecho / total;
}
function stepProgress(id, frac) {
    stepFrac[id] = frac;
    setProgress(overallProgress());
}

function wait(ms) { return new Promise(r => setTimeout(r, ms)); }

// Espera a que vuelva internet (si se cancela, sale)
function waitOnline() {
    if (navigator.onLine) return Promise.resolve();
    setOfflineStatus('📶 Se cortó internet. La descarga sigue sola cuando vuelva la señal…', true);
    setPill('Sin señal · sigue sola al volver');
    return new Promise(resolve => {
        const t = setInterval(() => {
            if (navigator.onLine || !downloading) { clearInterval(t); resolve(); }
        }, 1000);
    });
}

async function fetchWithTimeout(url, ms, opts = {}) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try { return await fetch(url, { ...opts, signal: ctrl.signal }); }
    finally { clearTimeout(timer); }
}

function withTimeout(promise, ms) {
    return Promise.race([promise, new Promise((_, rej) => setTimeout(() => rej(new Error('tiempo')), ms))]);
}

// Baja una lista de URLs al caché. Lo que ya está se saltea (así "continuar" retoma donde quedó).
async function fetchInBatches(urls, cache, onStep, concurrency = 8) {
    let i = 0, ok = 0;
    const failed = [];
    async function worker() {
        while (i < urls.length && downloading) {
            const url = urls[i++];
            let done = false;
            for (let intento = 0; intento < 3 && !done && downloading; intento++) {
                try {
                    if (await cache.match(url)) { done = true; break; }
                    const res = await fetchWithTimeout(url, 15000, { mode: 'cors' });
                    if (!res.ok) throw new Error(res.status);
                    await cache.put(url, res);
                    done = true;
                } catch (e) {
                    if (!navigator.onLine) { await waitOnline(); intento--; continue; } // sin señal no cuenta como intento
                    await wait(400 * (intento + 1));
                }
            }
            if (done) ok++; else failed.push(url);
            onStep(ok + failed.length);
        }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
    return { ok, fail: failed.length, failed };
}

// Prueba los servidores uno por uno (en paralelo se bloquean por exceso de pedidos)
const OVERPASS_DESCARGA = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.private.coffee/api/interpreter',
    'https://maps.mail.ru/osm/tools/overpass/api/interpreter'
];
async function overpassOneByOne(query, desfase = 0) {
    // Cada consulta empieza por un servidor distinto, así no se saturan
    const lista = OVERPASS_DESCARGA.slice(desfase % OVERPASS_DESCARGA.length)
        .concat(OVERPASS_DESCARGA.slice(0, desfase % OVERPASS_DESCARGA.length));
    for (const url of lista) {
        if (!downloading) return null;
        await waitOnline();
        try {
            const res = await fetchWithTimeout(url, 45000, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'data=' + encodeURIComponent(query)
            });
            if (res.ok) {
                const data = await res.json();
                if (Array.isArray(data.elements)) return data.elements;
            }
            console.warn('Overpass', url, res.status);
        } catch (e) {
            console.warn('Overpass', url, e.message);
        }
    }
    return null;
}

async function downloadPlaces(onProgress) {
    // Se agrupan los valores por etiqueta: una sola expresión por etiqueta (consulta liviana)
    const porClave = {};
    const [s, w, n, e] = PLACES_BBOX;
    INTENTS.forEach(it => {
        if (!it.categoria) return;
        tagsFor(it.categoria).forEach(([k, v]) => {
            (porClave[k] = porClave[k] || new Set());
            v.split('|').forEach(x => porClave[k].add(x));
        });
    });
    const linea = k => `nwr["${k}"~"^(${[...porClave[k]].join('|')})$"](${s},${w},${n},${e});`;
    const claves = Object.keys(porClave);
    // 2 consultas: 'amenity' (la más grande) y todo lo demás, en paralelo en servidores distintos
    const consultas = [
        claves.filter(k => k === 'amenity'),
        claves.filter(k => k !== 'amenity')
    ].filter(g => g.length).map(g => `[out:json][timeout:40];(\n${g.map(linea).join('\n')}\n);out center tags;`);

    let listas = 0;
    const correr = (q, i) => overpassOneByOne(q, i).then(r => { if (r) onProgress(++listas / consultas.length); return r; });
    let resultados = await Promise.all(consultas.map(correr));
    // Segunda vuelta para la que no respondió (los servidores a veces están ocupados)
    if (resultados.some(r => !r) && downloading) {
        setStepDetail('lugares', 'servidor ocupado, reintentando…');
        await wait(3000);
        resultados = await Promise.all(resultados.map((r, i) => r || correr(consultas[i], i + 1)));
    }
    const byId = new Map();
    resultados.forEach(els => (els || []).forEach(el =>
        byId.set(el.id != null ? `${el.type}/${el.id}` : `${el.lat},${el.lon}`, el)));
    if (byId.size === 0) throw new Error('No respondió el servidor de lugares');
    const elements = [...byId.values()];

    // Guardar solo lo necesario para que ocupe poco
    const KEEP = ['name', 'brand', 'operator', 'amenity', 'healthcare', 'shop', 'tourism', 'vending',
                  'atm', 'emergency', 'addr:street', 'addr:housenumber', 'phone', 'contact:phone',
                  'opening_hours', 'aerialway', 'aeroway', 'railway', 'historic', 'leisure', 'wikipedia', 'wikidata'];
    const compact = elements.map(el => {
        const lat = el.lat ?? (el.center && el.center.lat);
        const lon = el.lon ?? (el.center && el.center.lon);
        if (lat == null) return null;
        const tags = {};
        KEEP.forEach(k => { if (el.tags && el.tags[k]) tags[k] = el.tags[k]; });
        return { lat, lon, tags };
    }).filter(Boolean);

    const cache = await caches.open('hs-data');
    await cache.put('offline-places.json', new Response(JSON.stringify(compact),
        { headers: { 'Content-Type': 'application/json' } }));
    offlinePlacesData = compact;
    return { total: compact.length, incompleto: resultados.some(r => !r) };
}

// Guarda la reseña de cada lugar turístico fijo de la app (Cabildo, Catedral, museos…)
async function downloadHistories(onProgress) {
    const lugares = [];
    INTENTS.forEach(it => {
        if (!it.categoria || !TOURIST_VALUES.has(it.categoria.value)) return;
        (it.lugares || []).forEach(l => lugares.push({ nombre: l.nombre, lat: l.lat, lng: l.lng, wikipedia: '' }));
    });
    let ok = 0, i = 0, hechos = 0;
    async function worker() {
        while (i < lugares.length && downloading) {
            const l = lugares[i++];
            await waitOnline();
            try { if (await withTimeout(wikiLookup(l), 15000)) ok++; } catch (e) {}
            onProgress(++hechos / lugares.length, ok);
        }
    }
    await Promise.all([worker(), worker(), worker()]);
    return ok;
}

async function downloadPhrases(lang, onProgress) {
    if (!lang || lang === 'es') return 0;
    const textos = [];
    INTENTS.forEach(it => { if (!it['respuesta_' + lang]) textos.push(it.respuesta_es); });
    let n = 0, i = 0, hechos = 0;
    async function worker() {
        while (i < textos.length && downloading) {
            const t = textos[i++];
            await waitOnline();
            try { await withTimeout(translateFull(t, 'es', lang), 12000); n++; } catch (e) {}
            onProgress(++hechos / textos.length);
        }
    }
    await Promise.all([worker(), worker(), worker()]);
    return n;
}

async function keepScreenOn(on) {
    try {
        if (on && 'wakeLock' in navigator && !wakeLock) {
            wakeLock = await navigator.wakeLock.request('screen');
            wakeLock.addEventListener('release', () => { wakeLock = null; });
        } else if (!on && wakeLock) {
            await wakeLock.release(); wakeLock = null;
        }
    } catch (e) { /* no soportado: no pasa nada */ }
}
// Si la app vuelve al frente durante la descarga, se pide de nuevo la pantalla encendida
document.addEventListener('visibilitychange', () => {
    if (downloading && document.visibilityState === 'visible') keepScreenOn(true);
});

function fmtTiempo(seg) {
    if (!isFinite(seg) || seg <= 0) return '';
    if (seg < 60) return `quedan ${Math.max(5, Math.round(seg / 5) * 5)} s`;
    return `quedan ~${Math.round(seg / 60)} min`;
}

async function startOfflineDownload() {
    if (downloading) {   // pausar
        downloading = false;
        setOfflineStatus('Pausando… lo ya bajado queda guardado.');
        return;
    }
    if (!navigator.onLine) { setOfflineStatus('Necesitás internet para descargar. Probá con Wi-Fi.', true); return; }
    downloading = true;
    const downloadErrors = [];
    const btn = document.getElementById('btn-descargar-todo');
    btn.textContent = '⏸ Pausar descarga';
    btn.classList.add('pausar');
    const lang = idiomaSelect.value !== 'auto' ? idiomaSelect.value : lastVisitorLang;
    const conTraductor = NATIVE_OFFLINE && lang && !['qu', 'ay', 'gn'].includes(lang);
    activeSteps = ['app', 'mapa', 'lugares', 'resenas', ...(conTraductor ? ['traductor'] : []), 'frases'];
    Object.keys(stepFrac).forEach(k => delete stepFrac[k]);
    ['app', 'mapa', 'lugares', 'resenas', 'traductor', 'frases'].forEach(s => { setStep(s, ''); setStepDetail(s, ''); });
    try { localStorage.setItem(EN_CURSO_KEY, String(Date.now())); } catch (e) {}
    setDownloadUI('bajando');
    setProgress(0);
    keepScreenOn(true);

    let r = { ok: 0, fail: 0 }, urls = [];
    try {
        if (navigator.storage && navigator.storage.persist) { try { await navigator.storage.persist(); } catch (e) {} }

        // 1) La app
        setStep('app', 'cargando');
        setOfflineStatus('Guardando la app…'); setPill('Guardando la app…');
        await registerSW();
        const appCache = await caches.open('hs-app-v1');
        await Promise.allSettled(['./', './index.html', './styles.css', './script.js', './offline.js', './extras.js',
            './manifest.json', './version.js', './salta-fondo.jpg', './icon-192.png', './icon-512.png',
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'].map(u => withTimeout(appCache.add(u), 20000)));
        stepProgress('app', 1);
        setStep('app', 'ok');
        if (!downloading) throw new Error('cancelado');

        // 2) Mapa (lo que ya estaba guardado se saltea)
        setStep('mapa', 'cargando');
        urls = tileUrls();
        const tileCache = await caches.open('hs-tiles');
        const t0 = Date.now();
        let ultimo = 0;
        const onTile = done => {
            stepProgress('mapa', done / urls.length);
            const now = Date.now();
            if (now - ultimo < 250 && done < urls.length) return;   // no redibujar a cada rato
            ultimo = now;
            const vel = done / ((now - t0) / 1000);
            setStepDetail('mapa', `${done} de ${urls.length}`);
            setOfflineStatus(`Descargando mapa: ${done} de ${urls.length} partes ${fmtTiempo((urls.length - done) / vel)}`);
            setPill(`Mapa ${done}/${urls.length}`);
        };
        r = await fetchInBatches(urls, tileCache, onTile, 8);
        // Reintento tranquilo de lo que falló
        if (r.fail && downloading) {
            setOfflineStatus(`Reintentando ${r.fail} partes del mapa que fallaron…`); setPill('Mapa: reintentando…');
            await wait(1500);
            const r2 = await fetchInBatches(r.failed, tileCache, () => {}, 3);
            r = { ok: r.ok + r2.ok, fail: r2.fail, failed: r2.failed };
        }
        if (!downloading) throw new Error('cancelado');
        const mapaOk = r.fail <= urls.length * 0.03;
        setStep('mapa', mapaOk ? 'ok' : 'error');
        setStepDetail('mapa', mapaOk ? `${r.ok} partes` : `faltan ${r.fail} partes`);
        if (!mapaOk) downloadErrors.push('parte del mapa');

        // 3) Lugares
        setStep('lugares', 'cargando');
        setOfflineStatus('Descargando hospitales, comisarías, cajeros, cafés…');
        setPill('Bajando lugares…');
        setStepDetail('lugares', 'pidiendo al servidor…');
        let nLugares = 0;
        const prev = getOfflineMeta();
        let lugaresNuevos = false;
        if (prev && prev.lugares && Date.now() - (prev.fechaLugares || 0) < 7 * 864e5) {
            nLugares = prev.lugares;          // ya están y son recientes
            setStep('lugares', 'ok');
            setStepDetail('lugares', `${nLugares} ya guardados`);
        } else {
            try {
                const res = await downloadPlaces(f => stepProgress('lugares', f));
                nLugares = res.total; lugaresNuevos = true;
                setStep('lugares', 'ok');
                setStepDetail('lugares', `${nLugares} guardados`);
            } catch (e) {
                console.warn(e);
                if (prev && prev.lugares) {   // quedan los de la descarga anterior
                    nLugares = prev.lugares;
                    setStep('lugares', 'ok');
                    setStepDetail('lugares', `${nLugares} de la descarga anterior`);
                } else {
                    setStep('lugares', 'error');
                    setStepDetail('lugares', 'el servidor no respondió');
                    downloadErrors.push('los lugares (el servidor no respondió, probá de nuevo en unos minutos)');
                }
            }
        }
        stepProgress('lugares', 1);
        if (!downloading) throw new Error('cancelado');

        // 4) Reseñas históricas
        setStep('resenas', 'cargando');
        setOfflineStatus('Guardando reseñas históricas de los lugares turísticos…'); setPill('Bajando reseñas…');
        let nResenas = 0;
        try {
            nResenas = await downloadHistories((f, ok) => {
                stepProgress('resenas', f);
                setStepDetail('resenas', `${ok} guardadas`);
            });
        } catch (e) { console.warn('Reseñas:', e); }
        stepProgress('resenas', 1);
        setStep('resenas', nResenas ? 'ok' : 'omitido');
        setStepDetail('resenas', nResenas ? `${nResenas} guardadas` : 'no se pudieron bajar ahora (no es necesario)');
        if (!downloading) throw new Error('cancelado');

        // 5) Traductor sin internet (solo en la app Android)
        let langsNativos = null;
        if (NATIVE_OFFLINE) {
            const prevT = (getOfflineMeta() || {}).traductor || [];
            if (!lang) {
                setStep('traductor', 'omitido');
                setStepDetail('traductor', 'elegí arriba el idioma del turista');
            } else if (!conTraductor) {
                setStep('traductor', 'omitido');
                setStepDetail('traductor', `${langName(lang)} no tiene traductor sin internet`);
            } else {
                setStep('traductor', 'cargando');
                setStepDetail('traductor', `${langName(lang)} ↔ español, unos 30 MB`);
                setOfflineStatus(`Descargando el traductor ${langName(lang).toLowerCase()} ↔ español. Puede tardar unos minutos…`);
                setPill('Bajando traductor…');
                // El traductor no informa avance: se mueve la barra de a poco para que se vea que sigue
                const tick = setInterval(() => stepProgress('traductor', Math.min(0.9, (stepFrac.traductor || 0) + 0.02)), 2000);
                try {
                    await nativeCall('downloadModels', [`es,en,${lang}`], 15 * 60 * 1000);
                    langsNativos = [...new Set([...prevT, lang])];
                    setStep('traductor', 'ok');
                    setStepDetail('traductor', `${langName(lang)} listo`);
                } catch (e) {
                    console.warn('Traductor offline:', e);
                    setStep('traductor', 'error');
                    setStepDetail('traductor', 'no se pudo bajar');
                    downloadErrors.push('el traductor sin internet');
                } finally {
                    clearInterval(tick);
                    stepProgress('traductor', 1);
                }
            }
        }
        if (!downloading) throw new Error('cancelado');

        // 6) Respuestas traducidas
        setStep('frases', 'cargando');
        let nFrases = 0;
        if (lang) {
            setOfflineStatus(`Traduciendo respuestas al ${langName(lang).toLowerCase()}…`); setPill('Traduciendo respuestas…');
            nFrases = await downloadPhrases(lang, f => stepProgress('frases', f));
            setStepDetail('frases', `${nFrases} ${nFrases === 1 ? 'respuesta' : 'respuestas'} en ${langName(lang).toLowerCase()}`);
        } else {
            setStepDetail('frases', 'elegí arriba el idioma del turista');
        }
        stepProgress('frases', 1);
        setStep('frases', lang ? 'ok' : 'omitido');
        if (!downloading) throw new Error('cancelado');

        const meta = getOfflineMeta() || { langs: [] };
        if (langsNativos) meta.traductor = langsNativos;
        meta.fecha = Date.now();
        meta.tiles = r.ok;
        meta.tilesTotal = urls.length;
        meta.lugares = nLugares || meta.lugares || 0;
        if (nResenas) meta.resenas = nResenas;
        if (lugaresNuevos) meta.fechaLugares = Date.now();
        if (lang && !meta.langs.includes(lang)) meta.langs.push(lang);
        meta.incompleto = downloadErrors.length > 0;
        setOfflineMeta(meta);
        try { localStorage.removeItem(EN_CURSO_KEY); } catch (e) {}
        setProgress(1);

        let msg = downloadErrors.length
            ? `⚠️ Descarga incompleta: faltó ${downloadErrors.join(' y ')}. Tocá "Completar descarga"; solo baja lo que falta.`
            : '✅ Listo. Ya podés usar la app sin internet.';
        if (!lang) msg += ' Para tener las respuestas traducidas, elegí arriba el idioma del turista y tocá de nuevo.';
        setOfflineStatus(msg, downloadErrors.length > 0);
        setDownloadUI(downloadErrors.length ? 'incompleto' : 'listo');
        try { navigator.vibrate && navigator.vibrate(downloadErrors.length ? [80, 60, 80] : 200); } catch (e) {}
    } catch (e) {
        const cancelado = e.message === 'cancelado';
        setOfflineStatus(cancelado
            ? '⏸ Descarga pausada. Lo ya bajado queda guardado: tocá "Continuar descarga" para seguir.'
            : 'Hubo un problema: ' + e.message + '. Tocá "Continuar descarga" para reintentar.', !cancelado);
        setDownloadUI('pausado');
    } finally {
        downloading = false;
        keepScreenOn(false);
        btn.classList.remove('pausar');
        renderOfflineInfo();
    }
}

async function deleteOfflineData() {
    if (NATIVE_OFFLINE) {
        const langs = ((getOfflineMeta() || {}).traductor || []).join(',');
        if (langs) { try { await nativeCall('deleteModels', [langs], 60000); } catch (e) {} }
    }
    await Promise.all(['hs-tiles', 'hs-data'].map(k => caches.delete(k)));
    try { localStorage.removeItem(OFFLINE_META_KEY); localStorage.removeItem(EN_CURSO_KEY); } catch (e) {}
    offlinePlacesData = null;
    ['app', 'mapa', 'lugares', 'resenas', 'traductor', 'frases'].forEach(s => { setStep(s, ''); setStepDetail(s, ''); });
    setProgress(0);
    setOfflineStatus('Se borró la descarga.');
    setDownloadUI('');
    renderOfflineInfo();
}

// --- Interfaz ---
function setStep(id, state) {
    const li = document.querySelector(`[data-step="${id}"]`);
    if (li) li.dataset.state = state;
}
function setStepDetail(id, txt) {
    const li = document.querySelector(`[data-step="${id}"]`);
    if (!li) return;
    let d = li.querySelector('.paso-detalle');
    if (!d) { d = document.createElement('small'); d.className = 'paso-detalle'; li.appendChild(d); }
    d.textContent = txt || '';
}

let lastPct = -1;
function setProgress(p) {
    const pct = Math.max(0, Math.min(100, Math.round(p * 100)));
    document.getElementById('offline-bar').style.width = `${pct}%`;
    if (pct === lastPct) return;
    lastPct = pct;
    const big = document.getElementById('offline-pct');
    if (big) big.textContent = downloading || pct === 100 ? `${pct}%` : (pct ? `${pct}%` : '');
    const btn = document.getElementById('btn-offline');
    btn.style.setProperty('--p', `${pct}%`);
    if (downloading) {
        btn.querySelector('.offline-icon').textContent = `${pct}%`;
        const pill = document.getElementById('offline-pill');
        if (pill) pill.querySelector('.pill-pct').textContent = `${pct}%`;
    }
}

function setOfflineStatus(msg, err) {
    const el = document.getElementById('offline-status');
    el.textContent = msg;
    el.classList.toggle('error', !!err);
}
function setPill(txt) {
    const pill = document.getElementById('offline-pill');
    if (pill && downloading) pill.querySelector('.pill-txt').textContent = txt;
}

let pillTimer = null;
// Estado visible del botón ⬇️ y del aviso flotante: '', 'bajando', 'pausado', 'incompleto', 'listo'
function setDownloadUI(estado) {
    const btn = document.getElementById('btn-offline');
    const icon = btn.querySelector('.offline-icon');
    const pill = document.getElementById('offline-pill');
    const main = document.getElementById('btn-descargar-todo');
    btn.classList.remove('bajando', 'pausado', 'incompleto');
    clearTimeout(pillTimer);
    pill.className = 'offline-pill';
    if (estado === 'bajando') {
        btn.classList.add('bajando');
        icon.textContent = '0%';
        pill.querySelector('.pill-txt').textContent = 'Preparando descarga…';
        pill.querySelector('.pill-pct').textContent = '0%';
        pill.classList.add('bajando');
        btn.setAttribute('aria-label', 'Descargando para usar sin internet');
        return;
    }
    icon.textContent = '⬇️';
    btn.style.setProperty('--p', '0%');
    btn.setAttribute('aria-label', 'Descargar para usar sin internet');
    if (estado === 'pausado') {
        btn.classList.add('pausado');
        main.textContent = '▶️ Continuar descarga';
        pill.classList.add('pausado');
        pill.querySelector('.pill-txt').textContent = 'Descarga pausada · tocá para seguir';
        pill.querySelector('.pill-pct').textContent = '⏸';
    } else if (estado === 'incompleto') {
        btn.classList.add('incompleto');
        main.textContent = '🔁 Completar descarga';
        pill.classList.add('incompleto');
        pill.querySelector('.pill-txt').textContent = 'Descarga incompleta · tocá para ver';
        pill.querySelector('.pill-pct').textContent = '⚠️';
    } else if (estado === 'listo') {
        main.textContent = '🔄 Actualizar descarga';
        pill.classList.add('listo');
        pill.querySelector('.pill-txt').textContent = 'Descarga completa';
        pill.querySelector('.pill-pct').textContent = '✅';
        pillTimer = setTimeout(() => pill.classList.add('hidden'), 6000);
    } else {
        main.textContent = '⬇️ Descargar todo';
        pill.classList.add('hidden');
    }
}

async function renderOfflineInfo() {
    const meta = getOfflineMeta();
    const btn = document.getElementById('btn-offline');
    const info = document.getElementById('offline-info');
    btn.classList.toggle('descargado', !!meta && !meta.incompleto);
    btn.title = meta ? 'Modo sin internet: descargado' : 'Descargar para usar sin internet';
    let espacio = '', libre = Infinity;
    try {
        if (navigator.storage && navigator.storage.estimate) {
            const { usage, quota } = await navigator.storage.estimate();
            espacio = ` · ${(usage / 1048576).toFixed(0)} MB usados`;
            if (quota) libre = (quota - usage) / 1048576;
        }
    } catch (e) {}
    if (meta) {
        const f = new Date(meta.fecha).toLocaleDateString('es-AR');
        const langs = (meta.langs || []).map(langName).join(', ') || 'ninguno';
        const nativos = (meta.traductor || []).map(langName).join(', ');
        info.innerHTML = `Descargado el ${f}${espacio}<br>Lugares guardados: ${meta.lugares || 0} · Reseñas: ${meta.resenas || 0} · Respuestas en: ${escapeHtml(langs)}${NATIVE_OFFLINE ? `<br>Traductor sin internet: ${escapeHtml(nativos || 'ninguno')}` : ''}`;
        if (!downloading) {
            ['app', 'mapa', 'lugares', 'resenas', 'traductor', 'frases'].forEach(s => {
                const li = document.querySelector(`[data-step="${s}"]`);
                if (!li || li.dataset.state) return;
                if (s === 'lugares') li.dataset.state = meta.lugares ? 'ok' : 'error';
                else if (s === 'resenas') li.dataset.state = meta.resenas ? 'ok' : 'omitido';
                else if (s === 'traductor') li.dataset.state = (meta.traductor || []).length ? 'ok' : 'omitido';
                else if (s === 'frases') li.dataset.state = (meta.langs || []).length ? 'ok' : 'omitido';
                else if (s === 'mapa') li.dataset.state = meta.tilesTotal && meta.tiles < meta.tilesTotal * 0.97 ? 'error' : 'ok';
                else li.dataset.state = 'ok';
            });
        }
    } else {
        info.textContent = `Todavía no descargaste nada.${espacio}`;
    }
    const n = tileUrls().length;
    const mb = Math.round(n * 0.018) + (NATIVE_OFFLINE ? 30 : 0) + 2;
    const movil = navigator.connection && navigator.connection.type === 'cellular';
    let txt = `Tamaño aproximado: ${mb} MB${NATIVE_OFFLINE ? ' (incluye el traductor)' : ''}. ` +
        (movil ? '⚠️ Estás con datos móviles: conviene Wi-Fi.' : 'Conviene usar Wi-Fi.');
    if (libre < mb + 20) txt += ' ⚠️ Queda poco espacio en el teléfono.';
    document.getElementById('offline-tamano').textContent = txt;

    // ¿Quedó una descarga a medias (se cerró la app)?
    if (!downloading) {
        let enCurso = null;
        try { enCurso = localStorage.getItem(EN_CURSO_KEY); } catch (e) {}
        const main = document.getElementById('btn-descargar-todo');
        if (enCurso) {
            setDownloadUI('pausado');
            if (!document.getElementById('offline-status').textContent) {
                setOfflineStatus('La descarga anterior quedó a medias. Tocá "Continuar descarga": sigue donde quedó.', true);
            }
        } else if (meta && meta.incompleto) {
            if (!btn.classList.contains('incompleto')) setDownloadUI('incompleto');
            document.getElementById('offline-pill').classList.add('hidden');
        } else if (meta) {
            main.textContent = '🔄 Actualizar descarga';
        }
    }
}

function updateOnlineBanner() {
    const banner = document.getElementById('offline-banner');
    const off = !navigator.onLine;
    banner.classList.toggle('hidden', !off);
    banner.textContent = getOfflineMeta()
        ? '📴 Sin internet — usando mapa, lugares y datos descargados.'
        : '📴 Sin internet. Descargá la app (botón ⬇️) para usarla sin conexión.';
}

async function registerSW() {
    if (!('serviceWorker' in navigator)) return null;
    try {
        const reg = await navigator.serviceWorker.register('sw.js');
        await navigator.serviceWorker.ready;
        return reg;
    } catch (e) {
        console.warn('No se pudo registrar el service worker', e);
        return null;
    }
}

(function setupOffline() {
    // El paso del traductor solo existe dentro de la app Android
    const pasoTraductor = document.getElementById('paso-traductor');
    if (pasoTraductor && NATIVE_OFFLINE) pasoTraductor.hidden = false;

    const panel = document.getElementById('offline-panel');
    const abrir = () => { panel.classList.remove('hidden'); if (!downloading) renderOfflineInfo(); };
    document.getElementById('btn-offline').addEventListener('click', abrir);
    document.getElementById('offline-pill').addEventListener('click', abrir);
    if (NATIVE_OFFLINE) {
        const nota = document.getElementById('offline-nota-final');
        if (nota) nota.textContent = 'Sin internet funcionan: mapa, lugares cercanos (el GPS anda sin señal), reseñas, historial, el traductor y el dictado del idioma descargado.';
    }
    document.getElementById('offline-cerrar').addEventListener('click', () => panel.classList.add('hidden'));
    panel.addEventListener('click', e => { if (e.target === panel) panel.classList.add('hidden'); });
    document.getElementById('btn-descargar-todo').addEventListener('click', startOfflineDownload);
    document.getElementById('btn-borrar-offline').addEventListener('click', () => {
        if (downloading) return;
        if (confirm('¿Borrar el mapa y los datos descargados?')) deleteOfflineData();
    });
    window.addEventListener('online', updateOnlineBanner);
    window.addEventListener('offline', updateOnlineBanner);
    updateOnlineBanner();
    renderOfflineInfo();
    // Registrar siempre, así la app abre aunque no haya señal
    if (location.protocol !== 'file:') registerSW();
})();
