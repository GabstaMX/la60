/* ============================================================
   LA 60 · DATOS COMPARTIDOS
   ------------------------------------------------------------
   Una sola fuente para lo que se vende. Lo usan el catálogo
   (obra.js) y las reservas (reservas.js): así un precio no vive
   en dos sitios distintos.

   Las rutas de imagen van COMPLETAS. Si se arman por partes, el
   empaquetador no las encuentra y el paquete sale sin imágenes.
   ============================================================ */
window.LA60 = (() => {
  'use strict';

  /* --- OBRA · series ------------------------------------------
     Agrupación propuesta mirando las piezas. Renombrar o
     reordenar = editar aquí. Mover una pieza = cambiar su
     campo `serie`.                                              */
  const SERIES = [
    { id: 'eclipses', nombre: 'Eclipses', plano: 'plano--tinta',
      pie: 'Soles tapados, anillos de luz, lo que pasa cuando algo se interpone.' },
    { id: 'anatomias', nombre: 'Anatomías', plano: 'plano--kinder',
      pie: 'El cuerpo recortado: un corazón, un ojo, una cara que se comparte.' },
    { id: 'abstracto', nombre: 'Abstracto', plano: '',
      pie: 'Geometría plana, tijera limpia, color que no duda.' },
    { id: 'capas', nombre: 'Capas', plano: 'plano--menta',
      pie: 'Donde el collage se espesa: transparencias, tramas, cosas debajo de otras.' },
  ];

  /* --- OBRA · piezas -------------------------------------------
     `ref` es lo que se dice al reservar: no hay títulos por pieza
     todavía, así que la referencia la da la serie y el número.
     Precios: las siete de gran formato a 6000; las diez
     anteriores conservan el suyo (ProductList Nov 2025).
     El emparejamiento foto ↔ precio de esas diez está por
     confirmar con Tatifer.                                       */
  const PIEZAS = [
    { img: 'assets/img/obra/nueva-04.jpg', precio: 6000, serie: 'eclipses',
      alt: 'Collage: una figura infantil frente a un disco negro con corona de luz, entre dos troncos, sobre una roca de estratos de color' },
    { img: 'assets/img/obra/nueva-05.jpg', precio: 6000, serie: 'eclipses',
      alt: 'Collage: eclipse sobre una montaña de estratos, con dos figuras clásicas en la cima' },
    { img: 'assets/img/obra/nueva-03.jpg', precio: 6000, serie: 'eclipses',
      alt: 'Collage: figura de negro con el pelo rosa, rodeada de llamas y de rayos blancos, con un disco gris al fondo' },

    { img: 'assets/img/obra/nueva-01.jpg', precio: 6000, serie: 'anatomias',
      alt: 'Collage: un corazón anatómico azul con flores, sobre papel botánico antiguo' },
    { img: 'assets/img/obra/nueva-00.jpg', precio: 6000, serie: 'anatomias',
      alt: 'Collage: un ojo grande entre círculos de escamas malva y una forma negra' },
    { img: 'assets/img/obra/nueva-06.jpg', precio: 6000, serie: 'anatomias',
      alt: 'Collage: una cara partida con la de un perro, entre tramas malva y lunares magenta' },

    { img: 'assets/img/obra/obra-00.jpg', precio: 950, serie: 'abstracto',
      alt: 'Collage de papel cortado en azules, lilas y verde menta, con lunares' },
    { img: 'assets/img/obra/obra-02.jpg', precio: 500, serie: 'abstracto',
      alt: 'Collage en amarillo y magenta con un gran círculo turquesa de tres lunares' },
    { img: 'assets/img/obra/obra-03.jpg', precio: 450, serie: 'abstracto',
      alt: 'Collage de anillos y arcos en verdes y dorado sobre fondo verde' },
    { img: 'assets/img/obra/obra-04.jpg', precio: 400, serie: 'abstracto',
      alt: 'Collage en turquesa con una forma naranja texturada y una franja de cebra azul' },
    { img: 'assets/img/obra/obra-07.jpg', precio: 300, serie: 'abstracto',
      alt: 'Collage geométrico en azul, amarillo y turquesa con círculos y medias lunas' },

    { img: 'assets/img/obra/nueva-02.jpg', precio: 6000, serie: 'capas',
      alt: 'Collage: discos negros y siluetas de pájaros sobre magenta y verdes estampados' },
    { img: 'assets/img/obra/obra-01.jpg', precio: 800, serie: 'capas',
      alt: 'Collage en azules estampados con un arco y un círculo, sobre papel de flores' },
    { img: 'assets/img/obra/obra-05.jpg', precio: 350, serie: 'capas',
      alt: 'Collage con papel manuscrito amarillo, azules estampados y un número 3 recortado' },
    { img: 'assets/img/obra/obra-06.jpg', precio: 350, serie: 'capas',
      alt: 'Collage de círculos translúcidos en pastel sobre fondo oscuro' },
    { img: 'assets/img/obra/obra-08.jpg', precio: 250, serie: 'capas',
      alt: 'Collage orgánico en turquesa y oliva con formas de vainas y tramas doradas' },
    { img: 'assets/img/obra/obra-09.jpg', precio: 200, serie: 'capas',
      alt: 'Collage en negro y naranja con tipografía de prensa invertida' },
  ];

  // referencia legible por pieza: «Eclipses · 1 de 3»
  SERIES.forEach(s => {
    const suyas = PIEZAS.filter(p => p.serie === s.id);
    suyas.forEach((p, i) => { p.ref = `${s.nombre} · ${i + 1} de ${suyas.length}`; });
  });

  /* --- CAFÉ ----------------------------------------------------
     Precios del Dossier_Cafe_La60.pdf, págs. 9 y 10.             */
  const BLENDS = [
    { id: 'atelier', nombre: 'Atelier',  perfil: 'Premium · tueste medio' },
    { id: 'colcoll', nombre: 'Col-Coll', perfil: 'Espresso · 75 % medio + 25 % oscuro' },
    { id: 'darkneo', nombre: 'Darkneo',  perfil: 'French roast · 100 % oscuro' },
    { id: 'sereno',  nombre: 'Sereno',   perfil: 'Descafeinado al agua · tueste medio' },
    { id: 'mes',     nombre: 'Atelier del mes', perfil: 'Café invitado · solo 250 g', solo250: true },
  ];
  const GRAMAJES = [
    { id: '250', etiqueta: '250 g', precio: 150, precioMes: 190 },
    { id: '500', etiqueta: '500 g', precio: 280 },
    { id: '1k',  etiqueta: '1 kg',  precio: 560 },
  ];

  /* --- COMPRA -------------------------------------------------
     Enlace de pago de cada bolsa. Aquí se pega la URL del checkout
     de GoHighLevel, una por blend y medida.

     Dónde sacarla en GHL: Payments → Products → el producto →
     el enlace del checkout (o el de la página de pago que lo use).

     Mientras un hueco siga vacío, ese botón manda el pedido por
     WhatsApp con el blend y la medida ya escritos: la tienda vende
     igual desde el primer día, y mejora conforme pegues enlaces.
     ------------------------------------------------------------ */
  const COMPRA = {
    atelier: { '250': '', '500': '', '1k': '' },
    colcoll: { '250': '', '500': '', '1k': '' },
    darkneo: { '250': '', '500': '', '1k': '' },
    sereno:  { '250': '', '500': '', '1k': '' },
  };
  const WHATSAPP = '529996226722';

  const MOLIENDAS = ['En grano', 'Espresso', 'Filtro / V60', 'Prensa francesa',
                     'Moka / greca', 'Aeropress'];

  /* --- TALLER --------------------------------------------------
     Cuotas de ProductList Nov 2025: «Cuota collage» y
     «Cuota collages estudiante».                                 */
  const TALLER = { cuota: 100, cuotaEstudiante: 50 };

  return { SERIES, PIEZAS, BLENDS, GRAMAJES, MOLIENDAS, TALLER, COMPRA, WHATSAPP };
})();
