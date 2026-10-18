# LA 60 · Café Atelier — sitio web

Home completo. Una sola página larga que vende el café en bolsa, muestra la obra
de Tatifer4 y explica el atelier de collage.

**Versión:** 5.0 · 2026-10-04
**Base:** `LA60_sistema_visual_v3` (Manual Gráfico de Usos de CNSTR) y
`Dossier_Cafe_La60.pdf`. Este sitio no inventa marca: la aplica.

---

## De dónde salen los recursos

Todo el material original vive en el escritorio, no en esta carpeta:

```
~/Desktop/LA60 2026/
  Logosla60 2026/              logotipo original (líneas, blanco, color)
  Etiquetas Café 12x10/        las 4 etiquetas de imprenta + la trasera
  Pack Fotos La60/             fotografía del local
  COLLAGES TATIFER PACK BRANDKIT/   las 10 obras de Tatifer4 que están en la galería
~/Downloads/manteleta.jpg      el pliego recortable
Drive de tatifer4@gmail.com    7 piezas de gran formato · carpeta 1aNIr3O1H_…
                               se bajan con el conector de Drive de Claude
~/Downloads/Muckups boslas con render etiquetas aplicadas/
                               renders de las bolsas, 4 escenas
```

Lo de `la60-web/assets/` son **derivados para web** de esos originales:
convertidos, recortados y comprimidos, nunca rediseñados. Si un original
cambia, se vuelve a derivar; no se retoca el derivado.

---

## Qué se entrega

```
la60-web/
  index.html              la portada
  obra.html               el catálogo de obra de Tatifer4 — página aparte
  reservas.html           una sola forma para las cuatro ventas
  februllage.html         maqueta preliminar del festival
  assets/css/la60-web.css sistema completo · un solo archivo
  assets/js/la60.js       movimiento, frontales, objetos
  assets/js/datos.js      fuente única: series, piezas, blends, cuotas
  assets/js/obra.js       armado del catálogo
  assets/js/reservas.js   el motor de reservas
  assets/fonts/           las 5 familias oficiales en woff2
  assets/img/             logotipo, personaje, cafetos y fotos del local
  assets/img/recortes/    44 recortes de la manteleta, con transparencia
  assets/img/etiquetas/   las 4 etiquetas originales + la trasera
  assets/img/bolsas/      los 4 renders recortados + la escena en salvia
  assets/img/obra/        las 10 obras de Tatifer4
  empaquetar.py           genera la versión de un solo archivo
  index-una-pieza.html    portada con todo incrustado · doble clic
  obra-una-pieza.html     catálogo con todo incrustado · doble clic
  reservas-una-pieza.html reservas con todo incrustado · doble clic
  ver.sh                  copia el sitio a la carpeta del previsualizador
```

Para verlo en local basta abrir `la60-una-pieza.html`. Para trabajar sobre él,
servir la carpeta con cualquier servidor estático y editar `index.html`.

---

## La idea

La 60 **es** un collage: el muro-ensamblaje, los marcos, las mesas. El sitio no
ilustra esa idea, la ejecuta. Los objetos de la casa —las bolsas de café, los
recortes de obra, el cafeto de los muros, la anfitriona dibujada— **flotan** en
la página y se separan en profundidad según el ratón y el scroll. La composición
se rehace sola mientras bajas: es el mismo gesto de recortar y superponer, pero
en movimiento.

### El motor de objetos flotantes

Dos capas por objeto, y nunca compiten por el mismo `transform`:

| Capa | Quién la mueve | Qué hace |
|---|---|---|
| `.flota` | JS | paralaje de ratón (`--mx/--my`) y de scroll (`--sy`), multiplicado por `--depth` |
| `.flota__i` | CSS | respiración continua: sube, baja y bascula (`@keyframes respira`) |

Para añadir un objeto nuevo basta con esto dentro de un contenedor `.escena`:

