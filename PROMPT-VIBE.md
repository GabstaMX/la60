# Prompt de corrección para Vibe Studio

Copia desde la línea de guiones hasta el final y pégalo completo en el chat
de Vibe Studio.

Los datos salen del repositorio, archivo por archivo. La fuente de verdad es
`assets/js/datos.js`.

---

El sitio que generaste a partir de mi repositorio tiene errores graves. Te
los listo uno por uno con el dato correcto. Corrígelos todos.

**Regla que no se rompe: no inventes nada.** Ni productos, ni precios, ni
textos, ni secciones. Todo lo que debe existir está en el repositorio
`GabstaMX/la60`, y los precios y el catálogo están en `assets/js/datos.js`.
Si un dato no está ahí, no va en el sitio.

## 1 · La sección «Objetos de la casa» se queda como está

La sección **«07 — OBJETOS DE LA CASA · Lo que se hace aquí también se va
contigo»**, con la taza, el pin, la libreta y las postales, **no la toques**.
Déjala exactamente como la tienes, con sus nombres, sus descripciones y sus
precios. Esos productos se revisarán aparte.

Lo que sí aplica de aquí en adelante: **no agregues nada más.** Ni productos,
ni precios, ni secciones, ni textos que no estén en el repositorio. Todo lo
que debe existir está en `GabstaMX/la60`, y los precios y el catálogo salen
de `assets/js/datos.js`. Si un dato no está ahí, no va en el sitio.

Lo que vendo, además de esa sección, es esto y nada más: **café en bolsa**
(cuatro blends en tres tamaños, más el Atelier del mes), **obra original de
Tatifer4** (las 17 piezas del catálogo), y **el taller de collage** ($350 por
persona, $200 precio de estudiante).

## 2 · El selector de tamaño no cambia el precio

Los botones 250 g · 500 g · 1 kg se ven, pero al pulsarlos no pasa nada: el
precio se queda en $150 y la fotografía no cambia.

Los precios correctos, iguales para los cuatro blends:

| Tamaño | Precio |
|---|---|
| 250 g | $150 |
| 500 g | $280 |
| 1 kg | $560 |

Hoy en el sitio **no aparecen ni $280 ni $560 por ningún lado.**

Al cambiar de tamaño tienen que cambiar dos cosas: el precio y la fotografía
de la bolsa. Hay una foto por blend y por tamaño, doce en total, en
`assets/img/bolsas/` con el nombre `{blend}-{250|500|1k}.webp`.

El Atelier del mes es la excepción: solo existe en 250 g y cuesta $190.

## 3 · El botón «Pedir» no lleva a ningún lado

Los cuatro botones «PEDIR» son enlaces vacíos, `href="#"`. En todo el sitio
no hay una sola mención al WhatsApp ni al teléfono.

Cada botón debe abrir WhatsApp con el pedido ya escrito:

```
https://wa.me/529996226722?text=Hola%20LA%2060,%20quiero%20pedir%20{BLEND}%20de%20{TAMAÑO}.
```

Sustituyendo el nombre del blend y el tamaño seleccionado. Ese es el número
del 393: **529996226722**.

## 4 · El titular principal no usa mi tipografía

Cargas bien mis tipografías desde el repositorio —LORE, Warung Kopi, Caveat
y Limoncello— y los `h2` y los párrafos las usan correctamente. Pero el `h1`
de la portada está en **Fraunces**, de Google Fonts, que tú añadiste.

Quita Fraunces y Manrope por completo. No cargues ninguna tipografía de
Google. Las cuatro mías están en `assets/fonts/` y bastan:

- **LORE** — titulares
- **Warung Kopi** — texto corrido
- **Caveat** — notas manuscritas
- **Limoncello** — acentos

## 5 · El catálogo de obra está casi vacío

`/obra` muestra 4 imágenes, sin nombres de serie y sin un solo precio. Debe
mostrar **las 17 piezas**, agrupadas en **cuatro series con su encabezado**, y
cada pieza con su precio.

Las imágenes están todas en el repositorio. Este es el mapa exacto: archivo,
serie y precio.

**Eclipses**

| Archivo | Precio |
|---|---|
| `assets/img/obra/nueva-04.jpg` | $6,000 |
| `assets/img/obra/nueva-05.jpg` | $6,000 |
| `assets/img/obra/nueva-03.jpg` | $6,000 |

**Anatomías**

| Archivo | Precio |
|---|---|
| `assets/img/obra/nueva-01.jpg` | $6,000 |
| `assets/img/obra/nueva-00.jpg` | $6,000 |
| `assets/img/obra/nueva-06.jpg` | $6,000 |

**Abstracto**

