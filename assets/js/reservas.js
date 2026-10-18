/* ============================================================
   LA 60 · RESERVAS
   ------------------------------------------------------------
   Una sola superficie, cuatro intenciones. No cuatro formularios:
   se elige qué quieres y solo aparecen los campos de eso.

   No hay pasarela de pago todavía. El cierre es por mensaje, con
   el resumen ya escrito — es lo que más convierte y lo único
   honesto mientras no haya cobro en línea.

   PARA PONERLO EN PRODUCCIÓN falta una cosa: el número de
   WhatsApp, aquí abajo. Mientras esté vacío, el botón principal
   es Instagram y se ofrece copiar el mensaje.
   ============================================================ */
(() => {
  'use strict';
  const $  = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];

  // WhatsApp del 393: 52 (México) + los 10 dígitos de Mérida.
  const WHATSAPP = '529996226722';
  const INSTAGRAM = 'https://www.instagram.com/lasesenta';

  const { BLENDS, GRAMAJES, MOLIENDAS, TALLER, PIEZAS } = window.LA60;
  const pesos = n => '$' + n.toLocaleString('es-MX');

  const form = $('#reserva');
  if (!form) return;

  /* ==========================================================
     1 · POBLAR LOS SELECTORES DESDE LOS DATOS
     ========================================================== */
  $('#blend').innerHTML = BLENDS
    .map(b => `<option value="${b.id}">${b.nombre} — ${b.perfil}</option>`).join('');
  $('#molienda').innerHTML = MOLIENDAS
    .map(m => `<option value="${m}">${m}</option>`).join('');
  $('#pieza').innerHTML = PIEZAS
    .map((p, i) => `<option value="${i}">${p.ref} — ${pesos(p.precio)}</option>`).join('');

  const pintaGramajes = () => {
    const b = BLENDS.find(x => x.id === $('#blend').value);
    const opciones = b.solo250 ? GRAMAJES.filter(g => g.id === '250') : GRAMAJES;
    $('#gramaje').innerHTML = opciones.map(g => {
      const precio = b.solo250 && g.precioMes ? g.precioMes : g.precio;
      return `<option value="${g.id}">${g.etiqueta} — ${pesos(precio)}</option>`;
    }).join('');
  };
  pintaGramajes();

  // la fecha no puede ser en el pasado
  const hoy = new Date();
  const iso = d => d.toISOString().slice(0, 10);
  $('#fecha').min = iso(hoy);
  $('#fecha').value = iso(new Date(hoy.getTime() + 864e5));   // mañana, por defecto

  /* ==========================================================
     2 · QUÉ CAMPOS SE VEN
     ========================================================== */
  const intencion = () => (form.querySelector('input[name="intencion"]:checked') || {}).value;

  function ajusta() {
    const q = intencion();
    $$('[data-para]').forEach(el => {
      el.hidden = !el.dataset.para.split(' ').includes(q);
    });
    // los campos ocultos no deben bloquear el envío
    $$('[data-para]').forEach(el => {
      $$('input,select,textarea', el).forEach(c => { c.disabled = el.hidden; });
    });
    $$('.opcion').forEach(o => {
      o.classList.toggle('is-elegida', $('input', o).value === q);
    });
    calcula();
  }

  /* ==========================================================
     3 · EL RESUMEN, QUE SE ARMA MIENTRAS ELIGES
     ========================================================== */
  const FECHA_LARGA = { weekday: 'long', day: 'numeric', month: 'long' };

  function detalle() {
    const q = intencion();
    const d = [];
    const f = $('#fecha').value;
    const fechaTxt = f
      ? new Date(f + 'T12:00').toLocaleDateString('es-MX', FECHA_LARGA)
      : null;
    const hora = $('#hora').value;

    let total = null, titulo = '', pie = '';

    if (q === 'taller') {
      const n = +$('#personas').value || 1;
      const est = Math.min(+$('#estudiantes').value || 0, n);
      total = TALLER.cuota * (n - est) + TALLER.cuotaEstudiante * est;
      titulo = 'Un lugar en la mesa de collage';
      d.push(['Día', [fechaTxt, hora].filter(Boolean).join(' · ') || 'por definir']);
      d.push(['Personas', est ? `${n} (${est} con credencial de estudiante)` : String(n)]);
      pie = 'Incluye materiales. El café va aparte.';
    }

    if (q === 'mesa') {
      const n = +$('#personas-mesa').value || 1;
      total = 0;                       // reservar mesa no cuesta: 0, no null
      titulo = 'Una mesa en la cafetería';
      d.push(['Día', [fechaTxt, hora].filter(Boolean).join(' · ') || 'por definir']);
      d.push(['Personas', String(n)]);
      pie = 'Sin costo. Solo para saber que llegan.';
    }

    if (q === 'cafe') {
      const b = BLENDS.find(x => x.id === $('#blend').value);
      const g = GRAMAJES.find(x => x.id === $('#gramaje').value) || GRAMAJES[0];
      const precio = b.solo250 && g.precioMes ? g.precioMes : g.precio;
      const cant = +$('#cantidad').value || 1;
      total = precio * cant;
      titulo = 'Apartar café';
      d.push(['Blend', b.nombre]);
      d.push(['Presentación', `${g.etiqueta} × ${cant}`]);
      d.push(['Molienda', $('#molienda').value]);
      d.push(['Entrega', $('#entrega').value]);
      pie = 'Se muele al momento. 45 días desde el tueste.';
    }

    if (q === 'obra') {
      const p = PIEZAS[+$('#pieza').value] || PIEZAS[0];
      total = p.precio;
      titulo = 'Apartar una pieza de Tatifer4';
      d.push(['Pieza', p.ref]);
      d.push(['Entrega', $('#entrega-obra').value]);
      pie = 'Pieza única. Se aparta hasta que la veas.';
    }

    const nombre = $('#nombre').value.trim();
    if (nombre) d.push(['Nombre', nombre]);
    const nota = $('#nota').value.trim();
    if (nota) d.push(['Nota', nota]);

    return { titulo, detalles: d, total, pie };
  }

  function calcula() {
    const { titulo, detalles, total, pie } = detalle();
    $('#resumen-titulo').textContent = titulo || 'Elige qué quieres';
    $('#resumen-lista').innerHTML = detalles
      .map(([k, v]) => `<div><dt>${k}</dt><dd>${v}</dd></div>`).join('');
    $('#resumen-total').textContent =
      total === null ? '—' : total === 0 ? 'Sin costo' : pesos(total);
    $('#resumen-pie').textContent = pie;
    $('#resumen-pie').hidden = !pie;
  }

  /* ==========================================================
     4 · EL MENSAJE
     ========================================================== */
  function mensaje() {
    const { titulo, detalles, total } = detalle();
    const lineas = ['Hola LA 60, quiero reservar:', '', titulo];
    detalles.forEach(([k, v]) => lineas.push(`${k}: ${v}`));
    if (total !== null) {
      lineas.push('', total === 0 ? 'Sin costo' : `Total estimado: ${pesos(total)}`);
    }
    lineas.push('', '(Enviado desde la60cafeatelier.com)');
    return lineas.join('\n');
  }

  const enviar = $('#enviar');
  const copiar = $('#copiar');
  const aviso  = $('#aviso');

  if (WHATSAPP) {
    enviar.querySelector('span').textContent = 'Enviar por WhatsApp';
  } else {
    enviar.querySelector('span').textContent = 'Enviar por Instagram';
    aviso.hidden = false;
  }

  form.addEventListener('submit', e => {
    e.preventDefault();
    const txt = mensaje();
    if (WHATSAPP) {
      open(`https://wa.me/${WHATSAPP}?text=${encodeURIComponent(txt)}`, '_blank', 'noopener');
      return;
    }
    // sin WhatsApp: se copia el resumen y se abre el DM de Instagram
    const abrir = () => open(INSTAGRAM, '_blank', 'noopener');
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(txt).then(abrir, abrir);
      señal('Resumen copiado. Pégalo en el mensaje.');
    } else { abrir(); }
  });

  copiar.addEventListener('click', () => {
    const txt = mensaje();
    if (navigator.clipboard?.writeText) {
      navigator.clipboard.writeText(txt)
        .then(() => señal('Resumen copiado.'), () => señal('No se pudo copiar.'));
    } else { señal('No se pudo copiar.'); }
  });

  let reloj;
  function señal(t) {
    const s = $('#señal');
    s.textContent = t; s.hidden = false;
    clearTimeout(reloj);
    reloj = setTimeout(() => { s.hidden = true; }, 4000);
  }

  /* ==========================================================
     5 · ENLACES QUE LLEGAN CON LA INTENCIÓN PUESTA
     reservas.html?intencion=obra&pieza=3
     ========================================================== */
  const url = new URLSearchParams(location.search);
  const quiere = url.get('intencion');
  if (quiere) {
    const r = form.querySelector(`input[name="intencion"][value="${quiere}"]`);
    if (r) r.checked = true;
  }
  const pieza = url.get('pieza');
  if (pieza !== null && PIEZAS[+pieza]) $('#pieza').value = String(+pieza);

  form.addEventListener('change', ajusta);
  form.addEventListener('input', calcula);
  $('#blend').addEventListener('change', () => { pintaGramajes(); calcula(); });
  ajusta();

  const anio = $('[data-anio]');
  if (anio) anio.textContent = new Date().getFullYear();
})();
