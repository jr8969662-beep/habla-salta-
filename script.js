// script.js

// --- Configuración ---
const CONFIG = {
    translationApi: 'https://api.mymemory.translated.net/get',
    languages: {
        'es-EN': { source: 'es', target: 'en', name: 'Español a Inglés' },
        'es-PT': { source: 'es', target: 'pt', name: 'Español a Portugués' }
    }
};

// --- Definición de intenciones ---
const INTENTS = [
    // ===== SERVICIOS BÁSICOS =====
    { keywords: ['saeta','tarjeta','cargar','sube','colectivo','bondi','bus','recarga'],
      respuesta_es: 'Podés cargar la tarjeta SAETA en kioscos, farmacias, terminal de ómnibus y centros de recarga oficiales.',
      respuesta_en: 'You can top up the SAETA card at kiosks, pharmacies, the bus terminal, and official recharge centers.',
      respuesta_pt: 'Você pode recarregar o cartão SAETA em quiosques, farmácias, terminal de ônibus e centros de recarga oficiais.',
      categoria: { key: 'amenity', value: 'payment_centre' } },
    { keywords: ['cajero','atm','extraer','efectivo','plata','dinero','cash'],
      respuesta_es: 'Tenés cajeros automáticos en bancos del centro. Buscá el logo de tu red.',
      respuesta_en: 'There are ATMs in downtown banks. Look for your network logo.',
      respuesta_pt: 'Há caixas eletrônicos em bancos do centro. Procure o logo da sua rede.',
      categoria: { key: 'amenity', value: 'atm' } },
    { keywords: ['dólar','dolar','cambio','exchange','currency','divisa','cambiar'],
      respuesta_es: 'Hay casas de cambio en la calle Caseros y en la zona de la Plaza 9 de Julio.',
      respuesta_en: 'There are currency exchange offices on Caseros Street and around Plaza 9 de Julio.',
      respuesta_pt: 'Há casas de câmbio na rua Caseros e na região da Plaza 9 de Julio.',
      categoria: { key: 'amenity', value: 'bureau_de_change' } },
    { keywords: ['wifi','internet','conexión','conexion','red'],
      respuesta_es: 'Hay WiFi gratis en la Plaza 9 de Julio, en bares del centro y en la terminal.',
      respuesta_en: 'There is free WiFi at Plaza 9 de Julio, in downtown bars, and at the bus terminal.',
      respuesta_pt: 'Tem WiFi grátis na Plaza 9 de Julio, em bares do centro e na terminal.',
      categoria: { key: 'amenity', value: 'wifi' } },
    { keywords: ['taxi','remis','uber','cabify','transporte'],
      respuesta_es: 'Podés pedir un taxi por teléfono o en las paradas del centro.',
      respuesta_en: 'You can order a taxi by phone or at downtown stops.',
      respuesta_pt: 'Você pode pedir um táxi por telefone ou nas paradas do centro.',
      categoria: { key: 'amenity', value: 'taxi' } },
    { keywords: ['baño','baños','toilet','toilets','sanitario','servicio','wc'],
      respuesta_es: 'Hay baños públicos en la Plaza 9 de Julio, en la terminal y en los shoppings.',
      respuesta_en: 'There are public toilets at Plaza 9 de Julio, the bus terminal, and malls.',
      respuesta_pt: 'Há banheiros públicos na Plaza 9 de Julio, na terminal e nos shoppings.',
      categoria: { key: 'amenity', value: 'toilets' } },
    // ===== SALUD =====
    { keywords: ['farmacia','farmacias','remedio','medicamento','pharmacy'],
      respuesta_es: 'Tenés farmacias en el centro, como Farmacity y Farmacia del Valle.',
      respuesta_en: 'There are pharmacies downtown, such as Farmacity and Farmacia del Valle.',
      respuesta_pt: 'Há farmácias no centro, como Farmacity e Farmacia del Valle.',
      categoria: { key: 'amenity', value: 'pharmacy' } },
    { keywords: ['hospital','clínica','clinica','emergencia','médico','medico','doctor','sanatorio'],
      respuesta_es: 'El Hospital San Bernardo y el Materno Infantil son los principales. Emergencias: 107.',
      respuesta_en: 'Hospital San Bernardo and Materno Infantil are the main ones. Emergencies: 107.',
      respuesta_pt: 'O Hospital San Bernardo e o Materno Infantil são os principais. Emergências: 107.',
      categoria: { key: 'amenity', value: 'hospital' } },
    // ===== COMPRAS =====
    { keywords: ['supermercado','super','vea','carrefour','día','dia','coto','jumbo','changomas','supermarket'],
      respuesta_es: 'Tenés Carrefour, Vea, Día y Coto en el centro y en los shoppings.',
      respuesta_en: 'There are Carrefour, Vea, Día, and Coto downtown and in malls.',
      respuesta_pt: 'Há Carrefour, Vea, Día e Coto no centro e nos shoppings.',
      categoria: { key: 'shop', value: 'supermarket' } },
    { keywords: ['heladería','heladeria','helado','ice cream','gelato'],
      respuesta_es: 'Las mejores heladerías: Gianni Helados, Volta y Heladería del Bosque.',
      respuesta_en: 'The best ice cream shops: Gianni Helados, Volta, and Heladería del Bosque.',
      respuesta_pt: 'As melhores sorveterias: Gianni Helados, Volta e Heladería del Bosque.',
      categoria: { key: 'amenity', value: 'ice_cream' } },
    // ===== TURISMO =====
    { keywords: ['museo','museos','maam','museum','cultura','historia'],
      respuesta_es: 'No te pierdas el MAAM, el Museo Histórico del Norte y el Museo Güemes.',
      respuesta_en: 'Don\'t miss the MAAM, the Museo Histórico del Norte, and the Museo Güemes.',
      respuesta_pt: 'Não perca o MAAM, o Museo Histórico del Norte e o Museo Güemes.',
      categoria: { key: 'tourism', value: 'museum' } },
    { keywords: ['plaza','square','plaza 9 de julio'],
      respuesta_es: 'La Plaza 9 de Julio es el corazón de Salta. Ahí está la Catedral y el Cabildo.',
      respuesta_en: 'Plaza 9 de Julio is the heart of Salta. The Cathedral and Cabildo are there.',
      respuesta_pt: 'A Plaza 9 de Julio é o coração de Salta. A Catedral e o Cabildo ficam lá.',
      categoria: { key: 'tourism', value: 'attraction' } },
    { keywords: ['cerro','san bernardo','teleférico','teleferico','mirador','vista'],
      respuesta_es: 'El Cerro San Bernardo tiene la mejor vista. Podés subir en teleférico.',
      respuesta_en: 'Cerro San Bernardo has the best view. You can go up by cable car.',
      respuesta_pt: 'O Cerro San Bernardo tem a melhor vista. Você pode subir de teleférico.',
      categoria: { key: 'tourism', value: 'attraction' } },
    { keywords: ['iglesia','catedral','templo','church','religious'],
      respuesta_es: 'La Catedral Basílica está en la Plaza 9 de Julio. También visitá San Francisco.',
      respuesta_en: 'The Cathedral Basilica is at Plaza 9 de Julio. Also visit San Francisco.',
      respuesta_pt: 'A Catedral Basílica fica na Plaza 9 de Julio. Visite também San Francisco.',
      categoria: { key: 'amenity', value: 'place_of_worship' } },
    { keywords: ['restaurante','comer','comida','almorzar','cenar','restaurant','food'],
      respuesta_es: 'Hay restaurantes en la calle Balcarce y en la zona de la Plaza.',
      respuesta_en: 'There are restaurants on Balcarce Street and around the Plaza.',
      respuesta_pt: 'Há restaurantes na rua Balcarce e na região da Plaza.',
      categoria: { key: 'amenity', value: 'restaurant' } },
    { keywords: ['bar','peña','pena','folclore','música','musica','nocturna','noche'],
      respuesta_es: 'La calle Balcarce es el epicentro de las peñas y bares con música en vivo.',
      respuesta_en: 'Balcarce Street is the epicenter of peñas and bars with live music.',
      respuesta_pt: 'A rua Balcarce é o epicentro das peñas e bares com música ao vivo.',
      categoria: { key: 'amenity', value: 'bar' } },
    { keywords: ['café','cafe','cafetería','cafeteria','desayuno','merienda'],
      respuesta_es: 'Hay cafés en el centro, como Café del Tiempo y Café Martínez.',
      respuesta_en: 'There are cafes downtown, such as Café del Tiempo and Café Martínez.',
      respuesta_pt: 'Há cafés no centro, como Café del Tiempo e Café Martínez.',
      categoria: { key: 'amenity', value: 'cafe' } },
    { keywords: ['banco','bancos','bank','santander','galicia','macro'],
      respuesta_es: 'Hay bancos en el centro, como Banco Macro, Santander y Galicia.',
      respuesta_en: 'There are banks downtown, such as Banco Macro, Santander, and Galicia.',
      respuesta_pt: 'Há bancos no centro, como Banco Macro, Santander e Galicia.',
      categoria: { key: 'amenity', value: 'bank' } },
    { keywords: ['policía','policia','comisaría','comisaria','seguridad','emergencia'],
      respuesta_es: 'Para emergencias, llamá al 911. Hay comisarías en el centro y en los barrios.',
      respuesta_en: 'For emergencies, call 911. There are police stations downtown and in neighborhoods.',
      respuesta_pt: 'Para emergências, ligue 911. Há delegacias no centro e nos bairros.',
      categoria: { key: 'amenity', value: 'police' } },
    { keywords: ['gasolina','combustible','nafta','ypf','shell','axion','fuel'],
      respuesta_es: 'Hay estaciones YPF, Shell y Axion en las principales avenidas.',
      respuesta_en: 'There are YPF, Shell, and Axion gas stations on the main avenues.',
      respuesta_pt: 'Há postos YPF, Shell e Axion nas principais avenidas.',
      categoria: { key: 'amenity', value: 'fuel' } },
    { keywords: ['estacionamiento','parking','aparcar','garage'],
      respuesta_es: 'Hay estacionamientos en el centro y en los shoppings.',
      respuesta_en: 'There are parking lots downtown and in shopping malls.',
      respuesta_pt: 'Há estacionamentos no centro e nos shoppings.',
      categoria: { key: 'amenity', value: 'parking' } },
    { keywords: ['correo','correo argentino','post office'],
      respuesta_es: 'El Correo Argentino está en el centro, cerca de la Plaza 9 de Julio.',
      respuesta_en: 'The Correo Argentino is downtown, near Plaza 9 de Julio.',
      respuesta_pt: 'O Correio Argentino fica no centro, perto da Plaza 9 de Julio.',
      categoria: { key: 'amenity', value: 'post_office' } }
];

