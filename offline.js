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

async function fetchInBatches(urls, cache, onStep, concurrency = 6) {
    let i = 0, ok = 0, fail = 0;
    async function worker() {
        while (i < urls.length && downloading) {
            const url = urls[i++];
            try {
                if (!(await cache.match(url))) {
                    const res = await fetch(url, { mode: 'cors' });
                    if (!res.ok) throw new Error(res.status);
                    await cache.put(url, res);
                }
                ok++;
            } catch (e) {
                fail++;
            }
            onStep(ok + fail);
        }
    }
    await Promise.all(Array.from({ length: concurrency }, worker));
    return { ok, fail };
}

async function downloadPlaces() {
    // Todas las categorías de la app en una sola consulta
    const seen = new Set();
    const parts = [];
    const [s, w, n, e] = PLACES_BBOX;
    INTENTS.forEach(it => {
        if (!it.categoria) return;
        tagsFor(it.categoria).forEach(([k, v]) => {
            const key = `${k}=${v}`;
            if (seen.has(key)) return;
            seen.add(key);
            parts.push(`nwr["${k}"~"^(${v})$"](${s},${w},${n},${e});`);
        });
    });
    const query = `[out:json][timeout:90];(\n${parts.join('\n')}\n);out center tags;`;
    const elements = await overpassQuery(query, 90000);
    if (!elements) throw new Error('No respondió el servidor de lugares');

    // Guardar solo lo necesario para que ocupe poco
    const KEEP = ['name', 'brand', 'operator', 'amenity', 'healthcare', 'shop', 'tourism', 'vending',
                  'atm', 'emergency', 'addr:street', 'addr:housenumber', 'phone', 'contact:phone',
                  'opening_hours', 'aerialway', 'aeroway', 'railway', 'historic', 'leisure'];
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
    return compact.length;
}

async function downloadPhrases(lang) {
    if (!lang || lang === 'es') return 0;
    const textos = [];
    INTENTS.forEach(it => { if (!it['respuesta_' + lang]) textos.push(it.respuesta_es); });
    let n = 0;
    for (const t of textos) {
        if (!downloading) break;
        try { await translateFull(t, 'es', lang); n++; } catch (e) {}
    }
    return n;
}

async function startOfflineDownload() {
    if (downloading) { downloading = false; return; }
    if (!navigator.onLine) { setOfflineStatus('Necesitás internet para descargar. Probá con Wi-Fi.', true); return; }
    downloading = true;
    const btn = document.getElementById('btn-descargar-todo');
    btn.textContent = '⏸ Cancelar';
    const lang = idiomaSelect.value !== 'auto' ? idiomaSelect.value : lastVisitorLang;

    try {
        if (navigator.storage && navigator.storage.persist) await navigator.storage.persist();

        setStep('app', 'cargando');
        await registerSW();
        const appCache = await caches.open('hs-app-v1');
        await Promise.allSettled(['./', './index.html', './styles.css', './script.js', './offline.js',
            './manifest.json', './salta-fondo.jpg', './icon-192.png', './icon-512.png',
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
            'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
            'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'].map(u => appCache.add(u)));
        setStep('app', 'ok');

        setStep('mapa', 'cargando');
        const urls = tileUrls();
        const tileCache = await caches.open('hs-tiles');
        const r = await fetchInBatches(urls, tileCache, done => {
            setProgress(done / urls.length);
            setOfflineStatus(`Descargando mapa: ${done} de ${urls.length} partes…`);
        });
        if (!downloading) throw new Error('cancelado');
        setStep('mapa', r.fail > urls.length * 0.1 ? 'error' : 'ok');

        setStep('lugares', 'cargando');
        setOfflineStatus('Descargando hospitales, comisarías, cajeros, cafés…');
        let nLugares = 0;
        try { nLugares = await downloadPlaces(); setStep('lugares', 'ok'); }
        catch (e) { console.warn(e); setStep('lugares', 'error'); }

        setStep('frases', 'cargando');
        let nFrases = 0;
        if (lang) {
            setOfflineStatus(`Traduciendo respuestas al ${langName(lang).toLowerCase()}…`);
            nFrases = await downloadPhrases(lang);
        }
        setStep('frases', lang ? 'ok' : 'error');

        const meta = getOfflineMeta() || { langs: [] };
        meta.fecha = Date.now();
        meta.tiles = r.ok;
        meta.lugares = nLugares || meta.lugares || 0;
        if (lang && !meta.langs.includes(lang)) meta.langs.push(lang);
        setOfflineMeta(meta);
        setProgress(1);
        setOfflineStatus(`✅ Listo. Ya podés usar la app sin internet.${lang ? '' : ' (Elegí un idioma y volvé a descargar para tener las respuestas traducidas.)'}`);
    } catch (e) {
        setOfflineStatus(e.message === 'cancelado' ? 'Descarga cancelada. Lo ya bajado queda guardado.' : 'Hubo un problema: ' + e.message, true);
    } finally {
        downloading = false;
        btn.textContent = '⬇️ Descargar todo';
        renderOfflineInfo();
    }
}

