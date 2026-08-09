---
name: novapatch-content-engine
description: >
  Motor de PRODUCCIÓN de contenido de Novapatch (México). Orquesta las skills `novapatch-marketing`
  (qué decir, hooks, ángulos, claims por producto) y `novapatch-brand` (colores, tipografía, voz visual,
  validación de claims) para generar el PAQUETE COMPLETO de una pieza madre y todos sus derivados.
  Úsala SIEMPRE que el usuario pida "generar el contenido de la semana", "armar el paquete de [producto]",
  "producir los carruseles y derivados", "el contenido de la semana de Energy/Sleep/Zen/Shield/Glow/Woman",
  "generá los reels y stories a partir del carrusel", o cualquier pedido de producción de contenido social
  que implique convertir un carrusel madre en feed + stories + reel + TikTok. Esta skill cubre el PROCESO
  (cómo se produce un lote de contenido derivándolo de una pieza madre). Para el QUÉ decir consultá
  `novapatch-marketing`; para el CÓMO se ve consultá `novapatch-brand`. No reemplaza a ninguna: las invoca.
---

# Novapatch — Content Production Engine

**Versión 1.0 · Mayo 2026 · novapatch.care · Mercado: México**

Esta skill es de **proceso**, no de referencia. No contiene hooks, colores ni claims: los toma de las
otras dos skills. Su trabajo es orquestar la producción de un lote de contenido a partir de una pieza madre.

> **Las tres skills, separadas por responsabilidad:**
> - `novapatch-marketing` → **QUÉ decir** (argumentos, hooks, ángulos, claims por producto)
> - `novapatch-brand` → **CÓMO se ve y suena** (colores, tipografía, voz visual, claims permitidos/prohibidos)
> - `novapatch-content-engine` (esta) → **CÓMO se produce** (pieza madre → derivados, en un solo bloque)
>
> Esta skill **referencia**, nunca **replica**. Si necesitás un color o un claim, consultá la skill fuente.
> Replicar contenido de las otras dos crea desincronización el día que cambien.

---

## El principio central

**El carrusel es la pieza madre.** Cada carrusel producido genera, sin producción adicional significativa:

- **1 post de feed** — la portada del carrusel, adaptada a 4:5
- **4–5 stories** — los slides 2–5 del carrusel, adaptados a 9:16
- **1 reel (IG + repost FB)** — el guión del carrusel convertido en guión de reel
- **1 video de TikTok** — el reel exportado sin marca de agua, o una versión más informal del mismo guión

El guión del carrusel es el insumo de todo. Si no está escrito y validado, no hay derivados.

---

## Cadencia: default suave, siempre sobreescribible

El default es **2 carruseles madre + sus derivados** por lote semanal. Pero la cadencia es un **parámetro**,
no una ley.

**Reglas de cadencia:**

1. Si el usuario no especifica cantidad ni canales → asumí 2 carruseles + derivados completos (feed, stories,
   reel, TikTok) y **declará explícitamente qué asumiste** al inicio de la salida.
2. Si el usuario especifica (ej. "solo 1 carrusel", "sin TikTok esta semana", "3 carruseles") → respetá eso
   sin reintroducir el default.
3. Nunca impongas un número de posts totales ni una secuencia día-a-día. Esta skill produce **contenido**,
   no calendario. El cuándo/dónde publicar es decisión del usuario y vive fuera de esta skill.

**Ejemplo de declaración de supuestos (obligatoria cuando se usa el default):**
> "Asumí el default: 2 carruseles madre de [producto] + derivados completos (feed, 4 stories, reel, TikTok)
> para cada uno. Si querés otra cantidad o sacar algún canal, decímelo."

---

## Inputs que necesita la skill

Antes de generar, asegurate de tener (preguntá solo lo que falte):

| Input | Obligatorio | Default si falta |
|---|---|---|
| Producto protagonista | Sí | Preguntar — no asumir |
| Ángulo de cada carrusel | No | Elegir ángulos de **familias distintas** (ver regla de divergencia) y declararlo |
| Cantidad de carruseles | No | 2 |
| Canales de derivados | No | Feed + Stories + Reel + TikTok |
| Producto(s) secundario(s) para stories de encuesta | No | Sugerir 2 según afinidad de target |

Si falta el producto protagonista, **preguntalo** — es el único input sin default.

---

## Flujo de producción (qué hace la skill, paso a paso)

### Paso 0 — Cargar contexto de las skills fuente
Antes de generar una palabra:
- Leé la sección del producto en `novapatch-marketing` (target, deseo dominante, hooks, ángulos, claims
  permitidos/prohibidos del producto específico).