// --- Estado ---
let currentLanguageKey = 'es-EN';
let isListening = false;
let recognition = null;
let map = null;
let markersLayer = null;

// --- Elementos del DOM ---
const btnHablar = document.getElementById('btn-hablar');
const translationResult = document.getElementById('translation-result');
const statusText = document.getElementById('status-text');
const errorMessage = document.getElementById('error-message');
const langButtons = document.querySelectorAll('.lang-btn');
const intentResponse = document.getElementById('intent-response');
const mapContainer = document.getElementById('map-container');
const placesList = document.getElementById('places-list');

// --- Utilidades ---
function updateStatus(message, isError = false) {
    statusText.textContent = message;
    if (isError) {
        errorMessage.textContent = message;
        errorMessage.classList.remove('hidden');
    } else {
        errorMessage.classList.add('hidden');
    }
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
async function translateText(text) {
    if (!text.trim()) {
        updateStatus('No se reconoció ninguna palabra.', true);
        return;
    }
    const lang = CONFIG.languages[currentLanguageKey];
    const url = `${CONFIG.translationApi}?q=${encodeURIComponent(text)}&langpair=${lang.source}|${lang.target}`;
    updateStatus('Traduciendo...');
    translationResult.textContent = '';
    intentResponse.classList.add('hidden');
    mapContainer.classList.add('hidden');

    try {
        const response = await fetch(url);
        if (!response.ok) throw new Error(`Error de red: ${response.status}`);
        const data = await response.json();
        if (data.responseData && data.responseData.translatedText) {
            const translatedText = data.responseData.translatedText;
            translationResult.textContent = translatedText;
            updateStatus('Traducción completada.');
            speak(translatedText, lang.target);
        } else {
            throw new Error('La API no devolvió una traducción válida.');
        }
    } catch (error) {
        console.error('Error en la traducción:', error);
        updateStatus(`Error al traducir: ${error.message}`, true);
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
    // Si el contenedor recién se mostró, esperamos un instante para que el navegador calcule el tamaño
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
    // Forzar a Leaflet a recalcular el tamaño (soluciona el problema del contenedor oculto)
    setTimeout(() => map.invalidateSize(), 200);
}

async function searchPlaces(lat, lng, categoria) {
    const { key, value } = categoria;
    const radius = 1500; // 1.5 km

    const query = `
        [out:json][timeout:20];
        (
          node["${key}"="${value}"](around:${radius},${lat},${lng});
          way["${key}"="${value}"](around:${radius},${lat},${lng});
          relation["${key}"="${value}"](around:${radius},${lat},${lng});
        );
        out center 30;
    `;
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

    // Marcador de ubicación del usuario
    L.marker([lat, lng]).addTo(markersLayer).bindPopup('Estás aquí');

    if (places.length === 0) {
        placesList.innerHTML = '<li>No se encontraron lugares cercanos en 1.5 km.</li>';
        return;
    }

    const bounds = [[lat, lng]];

    places.forEach(place => {
        const pLat = place.lat || (place.center && place.center.lat);
        const pLng = place.lon || (place.center && place.center.lon);
        if (!pLat || !pLng) return;

        const name = (place.tags && place.tags.name) || 'Sin nombre';
        const address = (place.tags && place.tags['addr:street'])
            ? `${place.tags['addr:street']} ${place.tags['addr:housenumber'] || ''}`
            : 'Dirección no disponible';

        L.marker([pLat, pLng])
            .addTo(markersLayer)
            .bindPopup(`<strong>${name}</strong><br>${address}`);

        bounds.push([pLat, pLng]);

        const li = document.createElement('li');
        li.innerHTML = `<strong>${name}</strong><small>${address}</small>`;
        li.addEventListener('click', () => {
            map.setView([pLat, pLng], 17);
        });
        placesList.appendChild(li);
    });

    // Ajustar el mapa para que se vean todos los marcadores
    if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [30, 30] });
    }
}

