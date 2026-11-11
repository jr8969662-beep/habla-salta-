/* Hablá Salta · extras: horarios (abierto/cerrado, días) y QR de "cómo llegar".
   No depende de internet: el QR se genera acá mismo y los horarios vienen del mapa descargado. */
(function () {
    'use strict';

    /* ================= HORARIOS (formato opening_hours de OpenStreetMap) ================= */

    const DIAS = ['Mo', 'Tu', 'We', 'Th', 'Fr', 'Sa', 'Su'];
    const DIAS_ES = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const D = '(?:Mo|Tu|We|Th|Fr|Sa|Su|PH)';
    const DAYSPEC = new RegExp(`^(${D}(?:\\s*-\\s*${D})?(?:\\s*,\\s*${D}(?:\\s*-\\s*${D})?)*)\\s*(.*)$`, 'i');
    const TIMES = /^(\d{1,2}):(\d{2})\s*-\s*(\d{1,2}):(\d{2})$/;

    function dayIndex(tok) {
        const i = DIAS.findIndex(d => d.toLowerCase() === tok.toLowerCase());
        return i; // -1 para PH
    }

    function expandDays(spec) {
        const out = [];
        spec.split(',').forEach(part => {
            const [a, b] = part.split('-').map(x => x.trim());
            const ia = dayIndex(a);
            if (b === undefined) { if (ia >= 0) out.push(ia); return; }
            const ib = dayIndex(b);
            if (ia < 0 || ib < 0) return;
            for (let i = ia; ; i = (i + 1) % 7) { out.push(i); if (i === ib) break; }
        });
        return out;
    }

    function parseTimes(txt) {
        const t = txt.trim().toLowerCase();
        if (t === 'off' || t === 'closed') return [];
        if (t === '24/7') return [[0, 1440]];
        const out = [];
        for (const part of t.split(',')) {
            const m = part.trim().match(TIMES);
            if (!m) return null;
            const a = (+m[1]) * 60 + (+m[2]);
            let b = (+m[3]) * 60 + (+m[4]);
            if (a > 1440 || b > 1740 || (+m[2]) > 59 || (+m[4]) > 59) return null;
            if (b <= a) b += 1440;            // cierra después de medianoche
            out.push([a, b]);
        }
        return out;
    }

    // Devuelve { week: [7 listas de [desde, hasta] en minutos], full: bool } o null si no se entiende
    function parseHours(str) {
        if (!str || typeof str !== 'string') return null;
        const s = str.replace(/"[^"]*"/g, '').trim();
        if (!s || s.includes('||')) return null;
        if (/^24\/7$/i.test(s)) return { week: Array.from({ length: 7 }, () => [[0, 1440]]), full: true };
        const week = Array(7).fill(null);
        let any = false;
        for (const rule of s.split(';')) {
            const r = rule.trim();
            if (!r) continue;
            let days = [0, 1, 2, 3, 4, 5, 6];
            let rest = r;
            const m = r.match(DAYSPEC);
            if (m && m[2] !== undefined && !/^\d/.test(r)) {
                days = expandDays(m[1]);
                rest = m[2] || 'off';
                if (/^PH(\s*,\s*PH)*$/i.test(m[1].trim())) continue; // solo feriados: se ignora
            }
            const times = parseTimes(rest);
            if (times === null) return null;      // meses, amanecer, etc.: no lo inventamos
            days.forEach(d => { week[d] = times; });
            any = true;
        }
        if (!any) return null;
        const w = week.map(x => x || []);
        const full = w.every(x => x.length === 1 && x[0][0] === 0 && x[0][1] >= 1440);
        return { week: w, full };
    }

    const pad = n => String(n).padStart(2, '0');
    const hhmm = min => `${pad(Math.floor((min % 1440) / 60))}:${pad(min % 60)}`;

    // Hora actual en Salta (aunque el teléfono tenga otra zona)
    function nowSalta() {
        try {
            const parts = new Intl.DateTimeFormat('en-US', {
                timeZone: 'America/Argentina/Salta', weekday: 'short',
                hour: '2-digit', minute: '2-digit', hour12: false
            }).formatToParts(new Date());
            const get = t => (parts.find(p => p.type === t) || {}).value;
            const day = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].indexOf(get('weekday'));
            return { day: day < 0 ? 0 : day, min: (+get('hour') % 24) * 60 + (+get('minute')) };
        } catch (e) {
            const d = new Date();
            return { day: (d.getDay() + 6) % 7, min: d.getHours() * 60 + d.getMinutes() };
        }
    }

    // { open: true|false, text: 'Abierto ahora · cierra a las 20:00' }
    function hoursStatus(parsed, now) {
        if (!parsed) return null;
        now = now || nowSalta();
        const { day, min } = now;
        if (parsed.full) return { open: true, text: 'Abierto las 24 horas' };

        // ¿Sigue abierto desde ayer pasada la medianoche?
        for (const [a, b] of parsed.week[(day + 6) % 7]) {
            if (b > 1440 && min < b - 1440) return { open: true, text: `Abierto ahora · cierra a las ${hhmm(b)}` };
        }
        for (const [a, b] of parsed.week[day]) {
            if (min >= a && min < b) {
                return { open: true, text: `Abierto ahora · cierra a las ${hhmm(b)}` };
            }
        }
        // Cerrado: ¿cuándo abre?
        const hoy = parsed.week[day].filter(([a]) => a > min).sort((x, y) => x[0] - y[0]);
        if (hoy.length) return { open: false, text: `Cerrado ahora · abre hoy a las ${hhmm(hoy[0][0])}` };
        for (let k = 1; k <= 7; k++) {
            const d = (day + k) % 7;
            const ints = parsed.week[d].slice().sort((x, y) => x[0] - y[0]);
            if (ints.length) {
                const cuando = k === 1 ? 'mañana' : `el ${DIAS_ES[d]}`;
                return { open: false, text: `Cerrado ahora · abre ${cuando} a las ${hhmm(ints[0][0])}` };
            }
        }
        return { open: false, text: 'Cerrado' };
    }

    // Filas agrupadas por días seguidos con el mismo horario: [{ from, to, text }] (0 = lunes)
    function weekRows(parsed) {
        if (!parsed) return [];
        const txt = parsed.week.map(ints => ints.length
            ? ints.slice().sort((x, y) => x[0] - y[0])
                .map(([a, b]) => (a === 0 && b >= 1440) ? '24 hs' : `${hhmm(a)}–${hhmm(b)}`).join(' / ')
            : null);
        const rows = [];
        for (let d = 0; d < 7; d++) {
            const last = rows[rows.length - 1];
            if (last && last.text === txt[d]) last.to = d;
            else rows.push({ from: d, to: d, text: txt[d] });
        }
        return rows;
    }

    function dayLabel(d, lang, long) {
        try {
            return new Date(Date.UTC(2024, 0, 1 + d)).toLocaleDateString(lang || 'es',
                { weekday: long ? 'long' : 'short', timeZone: 'UTC' });
        } catch (e) {
            return DIAS_ES[d].slice(0, long ? 99 : 3);
        }
    }

    function rowLabel(row, lang, long) {
        return row.from === row.to
            ? dayLabel(row.from, lang, long)
            : `${dayLabel(row.from, lang, long)} – ${dayLabel(row.to, lang, long)}`;
    }

    function weekTableHtml(parsed, lang, cerrado) {
        return weekRows(parsed).map(r =>
            `<div class="sem-fila${r.text ? '' : ' sem-cerrado'}"><span class="sem-dias">${rowLabel(r, lang, false)}</span>` +
            `<span class="sem-horas">${r.text || cerrado}</span></div>`).join('');
    }

    /* ================= QR (modo byte, corrección M, versiones 1 a 6) ================= */

    const EC_M = { 1: [10, [16]], 2: [16, [28]], 3: [26, [44]], 4: [18, [32, 32]], 5: [24, [43, 43]], 6: [16, [27, 27, 27, 27]] };
    const ALIGN = { 1: [], 2: [6, 18], 3: [6, 22], 4: [6, 26], 5: [6, 30], 6: [6, 34] };

    const EXP = new Array(512), LOG = new Array(256);
    (function () {
        let x = 1;
        for (let i = 0; i < 255; i++) { EXP[i] = x; LOG[x] = i; x <<= 1; if (x & 256) x ^= 0x11d; }
        for (let i = 255; i < 512; i++) EXP[i] = EXP[i - 255];
    })();
    const gmul = (a, b) => (a === 0 || b === 0) ? 0 : EXP[LOG[a] + LOG[b]];

    function rsGenerator(n) {
        let g = [1];
        for (let i = 0; i < n; i++) {
            const next = new Array(g.length + 1).fill(0);
            for (let j = 0; j < g.length; j++) {
                next[j] ^= g[j];
                next[j + 1] ^= gmul(g[j], EXP[i]);
            }
            g = next;
        }
        return g; // coeficientes de mayor a menor grado
    }

    function rsRemainder(data, n) {
        const g = rsGenerator(n);
        const res = data.concat(new Array(n).fill(0));
        for (let i = 0; i < data.length; i++) {
            const c = res[i];
            if (c !== 0) for (let j = 1; j < g.length; j++) res[i + j] ^= gmul(g[j], c);
        }
        return res.slice(data.length);
    }

    function utf8Bytes(s) {
        return Array.from(new TextEncoder().encode(s));
    }

    function buildCodewords(bytes, version) {
        const [ecLen, blocks] = EC_M[version];
        const dataCap = blocks.reduce((a, b) => a + b, 0);
        const bits = [];
        const put = (val, len) => { for (let i = len - 1; i >= 0; i--) bits.push((val >> i) & 1); };
        put(0b0100, 4);
        put(bytes.length, 8);
        bytes.forEach(b => put(b, 8));
        for (let i = 0; i < 4 && bits.length < dataCap * 8; i++) bits.push(0);
        while (bits.length % 8) bits.push(0);
        const data = [];
        for (let i = 0; i < bits.length; i += 8) {
            let v = 0;
            for (let j = 0; j < 8; j++) v = (v << 1) | bits[i + j];
            data.push(v);
        }
        for (let p = 0; data.length < dataCap; p++) data.push(p % 2 ? 0x11 : 0xEC);

        let off = 0;
        const dBlocks = blocks.map(n => { const b = data.slice(off, off + n); off += n; return b; });
        const eBlocks = dBlocks.map(b => rsRemainder(b, ecLen));
        const out = [];
        const maxD = Math.max(...blocks);
        for (let i = 0; i < maxD; i++) dBlocks.forEach(b => { if (i < b.length) out.push(b[i]); });
        for (let i = 0; i < ecLen; i++) eBlocks.forEach(b => out.push(b[i]));
        return out;
    }

    const MASKS = [
        (r, c) => (r + c) % 2 === 0,
        (r, c) => r % 2 === 0,
        (r, c) => c % 3 === 0,
        (r, c) => (r + c) % 3 === 0,
        (r, c) => (Math.floor(r / 2) + Math.floor(c / 3)) % 2 === 0,
        (r, c) => ((r * c) % 2) + ((r * c) % 3) === 0,
        (r, c) => (((r * c) % 2) + ((r * c) % 3)) % 2 === 0,
        (r, c) => ((((r + c) % 2) + ((r * c) % 3)) % 2) === 0
    ];

    function formatBits(mask) {
        const data = (0 << 3) | mask; // nivel M = 00
        let v = data << 10;
        for (let i = 14; i >= 10; i--) if ((v >> i) & 1) v ^= 0x537 << (i - 10);
        return ((data << 10) | v) ^ 0x5412;
    }

    function penalty(m) {
        const n = m.length;
        let score = 0;
        const line = get => {
            let run = 1;
            for (let i = 1; i < n; i++) {
                if (get(i) === get(i - 1)) run++;
                else { if (run >= 5) score += 3 + (run - 5); run = 1; }
            }
            if (run >= 5) score += 3 + (run - 5);
        };
        for (let i = 0; i < n; i++) { line(j => m[i][j]); line(j => m[j][i]); }
        for (let r = 0; r < n - 1; r++) for (let c = 0; c < n - 1; c++) {
            const v = m[r][c];
            if (v === m[r][c + 1] && v === m[r + 1][c] && v === m[r + 1][c + 1]) score += 3;
        }
        const pat = [1, 0, 1, 1, 1, 0, 1, 0, 0, 0, 0], rev = pat.slice().reverse();
        const match = (get, p) => p.every((x, k) => (get(k) ? 1 : 0) === x);
        for (let i = 0; i < n; i++) for (let j = 0; j <= n - 11; j++) {
            if (match(k => m[i][j + k], pat) || match(k => m[i][j + k], rev)) score += 40;
            if (match(k => m[j + k][i], pat) || match(k => m[j + k][i], rev)) score += 40;
        }
        let dark = 0;
        m.forEach(row => row.forEach(v => { if (v) dark++; }));
        score += 10 * Math.floor(Math.abs(dark * 100 / (n * n) - 50) / 5);
        return score;
    }

    function qrMatrix(text) {
        const bytes = utf8Bytes(text);
        let version = 0;
        for (let v = 1; v <= 6; v++) {
            if (bytes.length <= EC_M[v][1].reduce((a, b) => a + b, 0) - 2) { version = v; break; }
        }
        if (!version) throw new Error('Texto demasiado largo para el QR');
        const size = 17 + 4 * version;
        const code = buildCodewords(bytes, version);

        // base: null = módulo libre para datos
        const base = Array.from({ length: size }, () => Array(size).fill(null));
        const setF = (r, c, v) => { if (r >= 0 && c >= 0 && r < size && c < size) base[r][c] = v; };

        const finder = (r0, c0) => {
            for (let r = -1; r <= 7; r++) for (let c = -1; c <= 7; c++) {
                const inside = r >= 0 && r <= 6 && c >= 0 && c <= 6;
                const dark = inside && (r === 0 || r === 6 || c === 0 || c === 6 || (r >= 2 && r <= 4 && c >= 2 && c <= 4));
                setF(r0 + r, c0 + c, dark);
            }
        };
        finder(0, 0); finder(0, size - 7); finder(size - 7, 0);

        for (let i = 8; i < size - 8; i++) { setF(6, i, i % 2 === 0); setF(i, 6, i % 2 === 0); }

        const pos = ALIGN[version];
        pos.forEach(r => pos.forEach(c => {
            if (base[r][c] !== null) return; // se pisaría con un buscador
            for (let dr = -2; dr <= 2; dr++) for (let dc = -2; dc <= 2; dc++) {
                setF(r + dr, c + dc, Math.max(Math.abs(dr), Math.abs(dc)) !== 1);
            }
        }));

        // Reservar zonas de formato
        const reserved = base.map(row => row.map(v => v !== null));
        for (let i = 0; i < 9; i++) { reserved[8][i] = true; reserved[i][8] = true; }
        for (let i = 0; i < 8; i++) { reserved[8][size - 1 - i] = true; reserved[size - 1 - i][8] = true; }
        reserved[size - 8][8] = true;

        const build = mask => {
            const m = base.map(row => row.slice());
            // datos en zigzag
            let inc = -1, row = size - 1, bitIndex = 7, byteIndex = 0;
            for (let col = size - 1; col > 0; col -= 2) {
                if (col === 6) col--;
                for (;;) {
                    for (let c = 0; c < 2; c++) {
                        const cc = col - c;
                        if (!reserved[row][cc]) {
                            let dark = false;
                            if (byteIndex < code.length) dark = ((code[byteIndex] >>> bitIndex) & 1) === 1;
                            if (MASKS[mask](row, cc)) dark = !dark;
                            m[row][cc] = dark;
                            bitIndex--;
                            if (bitIndex === -1) { byteIndex++; bitIndex = 7; }
                        }
                    }
                    row += inc;
                    if (row < 0 || size <= row) { row -= inc; inc = -inc; break; }
                }
            }
            // formato
            const bits = formatBits(mask);
            for (let i = 0; i < 15; i++) {
                const v = ((bits >> i) & 1) === 1;
                if (i < 6) m[i][8] = v; else if (i < 8) m[i + 1][8] = v; else m[size - 15 + i][8] = v;
                if (i < 8) m[8][size - i - 1] = v; else if (i < 9) m[8][15 - i - 1 + 1] = v; else m[8][15 - i - 1] = v;
            }
            m[size - 8][8] = true;
            return m;
        };

        let best = null, bestScore = Infinity;
        for (let mask = 0; mask < 8; mask++) {
            const m = build(mask);
            const sc = penalty(m);
            if (sc < bestScore) { bestScore = sc; best = m; }
        }
        return best;
    }

    function qrSvg(text) {
        const m = qrMatrix(text);
        const n = m.length, q = 4, total = n + q * 2;
        let path = '';
        for (let r = 0; r < n; r++) {
            let c = 0;
            while (c < n) {
                if (!m[r][c]) { c++; continue; }
                let e = c;
                while (e < n && m[r][e]) e++;
                path += `M${c + q} ${r + q}h${e - c}v1h-${e - c}z`;
                c = e;
            }
        }
        return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${total} ${total}" shape-rendering="crispEdges" role="img" aria-label="QR">` +
            `<rect width="${total}" height="${total}" fill="#fff"/><path d="${path}" fill="#000"/></svg>`;
    }

    /* ================= Pantalla "Mostrar al turista" con QR ================= */

    const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g,
        c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

    function routeUrl(l) {
        const mode = l.distancia != null && l.distancia > 2500 ? 'driving' : 'walking';
        return `https://www.google.com/maps/dir/?api=1&destination=${(+l.lat).toFixed(5)},${(+l.lng).toFixed(5)}&travelmode=${mode}`;
    }

    async function tr(text, lang) {
        if (!lang || lang === 'auto' || lang === 'es' || typeof translateText !== 'function') return text;
        try {
            const out = await Promise.race([
                translateText(text, 'es', lang),
                new Promise((_, rej) => setTimeout(() => rej(new Error('tiempo')), 6000))
            ]);
            return out || text;
        } catch (e) { return text; }
    }

    let panel = null;
    function ensurePanel() {
        if (panel) return panel;
        panel = document.createElement('div');
        panel.id = 'qr-panel';
        panel.className = 'qr-panel hidden';
        panel.setAttribute('role', 'dialog');
        panel.setAttribute('aria-label', 'Lugar con código QR');
        panel.addEventListener('click', ev => { if (ev.target === panel) close(); });
        document.body.appendChild(panel);
        document.addEventListener('keydown', ev => { if (ev.key === 'Escape') close(); });
        return panel;
    }
    function close() { if (panel) panel.classList.add('hidden'); }

    async function showPlaceQR(l, lang) {
        const el = ensurePanel();
        const url = routeUrl(l);
        const parsed = parseHours(l.horario);
        const st = hoursStatus(parsed);
        const hasT = lang && lang !== 'auto' && lang !== 'es';

        let svg = '';
        try { svg = qrSvg(url); } catch (e) { svg = ''; }

        // Texto base (español) y traducciones en paralelo
        const baseCaption = 'Escaneá el código con tu celular para ver cómo llegar';
        const baseDist = l.distancia != null && typeof formatDistancia === 'function' ? formatDistancia(l.distancia) : '';
        const baseHorarios = 'Días y horarios';
        const baseCerrado = 'Cerrado';
        const [caption, dist, estado, horariosTit, cerrado] = await Promise.all([
            tr(baseCaption, lang), baseDist ? tr(baseDist, lang) : '',
            st ? tr(st.text, lang) : '', parsed ? tr(baseHorarios, lang) : '', parsed ? tr(baseCerrado, lang) : ''
        ]);

        const waText = `${l.nombre}\n${l.direccion && !/no disponible/i.test(l.direccion) ? l.direccion + '\n' : ''}${url}`;
        const wa = `https://wa.me/?text=${encodeURIComponent(waText)}`;
        const locale = hasT ? lang : 'es';

        el.innerHTML = `
            <div class="qr-box">
                <button type="button" class="qr-cerrar" aria-label="Cerrar">✕</button>
                <h2 class="qr-nombre">${esc(l.nombre)}</h2>
                ${l.direccion && !/no disponible/i.test(l.direccion) ? `<p class="qr-dir">${esc(l.direccion)}</p>` : ''}
                ${dist ? `<p class="qr-dist">📍 ${esc(dist)}</p>` : ''}
                ${st ? `<p class="qr-estado ${st.open ? 'abierto' : 'cerrado'}">${st.open ? '🟢' : '🔴'} ${esc(estado)}</p>` : ''}
                <div class="qr-code">${svg || '<p>No se pudo generar el QR.</p>'}</div>
                <p class="qr-texto">${esc(caption)}</p>
                ${hasT && caption !== baseCaption ? `<p class="qr-texto-es">${esc(baseCaption)}</p>` : ''}
                ${parsed ? `<details class="qr-semana"><summary>🕒 ${esc(horariosTit)}</summary>${weekTableHtml(parsed, locale, esc(cerrado))}</details>` : ''}
                <div class="qr-botones">
                    <a class="qr-btn" href="${wa}" target="_blank" rel="noopener">💬 WhatsApp</a>
                    ${navigator.share ? '<button type="button" class="qr-btn qr-share">↗ Compartir</button>' : ''}
                    <a class="qr-btn" href="${url}" target="_blank" rel="noopener">🧭 Google Maps</a>
                </div>
            </div>`;
        el.querySelector('.qr-cerrar').addEventListener('click', close);
        const sh = el.querySelector('.qr-share');
        if (sh) sh.addEventListener('click', () => {
            navigator.share({ title: l.nombre, text: waText }).catch(() => {});
        });
        el.classList.remove('hidden');
    }

    /* Bloque de horario para la lista de lugares (en español, para quien atiende) */
    function hoursBlockHtml(horario) {
        if (!horario) return '<small class="lugar-horario sin-dato">🕒 Horario no disponible</small>';
        const parsed = parseHours(horario);
        if (!parsed) return `<small class="lugar-horario">🕒 ${esc(horario)}</small>`;
        const st = hoursStatus(parsed);
        return `<div class="lugar-horario-box">
            <span class="estado-horario ${st.open ? 'abierto' : 'cerrado'}">${st.open ? '🟢' : '🔴'} ${esc(st.text)}</span>
            <button type="button" class="btn-semana">Ver días y horarios ▾</button>
            <div class="semana hidden">${weekTableHtml(parsed, 'es', 'Cerrado')}</div>
        </div>`;
    }

    window.HSExtras = { parseHours, hoursStatus, weekRows, qrMatrix, qrSvg, showPlaceQR, hoursBlockHtml, nowSalta, closeQR: close };
})();
