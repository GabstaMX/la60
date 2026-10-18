#!/usr/bin/env python3
"""
Genera un bloque pegable en el elemento de código de GoHighLevel.

El CSS del sitio se escribió para una página propia: manda sobre html y body
y da por hecho que la página entera es el contenedor que hace scroll. Dentro
de GHL nada de eso se cumple, así que aquí se traduce:

  · cada selector se encierra bajo #la60, para que el CSS de GHL y el nuestro
    no se pisen en ninguna dirección;
  · :root, html y body se reescriben a #la60, que pasa a ser la raíz;
  · las rutas relativas se vuelven absolutas, porque dentro de GHL
    "assets/..." se resolvería contra el dominio de GHL;
  · se añade un arreglo que sube por los contenedores de GHL y les quita
    overflow y transform, que son lo que rompe el position:sticky.

Uso:  python3 construir-ghl.py --base https://archivos.la60cafeatelier.com/
"""
import argparse, pathlib, re, sys

RAIZ = pathlib.Path(__file__).resolve().parent.parent
AMBITO = '#la60'


def absolutiza_rutas(texto, base):
    """assets/… → https://base/assets/…  en src= y href=, con comilla simple o doble.
    Vale igual para el HTML y para las plantillas SVG que arma el JS."""
    return re.sub(r'\b(src|href|xlink:href)=([\'"])(assets/[^\'"]+)\2',
                  lambda m: f'{m.group(1)}={m.group(2)}{base}{m.group(3)}{m.group(2)}', texto)


def absolutiza(texto, base):
    """Lo anterior, más las url() del CSS."""
    texto = absolutiza_rutas(texto, base)
    texto = re.sub(r'url\(([\'"]?)(?!data:|https?:|//)([^)\'"]+)\1\)',
                   lambda m: f"url('{base}{m.group(2).lstrip('./')}')", texto)
    return texto


def parte_en_bloques(css):
    """Corta el CSS en bloques de primer nivel: (selector_o_at, cuerpo)."""
    bloques, prof, ini = [], 0, 0
    for i, c in enumerate(css):
        if c == '{':
            if prof == 0:
                cabeza = css[ini:i].strip()
                cuerpo_ini = i + 1
            prof += 1
        elif c == '}':
            prof -= 1
            if prof == 0:
                bloques.append((cabeza, css[cuerpo_ini:i]))
                ini = i + 1
    return bloques


def prefija_selector(sel):
    partes = []
    for s in sel.split(','):
        s = s.strip()
        if not s:
            continue
        if s in (':root', 'html', 'body'):
            partes.append(AMBITO)
        elif s.startswith(('html ', 'body ')):
            partes.append(f'{AMBITO} ' + s.split(' ', 1)[1])
        elif s.startswith(('html.', 'body.', 'html:', 'body:')):
            partes.append(AMBITO + s[4:])
        elif s.startswith('@'):
            partes.append(s)
        else:
            partes.append(f'{AMBITO} {s}')
    return ', '.join(partes)


def enmarca(css):
    fuera = []
    for cabeza, cuerpo in parte_en_bloques(css):
        if cabeza.startswith('@keyframes') or cabeza.startswith('@font-face'):
            fuera.append(f'{cabeza}{{{cuerpo}}}')            # intactos
        elif cabeza.startswith('@media') or cabeza.startswith('@supports'):
            dentro = ''.join(f'{prefija_selector(h)}{{{c}}}' if not h.startswith('@')
                             else f'{h}{{{c}}}'
                             for h, c in parte_en_bloques(cuerpo))
            fuera.append(f'{cabeza}{{{dentro}}}')
        else:
            fuera.append(f'{prefija_selector(cabeza)}{{{cuerpo}}}')
    return '\n'.join(fuera)