// --- Respuesta + Mapa ---
async function showIntentResponse(intent, userLat, userLng) {
    const lang = CONFIG.languages[currentLanguageKey];
    const targetLang = lang.target;
    const respuestaEs = intent.respuesta_es;
    const respuestaTarget = intent['respuesta_' + targetLang];

    intentResponse.innerHTML = `
        <p class="intent-es">${respuestaEs}</p>
        <p class="intent-target">${respuestaTarget}</p>
    `;
    intentResponse.classList.remove('hidden');
    speak(respuestaTarget, targetLang);

    // Mostrar el contenedor del mapa ANTES de inicializarlo
    mapContainer.classList.remove('hidden');

    if (userLat && userLng && intent.categoria) {
        updateStatus('Buscando lugares cercanos...');
        initMap(userLat, userLng);
        const places = await searchPlaces(userLat, userLng, intent.categoria);
        showPlacesOnMap(places, userLat, userLng);
        updateStatus(`Encontrados: ${places.length} lugares.`);
    } else if (!userLat || !userLng) {
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
        console.log('Texto reconocido:', transcript);
        const intent = detectIntent(transcript);
        if (intent) {
            if (navigator.geolocation) {
                updateStatus('Obteniendo tu ubicación...');
                navigator.geolocation.getCurrentPosition(
                    (pos) => showIntentResponse(intent, pos.coords.latitude, pos.coords.longitude),
                    (err) => {
                        console.error('Geolocalización:', err);
                        updateStatus('No se pudo obtener tu ubicación. Mostrando respuesta general.', true);
                        showIntentResponse(intent, null, null);
                    },
                    { enableHighAccuracy: true, timeout: 10000 }
                );
            } else {
                showIntentResponse(intent, null, null);
            }
        } else {
            translateText(transcript);
        }
    };
}

// --- Inicialización ---
function init() {
    setupSpeechRecognition();
    updateStatus('Presioná el botón para hablar');
}

document.addEventListener('DOMContentLoaded', init);
