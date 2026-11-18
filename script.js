// script.js

// --- Configuración ---
const CONFIG = {
    translationApi: 'https://api.mymemory.translated.net/get',
    languages: {
        'auto': { source: 'Autodetect', name: 'Detectar automáticamente', label: "🌐 Detectar automáticamente", speech: null },
        'en': { source: 'en', name: 'Inglés', label: "🇬🇧 English", speech: 'en-US' },
        'pt': { source: 'pt', name: 'Portugués', label: "🇧🇷 Português", speech: 'pt-BR' },
        'fr': { source: 'fr', name: 'Francés', label: "🇫🇷 Français", speech: 'fr-FR' },
        'de': { source: 'de', name: 'Alemán', label: "🇩🇪 Deutsch", speech: 'de-DE' },
        'it': { source: 'it', name: 'Italiano', label: "🇮🇹 Italiano", speech: 'it-IT' },
        'nl': { source: 'nl', name: 'Neerlandés', label: "🇳🇱 Nederlands", speech: 'nl-NL' },
        'pl': { source: 'pl', name: 'Polaco', label: "🇵🇱 Polski", speech: 'pl-PL' },
        'sv': { source: 'sv', name: 'Sueco', label: "🇸🇪 Svenska", speech: 'sv-SE' },
        'da': { source: 'da', name: 'Danés', label: "🇩🇰 Dansk", speech: 'da-DK' },
        'no': { source: 'no', name: 'Noruego', label: "🇳🇴 Norsk", speech: 'nb-NO' },
        'fi': { source: 'fi', name: 'Finlandés', label: "🇫🇮 Suomi", speech: 'fi-FI' },
        'cs': { source: 'cs', name: 'Checo', label: "🇨🇿 Čeština", speech: 'cs-CZ' },
        'el': { source: 'el', name: 'Griego', label: "🇬🇷 Ελληνικά", speech: 'el-GR' },
        'ro': { source: 'ro', name: 'Rumano', label: "🇷🇴 Română", speech: 'ro-RO' },
        'hu': { source: 'hu', name: 'Húngaro', label: "🇭🇺 Magyar", speech: 'hu-HU' },
        'uk': { source: 'uk', name: 'Ucraniano', label: "🇺🇦 Українська", speech: 'uk-UA' },
        'ru': { source: 'ru', name: 'Ruso', label: "🇷🇺 Русский", speech: 'ru-RU' },
        'tr': { source: 'tr', name: 'Turco', label: "🇹🇷 Türkçe", speech: 'tr-TR' },
        'he': { source: 'he', name: 'Hebreo', label: "🇮🇱 עברית", speech: 'he-IL', rtl: true },
        'ar': { source: 'ar', name: 'Árabe', label: "🇸🇦 العربية", speech: 'ar-SA', rtl: true },
        'hi': { source: 'hi', name: 'Hindi', label: "🇮🇳 हिन्दी", speech: 'hi-IN' },
        'zh': { source: 'zh', name: 'Chino', label: "🇨🇳 中文", speech: 'zh-CN' },
        'ja': { source: 'ja', name: 'Japonés', label: "🇯🇵 日本語", speech: 'ja-JP' },
        'ko': { source: 'ko', name: 'Coreano', label: "🇰🇷 한국어", speech: 'ko-KR' },
        'th': { source: 'th', name: 'Tailandés', label: "🇹🇭 ไทย", speech: 'th-TH' },
        'vi': { source: 'vi', name: 'Vietnamita', label: "🇻🇳 Tiếng Việt", speech: 'vi-VN' },
        'id': { source: 'id', name: 'Indonesio', label: "🇮🇩 Bahasa Indonesia", speech: 'id-ID' },
        'qu': { source: 'qu', name: 'Quechua', label: "🏔️ Runasimi (Quechua)", speech: null },
        'ay': { source: 'ay', name: 'Aimara', label: "🏔️ Aymar aru (Aimara)", speech: null },
        'gn': { source: 'gn', name: 'Guaraní', label: "🇵🇾 Avañe'ẽ (Guaraní)", speech: null }
    }
};