```html
<div class="flota" data-scroll="180"
     style="--x:20%;--y:40%;--w:160px;--depth:1.6;--rot:-8deg;--dur:11s;--amp:18px;--z:8">
  <div class="flota__i"><img src="assets/img/loquesea.png" alt=""></div>
</div>
```

`--depth` es lo único que importa afinar: cuanto más alto, más cerca parece.
Los objetos de la portada tienen sus posiciones en el CSS (`.h-*`) y no en el
HTML, porque en móvil se reparten distinto para dejar libre la franja del
título.

Con `prefers-reduced-motion` todo el movimiento se apaga y la página se lee
como un documento quieto. Es intencional, no un descarte.

---

## De dónde sale cada dato

Nada de lo que aparece está inventado.

| Contenido | Fuente |
|---|---|
| Origen, variedades, notas de cata, los 4 blends | `Dossier_Cafe_La60.pdf` |
| Precios del café (150 / 280 / 560 · 190 el del mes) | dossier, pág. 9 y 10 |
| Precios de obra y objetos | `ProductList La60 Nov2025.xlsx`, categorías *Art Collage*, *Ceramics* y *Productos cafetería* |
| Cuota del taller ($350 · $200 estudiante) | misma lista, *Cuota collage* |
| Paleta, tipografías, tono de voz, regla del tachado | `01_Identidad_y_Marca_v2.md` |
| Fotos del espacio | las 5 del sistema visual v3 |
| Recortes que flotan | `manteleta.jpg` — el pliego recortable de LA 60 |

---

## Imágenes: qué hay y qué falta

Solo se usan imágenes reales de LA 60. Los recortes que yo había sacado del
muro salieron todos: se veían borrosos y no eran obra, eran fotografía picada.

**El logotipo, original y sin tocar**

Se usa el archivo tal cual: no se recorta, no se recolorea, no se le añade
nada, no se rediseña. Solo se escala.

- `logo-tinta.webp` — de `la60_logo_lineas.jpeg`, con el blanco del JPEG
  convertido a transparencia. Es la versión para fondos claros.
- `logo-blanco.webp` — de `export.png`, que ya venía con transparencia. Para
  fondos oscuros o de color; hoy no se usa, queda lista.

Va en la portada (es el `<h1>`, con el nombre completo en el `alt`), en el pie
y dentro del respaldo de las etiquetas. **En la barra de navegación no va**: a
la altura de una píldora quedaría ilegible, y adaptarlo va contra la regla del
manual, así que ahí está el nombre en tipografía de marca. La insignia con un
«60» que yo había inventado antes desapareció: era un rediseño del logo.

**Lo que se queda tal cual**

- `personaje.webp` — la anfitriona dibujada, recortada sobre transparente.
- `cafeto-kinder.webp` y `cafeto-mostaza.webp` — el cafeto en trazo de línea,
  el mismo que está pintado en los muros.
- Las cinco fotos del local (`espacio-*.jpg`): sostienen «El espacio», el
  retrato de la sección de Tatifer4 y el bloque del taller. Son fotografía real
  del sitio, no recortes.

**Los recortes de la manteleta**

Lo que flota por toda la página son los recortes de la **manteleta recortable**
de LA 60, extraídos uno por uno del pliego original y guardados con
transparencia en `assets/img/recortes/`. Hay 44 en la biblioteca; en la página
se usan 14, a escalas deliberadamente distintas —del patín de 164 px al corazón
de 54— para que la composición tenga primer plano y fondo de verdad.

| Dónde | Qué flota |
|---|---|
| Portada | patín, perro, elefante, muñeca, flor negra, libélula, rosa, corazón, caracol, reloj |
| Origen | mariposa amarilla |
| Tienda | dos hongos |
| Atelier del mes | recorte de prensa «NEXT!» y un ojo |

