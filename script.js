// script.js

// --- Configuración ---
const CONFIG = {
    translationApi: 'https://api.mymemory.translated.net/get',
    languages: {
        'auto': { source: 'Autodetect', target: 'es', name: 'Detectar automáticamente', speech: null },
        'en':   { source: 'en',    target: 'es', name: 'Inglés',    speech: 'en-US' },
        'pt':   { source: 'pt',    target: 'es', name: 'Portugués', speech: 'pt-BR' },
        'fr':   { source: 'fr',    target: 'es', name: 'Francés',   speech: 'fr-FR' },
        'de':   { source: 'de',    target: 'es', name: 'Alemán',    speech: 'de-DE' },
        'it':   { source: 'it',    target: 'es', name: 'Italiano',  speech: 'it-IT' },
        'zh':   { source: 'zh-CN', target: 'es', name: 'Chino',     speech: 'zh-CN' },
        'ja':   { source: 'ja',    target: 'es', name: 'Japonés',   speech: 'ja-JP' },
        'ru':   { source: 'ru',    target: 'es', name: 'Ruso',      speech: 'ru-RU' },
        'he':   { source: 'he',    target: 'es', name: 'Hebreo',    speech: 'he-IL' }
    }
};

// --- Intenciones con direcciones reales de Salta ---
const INTENTS = [
    // ==== BANCOS (TODOS CON COORDENADAS) ====
    { keywords: ['banco','bank','bancos','sucursal'],
      respuesta_es: 'Tenés bancos en el centro: Banco Nación en Florida 575, BBVA Francés en España 642, Galicia en Balcarce 101, Macro en Mitre 997, ICBC en España 771, Credicoop en España 435. Todos abren de lunes a viernes de 8:30 a 13:30.',
      categoria: { key: 'amenity', value: 'bank' },
      // Coordenadas aproximadas para el mapa
      lugares: [
        { nombre: 'Banco de la Nación', direccion: 'Florida 575', lat: -24.7885, lng: -65.4108 },
        { nombre: 'BBVA Francés', direccion: 'España 642', lat: -24.7880, lng: -65.4115 },
        { nombre: 'Banco Galicia', direccion: 'Balcarce 101', lat: -24.7895, lng: -65.4090 },
        { nombre: 'Banco Macro', direccion: 'Bartolomé Mitre 997', lat: -24.7860, lng: -65.4130 },
        { nombre: 'ICBC', direccion: 'España 771', lat: -24.7870, lng: -65.4120 },
        { nombre: 'Credicoop', direccion: 'España 435', lat: -24.7890, lng: -65.4100 }
      ] },

    // ==== CAJEROS AUTOMÁTICOS ====
    { keywords: ['cajero','atm','efectivo','plata','dinero','cash','money'],
      respuesta_es: 'Tenés cajeros automáticos en el centro: Banco Macro en Alvarado 746, Bartolomé Mitre 997, y un lobby 24 hs en Av. Independencia 910 (Centro Cultural Dino Saluzzi). También en el ingreso del Concejo Deliberante, Av. República del Líbano 990.',
      categoria: { key: 'amenity', value: 'atm' },
      lugares: [
        { nombre: 'Cajero Banco Macro', direccion: 'Alvarado 746', lat: -24.7890, lng: -65.4095 },
        { nombre: 'Cajero Banco Macro', direccion: 'Bartolomé Mitre 997', lat: -24.7860, lng: -65.4130 },
        { nombre: 'Cajero Banco Macro 24hs', direccion: 'Av. Independencia 910', lat: -24.7850, lng: -65.4140 },
        { nombre: 'Cajero Banco Macro', direccion: 'Av. República del Líbano 990', lat: -24.7840, lng: -65.4150 }
      ] },

    // ==== RESTAURANTES (VARIEDAD DE ZONAS) ====
    { keywords: ['restaurante','comer','comida','almorzar','cenar','restaurant','food','eat'],
      respuesta_es: 'Opciones variadas: Doña Salta (empanadas) en Córdoba 46, La Cabrera (parrilla) en Belgrano 354, La Casona del Molino (peña) en Cnel. Luis Burela 1, Trattoria Mamma Mia (pastas) en Pje. Zorrilla 1, El Bodeguero en 20 de Febrero 877, y en Balcarce: La Vieja Estación 875, El Méson 252, Mawi Peña 908.',
      categoria: { key: 'amenity', value: 'restaurant' },
      lugares: [
        { nombre: 'Doña Salta', direccion: 'Córdoba 46', lat: -24.7895, lng: -65.4105 },
        { nombre: 'La Cabrera', direccion: 'Belgrano 354', lat: -24.7900, lng: -65.4080 },
        { nombre: 'La Casona del Molino', direccion: 'Cnel. Luis Burela 1', lat: -24.7920, lng: -65.4070 },
        { nombre: 'Trattoria Mamma Mia', direccion: 'Pje. Zorrilla 1', lat: -24.7880, lng: -65.4110 },
        { nombre: 'El Bodeguero', direccion: '20 de Febrero 877', lat: -24.7910, lng: -65.4090 },
        { nombre: 'La Vieja Estación', direccion: 'Balcarce 875', lat: -24.7930, lng: -65.4060 },
        { nombre: 'El Méson', direccion: 'Balcarce 252', lat: -24.7900, lng: -65.4085 },
        { nombre: 'Mawi Peña', direccion: 'Balcarce 908', lat: -24.7935, lng: -65.4055 }
      ] },

    // ==== HOTELES ====
    { keywords: ['hotel','hostel','hostal','alojamiento','dormir','hospedaje'],
      respuesta_es: 'Hoteles recomendados: Hotel Alejandro I en Balcarce 252, Sheraton Salta en Av. Ejército del Norte 330, Hotel Salta en Buenos Aires 1, Hotel Solar de la Plaza en Leguizamón 669, Hotel Colonial en Zuviría 6.',
      categoria: { key: 'tourism', value: 'hotel' },
      lugares: [
        { nombre: 'Hotel Alejandro I', direccion: 'Balcarce 252', lat: -24.7900, lng: -65.4085 },
        { nombre: 'Sheraton Salta', direccion: 'Av. Ejército del Norte 330', lat: -24.7850, lng: -65.4150 },
        { nombre: 'Hotel Salta', direccion: 'Buenos Aires 1', lat: -24.7890, lng: -65.4095 },
        { nombre: 'Hotel Solar de la Plaza', direccion: 'Leguizamón 669', lat: -24.7870, lng: -65.4115 },
        { nombre: 'Hotel Colonial', direccion: 'Facundo de Zuviría 6', lat: -24.7885, lng: -65.4105 }
      ] },

    // ==== SUPERMERCADOS ====
    { keywords: ['supermercado','super','supermarket','grocery'],
      respuesta_es: 'Supermercados: Super Extra en Moldes 57 (abre todos los días de 9 a 22), Vea en Florida 28, Damesco en Av. Paraguay 1250, Norte en Av. San Martín 2075.',
      categoria: { key: 'shop', value: 'supermarket' },
      lugares: [
        { nombre: 'Super Extra', direccion: 'Moldes 57', lat: -24.7890, lng: -65.4070 },
        { nombre: 'Supermercado Vea', direccion: 'Florida 28', lat: -24.7885, lng: -65.4100 },
        { nombre: 'Supermercado Damesco', direccion: 'Av. Paraguay 1250', lat: -24.7860, lng: -65.4050 },
        { nombre: 'Norte Supermercado', direccion: 'Av. San Martín 2075', lat: -24.7830, lng: -65.4180 }
      ] },

    // ==== FARMACIAS ====
    { keywords: ['farmacia','remedio','medicamento','pharmacy','drugstore'],
      respuesta_es: 'Farmacias en el centro: Farmacity en Alberdi 84 (peatonal), Farmacia del Valle en Entre Ríos 850, Farmacia Monserrat en España 492, Farmacia Sagrada Familia en San Juan 1012, Farmacia San Agustín en Av. San Martín 336.',
      categoria: { key: 'amenity', value: 'pharmacy' },
      lugares: [
        { nombre: 'Farmacity', direccion: 'Alberdi 84', lat: -24.7875, lng: -65.4105 },
        { nombre: 'Farmacia del Valle', direccion: 'Entre Ríos 850', lat: -24.7865, lng: -65.4120 },
        { nombre: 'Farmacia Monserrat', direccion: 'España 492', lat: -24.7890, lng: -65.4100 },
        { nombre: 'Farmacia Sagrada Familia', direccion: 'San Juan 1012', lat: -24.7855, lng: -65.4130 },
        { nombre: 'Farmacia San Agustín', direccion: 'Av. San Martín 336', lat: -24.7880, lng: -65.4090 }
      ] }
];