// --- Intenciones con direcciones reales y coordenadas de Salta ---
const INTENTS = [
    // ==== TRANSPORTE Y TARJETAS ====
    { keywords: ['saeta','tarjeta saeta','cargar la tarjeta','cargar tarjeta','recargar','recarga','top up','sube'],
      respuesta_es: 'Podés cargar la tarjeta SAETA en los Centros de Atención al Usuario de Pellegrini 824 o en el Paseo Salta (ex Hiper Libertad), local 2020, 1er piso. También hay cajeros de recarga en San Martín y Buenos Aires, y en la peatonal Florida entre San Martín y Urquiza, disponibles 24 hs.',
      respuesta_en: 'You can top up the SAETA card at the Customer Service Centers at Pellegrini 824 or Paseo Salta (ex Hiper Libertad), unit 2020, 1st floor. There are also top-up machines at San Martín & Buenos Aires, and on Florida pedestrian street between San Martín and Urquiza, available 24/7.',
      respuesta_pt: 'Você pode recarregar o cartão SAETA nos Centros de Atendimento ao Usuário na Pellegrini 824 ou no Paseo Salta (ex Hiper Libertad), loja 2020, 1º andar. Também há caixas de recarga em San Martín e Buenos Aires, e na rua de pedestres Florida entre San Martín e Urquiza, disponíveis 24h.',
      categoria: { key: 'amenity', value: 'payment_centre' },
      lugares: [
        { nombre: 'CAU SAETA', direccion: 'Pellegrini 824', lat: -24.7869, lng: -65.4085 },
        { nombre: 'CAU SAETA - Paseo Salta', direccion: 'Av. Bicentenario (ex Hiper Libertad), local 2020', lat: -24.7900, lng: -65.3990 },
        { nombre: 'Cajero SAETA 24hs', direccion: 'San Martín y Buenos Aires', lat: -24.7880, lng: -65.4090 },
        { nombre: 'Cajero SAETA 24hs', direccion: 'Peatonal Florida entre San Martín y Urquiza', lat: -24.7875, lng: -65.4100 }
      ] },

    { keywords: ['taxi','taxis','remis','remises','parada de taxi','paradas de taxi','donde tomo un taxi','dónde tomo un taxi','pedir un taxi','llamar un taxi','uber','cabify','taxi stand','where can i get a taxi','call a taxi','cab'],
      respuesta_es: 'Los taxis se toman en la calle o en las paradas de taxi: hay muchas en el centro, alrededor de la Plaza 9 de Julio, y en la Terminal de Ómnibus. Usan taxímetro, con tarifa más cara de noche, los domingos y feriados. Los remises cobran precio fijo: preguntá cuánto sale antes de subir. En el Aeropuerto hay mostradores de taxis y remises con tarifa fija al centro (Taxitel 0387 423-2314, Remis Nuevo San Nicolás 0387 648-2000, Remis Golden 0387 495-3723). De noche conviene pedir un radio taxi o remís por teléfono. También funcionan aplicaciones de viaje.',
      categoria: { key: 'amenity', value: 'taxi' },
      lugares: [
        { nombre: 'Taxis y remises - Terminal de Ómnibus', direccion: 'Av. Hipólito Yrigoyen, junto al Parque San Martín', lat: -24.7990, lng: -65.4000 },
        { nombre: 'Taxis y remises - Aeropuerto', direccion: 'Aeropuerto Martín Miguel de Güemes', lat: -24.8560, lng: -65.4860 }
      ] },

    { keywords: ['terminal','ómnibus','omnibus','bus station','micro'],
      respuesta_es: 'La Terminal de Ómnibus está sobre Av. Hipólito Yrigoyen, a una cuadra del Parque San Martín y a unas 8 cuadras de la Plaza 9 de Julio. Ahí salen micros a todo el país, a Jujuy, Cafayate, Cachi y otros pueblos. Desde el centro se llega caminando, en taxi o en colectivo.',
      categoria: { key: 'amenity', value: 'bus_station' },
      lugares: [
        { nombre: 'Terminal de Ómnibus de Salta', direccion: 'Av. Hipólito Yrigoyen, junto al Parque San Martín', lat: -24.7990, lng: -65.4000 }
      ] },

    { keywords: ['aeropuerto','airport','vuelo','avión','vuelos'],
      respuesta_es: 'El Aeropuerto Internacional Martín Miguel de Güemes está a 8 km del centro, sobre Ruta 51. Para ir al centro hay mostradores de taxis y remises con tarifa fija dentro del aeropuerto (unos 20 a 30 minutos). La opción más barata es el colectivo SAETA línea 8A, que pasa por el aeropuerto, la Terminal de Ómnibus y el centro; se paga con tarjeta SAETA (la SUBE no sirve) y tarda bastante más.',
      categoria: { key: 'aeroway', value: 'aerodrome' },
      lugares: [
        { nombre: 'Aeropuerto Martín Miguel de Güemes', direccion: 'Ruta 51, Km 5', lat: -24.8560, lng: -65.4860 }
      ] },

    { keywords: ['tren','tren a las nubes','nubes','train'],
      respuesta_es: 'El Tren a las Nubes hoy se hace en dos tramos: un bus sale temprano desde la ciudad de Salta hasta San Antonio de los Cobres (a 3.700 m de altura) y desde ahí el tren sube hasta el Viaducto La Polvorilla, a más de 4.200 m. Es una excursión de todo el día (Bus-Tren-Bus). También existe la opción "solo tren" si llegás por tu cuenta a San Antonio de los Cobres. Días, horarios y pasajes en trenalasnubes.com.ar. Llevá abrigo y agua: hace frío y la altura se siente.',
      categoria: { key: 'railway', value: 'station' },
      lugares: [
        { nombre: 'San Antonio de los Cobres (sale el tren)', direccion: 'San Antonio de los Cobres, Salta', lat: -24.2250, lng: -66.3190 }
      ] },

    { keywords: ['teleferico','teleférico','cable car','aerial'],
      respuesta_es: 'El Teleférico San Bernardo tiene su estación base en San Martín 15, a una cuadra de la Plaza 9 de Julio. Sube al Cerro San Bernardo. Abre todos los días, aproximadamente de 10 a 20 hs.',
      categoria: { key: 'aerialway', value: 'cable_car' },
      lugares: [
        { nombre: 'Teleférico San Bernardo - Estación Base', direccion: 'San Martín 15', lat: -24.7880, lng: -65.4085 }
      ] },

    { keywords: ['alquiler','auto','car rental','rent a car','alquilar auto'],
      respuesta_es: 'Alquiler de autos en el centro: Hertz en Buenos Aires 130, Avis en Buenos Aires 176, Localiza en Buenos Aires 132. También hay agencias en el Aeropuerto.',
      categoria: { key: 'amenity', value: 'car_rental' } },

    { keywords: ['estacionamiento','parking','aparcar','garage'],
      respuesta_es: 'Estacionamientos en el centro: Parking Plaza en Zuviría, Estacionamiento Cabildo en Caseros, y varios sobre Av. Belgrano y Av. San Martín.',
      categoria: { key: 'amenity', value: 'parking' } },

    { keywords: ['nafta','combustible','gasolina','bencina','ypf','shell','fuel'],
      respuesta_es: 'Estaciones YPF en Av. Belgrano 1750, Av. San Martín 1550 y Av. Paraguay. Shell en Av. Bicentenario y Av. Bolivia. Muchas abren 24 hs.',
      categoria: { key: 'amenity', value: 'fuel' } },

    // ==== ALOJAMIENTO ====
    { keywords: ['hotel','hostel','hostal','alojamiento','dormir','hospedaje'],
      respuesta_es: 'Hoteles recomendados: Hotel Alejandro I en Balcarce 252, Sheraton Salta en Av. Ejército del Norte 330, Hotel Salta en Buenos Aires 1, Hotel Solar de la Plaza en Leguizamón 669, Hotel Colonial en Zuviría 6.',
      respuesta_en: 'Recommended hotels: Hotel Alejandro I at Balcarce 252, Sheraton Salta at Av. Ejército del Norte 330, Hotel Salta at Buenos Aires 1, Hotel Solar de la Plaza at Leguizamón 669, Hotel Colonial at Zuviría 6.',
      respuesta_pt: 'Hotéis recomendados: Hotel Alejandro I na Balcarce 252, Sheraton Salta na Av. Ejército del Norte 330, Hotel Salta na Buenos Aires 1, Hotel Solar de la Plaza na Leguizamón 669, Hotel Colonial na Zuviría 6.',
      categoria: { key: 'tourism', value: 'hotel' },
      lugares: [
        { nombre: 'Hotel Alejandro I', direccion: 'Balcarce 252', lat: -24.7898, lng: -65.4082 },
        { nombre: 'Sheraton Salta Hotel', direccion: 'Av. Ejército del Norte 330', lat: -24.7820, lng: -65.4170 },
        { nombre: 'Hotel Salta', direccion: 'Buenos Aires 1', lat: -24.7889, lng: -65.4092 },
        { nombre: 'Hotel Solar de la Plaza', direccion: 'Leguizamón 669', lat: -24.7870, lng: -65.4120 },
        { nombre: 'Hotel Colonial Salta', direccion: 'Facundo de Zuviría 6', lat: -24.7883, lng: -65.4098 }
      ] },

    // ==== ATRACCIONES TURÍSTICAS ====
    { keywords: ['cerro','san bernardo','mirador','vista','panorámico'],
      respuesta_es: 'El Cerro San Bernardo tiene un mirador con vista panorámica de toda la ciudad. Se sube en Teleférico (San Martín 15) o en auto por Av. San Martín. Hay confitería arriba.',
      categoria: { key: 'tourism', value: 'viewpoint' },
      lugares: [
        { nombre: 'Mirador Cerro San Bernardo', direccion: 'Cerro San Bernardo (cima)', lat: -24.7850, lng: -65.3970 }
      ] },

    { keywords: ['catedral','iglesia','templo','church','parroquia'],
      respuesta_es: 'La Catedral de Salta está en España 596, frente a la Plaza 9 de Julio. Otras iglesias: San Francisco en Caseros 130, La Viña en Alberdi 283, y el Convento San Bernardo en Caseros 1.',
      categoria: { key: 'amenity', value: 'place_of_worship' },
      lugares: [
        { nombre: 'Catedral de Salta', direccion: 'España 596', lat: -24.7885, lng: -65.4105 },
        { nombre: 'Iglesia San Francisco', direccion: 'Caseros 130', lat: -24.7895, lng: -65.4095 },
        { nombre: 'Iglesia La Viña', direccion: 'Alberdi 283', lat: -24.7905, lng: -65.4085 },
        { nombre: 'Convento San Bernardo', direccion: 'Caseros 1', lat: -24.7920, lng: -65.4070 }
      ] },

    { keywords: ['plaza','plaza 9 de julio','centro','main square'],
      respuesta_es: 'La Plaza 9 de Julio es el corazón de Salta. Rodeada por la Catedral, el Cabildo, el Museo Histórico del Norte y el Café del Tiempo. Hay ferias artesanales los fines de semana.',
      categoria: { key: 'tourism', value: 'attraction' },
      lugares: [
        { nombre: 'Plaza 9 de Julio', direccion: 'Centro histórico de Salta', lat: -24.7887, lng: -65.4103 }
      ] },

    { keywords: ['cabildo','historico','histórico','monumento'],
      respuesta_es: 'El Cabildo de Salta está en Caseros 549, frente a la Plaza 9 de Julio. Ahí funciona el Museo Histórico del Norte. Entrada libre los miércoles.',
      categoria: { key: 'historic', value: 'monument' },
      lugares: [
        { nombre: 'Cabildo de Salta', direccion: 'Caseros 549', lat: -24.7883, lng: -65.4100 }
      ] },

    { keywords: ['casino','juego','tragamonedas'],
      respuesta_es: 'El Casino Salta está en Balcarce 220. Abre todos los días desde las 10 hs hasta la madrugada.',
      categoria: { key: 'amenity', value: 'casino' },
      lugares: [
        { nombre: 'Casino Salta', direccion: 'Balcarce 220', lat: -24.7895, lng: -65.4083 }
      ] },

    { keywords: ['cine','película','movie'],
      respuesta_es: 'Cines en Salta: Hoyts en Alto Noa Shopping (Av. Paraguay 2600) y en Paseo Salta (Av. Bicentenario). Cartelera en hoyts.com.ar.',
      categoria: { key: 'amenity', value: 'cinema' },
      lugares: [
        { nombre: 'Hoyts Alto Noa Shopping', direccion: 'Av. Paraguay 2600', lat: -24.7810, lng: -65.4020 },
        { nombre: 'Hoyts Paseo Salta', direccion: 'Av. Bicentenario', lat: -24.7905, lng: -65.3985 }
      ] },

    { keywords: ['teatro','obra','espectáculo'],
      respuesta_es: 'El Teatro Provincial Juan Carlos Saravia está en Zuviría 70. También hay obras en el Teatro del Huerto (Estados Unidos 155) y el Teatro Municipal.',
      categoria: { key: 'amenity', value: 'theatre' },
      lugares: [
        { nombre: 'Teatro Provincial', direccion: 'Zuviría 70', lat: -24.7885, lng: -65.4110 },
        { nombre: 'Teatro del Huerto', direccion: 'Estados Unidos 155', lat: -24.7895, lng: -65.4065 }
      ] },

    { keywords: ['estadio','fútbol','partido','cancha'],
      respuesta_es: 'El Estadio Padre Ernesto Martearena está en Av. Ibazeta 1300. Ahí juega Central Norte. El Estadio Gigante del Norte está en Lerma 670 (juega Gimnasia y Tiro).',
      categoria: { key: 'leisure', value: 'stadium' } },

    { keywords: ['cementerio','cemetery'],
      respuesta_es: 'El Cementerio de la Santa Cruz está en Av. San Martín 1550. Es conocido por sus mausoleos históricos y visitado turísticamente.',
      categoria: { key: 'amenity', value: 'grave_yard' } },

    // ==== COMPRAS ====
    { keywords: ['mercado','mercado san miguel','market'],
      respuesta_es: 'El Mercado San Miguel está en San Martín 611. Abre de lunes a sábado, con productos regionales, empanadas y comidas caseras.',
      categoria: { key: 'amenity', value: 'marketplace' },
      lugares: [
        { nombre: 'Mercado San Miguel', direccion: 'San Martín 611', lat: -24.7905, lng: -65.4065 }
      ] },

    { keywords: ['artesania','artesanía','souvenir','recuerdo','craft','feria'],
      respuesta_es: 'El Mercado Artesanal está en Av. San Martín 2555. También hay ferias artesanales en la Plaza 9 de Julio los fines de semana y en el Paseo Balcarce.',
      categoria: { key: 'shop', value: 'craft' },
      lugares: [
        { nombre: 'Mercado Artesanal de Salta', direccion: 'Av. San Martín 2555', lat: -24.7800, lng: -65.4180 }
      ] },

    { keywords: ['ropa','shopping','tienda','clothes','indumentaria'],
      respuesta_es: 'Shoppings: Alto Noa (Av. Paraguay 2600) y Paseo Salta (Av. Bicentenario). Tiendas en la peatonal Florida y calle Caseros.',
      categoria: { key: 'shop', value: 'clothes' } },

    { keywords: ['zapato','zapatilla','calzado','shoes'],
      respuesta_es: 'Casas de calzado en la peatonal Florida y calle Caseros. También en Alto Noa Shopping.',
      categoria: { key: 'shop', value: 'shoes' } },

    { keywords: ['libreria','librería','libro','book'],
      respuesta_es: 'Librerías en el centro: Librería Rayuela en Caseros 1061, Yenny en Alto Noa Shopping y en la peatonal Florida.',
      categoria: { key: 'shop', value: 'books' } },

    // ==== GASTRONOMÍA ====
    { keywords: ['empanada','comida típica','comida tipica','plato típico','comida regional','regional','locro','humita','tamal','typical food','local food'],
      respuesta_es: 'Empanadas salteñas en Doña Salta (Córdoba 46), La Tacita (Balcarce 402), El Solar del Convento (Caseros 444). Locro y humita en peñas de Balcarce.',
      categoria: { key: 'amenity', value: 'restaurant' } },

    { keywords: ['café','cafeteria','cafetería','desayuno','cafe'],
      respuesta_es: 'Cafés del centro: Café del Tiempo (Balcarce 901), Café Martínez (Caseros 111), Cafetería Boston (Caseros 468). Abren desde las 7 hs.',
      categoria: { key: 'amenity', value: 'cafe' },
      lugares: [
        { nombre: 'Café del Tiempo', direccion: 'Balcarce 901', lat: -24.7933, lng: -65.4057 },
        { nombre: 'Café Martínez', direccion: 'Caseros 111', lat: -24.7895, lng: -65.4093 },
        { nombre: 'Cafetería Boston', direccion: 'Caseros 468', lat: -24.7886, lng: -65.4100 }
      ] },

    { keywords: ['bar','pub','peña','peñas','folclore','folklore','musica en vivo','música en vivo','cerveza','trago','noche','salir de noche','live music','nightlife'],
      respuesta_es: 'La calle Balcarce es la zona de bares y peñas: La Vieja Estación (Balcarce 875), El Solar del Convento (Caseros 444), La Casona del Molino (Luis Burela 1). Todas con música en vivo.',
      categoria: { key: 'amenity', value: 'bar' },
      lugares: [
        { nombre: 'La Vieja Estación', direccion: 'Balcarce 875', lat: -24.7932, lng: -65.4058 },
        { nombre: 'El Solar del Convento', direccion: 'Caseros 444', lat: -24.7885, lng: -65.4101 },
        { nombre: 'La Casona del Molino', direccion: 'Cnel. Luis Burela 1', lat: -24.7920, lng: -65.4070 }
      ] },

    { keywords: ['panaderia','panadería','confiteria','confitería','facturas','pan'],
      respuesta_es: 'Panaderías en el centro: La Salteña (Caseros 641), Confitería El Molino (Caseros y Mitre), Panadería La Estrella (Alvarado 550).',
      categoria: { key: 'shop', value: 'bakery' },
      lugares: [
        { nombre: 'Panadería La Salteña', direccion: 'Caseros 641', lat: -24.7880, lng: -65.4103 },
        { nombre: 'Confitería El Molino', direccion: 'Caseros y Mitre', lat: -24.7878, lng: -65.4106 },
        { nombre: 'Panadería La Estrella', direccion: 'Alvarado 550', lat: -24.7888, lng: -65.4098 }
      ] },

    { keywords: ['pizza','pizzería'],
      respuesta_es: 'Pizzerías en el centro: Kentucky (Zuviría 460), Pizzería Güemes (España 720), Pizzería Roma (Alvarado 601).',
      categoria: { key: 'amenity', value: 'fast_food' },
      lugares: [
        { nombre: 'Pizzería Kentucky', direccion: 'Zuviría 460', lat: -24.7893, lng: -65.4105 },
        { nombre: 'Pizzería Güemes', direccion: 'España 720', lat: -24.7874, lng: -65.4119 },
        { nombre: 'Pizzería Roma', direccion: 'Alvarado 601', lat: -24.7889, lng: -65.4097 }
      ] },

    // ==== SALUD Y EMERGENCIAS ====
    { keywords: ['policia','policía','comisaria','911','emergencia policial'],
      respuesta_es: 'Comisaría 1ª en Belgrano 401. Policía Federal en España 725. Para emergencias, llamá al 911. La Policía Turística está en Mitre 23 (tel. 0387 431-3799).',
      categoria: { key: 'amenity', value: 'police' },
      lugares: [
        { nombre: 'Comisaría 1ª', direccion: 'Belgrano 401', lat: -24.7895, lng: -65.4088 },
        { nombre: 'Policía Federal', direccion: 'España 725', lat: -24.7874, lng: -65.4119 },
        { nombre: 'Policía Turística', direccion: 'Mitre 23', lat: -24.7880, lng: -65.4108 }
      ] },

    { keywords: ['bombero','bomberos','incendio'],
      respuesta_es: 'Cuartel de Bomberos Voluntarios en Av. San Martín 1852. Emergencias al 100.',
      categoria: { key: 'amenity', value: 'fire_station' },
      lugares: [
        { nombre: 'Bomberos Voluntarios Salta', direccion: 'Av. San Martín 1852', lat: -24.7830, lng: -65.4160 }
      ] },

    { keywords: ['farmacia de turno','turno','24 horas'],
      respuesta_es: 'Farmacias de turno en Salta: consultá el listado en el Colegio de Farmacéuticos (farmaciasalta.org.ar) o llamá al 0800-777-3276. Siempre hay una abierta 24 hs.',
      categoria: { key: 'amenity', value: 'pharmacy' } },

    // ==== SERVICIOS ====
    { keywords: ['correo','post office','encomienda','paquete'],
      respuesta_es: 'El Correo Argentino está en Belgrano 501. Abre de lunes a viernes de 8 a 18 y sábados de 8 a 13.',
      categoria: { key: 'amenity', value: 'post_office' },
      lugares: [
        { nombre: 'Correo Argentino', direccion: 'Belgrano 501', lat: -24.7890, lng: -65.4075 }
      ] },

    { keywords: ['wifi','internet','locutorio','chip','celular','sim'],
      respuesta_es: 'WiFi gratis en la Plaza 9 de Julio y en el Paseo Balcarce. Locutorios en el centro (Caseros, Florida). Chips de Claro, Personal y Movistar en kioscos y tiendas oficiales.',
      categoria: { key: 'amenity', value: 'internet_cafe' } },

    { keywords: ['informacion','información','turistica','turística','tourist info','oficina de turismo'],
      respuesta_es: 'Centro de Atención al Visitante: Caseros 711 (0800 777 0300, WhatsApp 387 463-4653). Ministerio de Turismo de la provincia: Buenos Aires 93 (0387 431-0950). También hay una oficina en el Aeropuerto. La Policía Turística está en Mitre 23 (0387 431-3799).',
      categoria: { key: 'tourism', value: 'information' },
      lugares: [
        { nombre: 'Centro de Atención al Visitante', direccion: 'Caseros 711', lat: -24.7886, lng: -65.4076 },
        { nombre: 'Ministerio de Turismo', direccion: 'Buenos Aires 93', lat: -24.7895, lng: -65.4108 },
        { nombre: 'Información Turística Aeropuerto', direccion: 'Aeropuerto Martín M. de Güemes', lat: -24.8560, lng: -65.4860 }
      ] },

    { keywords: ['lavanderia','lavandería','laundry','lavar ropa'],
      respuesta_es: 'Lavanderías en el centro: Lavandería Florida (Florida 350), Lavandería Mitre (Mitre 850). Muchos hostels también ofrecen el servicio.',
      categoria: { key: 'shop', value: 'laundry' } },

    { keywords: ['peluqueria','peluquería','barberia','barbería','corte','hair'],
      respuesta_es: 'Peluquerías y barberías en el centro, sobre calle Caseros y Alvarado. Muchas abren de martes a sábado, de 9 a 20 hs.',
      categoria: { key: 'shop', value: 'hairdresser' } },

    // ==== BANCOS ====
    { keywords: ['banco','bank','bancos','sucursal'],
      respuesta_es: 'Tenés bancos en el centro: Banco Nación en Florida 575 y Bartolomé Mitre 151, BBVA Francés en España 642, Galicia en Balcarce 101, Macro en Bartolomé Mitre 997 y Alvarado 746, ICBC en España 771, Credicoop en España 435, Columbia en Av. Belgrano 550, Hipotecario en España 701, Industrial en 20 de Febrero 63, Itaú en Bartolomé Mitre 270, Patagonia en Av. Belgrano 737. Todos abren de lunes a viernes de 8:30 a 13:30.',
      respuesta_en: 'Banks downtown: Banco Nación at Florida 575 and Bartolomé Mitre 151, BBVA Francés at España 642, Galicia at Balcarce 101, Macro at Bartolomé Mitre 997 and Alvarado 746, ICBC at España 771, Credicoop at España 435, Columbia at Av. Belgrano 550, Hipotecario at España 701, Industrial at 20 de Febrero 63, Itaú at Bartolomé Mitre 270, Patagonia at Av. Belgrano 737.',
      respuesta_pt: 'Bancos no centro: Banco Nación na Florida 575 e Bartolomé Mitre 151, BBVA Francés na España 642, Galicia na Balcarce 101, Macro na Bartolomé Mitre 997 e Alvarado 746, ICBC na España 771, Credicoop na España 435, Columbia na Av. Belgrano 550, Hipotecario na España 701, Industrial na 20 de Febrero 63, Itaú na Bartolomé Mitre 270, Patagonia na Av. Belgrano 737.',
      categoria: { key: 'amenity', value: 'bank' },
      lugares: [
        { nombre: 'Banco de la Nación', direccion: 'Florida 575', lat: -24.7877, lng: -65.4105 },
        { nombre: 'Banco de la Nación', direccion: 'Bartolomé Mitre 151', lat: -24.7885, lng: -65.4085 },
        { nombre: 'BBVA Francés', direccion: 'España 642', lat: -24.7881, lng: -65.4113 },
        { nombre: 'Banco Galicia', direccion: 'Balcarce 101', lat: -24.7893, lng: -65.4088 },
        { nombre: 'Banco Macro', direccion: 'Bartolomé Mitre 997', lat: -24.7862, lng: -65.4128 },
        { nombre: 'Banco Macro', direccion: 'Alvarado 746', lat: -24.7890, lng: -65.4095 },
        { nombre: 'ICBC', direccion: 'España 771', lat: -24.7876, lng: -65.4119 },
        { nombre: 'Banco Credicoop', direccion: 'España 435', lat: -24.7888, lng: -65.4101 },
        { nombre: 'Banco Columbia', direccion: 'Av. Belgrano 550', lat: -24.7900, lng: -65.4075 },
        { nombre: 'Banco Hipotecario', direccion: 'España 701', lat: -24.7878, lng: -65.4116 },
        { nombre: 'Banco Industrial', direccion: '20 de Febrero 63', lat: -24.7892, lng: -65.4092 },
        { nombre: 'Banco Itaú', direccion: 'Bartolomé Mitre 270', lat: -24.7878, lng: -65.4098 },
        { nombre: 'Banco Patagonia', direccion: 'Av. Belgrano 737', lat: -24.7910, lng: -65.4065 }
      ] },

    // ==== CAJEROS ====
    { keywords: ['cajero','atm','efectivo','plata','dinero','cash','money'],
      respuesta_es: 'Tenés cajeros automáticos en el centro: Banco Macro en Alvarado 746, Bartolomé Mitre 997, y un lobby 24 hs en Av. Independencia 910 (Centro Cultural Dino Saluzzi). También en el ingreso del Concejo Deliberante, Av. República del Líbano 990. Y cajeros en todos los bancos del centro.',
      respuesta_en: 'ATMs downtown: Banco Macro at Alvarado 746, Bartolomé Mitre 997, and a 24-hour lobby at Av. Independencia 910 (Dino Saluzzi Cultural Center). Also at the entrance of the City Council, Av. República del Líbano 990.',
      respuesta_pt: 'Caixas eletrônicos no centro: Banco Macro na Alvarado 746, Bartolomé Mitre 997, e um lobby 24h na Av. Independencia 910. Também na entrada do Conselho Deliberativo, Av. República del Líbano 990.',
      categoria: { key: 'amenity', value: 'atm' },
      lugares: [
        { nombre: 'Cajero Banco Macro', direccion: 'Alvarado 746', lat: -24.7890, lng: -65.4095 },
        { nombre: 'Cajero Banco Macro', direccion: 'Bartolomé Mitre 997', lat: -24.7862, lng: -65.4128 },
        { nombre: 'Cajero Macro 24hs', direccion: 'Av. Independencia 910 (CC Dino Saluzzi)', lat: -24.7848, lng: -65.4135 },
        { nombre: 'Cajero Macro', direccion: 'Av. República del Líbano 990 (Concejo)', lat: -24.7840, lng: -65.4148 },
        { nombre: 'Cajero Banco Nación', direccion: 'Florida 575', lat: -24.7877, lng: -65.4105 },
        { nombre: 'Cajero BBVA Francés', direccion: 'España 642', lat: -24.7881, lng: -65.4113 },
        { nombre: 'Cajero Banco Galicia', direccion: 'Balcarce 101', lat: -24.7893, lng: -65.4088 },
        { nombre: 'Cajero Banco Patagonia', direccion: 'Av. Belgrano 737', lat: -24.7910, lng: -65.4065 }
      ] },

    // ==== RESTAURANTES ====
    { keywords: ['restaurante','comer','comida','almorzar','cenar','restaurant','food','eat'],
      respuesta_es: 'Opciones variadas: Doña Salta (empanadas) en Córdoba 46, La Cabrera (parrilla) en Belgrano 354, La Casona del Molino (peña) en Cnel. Luis Burela 1, Trattoria Mamma Mia (pastas) en Pje. Zorrilla 1, El Bodeguero en 20 de Febrero 877, Roque García (almacén de vinos) en Entre Ríos 1990. En Balcarce: La Vieja Estación 875, El Méson 252, Mawi Peña 908, Restaurante Mónaco 401.',
      respuesta_en: 'Varied options: Doña Salta (empanadas) at Córdoba 46, La Cabrera (grill) at Belgrano 354, La Casona del Molino at Cnel. Luis Burela 1, Trattoria Mamma Mia at Pje. Zorrilla 1, El Bodeguero at 20 de Febrero 877, Roque García at Entre Ríos 1990. On Balcarce: La Vieja Estación 875, El Méson 252, Mawi Peña 908, Restaurante Mónaco 401.',
      respuesta_pt: 'Opções variadas: Doña Salta na Córdoba 46, La Cabrera na Belgrano 354, La Casona del Molino na Cnel. Luis Burela 1, Trattoria Mamma Mia na Pje. Zorrilla 1, El Bodeguero na 20 de Febrero 877, Roque García na Entre Ríos 1990. Na Balcarce: La Vieja Estación 875, El Méson 252, Mawi Peña 908, Restaurante Mónaco 401.',
      categoria: { key: 'amenity', value: 'restaurant' },
      lugares: [
        { nombre: 'Doña Salta', direccion: 'Córdoba 46', lat: -24.7898, lng: -65.4108 },
        { nombre: 'La Cabrera', direccion: 'Belgrano 354', lat: -24.7900, lng: -65.4078 },
        { nombre: 'La Casona del Molino', direccion: 'Cnel. Luis Burela 1', lat: -24.7920, lng: -65.4070 },
        { nombre: 'Trattoria Mamma Mia', direccion: 'Pje. Zorrilla 1', lat: -24.7880, lng: -65.4110 },
        { nombre: 'El Bodeguero', direccion: '20 de Febrero 877', lat: -24.7912, lng: -65.4088 },
        { nombre: 'Roque García', direccion: 'Entre Ríos 1990', lat: -24.7860, lng: -65.4080 },
        { nombre: 'La Vieja Estación', direccion: 'Balcarce 875', lat: -24.7932, lng: -65.4058 },
        { nombre: 'El Méson', direccion: 'Balcarce 252', lat: -24.7898, lng: -65.4082 },
        { nombre: 'Mawi Peña', direccion: 'Balcarce 908', lat: -24.7935, lng: -65.4055 },
        { nombre: 'Restaurante Mónaco', direccion: 'Balcarce 401', lat: -24.7905, lng: -65.4078 }
      ] },

    // ==== SUPERMERCADOS ====
    { keywords: ['supermercado','super','supermarket','grocery','vea','carrefour','día','coto'],
      respuesta_es: 'Supermercados: Super Extra en Moldes 57 (abre todos los días de 9 a 22), Vea en Florida 28 y Bartolomé Mitre 459, Damesco en Av. Paraguay 1250, Norte en Av. San Martín 2075.',
      respuesta_en: 'Supermarkets: Super Extra at Moldes 57 (open every day 9 AM–10 PM), Vea at Florida 28 and Bartolomé Mitre 459, Damesco at Av. Paraguay 1250, Norte at Av. San Martín 2075.',
      respuesta_pt: 'Supermercados: Super Extra na Moldes 57 (aberto todos os dias das 9h às 22h), Vea na Florida 28 e Bartolomé Mitre 459, Damesco na Av. Paraguay 1250, Norte na Av. San Martín 2075.',
      categoria: { key: 'shop', value: 'supermarket' },
      lugares: [
        { nombre: 'Super Extra', direccion: 'Moldes 57', lat: -24.7890, lng: -65.4068 },
        { nombre: 'Supermercado Vea', direccion: 'Florida 28', lat: -24.7885, lng: -65.4103 },
        { nombre: 'Supermercado Vea', direccion: 'Bartolomé Mitre 459', lat: -24.7878, lng: -65.4105 },
        { nombre: 'Supermercado Damesco', direccion: 'Av. Paraguay 1250', lat: -24.7862, lng: -65.4050 },
        { nombre: 'Norte Supermercado', direccion: 'Av. San Martín 2075', lat: -24.7830, lng: -65.4180 }
      ] },

    // ==== FARMACIAS ====
    { keywords: ['farmacia','remedio','medicamento','pharmacy','drugstore'],
      respuesta_es: 'Farmacias en el centro: Farmacity en Alberdi 84 (peatonal), Farmacia del Valle en Entre Ríos 850 y Alvarado, Farmacia Monserrat en España 492 y Urquiza 430, Farmacia Sagrada Familia en San Juan 1012, Farmacia San Agustín en Av. San Martín 336.',
      respuesta_en: 'Pharmacies downtown: Farmacity at Alberdi 84, Farmacia del Valle at Entre Ríos 850 and Alvarado, Farmacia Monserrat at España 492 and Urquiza 430, Farmacia Sagrada Familia at San Juan 1012, Farmacia San Agustín at Av. San Martín 336.',
      respuesta_pt: 'Farmácias no centro: Farmacity na Alberdi 84, Farmacia del Valle na Entre Ríos 850 e Alvarado, Farmacia Monserrat na España 492 e Urquiza 430, Farmacia Sagrada Familia na San Juan 1012, Farmacia San Agustín na Av. San Martín 336.',
      categoria: { key: 'amenity', value: 'pharmacy' },
      lugares: [
        { nombre: 'Farmacity', direccion: 'Alberdi 84 (peatonal)', lat: -24.7875, lng: -65.4105 },
        { nombre: 'Farmacia del Valle', direccion: 'Entre Ríos 850', lat: -24.7865, lng: -65.4120 },
        { nombre: 'Farmacia Monserrat', direccion: 'España 492', lat: -24.7888, lng: -65.4102 },
        { nombre: 'Farmacia Sagrada Familia', direccion: 'San Juan 1012', lat: -24.7855, lng: -65.4130 },
        { nombre: 'Farmacia San Agustín', direccion: 'Av. San Martín 336', lat: -24.7880, lng: -65.4088 }
      ] },

    // ==== HOSPITALES ====
    { keywords: ['hospital','clínica','emergencia','médico','doctor','health'],
      respuesta_es: 'El Hospital San Bernardo está en Av. José Tobías 69 (y Mariano Boedo 91). El Hospital Materno Infantil está en Av. Sarmiento 1301. Para emergencias, llamá al 911 o al 107 (SAME).',
      respuesta_en: 'Hospital San Bernardo is at Av. José Tobías 69 (and Mariano Boedo 91). Hospital Materno Infantil is at Av. Sarmiento 1301. For emergencies, call 911 or 107 (SAME).',
      respuesta_pt: 'O Hospital San Bernardo fica na Av. José Tobías 69 (e Mariano Boedo 91). O Hospital Materno Infantil fica na Av. Sarmiento 1301. Para emergências, ligue 911 ou 107 (SAME).',
      categoria: { key: 'amenity', value: 'hospital' },
      lugares: [
        { nombre: 'Hospital San Bernardo', direccion: 'Av. José Tobías 69', lat: -24.7955, lng: -65.3990 },
        { nombre: 'Hospital Materno Infantil', direccion: 'Av. Sarmiento 1301', lat: -24.7920, lng: -65.4020 }
      ] },

    // ==== HELADERÍAS ====
    { keywords: ['heladería','helado','ice cream','gelato','sorvete'],
      respuesta_es: 'Las mejores heladerías: Heladería Yusepin en Av. San Martín 118, Gianni Helados en Av. Hipólito Yrigoyen 195, Heladería del Bosque en Av. del Bicentenario 1780, y Helados Tangelo en La Florida 224.',
      respuesta_en: 'Best ice cream shops: Heladería Yusepin at Av. San Martín 118, Gianni Helados at Av. Hipólito Yrigoyen 195, Heladería del Bosque at Av. del Bicentenario 1780, and Helados Tangelo at La Florida 224.',
      respuesta_pt: 'Melhores sorveterias: Heladería Yusepin na Av. San Martín 118, Gianni Helados na Av. Hipólito Yrigoyen 195, Heladería del Bosque na Av. del Bicentenario 1780, e Helados Tangelo na La Florida 224.',
      categoria: { key: 'amenity', value: 'ice_cream' },
      lugares: [
        { nombre: 'Heladería Yusepin', direccion: 'Av. San Martín 118', lat: -24.7885, lng: -65.4100 },
        { nombre: 'Gianni Helados', direccion: 'Av. Hipólito Yrigoyen 195', lat: -24.7895, lng: -65.4080 },
        { nombre: 'Heladería del Bosque', direccion: 'Av. del Bicentenario 1780', lat: -24.7915, lng: -65.4020 },
        { nombre: 'Helados Tangelo', direccion: 'La Florida 224', lat: -24.7870, lng: -65.4095 }
      ] },

    // ==== MUSEOS ====
    { keywords: ['museo','maam','museum','cultura','culture'],
      respuesta_es: 'El MAAM (Museo de Arqueología de Alta Montaña) está en Bartolomé Mitre 77. El Museo Histórico del Norte en Caseros 549. El Museo Güemes en España 730. El Museo de Bellas Artes en Av. Belgrano 992.',
      respuesta_en: 'The MAAM (Museum of High Mountain Archaeology) is at Bartolomé Mitre 77. Museo Histórico del Norte at Caseros 549. Museo Güemes at España 730. Museo de Bellas Artes at Av. Belgrano 992.',
      respuesta_pt: 'O MAAM (Museu de Arqueologia de Alta Montanha) fica na Bartolomé Mitre 77. Museo Histórico del Norte na Caseros 549. Museo Güemes na España 730. Museo de Bellas Artes na Av. Belgrano 992.',
      categoria: { key: 'tourism', value: 'museum' },
      lugares: [
        { nombre: 'MAAM', direccion: 'Bartolomé Mitre 77', lat: -24.7885, lng: -65.4095 },
        { nombre: 'Museo Histórico del Norte', direccion: 'Caseros 549', lat: -24.7883, lng: -65.4100 },
        { nombre: 'Museo Güemes', direccion: 'España 730', lat: -24.7874, lng: -65.4118 },
        { nombre: 'Museo de Bellas Artes', direccion: 'Av. Belgrano 992', lat: -24.7920, lng: -65.4045 }
      ] },

    // ==== BAÑOS ====
    { keywords: ['baño','toilet','sanitario','wc','bathroom','restroom'],
      respuesta_es: 'Hay baños públicos en la Galería Paseo del Cabildo (Caseros 521), en la Plaza 9 de Julio, y en la Terminal de Ómnibus. Los shoppings y estaciones de servicio también tienen baños.',
      respuesta_en: 'Public toilets at Galería Paseo del Cabildo (Caseros 521), at Plaza 9 de Julio, and at the Bus Terminal.',
      respuesta_pt: 'Banheiros públicos na Galería Paseo del Cabildo (Caseros 521), na Plaza 9 de Julio, e na Terminal de Ônibus.',
      categoria: { key: 'amenity', value: 'toilets' },
      lugares: [
        { nombre: 'Baños públicos Galería Paseo del Cabildo', direccion: 'Caseros 521', lat: -24.7884, lng: -65.4100 },
        { nombre: 'Baños públicos Plaza 9 de Julio', direccion: 'Plaza 9 de Julio', lat: -24.7887, lng: -65.4103 },
        { nombre: 'Baños Terminal de Ómnibus', direccion: 'Av. Hipólito Yrigoyen, junto al Parque San Martín', lat: -24.7990, lng: -65.4000 }
      ] },

    // ==== UNIVERSIDADES ====
    { keywords: ['universidad','university','facultad','estudiar'],
      respuesta_es: 'La Universidad Nacional de Salta (UNSa) está en Av. Bolivia 5150. La Universidad Católica de Salta (UCASAL) en Pellegrini 790.',
      categoria: { key: 'amenity', value: 'university' },
      lugares: [
        { nombre: 'Universidad Nacional de Salta', direccion: 'Av. Bolivia 5150', lat: -24.7730, lng: -65.4170 },
        { nombre: 'UCASAL', direccion: 'Pellegrini 790', lat: -24.7860, lng: -65.4060 }
      ] },
    // ==== COLECTIVO ====
    { keywords: ['colectivo','colectivos','bondi','autobus','autobús','bus urbano','que colectivo','qué colectivo','que linea','qué línea','que linea tomo','qué línea tomo','parada de colectivo','paradas de colectivo','donde paso el colectivo','8a','which bus','bus stop','public bus','city bus','bushaltestelle','arrêt de bus','ônibus','parada de ônibus','fermata autobus'],
      respuesta_es: 'Los colectivos urbanos son de SAETA. Se paga solo con la tarjeta SAETA (la SUBE no funciona en Salta), que se compra y se carga en kioscos y en los centros de atención de SAETA. Para saber qué línea tomar, en cada lugar de la lista tocá "🚌 En colectivo" y te muestra el recorrido. Del Aeropuerto al centro va la línea 8A, que pasa también por la Terminal. De noche hay menos frecuencia: después de las 22.30 conviene un taxi o remís. Te muestro las paradas más cercanas.',
      categoria: { key: 'highway', value: 'bus_stop' } },

    // ==== DINERO ====
    { keywords: ['casa de cambio','casas de cambio','cambiar dinero','cambiar plata','cambiar dolares','cambiar dólares','cambiar euros','cambiar reales','cambio de moneda','dolar','dólar','dolares','dólares','euros','reales','money exchange','exchange money','change money','currency exchange','exchange office','wechselstube','geld wechseln','bureau de change','cambio valuta','casa de câmbio','trocar dinheiro'],
      respuesta_es: 'Para cambiar dólares, euros o reales podés ir a una casa de cambio del centro, como Cambio/Exchange en España 604, o a un banco con tu pasaporte (lunes a viernes por la mañana). Llevá billetes en buen estado: suelen rechazar los rotos, manchados o escritos. Western Union y otras agencias de envíos también te dan pesos. En la ciudad casi todos aceptan tarjeta; en los pueblos conviene llevar efectivo.',
      categoria: { key: 'amenity', value: 'bureau_de_change' } },

    { keywords: ['pagar con tarjeta','aceptan tarjeta','tarjeta de credito','tarjeta de crédito','tarjeta de debito','tarjeta de débito','pago con tarjeta','pesos argentinos','moneda local','qué moneda','que moneda','credit card','pay by card','do you accept card','local currency','kreditkarte','carte bancaire','cartão de crédito'],
      respuesta_es: 'La moneda es el peso argentino. En la ciudad de Salta casi todos los comercios, restaurantes y hoteles aceptan tarjetas de crédito y débito, y muchos también transferencias o pago con QR. En los pueblos chicos, ferias y taxis conviene llevar efectivo. Algunos lugares ofrecen descuento por pagar en efectivo.' },

    { keywords: ['propina','propinas','cuanto dejo','cuánto dejo','tip','tips','tipping','trinkgeld','pourboire','gorjeta','mancia'],
      respuesta_es: 'En restaurantes y bares se acostumbra dejar alrededor del 10 % de propina si el servicio fue bueno; no suele estar incluida en la cuenta. En taxis no es obligatoria (se redondea). A guías y choferes de excursiones se les deja algo a voluntad.' },

    // ==== TRÁMITES Y DOCUMENTOS ====
    { keywords: ['consulado','consulados','embajada','embajadas','consul','cónsul','perdi el pasaporte','perdí el pasaporte','pasaporte perdido','robaron el pasaporte','consulate','embassy','lost passport','passport stolen','konsulat','botschaft','consulat','ambassade','consolato','ambasciata','consulado do brasil'],
      respuesta_es: 'Consulados en Salta: Chile, Consulado General en Santiago del Estero 965 (0387 421-5757). Perú, Consulado Honorario en Acevedo 295 (0387 423-0809). Bolivia y Paraguay también tienen consulado en la ciudad, y varios países europeos tienen cónsul honorario. España se atiende desde el Consulado General en Córdoba. Si perdiste o te robaron el pasaporte, primero hacé la denuncia en una comisaría y llevá la constancia al consulado de tu país.',
      categoria: { key: 'office', value: 'diplomatic' } },

    { keywords: ['migraciones','migracion','migración','extender la estadia','extender estadía','prorroga','prórroga','visa','vencio la visa','venció la visa','residencia','immigration','immigration office','visa extension','extend my stay','einwanderung','imigração'],
      respuesta_es: 'La Dirección Nacional de Migraciones, Delegación Salta, está en Maipú 35 (0387 422-0438) y atiende de lunes a viernes por la mañana. Los turnos y la mayoría de los trámites (por ejemplo, prórroga de estadía de turista) se inician en migraciones.gob.ar. Llevá tu pasaporte o el documento con el que entraste al país.' },

    // ==== EXCURSIONES Y DESTINOS ====
    { keywords: ['excursion','excursión','excursiones','tour','tours','agencia de turismo','agencia de viajes','paseo','paseos','visita guiada','guia turistico','guía turístico','que puedo visitar','qué puedo visitar','que hacer','qué hacer','day trip','tour operator','travel agency','sightseeing','ausflug','gita','passeio','excursão'],
      respuesta_es: 'Las excursiones más pedidas desde Salta: Cafayate y la Quebrada de las Conchas (día completo), Cachi por la Cuesta del Obispo y el Parque Nacional Los Cardones, Salinas Grandes y Purmamarca, la Quebrada de Humahuaca, y el Tren a las Nubes. Se contratan en agencias de turismo del centro o en el Centro de Atención al Visitante (Caseros 711). Salen temprano, entre las 7 y las 8 de la mañana.',
      categoria: { key: 'shop', value: 'travel_agency' } },

    { keywords: ['cafayate','quebrada de las conchas','garganta del diablo','anfiteatro','torrontes','torrontés'],
      respuesta_es: 'Cafayate está a unos 190 km de Salta (3 horas y media a 4 horas en auto por la Ruta 68). El camino atraviesa la Quebrada de las Conchas, con la Garganta del Diablo y el Anfiteatro. Es la tierra del vino torrontés, con muchas bodegas para visitar. Hay micros desde la Terminal de Ómnibus y excursiones de día completo en agencias.',
      lugares: [ { nombre: 'Cafayate', direccion: 'Cafayate, Salta (Ruta 68)', lat: -26.0730, lng: -65.9760 } ] },

    { keywords: ['cachi','cuesta del obispo','los cardones','parque nacional los cardones','recta del tin tin'],
      respuesta_es: 'Cachi está a unos 160 km de Salta (unas 4 horas). Se sube por la Cuesta del Obispo, a más de 3.300 m, y se cruza el Parque Nacional Los Cardones por la Recta del Tin Tin. Es un pueblo colonial de casas blancas en los Valles Calchaquíes. Hay micros desde la Terminal y excursiones de día completo.',
      lugares: [ { nombre: 'Cachi', direccion: 'Cachi, Salta (Ruta 33 y 40)', lat: -25.1200, lng: -66.1630 } ] },

    { keywords: ['purmamarca','cerro de los siete colores','siete colores','salinas grandes','salinas','tilcara','pucara','pucará','humahuaca','quebrada de humahuaca','hornocal','serrania del hornocal','jujuy'],
      respuesta_es: 'La Quebrada de Humahuaca está en la provincia vecina de Jujuy. Purmamarca (Cerro de los Siete Colores) queda a unas 3 horas de Salta; Tilcara (Pucará) a unas 3 horas y media; Humahuaca y el Hornocal a unas 4 horas. Las Salinas Grandes están a 1 hora de Purmamarca por la Cuesta de Lipán. Hay micros desde la Terminal de Ómnibus y excursiones de día completo.',
      lugares: [
        { nombre: 'Purmamarca', direccion: 'Purmamarca, Jujuy', lat: -23.7450, lng: -65.4990 },
        { nombre: 'Tilcara', direccion: 'Tilcara, Jujuy', lat: -23.5770, lng: -65.3960 },
        { nombre: 'Humahuaca', direccion: 'Humahuaca, Jujuy', lat: -23.2050, lng: -65.3500 },
        { nombre: 'Salinas Grandes', direccion: 'Ruta 52, Jujuy', lat: -23.6200, lng: -65.8800 }
      ] },

    { keywords: ['san lorenzo','quebrada de san lorenzo','iruya','san antonio de los cobres','la poma','molinos','seclantas'],
      respuesta_es: 'San Lorenzo es una villa veraniega a unos 11 km del centro (20 minutos), con la Quebrada de San Lorenzo para caminar; se llega en colectivo SAETA o taxi. San Antonio de los Cobres está a unas 3 horas y media, en la Puna (3.700 m). Iruya es un pueblo de montaña a unas 7 horas, por camino de ripio desde Humahuaca.',
      lugares: [
        { nombre: 'San Lorenzo', direccion: 'Villa San Lorenzo, Salta', lat: -24.7310, lng: -65.4880 },
        { nombre: 'San Antonio de los Cobres', direccion: 'San Antonio de los Cobres, Salta', lat: -24.2250, lng: -66.3190 },
        { nombre: 'Iruya', direccion: 'Iruya, Salta', lat: -22.7900, lng: -65.2140 }
      ] },

    { keywords: ['vino','vinos','vinoteca','vinotecas','bodega','bodegas','degustacion','degustación','wine','wine shop','winery','wine tasting','wein','vin','vinho','cata de vinos'],
      respuesta_es: 'El vino típico de Salta es el torrontés, un blanco aromático de Cafayate, y también hay muy buenos malbec y tannat de altura. En la ciudad hay vinotecas en el centro; las bodegas para visitar y degustar están en Cafayate y en los Valles Calchaquíes.',
      categoria: { key: 'shop', value: 'wine' } },

    { keywords: ['parque','parques','plaza','plazas','espacio verde','lago','botes','caminar','correr','park','garden','picnic','jogging','parc','parco'],
      respuesta_es: 'Para pasear al aire libre: el Parque San Martín, con lago y botes, al sur del centro; la Plaza 9 de Julio, frente a la Catedral; y el Cerro San Bernardo, al que se sube por el teleférico o a pie por una escalinata de unos 1.000 escalones.',
      categoria: { key: 'leisure', value: 'park' } },

    // ==== COMIDA ESPECIAL ====
    { keywords: ['restaurante vegetariano','restaurantes vegetarianos','comida vegetariana','comida vegana','vegetariano','vegetariana','vegano','vegana','sin carne','vegetarian','vegan','végétarien','vegetarisch','vegetariano'],
      respuesta_es: 'Hay restaurantes con opciones vegetarianas y veganas en el centro. Muchas comidas típicas tienen versión sin carne: humitas, tamales de queso, empanadas de queso o de humita, y locro vegetariano en algunos lugares. Preguntá siempre "¿tiene carne o grasa animal?".',
      categoria: { key: 'diet', value: 'vegetarian' } },

    { keywords: ['sin tacc','comida sin tacc','restaurante sin tacc','celiaco','celíaco','celiaca','celíaca','sin gluten','gluten','gluten free','coeliac','celiac','glutenfrei','sans gluten','senza glutine','sem glúten'],
      respuesta_es: 'Para celíacos: buscá el logo "Sin TACC" en los productos, y en los supermercados suele haber una góndola sin gluten. Algunos restaurantes tienen menú sin TACC; avisá siempre que sos celíaco para evitar contaminación cruzada.',
      categoria: { key: 'diet', value: 'gluten_free' } },

    // ==== SALUD (otros) ====
    { keywords: ['dentista','odontologo','odontólogo','muela','muelas','diente','dientes','dolor de muela','dentist','toothache','tooth','zahnarzt','dentiste','dentista'],
      respuesta_es: 'Para un dolor de muela o una urgencia dental, buscá un consultorio odontológico cercano. Muchos hospitales tienen guardia odontológica. Si es grave o hay hinchazón con fiebre, andá a la guardia del Hospital San Bernardo.',
      categoria: { key: 'amenity', value: 'dentist' } },

    { keywords: ['optica','óptica','anteojos','lentes','gafas','lentes de contacto','se me rompieron los anteojos','glasses','optician','contact lenses','brille','lunettes','occhiali','óculos'],
      respuesta_es: 'Hay varias ópticas en el centro, sobre todo en la peatonal Florida y alrededores. Muchas arreglan anteojos en el día.',
      categoria: { key: 'shop', value: 'optician' } },

    { keywords: ['altura','apunamiento','soroche','mal de altura','mal de puna','puna','me falta el aire','hoja de coca','coca','altitude','altitude sickness','mountain sickness','höhenkrankheit','mal des montagnes','mal de altitude'],
      respuesta_es: 'Salta capital está a 1.150 m y no da problemas, pero en la Puna, Salinas Grandes, San Antonio de los Cobres o la Cuesta del Obispo se superan los 3.000 m. Para evitar el apunamiento: subí despacio, tomá mucha agua, comé liviano, evitá el alcohol y no corras. El té o las hojas de coca ayudan. Si hay dolor de cabeza fuerte, mareo o falta de aire que no pasa, bajá y consultá a un médico.' },

    // ==== AUTO ====
    { keywords: ['gomeria','gomería','goma pinchada','se pincho','se pinchó','se me pincho','se me pinchó','pinchó','goma','gomas','pinche','pinché','rueda pinchada','neumatico','neumático','flat tire','flat tyre','puncture','tyre','tire','reifenpanne','crevaison','pneu furado'],
      respuesta_es: 'Las gomerías arreglan pinchaduras y cambian neumáticos, y suele haber varias sobre las avenidas. Si estás en la ruta, la estación de servicio más cercana normalmente tiene gomería o te indica una.',
      categoria: { key: 'shop', value: 'tyres' } },

    { keywords: ['taller mecanico','taller mecánico','mecanico','mecánico','se rompio el auto','se rompió el auto','auxilio mecanico','auxilio mecánico','grua','grúa','auto roto','car repair','mechanic','breakdown','tow truck','werkstatt','garage auto','mecânico'],
      respuesta_es: 'Para una falla del auto buscá un taller mecánico cercano. Si es alquilado, llamá primero a la empresa de alquiler: el auxilio suele estar incluido. Si tenés seguro o sos socio del Automóvil Club Argentino (ACA), pedí el auxilio mecánico por teléfono.',
      categoria: { key: 'shop', value: 'car_repair' } },

    // ==== OTROS ====
    { keywords: ['veterinaria','veterinario','mi perro','mi gato','perro enfermo','gato enfermo','mascota enferma','perro','gato','mascota','vet','veterinarian','pet','tierarzt','vétérinaire'],
      respuesta_es: 'Hay veterinarias en distintos barrios; algunas atienden guardias de urgencia. Te muestro las más cercanas.',
      categoria: { key: 'amenity', value: 'veterinary' } },

    { keywords: ['kiosco','kiosko','kioscos','golosinas','cigarrillos','gaseosa','comprar agua','botella de agua','snack','snacks','kiosk','convenience store','späti'],
      respuesta_es: 'Los kioscos venden bebidas, agua, golosinas, cigarrillos y cargas para el celular y la tarjeta SAETA. Hay en casi todas las cuadras del centro y varios abren hasta tarde.',
      categoria: { key: 'shop', value: 'kiosk' } },

    { keywords: ['ferreteria','ferretería','herramienta','pilas','cinta','candado','hardware store','tools','batteries','eisenwarenladen','quincaillerie'],
      respuesta_es: 'Las ferreterías venden herramientas, pilas, candados y adaptadores eléctricos. Te muestro las más cercanas.',
      categoria: { key: 'shop', value: 'hardware' } },

    // ==== DUDAS FRECUENTES (sin mapa) ====
    { keywords: ['clima','frio','frío','calor','lluvia','llueve','que ropa','qué ropa','abrigo','temperatura','weather','cold','hot','rain','what to wear','wetter','météo','tempo','clima'],
      respuesta_es: 'Salta tiene días soleados casi todo el año. En verano (diciembre a marzo) hace calor y llueve por la tarde; en invierno (junio a agosto) los días son templados y las noches frías. Llevá ropa en capas, protector solar y sombrero. En la Puna y la montaña hace mucho frío aunque haya sol.' },

    { keywords: ['es seguro','es peligroso','seguridad','inseguro','zona peligrosa','safe','is it safe','dangerous','sicher','gefährlich','sûr','dangereux','seguro'],
      respuesta_es: 'El centro de Salta es tranquilo para caminar, de día y de noche por las calles con movimiento. Como en cualquier ciudad: cuidá el celular y la billetera en lugares con gente, usá taxis o remises habilitados de noche y no dejes cosas a la vista en el auto. Ante cualquier problema llamá al 911 o andá a la Policía Turística (Mitre 23).' },

    { keywords: ['agua potable','agua de la canilla','agua del grifo','se puede tomar el agua','tomar agua de la canilla','tap water','drinking water','is the water safe','leitungswasser','eau du robinet','água da torneira'],
      respuesta_es: 'En la ciudad de Salta el agua de la canilla es potable. En pueblos chicos, la Puna y la montaña conviene tomar agua envasada.' },

    { keywords: ['enchufe','enchufes','adaptador','voltaje','220','tension electrica','plug','adapter','socket','voltage','stecker','prise','tomada'],
      respuesta_es: 'En Argentina la corriente es de 220 V y 50 Hz. Los enchufes son de tres patas planas en "V" (tipo I) y también se usa el de dos patas redondas (tipo C). Los adaptadores se consiguen en ferreterías, kioscos y supermercados.' },

    { keywords: ['siesta','a que hora abren','a qué hora abren','a que hora cierran','a qué hora cierran','horario de comercio','horarios de los negocios','horario de cena','a que hora se cena','opening hours','closing time','what time do shops','öffnungszeiten','horaires','horário'],
      respuesta_es: 'En Salta muchos negocios abren de 9 a 13 y de 17 a 21, y cierran al mediodía por la siesta; supermercados y shoppings abren corrido. Los bancos atienden de lunes a viernes por la mañana. Se almuerza entre las 13 y las 15 y se cena tarde, desde las 21.' }
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
const mapTitle = document.getElementById('map-title');
const btnModoTurista = document.getElementById('modo-turista');
const btnModoYo = document.getElementById('modo-yo');
const labelTexto = document.getElementById('label-texto');
const notaIdioma = document.getElementById('nota-idioma');
const resultLabel = document.getElementById('resultado-label');

// 'toEs' = el visitante habla, se traduce al español
// 'fromEs' = vos respondés en español, se traduce a su idioma
let direction = 'toEs';
let lastVisitorLang = null; // último idioma detectado/elegido del visitante

// --- Utilidades ---
function updateStatus(message, isError = false) {
    statusText.textContent = message;
    statusText.classList.toggle('error', !!isError);
}

// Dentro de la app Android hay un puente nativo (voz y micrófono de Android)
const ANDROID = window.HablaAndroid || null;

// ----- Número de versión en la esquina -----
(function showVersion() {
    const tag = document.getElementById('version-tag');
    if (!tag) return;
    // version.js lo escribe GitHub solo en cada cambio (ej. "1.57")
    tag.textContent = window.APP_VERSION ? 'v' + window.APP_VERSION : 'v?';
})();

// ----- Traductor y detector sin internet (solo dentro de la app Android) -----
const NATIVE_OFFLINE = !!(ANDROID && typeof ANDROID.translateOffline === 'function');
const nativeCalls = {};
let nativeSeq = 0;

window.__androidNative = {
    resolve(id, ok, payload) {
        const c = nativeCalls[id];
        if (!c) return;
        delete nativeCalls[id];
        clearTimeout(c.timer);
        ok ? c.resolve(payload) : c.reject(new Error(payload));
    }
};

function nativeCall(fn, args, timeoutMs = 30000) {
    return new Promise((resolve, reject) => {
        const id = 'n' + (++nativeSeq);
        const timer = setTimeout(() => {
            delete nativeCalls[id];
            reject(new Error('timeout'));
        }, timeoutMs);
        nativeCalls[id] = { resolve, reject, timer };
        try { ANDROID[fn](id, ...args); }
        catch (e) { delete nativeCalls[id]; clearTimeout(timer); reject(e); }
    });
}

function nativeErrorMessage(e) {
    const m = String((e && e.message) || e);
    if (m.startsWith('unsupported')) return 'Este idioma no se puede traducir sin internet (quechua, aimara y guaraní necesitan conexión).';
    if (m === 'model-missing') return 'Para traducir sin internet, descargá el idioma con el botón ⬇️ cuando tengas conexión.';
    if (m === 'timeout') return 'El traductor tardó demasiado. Probá de nuevo.';
    return 'No se pudo traducir sin internet.';
}

// Proveedor sin internet: ML Kit (dentro del teléfono)
async function translateWithNative(text, from, to) {
    let src = from;
    if (src === 'auto') {
        src = normalizeLang(await nativeCall('detectLanguage', [text]));
        if (!src || src === 'und') throw new Error('No se pudo detectar el idioma. Elegilo en la lista.');
    }
    if (src === to) return { text, detected: src, provider: 'android' };
    const out = await nativeCall('translateOffline', [text, src, to]);
    return { text: out, detected: src, provider: 'android' };
}

function speak(text, langCode) {
    if (ANDROID) {
        ANDROID.speak(text, langCode || 'es-AR');
        return;
    }
    if ('speechSynthesis' in window) {
        window.speechSynthesis.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = langCode;
        window.speechSynthesis.speak(utterance);
    }
}

// --- Motor de traducción ---
// Usa Google (gtx) como servicio principal y MyMemory como respaldo.
// Detecta el idioma, guarda en caché, corta textos largos y limpia el resultado.

const TRANSLATE_TIMEOUT_MS = 8000;
const CACHE_KEY = 'hablaSaltaCache_v1';
const CACHE_MAX = 300;

// Código interno -> código de cada servicio
function apiCode(code) {
    if (!code || code === 'auto' || code === 'Autodetect') return 'auto';
    const map = { zh: 'zh-CN', he: 'iw', no: 'no' };
    return map[code] || code;
}

// Código devuelto por un servicio -> código interno de la app
function normalizeLang(code) {
    if (!code) return null;
    const c = code.toLowerCase();
    if (c.startsWith('zh')) return 'zh';
    if (c === 'iw') return 'he';
    if (c === 'nb' || c === 'nn') return 'no';
    return c.split('-')[0];
}

function decodeEntities(str) {
    const t = document.createElement('textarea');
    t.innerHTML = str;
    return t.value;
}

function escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, ch => (
        { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch]
    ));
}

