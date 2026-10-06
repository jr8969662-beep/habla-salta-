// script.js

// --- Configuración ---
const CONFIG = {
    translationApi: 'https://api.mymemory.translated.net/get',
    languages: {
        'en': { source: 'en', target: 'es', name: 'Inglés a Español' },
        'pt': { source: 'pt', target: 'es', name: 'Portugués a Español' }
    }
};

// --- Intenciones ---
const INTENTS = [
    { keywords: ['saeta','tarjeta','cargar','colectivo','bus','recarga'],
      respuesta_es: 'Podés cargar la tarjeta SAETA en kioscos, farmacias y terminal.',
      respuesta_en: 'You can top up the SAETA card at kiosks, pharmacies, and the terminal.',
      respuesta_pt: 'Você pode recarregar o cartão SAETA em quiosques, farmácias e terminal.',
      categoria: { key: 'amenity', value: 'payment_centre' } },
    { keywords: ['cajero','atm','efectivo','plata','dinero'],
      respuesta_es: 'Tenés cajeros automáticos en bancos del centro.',
      respuesta_en: 'There are ATMs in downtown banks.',
      respuesta_pt: 'Há caixas eletrônicos em bancos do centro.',
      categoria: { key: 'amenity', value: 'atm' } },
    { keywords: ['dólar','cambio','exchange','currency','divisa'],
      respuesta_es: 'Hay casas de cambio en la calle Caseros y Plaza 9 de Julio.',
      respuesta_en: 'There are currency exchange offices on Caseros Street and Plaza 9 de Julio.',
      respuesta_pt: 'Há casas de câmbio na rua Caseros e Plaza 9 de Julio.',
      categoria: { key: 'amenity', value: 'bureau_de_change' } },
    { keywords: ['farmacia','remedio','medicamento','pharmacy'],
      respuesta_es: 'Tenés farmacias en el centro, como Farmacity y Farmacia del Valle.',
      respuesta_en: 'There are pharmacies downtown, such as Farmacity and Farmacia del Valle.',
      respuesta_pt: 'Há farmácias no centro, como Farmacity e Farmacia del Valle.',
      categoria: { key: 'amenity', value: 'pharmacy' } },
    { keywords: ['hospital','clínica','emergencia','médico','doctor'],
      respuesta_es: 'El Hospital San Bernardo y el Materno Infantil son los principales.',
      respuesta_en: 'Hospital San Bernardo and Materno Infantil are the main ones.',
      respuesta_pt: 'O Hospital San Bernardo e o Materno Infantil são os principais.',
      categoria: { key: 'amenity', value: 'hospital' } },
    { keywords: ['supermercado','super','vea','carrefour','día','coto'],
      respuesta_es: 'Tenés Carrefour, Vea, Día y Coto en el centro y shoppings.',
      respuesta_en: 'There are Carrefour, Vea, Día, and Coto downtown and in malls.',
      respuesta_pt: 'Há Carrefour, Vea, Día e Coto no centro e shoppings.',
      categoria: { key: 'shop', value: 'supermarket' } },
    { keywords: ['heladería','helado','ice cream','gelato'],
      respuesta_es: 'Las mejores heladerías: Gianni Helados, Volta y Heladería del Bosque.',
      respuesta_en: 'The best ice cream shops: Gianni Helados, Volta, and Heladería del Bosque.',
      respuesta_pt: 'As melhores sorveterias: Gianni Helados, Volta e Heladería del Bosque.',
      categoria: { key: 'amenity', value: 'ice_cream' } },
    { keywords: ['museo','maam','museum','cultura'],
      respuesta_es: 'No te pierdas el MAAM, el Museo Histórico del Norte y el Museo Güemes.',
      respuesta_en: 'Don\'t miss the MAAM, the Museo Histórico del Norte, and the Museo Güemes.',
      respuesta_pt: 'Não perca o MAAM, o Museo Histórico del Norte e o Museo Güemes.',
      categoria: { key: 'tourism', value: 'museum' } },
    { keywords: ['restaurante','comer','comida','almorzar','cenar'],
      respuesta_es: 'Hay restaurantes en la calle Balcarce y en la zona de la Plaza.',
      respuesta_en: 'There are restaurants on Balcarce Street and around the Plaza.',
      respuesta_pt: 'Há restaurantes na rua Balcarce e na região da Plaza.',
      categoria: { key: 'amenity', value: 'restaurant' } },
    { keywords: ['baño','toilet','sanitario','wc'],
      respuesta_es: 'Hay baños públicos en la Plaza 9 de Julio y en la terminal.',
      respuesta_en: 'There are public toilets at Plaza 9 de Julio and the bus terminal.',
      respuesta_pt: 'Há banheiros públicos na Plaza 9 de Julio e na terminal.',
      categoria: { key: 'amenity', value: 'toilets' } }
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

// --- Traducción ---
async function translateText() {
    const text = textoEntrada.value.trim();
    if (!text) {
        updateStatus('Escribí o dictá algo primero.', true);
        return;
    }

    const langCode = idiomaSelect.value;
    const lang = CONFIG.languages[langCode];
    const url = `${CONFIG.translationApi}?q=${encodeURIComponent(text)}&langpair=${lang.source}|${lang.target}`;
    
    updateStatus('Traduciendo...');
    resultadoDiv.classList.add('hidden');
    intentResponse.classList.add('hidden');
    mapContainer.classList.add('hidden');

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error de red: ${response.status}`);
        const data = await response.json();
        
        if (data.responseData && data.responseData.translatedText) {
            translationResult.textContent = data.responseData.translatedText;
            resultadoDiv.classList.remove('hidden');
            updateStatus('Traducción completada.');
        } else {
            throw new Error('La API no devolvió una traducción válida.');
        }
    } catch (error) {
        console.error('Error en la traducción:', error);
        updateStatus(`Error: ${error.message}`, true);
    }
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
    const radius = 1500;
    const query = `[out:json][timeout:20];(node["${key}"="${value}"](around:${radius},${lat},${lng});way["${key}"="${value}"](around:${radius},${lat},${lng});relation["${key}"="${value}"](around:${radius},${lat},${lng}););out center 30;`;
    const url = `https://overpass-api.de/api/interpreter?data=${encodeURIComponent(query)}`;
    try {
        const response = await fetch(url);
        const data = await response.json();
        return data.elements || [];
    } catch (error) {
        console.error('Error buscando lugares:', error);
        return [];
    }
}

function showPlacesOnMap(places, lat, lng) {
    markersLayer.clearLayers();
    placesList.innerHTML = '';
    L.marker([lat, lng]).addTo(markersLayer).bindPopup('Estás aquí');

    if (places.length === 0) {
        placesList.innerHTML = '<li>No se encontraron lugares cercanos.</li>';
        return;
    }

    const bounds = [[lat, lng]];
    places.forEach(place => {
        const pLat = place.lat || (place.center && place.center.lat);
        const pLng = place.lon || (place.center && place.center.lon);
        if (!pLat || !pLng) return;
        const name = (place.tags && place.tags.name) || 'Sin nombre';
        const address = (place.tags && place.tags['addr:street']) ? `${place.tags['addr:street']} ${place.tags['addr:housenumber'] || ''}` : 'Dirección no disponible';
        L.marker([pLat, pLng]).addTo(markersLayer).bindPopup(`<strong>${name}</strong><br>${address}`);
        bounds.push([pLat, pLng]);
        const li = document.createElement('li');
        li.innerHTML = `<strong>${name}</strong><small>${address}</small>`;
        li.addEventListener('click', () => map.setView([pLat, pLng], 17));
        placesList.appendChild(li);
    });
    if (bounds.length > 1) map.fitBounds(bounds, { padding: [30, 30] });
}

// --- Mostrar respuesta de intención ---
async function showIntentResponse(intent, userLat, userLng) {
    const targetLang = idiomaSelect.value;
    const respuestaTarget = intent['respuesta_' + targetLang];

    intentResponse.innerHTML = `
        <p class="intent-es">${intent.respuesta_es}</p>
        <p class="intent-target">${respuestaTarget}</p>
    `;
    intentResponse.classList.remove('hidden');
    resultadoDiv.classList.add('hidden');
    speak(respuestaTarget, targetLang === 'en' ? 'en-US' : 'pt-BR');

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

// --- Event Listeners ---
btnHablar.addEventListener('click', () => {
    if (!recognition) return;
    if (isListening) recognition.stop();
    else {
        recognition.lang = idiomaSelect.value === 'en' ? 'en-US' : 'pt-BR';
        recognition.start();
    }
});

btnTraducir.addEventListener('click', () => {
    const text = textoEntrada.value.trim();
    const intent = detectIntent(text);
    if (intent) {
        if (navigator.geolocation) {
            updateStatus('Obteniendo ubicación...');
            navigator.geolocation.getCurrentPosition(
                (pos) => showIntentResponse(intent, pos.coords.latitude, pos.coords.longitude),
                (err) => {
                    console.error('Geolocalización:', err);
                    updateStatus('No se pudo obtener ubicación. Mostrando respuesta general.', true);
                    showIntentResponse(intent, null, null);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            showIntentResponse(intent, null, null);
        }
    } else {
        translateText();
    }
});

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