- Leé en `novapatch-brand` la voz visual del producto (sección 06), su token de color, y la lista de
  claims prohibidos.

### Paso 1 — Elegir ángulos divergentes (si hay 2+ carruseles)
Cuando generás más de un carrusel, **los ángulos deben venir de familias distintas.** El sentido de
producir varios carruseles por semana es comparar hipótesis diferentes y dejar que los datos digan cuál
convierte. Dos carruseles con el mismo ángulo (aunque cambien las palabras) no son un test — son la misma
apuesta dos veces.

**Familias de ángulo** (de `novapatch-marketing`):
- **Educativo / categoría** — enseña por qué un parche, higiene del hábito, ciencia simple
- **Objeción** — ataca una duda o resistencia concreta del target
- **Lifestyle** — el producto integrado a un momento real del día
- **Comparativo** — el formato parche vs. la alternativa (pastilla, café, nada)

Regla: con 2 carruseles, elegí 2 familias distintas. Nunca dos del mismo tipo. Declará qué familia
usaste en cada uno.

### Paso 2 — Guión del carrusel madre
Para cada carrusel, escribí el guión slide por slide siguiendo el patrón de `novapatch-marketing`
(sección "Patrones de contenido por formato"). Encabezá cada carrusel con la **familia de ángulo** elegida:
- **Portada (slide 1):** hook fuerte del banco de hooks del producto + "Deslizá →"
- **Slides 2–N:** un punto por slide, máx ~30 palabras, derivados del ángulo elegido
- **Último slide:** CTA + handle

Validá **cada slide** contra los claims prohibidos del producto antes de continuar. Ver
`references/validation.md` para el checklist de validación.

### Paso 3 — Derivar el feed
Tomá la portada (slide 1). Adaptá a caption de feed: primera línea = hook, 2–3 líneas de desarrollo,
CTA suave, hashtags al final. No reescribas el mensaje — es el mismo de la portada.

### Paso 4 — Derivar las stories
Tomá los slides 2–5. Convertí cada uno en una story: el texto ya está validado. Indicá para cada una
el sticker sugerido (encuesta, pregunta, "Deslizá", link) y recordá la zona segura de 230px.

### Paso 5 — Derivar el reel
Convertí el guión del carrusel en guión de reel con la estructura de `novapatch-marketing`:
gancho (primeros 2 seg, usar hook del producto) → problema/contexto → solución (el gesto diario) →
cierre con frase marco + "Conocé [Producto] →". Indicá subtítulos obligatorios y cortes cada 2–4 seg.

### Paso 6 — Derivar el TikTok
Dos opciones, elegí según el ángulo:
- **Repost:** el reel exportado sin marca de agua + caption corto (1–2 líneas) + 3–5 hashtags de TikTok.
- **Nativo:** versión más informal del mismo guión, tono más cercano que IG.
Recordá: nunca subir a TikTok un video con marca de agua de Instagram.

### Paso 7 — Generar prompts de imagen (solo donde aportan)
No todo slide necesita imagen generada. La marca es minimalista y muchos slides son tipográficos
(texto sobre fondo de color). Forzar una imagen donde la marca pide limpieza es contraproducente.

**Decisión por slide:**
- **Slide que gana con imagen** (portada con escena lifestyle, slide de producto en contexto, slide
  de momento de uso) → generá un **prompt de imagen** completo.
- **Slide tipográfico** (dato, reencuadre, cierre con CTA) → generá una **especificación de fondo + texto**,
  no un prompt. Ej: "Fondo petróleo #1e3a5f, headline en Outfit 800 crema, badge Sleep arriba."

**Los prompts de imagen deben respetar la voz visual del producto** (de `novapatch-brand` sección 06).
Para Sleep: luz baja, escenas nocturnas reales, ritmos lentos, sensación de pausa. Para Energy: luz
natural, frescura, vitalidad. No generes imágenes de stock genéricas — el prompt debe llevar el mood
del producto y, cuando aplique, el color de acento.

**Estructura de un prompt de imagen:** usá el **esqueleto pre-armado del producto** en
`references/image-prompts.md`. Cada producto ya tiene su mood, luz, acento y negativos resueltos —
solo completás `[SUJETO + MOMENTO]` y elegís el encuadre según el tipo de slide (portada abierta,
producto cerrado, momento medio). No inventes el mood de cero: eso garantiza consistencia entre piezas.