async function fetchWithTimeout(url, ms = TRANSLATE_TIMEOUT_MS) {
    const ctrl = new AbortController();
    const timer = setTimeout(() => ctrl.abort(), ms);
    try {
        return await fetch(url, { signal: ctrl.signal });
    } finally {
        clearTimeout(timer);
    }
}

// Divide el texto en partes de hasta maxLen caracteres, respetando oraciones
function splitText(text, maxLen) {
    if (text.length <= maxLen) return [text];
    const sentences = text.match(/[^.!?。！？\n]+[.!?。！？\n]*/g) || [text];
    const chunks = [];
    let current = '';
    for (const s of sentences) {
        if ((current + s).length > maxLen && current) {
            chunks.push(current);
            current = '';
        }
        if (s.length > maxLen) {
            for (let i = 0; i < s.length; i += maxLen) chunks.push(s.slice(i, i + maxLen));
        } else {
            current += s;
        }
    }
    if (current) chunks.push(current);
    return chunks;
}

// Caché persistente (localStorage) para no repetir pedidos
const translationCache = (() => {
    let store = {};
    try { store = JSON.parse(localStorage.getItem(CACHE_KEY)) || {}; } catch (e) { store = {}; }
    const save = () => {
        try {
            const keys = Object.keys(store);
            if (keys.length > CACHE_MAX) keys.slice(0, keys.length - CACHE_MAX).forEach(k => delete store[k]);
            localStorage.setItem(CACHE_KEY, JSON.stringify(store));
        } catch (e) { /* almacenamiento lleno o bloqueado */ }
    };
    return {
        get: k => store[k],
        set: (k, v) => { delete store[k]; store[k] = v; save(); }
    };
})();

