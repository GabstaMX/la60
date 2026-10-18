#!/usr/bin/env python3
"""
Empaqueta una página del sitio de LA 60 en un solo archivo autocontenido.

Uso:
    python3 empaquetar.py                          # index.html
    python3 empaquetar.py --pagina obra.html
    python3 empaquetar.py --artifact salida.html   # fragmento para Artifact
    python3 empaquetar.py --enlace obra.html=https://… \
                          --enlace reservas.html=https://…

El sitio real (index.html + obra.html + assets/) sigue siendo la fuente de
verdad: esto solo lo empaqueta para revisión y para enviarlo por correo.
Fuentes, imágenes, CSS y JS quedan incrustados como data URI.
"""
import argparse, base64, mimetypes, pathlib, re, sys
from typing import Optional

RAIZ = pathlib.Path(__file__).parent
mimetypes.add_type('font/woff2', '.woff2')
mimetypes.add_type('image/webp', '.webp')


def data_uri(ruta: pathlib.Path) -> str:
    tipo = mimetypes.guess_type(ruta.name)[0] or 'application/octet-stream'
    return f"data:{tipo};base64,{base64.b64encode(ruta.read_bytes()).decode()}"


def incrusta_css(css: str, base: pathlib.Path) -> str:
    def sub(m):
        rel = m.group(1).strip('\'"')
        if rel.startswith(('data:', 'http')):
            return m.group(0)
        destino = (base / rel).resolve()
        if not destino.exists():
            print(f"  ! falta {rel}", file=sys.stderr)
            return m.group(0)
        return f"url('{data_uri(destino)}')"
    return re.sub(r"url\(([^)]+)\)", sub, css)


def empaqueta(pagina: str, enlaces: Optional[dict] = None) -> str:
    html = (RAIZ / pagina).read_text(encoding='utf-8')
    css_dir = RAIZ / 'assets/css'
    css = incrusta_css((css_dir / 'la60-web.css').read_text(encoding='utf-8'), css_dir)

    html = html.replace('<link rel="stylesheet" href="assets/css/la60-web.css">',
                        f'<style>\n{css}\n</style>')
    # los scripts, en el mismo orden en que estaban
    for js in ('assets/js/datos.js', 'assets/js/la60.js',
               'assets/js/obra.js', 'assets/js/reservas.js'):
        etiqueta = f'<script src="{js}" defer></script>'
        if etiqueta in html:
            codigo = (RAIZ / js).read_text(encoding='utf-8')
            html = html.replace(etiqueta, f'<script>\n{codigo}\n</script>')
    # las precargas ya no sirven con las fuentes incrustadas
    html = re.sub(r'\s*<link rel="preload"[^>]*>', '', html)

    # imágenes, incluidas las de subcarpetas
    for ruta in sorted((RAIZ / 'assets/img').rglob('*')):
        if not ruta.is_file() or ruta.suffix.lower() not in {'.jpg', '.jpeg', '.png', '.webp', '.svg'}:
            continue
        marca = ruta.relative_to(RAIZ).as_posix()
        if marca in html:
            html = html.replace(marca, data_uri(ruta))

    # Aviso: si queda alguna ruta de assets sin incrustar, el paquete se ve
    # bien en local (hay servidor) y roto en cualquier otro sitio. Suele pasar
    # cuando una ruta se arma por partes en JS, p. ej. 'assets/img/x/' + nombre.
    # solo rutas con extensión real: las menciones en comentarios no cuentan
    # también los scripts y hojas: si uno se queda fuera, la página no
    # solo pierde una imagen, pierde el contenido entero
    # Solo lo que el navegador iría a buscar de verdad: dentro de src=,
    # href= o url(). Las menciones en comentarios no cuentan.
    sueltas = sorted(set(re.findall(
        r'(?:src="|href="|url\(\'?)(assets/[\w./-]+\.'
        r'(?:jpg|jpeg|png|webp|svg|woff2|js|css))', html)))
    # y las rutas armadas con plantilla, que nunca son una cadena literal
    plantillas = sorted(set(re.findall(r'assets/[\w./-]*\$\{[^}]+\}[\w./${}-]*', html)))
    if plantillas:
        print("  ! rutas armadas con plantilla (el empaquetador no las ve):", file=sys.stderr)
        for r in plantillas:
            print(f"      {r}", file=sys.stderr)
    if sueltas:
        print("  ! rutas sin incrustar (el paquete saldrá con huecos):", file=sys.stderr)
        for r in sueltas:
            print(f"      {r}", file=sys.stderr)

    # En el empaquetado no hay servidor: los enlaces entre páginas se
    # reescriben a la URL publicada de cada una. Los que no tengan URL se
    # neutralizan, para que no queden enlaces muertos.
    enlaces = enlaces or {}
    for otra in ('index.html', 'obra.html', 'reservas.html', 'februllage.html'):
        if otra == pagina:
            continue
        destino = enlaces.get(otra)
        patron = re.compile(r'"' + re.escape(otra) + r'(?:[?#][^"]*)?"')
        html = patron.sub(f'"{destino}"' if destino else '"#"', html)
    return html


def fragmento(html: str, titulo: Optional[str] = None) -> str:
    """Versión para Artifact: sin doctype/html/head/body, conservando el title."""
    f = re.sub(r'(?s)^.*?<title>', '<title>', html)
    f = re.sub(r'(?s)</head>\s*<body[^>]*>\s*', '\n', f)
    f = re.sub(r'(?s)\s*</body>\s*</html>\s*$', '\n', f)
    f = re.sub(r'(?s)<meta[^>]*>\s*', '', f)
    f = f.replace('<style>', '<style>\nhtml{background:#FCF7F2}', 1)
    if titulo:
        f = re.sub(r'<title>.*?</title>', f'<title>{titulo}</title>', f, count=1)
    return f


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument('--pagina', default='index.html')
    ap.add_argument('--artifact', help='ruta del fragmento para Artifact')
    ap.add_argument('--titulo', help='título del artifact')
    ap.add_argument('--enlace', action='append', default=[], metavar='PAGINA=URL',
                    help='URL publicada de otra página, p. ej. obra.html=https://…')
    ap.add_argument('salida', nargs='?', help='ruta del documento completo')
    a = ap.parse_args()

    enlaces = {}
    for e in a.enlace:
        if '=' not in e:
            sys.exit(f"--enlace mal escrito: {e!r}. Usa PAGINA=URL")
        k, v = e.split('=', 1)
        enlaces[k] = v
    html = empaqueta(a.pagina, enlaces)

    destino = pathlib.Path(a.salida) if a.salida else \
        RAIZ / (pathlib.Path(a.pagina).stem + '-una-pieza.html')
    destino.write_text(html, encoding='utf-8')
    print(f"✓ {destino}  ({destino.stat().st_size/1_048_576:.1f} MB)")

    if a.artifact:
        p = pathlib.Path(a.artifact)
        p.write_text(fragmento(html, a.titulo), encoding='utf-8')
        print(f"✓ {p}  ({p.stat().st_size/1_048_576:.1f} MB)")


if __name__ == '__main__':
    main()
