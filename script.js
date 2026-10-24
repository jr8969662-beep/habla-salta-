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

// --- Intenciones con direcciones reales y coordenadas de Salta ---
const INTENTS = [
    // ==== TRANSPORTE Y TARJETAS ====
    { keywords: ['saeta','tarjeta','cargar','colectivo','recarga','top up'],
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

    { keywords: ['taxi','remis','uber','cabify','transporte'],
      respuesta_es: 'Paradas de taxi en Plaza 9 de Julio, Terminal de Ómnibus y Aeropuerto. Remises: Remis del Norte (0387 431-3000), Radio Taxi Salta (0387 431-5555). Uber y Cabify funcionan en la ciudad.',
      categoria: { key: 'amenity', value: 'taxi' } },

    { keywords: ['terminal','ómnibus','omnibus','bus station','micro'],
      respuesta_es: 'La Terminal de Ómnibus está en Av. Hipólito Yrigoyen 950. Ahí salen micros a todo el país y al norte argentino.',
      categoria: { key: 'amenity', value: 'bus_station' },
      lugares: [
        { nombre: 'Terminal de Ómnibus de Salta', direccion: 'Av. Hipólito Yrigoyen 950', lat: -24.7990, lng: -65.4000 }
      ] },

    { keywords: ['aeropuerto','airport','vuelo','avión','vuelos'],
      respuesta_es: 'El Aeropuerto Internacional Martín Miguel de Güemes está a 8 km del centro, sobre Ruta 51. Hay taxis y remises en la puerta. También podés tomar el colectivo 8A.',
      categoria: { key: 'aeroway', value: 'aerodrome' },
      lugares: [
        { nombre: 'Aeropuerto Martín Miguel de Güemes', direccion: 'Ruta 51, Km 5', lat: -24.8560, lng: -65.4860 }
      ] },

    { keywords: ['tren','tren a las nubes','nubes','train'],
      respuesta_es: 'El Tren a las Nubes sale de la Estación Salta, en Ameghino 720. Funciona de martes a domingo, con salidas a las 7:05 hs. Reservas en trenalasnubes.com.ar o en la boletería.',
      categoria: { key: 'railway', value: 'station' },
      lugares: [
        { nombre: 'Estación Tren a las Nubes', direccion: 'Ameghino 720', lat: -24.7930, lng: -65.4020 }
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
    { keywords: ['empanada','comida típica','regional','locro','humita','tamal'],
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

    { keywords: ['bar','pub','peña','cerveza','trago','noche'],
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
      respuesta_es: 'Comisaría 1ª en Belgrano 401. Policía Federal en España 725. Para emergencias, llamá al 911. La Policía Turística está en Caseros 417.',
      categoria: { key: 'amenity', value: 'police' },
      lugares: [
        { nombre: 'Comisaría 1ª', direccion: 'Belgrano 401', lat: -24.7895, lng: -65.4088 },
        { nombre: 'Policía Federal', direccion: 'España 725', lat: -24.7874, lng: -65.4119 },
        { nombre: 'Policía Turística', direccion: 'Caseros 417', lat: -24.7886, lng: -65.4099 }
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
      respuesta_es: 'La Oficina de Información Turística de Salta está en Caseros 419, frente a la Plaza 9 de Julio. Abre todos los días. También hay un puesto en el Aeropuerto.',
      categoria: { key: 'tourism', value: 'information' },
      lugares: [
        { nombre: 'Oficina de Información Turística', direccion: 'Caseros 419', lat: -24.7884, lng: -65.4101 },
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
        { nombre: 'Baños Terminal de Ómnibus', direccion: 'Av. Hipólito Yrigoyen 950', lat: -24.7990, lng: -65.4000 }
      ] },

    // ==== UNIVERSIDADES ====
    { keywords: ['universidad','university','facultad','estudiar'],
      respuesta_es: 'La Universidad Nacional de Salta (UNSa) está en Av. Bolivia 5150. La Universidad Católica de Salta (UCASAL) en Pellegrini 790.',
      categoria: { key: 'amenity', value: 'university' },
      lugares: [
        { nombre: 'Universidad Nacional de Salta', direccion: 'Av. Bolivia 5150', lat: -24.7730, lng: -65.4170 },
        { nombre: 'UCASAL', direccion: 'Pellegrini 790', lat: -24.7860, lng: -65.4060 }
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
const mapTitle = document.getElementById('map-title');
const btnDireccion = document.getElementById('btn-direccion');
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

// --- Motor de traducción ---
// Usa Google (gtx) como servicio principal y MyMemory como respaldo.
// Detecta el idioma, guarda en caché, corta textos largos y limpia el resultado.

const TRANSLATE_TIMEOUT_MS = 8000;
const CACHE_KEY = 'hablaSaltaCache_v1';
const CACHE_MAX = 300;

// Código interno -> código de cada servicio
function apiCode(code) {
    if (!code || code === 'auto' || code === 'Autodetect') return 'auto';
    const map = { zh: 'zh-CN', he: 'iw' };
    return map[code] || code;
}

// Código devuelto por un servicio -> código interno de la app
function normalizeLang(code) {
    if (!code) return null;
    const c = code.toLowerCase();
    if (c.startsWith('zh')) return 'zh';
    if (c === 'iw') return 'he';
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

// Proveedor 1: Google Translate (endpoint público gtx)
async function translateWithGoogle(text, from, to) {
    const parts = splitText(text, 1800);
    let out = '';
    let detected = null;
    for (const part of parts) {
        const url = 'https://translate.googleapis.com/translate_a/single?client=gtx&dt=t'
            + `&sl=${apiCode(from)}&tl=${apiCode(to)}&q=${encodeURIComponent(part)}`;
        const res = await fetchWithTimeout(url);
        if (!res.ok) throw new Error(`Google ${res.status}`);
        const data = await res.json();
        if (!Array.isArray(data) || !Array.isArray(data[0])) throw new Error('Respuesta inválida de Google');
        out += data[0].map(seg => seg[0] || '').join('');
        if (!detected && data[2]) detected = data[2];
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
        const res = await fetchWithTimeout(url);
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

/**
 * Traduce y devuelve { text, detected, provider }.
 * from puede ser 'auto'. Prueba cada proveedor en orden hasta que uno funcione.
 */
async function translateFull(text, from, to) {
    from = normalizeLang(from === 'Autodetect' ? 'auto' : from) || 'auto';
    to = normalizeLang(to);
    if (!text.trim()) return { text: '', detected: from, provider: 'none' };
    if (from === to) return { text, detected: from, provider: 'none' };

    const key = `${from}|${to}|${text}`;
    const cached = translationCache.get(key);
    if (cached) return { ...cached, provider: 'cache' };

    if (!navigator.onLine) throw new Error('Sin conexión a internet.');

    const providers = [translateWithGoogle, translateWithMyMemory];
    let lastError;
    for (const provider of providers) {
        try {
            const result = await provider(text, from, to);
            // Si el texto ya estaba en el idioma destino, no hace falta traducir
            if (result.detected === to) result.text = text;
            translationCache.set(key, { text: result.text, detected: result.detected });
            return result;
        } catch (e) {
            console.warn(`Falló ${provider.name}:`, e);
            lastError = e;
        }
    }
    throw new Error(lastError && lastError.name === 'AbortError'
        ? 'El servicio de traducción tardó demasiado. Probá de nuevo.'
        : 'No se pudo traducir ahora. Revisá tu conexión e intentá de nuevo.');
}

// Compatibilidad: devuelve solo el texto
async function translateText(text, fromLang, toLang) {
    return (await translateFull(text, fromLang, toLang)).text;
}

function langName(code) {
    return (CONFIG.languages[code] && CONFIG.languages[code].name) || code.toUpperCase();
}

function speechCode(code) {
    return (CONFIG.languages[code] && CONFIG.languages[code].speech) || code;
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
    supermarket: ['supermercado','almacen','kiosco','supermarket','grocery'],
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

// --- Mapa ---
function initMap(lat, lng) {
    if (!map) {
        map = L.map('map').setView([lat, lng], 14);
        L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '© OpenStreetMap contributors',
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
    'tourism=hotel':          [['tourism', 'hotel|hostel|guest_house|motel|apartment']]
};

// Nombre en español para cada tipo de lugar (cuando OSM no tiene nombre)
const TYPE_LABELS = {
    hospital: 'Hospital', clinic: 'Clínica', doctors: 'Consultorio médico', centre: 'Centro de salud',
    police: 'Comisaría', atm: 'Cajero automático', bank: 'Banco', cafe: 'Café', coffee: 'Café',
    pharmacy: 'Farmacia', restaurant: 'Restaurante', fast_food: 'Comida rápida', food_court: 'Patio de comidas',
    bar: 'Bar', pub: 'Pub', nightclub: 'Boliche', ice_cream: 'Heladería', supermarket: 'Supermercado',
    convenience: 'Almacén', bakery: 'Panadería', hotel: 'Hotel', hostel: 'Hostel', guest_house: 'Hospedaje',
    fuel: 'Estación de servicio', toilets: 'Baño público', fire_station: 'Bomberos', taxi: 'Parada de taxi',
    parking: 'Estacionamiento', museum: 'Museo', post_office: 'Correo'
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

async function overpassQuery(query) {
    const body = 'data=' + encodeURIComponent(query);
    const controllers = [];
    const attempts = OVERPASS_MIRRORS.map(async mirror => {
        const ctrl = new AbortController();
        controllers.push(ctrl);
        const timer = setTimeout(() => ctrl.abort(), 12000);
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

    const tags = tagsFor(categoria);
    let places = [];
    for (const radius of SEARCH_RADII) {
        if (onProgress) onProgress(radius);
        const parts = tags.map(([k, v]) =>
            `nwr["${k}"~"^(${v})$"](around:${radius},${lat},${lng});`).join('\n');
        const query = `[out:json][timeout:20];(\n${parts}\n);out center tags 100;`;
        const elements = await overpassQuery(query);
        if (elements === null) break; // sin servidores: no tiene sentido seguir
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
    const type = t.amenity || t.healthcare || t.shop || t.tourism || t.vending || '';
    const label = TYPE_LABELS[type] || '';
    const calle = t['addr:street'] ? `${t['addr:street']} ${t['addr:housenumber'] || ''}`.trim() : '';
    return {
        nombre: t.name || t.brand || t.operator || label || 'Sin nombre',
        tipo: label,
        direccion: calle || 'Dirección no disponible',
        lat, lng,
        telefono: t.phone || t['contact:phone'] || '',
        horario: t.opening_hours || '',
        emergencia: t.emergency === 'yes' || type === 'hospital',
        distancia: distanciaMetros(userLat, userLng, lat, lng),
        fuente: 'osm'
    };
}

function formatDistancia(m) {
    if (m == null) return '';
    const dist = m < 1000 ? `${Math.round(m / 10) * 10} m` : `${(m / 1000).toFixed(1)} km`;
    const minPie = Math.max(1, Math.round(m / 80));
    const tiempo = m <= 2500 ? `${minPie} min a pie` : `${Math.max(1, Math.round(m / 400))} min en auto`;
    return `${dist} · ${tiempo}`;
}

function linkComoLlegar(p) {
    const mode = p.distancia != null && p.distancia > 2500 ? 'driving' : 'walking';
    return `https://www.google.com/maps/dir/?api=1&destination=${p.lat},${p.lng}&travelmode=${mode}`;
}

// --- Ubicación del usuario ---
let lastPosition = null;
function getUserPosition() {
    return new Promise(resolve => {
        if (!navigator.geolocation) return resolve(null);
        // Si tenemos una ubicación de hace menos de 2 minutos, se reutiliza al instante
        if (lastPosition && Date.now() - lastPosition.t < 120000) return resolve(lastPosition);
        navigator.geolocation.getCurrentPosition(
            pos => {
                lastPosition = { lat: pos.coords.latitude, lng: pos.coords.longitude,
                                 precision: pos.coords.accuracy, t: Date.now() };
                resolve(lastPosition);
            },
            err => { console.warn('Geolocalización:', err); resolve(null); },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000 }
        );
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

// --- Respuesta de intención con sistema híbrido ---
async function showIntentResponse(intent, userLat, userLng, targetLang) {
    let respuestaTarget = intent.respuesta_es;
    const hasTarget = targetLang && targetLang !== 'auto' && targetLang !== 'es';

    if (hasTarget && intent['respuesta_' + targetLang]) {
        respuestaTarget = intent['respuesta_' + targetLang];
    } else if (hasTarget) {
        try {
            respuestaTarget = await translateText(intent.respuesta_es, 'es', targetLang);
        } catch (e) {
            console.warn('No se pudo traducir la respuesta:', e);
        }
    }

    intentResponse.innerHTML = `
        <p class="intent-es">${escapeHtml(intent.respuesta_es)}</p>
        ${hasTarget && respuestaTarget !== intent.respuesta_es
            ? `<p class="intent-target" lang="${targetLang}">${escapeHtml(respuestaTarget)}</p>` : ''}
    `;
    intentResponse.classList.remove('hidden');
    resultadoDiv.classList.add('hidden');

    if (hasTarget) speak(respuestaTarget, speechCode(targetLang));

    mapContainer.classList.remove('hidden');
    renderEmergencyBanner(intent);

    const value = intent.categoria && intent.categoria.value;
    const tipoTexto = (TYPE_LABELS[value] || 'lugares').toLowerCase();
    mapTitle.textContent = userLat ? `${TYPE_LABELS[value] || 'Lugares'} cerca tuyo` : 'Lugares de referencia';

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
        const dup = lugares.some(x => Math.abs(x.lat - l.lat) < 0.0006 && Math.abs(x.lng - l.lng) < 0.0006);
        if (dup) return;
        lugares.push({
            ...l,
            fuente: 'fijo',
            distancia: userLat ? distanciaMetros(userLat, userLng, l.lat, l.lng) : null
        });
    });

    if (userLat) lugares.sort((a, b) => (a.distancia ?? 1e9) - (b.distancia ?? 1e9));
    lugares = lugares.slice(0, 15);

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
        const color = l.fuente === 'fijo' ? '#0b3558' : '#b91c1c';
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
                ${l.horario ? `<small class="lugar-horario">🕒 ${escapeHtml(l.horario === '24/7' ? 'Abierto 24 hs' : l.horario)}</small>` : ''}
                <div class="lugar-acciones">
                    <a class="btn-mini" href="${linkComoLlegar(l)}" target="_blank" rel="noopener">🧭 Cómo llegar</a>
                    ${tel ? `<a class="btn-mini" href="tel:${tel.replace(/[^\d+]/g, '')}">📞 Llamar</a>` : ''}
                </div>
            </div>`;
        li.querySelector('.lugar-info strong').addEventListener('click', () => map.setView([l.lat, l.lng], 17));
        placesList.appendChild(li);
    });

    if (bounds.length > 1) {
        // Encuadrar al usuario y los 5 más cercanos para que se vea bien el entorno
        map.fitBounds(bounds.slice(0, userLat ? 6 : bounds.length), { padding: [30, 30], maxZoom: 16 });
    } else {
        map.setView(bounds[0], 15);
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

// --- Flujo principal ---
async function handleTranslate() {
    const text = textoEntrada.value.trim();
    if (!text) {
        updateStatus('Escribí o dictá algo primero.', true);
        return;
    }

    const langCode = idiomaSelect.value;

    resultadoDiv.classList.add('hidden');
    intentResponse.classList.add('hidden');
    mapContainer.classList.add('hidden');

    // --- Modo respuesta: español -> idioma del visitante ---
    if (direction === 'fromEs') {
        const target = langCode !== 'auto' ? langCode : lastVisitorLang;
        if (!target) {
            updateStatus('Elegí el idioma del visitante (o traducí primero algo que él diga).', true);
            return;
        }
        updateStatus('Traduciendo...');
        btnTraducir.disabled = true;
        try {
            const r = await translateFull(text, 'es', target);
            showResult(r.text, target, `ESPAÑOL → ${langName(target).toUpperCase()}`);
            speak(r.text, speechCode(target));
            updateStatus('Traducción lista. Mostrale la pantalla o tocá 🔊.');
        } catch (error) {
            updateStatus(error.message, true);
        } finally {
            btnTraducir.disabled = false;
        }
        return;
    }

    // --- Modo normal: idioma del visitante -> español ---
    updateStatus('Traduciendo...');
    btnTraducir.disabled = true;
    let textoEs, detected;
    try {
        const r = await translateFull(text, langCode, 'es');
        textoEs = r.text;
        detected = r.detected;
    } catch (error) {
        console.error('Error en la traducción:', error);
        updateStatus(error.message, true);
        return;
    } finally {
        btnTraducir.disabled = false;
    }

    // Idioma real del visitante: el elegido o el detectado
    const visitorLang = langCode !== 'auto' ? langCode : detected;
    if (visitorLang && visitorLang !== 'es') lastVisitorLang = visitorLang;

    const intent = detectIntent(textoEs, text);
    const targetForReply = visitorLang && visitorLang !== 'es' ? visitorLang : null;

    if (intent) {
        updateStatus('Obteniendo tu ubicación...');
        const pos = await getUserPosition();
        if (!pos) updateStatus('Sin ubicación. Mostrando lugares de referencia.', true);
        await showIntentResponse(intent, pos && pos.lat, pos && pos.lng, targetForReply);
    } else {
        const origen = visitorLang ? langName(visitorLang).toUpperCase() : 'DETECTADO';
        showResult(textoEs, 'es', `${origen} → ESPAÑOL`);
        updateStatus(langCode === 'auto' && detected
            ? `Idioma detectado: ${langName(detected)}.`
            : 'Traducción completada.');
    }
}

function showResult(text, lang, label) {
    translationResult.textContent = text;
    translationResult.setAttribute('lang', lang);
    translationResult.dataset.lang = lang;
    resultLabel.textContent = label || 'TRADUCCIÓN';
    resultadoDiv.classList.remove('hidden');
}

// --- Dirección de traducción ---
function updateDirectionUI() {
    const toEs = direction === 'toEs';
    btnDireccion.textContent = toEs ? '⇄ Visitante → Español' : '⇄ Español → Visitante';
    btnDireccion.classList.toggle('activo', !toEs);
    btnDireccion.setAttribute('aria-pressed', String(!toEs));
    labelTexto.textContent = toEs ? '¿Qué quiere decir?' : '¿Qué le querés responder?';
    textoEntrada.placeholder = toEs ? 'Escribí o dictá la frase...' : 'Escribí o dictá tu respuesta en español...';
    notaIdioma.textContent = toEs
        ? 'La traducción se muestra en español.'
        : 'Tu respuesta se traduce al idioma del visitante.';
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

btnDireccion.addEventListener('click', () => {
    direction = direction === 'toEs' ? 'fromEs' : 'toEs';
    textoEntrada.value = '';
    resultadoDiv.classList.add('hidden');
    intentResponse.classList.add('hidden');
    mapContainer.classList.add('hidden');
    updateDirectionUI();
    textoEntrada.focus();
});

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

// --- Inicialización ---
document.addEventListener('DOMContentLoaded', () => {
    setupSpeechRecognition();
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
        if (meta) meta.setAttribute('content', tema === 'dark' ? '#1a1a24' : '#0b3558');
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