// Proveedor 1: Google Translate (endpoint público). Si falla, reintenta una vez con otro cliente.
async function googleOnce(part, from, to, client, ms) {
    const url = `https://translate.googleapis.com/translate_a/single?client=${client}&dt=t`
        + `&sl=${apiCode(from)}&tl=${apiCode(to)}&q=${encodeURIComponent(part)}`;
    const res = await fetchWithTimeout(url, ms);
    if (!res.ok) throw new Error(`Google ${res.status}`);
    const data = await res.json();
    if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error('Respuesta inválida de Google');
    return { text: data[0].map(seg => (seg && seg[0]) || '').join(''), detected: data[2] || null };
}
async function translateWithGoogle(text, from, to) {
    const parts = splitText(text, 1800);
    let out = '';
    let detected = null;
    for (const part of parts) {
        let r;
        try {
            r = await googleOnce(part, from, to, 'gtx', 6000);
        } catch (e) {
            if (!navigator.onLine || e.name === 'AbortError') throw e;   // tardó: ya están corriendo los respaldos
            r = await googleOnce(part, from, to, 'dict-chrome-ex', 5000);
        }
        out += r.text;
        if (!detected && r.detected) detected = r.detected;
    }
    if (!out.trim()) throw new Error('Traducción vacía');
    return { text: out, detected: normalizeLang(detected) || (from !== 'auto' ? from : null), provider: 'google' };
}

// Proveedor 2: MyMemory (respaldo)
async function translateWithMyMemory(text, from, to) {
    const src = apiCode(from) === 'auto' ? 'Autodetect' : (from === 'zh' ? 'zh-CN' : from);
    const tgt = to === 'zh' ? 'zh-CN' : to;
    const parts = splitText(text, 450);
    let out = [];
    let detected = null;
    for (const part of parts) {
        const url = `${CONFIG.translationApi}?q=${encodeURIComponent(part)}&langpair=${src}|${tgt}`;
        const res = await fetchWithTimeout(url, 6000);
        if (!res.ok) throw new Error(`MyMemory ${res.status}`);
        const data = await res.json();
        const t = data.responseData && data.responseData.translatedText;
        if (!t || data.responseStatus >= 400 || /MYMEMORY WARNING|QUERY LENGTH LIMIT|INVALID LANGUAGE PAIR/i.test(t)) {
            throw new Error(data.responseDetails || 'MyMemory no devolvió una traducción válida');
        }
        out.push(decodeEntities(t));
        if (!detected && data.responseData.detectedLanguage) detected = data.responseData.detectedLanguage;
    }
    return { text: out.join(' '), detected: normalizeLang(detected) || (from !== 'auto' ? from : null), provider: 'mymemory' };
}

// --- Precisión ---
// Limpia lo dictado o pegado: espacios dobles, caracteres invisibles, comillas raras
function cleanInput(text) {
    return String(text)
        .replace(/[​-‍﻿]/g, '')
        .replace(/[ \t]+/g, ' ')
        .replace(/\s*\n\s*/g, '\n')
        .replace(/\s+([,.;:!?])/g, '$1')
        .trim();
}

// Palabras de Salta / Argentina que los traductores entienden mal -> español neutro
const MODISMOS = [
    [/\bbondis?\b/gi, m => /s$/i.test(m) ? 'autobuses' : 'autobús'],
    [/\bcolectivos\b/gi, 'autobuses'], [/\bcolectivo\b/gi, 'autobús'],
    [/\bremises\b/gi, 'taxis'], [/\bremis\b/gi, 'taxi'],
    [/\bnafta\b/gi, 'gasolina'], [/\bestaci[oó]n de servicio\b/gi, 'gasolinera'],
    [/\b(poca|mucha) plata\b/gi, (m, q) => (q.toLowerCase() === 'poca' ? 'poco' : 'mucho') + ' dinero'],
    [/\bplata\b(?! (y|o) oro)/gi, 'dinero'],
    [/\bcelu\b/gi, 'celular'], [/\bboliches\b/gi, 'discotecas'], [/\bboliche\b/gi, 'discoteca'],
    [/\bchangos\b/gi, 'chicos'], [/\bchango\b/gi, 'chico'], [/\bpibes\b/gi, 'chicos'], [/\bpibe\b/gi, 'chico'],
    [/\blaburo\b/gi, 'trabajo'], [/\bheladera\b/gi, 'refrigerador'],
    [/\bfrutillas\b/gi, 'fresas'], [/\bfrutilla\b/gi, 'fresa'], [/\bpaltas\b/gi, 'aguacates'], [/\bpalta\b/gi, 'aguacate'],
    [/\bpochoclos?\b/gi, 'palomitas de maíz'], [/\bmanteca\b/gi, 'mantequilla'],
    [/^\s*che,?\s*/i, ''], [/,?\s*\bche\b\s*([,.!?]|$)/gi, '$1'],
    [/\bre (lind|linda|lindo|cerca|lejos|rico|rica|caro|cara|barato|barata|bueno|buena|f[aá]cil|dif[ií]cil|bien|tranqui)/gi, 'muy $1'],
    [/\btranqui\b/gi, 'tranquilo'], [/\bok[eé]y?\b/gi, 'de acuerdo'],
    [/\bal toque\b/gi, 'enseguida'], [/\bahorita\b/gi, 'ahora'],
    [/\bdale\b/gi, 'de acuerdo'], [/\bjoya\b/gi, 'perfecto'], [/\bbárbaro\b/gi, 'excelente']
];
function neutralizarModismos(text) {
    let t = text;
    for (const [re, rep] of MODISMOS) t = t.replace(re, rep);
    return t.replace(/\s{2,}/g, ' ').replace(/^\s*([,.])\s*/, '').trim() || text;
}

// Nombres propios que el traductor confunde con palabras comunes ("Salta" -> "salta/jumps")
const NOMBRES_PROTEGIDOS = [
    'Quebrada de las Conchas', 'Tren a las Nubes', 'Rosario de Lerma', 'Campo Quijano', 'Tres Cerritos',
    'La Caldera', 'La Merced', 'La Viña', 'El Carril', 'San Lorenzo', 'Vaqueros', 'Cerrillos', 'Caseros',
    'Salta', 'Cafayate', 'Cachi', 'Iruya', 'Humahuaca', 'Purmamarca', 'Tilcara', 'Güemes', 'Chicoana', 'MAAM'
];
function protegerNombres(text) {
    const guardados = [];
    let t = text;
    NOMBRES_PROTEGIDOS.forEach(nombre => {
        const re = new RegExp(`(^|[^\\p{L}])(${nombre})(?![\\p{L}])`, 'gu');
        t = t.replace(re, (m, pre, n) => { guardados.push(n); return `${pre}[[${guardados.length - 1}]]`; });
    });
    return { text: t, guardados };
}
function restaurarNombres(text, guardados) {
    let usados = 0;
    const out = text.replace(/[\[［【]\s*[\[［【]\s*(\d+)\s*[\]］】]\s*[\]］】]/g, (m, i) => {
        if (guardados[+i] === undefined) return m;
        usados++;
        return guardados[+i];
    });
    return usados === guardados.length ? out : null;   // si el traductor rompió alguna marca, no sirve
}

function limpiarSalida(text, to) {
    let t = String(text).replace(/\s+([,.;:!?])/g, '$1').replace(/ {2,}/g, ' ').trim();
    if (to === 'es') t = t.replace(/([¿¡])\s+/g, '$1');
    return t;
}

// Arranca con el primer proveedor; si tarda, larga el siguiente en paralelo y se queda con el primero que responda
const HEDGE_DELAYS = { translateWithGoogle: 0, translateWithNative: 1300, translateWithMyMemory: 1800 };
function runProviders(providers, text, from, to) {
    return new Promise((resolve, reject) => {
        let pendientes = providers.length, terminado = false, lastError = null;
        const timers = [];
        const lanzar = (provider) => {
            if (terminado || provider.__lanzado) return;
            provider.__lanzado = true;
            provider(text, from, to).then(r => {
                if (terminado) return;
                terminado = true;
                timers.forEach(clearTimeout);
                resolve(r);
            }, e => {
                console.warn(`Falló ${provider.name}:`, e);
                lastError = e;
                if (--pendientes === 0 && !terminado) { terminado = true; reject(lastError); return; }
                // si uno falla, no esperar: largar el siguiente ya
                const sig = providers.find(p => !p.__lanzado);
                if (sig) lanzar(sig);
            });
        };
        providers = providers.map(f => { const w = (...a) => f(...a); Object.defineProperty(w, 'name', { value: f.name }); return w; });
        providers.forEach((p, i) => {
            const d = i === 0 ? 0 : (HEDGE_DELAYS[p.name] != null ? HEDGE_DELAYS[p.name] : 1500 * i);
            if (d === 0) lanzar(p); else timers.push(setTimeout(() => lanzar(p), d));
        });
    });
}