| Archivo | Precio |
|---|---|
| `assets/img/obra/obra-00.jpg` | $950 |
| `assets/img/obra/obra-02.jpg` | $500 |
| `assets/img/obra/obra-03.jpg` | $450 |
| `assets/img/obra/obra-04.jpg` | $400 |
| `assets/img/obra/obra-07.jpg` | $300 |

**Capas**

| Archivo | Precio |
|---|---|
| `assets/img/obra/nueva-02.jpg` | $6,000 |
| `assets/img/obra/obra-01.jpg` | $800 |
| `assets/img/obra/obra-05.jpg` | $350 |
| `assets/img/obra/obra-06.jpg` | $350 |
| `assets/img/obra/obra-08.jpg` | $250 |
| `assets/img/obra/obra-09.jpg` | $200 |

No cambies esa correspondencia: cada archivo lleva su precio, no otro. Cada
pieza es única: una sola unidad, y cuando se vende no vuelve.

## 5b · Faltan 58 imágenes que ya están en el repositorio

El repositorio tiene 94 imágenes y el sitio usa 36. No falta ningún archivo
y ninguna está rota: simplemente no las estás pidiendo. Faltan estas.

**Las 13 piezas de obra** del punto anterior.

**Las 8 fotografías de bolsa de 500 g y 1 kg.** Hay una por blend y tamaño:

```
assets/img/bolsas/{atelier,colcoll,darkneo,sereno}-{500,1k}.webp
```

Las necesitas para el punto 2: al cambiar de tamaño cambia el precio **y la
fotografía**.

**Las cuatro etiquetas frontales de los blends.** La ficha técnica de cada
blend **abre con la fotografía de su etiqueta frontal**, entera y sin
recortar. Es la etiqueta real, tal como salió de imprenta.

| Blend | Archivo |
|---|---|
| Atelier | `assets/img/etiquetas/atelier.jpg` |
| Col-Coll | `assets/img/etiquetas/col-coll.jpg` |
| Darkneo | `assets/img/etiquetas/darkneo.jpg` |
| Sereno | `assets/img/etiquetas/sereno.jpg` |

Las cuatro están en el repositorio y se descargan sin problema; comprobado
uno por uno. No las estás pidiendo, nada más.

`assets/img/etiquetas/trasera.jpg` es la **trasera** y va en otro sitio: en
el Atelier del mes. Hoy es la única que usas.

**Las cuatro imágenes de previsualización al compartir:**

```
assets/img/og-index.jpg · og-obra.jpg · og-reservas.jpg · og-februllage.jpg
```

Van en la etiqueta `og:image` de cada página. Hoy la portada usa
`espacio-barra.jpg`, que es una foto del local de lado y no se entiende como
miniatura. Estas cuatro están hechas a 1200 × 630, que es la medida correcta.

**Y hay 28 recortes de collage sin usar** en `assets/img/recortes/`. Usas 16
de 44. Los otros están disponibles si quieres más objetos flotando; eso es
decisión de composición, no un error.

## 6 · Februllage no está en el menú

La página `/februllage` existe, pero no se llega a ella desde ningún lado.
Agrégala a la navegación.

## 7 · Esto lo hiciste bien, no lo toques

- Cargar mis tipografías y mis fotografías desde el repositorio
- Respetar los textos casi literales
- Las cuatro páginas
- El comportamiento de las secciones que se quedan fijas al hacer scroll
- La composición de la portada con los objetos flotantes
- La sección «Objetos de la casa», con sus cuatro productos

## 8 · Reglas de la marca

- El café es **de Chiapas, México** — Soconusco, faldas del volcán Tacaná.
  Nunca de Colombia ni de ningún otro origen.
- El logotipo no se rediseña, no se recorta, no se recolorea y no se adapta.
  La tachadura sobre «Café Atelier» es parte del logotipo.
- La artista es **Tatifer4**, artista residente.
- Español de México, tono sobrio. Sin signos de admiración, sin mayúsculas de
  grito, sin frases de catálogo. Menos es más.

## 9 · Cómo quiero que verifiques antes de decirme que está listo

1. Confirma que la sección «Objetos de la casa» sigue intacta, con sus
   cuatro productos y sus precios.
2. Pulsa 500 g y confirma que los cuatro precios cambian a $280 y que las
   cuatro fotografías cambian.
3. Pulsa 1 kg y confirma $560.
4. Pulsa un botón «Pedir» y confirma que abre WhatsApp con el texto escrito.
5. Confirma que `fonts.googleapis.com` no se carga en ninguna página.
6. Cuenta las piezas de `/obra`: tienen que ser **17**, repartidas en cuatro
   series con encabezado, y cada una con su precio.
7. Cuenta las imágenes que carga el sitio entero: hoy son 36 de las 94 del
   repositorio. Tras los arreglos deben ser al menos **85**.
8. Confirma que la portada comparte `og-index.jpg` y no una foto del local.
