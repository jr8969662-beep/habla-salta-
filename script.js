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
async function searchPlaces(lat, lng, categoria) {
    const { key, value } = categoria;
    const radius = 2000;

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
            if (data.elements) return data.elements;
        } catch (error) {
            console.warn('Falló el mirror', mirror, error);
        }
    }
    return [];
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
    let respuestaTarget;
    const langCfg = CONFIG.languages[targetLang];

    if (targetLang === 'auto') {
        respuestaTarget = intent.respuesta_es;
    } else if (intent['respuesta_' + targetLang]) {
        respuestaTarget = intent['respuesta_' + targetLang];
    } else {
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

    const speechLang = (langCfg && langCfg.speech) || 'es-ES';
    if (targetLang !== 'auto') speak(respuestaTarget, speechLang);

    mapContainer.classList.remove('hidden');

    const baseLat = userLat || -24.7883;
    const baseLng = userLng || -65.4106;

    updateStatus('Buscando lugares...');
    initMap(baseLat, baseLng);
    markersLayer.clearLayers();
    placesList.innerHTML = '';

    let todosLosLugares = [];

    // 1) Lugares OSM cercanos al usuario (radio 2 km)
    if (userLat && userLng && intent.categoria) {
        const osmPlaces = await searchPlaces(userLat, userLng, intent.categoria);
        osmPlaces.forEach(p => {
            const pLat = p.lat || (p.center && p.center.lat);
            const pLng = p.lon || (p.center && p.center.lon);
            if (!pLat || !pLng) return;
            const name = (p.tags && p.tags.name) || 'Sin nombre';
            const address = (p.tags && p.tags['addr:street'])
                ? `${p.tags['addr:street']} ${p.tags['addr:housenumber'] || ''}`.trim()
                : 'Dirección no disponible';
            todosLosLugares.push({
                nombre: name,
                direccion: address,
                lat: pLat,
                lng: pLng,
                fuente: 'osm'
            });
        });
    }

    // 2) Lugares fijos
    if (intent.lugares && intent.lugares.length > 0) {
        intent.lugares.forEach(l => {
            const duplicado = todosLosLugares.some(
                x => x.nombre.toLowerCase().includes(l.nombre.toLowerCase().split(' ')[0])
                  && Math.abs(x.lat - l.lat) < 0.0005
                  && Math.abs(x.lng - l.lng) < 0.0005
            );
            if (!duplicado) {
                todosLosLugares.push({
                    nombre: l.nombre,
                    direccion: l.direccion,
                    lat: l.lat,
                    lng: l.lng,
                    fuente: 'fijo'
                });
            }
        });
    }

    // 3) Ordenar por distancia al usuario
    if (userLat && userLng) {
        todosLosLugares.forEach(l => {
            l.distancia = distanciaMetros(userLat, userLng, l.lat, l.lng);
        });
        todosLosLugares.sort((a, b) => a.distancia - b.distancia);
    } else {
        // Sin ubicación: solo mostrar los fijos
        todosLosLugares = todosLosLugares.filter(l => l.fuente === 'fijo');
    }

    // 4) Dibujar
    if (userLat && userLng) {
        L.marker([userLat, userLng])
            .addTo(markersLayer)
            .bindPopup('Estás aquí')
            .openPopup();
    }

    const bounds = [];
    if (userLat && userLng) bounds.push([userLat, userLng]);

    if (todosLosLugares.length === 0) {
        placesList.innerHTML = '<li>No se encontraron lugares cercanos. Mirá las direcciones de arriba.</li>';
        updateStatus('Sin resultados en el mapa. Las direcciones están arriba.');
        return;
    }

    todosLosLugares.forEach(l => {
        const color = l.fuente === 'fijo' ? '#0b3558' : '#b91c1c';
        const icon = L.divIcon({
            className: 'custom-marker',
            html: `<div style="background:${color};width:14px;height:14px;border-radius:50%;border:2px solid white;box-shadow:0 2px 6px rgba(0,0,0,0.4);"></div>`,
            iconSize: [14, 14]
        });

        L.marker([l.lat, l.lng], { icon })
            .addTo(markersLayer)
            .bindPopup(`<strong>${l.nombre}</strong><br>${l.direccion}`);

        bounds.push([l.lat, l.lng]);

        const li = document.createElement('li');
        const etiqueta = l.fuente === 'fijo' ? '⭐' : '📍';
        const dist = l.distancia ? ` · ${Math.round(l.distancia)} m` : '';
        li.innerHTML = `<strong>${etiqueta} ${l.nombre}</strong><small>${l.direccion}${dist}</small>`;
        li.addEventListener('click', () => map.setView([l.lat, l.lng], 17));
        placesList.appendChild(li);
    });

    if (bounds.length > 1) {
        map.fitBounds(bounds, { padding: [30, 30] });
    } else if (bounds.length === 1) {
        map.setView(bounds[0], 15);
    }

    const fijos = todosLosLugares.filter(l => l.fuente === 'fijo').length;
    const osm = todosLosLugares.filter(l => l.fuente === 'osm').length;
    updateStatus(`Mostrando ${todosLosLugares.length} lugares (${fijos} ⭐ fijos + ${osm} 📍 cercanos).`);
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

    const intent = detectIntent(textoEs);

    if (intent) {
        if (navigator.geolocation) {
            updateStatus('Obteniendo ubicación...');
            navigator.geolocation.getCurrentPosition(
                (pos) => showIntentResponse(intent, pos.coords.latitude, pos.coords.longitude, langCode),
                (err) => {
                    console.error('Geolocalización:', err);
                    updateStatus('Sin ubicación. Mostrando lugares de referencia.', true);
                    showIntentResponse(intent, null, null, langCode);
                },
                { enableHighAccuracy: true, timeout: 10000 }
            );
        } else {
            showIntentResponse(intent, null, null, langCode);
        }
    } else {
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