/**
 * Traduce y devuelve { text, detected, provider }.
 * from puede ser 'auto'. Prueba cada proveedor en orden hasta que uno funcione.
 */
async function translateFull(text, from, to) {
    from = normalizeLang(from === 'Autodetect' ? 'auto' : from) || 'auto';
    to = normalizeLang(to);
    text = cleanInput(text);
    if (!text) return { text: '', detected: from, provider: 'none' };
    if (from === to) return { text, detected: from, provider: 'none' };

    const key = `${from}|${to}|${text}`;
    const cached = translationCache.get(key);
    if (cached) return { ...cached, provider: 'cache' };

    // Lo que dice el salteño: modismos a español neutro y nombres propios protegidos
    let entrada = text, guardados = [];
    if (from === 'es') {
        entrada = neutralizarModismos(text);
        const p = protegerNombres(entrada);
        entrada = p.text; guardados = p.guardados;
    }

    const providers = [];
    if (!navigator.onLine) {
        if (!NATIVE_OFFLINE) throw new Error('Sin internet no se puede traducir texto nuevo. Usá el historial o lo ya traducido.');
        providers.push(translateWithNative);
    } else {
        providers.push(translateWithGoogle, translateWithMyMemory);
        // Con conexión floja: si Google y MyMemory fallan, probar con el traductor del teléfono
        if (NATIVE_OFFLINE) providers.push(translateWithNative);
    }

    let result;
    try {
        result = await runProviders(providers, entrada, from, to);
        if (guardados.length) {
            const restaurado = restaurarNombres(result.text, guardados);
            if (restaurado !== null) result.text = restaurado;
            else {   // el traductor rompió las marcas: se traduce sin protegerlas
                const sinMarcas = neutralizarModismos(text);
                result = await runProviders(providers, sinMarcas, from, to);
            }
        }
    } catch (lastError) {
        const msg = String((lastError && lastError.message) || '');
        if (!navigator.onLine || (NATIVE_OFFLINE && /unsupported|model-missing|timeout/.test(msg))) {
            throw new Error(NATIVE_OFFLINE ? nativeErrorMessage(lastError) : msg);
        }
        throw new Error(lastError && lastError.name === 'AbortError'
            ? 'El traductor tardó demasiado (señal floja). Tocá "Reintentar".'
            : 'El traductor no respondió. Revisá la conexión y tocá "Reintentar".');
    }

    // Si el texto ya estaba en el idioma destino, no hace falta traducir
    if (result.detected === to) result.text = text;
    result.text = limpiarSalida(result.text, to);
    // No guardar en caché algo que volvió igual sin traducir (suele ser una falla del servicio)
    const sinCambio = result.text.trim().toLowerCase() === text.trim().toLowerCase() && result.detected !== to;
    if (!(sinCambio && text.split(/\s+/).length > 3)) {
        translationCache.set(key, { text: result.text, detected: result.detected });
    }
    return result;
}

// Parecido entre dos frases en español (0 a 1), para la comprobación de ida y vuelta
function parecido(a, b) {
    const pal = t => new Set(normText(t).split(/[^a-z0-9ñ]+/).filter(w => w.length > 2));
    const A = pal(a), B = pal(b);
    if (!A.size || !B.size) return 1;
    let comunes = 0;
    A.forEach(w => { if (B.has(w)) comunes++; });
    return comunes / Math.min(A.size, B.size);
}

// Compatibilidad: devuelve solo el texto
async function translateText(text, fromLang, toLang) {
    return (await translateFull(text, fromLang, toLang)).text;
}

function langName(code) {
    return (CONFIG.languages[code] && CONFIG.languages[code].name) || code.toUpperCase();
}

function speechCode(code) {
    // Quechua, aimara y guaraní no tienen voz propia: se leen con voz en español
    return (CONFIG.languages[code] && CONFIG.languages[code].speech) || 'es-AR';
}

// --- Detección de intenciones ---

function normText(s) {
    return String(s || '').toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '');
}

// Palabras extra (español + idiomas de turistas) por categoría
const EXTRA_KEYWORDS = {
    hospital: ['hospital','hospitales','clinica','sanatorio','guardia','emergencia','urgencia','ambulancia',
               'medico','doctor','enfermo','enferma','herido','herida','dolor','salud','centro de salud',
               'clinic','emergency','sick','injured','hurt','ospedale','hopital','krankenhaus','arzt','больница'],
    police: ['policia','comisaria','comisarias','robo','robaron','denuncia','extravio','police',
             'stolen','robbed','polizei','polizia','policia federal'],
    atm: ['cajero','cajeros','cajero automatico','atm','efectivo','sacar plata','sacar dinero','cash',
          'geldautomat','bancomat','distributeur','caixa eletronico'],
    bank: ['banco','bank','banque','banca'],
    cafe: ['cafe','cafes','cafeteria','coffee','kaffee','caffe'],
    pharmacy: ['farmacia','farmacias','remedio','medicamento','pastilla','pharmacy','drugstore',
               'apotheke','pharmacie','farmacia de turno'],
    restaurant: ['restaurante','restaurant','comer','comida','almorzar','cenar','hungry','eat','food'],
    supermarket: ['supermercado','almacen','supermarket','grocery'],
    hotel: ['hotel','hostel','hostal','alojamiento','hospedaje','dormir'],
    fuel: ['nafta','combustible','estacion de servicio','gas station','petrol'],
    toilets: ['bano','banos','sanitario','toilet','restroom','bathroom','wc'],
    fire_station: ['bomberos','incendio','fuego','fire']
};

const URGENT = new Set(['hospital', 'police', 'fire_station', 'pharmacy']);

// Prepara cada intención una sola vez: palabras normalizadas + expresión regular por palabra completa
// Las palabras extra van solo a la última intención de cada categoría (la más general)
const lastIntentForValue = {};
INTENTS.forEach((it, i) => { if (it.categoria) lastIntentForValue[it.categoria.value] = i; });

const INTENT_MATCHERS = INTENTS.map((intent, idx) => {
    const value = intent.categoria && intent.categoria.value;
    const extra = lastIntentForValue[value] === idx ? (EXTRA_KEYWORDS[value] || []) : [];
    const words = new Set([...intent.keywords, ...extra].map(normText));
    const patterns = [...words].filter(w => w.length > 1).map(w => {
        const esc = w.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        // palabra completa, con plural opcional
        return { w, re: new RegExp(`(^|[^\\p{L}\\p{N}])${esc}(s|es)?(?=$|[^\\p{L}\\p{N}])`, 'u') };
    });
    return { intent, patterns, urgent: URGENT.has(value) };
});

/**
 * Busca la intención que mejor coincide, mirando el texto traducido al español
 * y también el original del turista. Gana la de mayor puntaje, no la primera.
 */
function detectIntent(...texts) {
    const hay = texts.filter(Boolean).map(normText);
    let best = null, bestScore = 0;
    for (const m of INTENT_MATCHERS) {
        let score = 0;
        for (const p of m.patterns) {
            if (hay.some(t => p.re.test(t))) score += p.w.length + (p.w.includes(' ') ? 4 : 0);
        }
        if (score > 0 && m.urgent) score += 3;
        if (score > bestScore) { best = m.intent; bestScore = score; }
    }
    return best;
}

// ===== Reseña histórica (Wikipedia) =====
// Categorías donde tiene sentido mostrar historia
const TOURIST_VALUES = new Set(['attraction', 'museum', 'monument', 'viewpoint', 'place_of_worship',
    'theatre', 'marketplace', 'grave_yard', 'artwork', 'gallery']);

const WIKI_CACHE_KEY = 'hablaSaltaWiki_v1';
let wikiCache = {};
try { wikiCache = JSON.parse(localStorage.getItem(WIKI_CACHE_KEY)) || {}; } catch (e) { wikiCache = {}; }
function saveWikiCache() {
    try {
        const keys = Object.keys(wikiCache);
        if (keys.length > 250) keys.slice(0, keys.length - 250).forEach(k => delete wikiCache[k]);
        localStorage.setItem(WIKI_CACHE_KEY, JSON.stringify(wikiCache));
    } catch (e) { /* sin espacio o bloqueado */ }
}

const WIKI_STOP = new Set(['salta', 'de', 'del', 'la', 'las', 'los', 'el', 'y', 'san', 'santa', 'museo', 'iglesia', 'plaza']);
function wikiTokens(name) {
    return normText(name).split(/[^a-z0-9]+/).filter(w => w.length > 2 && !WIKI_STOP.has(w));
}
// ¿El título del artículo corresponde al lugar?
function wikiSimilar(title, name) {
    const nt = normText(title);
    const toks = wikiTokens(name);
    if (!toks.length) return normText(name) === nt || nt.includes(normText(name));
    const hits = toks.filter(t => nt.includes(t)).length;
    return hits >= Math.min(2, toks.length);
}
function shortenText(text, max = 650) {
    if (text.length <= max) return text;
    const cut = text.slice(0, max);
    const end = Math.max(cut.lastIndexOf('. '), cut.lastIndexOf('.\n'));
    return (end > 200 ? cut.slice(0, end + 1) : cut.replace(/\s+\S*$/, '') + '…');
}
async function fetchJsonTimeout(url, ms = 9000) {
    const res = await fetchWithTimeout(url, ms);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return res.json();
}

/**
 * Busca la reseña de un lugar. Devuelve:
 *  - { title, extract, image, url }  si la encontró
 *  - null                            si no hay reseña
 *  - undefined                       si no se pudo (sin internet y sin copia guardada)
 */
async function wikiLookup(place) {
    const key = place.wikipedia || `${normText(place.nombre)}|${place.lat.toFixed(3)},${place.lng.toFixed(3)}`;
    const hit = wikiCache[key];
    if (hit && (!hit.none || Date.now() - hit.t < 7 * 864e5)) return hit.none ? null : hit;
    if (!navigator.onLine) return undefined;
    try {
        let title = null;
        if (place.wikipedia && /^es:/.test(place.wikipedia)) {
            title = place.wikipedia.slice(3);
        } else {
            const geo = await fetchJsonTimeout('https://es.wikipedia.org/w/api.php?action=query&list=geosearch'
                + `&gscoord=${place.lat}%7C${place.lng}&gsradius=300&gslimit=15&format=json&formatversion=2&origin=*`);
            const cands = (geo.query && geo.query.geosearch) || [];
            const best = cands.find(c => wikiSimilar(c.title, place.nombre));
            title = best && best.title;
        }
        if (!title) { wikiCache[key] = { none: true, t: Date.now() }; saveWikiCache(); return null; }
        const sum = await fetchJsonTimeout('https://es.wikipedia.org/api/rest_v1/page/summary/'
            + encodeURIComponent(title.replace(/ /g, '_')));
        if (sum.type === 'disambiguation' || !sum.extract) {
            wikiCache[key] = { none: true, t: Date.now() }; saveWikiCache(); return null;
        }
        const out = {
            title: sum.title,
            extract: shortenText(sum.extract),
            image: (sum.thumbnail && sum.thumbnail.source) || '',
            url: (sum.content_urls && sum.content_urls.desktop && sum.content_urls.desktop.page) || '',
            t: Date.now()
        };
        wikiCache[key] = out;
        saveWikiCache();
        return out;
    } catch (e) {
        console.warn('Reseña no disponible:', e);
        return undefined;
    }
}

// Muestra la reseña dentro de la ficha del lugar
async function showHistory(place, box, targetLang) {
    box.classList.remove('hidden');
    box.innerHTML = '<p class="hist-estado">Buscando la reseña…</p>';
    const info = await wikiLookup(place);
    if (info === undefined) {
        box.innerHTML = '<p class="hist-estado">No se pudo cargar la reseña. Se guarda cuando la ves con internet.</p>';
        return false;
    }
    if (info === null) {
        box.innerHTML = '<p class="hist-estado">No encontramos una reseña de este lugar.</p>';
        return false;
    }
    let translated = '';
    const hasTarget = targetLang && targetLang !== 'auto' && targetLang !== 'es';
    if (hasTarget) {
        try { translated = await translateText(info.extract, 'es', targetLang); } catch (e) { translated = ''; }
    }
    box.innerHTML = `
        ${info.image ? `<img class="hist-img" src="${escapeHtml(info.image)}" alt="" loading="lazy" onerror="this.remove()">` : ''}
        <p class="hist-titulo">📖 ${escapeHtml(info.title)}</p>
        <p class="hist-es">${escapeHtml(info.extract)}</p>
        ${translated && translated !== info.extract
            ? `<p class="hist-target" lang="${escapeHtml(targetLang)}" dir="auto">${escapeHtml(translated)}</p>` : ''}
        ${info.url ? `<a class="hist-fuente" href="${escapeHtml(info.url)}" target="_blank" rel="noopener">Fuente: Wikipedia</a>` : ''}
        <div style="clear:both"></div>`;
    return true;
}

// --- Mapa ---
function initMap(lat, lng) {
    if (!map) {
        map = L.map('map').setView([lat, lng], 14);
        L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors © CARTO',
            subdomains: 'abcd',
            maxZoom: 19
        }).addTo(map);
        markersLayer = L.layerGroup().addTo(map);
    } else {
        map.setView([lat, lng], 14);
    }
    setTimeout(() => map.invalidateSize(), 200);
}

// --- Buscar lugares en OSM (radio 2 km) ---
// Etiquetas de OpenStreetMap que cuentan para cada categoría
const CATEGORY_TAGS = {
    'amenity=hospital':       [['amenity', 'hospital|clinic|doctors'], ['healthcare', 'hospital|clinic|centre']],
    'amenity=police':         [['amenity', 'police']],
    'amenity=atm':            [['amenity', 'atm'], ['atm', 'yes']],
    'amenity=bank':           [['amenity', 'bank']],
    'amenity=cafe':           [['amenity', 'cafe'], ['shop', 'coffee']],
    'amenity=pharmacy':       [['amenity', 'pharmacy'], ['healthcare', 'pharmacy']],
    'amenity=restaurant':     [['amenity', 'restaurant|fast_food|food_court']],
    'amenity=fast_food':      [['amenity', 'fast_food|restaurant']],
    'amenity=bar':            [['amenity', 'bar|pub|nightclub']],
    'amenity=ice_cream':      [['amenity', 'ice_cream'], ['shop', 'ice_cream']],
    'amenity=payment_centre': [['amenity', 'payment_centre|payment_terminal'], ['vending', 'public_transport_tickets']],
    'amenity=internet_cafe':  [['amenity', 'internet_cafe'], ['shop', 'mobile_phone|telecommunication']],
    'shop=supermarket':       [['shop', 'supermarket|convenience']],
    'shop=craft':             [['shop', 'craft|gift|souvenir|art']],
    'shop=bakery':            [['shop', 'bakery|pastry|confectionery']],
    'shop=laundry':           [['shop', 'laundry|dry_cleaning']],
    'tourism=hotel':          [['tourism', 'hotel|hostel|guest_house|motel|apartment']],
    'tourism=attraction':     [['tourism', 'attraction|artwork|gallery'], ['historic', 'monument|memorial|building|church|archaeological_site|manor|ruins']],
    'tourism=museum':         [['tourism', 'museum|gallery']],
    'historic=monument':      [['historic', 'monument|memorial|building|church|archaeological_site|manor|ruins'], ['tourism', 'attraction']],
    'amenity=bureau_de_change': [['amenity', 'bureau_de_change|money_transfer']],
    'shop=travel_agency':     [['shop', 'travel_agency'], ['office', 'travel_agent|tourism']],
    'office=diplomatic':      [['office', 'diplomatic'], ['amenity', 'embassy'], ['diplomatic', 'consulate|embassy|honorary_consulate']],
    'amenity=dentist':        [['amenity', 'dentist'], ['healthcare', 'dentist']],
    'shop=optician':          [['shop', 'optician']],
    'shop=wine':              [['shop', 'wine|alcohol'], ['craft', 'winery']],
    'leisure=park':           [['leisure', 'park|garden']],
    'diet=vegetarian':        [['diet:vegetarian', 'yes|only'], ['diet:vegan', 'yes|only']],
    'diet=gluten_free':       [['diet:gluten_free', 'yes|only']],
    'shop=tyres':             [['shop', 'tyres']],
    'shop=car_repair':        [['shop', 'car_repair']],
    'amenity=veterinary':     [['amenity', 'veterinary']],
    'shop=kiosk':             [['shop', 'kiosk|convenience|newsagent']],
    'shop=hardware':          [['shop', 'hardware|doityourself']],
    'highway=bus_stop':       [['highway', 'bus_stop'], ['public_transport', 'platform']]
};

// Nombre en español para cada tipo de lugar (cuando OSM no tiene nombre)
const TYPE_LABELS = {
    hospital: 'Hospital', clinic: 'Clínica', doctors: 'Consultorio médico', centre: 'Centro de salud',
    police: 'Comisaría', atm: 'Cajero automático', bank: 'Banco', cafe: 'Café', coffee: 'Café',
    pharmacy: 'Farmacia', restaurant: 'Restaurante', fast_food: 'Comida rápida', food_court: 'Patio de comidas',
    bar: 'Bar', pub: 'Pub', nightclub: 'Boliche', ice_cream: 'Heladería', supermarket: 'Supermercado',
    convenience: 'Almacén', bakery: 'Panadería', hotel: 'Hotel', hostel: 'Hostel', guest_house: 'Hospedaje',
    fuel: 'Estación de servicio', toilets: 'Baño público', fire_station: 'Bomberos', taxi: 'Parada de taxi',
    parking: 'Estacionamiento', museum: 'Museo', post_office: 'Correo',
    attraction: 'Atractivo turístico', monument: 'Monumento', memorial: 'Memorial', viewpoint: 'Mirador',
    gallery: 'Galería', place_of_worship: 'Iglesia / templo', theatre: 'Teatro', artwork: 'Obra de arte',
    building: 'Edificio histórico', church: 'Iglesia', archaeological_site: 'Sitio arqueológico',
    ruins: 'Ruinas', manor: 'Casona histórica', marketplace: 'Mercado', grave_yard: 'Cementerio',
    bureau_de_change: 'Casa de cambio', money_transfer: 'Envío de dinero', travel_agency: 'Agencia de turismo',
    travel_agent: 'Agencia de turismo', diplomatic: 'Consulado', embassy: 'Consulado', dentist: 'Dentista',
    optician: 'Óptica', wine: 'Vinoteca', alcohol: 'Vinoteca', winery: 'Bodega', park: 'Parque', garden: 'Jardín',
    vegetarian: 'Comida vegetariana', gluten_free: 'Sin TACC', tyres: 'Gomería', car_repair: 'Taller mecánico',
    veterinary: 'Veterinaria', kiosk: 'Kiosco', newsagent: 'Kiosco', hardware: 'Ferretería', doityourself: 'Ferretería',
    bus_stop: 'Parada de colectivo', platform: 'Parada de colectivo'
};

