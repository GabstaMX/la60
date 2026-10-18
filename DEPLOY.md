# Cómo publicar este repositorio

## Lo único que hay que saber

**No hay nada que compilar.** Es HTML, CSS, JavaScript y tipografías. No usa
Node, ni npm, ni un framework, ni un paso de construcción. `index.html` está
en la raíz y los enlaces entre páginas son relativos.

Si el panel que lo publica pregunta:

| Pregunta | Respuesta |
|---|---|
| Framework | Ninguno · HTML estático |
| Build command / comando de construcción | **déjalo vacío** |
| Output directory / carpeta de publicación | **`.`** (la raíz) |
| Install command | **déjalo vacío** |
| Rama | `main` |
| Versión de Node | no aplica |

Si el panel exige un comando de construcción y no acepta vacío, pon algo que
no haga nada:

```
echo "sitio estatico, nada que construir"
```

**No agregues un `package.json`.** No hace falta, y si está, algunos sistemas
intentan `npm install` y la publicación falla sin motivo.

## Lo que ya viene resuelto

Hay configuración para los formatos más comunes. El sistema que publique
tomará el que entienda e ignorará el resto; ninguno estorba a los otros.

| Archivo | Para qué |
|---|---|
| `netlify.toml` | Netlify y compatibles: raíz como carpeta publicada, 404 propio, caché de un año en `assets/` |
| `vercel.json` | Vercel: lo mismo |
| `_redirects` | Netlify en su formato de texto: lo que no exista cae en `404.html` |
| `.htaccess` | Apache y LiteSpeed, que es lo que usa el hosting de Ultra Fast: fuerza https, manda `www` a la raíz, 404 propio, caché y compresión |
| `.nojekyll` | GitHub Pages: evita que Jekyll procese el sitio y se coma carpetas |

Si acaba publicándose en algo que no es Apache, el `.htaccess` no se aplica:
el https y el redirect de `www` hay que configurarlos en ese panel.

## Qué se publica y qué no

Se publica la raíz completa. Estas carpetas están en el repositorio por
documentación y no estorban si se publican:

- `ghl/` — los bloques para pegar en GoHighLevel y el generador
- `herramientas/` — el empaquetador y el script de previsualización

Si prefieres que no salgan, bórralas de la copia publicada o excluílas en el
panel. No cambia nada del sitio.

## Después de publicar, revisa esto

1. **Las fotos de las bolsas cargan.** Son 41 imágenes en la portada; si
   alguna sale rota, es que `assets/` no subió completo.
2. **El botón rojo de cada bolsa abre WhatsApp** con el blend y la medida ya
   escritos.
3. **El selector 250 g · 500 g · 1 kg** cambia precio y fotografía.
4. **Las cuatro páginas se enlazan** entre sí desde el menú.
5. **Una ruta inventada** —algo como `/xyz`— cae en la página de error del
   sitio y no en la del hosting.

## Si el dominio se queda en GoHighLevel

Entonces esto no se publica como sitio: se usa `ghl/`. Ahí está el sitio
traducido a un bloque que se pega en el elemento de código de GHL, y la
explicación de qué se tradujo y por qué. Ojo: esa ruta **sigue necesitando un
hosting** para `assets/`, porque las imágenes y tipografías no caben dentro
del bloque.
