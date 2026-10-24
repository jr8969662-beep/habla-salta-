// Service worker de Hablá Salta: permite usar la app sin internet.
const VERSION = 'v1';
const APP_CACHE = `hs-app-${VERSION}`;
const TILE_CACHE = 'hs-tiles';
const DATA_CACHE = 'hs-data';

const APP_FILES = [
    './', './index.html', './styles.css', './script.js', './offline.js',
    './manifest.json', './salta-fondo.jpg', './icon-192.png', './icon-512.png',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.css',
    'https://unpkg.com/leaflet@1.9.4/dist/leaflet.js',
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png',
    'https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png'
];

self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(APP_CACHE)
            .then(c => Promise.allSettled(APP_FILES.map(u => c.add(u))))
            .then(() => self.skipWaiting())
    );
});

self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys()
            .then(keys => Promise.all(keys
                .filter(k => k.startsWith('hs-app-') && k !== APP_CACHE)
                .map(k => caches.delete(k))))
            .then(() => self.clients.claim())
    );
});

function isTile(url) {
    return /basemaps\.cartocdn\.com|tile\.openstreetmap\.org/.test(url.hostname);
}

self.addEventListener('fetch', event => {
    const req = event.request;
    if (req.method !== 'GET') return;
    const url = new URL(req.url);

    // Mosaicos del mapa: primero lo guardado, si no, internet (y se guarda)
    if (isTile(url)) {
        event.respondWith((async () => {
            const cache = await caches.open(TILE_CACHE);
            const hit = await cache.match(req.url);
            if (hit) return hit;
            try {
                const res = await fetch(req);
                if (res.ok) cache.put(req.url, res.clone());
                return res;
            } catch (e) {
                return new Response('', { status: 504 });
            }
        })());
        return;
    }

    // Archivos de la app: internet primero (para recibir actualizaciones), si falla, lo guardado
    const isApp = url.origin === self.location.origin || url.hostname === 'unpkg.com';
    if (isApp) {
        event.respondWith((async () => {
            try {
                const res = await fetch(req);
                if (res.ok) {
                    const cache = await caches.open(APP_CACHE);
                    cache.put(req, res.clone());
                }
                return res;
            } catch (e) {
                const hit = await caches.match(req, { ignoreSearch: true });
                if (hit) return hit;
                if (req.mode === 'navigate') return caches.match('./index.html');
                return new Response('', { status: 504 });
            }
        })());
    }
});