const OVERPASS_MIRRORS = [
    'https://overpass-api.de/api/interpreter',
    'https://overpass.kumi.systems/api/interpreter',
    'https://overpass.private.coffee/api/interpreter'
];
const SEARCH_RADII = [1500, 4000, 10000]; // se agranda si no encuentra lo suficiente
const MIN_RESULTS = 3;
const placesCache = new Map(); // caché de 10 minutos en memoria

function tagsFor(categoria) {
    return CATEGORY_TAGS[`${categoria.key}=${categoria.value}`] || [[categoria.key, categoria.value]];
}

async function overpassQuery(query, timeoutMs = 12000) {
    const body = 'data=' + encodeURIComponent(query);
    const controllers = [];
    const attempts = OVERPASS_MIRRORS.map(async mirror => {
        const ctrl = new AbortController();
        controllers.push(ctrl);
        const timer = setTimeout(() => ctrl.abort(), timeoutMs);
        try {
            const res = await fetch(mirror, {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body, signal: ctrl.signal
            });
            if (!res.ok) throw new Error(`${mirror} ${res.status}`);
            const data = await res.json();
            if (!Array.isArray(data.elements)) throw new Error('sin datos');
            return data.elements;
        } finally {
            clearTimeout(timer);
        }
    });
    try {
        // El primer servidor que responda gana; se cancelan los demás
        const elements = await Promise.any(attempts);
        controllers.forEach(c => c.abort());
        return elements;
    } catch (e) {
        console.warn('Ningún servidor de mapas respondió', e);
        return null;
    }
}

/**
 * Busca lugares reales cerca de (lat, lng). Empieza con radio chico
 * y lo agranda hasta encontrar al menos MIN_RESULTS.
 * Devuelve lugares ya ordenados por distancia.
 */
async function searchPlaces(lat, lng, categoria, onProgress) {
    const cacheKey = `${categoria.key}=${categoria.value}@${lat.toFixed(3)},${lng.toFixed(3)}`;
    const hit = placesCache.get(cacheKey);
    if (hit && Date.now() - hit.t < 10 * 60 * 1000) return hit.places;

    // Sin internet: usar los lugares descargados
    if (!navigator.onLine && typeof searchPlacesOffline === 'function') {
        const off = await searchPlacesOffline(lat, lng, categoria);
        if (off) return off;
    }

    const tags = tagsFor(categoria);
    let places = [];
    for (const radius of SEARCH_RADII) {
        if (onProgress) onProgress(radius);
        const parts = tags.map(([k, v]) =>
            `nwr["${k}"~"^(${v})$"](around:${radius},${lat},${lng});`).join('\n');
        const query = `[out:json][timeout:20];(\n${parts}\n);out center tags 100;`;
        const elements = await overpassQuery(query);
        if (elements === null) {
            // Servidores caídos: probar con lo descargado
            if (typeof searchPlacesOffline === 'function') {
                const off = await searchPlacesOffline(lat, lng, categoria);
                if (off) return off;
            }
            break;
        }
        places = elements.map(el => toPlace(el, lat, lng)).filter(Boolean);
        if (places.length >= MIN_RESULTS) break;
    }

    // Quitar duplicados (mismo lugar cargado como punto y como edificio)
    const seen = new Set();
    places = places
        .sort((a, b) => a.distancia - b.distancia)
        .filter(p => {
            const k = `${normText(p.nombre)}|${p.lat.toFixed(3)}|${p.lng.toFixed(3)}`;
            if (seen.has(k)) return false;
            seen.add(k);
            return true;
        });

    placesCache.set(cacheKey, { t: Date.now(), places });
    return places;
}

function toPlace(el, userLat, userLng) {
    const lat = el.lat ?? (el.center && el.center.lat);
    const lng = el.lon ?? (el.center && el.center.lon);
    if (lat == null || lng == null) return null;
    const t = el.tags || {};
    const type = t.amenity || t.healthcare || t.shop || t.tourism || t.office || t.leisure || t.craft || t.vending || t.historic || t.highway || t.public_transport || '';
    const label = TYPE_LABELS[type] || '';
    const calle = t['addr:street'] ? `${t['addr:street']} ${t['addr:housenumber'] || ''}`.trim() : '';
    return {
        nombre: t.name || t.brand || t.operator || label || 'Sin nombre',
        marca: [t.name, t.brand, t.operator].filter(Boolean).join(' '),
        tipo: label,
        direccion: calle || 'Dirección no disponible',
        lat, lng,
        telefono: t.phone || t['contact:phone'] || '',
        horario: t.opening_hours || '',
        emergencia: t.emergency === 'yes' || type === 'hospital',
        wikipedia: t.wikipedia || '',
        distancia: distanciaMetros(userLat, userLng, lat, lng),
        fuente: 'osm'
    };
}

function formatDistancia(m) {
    if (m == null) return '';
    const dist = m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`;
    const minPie = Math.max(1, Math.round(m / 80));
    let tiempo;
    if (m <= 2500) tiempo = `${minPie} min a pie`;
    else if (m <= 15000) tiempo = `${Math.max(1, Math.round(m / 400))} min en auto`;
    else {
        // Ruta: el camino es ~30 % más largo que la línea recta y se va a ~55 km/h por las montañas
        const min = Math.round((m * 1.3 / 1000) / 55 * 60);
        if (min < 60) return `${dist} · unos ${Math.max(5, Math.round(min / 5) * 5)} min en auto`;
        let h = Math.floor(min / 60), r = Math.round((min % 60) / 15) * 15;
        if (r === 60) { h++; r = 0; }
        tiempo = `aprox. ${h} h${r ? ` ${r} min` : ''} en auto`;
    }
    return `${dist} · ${tiempo}`;
}

function linkColectivo(p) {
    return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=transit`;
}
function linkComoLlegar(p) {
    const mode = p.distancia != null && p.distancia > 2500 ? 'driving' : 'walking';
    return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=${mode}`;
}

// --- Ubicación del usuario ---
let lastPosition = null;
function savePos(pos) {
    lastPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude,
                     precision: pos.coords.accuracy, t: Date.now() };
    return lastPosition;
}
// Pide la ubicación en segundo plano (al abrir la app, al tocar el texto o el micrófono)
let gpsPidiendo = null;
function warmPosition() {
    if (!navigator.geolocation || gpsPidiendo) return gpsPidiendo;
    if (lastPosition && Date.now() - lastPosition.t < 60000) return Promise.resolve(lastPosition);
    gpsPidiendo = new Promise(resolve => {
        navigator.geolocation.getCurrentPosition(
            pos => resolve(savePos(pos)),
            () => resolve(null),
            { enableHighAccuracy: true, timeout: 12000, maximumAge: 60000 });
    }).finally(() => { setTimeout(() => { gpsPidiendo = null; }, 0); });
    return gpsPidiendo;
}
function getUserPosition() {
    return new Promise(resolve => {
        if (!navigator.geolocation) return resolve(null);
        // Ubicación reciente: al instante (y se refresca en segundo plano)
        if (lastPosition && Date.now() - lastPosition.t < 120000) return resolve(lastPosition);
        if (lastPosition && Date.now() - lastPosition.t < 600000) { warmPosition(); return resolve(lastPosition); }
        let listo = false;
        const fin = v => { if (!listo) { listo = true; resolve(v); } };
        // Rápida (red/wifi) y precisa (GPS) a la vez: gana la primera
        navigator.geolocation.getCurrentPosition(pos => fin(savePos(pos)), () => {},
            { enableHighAccuracy: false, timeout: 4000, maximumAge: 300000 });
        (warmPosition() || Promise.resolve(null)).then(p => { if (p) fin(p); });
        setTimeout(() => fin(lastPosition || null), 6000);
    });
}

// --- Distancia aproximada entre dos puntos (Haversine) ---
function distanciaMetros(lat1, lng1, lat2, lng2) {
    const R = 6371000;
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLng = (lng2 - lng1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) ** 2 +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLng / 2) ** 2;
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}


// --- Respuesta ordenada: título, un lugar por renglón (nombre + dirección) y notas aparte ---
const ABREV = /\b(Av|Avda|Cnel|Pje|Gral|Dr|Dra|Sr|Sra|Sta|Sto|Bv|Bvd|Prof|Ing|Tte|Cap|Pte|Mons|Nº|N°|nro|St|Mt|Ave|Mr|Mrs|approx|aprox|ca|etc)\.$/i;
function dividirOraciones(text) {
    const partes = String(text).split(/(?<=[.!?。！？])\s+/);
    const out = [];
    partes.forEach(p => {
        if (out.length && ABREV.test(out[out.length - 1])) out[out.length - 1] += ' ' + p;
        else out.push(p);
    });
    return out.map(x => x.trim()).filter(Boolean);
}
// Corta por comas que no estén dentro de paréntesis
function dividirLista(text) {
    const items = [];
    let nivel = 0, actual = '';
    for (const ch of text) {
        if (ch === '(' || ch === '（') nivel++;
        if (ch === ')' || ch === '）') nivel = Math.max(0, nivel - 1);
        if ((ch === ',' || ch === '，' || ch === ';' || ch === '、') && nivel === 0) { items.push(actual); actual = ''; }
        else actual += ch;
    }
    items.push(actual);
    return items.map(x => x.trim()
        .replace(/^(y|e|and|et|und|e anche|i|и|και)\s+/i, '')
        .replace(/[.。]$/, '').trim()).filter(Boolean);
}
function partirLugar(item, es) {
    if (es) {
        // "Banco Nación en Florida 575" / "Doña Salta (empanadas) en Córdoba 46"
        let m = item.match(/^(.+?)\s+(?:(?:está|queda|están|quedan)\s+)?en\s+(.+\d.*)$/);
        if (m) return { nombre: m[1], dir: m[2] };
        // "Café del Tiempo (Balcarce 901)" / "Remis del Norte (0387 431-3000)"
        m = item.match(/^(.+?)\s*\(([^()]*\d[^()]*)\)$/);
        if (m) return { nombre: m[1], dir: m[2] };
    }
    return { nombre: item, dir: '' };
}
function htmlDir(dir) {
    if (!dir) return '';
    const tel = dir.match(/^(?:tel\.?\s*)?([0-9][0-9\s-]{6,})$/i);
    if (tel) return `<a class="resp-dir resp-tel" href="tel:${tel[1].replace(/\D/g, '')}">📞 ${escapeHtml(tel[1].trim())}</a>`;
    return `<span class="resp-dir">📍 ${escapeHtml(dir)}</span>`;
}
function capital(t) { return t ? t.charAt(0).toUpperCase() + t.slice(1) : t; }
// Intenta leer una oración como lista de lugares; devuelve { titulo, lugares } o null
function leerLista(o, es) {
    const limpio = o.replace(/[.。]$/, '');
    const c = limpio.search(/[:：]/);
    let titulo = '', cuerpo = limpio;
    if (c > 0 && c < 70) { titulo = limpio.slice(0, c).trim(); cuerpo = limpio.slice(c + 1); }
    let items = dividirLista(cuerpo);
    if (!titulo && es && items.length >= 2) {
        // "Empanadas salteñas en Doña Salta (Córdoba 46), La Tacita (Balcarce 402)…"
        const m = items[0].match(/^(.+?)\s+en\s+(.+)$/);
        if (!m) return null;
        if (/\b(está|queda|están|quedan)$/i.test(m[1])) return null;
        titulo = m[1]; items[0] = m[2];
    }
    if (items.length < 2 || !titulo) return null;
    // En español, una lista de lugares empieza con mayúscula o tiene números (evita partir frases comunes)
    if (es && items.filter(it => /^[A-ZÁÉÍÓÚÑ0-9"«(]/.test(it) || /\d/.test(it)).length < 2) return null;
    const lugares = items.map(it => partirLugar(it, es));
    // Sin título con dos puntos, exigir que parezcan lugares (con dirección o número)
    if (c <= 0 && lugares.filter(l => l.dir || /\d/.test(l.nombre)).length < 2) return null;
    return { titulo: capital(titulo.replace(/^Tenés\s+/i, '')), lugares };
}
function formatRespuesta(text, lang) {
    const es = lang === 'es';
    const bloques = [];
    dividirOraciones(text).forEach(o => {
        const lista = leerLista(o, es);
        if (lista) { bloques.push({ tipo: 'lista', ...lista }); return; }
        // "El Museo X está en Calle 123." -> se junta con otras oraciones iguales
        const l = es ? partirLugar(o.replace(/[.]$/, ''), true) : null;
        if (l && l.dir && l.nombre.length < 70 && !/[,;]/.test(l.nombre) && !/^(También|Y|Además|Ahí|Para|Hay|Se|Muchas|Muchos)\b/i.test(l.nombre)) {
            const prev = bloques[bloques.length - 1];
            if (prev && prev.tipo === 'sueltos') prev.lugares.push(l);
            else bloques.push({ tipo: 'sueltos', lugares: [l], texto: [o] });
            if (prev && prev.tipo === 'sueltos') prev.texto.push(o);
            return;
        }
        const prev = bloques[bloques.length - 1];
        if (prev && prev.tipo === 'nota') prev.textos.push(o); else bloques.push({ tipo: 'nota', textos: [o] });
    });
    if (!bloques.some(b => b.tipo === 'lista' || (b.tipo === 'sueltos' && b.lugares.length >= 2))) {
        return `<p class="resp-texto">${escapeHtml(text)}</p>`;
    }
    const li = l => `<li><span class="resp-nombre">${escapeHtml(capital(l.nombre))}</span>${htmlDir(l.dir)}</li>`;
    return bloques.map(b => {
        if (b.tipo === 'lista') return `<p class="resp-titulo">${escapeHtml(b.titulo)}</p><ul class="resp-lista">${b.lugares.map(li).join('')}</ul>`;
        if (b.tipo === 'sueltos') return `<ul class="resp-lista">${b.lugares.map(li).join('')}</ul>`;
        return b.textos.map(t => `<p class="resp-nota">${escapeHtml(t)}</p>`).join('');
    }).join('');
}


// ===== Búsqueda de un lugar por su nombre ("Banco Galicia", "Farmacity", "Hotel Sheraton") =====
const PALABRAS_GENERICAS = new Set(('banco bank banque bancos cajero cajeros atm farmacia farmacias pharmacy hotel hoteles ' +
    'hostel supermercado super market cafe cafeteria restaurante restaurant bar museo museum iglesia church hospital ' +
    'clinica sanatorio comisaria policia estacion servicio sucursal central casa centro salta norte sur este oeste plaza ' +
    'calle avenida san santa santo del los las una uno que donde esta queda hay cerca aqui alla para por con sin como ' +
    'the where is are near nearest there here closest bank please can find need want ' +
    'de la el en y a al mas muy necesito quiero busco buscar tienen tiene puedo').split(' '));
const MARCAS_CONOCIDAS = new Set(('nacion galicia macro santander bbva frances icbc credicoop columbia hipotecario industrial ' +
    'itau patagonia supervielle ciudad provincia comafi hsbc citi brubank masventas ' +
    'farmacity ypf shell axion puma carrefour vea changomas damesco libertad coto disco jumbo ' +
    'mcdonalds burger kentucky mostaza havanna martinez starbucks sheraton hilton alejandro ' +
    'western rapipago pagofacil correo andreani oca').split(' '));

function tokensNombre(t) {
    return normText(t || '').split(/[^a-z0-9]+/).filter(w => w.length >= 3 && !PALABRAS_GENERICAS.has(w));
}
function terminosBuscados(textos, intent) {
    const deCategoria = new Set((intent.keywords || []).flatMap(k => normText(k).split(/[^a-z0-9]+/)));
    const set = new Set();
    (textos || []).forEach(t => tokensNombre(t).forEach(w => { if (!deCategoria.has(w)) set.add(w); }));
    return set;
}
function coincideNombre(nombre, terminos) {
    if (!terminos.size) return false;
    return tokensNombre(nombre).some(w => terminos.has(w) ||
        [...terminos].some(t => t.length >= 5 && (w.startsWith(t) || t.startsWith(w)) && w.length >= 5));
}
// Si cerca no hay ninguno con ese nombre, se busca más lejos solo por nombre
async function buscarPorNombre(lat, lng, categoria, terminos) {
    if (!navigator.onLine || !terminos.size) return [];
    const re = [...terminos].map(t => t.replace(/[^a-z0-9]/g, '')).filter(Boolean).join('|');
    if (!re) return [];
    const tags = tagsFor(categoria);
    const parts = tags.flatMap(([k, v]) => ['name', 'brand', 'operator'].map(n =>
        `nwr["${k}"~"^(${v})$"]["${n}"~"${re}",i](around:20000,${lat},${lng});`)).join('\n');
    const els = await overpassQuery(`[out:json][timeout:20];(\n${parts}\n);out center tags 40;`);
    return (els || []).map(el => toPlace(el, lat, lng)).filter(Boolean).sort((a, b) => a.distancia - b.distancia);
}
// En la respuesta escrita: deja arriba los que coinciden y oculta el resto detrás de "Ver todos"
function enfocarRespuesta(cont, terminos) {
    if (!terminos.size) return false;
    let alguno = false;
    cont.querySelectorAll('.resp-lista').forEach(ul => {
        if (ul.dataset.enfocado) { alguno = true; return; }
        ul.dataset.enfocado = '1';
        const lis = [...ul.children];
        const si = lis.filter(li => coincideNombre(li.textContent, terminos));
        if (!si.length) return;
        alguno = true;
        si.forEach(li => li.classList.add('resp-destacado'));
        const no = lis.filter(li => !si.includes(li));
        if (!no.length) return;
        no.forEach(li => li.hidden = true);
        const b = document.createElement('button');
        b.type = 'button'; b.className = 'btn-ver-todos';
        b.textContent = `Ver los otros ${no.length}`;
        b.addEventListener('click', () => { no.forEach(li => li.hidden = false); b.remove(); });
        ul.insertAdjacentElement('afterend', b);
    });
    return alguno;
}

// --- Respuesta de intención con sistema híbrido ---
async function showIntentResponse(intent, userLat, userLng, targetLang, opts = {}) {
    const hasTarget = targetLang && targetLang !== 'auto' && targetLang !== 'es';
    const fija = hasTarget && intent['respuesta_' + targetLang];
    const nombreIdioma = hasTarget ? langName(targetLang) : '';
    intentResponse.innerHTML = `
        <div class="intent-es">${formatRespuesta(intent.respuesta_es, 'es')}</div>
        ${fija ? `<div class="intent-target" lang="${targetLang}"><p class="resp-idioma">Para el turista · ${escapeHtml(nombreIdioma)}</p>${formatRespuesta(fija, targetLang)}</div>`
               : hasTarget ? `<div class="intent-target" lang="${targetLang}"><p class="resp-idioma">Para el turista · ${escapeHtml(nombreIdioma)}</p><p class="cargando-txt">Traduciendo…</p></div>` : ''}
    `;
    if (hasTarget && !fija) {
        const el = intentResponse.querySelector('.intent-target');
        translateText(intent.respuesta_es, 'es', targetLang).then(t => {
            if (!el.isConnected) return;
            if (t && t !== intent.respuesta_es) {
                el.innerHTML = `<p class="resp-idioma">Para el turista · ${escapeHtml(nombreIdioma)}</p>${formatRespuesta(t, targetLang)}`;
            } else el.remove();
        }, () => { if (el.isConnected) el.remove(); });
    }
    const terminos = opts.sinFiltro ? new Set() : terminosBuscados(opts.textos, intent);
    enfocarRespuesta(intentResponse.querySelector('.intent-es'), terminos);
    const tgtBox = intentResponse.querySelector('.intent-target');
    if (tgtBox && terminos.size) {
        new MutationObserver((m, obs) => { if (tgtBox.querySelector('.resp-lista')) { obs.disconnect(); enfocarRespuesta(tgtBox, terminos); } })
            .observe(tgtBox, { childList: true, subtree: true });
        enfocarRespuesta(tgtBox, terminos);
    }
    intentResponse.classList.remove('hidden');
    if (!opts.keepResult) resultadoDiv.classList.add('hidden');

    // En el modo turista no se lee nada en voz alta: solo suena si se toca 🔊

    // Dudas generales (clima, propina, enchufes…): solo la respuesta, sin mapa
    if (!intent.categoria && !(intent.lugares || []).length) {
        mapContainer.classList.add('hidden');
        updateStatus('Respuesta lista. Mostrale la pantalla al turista.');
        return;
    }
    mapContainer.classList.remove('hidden');
    renderEmergencyBanner(intent);

    const value = intent.categoria && intent.categoria.value;
    const tipoTexto = (TYPE_LABELS[value] || 'lugares').toLowerCase();
    mapTitle.textContent = !intent.categoria ? 'Cómo llegar' : userLat ? `${TYPE_LABELS[value] || 'Lugares'} cerca tuyo` : 'Lugares de referencia';

    const baseLat = userLat || -24.7883;
    const baseLng = userLng || -65.4106;
    initMap(baseLat, baseLng);
    markersLayer.clearLayers();
    placesList.innerHTML = '<li class="cargando">Buscando cerca tuyo…</li>';

    // 1) Lugares reales alrededor del usuario
    let lugares = [];
    let sinServidor = false;
    if (userLat && userLng && intent.categoria) {
        lugares = await searchPlaces(userLat, userLng, intent.categoria, radius => {
            updateStatus(`Buscando ${tipoTexto} en ${radius >= 1000 ? radius / 1000 + ' km' : radius + ' m'}…`);
        });
        sinServidor = lugares.length === 0;
    }

    // 2) Lugares fijos de referencia (se agregan si no están repetidos)
    (intent.lugares || []).forEach(l => {
        const dup = lugares.some(x =>
            (Math.abs(x.lat - l.lat) < 0.0006 && Math.abs(x.lng - l.lng) < 0.0006) ||
            (normText(x.nombre) === normText(l.nombre) && distanciaMetros(x.lat, x.lng, l.lat, l.lng) < 1500));
        if (dup) return;
        lugares.push({
            ...l,
            fuente: 'fijo',
            distancia: userLat ? distanciaMetros(userLat, userLng, l.lat, l.lng) : null
        });
    });

    // ¿Pidió un lugar en concreto por su nombre?
    let filtroNombre = '';
    mapContainer.querySelectorAll('.aviso-nombre').forEach(e => e.remove());
    if (terminos.size && intent.categoria) {
        let elegidos = lugares.filter(l => coincideNombre(`${l.nombre} ${l.marca || ''}`, terminos));
        if (!elegidos.length && userLat) {
            updateStatus('Buscando ese nombre en toda la ciudad…');
            elegidos = (await buscarPorNombre(userLat, userLng, intent.categoria, terminos))
                .filter(l => coincideNombre(`${l.nombre} ${l.marca || ''}`, terminos));
        }
        const marca = [...terminos].find(t => MARCAS_CONOCIDAS.has(t)) || '';
        if (elegidos.length) {
            lugares = elegidos;
            filtroNombre = elegidos[0].nombre;
        } else if (marca) {
            const aviso = document.createElement('p');
            aviso.className = 'aviso-nombre';
            aviso.innerHTML = `No encontré «${escapeHtml(capital(marca))}» cerca. Te muestro los más cercanos parecidos. ` +
                `<a href="https://www.google.com/maps/search/${encodeURIComponent((TYPE_LABELS[value] || '') + ' ' + marca)}/@${baseLat},${baseLng},14z" target="_blank" rel="noopener">Buscarlo en Google Maps</a>`;
            mapTitle.insertAdjacentElement('afterend', aviso);
        }
    }

    if (userLat) lugares.sort((a, b) => (a.distancia ?? 1e9) - (b.distancia ?? 1e9));
    lugares = lugares.slice(0, 15);
    if (filtroNombre) {
        mapTitle.textContent = `${filtroNombre.length < 30 ? filtroNombre : capital([...terminos][0])} · ${lugares.length === 1 ? '1 lugar' : lugares.length + ' lugares'}`;
        const ver = document.createElement('button');
        ver.type = 'button'; ver.className = 'btn-ver-todos aviso-nombre';
        ver.textContent = 'Ver todos los de esta categoría';
        ver.addEventListener('click', () => showIntentResponse(intent, userLat, userLng, targetLang, { ...opts, sinFiltro: true }));
        mapTitle.insertAdjacentElement('afterend', ver);
    }

    // 3) Dibujar
    placesList.innerHTML = '';
    const bounds = [];
    if (userLat && userLng) {
        L.circleMarker([userLat, userLng], {
            radius: 8, color: '#fff', weight: 3, fillColor: '#1d6fa5', fillOpacity: 1
        }).addTo(markersLayer).bindPopup('Estás aquí');
        bounds.push([userLat, userLng]);
    }

    if (lugares.length === 0) {
        placesList.innerHTML = `<li class="sin-resultados">No encontramos ${escapeHtml(tipoTexto)} cerca.
            <a href="https://www.google.com/maps/search/${encodeURIComponent(TYPE_LABELS[value] || intent.keywords[0])}/@${baseLat},${baseLng},15z"
               target="_blank" rel="noopener">Buscar en Google Maps</a></li>`;
        updateStatus(sinServidor ? 'El servicio de mapas no respondió. Probá de nuevo en un momento.' : 'Sin resultados cercanos.', sinServidor);
        return;
    }

    lugares.forEach((l, i) => {
        const color = l.fuente === 'fijo' ? '#23262B' : '#B3132B';
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div class="pin" style="background:${color}">${i + 1}</div>`,
            iconSize: [24, 24], iconAnchor: [12, 12]
        });
        const nombre = escapeHtml(l.nombre);
        const comoLlegar = `<a href="${linkComoLlegar(l)}" target="_blank" rel="noopener">Cómo llegar</a>`;
        L.marker([l.lat, l.lng], { icon }).addTo(markersLayer)
            .bindPopup(`<strong>${nombre}</strong><br>${escapeHtml(l.direccion)}<br>${comoLlegar}`);
        bounds.push([l.lat, l.lng]);

        const li = document.createElement('li');
        li.className = 'lugar';
        const tel = l.telefono ? l.telefono.split(';')[0].trim() : '';
        li.innerHTML = `
            <div class="lugar-num" style="background:${color}">${i + 1}</div>
            <div class="lugar-info">
                <strong>${nombre}</strong>
                ${l.tipo && l.tipo !== l.nombre ? `<span class="lugar-tipo">${escapeHtml(l.tipo)}</span>` : ''}
                ${l.emergencia ? '<span class="badge-guardia">Guardia</span>' : ''}
                ${l.fuente === 'fijo' ? '<span class="badge-fijo">⭐ Recomendado</span>' : ''}
                <small>${escapeHtml(l.direccion)}</small>
                ${l.distancia != null ? `<small class="lugar-dist">${formatDistancia(l.distancia)}</small>` : ''}
                ${window.HSExtras ? HSExtras.hoursBlockHtml(l.horario) : ''}
                <div class="lugar-acciones">
                    ${TOURIST_VALUES.has(value) ? '<button type="button" class="btn-mini btn-historia">📖 Historia</button>' : ''}
                    <button type="button" class="btn-mini btn-qr">📱 Mostrar QR</button>
                    <a class="btn-mini" href="${linkComoLlegar(l)}" target="_blank" rel="noopener">🧭 Cómo llegar</a>
                    ${l.distancia == null || (l.distancia > 900 && l.distancia < 40000) ? `<a class="btn-mini btn-bus" href="${linkColectivo(l)}" target="_blank" rel="noopener">🚌 En colectivo</a>` : ''}
                    ${tel ? `<a class="btn-mini" href="tel:${tel.replace(/[^\d+]/g, '')}">📞 Llamar</a>` : ''}
                </div>
                <div class="lugar-historia hidden"></div>
            </div>`;
        const btnQR = li.querySelector('.btn-qr');
        if (btnQR) btnQR.addEventListener('click', () => HSExtras.showPlaceQR(l, targetLang));
        const btnSem = li.querySelector('.btn-semana');
        if (btnSem) btnSem.addEventListener('click', () => {
            const sem = li.querySelector('.semana');
            const abierta = !sem.classList.toggle('hidden');
            btnSem.textContent = abierta ? 'Ocultar días y horarios ▴' : 'Ver días y horarios ▾';
        });
        const btnH = li.querySelector('.btn-historia');
        if (btnH) {
            const box = li.querySelector('.lugar-historia');
            btnH.addEventListener('click', async (ev) => {
                if (!box.classList.contains('hidden') && box.dataset.listo) { box.classList.add('hidden'); return; }
                const ok = await showHistory(l, box, targetLang);
                box.dataset.listo = ok ? '1' : '';
                // Si la abrió una persona, que se vea completa (la automática no mueve la pantalla)
                if (ev.isTrusted) li.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
            });
        }
        li.querySelector('.lugar-info strong').addEventListener('click', () => map.setView([l.lat, l.lng], 17));
        placesList.appendChild(li);
    });

    if (bounds.length > 1) {
        // Encuadrar al usuario y los 5 más cercanos para que se vea bien el entorno
        map.fitBounds(bounds.slice(0, userLat ? 6 : bounds.length), { padding: [30, 30], maxZoom: 16 });
    } else {
        map.setView(bounds[0], 15);
    }

    // En lugares turísticos se abre sola la reseña del más cercano
    if (TOURIST_VALUES.has(value)) {
        const primero = placesList.querySelector('.btn-historia');
        if (primero) primero.click();
    }

    const cerca = lugares[0];
    updateStatus(userLat && cerca.distancia != null
        ? `El más cercano: ${cerca.nombre}, a ${formatDistancia(cerca.distancia)}.`
        : `Mostrando ${lugares.length} lugares de referencia (activá la ubicación para ver los cercanos).`);
}

