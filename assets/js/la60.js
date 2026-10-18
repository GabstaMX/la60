/* ============================================================
   LA 60 · CAFÉ ATELIER — comportamiento
   1. Motor de objetos flotantes (ratón + scroll)
   2. Revelados al scroll
   3. Barra que se esconde
   4. Selector de gramaje
   5. Bolsas de café en SVG
   6. Collages de obra en SVG (marcador de posición)
   7. Objetos de la casa en SVG
   ============================================================ */
(() => {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const calma = matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ==========================================================
     1 · MOTOR DE OBJETOS FLOTANTES
     La capa exterior recibe el paralaje; la interior respira
     sola en CSS. Así nunca se pisan el transform.
     ========================================================== */
  const escenas = $$('.escena');

  // -- ratón: cada escena desplaza sus objetos según su profundidad
  if (!calma && matchMedia('(hover:hover)').matches) {
    escenas.forEach(esc => {
      let objetivo = { x: 0, y: 0 }, actual = { x: 0, y: 0 }, animando = false;
      const amplitud = parseFloat(esc.dataset.raton || 20);

      const suaviza = () => {
        actual.x += (objetivo.x - actual.x) * 0.075;
        actual.y += (objetivo.y - actual.y) * 0.075;
        esc.style.setProperty('--mx', actual.x.toFixed(2) + 'px');
        esc.style.setProperty('--my', actual.y.toFixed(2) + 'px');
        if (Math.abs(objetivo.x - actual.x) > 0.1 || Math.abs(objetivo.y - actual.y) > 0.1) {
          requestAnimationFrame(suaviza);
        } else { animando = false; }
      };

      esc.addEventListener('pointermove', e => {
        const r = esc.getBoundingClientRect();
        objetivo.x = ((e.clientX - r.left) / r.width  - 0.5) * -2 * amplitud;
        objetivo.y = ((e.clientY - r.top)  / r.height - 0.5) * -2 * amplitud;
        if (!animando) { animando = true; requestAnimationFrame(suaviza); }
      }, { passive: true });

      esc.addEventListener('pointerleave', () => {
        objetivo.x = 0; objetivo.y = 0;
        if (!animando) { animando = true; requestAnimationFrame(suaviza); }
      });
    });
  }

  // -- scroll: los objetos se separan en profundidad al avanzar
  const flotantes = $$('.flota');
  if (!calma && flotantes.length) {
    let pendiente = false;
    const recalcula = () => {
      const vh = innerHeight;
      flotantes.forEach(f => {
        const esc = f.closest('.escena') || f.parentElement;
        const r = esc.getBoundingClientRect();
        if (r.bottom < -200 || r.top > vh + 200) return;
        // -1 → +1 mientras la escena cruza la ventana
        const p = ((vh - r.top) / (vh + r.height)) * 2 - 1;
        const rango = parseFloat(f.dataset.scroll || 90);
        f.style.setProperty('--sy', (p * -rango).toFixed(1) + 'px');
      });
      pendiente = false;
    };
    addEventListener('scroll', () => {
      if (!pendiente) { pendiente = true; requestAnimationFrame(recalcula); }
    }, { passive: true });
    addEventListener('resize', recalcula, { passive: true });
    recalcula();
  }

  /* ==========================================================
     2 · REVELADOS AL SCROLL
     ========================================================== */
  const porRevelar = $$('.rev, .rev-mask');
  if (porRevelar.length) {
    const obs = new IntersectionObserver((entradas) => {
      entradas.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-on'); obs.unobserve(e.target); }
      });
    }, { rootMargin: '0px 0px -12% 0px', threshold: 0.08 });
    porRevelar.forEach(el => obs.observe(el));
  }

  /* ==========================================================
     3 · BARRA QUE SE ESCONDE AL BAJAR
     ========================================================== */
  const nav = $('.nav');
  if (nav) {
    let ultimo = 0;
    addEventListener('scroll', () => {
      const y = scrollY;
      nav.classList.toggle('is-oculto', y > ultimo && y > 380);
      ultimo = y;
    }, { passive: true });
  }

  /* ==========================================================
     4 · SELECTOR DE GRAMAJE
     Precios reales del dossier. «—» donde no hay presentación.
     ========================================================== */
  // Las fotos finales, una por blend y medida. Las rutas van COMPLETAS:
  // si se arman con plantilla, el empaquetador no las encuentra y el
  // paquete sale sin las de 500 g y 1 kg.
  const FOTOS = {
    atelier: { '250': 'assets/img/bolsas/atelier-250.webp',
               '500': 'assets/img/bolsas/atelier-500.webp',
               '1k':  'assets/img/bolsas/atelier-1k.webp' },
    colcoll: { '250': 'assets/img/bolsas/colcoll-250.webp',
               '500': 'assets/img/bolsas/colcoll-500.webp',
               '1k':  'assets/img/bolsas/colcoll-1k.webp' },
    darkneo: { '250': 'assets/img/bolsas/darkneo-250.webp',
               '500': 'assets/img/bolsas/darkneo-500.webp',
               '1k':  'assets/img/bolsas/darkneo-1k.webp' },
    sereno:  { '250': 'assets/img/bolsas/sereno-250.webp',
               '500': 'assets/img/bolsas/sereno-500.webp',
               '1k':  'assets/img/bolsas/sereno-1k.webp' },
  };


  /* ==========================================================
     4b · BOTÓN DE PEDIDO
     Cada tarjeta apunta al checkout de GoHighLevel de esa bolsa.
     Si ese hueco de COMPRA sigue vacío, el botón manda el pedido
     por WhatsApp con el blend y la medida ya escritos.
     ========================================================== */
  const { COMPRA = {}, WHATSAPP = '' } = window.LA60 || {};

  function etiquetaMedida(g) { return g === '1k' ? '1 kg' : g + ' g'; }

  function pintaPedido(p, g) {
    const a = $('.prod__pedir', p);
    if (!a) return;
    const blend = p.dataset.blend;
    const nombre = ($('h3', p) || {}).textContent || blend;
    const url = (COMPRA[blend] || {})[g];
    if (url) {
      a.href = url;
      a.removeAttribute('target');
      $('span', a).textContent = 'Comprar';
    } else if (WHATSAPP) {
      const txt = `Hola LA 60, quiero pedir ${nombre} de ${etiquetaMedida(g)}.`;
      a.href = `https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`;
      a.target = '_blank'; a.rel = 'noopener';
      $('span', a).textContent = 'Pedir por WhatsApp';
    }
    a.setAttribute('aria-label', `Pedir ${nombre} de ${etiquetaMedida(g)}`);
  }

  // estado inicial: la tienda abre en 250 g
  $$('.prod').forEach(p => pintaPedido(p, '250'));

  const gramaje = $('.gramaje');
  if (gramaje) {
    gramaje.addEventListener('click', e => {
      const b = e.target.closest('button');
      if (!b) return;
      $$('button', gramaje).forEach(x => x.setAttribute('aria-pressed', String(x === b)));
      const g = b.dataset.g;
      $$('.prod').forEach(p => {
        const precio = p.dataset['p' + g];
        const cont = $('.prod__precio', p);
        const et   = $('.prod__g', p);
        if (precio) {
          cont.textContent = '$' + precio;
          cont.classList.remove('prod__precio--na');
        } else {
          cont.textContent = 'solo 250 g';
          cont.classList.add('prod__precio--na');
        }
        et.textContent = g === '1k' ? '1 kg' : g + ' g';

        // y la foto: hay una por blend y medida, con la misma luz en las tres
        const blend = p.dataset.blend, foto = $('.prod__lienzo img', p);
        const ruta = FOTOS[blend] && FOTOS[blend][g];
        if (foto && ruta) {
          foto.src = ruta;
          foto.alt = foto.alt.replace(/de \d+ ?g|de 1 kg/, g === '1k' ? 'de 1 kg' : `de ${g} g`);
        }

        pintaPedido(p, g);
      });
    });
  }

  /* ==========================================================
     5 · DATOS DE LOS BLENDS
     Las bolsas ya no se dibujan: son los renders reales
     (assets/img/bolsas/), puestos directos en el HTML. Aquí solo
     quedan los datos que necesita el frontal de respaldo.
     ========================================================== */
  const BLENDS = {
    atelier: {
      nombre: 'Atelier', fondo: '#0E7C74', tacha: '#008D89',
      etiquetaTueste: 'TUESTE: MEDIO', notas: ['NOTAS: CHOCOLATE OSCURO'],
    },
    colcoll: {
      nombre: 'Col-Coll', fondo: '#C6E6DC', tacha: '#008D89',
      etiquetaTueste: 'TUESTE: 75 % MEDIO 25 % OSCURO',
      notas: ['NOTAS: CHOCOLATE AMARGO', 'MELAZA · ESPECIADO'],
    },
    darkneo: {
      nombre: 'Darkneo', fondo: '#C9A87C', tacha: '#E31E24',
      etiquetaTueste: 'TUESTE: OSCURO (FRENCH)',
      notas: ['NOTAS: CACAO · CARAMELO · MADERA'],
    },
    sereno: {
      nombre: 'Sereno', fondo: '#EFE7DA', tacha: '#006D6A', bajo: 'DESCAFEINADO',
      etiquetaTueste: 'TUESTE: MEDIO',
      notas: ['NOTAS: PILONCILLO · MANZANA', 'ROJA · ALMENDRA TOSTADA'],
    },
  };

  // Las cuatro etiquetas originales, tal como salieron de imprenta
  // (convertidas de CMYK a sRGB, sin recortar ni recolorear).
  const ETIQUETAS = {
    atelier: 'assets/img/etiquetas/atelier.jpg',
    colcoll: 'assets/img/etiquetas/col-coll.jpg',
    darkneo: 'assets/img/etiquetas/darkneo.jpg',
    sereno:  'assets/img/etiquetas/sereno.jpg',
  };

  /* ==========================================================
     6 · VOCABULARIO DE COLLAGE
     Papel rasgado, tramas de puntos, anillos y franjas: el mismo
     lenguaje de las etiquetas de los blends, hecho en SVG.
     Sirve para el hueco de las fichas de obra y para el frontal
     provisional de cada blend, hasta que lleguen las fotos. Los
     objetos que flotan ya no son generados: son los recortes de la
     manteleta, en assets/img/recortes/.
     Todo determinista por semilla: la misma pieza sale igual
     en cada carga.
     ========================================================== */

  // Paleta leída de las etiquetas reales, no de la pantalla.
  const PAPEL = {
    verde:  '#0E7C74', menta: '#A7D6CE', mentaClara: '#C6E6DC',
    rosa:   '#F79AB0', rojo:  '#E31E24', mostaza: '#E0A22B',
    crema:  '#EFE7DA', kraft: '#C9A87C', kraftOsc: '#AC8A5F',
    tinta:  '#2E2E2E', hueso: '#F5EFE4',
  };
  const KINDER = '#008D89';   // el kinder del logo: tachadura y caja del 393
  const COLORES = [PAPEL.verde, PAPEL.menta, PAPEL.rosa, PAPEL.rojo, PAPEL.mostaza, PAPEL.crema, PAPEL.tinta];
  // La menta queda fuera de los fondos: el hero ya es mentolado y las
  // figuras se perdían contra él. Kraft, crema, verde y rosa recortan.
  const FONDOS  = [PAPEL.kraft, PAPEL.crema, PAPEL.verde, PAPEL.hueso, PAPEL.rosa, PAPEL.kraftOsc];

  function azar(semilla) {           // PRNG determinista (mulberry32)
    let a = semilla >>> 0;
    return () => {
      a = (a + 0x6D2B79F5) >>> 0;
      let t = Math.imul(a ^ (a >>> 15), 1 | a);
      t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
  }

  // Contorno de papel rasgado: el perímetro de un rectángulo recorrido
  // a pasos irregulares, con la orilla temblando. Es lo que separa un
  // recorte de una caja de color.
  function rasgado(x, y, w, h, r, amp = 4.5) {
    const p = [], j = () => (r() - 0.5) * 2 * amp, paso = () => 7 + r() * 11;
    for (let v = x; v < x + w; v += paso()) p.push([v, y + j()]);
    p.push([x + w, y + j()]);
    for (let v = y; v < y + h; v += paso()) p.push([x + w + j(), v]);
    p.push([x + w + j(), y + h]);
    for (let v = x + w; v > x; v -= paso()) p.push([v, y + h + j()]);
    p.push([x, y + h + j()]);
    for (let v = y + h; v > y; v -= paso()) p.push([x + j(), v]);
    return 'M' + p.map(c => c[0].toFixed(1) + ' ' + c[1].toFixed(1)).join('L') + 'Z';
  }

  // --- motivos sueltos -------------------------------------------------
  const motivo = {
    puntos(x, y, w, h, c, r) {           // trama de lunares
      const paso = 13 + r() * 9, rad = paso * (0.2 + r() * 0.12);
      let o = '';
      for (let py = y + paso / 2; py < y + h; py += paso)
        for (let px = x + paso / 2; px < x + w; px += paso)
          o += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${rad.toFixed(1)}" fill="${c}"/>`;
      return o;
    },
    franjas(x, y, w, h, c, r) {          // bandas, como el papel de rayas
      const n = 4 + Math.floor(r() * 4), a = w / n;
      let o = '';
      for (let i = 0; i < n; i++)
        o += `<rect x="${(x + a * i).toFixed(1)}" y="${y.toFixed(1)}" width="${(a * 0.52).toFixed(1)}" height="${h.toFixed(1)}" fill="${c}"/>`;
      return o;
    },
    anillo(x, y, w, h, c, r) {
      const rad = Math.min(w, h) / 2;
      return `<circle cx="${(x + w / 2).toFixed(1)}" cy="${(y + h / 2).toFixed(1)}" r="${rad.toFixed(1)}"
              fill="none" stroke="${c}" stroke-width="${(rad * (0.3 + r() * 0.2)).toFixed(1)}"/>`;
    },
    disco(x, y, w, h, c) {
      const rad = Math.min(w, h) / 2;
      return `<circle cx="${(x + w / 2).toFixed(1)}" cy="${(y + h / 2).toFixed(1)}" r="${rad.toFixed(1)}" fill="${c}"/>`;
    },
    media(x, y, w, h, c, r) {            // medio círculo, muy suyo de las etiquetas
      const rad = Math.min(w, h) / 2, cx = x + w / 2, cy = y + h / 2;
      const g = Math.floor(r() * 4) * 90;
      return `<path d="M${(cx - rad).toFixed(1)} ${cy.toFixed(1)} a${rad.toFixed(1)} ${rad.toFixed(1)} 0 0 1 ${(rad * 2).toFixed(1)} 0 Z"
              fill="${c}" transform="rotate(${g} ${cx.toFixed(1)} ${cy.toFixed(1)})"/>`;
    },
    perforado(x, y, w, h, c, r) {        // la columna de agujeros troquelados
      const paso = 15 + r() * 8;
      let o = `<rect x="${x.toFixed(1)}" y="${y.toFixed(1)}" width="${w.toFixed(1)}" height="${h.toFixed(1)}" fill="${c}"/>`;
      for (let py = y + paso * 0.7; py < y + h - paso * 0.3; py += paso)
        for (let px = x + paso * 0.7; px < x + w - paso * 0.3; px += paso)
          o += `<circle cx="${px.toFixed(1)}" cy="${py.toFixed(1)}" r="${(paso * 0.26).toFixed(1)}" fill="#FCF7F2" opacity=".92"/>`;
      return o;
    },
  };
  motivo.campo = (x, y, w, h, c, r) =>            // recorte de color, a secas
    `<path d="${rasgado(x, y, w, h, r, 5)}" fill="${c}"/>`;

  // Reparto con peso: el collage real es sobre todo campos de color y
  // medias lunas. Las tramas de puntos aparecen, pero no manda una sola.
  const REPARTO = [
    ['campo', 30], ['media', 16], ['anillo', 15], ['franjas', 13],
    ['disco', 12], ['puntos', 10], ['perforado', 4],
  ];
  const TOTAL = REPARTO.reduce((a, [, p]) => a + p, 0);
  const sorteaMotivo = r => {
    let n = r() * TOTAL;
    for (const [nombre, peso] of REPARTO) { n -= peso; if (n <= 0) return nombre; }
    return 'campo';
  };

  /* ==========================================================
     6b · FRONTAL DE ETIQUETA
     Es lo que abre la ficha técnica de cada blend. Si el JPG real
     está en assets/img/etiquetas/, se muestra ese, entero y sin
     recortar. Si no, se dibuja un frontal con la misma estructura
     que las etiquetas reales: cinta de arriba, escudo del logo,
     banda con el nombre, tueste y notas de cata.
     Va después del vocabulario de collage porque lo usa.
     ========================================================== */
  function frontalVector(d) {
    const r = azar(d.nombre.split('').reduce((a, c) => a + c.charCodeAt(0), 11) * 977);
    const pick = a => a[Math.floor(r() * a.length)];
    const W = 590, H = 500;
    const fondo = d.fondo || PAPEL.kraft;
    const claro = ['#EFE7DA', '#C6E6DC', '#C9A87C', '#F5EFE4'].includes(fondo);
    let o = `<path d="${rasgado(0, 0, W, H, r, 6)}" fill="${PAPEL.hueso}"/>`
          + `<path d="${rasgado(15, 15, W - 30, H - 30, r, 5)}" fill="${fondo}"/>`;

    // dos recortes de collage, uno a cada lado, detrás de todo lo demás
    [[6, 160, 240, 290], [W - 216, H - 250, 250, 235]].forEach(([x, y, w, h]) => {
      let c = pick([PAPEL.rosa, PAPEL.rojo, PAPEL.mostaza, PAPEL.verde, PAPEL.menta]);
      if (c === fondo) c = PAPEL.mostaza;
      o += `<g transform="rotate(${(r() * 16 - 8).toFixed(1)} ${x + w / 2} ${y + h / 2})" opacity=".95">
              ${motivo[sorteaMotivo(r)](x, y, w, h, c, r)}</g>`;
    });

    // banda de papel rasgado con texto centrado, el gesto base de la etiqueta
    const banda = (x, y, w, h, txt, size, largo, relleno = PAPEL.hueso, color = PAPEL.tinta, peso = 400) =>
      `<g transform="rotate(${(r() * 2.6 - 1.3).toFixed(1)} ${(x + w / 2).toFixed(1)} ${(y + h / 2).toFixed(1)})">
         <path d="${rasgado(x, y, w, h, r, 3.2)}" fill="${relleno}"/>
         <text x="${(x + w / 2).toFixed(1)}" y="${(y + h / 2 + size * 0.35).toFixed(1)}" text-anchor="middle"
               font-family="'Warung Kopi',sans-serif" font-size="${size}" font-weight="${peso}"
               letter-spacing="1.2" textLength="${largo}" lengthAdjust="spacing"
               fill="${color}">${txt}</text>
       </g>`;

    // cinta de arriba
    o += banda(42, 26, 330, 46, 'CAFÉ ORGÁNICO MEXICANO 100% ARÁBICA', 15, 290, '#E4E0D8');

    // escudo del logo, arriba a la derecha: el logotipo original, sin dibujar
    o += `<g transform="rotate(1.4 490 100)">
      <path d="${rasgado(414, 26, 152, 148, r, 4.5)}" fill="${PAPEL.hueso}"/>
      <image href="assets/img/logo-tinta.webp" x="446" y="40" width="88" height="120"/>
    </g>`;

    // banda del nombre — la pieza que manda
    const nom = d.nombre.toUpperCase();
    o += `<g transform="rotate(-1.1 292 250)">
      <path d="${rasgado(52, 186, 452, 128, r, 5.5)}" fill="${PAPEL.hueso}"/>
      <text x="278" y="278" text-anchor="middle" font-family="'LORE Display','LORE',cursive"
            font-size="86" textLength="${Math.min(400, nom.length * 52)}" lengthAdjust="spacingAndGlyphs"
            fill="${PAPEL.tinta}">${nom}</text>
    </g>`;

    // subtítulo subrayado, como el «DESCAFEINADO» de Sereno
    if (d.bajo) {
      o += `<g transform="rotate(-1.1 292 250)">
        <rect x="300" y="296" width="150" height="15" fill="${PAPEL.mostaza}"/>
        <text x="375" y="309" text-anchor="middle" font-family="'Warung Kopi',sans-serif"
              font-size="17" font-weight="700" letter-spacing="1.6" textLength="140"
              lengthAdjust="spacing" fill="${PAPEL.tinta}">${d.bajo}</text>
      </g>`;
    }

    // tueste abajo a la izquierda
    const t = d.etiquetaTueste || '';
    o += banda(46, 392, Math.min(250, 66 + t.length * 8.4), 56, t, 16,
               Math.min(214, t.length * 8.2));

    // notas abajo a la derecha, una o dos líneas
    const notas = d.notas || [];
    if (notas.length) {
      const ancho = 264, alto = 34 + notas.length * 26;
      const x = W - ancho - 40, y = H - alto - 34;
      o += `<g transform="rotate(1.2 ${x + ancho / 2} ${y + alto / 2})">
        <path d="${rasgado(x, y, ancho, alto, r, 3.4)}" fill="${PAPEL.hueso}"/>
        ${notas.map((n, i) => `<text x="${x + ancho / 2}" y="${y + 30 + i * 26}" text-anchor="middle"
            font-family="'Warung Kopi',sans-serif" font-size="15" letter-spacing="1"
            textLength="${Math.min(ancho - 34, n.length * 8)}" lengthAdjust="spacing"
            fill="${PAPEL.tinta}">${n}</text>`).join('')}
      </g>`;
    }

    return `<svg viewBox="0 0 ${W} ${H}" role="img"
            aria-label="Frontal de la etiqueta de ${d.nombre}">${o}</svg>`;
  }

  const pintaFrontal = (clave, foto) => {
    const d = BLENDS[clave];
    if (!d) return;
    const html = foto
      ? `<img src="${foto}" alt="Etiqueta de ${d.nombre}, collage de Tatifer4" loading="lazy">`
      : frontalVector(d);
    $$(`[data-frontal="${clave}"]`).forEach(el => { el.innerHTML = html; });
  };

  Object.keys(BLENDS).forEach(clave => {
    pintaFrontal(clave);
    const ruta = ETIQUETAS[clave];
    if (!ruta) return;
    const prueba = new Image();
    prueba.onload = () => pintaFrontal(clave, ruta);
    prueba.src = ruta;
  });

  /* ==========================================================
     7 · OBJETOS DE LA CASA
     ========================================================== */
  const OBJETOS = {
    taza: `<svg viewBox="0 0 120 120" role="presentation">
      <path d="M22 40h62v38a26 26 0 0 1-26 26H48a26 26 0 0 1-26-26Z" fill="#FCF7F2" stroke="#3A3A3A" stroke-width="4"/>
      <path d="M84 52h10a15 15 0 0 1 0 30h-10" fill="none" stroke="#3A3A3A" stroke-width="4"/>
      <circle cx="42" cy="62" r="5" fill="#E88FA8"/><circle cx="64" cy="62" r="5" fill="#E88FA8"/>
      <path d="M46 78q7 7 14 0" fill="none" stroke="#E31E24" stroke-width="4" stroke-linecap="round"/>
      <path d="M40 30c0-8 8-8 8-16M60 30c0-8 8-8 8-16" fill="none" stroke="#008D89" stroke-width="3.4" stroke-linecap="round"/>
    </svg>`,
    pin: `<svg viewBox="0 0 120 120" role="presentation">
      <circle cx="60" cy="60" r="38" fill="#008D89"/>
      <path d="M32 60h56M60 32v56" stroke="#FCF7F2" stroke-width="0"/>
      <rect x="38" y="38" width="26" height="26" fill="#E31E24"/>
      <path d="M64 82 78 56l14 26Z" fill="#C89B2E"/>
      <circle cx="46" cy="76" r="10" fill="#A7D6CE"/>
      <circle cx="60" cy="60" r="38" fill="none" stroke="#3A3A3A" stroke-width="4"/>
    </svg>`,
    postal: `<svg viewBox="0 0 120 120" role="presentation">
      <rect x="14" y="28" width="92" height="64" rx="3" fill="#FCF7F2" stroke="#3A3A3A" stroke-width="4"/>
      <rect x="22" y="36" width="40" height="48" fill="#C2185B"/>
      <path d="M22 84 42 56l20 28Z" fill="#C89B2E"/>
      <circle cx="34" cy="48" r="6" fill="#FCF7F2"/>
      <path d="M70 46h28M70 58h28M70 70h18" stroke="#3A3A3A" stroke-width="3.4" stroke-linecap="round"/>
    </svg>`,
    libreta: `<svg viewBox="0 0 120 120" role="presentation">
      <rect x="26" y="18" width="70" height="86" rx="3" fill="#C89B2E" stroke="#3A3A3A" stroke-width="4"/>
      <rect x="38" y="34" width="46" height="34" fill="#A7D6CE"/>
      <path d="M38 68 56 44l16 24Z" fill="#E31E24"/>
      <path d="M38 82h46M38 92h30" stroke="#3A3A3A" stroke-width="3.4" stroke-linecap="round"/>
      <path d="M26 26h-8M26 46h-8M26 66h-8M26 86h-8" stroke="#3A3A3A" stroke-width="4" stroke-linecap="round"/>
    </svg>`,
  };
  $$('[data-objeto]').forEach(el => { el.innerHTML = OBJETOS[el.dataset.objeto] || ''; });

  /* ==========================================================
     8 · AÑO EN EL PIE
     ========================================================== */
  const anio = $('[data-anio]');
  if (anio) anio.textContent = new Date().getFullYear();
})();
