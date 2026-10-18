/* ============================================================
   CATÁLOGO DE OBRA · TATIFER4
   ------------------------------------------------------------
   Solo dibuja. Las series y las piezas viven en
   assets/js/datos.js, que también usa reservas.js: un precio no
   puede estar en dos sitios distintos.
   ============================================================ */
(() => {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  const { SERIES, PIEZAS } = window.LA60;

  const pesos = n => '$' + n.toLocaleString('es-MX');

  /* --- dibujar ------------------------------------------------ */
  const cont = $('#catalogo');
  if (!cont) return;

  const tarjeta = (p, i) => `
      <a class="obra rev" data-d="${(i % 4) + 1}"
         href="reservas.html?intencion=obra&pieza=${PIEZAS.indexOf(p)}">
        <div class="obra__marco">
          <span class="obra__estado">Disponible</span>
          <div class="obra__lienzo">
            <img src="${p.img}" alt="${p.alt}" loading="lazy">
          </div>
        </div>
        <div class="obra__pie">
          <div><h3>Pieza única</h3><span class="obra__med">Collage · Tatifer4</span></div>
          <span class="obra__precio">${pesos(p.precio)}</span>
        </div>
      </a>`;

  cont.innerHTML = SERIES.map((s, k) => {
    const piezas = PIEZAS.filter(p => p.serie === s.id);
    if (!piezas.length) return '';
    const desde = Math.min(...piezas.map(p => p.precio));
    const hasta = Math.max(...piezas.map(p => p.precio));
    const rango = desde === hasta ? pesos(desde) : `${pesos(desde)} – ${pesos(hasta)}`;
    return `
  <section class="serie plano ${s.plano} ${k % 2 ? 'plano--corte-sup' : ''}" id="${s.id}">
    <div class="wrap">
      <header class="seccionador">
        <p class="eyebrow rev">Serie ${String(k + 1).padStart(2, '0')}</p>
        <h2 class="t-mega seccionador__nombre rev" data-d="1">${s.nombre}</h2>
        <div class="seccionador__pie rev" data-d="2">
          <p class="nota">${s.pie}</p>
          <dl class="seccionador__datos">
            <div><dt>Piezas</dt><dd>${piezas.length}</dd></div>
            <div><dt>Precio</dt><dd>${rango}</dd></div>
          </dl>
        </div>
      </header>
      <div class="obras">${piezas.map(tarjeta).join('')}</div>
    </div>
  </section>`;
  }).join('');

  /* --- índice de series, arriba ------------------------------- */
  const indice = $('#indice');
  if (indice) {
    indice.innerHTML = SERIES
      .filter(s => PIEZAS.some(p => p.serie === s.id))
      .map(s => `<a class="pill" href="#${s.id}">${s.nombre}</a>`)
      .join('');
  }

  /* --- revelados (los mismos de la portada) ------------------- */
  const calma = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const porRevelar = $$('.rev, .rev-mask');
  if (porRevelar.length && !calma) {
    const obs = new IntersectionObserver(es => {
      es.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-on'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    porRevelar.forEach(el => obs.observe(el));
  } else {
    porRevelar.forEach(el => el.classList.add('is-on'));
  }

  const anio = $('[data-anio]');
  if (anio) anio.textContent = new Date().getFullYear();
})();