// Números de emergencia para categorías urgentes
function renderEmergencyBanner(intent) {
    const value = intent.categoria && intent.categoria.value;
    const old = document.getElementById('emergency-banner');
    if (old) old.remove();
    if (!URGENT.has(value) || value === 'pharmacy') return;
    const div = document.createElement('div');
    div.id = 'emergency-banner';
    div.className = 'emergency-banner';
    div.innerHTML = `<strong>¿Es una emergencia? / Emergency?</strong>
        <div class="emergency-links">
            <a href="tel:107">🚑 107 Ambulancia</a>
            <a href="tel:911">🚓 911 Policía</a>
            <a href="tel:100">🚒 100 Bomberos</a>
        </div>`;
    mapContainer.prepend(div);
}

// --- Reconocimiento de voz ---
function setupSpeechRecognition() {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (ANDROID) {
        // Reconocimiento de voz nativo de Android, con la misma forma que el del navegador
        recognition = {
            lang: 'en-US',
            start() { ANDROID.startListening(this.lang); },
            stop() { ANDROID.stopListening(); }
        };
        window.__androidSpeech = {
            onStart: () => recognition.onstart && recognition.onstart(),
            onEnd: () => recognition.onend && recognition.onend(),
            onError: err => recognition.onerror && recognition.onerror({ error: err }),
            onResult: text => recognition.onresult && recognition.onresult({ results: [[{ transcript: text }]] })
        };
    } else if (!SpeechRecognition) {
        updateStatus('Tu navegador no soporta el reconocimiento de voz. Usá Chrome o Edge.', true);
        btnHablar.disabled = true;
        return;
    } else {
        recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = false;
    }

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
        else if (event.error === 'network') msg = 'El dictado por voz necesita internet. Escribí el texto.';
        else if (event.error === 'language-unavailable') msg = 'Para dictar sin internet falta bajar el idioma en el teléfono: Ajustes de la app Google > Voz > Reconocimiento de voz sin conexión. Mientras tanto, escribí el texto.';
        else if (event.error === 'not-supported') msg = 'Este teléfono no tiene reconocimiento de voz.';
        else if (event.error === 'no-speech') msg = 'No se detectó voz. Intentá de nuevo.';
        updateStatus(msg, true);
    };
    recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        textoEntrada.value = mayusculaInicial(transcript);
        if (cleanInput(transcript)) {
            updateStatus('Texto capturado. Traduciendo...');
            handleTranslate();
        } else {
            updateStatus('No se entendió. Intentá de nuevo.', true);
        }
    };
}

// --- Flujo principal ---
let translateSeq = 0;

function showRetry(label, fn) {
    let b = document.getElementById('btn-reintentar');
    if (!b) {
        b = document.createElement('button');
        b.id = 'btn-reintentar';
        b.type = 'button';
        b.className = 'btn-reintentar';
        statusText.insertAdjacentElement('afterend', b);
    }
    b.textContent = label;
    b.onclick = () => { hideRetry(); fn(); };
    b.hidden = false;
}
function hideRetry() {
    const b = document.getElementById('btn-reintentar');
    if (b) b.hidden = true;
}

function setCheck(html, warn) {
    let el = document.getElementById('comprobacion');
    if (!el) {
        el = document.createElement('p');
        el.id = 'comprobacion';
        el.className = 'comprobacion';
        translationResult.insertAdjacentElement('afterend', el);
    }
    el.innerHTML = html || '';
    el.classList.toggle('warn', !!warn);
    el.hidden = !html;
}

// Traduce de vuelta al español para que veas qué va a entender el turista
async function comprobarTraduccion(original, traducido, target, seq) {
    setCheck('<span class="comp-cargando">Comprobando la traducción…</span>');
    try {
        const vuelta = await translateFull(traducido, target, 'es');
        if (seq !== translateSeq) return;
        const p = parecido(original, vuelta.text);
        if (p >= 0.5) {
            setCheck(`✔ El turista va a entender: «${escapeHtml(vuelta.text)}»`);
        } else {
            setCheck(`⚠️ Puede que no se entienda bien. Vuelto al español dice: «${escapeHtml(vuelta.text)}». Probá decirlo con palabras más simples.`, true);
        }
    } catch (e) {
        if (seq === translateSeq) setCheck('');
    }
}

async function handleTranslate() {
    const text = cleanInput(textoEntrada.value);
    if (!text) {
        updateStatus('Escribí o dictá algo primero.', true);
        return;
    }
    const seq = ++translateSeq;
    hideRetry();
    setCheck('');
    warmPosition();   // la ubicación se va buscando mientras se traduce

    const langCode = idiomaSelect.value;

    resultadoDiv.classList.add('hidden');
    intentResponse.classList.add('hidden');
    mapContainer.classList.add('hidden');

    // --- Modo respuesta: español -> idioma del visitante ---
    if (direction === 'fromEs') {
        const target = langCode !== 'auto' ? langCode : lastVisitorLang;
        if (!target) {
            updateStatus('Elegí arriba el idioma del turista (o traducí primero algo que él diga).', true);
            idiomaSelect.focus();
            return;
        }
        updateStatus('Traduciendo...');
        btnTraducir.disabled = true;
        try {
            const r = await translateFull(text, 'es', target);
            if (seq !== translateSeq) return;
            showResult(r.text, target, `ESPAÑOL → ${langName(target).toUpperCase()}`);
            speak(r.text, speechCode(target));
            updateStatus(r.provider === 'android'
                ? 'Traducido sin internet. Mostrale la pantalla o tocá 🔊.'
                : 'Traducción lista. Mostrale la pantalla o tocá 🔊.');
            if (navigator.onLine && r.provider !== 'android') comprobarTraduccion(text, r.text, target, seq);
            // Si lo que escribiste es un lugar (catedral, museo, hospital…), muestra el mapa y la reseña
            const intentYo = detectIntent(text);
            if (intentYo) {
                updateStatus('Buscando el lugar cerca tuyo...');
                const pos = await getUserPosition();
                if (seq !== translateSeq) return;
                await showIntentResponse(intentYo, pos && pos.lat, pos && pos.lng, target, { keepResult: true, textos: [text] });
            }
        } catch (error) {
            if (seq !== translateSeq) return;
            updateStatus(error.message, true);
            showRetry('🔁 Reintentar', handleTranslate);
        } finally {
            if (seq === translateSeq) btnTraducir.disabled = false;
        }
        return;
    }

    // --- Modo normal: idioma del visitante -> español ---
    updateStatus('Traduciendo...');
    btnTraducir.disabled = true;
    let r, aviso = '';
    try {
        // Se detecta el idioma real aunque esté elegido otro (el turista puede hablar otro idioma)
        // (quechua, aimara y guaraní no se detectan bien, y sin internet se respeta lo elegido)
        const detectar = langCode === 'auto' || (navigator.onLine && !['qu', 'ay', 'gn'].includes(langCode));
        r = await translateFull(text, detectar ? 'auto' : langCode, 'es');
        const palabras = text.split(/\s+/).length;
        if (langCode !== 'auto' && r.detected && r.detected !== langCode) {
            if (r.detected === 'es' && palabras >= 3) {
                if (seq !== translateSeq) return;
                updateStatus('Esto ya está en español. ¿Se lo querés decir al turista?', true);
                showRetry('🙋 Sí, traducírselo a él', () => {
                    setDirection('fromEs');
                    textoEntrada.value = text;
                    handleTranslate();
                });
                return;
            } else if (palabras >= 3 && CONFIG.languages[r.detected]) {
                aviso = `Parece ${langName(r.detected).toLowerCase()}, no ${langName(langCode).toLowerCase()}: cambié el idioma.`;
                idiomaSelect.value = r.detected;
                idiomaSelect.dispatchEvent(new Event('change'));
            } else {
                // Frase corta: la detección no es segura, se respeta el idioma elegido
                r = await translateFull(text, langCode, 'es');
            }
        }
    } catch (error) {
        if (seq !== translateSeq) return;
        console.error('Error en la traducción:', error);
        updateStatus(error.message, true);
        showRetry('🔁 Reintentar', handleTranslate);
        return;
    } finally {
        if (seq === translateSeq) btnTraducir.disabled = false;
    }
    if (seq !== translateSeq) return;
    const textoEs = r.text, detected = r.detected;

    // Idioma real del visitante: el elegido o el detectado
    const visitorLang = idiomaSelect.value !== 'auto' ? idiomaSelect.value : detected;
    if (visitorLang && visitorLang !== 'es') lastVisitorLang = visitorLang;

    const intent = detectIntent(textoEs, text);
    const targetForReply = visitorLang && visitorLang !== 'es' ? visitorLang : null;

    if (intent) {
        updateStatus(aviso || 'Obteniendo tu ubicación...', !!aviso);
        const pos = await getUserPosition();
        if (seq !== translateSeq) return;
        if (!pos) updateStatus('Sin ubicación. Mostrando lugares de referencia.', true);
        await showIntentResponse(intent, pos && pos.lat, pos && pos.lng, targetForReply, { textos: [textoEs, text] });
    } else {
        const origen = visitorLang ? langName(visitorLang).toUpperCase() : 'DETECTADO';
        showResult(textoEs, 'es', `${origen} → ESPAÑOL`);
        updateStatus(aviso || (langCode === 'auto' && detected
            ? `Idioma detectado: ${langName(detected)}.`
            : (r.provider === 'android' ? 'Traducido sin internet.' : 'Traducción completada.')), !!aviso);
    }
}