La extracción fue por componentes conexos sobre el blanco del pliego, con
relleno de huecos y suavizado de la orilla; se descartó el rótulo rosa, el
escudo del logo y todo lo que a tamaño pequeño no se lee. Para meter otro
recorte de la biblioteca basta cambiar el `src` y darle su propia `--w`.

Los recortes van **sin marco**: ya tienen su silueta. Solo una sombra los
separa del fondo.

**El frontal abre la ficha técnica de cada blend**

Cada uno de los cuatro blends tiene su sección con la ficha —tueste, carácter,
variedades, para qué método, notas de cata— y la abre **el frontal de su
etiqueta**, a tamaño grande, flotando y con respaldo de papel para que se lea
como pegado sobre el plano de color. No una bolsa pequeña: la etiqueta es la
pieza gráfica del blend.

Mientras no estén los archivos, ese frontal se dibuja con la misma estructura
que tus etiquetas reales: cinta de arriba con «CAFÉ ORGÁNICO MEXICANO 100 %
ARÁBICA», escudo del logo arriba a la derecha, banda con el nombre en LORE,
tueste abajo a la izquierda y notas de cata abajo a la derecha. Sereno lleva
además su «DESCAFEINADO» subrayado en mostaza.

Regla de logo que respeta el frontal: **la tachadura de «Café Atelier» y la
caja del 393 van siempre en kinder**, en los cuatro blends. No cambian con el
color del blend.

La bolsa kraft con la etiqueta pegada sigue en la portada, en la tienda y en el
Atelier del mes.

**Las cuatro etiquetas, originales y enteras**

Los archivos de imprenta (12 × 10 cm, CMYK, 2835 × 2362) se convirtieron a
sRGB **con el perfil ICC incrustado en cada archivo**, intento perceptual —
no con la conversión ciega de PIL, que apaga los verdes y los rosas. Después
se reescalaron a 1600 px de ancho. Nada más: ni recorte, ni retoque, ni
recoloreado.

```
assets/img/etiquetas/atelier.jpg    de atelier.jpg
assets/img/etiquetas/col-coll.jpg   de etiqueta-col-coll-250.jpg
assets/img/etiquetas/darkneo.jpg    de etiqueta-darkneo-french.jpg
assets/img/etiquetas/sereno.jpg     de etiqueta-sereno.jpg
assets/img/etiquetas/trasera.jpg    de etiqueta-trasera.jpg
```

Se muestran **enteras, sin recortar**, como el frontal grande que abre la ficha
técnica de cada blend. La **trasera** —la guía de preparación de los cinco
métodos— es ahora la pieza que ilustra el *Atelier del mes*, porque es
exactamente lo que esa sección describe: «origen, proceso, notas de cata y guía
de preparación para cinco métodos».

**Las bolsas son los renders reales**

El bote que yo había dibujado en SVG desapareció: era bonito pero ese producto
no existe. Ahora las bolsas son los renders, recortados con transparencia del
render en **salvia** —el fondo verde es lo único verde de la imagen, así que
separa limpio las cuatro bolsas: rosa, blanca, roja y blanca—.

```
assets/img/bolsas/atelier.webp    Atelier  · bolsa rosa
assets/img/bolsas/col-coll.webp   Col-Coll · bolsa blanca
assets/img/bolsas/darkneo.webp    Darkneo  · bolsa roja
assets/img/bolsas/sereno.webp     Sereno   · bolsa blanca
assets/img/bolsas/linea-salvia.jpg  la escena completa, cerrando la tienda
```

De las cuatro escenas se usan solo las dos claras: **estudio blanco** y
**salvia**. Concreto gris y nocturno moody quedan fuera. A la escena de salvia
se le recortó el rótulo del mockup («SALVIA · SOMBRA LARGA SUAVE») de arriba:
eso era anotación de trabajo, no contenido.

El azulejo de cada tarjeta de la tienda es un **lavado claro** del color de su
blend, no el color pleno: el render ya trae su propia sombra y sobre color
saturado se perdía —el rojo de Darkneo desaparecía contra el rojo del azulejo—.

