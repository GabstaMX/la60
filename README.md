# LA 60 · Café Atelier

Sitio de LA 60 Café Atelier — cafetería, galería y taller de collage en
Calle 60 № 393, Centro, Mérida, Yucatán.

Cuatro páginas estáticas. Sin framework, sin compilación, sin dependencias:
se abre `index.html` y funciona. Lo que se sube al hosting es la raíz de este
repositorio tal cual.

## Las páginas

| Archivo | Qué es |
|---|---|
| `index.html` | Inicio: el café, los cuatro blends, la tienda, el Atelier del mes, el taller y el espacio |
| `obra.html` | Catálogo de collage original de Tatifer4, artista residente. 17 piezas en cuatro series |
| `reservas.html` | Un formulario con cuatro intenciones: mesa de collage, mesa en la cafetería, apartar café, apartar una pieza |
| `februllage.html` | Februllage Yucatán, festival internacional de collage, 15–21 de febrero de 2027 |
| `404.html` | Página de error |

## Cómo está armado

```
assets/
├── css/la60-web.css     23 secciones numeradas; los colores y tipos de la marca
├── fonts/               13 woff2, todas servidas desde aquí
├── img/                 fotos de bolsas, obra, espacio y recortes de collage
└── js/
    ├── datos.js         FUENTE ÚNICA: blends, precios, piezas, series, taller
    ├── la60.js          movimiento, revelados, selector de gramaje
    ├── obra.js          dibuja el catálogo desde los datos
    └── reservas.js      arma el mensaje de la reserva
```

**`assets/js/datos.js` manda.** Precios, piezas y series se editan ahí y las
tres páginas se actualizan solas. No hay que tocar el HTML.

### Dos cosas del CSS que conviene saber antes de tocarlo

`.cifra__n` necesita más especificidad que `.cifra p`, o los números grandes
salen a tamaño de párrafo. Por eso está escrito `.cifra .cifra__n`.

El `html` lleva `overflow-x: clip`, no `hidden`. Con `hidden` se rompe el
`position: sticky` de los blends, que es el efecto que sostiene esa sección.

### El motor de objetos flotantes

Cada objeto son dos capas anidadas: la de fuera recibe el paralaje del ratón y
del scroll por JavaScript, la de dentro respira sola con una animación de CSS.
Separadas, nunca se pisan el `transform`. Se posicionan con variables
(`--x`, `--y`, `--w`, `--depth`, `--rot`, `--dur`, `--amp`, `--z`), así que
mover un objeto es cambiar un número, no tocar el motor.

Con `prefers-reduced-motion` todo el movimiento se apaga.

## Herramientas

`herramientas/empaquetar.py` convierte una página en un solo archivo HTML con
todo incrustado —tipografías, imágenes, CSS y JS en base64— para mandar por
correo o enseñar sin internet.

```bash
python3 herramientas/empaquetar.py --pagina index.html
```

`herramientas/ver.sh` copia el sitio a una carpeta que el previsualizador
pueda leer.

## La carpeta `ghl/`

GoHighLevel no sirve archivos: hay que pegarle el sitio dentro de un elemento
de código. `ghl/construir-ghl.py` traduce una página a ese formato —encierra
el CSS bajo `#la60`, vuelve absolutas las rutas y añade un arreglo que libera
el `position:sticky` de los contenedores de GHL—. El detalle está en
`ghl/LEEME.md`.

Esa ruta sigue necesitando un hosting para `assets/`, que no cabe en el
bloque.

## Pendientes

- **Enlaces de pago.** `assets/js/datos.js` tiene una tabla `COMPRA` con doce
  casillas vacías, una por blend y medida. Mientras sigan vacías, el botón de
  cada bolsa manda el pedido por WhatsApp con el blend y la medida escritos.
  Al pegar un enlace, ese botón pasa a decir «Comprar» y va al checkout.
- **Correo y teléfono en reservas.** El formulario solo pide el nombre, porque
  sale por WhatsApp. Para que las reservas entren a un CRM hacen falta esos
  dos campos.
- **Licencia de LORE**, la tipografía de los títulos: verificar que cubra uso
  web antes de publicar.

## Reglas de la marca

- El café es **de Chiapas, México**. Nunca de Colombia.
- El logotipo no se rediseña, no se recorta, no se recolorea y no se adapta.
  La tachadura sobre «Café Atelier» es parte del logotipo.
- En el material del festival, la firma es «LA 60 Café Atelier, con Tatifer
  como artista residente».
- Lo que va entre `[corchetes]` es un hueco por llenar. Se deja a la vista a
  propósito, para que no se publique por error.