async function deleteOfflineData() {
    await Promise.all(['hs-tiles', 'hs-data'].map(k => caches.delete(k)));
    try { localStorage.removeItem(OFFLINE_META_KEY); } catch (e) {}
    offlinePlacesData = null;
    ['app', 'mapa', 'lugares', 'frases'].forEach(s => setStep(s, ''));
    setProgress(0);
    setOfflineStatus('Se borró la descarga.');
    renderOfflineInfo();
}

// --- Interfaz ---
function setStep(id, state) {
    const li = document.querySelector(`[data-step="${id}"]`);
    if (li) li.dataset.state = state;
}
function setProgress(p) {
    document.getElementById('offline-bar').style.width = `${Math.round(p * 100)}%`;
}
function setOfflineStatus(msg, err) {
    const el = document.getElementById('offline-status');
    el.textContent = msg;
    el.classList.toggle('error', !!err);
}

async function renderOfflineInfo() {
    const meta = getOfflineMeta();
    const btn = document.getElementById('btn-offline');
    const info = document.getElementById('offline-info');
    btn.classList.toggle('descargado', !!meta);
    btn.title = meta ? 'Modo sin internet: descargado' : 'Descargar para usar sin internet';
    let espacio = '';
    try {
        if (navigator.storage && navigator.storage.estimate) {
            const { usage } = await navigator.storage.estimate();
            espacio = ` · ${(usage / 1048576).toFixed(0)} MB usados`;
        }
    } catch (e) {}
    if (meta) {
        const f = new Date(meta.fecha).toLocaleDateString('es-AR');
        const langs = (meta.langs || []).map(langName).join(', ') || 'ninguno';
        info.innerHTML = `Descargado el ${f}${espacio}<br>Lugares guardados: ${meta.lugares || 0} · Respuestas en: ${escapeHtml(langs)}`;
        ['app', 'mapa', 'lugares', 'frases'].forEach(s => {
            const li = document.querySelector(`[data-step="${s}"]`);
            if (li && !li.dataset.state) li.dataset.state = 'ok';
        });
    } else {
        info.textContent = `Todavía no descargaste nada.${espacio}`;
    }
    document.getElementById('offline-tamano').textContent =
        `Mapa: ${tileUrls().length} partes (≈ ${Math.round(tileUrls().length * 0.018)} MB). Conviene usar Wi-Fi.`;
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
    const panel = document.getElementById('offline-panel');
    document.getElementById('btn-offline').addEventListener('click', () => {
        panel.classList.remove('hidden');
        renderOfflineInfo();
    });
    document.getElementById('offline-cerrar').addEventListener('click', () => panel.classList.add('hidden'));
    panel.addEventListener('click', e => { if (e.target === panel) panel.classList.add('hidden'); });
    document.getElementById('btn-descargar-todo').addEventListener('click', startOfflineDownload);
    document.getElementById('btn-borrar-offline').addEventListener('click', () => {
        if (confirm('¿Borrar el mapa y los datos descargados?')) deleteOfflineData();
    });
    window.addEventListener('online', updateOnlineBanner);
    window.addEventListener('offline', updateOnlineBanner);
    updateOnlineBanner();
    renderOfflineInfo();
    // Registrar siempre, así la app abre aunque no haya señal
    if (location.protocol !== 'file:') registerSW();
})();