function showResult(text, lang, label, original) {
    translationResult.textContent = text;
    translationResult.dir = (CONFIG.languages[lang] && CONFIG.languages[lang].rtl) ? 'rtl' : 'ltr';
    addToHistory({ original: original || textoEntrada.value.trim(), text, lang, label });
    translationResult.setAttribute('lang', lang);
    translationResult.dataset.lang = lang;
    resultLabel.textContent = label || 'TRADUCCIÓN';
    resultadoDiv.classList.remove('hidden');
}

// --- Dirección de traducción ---
function updateDirectionUI() {
    const toEs = direction === 'toEs';
    btnModoTurista.classList.toggle('activo', toEs);
    btnModoYo.classList.toggle('activo', !toEs);
    btnModoTurista.setAttribute('aria-pressed', String(toEs));
    btnModoYo.setAttribute('aria-pressed', String(!toEs));
    labelTexto.textContent = toEs ? 'Lo que dice el turista' : 'Lo que querés decirle';
    textoEntrada.placeholder = toEs
        ? 'Escribí o dictá lo que dice el turista...'
        : 'Escribí o dictá en español...';
    notaIdioma.textContent = toEs
        ? 'Se traduce al español.'
        : 'Se traduce al idioma del turista y se lee en voz alta.';
}

// --- Event Listeners ---
btnHablar.addEventListener('click', () => {
    if (!recognition) return;
    if (isListening) {
        recognition.stop();
    } else {
        if (direction === 'fromEs') {
            recognition.lang = 'es-AR';
        } else {
            const langCode = idiomaSelect.value !== 'auto' ? idiomaSelect.value : lastVisitorLang;
            recognition.lang = (langCode && speechCode(langCode)) || navigator.language || 'en-US';
        }
        recognition.start();
    }
});

btnTraducir.addEventListener('click', handleTranslate);

// Ctrl/Cmd + Enter traduce
textoEntrada.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) handleTranslate();
});

function setDirection(dir) {
    if (direction === dir) return;
    direction = dir;
    if (typeof setCheck === 'function') setCheck('');
    hideRetry();
    textoEntrada.value = '';
    resultadoDiv.classList.add('hidden');
    intentResponse.classList.add('hidden');
    mapContainer.classList.add('hidden');
    updateDirectionUI();
    textoEntrada.focus();
}
btnModoTurista.addEventListener('click', () => setDirection('toEs'));
btnModoYo.addEventListener('click', () => setDirection('fromEs'));
updateDirectionUI();

btnEscuchar.addEventListener('click', () => {
    const texto = translationResult.textContent;
    const lang = translationResult.dataset.lang || 'es';
    if (texto) speak(texto, lang === 'es' ? 'es-AR' : speechCode(lang));
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


// ===== Selector de idiomas =====
(function setupLanguages() {
    const frag = document.createDocumentFragment();
    Object.entries(CONFIG.languages).forEach(([code, cfg]) => {
        const opt = document.createElement('option');
        opt.value = code;
        opt.textContent = cfg.label || cfg.name;
        frag.appendChild(opt);
    });
    idiomaSelect.appendChild(frag);
    try {
        const saved = localStorage.getItem('hablaSaltaIdioma');
        if (saved && CONFIG.languages[saved]) idiomaSelect.value = saved;
    } catch (e) {}
    idiomaSelect.addEventListener('change', () => {
        try { localStorage.setItem('hablaSaltaIdioma', idiomaSelect.value); } catch (e) {}
        if (idiomaSelect.value !== 'auto') lastVisitorLang = idiomaSelect.value;
    });
})();

// ===== Pantalla grande para mostrarle al turista =====
const overlay = document.getElementById('fullscreen');
function showFullscreen() {
    const texto = translationResult.textContent;
    if (!texto) return;
    const lang = translationResult.dataset.lang || 'es';
    const fsText = document.getElementById('fullscreen-text');
    fsText.textContent = texto;
    fsText.lang = lang;
    fsText.dir = translationResult.dir;
    // Letra lo más grande posible según el largo
    fsText.style.fontSize = `clamp(1.6rem, ${Math.max(4, 22 - texto.length / 8)}vw, 5.5rem)`;
    overlay.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}
function hideFullscreen() {
    overlay.classList.add('hidden');
    document.body.style.overflow = '';
}
document.getElementById('btn-mostrar').addEventListener('click', showFullscreen);
overlay.addEventListener('click', e => { if (!e.target.closest('button')) hideFullscreen(); });
document.getElementById('fs-cerrar').addEventListener('click', hideFullscreen);
document.getElementById('fs-escuchar').addEventListener('click', () => btnEscuchar.click());
document.getElementById('fs-girar').addEventListener('click', () =>
    document.getElementById('fullscreen-text').classList.toggle('girado'));
document.addEventListener('keydown', e => { if (e.key === 'Escape') hideFullscreen(); });

// ===== Historial =====
const HISTORY_KEY = 'hablaSaltaHistorial';
let history = [];
try { history = JSON.parse(localStorage.getItem(HISTORY_KEY)) || []; } catch (e) { history = []; }

function addToHistory(item) {
    if (!item.text) return;
    history = history.filter(h => !(h.text === item.text && h.lang === item.lang));
    history.unshift({ ...item, t: Date.now() });
    history = history.slice(0, 15);
    try { localStorage.setItem(HISTORY_KEY, JSON.stringify(history)); } catch (e) {}
    renderHistory();
}

function renderHistory() {
    const box = document.getElementById('historial');
    const list = document.getElementById('historial-lista');
    if (!box) return;
    box.classList.toggle('hidden', history.length === 0);
    list.innerHTML = '';
    history.forEach(h => {
        const li = document.createElement('li');
        li.innerHTML = `<small>${escapeHtml(h.label || '')}</small>
            <span class="h-orig">${escapeHtml(h.original || '')}</span>
            <span class="h-trad" dir="auto">${escapeHtml(h.text)}</span>`;
        li.addEventListener('click', () => {
            translationResult.textContent = h.text;
            setCheck('');
            translationResult.dataset.lang = h.lang;
            translationResult.dir = (CONFIG.languages[h.lang] && CONFIG.languages[h.lang].rtl) ? 'rtl' : 'ltr';
            resultLabel.textContent = h.label || 'TRADUCCIÓN';
            resultadoDiv.classList.remove('hidden');
            resultadoDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
        });
        list.appendChild(li);
    });
}
document.getElementById('btn-borrar-historial').addEventListener('click', () => {
    history = [];
    try { localStorage.removeItem(HISTORY_KEY); } catch (e) {}
    renderHistory();
});

// ===== Botón limpiar texto =====
document.getElementById('btn-limpiar').addEventListener('click', () => {
    textoEntrada.value = '';
    textoEntrada.focus();
});

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    setupSpeechRecognition();
    renderHistory();
    if (idiomaSelect.value !== 'auto') lastVisitorLang = idiomaSelect.value;
    updateStatus('Presioná "Hablar" para dictar.');
});
// ===== CAMBIO DE TEMA (CLARO / OSCURO) =====
(function setupThemeToggle() {
    const btn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!btn || !icon) return;

    function aplicarTema(tema) {
        document.documentElement.setAttribute('data-theme', tema);
        icon.textContent = tema === 'dark' ? '☀️' : '🌙';
        localStorage.setItem('tema', tema);

        // Actualizar meta theme-color para la barra del navegador
        const meta = document.querySelector('meta[name="theme-color"]');
        if (meta) meta.setAttribute('content', tema === 'dark' ? '#7E0E1F' : '#B3132B');
    }

    // Tema inicial (el script del <head> ya lo puso, pero aseguramos el ícono)
    const temaActual = document.documentElement.getAttribute('data-theme') || 'light';
    icon.textContent = temaActual === 'dark' ? '☀️' : '🌙';

    // Click para alternar
    btn.addEventListener('click', () => {
        const actual = document.documentElement.getAttribute('data-theme') || 'light';
        aplicarTema(actual === 'dark' ? 'light' : 'dark');
    });

    // Si el usuario cambia el tema del sistema operativo, seguimos (solo si no eligió manualmente)
    window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
        if (!localStorage.getItem('tema')) {
            aplicarTema(e.matches ? 'dark' : 'light');
        }
    });
})();

// --- Arranque rápido: abre la conexión con el traductor y busca la ubicación antes de que se necesite ---
(function precalentar() {
    const ping = () => { if (navigator.onLine) googleOnce('hola', 'es', 'en', 'gtx', 4000).catch(() => {}); };
    setTimeout(ping, 1500);
    window.addEventListener('online', ping);
    try {
        if (navigator.permissions) {
            navigator.permissions.query({ name: 'geolocation' }).then(p => { if (p.state === 'granted') warmPosition(); }).catch(() => {});
        }
    } catch (e) {}
    ['focus', 'pointerdown'].forEach(ev => textoEntrada.addEventListener(ev, () => warmPosition(), { passive: true }));
    btnHablar.addEventListener('pointerdown', () => warmPosition(), { passive: true });
})();

// --- Mayúscula al empezar cada oración (al escribir y al dictar) ---
function mayusculaInicial(t) {
    return String(t).replace(/(^\s*|[.!?¡¿]\s+|\n\s*)([¡¿"«(]*)(\p{Ll})/gu, (m, a, b, c) => a + b + c.toLocaleUpperCase());
}
textoEntrada.addEventListener('input', e => {
    if (e.isComposing) return;
    const v = textoEntrada.value, nuevo = mayusculaInicial(v);
    if (nuevo !== v) {
        const pos = textoEntrada.selectionStart;
        textoEntrada.value = nuevo;
        try { textoEntrada.setSelectionRange(pos, pos); } catch (err) {}
    }
});

// --- Aviso de versión nueva: revisa version.js publicado y ofrece actualizar ---
(function avisoActualizacion() {
    const actual = parseInt(window.APP_VERSION, 10);
    if (!actual) return;
    let mostrado = 0, ultimaRevision = 0;
    const descartada = () => { try { return parseInt(localStorage.getItem('hsVersionDescartada'), 10) || 0; } catch (e) { return 0; } };

    function mostrar(nueva) {
        if (mostrado === nueva || nueva <= descartada()) return;
        mostrado = nueva;
        let el = document.getElementById('aviso-version');
        if (!el) {
            el = document.createElement('div');
            el.id = 'aviso-version';
            el.className = 'aviso-version';
            el.setAttribute('role', 'status');
            document.body.appendChild(el);
        }
        el.innerHTML = `<span>Hay una versión nueva (v${nueva})</span>
            <button type="button" class="av-actualizar">Actualizar</button>
            <button type="button" class="av-cerrar" aria-label="Ahora no">✕</button>`;
        el.querySelector('.av-actualizar').addEventListener('click', () => {
            el.querySelector('span').textContent = 'Actualizando…';
            location.reload();
        });
        el.querySelector('.av-cerrar').addEventListener('click', () => {
            try { localStorage.setItem('hsVersionDescartada', String(nueva)); } catch (e) {}
            el.remove();
        });
        requestAnimationFrame(() => el.classList.add('visible'));
    }

    async function revisar() {
        if (!navigator.onLine || location.protocol === 'file:') return;
        if (Date.now() - ultimaRevision < 60000) return;
        ultimaRevision = Date.now();
        try {
            const res = await fetch(`version.js?t=${Date.now()}`, { cache: 'no-store' });
            if (!res.ok) return;
            const m = (await res.text()).match(/APP_VERSION\s*=\s*["'](\d+)["']/);
            const nueva = m ? parseInt(m[1], 10) : 0;
            // No interrumpir una descarga sin internet en curso
            if (nueva > actual && !(typeof downloading !== 'undefined' && downloading)) mostrar(nueva);
        } catch (e) { /* sin conexión: se revisa más tarde */ }
    }

    setTimeout(revisar, 4000);
    setInterval(revisar, 5 * 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') revisar(); });
    window.addEventListener('online', revisar);
})();

// ===== Clima arriba a la izquierda (Open-Meteo, sin clave). Usa la ubicación del teléfono o Salta capital =====
(function clima() {
    const chip = document.getElementById('clima');
    const panel = document.getElementById('clima-panel');
    if (!chip || !panel) return;
    const SALTA = { lat: -24.7883, lng: -65.4106 };
    const KEY = 'hablaSaltaClima';
    // Códigos WMO -> ícono y texto
    const COD = {
        0: ['☀️', 'Despejado'], 1: ['🌤️', 'Mayormente despejado'], 2: ['⛅', 'Parcialmente nublado'], 3: ['☁️', 'Nublado'],
        45: ['🌫️', 'Niebla'], 48: ['🌫️', 'Niebla'], 51: ['🌦️', 'Llovizna'], 53: ['🌦️', 'Llovizna'], 55: ['🌦️', 'Llovizna'],
        56: ['🌧️', 'Llovizna helada'], 57: ['🌧️', 'Llovizna helada'], 61: ['🌧️', 'Lluvia débil'], 63: ['🌧️', 'Lluvia'],
        65: ['🌧️', 'Lluvia fuerte'], 66: ['🌧️', 'Lluvia helada'], 67: ['🌧️', 'Lluvia helada'], 71: ['🌨️', 'Nieve débil'],
        73: ['🌨️', 'Nieve'], 75: ['❄️', 'Nieve fuerte'], 77: ['🌨️', 'Granizo fino'], 80: ['🌦️', 'Chaparrones'],
        81: ['🌧️', 'Chaparrones'], 82: ['⛈️', 'Chaparrones fuertes'], 85: ['🌨️', 'Nevadas'], 86: ['❄️', 'Nevadas fuertes'],
        95: ['⛈️', 'Tormenta'], 96: ['⛈️', 'Tormenta con granizo'], 99: ['⛈️', 'Tormenta con granizo']
    };
    const icono = (c, dia) => {
        const x = COD[c] || ['🌡️', ''];
        if (!dia && (c === 0 || c === 1)) return ['🌙', x[1]];
        return x;
    };
    const leer = () => { try { return JSON.parse(localStorage.getItem(KEY)); } catch (e) { return null; } };
    const guardar = d => { try { localStorage.setItem(KEY, JSON.stringify(d)); } catch (e) {} };

    function lugar(d) {
        return distanciaMetros(d.lat, d.lng, SALTA.lat, SALTA.lng) < 15000 ? 'Salta capital' : (d.propia ? 'Tu ubicación' : 'Salta capital');
    }

    function pintar(d) {
        if (!d || !d.actual) return;
        const [ic, txt] = icono(d.actual.codigo, d.actual.dia);
        chip.querySelector('.clima-icono').textContent = ic;
        chip.querySelector('.clima-temp').textContent = `${Math.round(d.actual.temp)}°`;
        chip.hidden = false;
        const viejo = Date.now() - d.t > 3 * 3600 * 1000;
        chip.classList.toggle('viejo', viejo);
        chip.setAttribute('aria-label', `Clima en ${lugar(d)}: ${Math.round(d.actual.temp)} grados, ${txt}`);
        const dias = (d.dias || []).map((x, i) => {
            const [di] = icono(x.codigo, true);
            const nombre = i === 0 ? 'Hoy' : i === 1 ? 'Mañana' :
                new Date(x.fecha + 'T12:00:00').toLocaleDateString('es-AR', { weekday: 'long' });
            return `<li><span class="cd-dia">${nombre}</span><span class="cd-ic">${di}</span>` +
                `<span class="cd-t"><b>${Math.round(x.max)}°</b> / ${Math.round(x.min)}°</span>` +
                `${x.lluvia >= 30 ? `<span class="cd-ll">💧 ${x.lluvia}%</span>` : '<span class="cd-ll"></span>'}</li>`;
        }).join('');
        const hace = Math.round((Date.now() - d.t) / 60000);
        panel.innerHTML = `
            <div class="cp-head">
                <span class="cp-ic">${ic}</span>
                <div><p class="cp-temp">${Math.round(d.actual.temp)}°</p><p class="cp-txt">${escapeHtml(txt)}</p></div>
            </div>
            <p class="cp-lugar">📍 ${escapeHtml(lugar(d))}</p>
            <p class="cp-det">Sensación ${Math.round(d.actual.sensacion)}° · Humedad ${d.actual.humedad}% · Viento ${Math.round(d.actual.viento)} km/h</p>
            <ul class="cp-dias">${dias}</ul>
            <p class="cp-pie">${viejo || !navigator.onLine ? `Último dato de hace ${hace >= 120 ? Math.round(hace / 60) + ' h' : hace + ' min'}` : 'Actualizado'} · Open-Meteo</p>`;
    }

    let cargando = false;
    async function actualizar(forzar) {
        const prev = leer();
        if (prev) pintar(prev);
        if (cargando || !navigator.onLine) return;
        const pos = (typeof lastPosition !== 'undefined' && lastPosition) || null;
        const donde = pos ? { lat: pos.lat, lng: pos.lng, propia: true } : { ...SALTA, propia: false };
        const mismoLugar = prev && distanciaMetros(prev.lat, prev.lng, donde.lat, donde.lng) < 5000;
        if (!forzar && prev && mismoLugar && Date.now() - prev.t < 30 * 60 * 1000) return;
        cargando = true;
        try {
            const url = `https://api.open-meteo.com/v1/forecast?latitude=${donde.lat.toFixed(3)}&longitude=${donde.lng.toFixed(3)}` +
                '&current=temperature_2m,apparent_temperature,relative_humidity_2m,weather_code,wind_speed_10m,is_day' +
                '&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max&forecast_days=4&timezone=auto';
            const res = await fetchWithTimeout(url, 8000);
            if (!res.ok) throw new Error('clima ' + res.status);
            const j = await res.json();
            const c = j.current, dl = j.daily;
            const d = {
                t: Date.now(), lat: donde.lat, lng: donde.lng, propia: donde.propia,
                actual: { temp: c.temperature_2m, sensacion: c.apparent_temperature, humedad: c.relative_humidity_2m,
                          codigo: c.weather_code, viento: c.wind_speed_10m, dia: c.is_day === 1 },
                dias: (dl.time || []).map((f, i) => ({ fecha: f, codigo: dl.weather_code[i], max: dl.temperature_2m_max[i],
                    min: dl.temperature_2m_min[i], lluvia: (dl.precipitation_probability_max || [])[i] ?? 0 }))
            };
            guardar(d);
            pintar(d);
        } catch (e) {
            console.warn('Clima:', e);
        } finally {
            cargando = false;
        }
    }

    chip.addEventListener('click', e => {
        e.stopPropagation();
        panel.hidden = !panel.hidden;
        if (!panel.hidden) actualizar();
    });
    document.addEventListener('click', e => { if (!panel.hidden && !panel.contains(e.target)) panel.hidden = true; });
    document.addEventListener('keydown', e => { if (e.key === 'Escape') panel.hidden = true; });

    actualizar();
    // Cuando llega la ubicación del teléfono, se pide el clima de ahí
    setTimeout(() => { if (typeof warmPosition === 'function') (warmPosition() || Promise.resolve()).then(() => actualizar()); }, 2500);
    setInterval(() => actualizar(), 30 * 60 * 1000);
    document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') actualizar(); });
    window.addEventListener('online', () => actualizar(true));
})();