**El catálogo de obra vive aparte: `obra.html`**

El catálogo no corre en el scroll de la portada. Se entra por botón, y por dos
razones: la obra pide su propio ritmo, y así el día que Tatifer4 tenga dominio
propio esa página sale de aquí sin arrastrar nada.

En la portada queda **la invitación**: la autora, el texto, cuatro piezas de
muestra —una por serie— y el pase «Entrar al catálogo». Nada más.

**Las cuatro series y sus seccionadores**

Cada serie abre con un seccionador: número de serie, el nombre en LORE a
tamaño de rótulo, una línea en Caveat sobre de qué va, y los datos —cuántas
piezas y en qué rango de precio—. Cada una sobre su propio plano de color, con
el corte diagonal del sistema.

| Serie | Piezas | Precio | Plano |
|---|---|---|---|
| Eclipses | 3 | $6,000 | tinta |
| Anatomías | 3 | $6,000 | kinder |
| Abstracto | 5 | $300 – $950 | papel |
| Capas | 6 | $200 – $6,000 | menta |

**Las series son una propuesta mía, no de Tatifer.** Las agrupé mirando las
piezas: los soles tapados en Eclipses, el corazón y el ojo en Anatomías, la
tijera limpia en Abstracto, las transparencias en Capas. Renombrarlas o
reordenarlas es decisión suya.

Reagrupar es barato: todo el catálogo se dibuja desde dos listas al principio
de `assets/js/obra.js` —`SERIES` y `PIEZAS`—. Mover una pieza de serie es
cambiar su campo `serie`; renombrar una serie o cambiar su color de fondo es
editar una línea de `SERIES`. Si algún día importa el SEO del catálogo, hay que
congelar ese HTML a estático.

**El emparejamiento foto ↔ precio de las diez piezas anteriores lo hice por
orden de archivo.** Los precios son reales (`ProductList La60 Nov2025.xlsx`),
pero cuál corresponde a cuál foto lo supuse yo. Conviene que Tatifer lo
confirme antes de publicar.

### Cómo bajar más obra del Drive

El conector de Drive de Claude ya está autorizado; la carpeta no es pública, así
que `curl` no sirve. El camino que funciona:

1. `search_files` con `parentId = '<id de la carpeta>'` para listar.
2. `download_file_content` por cada `fileId`. El resultado es demasiado grande
   para la conversación, así que el harness lo guarda en un `.txt` de
   `tool-results/` con la forma `{content, id, mimeType, title}`.
3. Decodificar el `content` (base64) a disco con Python. Nunca hace falta que
   los bytes pasen por el chat.

**El horario** sigue como «Por confirmar», con un comentario HTML en ese punto.

## Bloqueo pendiente de la marca

**LORE sigue sin licencia comprada** ($18 USD · Standard Desktop · TYPEHEIST, a
nombre de VIDABUST S.A.S. de C.V.). El sitio la carga desde `assets/fonts/`
igual que el resto del sistema editorial. Antes de publicar en un dominio
público hay que comprarla, y verificar además que la licencia cubra **uso web**
—la de escritorio no siempre lo hace—. Las otras cuatro están en regla:
Warung Kopi, Limoncello Recipe (EULA retail) y Caveat (SIL OFL).

Los nombres de los blends en las etiquetas usan `textLength`, así que si LORE
no cargara, el respaldo entra sin desbordar la etiqueta.

---

## Decisiones que conviene conocer

- **La obra de Tatifer4 vive dentro de este sitio**, en su propia sección con
  color y ritmo propios, y el bloque está marcado `data-modulo="tatifer4"`.
  Cuando su catálogo crezca lo suficiente para justificar dominio propio, esa
  sección sale de aquí sin arrastrar nada más.
- **El tachado sobre «Café Atelier» es parte del logo**, no decoración: aparece
  en la portada (animado, se traza al entrar) y en cada etiqueta de bolsa.
