// --- Definición de intenciones ampliada ---
const INTENTS = [
    // ===== SERVICIOS BÁSICOS =====
    {
        keywords: ['saeta', 'tarjeta', 'cargar', 'sube', 'colectivo', 'bondi', 'bus', 'recarga'],
        respuesta_es: 'Podés cargar la tarjeta SAETA en kioscos, farmacias, terminal de ómnibus y centros de recarga oficiales.',
        respuesta_en: 'You can top up the SAETA card at kiosks, pharmacies, the bus terminal, and official recharge centers.',
        respuesta_pt: 'Você pode recarregar o cartão SAETA em quiosques, farmácias, terminal de ônibus e centros de recarga oficiais.',
        categoria: { key: 'amenity', value: 'payment_centre' }
    },
    {
        keywords: ['cajero', 'atm', 'extraer', 'efectivo', 'plata', 'dinero', 'cash'],
        respuesta_es: 'Tenés cajeros automáticos en bancos del centro. Buscá el logo de tu red (Visa, Mastercard, etc.).',
        respuesta_en: 'There are ATMs in downtown banks. Look for your network logo (Visa, Mastercard, etc.).',
        respuesta_pt: 'Há caixas eletrônicos em bancos do centro. Procure o logo da sua rede (Visa, Mastercard, etc.).',
        categoria: { key: 'amenity', value: 'atm' }
    },
    {
        keywords: ['dólar', 'dolar', 'cambio', 'exchange', 'currency', 'divisa', 'money', 'cambiar', 'plata'],
        respuesta_es: 'Hay casas de cambio en la calle Caseros y en la zona de la Plaza 9 de Julio. También podés cambiar en bancos.',
        respuesta_en: 'There are currency exchange offices on Caseros Street and around Plaza 9 de Julio. You can also exchange at banks.',
        respuesta_pt: 'Há casas de câmbio na rua Caseros e na região da Plaza 9 de Julio. Você também pode trocar em bancos.',
        categoria: { key: 'amenity', value: 'bureau_de_change' }
    },
    {
        keywords: ['wifi', 'internet', 'conexión', 'conexion', 'red'],
        respuesta_es: 'Hay WiFi gratis en la Plaza 9 de Julio, en bares del centro y en la terminal de ómnibus.',
        respuesta_en: 'There is free WiFi at Plaza 9 de Julio, in downtown bars, and at the bus terminal.',
        respuesta_pt: 'Tem WiFi grátis na Plaza 9 de Julio, em bares do centro e na terminal de ônibus.',
        categoria: { key: 'amenity', value: 'wifi' }
    },
    {
        keywords: ['taxi', 'remis', 'uber', 'cabify', 'viaje', 'transporte'],
        respuesta_es: 'Podés pedir un taxi por teléfono o en las paradas del centro. Uber y Cabify también funcionan en Salta.',
        respuesta_en: 'You can order a taxi by phone or at downtown stops. Uber and Cabify also work in Salta.',
        respuesta_pt: 'Você pode pedir um táxi por telefone ou nas paradas do centro. Uber e Cabify também funcionam em Salta.',
        categoria: { key: 'amenity', value: 'taxi' }
    },
    {
        keywords: ['baño', 'baños', 'toilet', 'toilets', 'sanitario', 'servicio', 'wc'],
        respuesta_es: 'Hay baños públicos en la Plaza 9 de Julio, en la terminal de ómnibus y en los principales centros comerciales.',
        respuesta_en: 'There are public toilets at Plaza 9 de Julio, the bus terminal, and major shopping centers.',
        respuesta_pt: 'Há banheiros públicos na Plaza 9 de Julio, na terminal de ônibus e nos principais shopping centers.',
        categoria: { key: 'amenity', value: 'toilets' }
    },
    // ===== SALUD =====
    {
        keywords: ['farmacia', 'farmacias', 'remedio', 'medicamento', 'pharmacy', 'drugstore'],
        respuesta_es: 'Tenés farmacias en el centro, como Farmacity y Farmacia del Valle. Algunas atienden las 24 horas.',
        respuesta_en: 'There are pharmacies downtown, such as Farmacity and Farmacia del Valle. Some are open 24 hours.',
        respuesta_pt: 'Há farmácias no centro, como Farmacity e Farmacia del Valle. Algumas ficam abertas 24 horas.',
        categoria: { key: 'amenity', value: 'pharmacy' }
    },
    {
        keywords: ['hospital', 'clínica', 'clinica', 'emergencia', 'médico', 'medico', 'doctor', 'sanatorio'],
        respuesta_es: 'El Hospital San Bernardo y el Hospital Materno Infantil son los principales. Para emergencias, llamá al 107.',
        respuesta_en: 'Hospital San Bernardo and Hospital Materno Infantil are the main ones. For emergencies, call 107.',
        respuesta_pt: 'O Hospital San Bernardo e o Hospital Materno Infantil são os principais. Para emergências, ligue 107.',
        categoria: { key: 'amenity', value: 'hospital' }
    },
    // ===== COMPRAS =====
    {
        keywords: ['supermercado', 'super', 'vea', 'carrefour', 'día', 'dia', 'coto', 'jumbo', 'changomas', 'compras', 'supermarket'],
        respuesta_es: 'Tenés Carrefour, Vea, Día y Coto en el centro y en los shoppings. Abren de lunes a sábado.',
        respuesta_en: 'There are Carrefour, Vea, Día, and Coto downtown and in shopping malls. They open Monday to Saturday.',
        respuesta_pt: 'Há Carrefour, Vea, Día e Coto no centro e nos shoppings. Abrem de segunda a sábado.',
        categoria: { key: 'shop', value: 'supermarket' }
    },
    {
        keywords: ['heladería', 'heladeria', 'helado', 'ice cream', 'gelato', 'postre'],
        respuesta_es: 'Las mejores heladerías son Gianni Helados, Volta y Heladería del Bosque. ¡Probá el helado artesanal!',
        respuesta_en: 'The best ice cream shops are Gianni Helados, Volta, and Heladería del Bosque. Try the artisanal ice cream!',
        respuesta_pt: 'As melhores sorveterias são Gianni Helados, Volta e Heladería del Bosque. Experimente o sorvete artesanal!',
        categoria: { key: 'amenity', value: 'ice_cream' }
    },
    // ===== TURISMO =====
    {
        keywords: ['museo', 'museos', 'maam', 'museum', 'cultura', 'historia'],
        respuesta_es: 'No te pierdas el MAAM, el Museo Histórico del Norte y el Museo Güemes. Están en el centro.',
        respuesta_en: 'Don\'t miss the MAAM, the Museo Histórico del Norte, and the Museo Güemes. They are downtown.',
        respuesta_pt: 'Não perca o MAAM, o Museo Histórico del Norte e o Museo Güemes. Eles ficam no centro.',
        categoria: { key: 'tourism', value: 'museum' }
    },
    {
        keywords: ['plaza', 'plaza 9 de julio', 'plaza principal', 'square'],
        respuesta_es: 'La Plaza 9 de Julio es el corazón de Salta. Rodeada de la Catedral, el Cabildo y el MAAM.',
        respuesta_en: 'Plaza 9 de Julio is the heart of Salta. Surrounded by the Cathedral, the Cabildo, and the MAAM.',
        respuesta_pt: 'A Plaza 9 de Julio é o coração de Salta. Cercada pela Catedral, pelo Cabildo e pelo MAAM.',
        categoria: { key: 'tourism', value: 'attraction' }
    },
    {
        keywords: ['cerro', 'san bernardo', 'teleférico', 'teleferico', 'mirador', 'vista'],
        respuesta_es: 'El Cerro San Bernardo tiene la mejor vista de la ciudad. Podés subir en teleférico o caminando.',
        respuesta_en: 'Cerro San Bernardo has the best view of the city. You can go up by cable car or walking.',
        respuesta_pt: 'O Cerro San Bernardo tem a melhor vista da cidade. Você pode subir de teleférico ou a pé.',
        categoria: { key: 'tourism', value: 'attraction' }
    },
    {
        keywords: ['iglesia', 'catedral', 'templo', 'church', 'religious'],
        respuesta_es: 'La Catedral Basílica está en la Plaza 9 de Julio. También podés visitar la Iglesia San Francisco.',
        respuesta_en: 'The Cathedral Basilica is at Plaza 9 de Julio. You can also visit the Church of San Francisco.',
        respuesta_pt: 'A Catedral Basílica fica na Plaza 9 de Julio. Você também pode visitar a Igreja San Francisco.',
        categoria: { key: 'amenity', value: 'place_of_worship' }
    },
    {
        keywords: ['restaurante', 'comer', 'comida', 'almorzar', 'cenar', 'restaurant', 'food'],
        respuesta_es: 'Hay restaurantes en la calle Balcarce y en la zona de la Plaza. Probá las empanadas salteñas.',
        respuesta_en: 'There are restaurants on Balcarce Street and around the Plaza. Try the salteñas empanadas.',
        respuesta_pt: 'Há restaurantes na rua Balcarce e na região da Plaza. Experimente as empanadas salteñas.',
        categoria: { key: 'amenity', value: 'restaurant' }
    },
    {
        keywords: ['bar', 'peña', 'pena', 'folclore', 'música', 'musica', 'nocturna', 'noche'],
        respuesta_es: 'La calle Balcarce es el epicentro de las peñas y bares. Hay música en vivo hasta la madrugada.',
        respuesta_en: 'Balcarce Street is the epicenter of peñas and bars. There is live music until dawn.',
        respuesta_pt: 'A rua Balcarce é o epicentro das peñas e bares. Há música ao vivo até o amanhecer.',
        categoria: { key: 'amenity', value: 'bar' }
    },
    {
        keywords: ['café', 'cafe', 'cafetería', 'cafeteria', 'desayuno', 'merienda'],
        respuesta_es: 'Hay cafés en el centro, como Café del Tiempo y Café Martínez. Ideales para el desayuno.',
        respuesta_en: 'There are cafes downtown, such as Café del Tiempo and Café Martínez. Ideal for breakfast.',
        respuesta_pt: 'Há cafés no centro, como Café del Tiempo e Café Martínez. Ideais para o café da manhã.',
        categoria: { key: 'amenity', value: 'cafe' }
    },
    {
        keywords: ['banco', 'bancos', 'bank', 'santander', 'galicia', 'macro', 'nación', 'nacion'],
        respuesta_es: 'Hay bancos en el centro, como Banco Macro, Santander y Galicia. Muchos tienen cajeros.',
        respuesta_en: 'There are banks downtown, such as Banco Macro, Santander, and Galicia. Many have ATMs.',
        respuesta_pt: 'Há bancos no centro, como Banco Macro, Santander e Galicia. Muitos têm caixas eletrônicos.',
        categoria: { key: 'amenity', value: 'bank' }
    },
    {
        keywords: ['policía', 'policia', 'comisaría', 'comisaria', 'seguridad', 'emergencia', 'policia'],
        respuesta_es: 'Para emergencias, llamá al 911. Hay comisarías en el centro y en los barrios.',
        respuesta_en: 'For emergencies, call 911. There are police stations downtown and in the neighborhoods.',
        respuesta_pt: 'Para emergências, ligue 911. Há delegacias no centro e nos bairros.',
        categoria: { key: 'amenity', value: 'police' }
    },
    {
        keywords: ['gasolina', 'combustible', 'nafta', 'ypf', 'shell', 'axion', 'fuel', 'gasolinera'],
        respuesta_es: 'Hay estaciones de servicio YPF, Shell y Axion en las principales avenidas.',
        respuesta_en: 'There are YPF, Shell, and Axion gas stations on the main avenues.',
        respuesta_pt: 'Há postos YPF, Shell e Axion nas principais avenidas.',
        categoria: { key: 'amenity', value: 'fuel' }
    },
    {
        keywords: ['estacionamiento', 'parking', 'aparcar', 'garage'],
        respuesta_es: 'Hay estacionamientos en el centro y en los shoppings. También podés estacionar en la calle.',
        respuesta_en: 'There are parking lots downtown and in shopping malls. You can also park on the street.',
        respuesta_pt: 'Há estacionamentos no centro e nos shoppings. Você também pode estacionar na rua.',
        categoria: { key: 'amenity', value: 'parking' }
    },
    {
        keywords: ['correo', 'correo argentino', 'post office', 'encomienda'],
        respuesta_es: 'El Correo Argentino está en el centro, cerca de la Plaza 9 de Julio.',
        respuesta_en: 'The Correo Argentino is downtown, near Plaza 9 de Julio.',
        respuesta_pt: 'O Correio Argentino fica no centro, perto da Plaza 9 de Julio.',
        categoria: { key: 'amenity', value: 'post_office' }
    }
];