// --- Estado ---
let isListening = false;
let recognition = null;
let map = null;
let markersLayer = null;

// --- Elementos del DOM ---
const idiomaSelect = document.getElementById('idioma');
const btnHablar = document.getElementById('btn-hablar');
const btnTraducir = document.getElementById('btn-traducir');
const textoEntrada = document.getElementById('texto-entrada');
const statusText = document.getElementById('status-text');
const resultadoDiv = document.getElementById('resultado');
const translationResult = document.getElementById('translation-result');
const btnEscuchar = document.getElementById('btn-escuchar');
const btnCopiar = document.getElementById('btn-copiar');
const intentResponse = document.getElementById('intent-response');
const mapContainer = document.getElementById('map-container');
const placesList = document.getElementById('places-list');

// --- Utilidades ---
function updateStatus(message, isError = false) {
    statusText.textContent = message;
    statusText.style.color = isError ? '#b91c1c' : '#5a4632';
}

function speak(text, langCode) {
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        window.speechSynthesis.speak(utterance);
    }
}

// --- Traducción genérica ---
async function translateText(text, fromLang, toLang) {
    const url = `${CONFIG.translationApi}?q=${encodeURIComponent(text)}&langpair=${fromLang}|${toLang}`;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`Error de red: ${response.status}`);
    const data = await response.json();
    if (!data.responseData || !data.responseData.translatedText) {
        throw new Error('La API no devolvió una traducción válida.');
    }
    return data.responseData.translatedText;
}