- **El 393 está en la pestaña lateral fija**, en el pie y en todas las bolsas.
- **La cuadrícula blanco/rojo** aparece como textura al pie de la portada.
- El selector de gramaje cambia los precios en sitio; el *Atelier del mes* no
  entra en él porque solo existe en 250 g.

---

## Cosas que cazamos al construirlo

Dos errores reales que el manual ya advertía y conviene no repetir:

- `.cifra p` le ganaba en especificidad a `.cifra__n` y dejaba las cifras de
  «1 400 m / 84+ / 100 %» en 15 px. Es exactamente el aviso de la sección
  *Implementación técnica* del manual de marca.
- `img { max-width:100% }` sin `height:auto` deformaba todas las fotos: el ancho
  se encogía y el alto se quedaba en el del atributo.

---

## Siguiente paso natural

Este home sirve para aprobar dirección. Lo que falta para que sea tienda:

1. Fotografía real de obra y de las bolsas.
2. Carrito y pago. Con el catálogo que hay (4 blends × 3 gramajes + obra única)
   WooCommerce es más que suficiente.
3. Páginas internas: ficha por blend, ficha por obra, y la guía de preparación
   de los cinco métodos que ya va impresa en la bolsa del mes.
4. Horario y política de envíos.

---

## Reservas · `reservas.html`

Es el punto donde el sitio deja de ser folleto. Una **sola superficie con
cuatro intenciones**, no cuatro formularios: se elige qué quieres y solo
aparecen los campos de eso.

| Intención | Qué cobra | Campos |
|---|---|---|
| Mesa de collage | $350 · $200 con credencial | día, hora, personas, estudiantes |
| Mesa en la cafetería | sin costo | día, hora, personas |
| Apartar café | $150 – $560 · del mes $190 | blend, presentación, cantidad, molienda, entrega |
| Apartar una pieza | $200 – $6,000 | pieza, entrega |

El resumen se arma mientras eliges, con el total en vivo. Un solo botón cierra.

### Por qué no hay pasarela de pago

Porque todavía no hay cobro en línea, y un formulario que no cobra ni avisa a
nadie es peor que no tenerlo. El cierre es **por mensaje con el resumen ya
escrito**: qué, cuándo, cuántos y cuánto. Es lo que más convierte en un negocio
de este tamaño y lo único honesto hoy.

Para la obra, además, apartar es lo correcto: cada pieza es única y se ve
distinta en persona. Un carrito de compra ahí sería un error, no una carencia.

### LO QUE FALTA PARA PONERLO EN VIVO

**1 · El número de WhatsApp.** Es una línea, arriba de `assets/js/reservas.js`:

```js
const WHATSAPP = '';   // México: 52 + 10 dígitos, p. ej. '5219991234567'
```

Mientras esté vacío, el botón dice «Enviar por Instagram»: copia el resumen al
portapapeles y abre @lasesenta para pegarlo. Funciona, pero pierde gente. Con
el número puesto, el botón pasa a WhatsApp con el mensaje ya redactado y no hay
que tocar nada más.

**2 · El horario.** La página dice «el horario está por confirmar» y pide la
hora que le acomode al cliente. Es honesto, pero conviene cerrarlo.

**3 · Dos políticas que no me consta cuáles son:**
- **Aforo de la mesa de collage.** El formulario acepta hasta 10 personas
  porque hay que poner un número; el real lo saben ustedes.
- **Anticipo para apartar obra.** Hoy se aparta sin anticipo. Si se pide uno,
  va en el punto 3 de «Cómo funciona».

### Enlaces con la intención puesta

Los botones del sitio llegan con todo preseleccionado:

```
reservas.html?intencion=taller
reservas.html?intencion=cafe
reservas.html?intencion=mesa
reservas.html?intencion=obra
reservas.html?intencion=obra&pieza=3     ← cada tarjeta del catálogo
```

---