**El producto nunca se genera por IA.** Novapatch tiene fotos reales del parche (suelto y con packaging).
Un generador dibujaría un parche falso que no es el real. Por eso:
- **Escena lifestyle pura** (el parche no se ve o solo se sugiere) → prompt de escena normal.
- **Producto en contexto** (el parche se ve) → el prompt genera la escena **con espacio reservado** para
  insertar después el packshot real en diseño. El prompt debe pedir explícitamente "mano/superficie vacía
  donde se compondrá el producto, sin dibujar ningún parche".
- **Packshot solo** (el parche es el protagonista) → **no se genera**: se usa el asset real.

Ver `references/image-prompts.md` (sección "Producto real vs. generado") para qué asset usar y cómo
reservar el espacio. Los assets viven fuera de la skill; esta solo indica cuál componer.

### Paso 8 — Stories interactivas de la semana
Generá 1–2 stories de encuesta/pregunta que incluyan el/los producto(s) secundario(s). Son descubrimiento,
**no CTA de compra**. Ej: "¿Cuál de estos necesitás vos?" con opciones. Estas no derivan del carrusel; se
producen aparte con template fijo.

### Paso 9 — Validación final y entrega
Pasá todo el paquete por el checklist de `references/validation.md`. Entregá organizado por carrusel,
con la declaración de supuestos al inicio si se usó algún default.

---

## Formato de salida

Estructurá la entrega así (un bloque por carrusel):

```
SUPUESTOS (si se usó default): [declarar cadencia, ángulos y secundarios asumidos]

═══ CARRUSEL A — [Producto] · Familia de ángulo: [educativo/objeción/lifestyle/comparativo] ═══

GUIÓN DEL CARRUSEL
  Slide 1 (portada): [hook] + "Deslizá →"
  Slide 2: [...]
  ...
  Slide N (cierre): [CTA] + @novapatch.care

PROMPTS DE IMAGEN / ESPECIFICACIÓN VISUAL
  Slide 1: [PROMPT DE IMAGEN: escena + mood + luz + paleta + "sin texto"]
  Slide 2: [ESPEC. TIPOGRÁFICA: fondo + texto + badge]
  ...

DERIVADO · FEED
  Caption: [...]
  Hashtags: [...]

DERIVADO · STORIES (4)
  Story 1 (de slide 2): [texto] · Sticker: [...]
  ...

DERIVADO · REEL
  Guión: [hook → problema → solución → cierre]
  Notas de edición: subtítulos, cortes 2–4 seg

DERIVADO · TIKTOK
  [Repost o nativo] · Caption: [...] · Hashtags: [...]

═══ CARRUSEL B — [Producto] · Familia de ángulo: [DISTINTA de A] ═══
[ídem]

═══ STORIES INTERACTIVAS DE LA SEMANA ═══
  Encuesta: "[pregunta]" · Opciones: [secundarios]
```

No incluyas calendario día-a-día. Si el usuario lo pide, derivalo aparte y aclaralo.

---

## Reglas del motor (no negociables)

1. **Referenciar, no replicar.** Colores, hooks y claims vienen de las otras skills. No los copies acá.
2. **El guión primero.** Sin guión validado del carrusel, no hay derivados.
3. **Validar cada slide** contra los claims prohibidos del producto, no solo los generales.
4. **Default declarado.** Si asumís cadencia, decilo explícitamente y ofrecé sobreescribir.
5. **Secundarios = descubrimiento.** Los productos secundarios en stories nunca llevan CTA de compra.
6. **Un producto por carrusel.** Nunca mezclar colores ni productos en una misma pieza madre.
7. **Ángulos divergentes.** Con 2+ carruseles, cada uno de una familia distinta. Dos del mismo ángulo no son un test.
8. **Imagen solo donde aporta.** Slides tipográficos llevan especificación de fondo+texto, no prompt de imagen. Los prompts respetan la voz visual del producto.
9. **El producto nunca se genera por IA.** El parche siempre es asset real compuesto. Los prompts reservan espacio, no dibujan el parche.
10. **Sin calendario.** Esta skill genera contenido, no cadencia. El cuándo/dónde es del usuario.
11. **TikTok sin marca de agua de IG.** Exportar antes de subir a Instagram.

---

## Archivos de referencia

- `references/validation.md` — Checklist de validación de claims y marca antes de entregar cualquier pieza.
- `references/derivation-map.md` — Mapa detallado de qué toma cada derivado del carrusel madre y qué
  trabajo adicional requiere, por si necesitás el detalle exacto de la transformación.
- `references/image-prompts.md` — Plantillas de prompt de imagen por producto (mood, luz, paleta) y la
  regla para decidir cuándo un slide lleva prompt de imagen y cuándo solo especificación tipográfica.