// --- Detección de intenciones ---
function detectIntent(text) {
    const lower = text.toLowerCase();
    for (const intent of INTENTS) {
        for (const keyword of intent.keywords) {
            if (lower.includes(keyword)) return intent;
        }
    }
    return null;
}

// --- Mapa ---
function initMap(lat, lng) {
    if (!map) {
        map = L.map('map').setView([lat, lng], 15);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
            maxZoom: 19
        }).addTo(map);
        markersLayer = L.layerGroup().addTo(map);
    } else {
        map.setView([lat, lng], 15);
    }
    setTimeout(() => map.invalidateSize(), 200);
}

async function searchPlaces(lat, lng, categoria) {
    const { key, value } = categoria;
    const radius = 4000;

    const query = `
        [out:json][timeout:25];
        (
            node["${key}"="${value}"](around:${radius},${lat},${lng});
            way["${key}"="${value}"](around:${radius},${lat},${lng});
            relation["${key}"="${value}"](around:${radius},${lat},${lng});
        );
        out center 40;
    `.trim();

    const mirrors = [
        'https://overpass-api.de/api/interpreter',
        'https://overpass.kumi.systems/api/interpreter',
        'https://overpass.private.coffee/api/interpreter'
    ];

    for (const mirror of mirrors) {
        try {
            const response = await fetch(mirror, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: 'data=' + encodeURIComponent(query)
            });
            if (!response.ok) continue;
            const data = await response.json();
            if (data.elements && data.elements.length > 0) return data.elements;
        } catch (error) {
            console.warn('Falló el mirror', mirror, error);
        }
    }
    return [];
}

function showPlacesOnMap(places, lat, lng) {
    markersLayer.clearLayers();
    placesList.innerHTML = '';
    L.marker([lat, lng]).addTo(markersLayer).bindPopup('Estás aquí');

    if (places.length === 0) {
        placesList.innerHTML = '<li>No se encontraron lugares cercanos en el mapa.</li>';
        return;
    }

    const bounds = [[lat, lng]];
    places.forEach(place => {
        const pLat = place.lat || (place.center && place.center.lat);
        const pLng = place.lon || (place.center && place.center.lon);
        if (!pLat || !pLng) return;
        const name = (place.tags && place.tags.name) || 'Sin nombre';
        const address = (place.tags && place.tags['addr:street'])
            ? `${place.tags['addr:street']} ${place.tags['addr:housenumber'] || ''}`.trim()
            : 'Dirección no disponible';
        L.marker([pLat, pLng]).addTo(markersLayer).bindPopup(`<strong>${name}</strong><br>${address}`);
        bounds.push([pLat, pLng]);
        const li = document.createElement('li');
        li.innerHTML = `<strong>${name}</strong><small>${address}</small>`;
        li.addEventListener('click', () => map.setView([pLat, pLng], 17));
        placesList.appendChild(li);
    });
    if (bounds.length > 1) map.fitBounds(bounds, { padding: [30, 30] });
}