REMIENDO = """
/* ------------------------------------------------------------------
   Arreglo para GoHighLevel.

   GHL mete el código dentro de varias cajas con su propio ancho,
   su padding y, a veces, overflow o transform. El overflow y el
   transform de cualquier antecesor anulan el position:sticky de los
   blends, que es el efecto que sostiene esa parte del sitio.

   Esto sube desde #la60 hasta body y los va limpiando. Se ejecuta
   también al redibujar, porque el editor de GHL vuelve a aplicar
   sus estilos cuando guardas.
   ------------------------------------------------------------------ */
(function () {
  function libera() {
    var n = document.getElementById('la60');
    if (!n) return;
    for (var p = n.parentElement; p && p !== document.body; p = p.parentElement) {
      var e = getComputedStyle(p);
      if (e.overflow !== 'visible')  p.style.setProperty('overflow', 'visible', 'important');
      if (e.transform !== 'none')    p.style.setProperty('transform', 'none', 'important');
      if (e.filter !== 'none')       p.style.setProperty('filter', 'none', 'important');
      if (e.contain !== 'none')      p.style.setProperty('contain', 'none', 'important');
      if (e.perspective !== 'none')  p.style.setProperty('perspective', 'none', 'important');
      p.style.setProperty('max-width', 'none', 'important');
      p.style.setProperty('padding-left', '0', 'important');
      p.style.setProperty('padding-right', '0', 'important');
    }
    document.documentElement.style.setProperty('overflow-x', 'clip');
  }
  libera();
  addEventListener('load', libera);
  new MutationObserver(libera).observe(document.documentElement,
    { attributes: true, subtree: true, attributeFilter: ['style', 'class'] });
})();
"""

GUARDA = """
/* El bloque se despega del ancho de la fila de GHL y ocupa la pantalla. */
#la60{ margin-left: calc(50% - 50vw); width: 100vw; max-width: 100vw; }
/* Y se aísla del CSS de GHL en los dos sentidos. */
#la60, #la60 *, #la60 *::before, #la60 *::after{ box-sizing: border-box; }
#la60 p, #la60 h1, #la60 h2, #la60 h3, #la60 h4, #la60 ul, #la60 ol, #la60 figure{ margin: 0; }
#la60 img{ max-width: 100%; height: auto; display: block; }
#la60 a{ text-decoration: none; }
"""


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--pagina', default='index.html')
    ap.add_argument('--base', default='https://archivos.la60cafeatelier.com/',
                    help='de dónde cuelgan assets/ (tiene que acabar en /)')
    ap.add_argument('--salida', default=None)
    a = ap.parse_args()
    base = a.base if a.base.endswith('/') else a.base + '/'

    html = (RAIZ / a.pagina).read_text()
    css  = (RAIZ / 'assets/css/la60-web.css').read_text()
    js   = '\n'.join((RAIZ / f).read_text() for f in
                     ('assets/js/datos.js', 'assets/js/la60.js'))

    # En GHL cada página es una ruta del embudo, no un archivo .html
    RUTAS = {'index.html': '/', 'obra.html': '/obra',
             'reservas.html': '/reservas', 'februllage.html': '/februllage'}
    for archivo, ruta in RUTAS.items():
        html = re.sub(r'href="' + re.escape(archivo) + r'(#[^"]*)?"',
                      lambda m: f'href="{ruta}{m.group(1) or ""}"', html)

    cuerpo = re.search(r'(?s)<body[^>]*>(.*)</body>', html).group(1)
    cuerpo = re.sub(r'(?s)<script[^>]*src=[^>]*></script>', '', cuerpo).strip()

    css = absolutiza(enmarca(css), base) + GUARDA
    cuerpo = absolutiza(cuerpo, base)
    js = absolutiza_rutas(js, base)      # el JS arma SVG con <image href="assets/…">

    salida = f"""<!-- ══════════════════════════════════════════════════════════════
     LA 60 · CAFÉ ATELIER — bloque para el elemento de código de GHL
     Generado desde {a.pagina}. No editar aquí: se edita el sitio y se
     vuelve a generar con ghl/construir-ghl.py.

     Las imágenes y las tipografías NO van dentro de este bloque: se
     cargan desde {base}
     Esa carpeta tiene que existir y ser pública antes de pegar esto.
     ══════════════════════════════════════════════════════════════ -->
<style>
{css}
</style>

<div id="la60">
{cuerpo}
</div>

<script>
{REMIENDO}
{js}
</script>
"""
    destino = pathlib.Path(a.salida or (RAIZ / 'ghl' / f'ghl-{a.pagina}'))
    destino.write_text(salida)
    print(f'✓ {destino}  ({len(salida)/1024:.1f} KB)')
    print(f'  base de archivos: {base}')
    sueltas = sorted(set(re.findall(r'(?:src|href)="(assets/[^"]+)"', salida)) |
                     set(re.findall(r"url\('(?!http|data)([^']+)'\)", salida)))
    print('  rutas sin absolutizar:', sueltas or 'ninguna')


if __name__ == '__main__':
    main()
