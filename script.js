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
      respuesta_es: 'Podés cargar la tarjeta SAETA en los Centros de Atención al Usuario de Pellegrini 824 o en el Paseo Salta (ex Hiper Libertad), local 2020, 1er piso. También hay cajeros de recarga en San Martín y Buenos Aires, y en la peatonal Florida entre San Martín y Urquiza, disponibles 24 hs. En Casa de Gobierno y Centro Cívico Municipal también podés adquirir y recargar.',
      respuesta_en: 'You can top up the SAETA card at the Customer Service Centers at Pellegrini 824 or Paseo Salta (ex Hiper Libertad), unit 2020, 1st floor. There are also top-up machines at San Martín & Buenos Aires, and on Florida pedestrian street between San Martín and Urquiza, available 24/7. You can also get and top up cards at Casa de Gobierno and Centro Cívico Municipal.',
      respuesta_pt: 'Você pode recarregar o cartão SAETA nos Centros de Atendimento ao Usuário na Pellegrini 824 ou no Paseo Salta (ex Hiper Libertad), loja 2020, 1º andar. Também há caixas de recarga em San Martín e Buenos Aires, e na rua de pedestres Florida entre San Martín e Urquiza, disponíveis 24h. Também pode adquirir e recarregar na Casa de Gobierno e no Centro Cívico Municipal.',
      categoria: { key: 'amenity', value: 'payment_centre' } },

    { keywords: ['cajero','atm','efectivo','plata','dinero'],
      respuesta_es: 'Tenés cajeros automáticos en el centro: Banco Macro en Alvarado 746, Bartolomé Mitre 997, y un lobby 24 hs en Av. Independencia 910 (Centro Cultural Dino Saluzzi). También en el ingreso del Concejo Deliberante, Av. República del Líbano 990.',
      respuesta_en: 'There are ATMs downtown: Banco Macro at Alvarado 746, Bartolomé Mitre 997, and a 24-hour lobby at Av. Independencia 910 (Dino Saluzzi Cultural Center). Also at the entrance of the City Council, Av. República del Líbano 990.',
      respuesta_pt: 'Há caixas eletrônicos no centro: Banco Macro na Alvarado 746, Bartolomé Mitre 997, e um lobby 24h na Av. Independencia 910 (Centro Cultural Dino Saluzzi). Também na entrada do Conselho Deliberativo, Av. República del Líbano 990.',
      categoria: { key: 'amenity', value: 'atm' } },

    { keywords: ['dólar','cambio','exchange','currency','divisa'],
      respuesta_es: 'Hay casas de cambio en el centro: en la calle Caseros (varias agencias), en España 604, y cerca de la Plaza 9 de Julio. Western Union en Caseros 1602. Los bancos de la zona también ofrecen cambio.',
      respuesta_en: 'There are currency exchange offices downtown: on Caseros Street (several agencies), at España 604, and near Plaza 9 de Julio. Western Union at Caseros 1602. Local banks also offer exchange services.',
      respuesta_pt: 'Há casas de câmbio no centro: na rua Caseros (várias agências), na España 604, e perto da Plaza 9 de Julio. Western Union na Caseros 1602. Os bancos da região também oferecem câmbio.',
      categoria: { key: 'amenity', value: 'bureau_de_change' } },

    { keywords: ['farmacia','remedio','medicamento','pharmacy'],
      respuesta_es: 'Tenés farmacias en el centro: Farmacity en Alberdi 84 (peatonal), Farmacia del Valle en Entre Ríos 850 y Alvarado, Farmacia Monserrat en España 492 y Urquiza 430. Muchas abren todos los días.',
      respuesta_en: 'There are pharmacies downtown: Farmacity at Alberdi 84 (pedestrian street), Farmacia del Valle at Entre Ríos 850 and Alvarado, Farmacia Monserrat at España 492 and Urquiza 430. Many are open every day.',
      respuesta_pt: 'Há farmácias no centro: Farmacity na Alberdi 84 (rua de pedestres), Farmacia del Valle na Entre Ríos 850 e Alvarado, Farmacia Monserrat na España 492 e Urquiza 430. Muitas abrem todos os dias.',
      categoria: { key: 'amenity', value: 'pharmacy' } },

    { keywords: ['hospital','clínica','emergencia','médico','doctor'],
      respuesta_es: 'El Hospital San Bernardo está en Av. José Tobías 69 (y Mariano Boedo 91). El Hospital Materno Infantil está en Av. Sarmiento 1301. Para emergencias, llamá al 911 o al 107 (SAME).',
      respuesta_en: 'Hospital San Bernardo is at Av. José Tobías 69 (and Mariano Boedo 91). Hospital Materno Infantil is at Av. Sarmiento 1301. For emergencies, call 911 or 107 (SAME).',
      respuesta_pt: 'O Hospital San Bernardo fica na Av. José Tobías 69 (e Mariano Boedo 91). O Hospital Materno Infantil fica na Av. Sarmiento 1301. Para emergências, ligue 911 ou 107 (SAME).',
      categoria: { key: 'amenity', value: 'hospital' } },

    { keywords: ['supermercado','super','vea','carrefour','día','coto'],
      respuesta_es: 'Tenés Super Extra en Moldes 57 (frente a Plaza Alvarado, abre todos los días de 9 a 22). Supermercado Vea en Florida 28. Carrefour y otros en el centro y shoppings. Supermercado Damesco en Av. Paraguay 1250.',
      respuesta_en: 'There\'s Super Extra at Moldes 57 (across from Plaza Alvarado, open every day from 9 AM to 10 PM). Vea supermarket at Florida 28. Carrefour and others downtown and in malls. Damesco supermarket at Av. Paraguay 1250.',
      respuesta_pt: 'Há Super Extra na Moldes 57 (em frente à Plaza Alvarado, aberto todos os dias das 9h às 22h). Supermercado Vea na Florida 28. Carrefour e outros no centro e shoppings. Supermercado Damesco na Av. Paraguay 1250.',
      categoria: { key: 'shop', value: 'supermarket' } },

    { keywords: ['heladería','helado','ice cream','gelato'],
      respuesta_es: 'Las mejores heladerías del centro: Heladería Yusepin en Av. San Martín 118, Gianni Helados en Av. Hipólito Yrigoyen 195, Heladería del Bosque en Av. del Bicentenario 1780, y Helados Tangelo en La Florida 224.',
      respuesta_en: 'The best ice cream shops downtown: Heladería Yusepin at Av. San Martín 118, Gianni Helados at Av. Hipólito Yrigoyen 195, Heladería del Bosque at Av. del Bicentenario 1780, and Helados Tangelo at La Florida 224.',
      respuesta_pt: 'As melhores sorveterias do centro: Heladería Yusepin na Av. San Martín 118, Gianni Helados na Av. Hipólito Yrigoyen 195, Heladería del Bosque na Av. del Bicentenario 1780, e Helados Tangelo na La Florida 224.',
      categoria: { key: 'amenity', value: 'ice_cream' } },

    { keywords: ['museo','maam','museum','cultura'],
      respuesta_es: 'El MAAM (Museo de Arqueología de Alta Montaña) está en Bartolomé Mitre 77. El Museo Histórico del Norte en Caseros 549. El Museo Güemes en España 730. El Museo de Bellas Artes en Av. Belgrano 992.',
      respuesta_en: 'The MAAM (Museum of High Mountain Archaeology) is at Bartolomé Mitre 77. Museo Histórico del Norte at Caseros 549. Museo Güemes at España 730. Museo de Bellas Artes at Av. Belgrano 992.',
      respuesta_pt: 'O MAAM (Museu de Arqueologia de Alta Montanha) fica na Bartolomé Mitre 77. Museo Histórico del Norte na Caseros 549. Museo Güemes na España 730. Museo de Bellas Artes na Av. Belgrano 992.',
      categoria: { key: 'tourism', value: 'museum' } },

    { keywords: ['restaurante','comer','comida','almorzar','cenar'],
      respuesta_es: 'La calle Balcarce es el eje gastronómico: La Vieja Estación en Balcarce 875, El Méson en Balcarce 252, La Panadería del Chuña en Balcarce 446, Restaurante Mónaco en Balcarce 401. También hay opciones en la zona de la Plaza 9 de Julio.',
      respuesta_en: 'Balcarce Street is the gastronomic hub: La Vieja Estación at Balcarce 875, El Méson at Balcarce 252, La Panadería del Chuña at Balcarce 446, Restaurante Mónaco at Balcarce 401. There are also options around Plaza 9 de Julio.',
      respuesta_pt: 'A rua Balcarce é o eixo gastronômico: La Vieja Estación na Balcarce 875, El Méson na Balcarce 252, La Panadería del Chuña na Balcarce 446, Restaurante Mónaco na Balcarce 401. Também há opções na região da Plaza 9 de Julio.',
      categoria: { key: 'amenity', value: 'restaurant' } },

    { keywords: ['baño','toilet','sanitario','wc'],
      respuesta_es: 'Hay baños públicos en la Galería Paseo del Cabildo (Caseros 521), en la Plaza 9 de Julio, y en la Terminal de Ómnibus. Los shoppings y estaciones de servicio también tienen baños.',
      respuesta_en: 'There are public toilets at Galería Paseo del Cabildo (Caseros 521), at Plaza 9 de Julio, and at the Bus Terminal. Malls and gas stations also have restrooms.',
      respuesta_pt: 'Há banheiros públicos na Galería Paseo del Cabildo (Caseros 521), na Plaza 9 de Julio, e na Terminal de Ônibus. Shoppings e postos de gasolina também têm banheiros.',
      categoria: { key: 'amenity', value: 'toilets' } },

    { keywords: ['banco','bank','bancos','sucursal'],
      respuesta_es: 'Tenés bancos en el centro: Banco Nación en Florida 575 y Bartolomé Mitre 151, BBVA Francés en España 642, Galicia en Balcarce 101, Macro en Bartolomé Mitre 997 y Alvarado 746, ICBC en España 771, Credicoop en España 435. Todos abren de lunes a viernes de 8:30 a 13:30.',
      respuesta_en: 'There are banks downtown: Banco Nación at Florida 575 and Bartolomé Mitre 151, BBVA Francés at España 642, Galicia at Balcarce 101, Macro at Bartolomé Mitre 997 and Alvarado 746, ICBC at España 771, Credicoop at España 435. All open Monday to Friday from 8:30 AM to 1:30 PM.',
      respuesta_pt: 'Há bancos no centro: Banco Nación na Florida 575 e Bartolomé Mitre 151, BBVA Francés na España 642, Galicia na Balcarce 101, Macro na Bartolomé Mitre 997 e Alvarado 746, ICBC na España 771, Credicoop na España 435. Todos abrem de segunda a sexta das 8h30 às 13h30.',
      categoria: { key: 'amenity', value: 'bank' } }
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