## Una fuente para los precios

`assets/js/datos.js` es la única fuente de series, piezas, blends, gramajes y
cuotas. Lo consumen el catálogo y las reservas. Antes los precios de la obra
estaban en dos sitios: eso es exactamente lo que se queda viejo.

---

## Empaquetar: la trampa que ya nos costó dos veces

`empaquetar.py` incrusta todo buscando **cadenas literales**. Dos formas de
romperlo, ambas silenciosas porque en local hay servidor y todo resuelve:

1. **Rutas armadas por partes.** `'assets/img/obra/' + nombre` no es una cadena
   literal: el empaquetador no la ve. Las rutas van completas en el dato.
2. **Un archivo fuera de la lista.** Si un `.js` nuevo no está en el bucle que
   inlinea scripts, el paquete sale sin él — y si ese archivo traía los datos,
   la página sale vacía.

Por eso el script ahora **avisa** de cualquier `src=`, `href=` o `url()` que
apunte a `assets/` y no se haya incrustado. Si imprime algo, el paquete está
roto. Antes de publicar conviene comprobar:

```bash
grep -c '<script src=' paquete.html    # debe dar 0
```

---

## Februllage Yucatán · `februllage.html`

Maqueta **preliminar** del Festival Internacional de Collage que organiza LA 60,
del 15 al 21 de febrero de 2027. Hecha con el mismo sistema que el resto del
sitio: mismas fuentes, mismo CSS, mismo motor de objetos flotantes. No se
inventó un diseño nuevo.

Lo único propio del festival es la portada: **formas de papel recortado**
—círculo, anillo, triángulo, media luna y un polígono— en menta, mostaza, rosa,
rojo y papel, sobre kinder. Son SVG en línea, sin fotos: el traspaso pide
explícitamente que no haya fotos de la cafetería.

### Qué lleva y de dónde sale

| Sección | Origen en el traspaso | Estado |
|---|---|---|
| Portada, fechas, sede | §1 | confirmado |
| Qué es | §11, texto literal del one-pager | confirmado |
| La semana | §2 | confirmado |
| Talleres (5) | §2 | marcado como **propuesta** en la página |
| Diez preguntas | §3 | concepto confirmado, preguntas propuestas |
| Compón con lo que el otro agregó | §4, con el recorrido y las reglas | concepto confirmado; el recorrido se presenta como «de ejemplo» |
| Artistas (19) | §8, con los códigos de origen sin expandir | lista abierta |
| Arte + Espacio · Enmarcado · Un lugar cada día | §5, §6, §7 | como tres frentes en marcha, sin prometer formato |
| Niveles de alianza | §10 | por contactar |

### Lo que falta, marcado en la propia página

Los huecos van con fondo rojo y subrayado punteado (`.pendiente`), para que se
vean al revisar y no se publiquen por descuido:

- `[galería de la calle 60]`
- `[correo]` · `[WhatsApp]` · `[Instagram del festival]`
- `[fecha límite de propuestas]`
- Origen de Madame Collage y de Cintia Constra

### Resuelto de los pendientes del traspaso

El **pendiente #1** —el enlace a la sección web de Tatifer— ya existe: es
`obra.html`, y la página del festival enlaza a él desde «Quién organiza».

### Lo que NO se construyó todavía

El traspaso (§18) pide además formularios: la **ficha de propuesta para
artistas** (§4, once campos) y la **inscripción de público con cupo**. No están:
son la siguiente entrega, y conviene montarlos sobre el motor de `reservas.js`,
que ya resuelve el patrón de «una superficie, varias intenciones».

Tampoco se tocó el presupuesto ni el cronograma: son material interno, no web.

### Dónde vive

Está dentro de `la60-web/` por economía: comparte fuentes, CSS, empaquetador y
servidor. El día que el festival tenga dominio propio, la página sale con su
bloque de CSS (sección 23) y las fuentes, sin arrastrar nada más.
