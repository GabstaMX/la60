# LA 60 en el editor de GoHighLevel

Dos salidas. Las dos funcionan; cambian en qué pagas por usarlas.

## Salida A · el bloque traducido  (`ghl-*.html`)

El sitio entero —estilos, marcado y comportamiento— dentro de un solo
elemento de código de GHL. El contenido vive en GHL y se indexa con el
dominio.

Qué hace el generador, y por qué:

| Problema dentro de GHL | Qué se hizo |
|---|---|
| El CSS del sitio manda sobre `html` y `body`, que en GHL no son suyos | cada selector se encierra bajo `#la60`; `:root`, `html` y `body` se reescriben a ese contenedor |
| El CSS de GHL se cuela en el sitio y al revés | el mismo encierro, más un guard de `box-sizing` y márgenes |
| `assets/…` se resolvería contra el dominio de GHL | todas las rutas se vuelven absolutas, también las que el JS arma dentro de SVG |
| Las filas de GHL traen `overflow`, `transform` y ancho máximo, y eso **anula el `position:sticky`** de los blends | un script sube de `#la60` hasta `body` limpiando esas propiedades, y se repite con un MutationObserver porque el editor las vuelve a aplicar al guardar |
| El bloque quedaría metido en una columna angosta | `margin-left: calc(50% - 50vw)` y `width:100vw` lo sacan a sangre |
| Los enlaces entre páginas apuntan a `.html` | se reescriben a las rutas del embudo: `/`, `/obra`, `/reservas`, `/februllage` |

**Las imágenes y las tipografías no van dentro del bloque.** Son 9 MB; no
caben ni conviene. Se cargan desde una carpeta pública, que por defecto es
`https://archivos.la60cafeatelier.com/`. Esa carpeta tiene que existir antes
de pegar nada: se sube `assets/` por FTP a un subdominio del hosting.

Si usas otra dirección, se regenera:

    python3 ghl/construir-ghl.py --pagina index.html --base https://la-tuya.com/

Probado dentro de una página que imita el DOM de GHL —filas con ancho máximo,
padding, `overflow:hidden`, `transform` y `contain`—: el bloque sale a sangre,
las 41 imágenes cargan y el `sticky` de los blends queda clavado en 0.

## Salida B · el iframe  (`ghl-iframe.html`)

GHL sólo abre una ventana al sitio real. Diez líneas, nada que traducir,
imposible que se degrade: es la página de verdad.

A cambio, el contenido no se indexa bajo el dominio y la URL no cambia al
navegar dentro.

## Cuál conviene

Si el sitio es lo principal del dominio, no uses ninguna de las dos: publica
el sitio en el hosting y deja GHL para lo que GHL hace bien —cobrar, el CRM,
la lealtad— en sus subdominios. Las dos salidas de esta carpeta existen para
cuando mover el DNS no es opción.