// --- Respuesta de intención ---
async function showIntentResponse(intent, userLat, userLng, targetLang) {
    let respuestaTarget;
    const langCfg = CONFIG.languages[targetLang];

    if (targetLang === 'auto') {
        // Sin traducción: mostramos solo español
        respuestaTarget = intent.respuesta_es;
    } else if (intent['respuesta_' + targetLang]) {
        // Tenemos traducción predefinida (en, pt)
        respuestaTarget = intent['respuesta_' + targetLang];
    } else {
        // Traducimos la respuesta al idioma del turista al vuelo
        try {
            respuestaTarget = await translateText(intent.respuesta_es, 'es', langCfg.source);
        } catch (e) {
            console.warn('No se pudo traducir la respuesta:', e);
            respuestaTarget = intent.respuesta_es;
        }
    }

    intentResponse.innerHTML = `
        <p class="intent-es">${intent.respuesta_es}</p>
        <p class="intent-target">${respuestaTarget}</p>
    `;
    intentResponse.classList.remove('hidden');
    resultadoDiv.classList.add('hidden');

    // Leer en voz alta en el idioma del turista
    const speechLang = (langCfg && langCfg.speech) || 'es-ES';
    if (targetLang !== 'auto') speak(respuestaTarget, speechLang);

    mapContainer.classList.remove('hidden');
    if (userLat && userLng && intent.categoria) {
        updateStatus('Buscando lugares cercanos...');
        initMap(userLat, userLng);
        const places = await searchPlaces(userLat, userLng, intent.categoria);
        showPlacesOnMap(places, userLat, userLng);
        updateStatus(`Encontrados: ${places.length} lugares.`);
    } else {
        updateStatus('No se pudo obtener tu ubicación.', true);
    }
}

// --- Reconocimiento de voz ---
function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
        updateStatus('Tu navegador no soporta el reconocimiento de voz. Usá Chrome o Edge.', true);
        btnHablar.disabled = true;
        return;
    }
    recognition = new SpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    recognition.onstart = () => {
        isListening = true;
        btnHablar.classList.add('listening');
        updateStatus('Escuchando...');
    };
    recognition.onend = () => {
        isListening = false;
        btnHablar.classList.remove('listening');
    };
    recognition.onerror = (event) => {
        isListening = false;
        btnHablar.classList.remove('listening');
        let msg = `Error: ${event.error}`;
        if (event.error === 'not-allowed') msg = 'Permiso de micrófono denegado.';
        else if (event.error === 'no-speech') msg = 'No se detectó voz. Intentá de nuevo.';
        updateStatus(msg, true);
    };
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        textoEntrada.value = transcript;
        updateStatus('Texto capturado. Presioná "Traducir ahora".');
    };
}

// --- Flujo principal de traducción ---
async function handleTranslate() {
    const text = textoEntrada.value.trim();
    if (!text) {
        updateStatus('Escribí o dictá algo primero.', true);
        return;
    }

    const langCode = idiomaSelect.value;
    const lang = CONFIG.languages[langCode];

    updateStatus('Traduciendo...');
    resultadoDiv.classList.add('hidden');
    intentResponse.classList.add('hidden');
    mapContainer.classList.add('hidden');

    let textoEs;
    try {
        textoEs = await translateText(text, lang.source, 'es');
    } catch (error) {
        console.error('Error en la traducción:', error);
        updateStatus(`Error: ${error.message}`, true);
        return;
    }

    // ¿La frase en español corresponde a una intención conocida?
    const intent = detectIntent(textoEs);

    if (intent) {
        if (navigator.geolocation) {
            updateStatus('Obteniendo ubicación...');
            navigator.geolocation.getCurrentPosition(
                (pos) => showIntentResponse(intent, pos.coords.latitude, pos.coords.longitude, langCode),
                (err) => {
                    console.error('Geolocalización:', err);
                    updateStatus('No se pudo obtener ubicación. Mostrando respuesta general.', true);
                    showIntentResponse(intent, null, null, langCode);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            showIntentResponse(intent, null, null, langCode);
        }
    } else {
        // Traducción normal
        translationResult.textContent = textoEs;
        resultadoDiv.classList.remove('hidden');
        updateStatus('Traducción completada.');
    }
}

// --- Event Listeners ---
btnHablar.addEventListener('click', () => {
    if (!recognition) return;
    if (isListening) {
        recognition.stop();
    } else {
        const langCode = idiomaSelect.value;
        const cfg = CONFIG.languages[langCode];
        // Si es "auto" o no hay speech definido, usamos el idioma del navegador
        recognition.lang = (cfg && cfg.speech) || navigator.language || 'en-US';
        recognition.start();
    }
});

btnTraducir.addEventListener('click', handleTranslate);

btnEscuchar.addEventListener('click', () => {
    const texto = translationResult.textContent;
    if (texto) speak(texto, 'es-ES');
});

btnCopiar.addEventListener('click', () => {
    const texto = translationResult.textContent;
    if (texto) {
        navigator.clipboard.writeText(texto).then(() => {
            updateStatus('Copiado al portapapeles.');
            setTimeout(() => updateStatus('Presioná "Hablar" para dictar.'), 2000);
        });
    }
});

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    setupSpeechRecognition();
    updateStatus('Presioná "Hablar" para dictar.');
});
