# Prompts de imagen — esqueletos por producto

El control de consistencia no viene de prompts largos, viene de una **estructura fija** donde solo cambian
pocas variables. El texto se superpone en diseño después: estos prompts generan **solo la imagen de fondo**.

Prompts **agnósticos de herramienta**: lenguaje fotográfico natural, sin parámetros propietarios
(`--ar`, `::`, campos de "negative prompt" separados). Los negativos van como frase dentro del prompt.

---

## Regla: ¿este slide lleva prompt de imagen?

| Tipo de slide | ¿Se genera con IA? | Qué hacer |
|---|---|---|
| Portada con escena lifestyle (parche no se ve) | Sí | Esqueleto, encuadre **abierto** |
| Momento de uso (parche no se ve) | Sí | Esqueleto, encuadre **medio** |
| Producto en contexto (parche se ve) | Parcial | Esqueleto con **espacio reservado** + componer packshot real encima |
| Packshot (el parche es protagonista) | **No** | Usar el **asset real** del producto, no generar |
| Dato / estadística / reencuadre | No | Especificación tipográfica (fondo + texto) |
| Cierre con CTA | No | Especificación tipográfica |

Forzar imagen en un slide tipográfico rompe el minimalismo de la marca. Ante la duda, tipográfico.
**El parche real nunca se genera por IA** — ver sección "Producto real vs. generado" más abajo.

---

## El esqueleto (estructura fija — semi-flexible en el encuadre)

Todo prompt Novapatch se arma con estas partes **en este orden**. Lo que cambia entre piezas son solo
`[SUJETO]` y `[MOMENTO]`; lo demás es fijo por producto.

```
[SUJETO + MOMENTO] ,
[MOOD del producto] , [LUZ del producto] ,
[ENCUADRE según tipo de slide] , sujeto descentrado siguiendo regla de tercios ,
[ESPACIO NEGATIVO en zona fija] ,
fotografía realista , profundidad de campo media , tonos de marca con [ACENTO] como detalle , no como fondo ,
sin texto , sin palabras , sin logotipos , sin rostros plenamente reconocibles , [NEGATIVOS del producto] ,
[FORMATO según destino]
```

### La parte semi-flexible: encuadre por tipo de slide
- **Portada lifestyle** → "plano general, ambiente amplio, espacio negativo en el tercio superior"
- **Momento de uso** → "plano medio, sujeto a un lado, espacio negativo lateral"
- **Producto en contexto** → "plano cerrado / primer plano, detalle del gesto, espacio negativo en el tercio superior"

El resto del esqueleto no cambia nunca.

### El formato según el destino de la pieza
`[FORMATO según destino]` se completa según dónde vive la imagen. El formato de la imagen generada
**debe coincidir con el formato del slide o pieza** donde se va a usar:

| Destino de la imagen | Formato a usar |
|---|---|
| Slide de carrusel (IG) | **vertical 4:5 (1080×1350)** |
| Post de feed (IG) | vertical 4:5 (1080×1350) o cuadrado 1:1 (1080×1080) |
| Story (IG / FB) | **vertical 9:16 (1080×1920)** |
| Reel / TikTok (frame o fondo) | vertical 9:16 (1080×1920) |

Como el sistema deriva del carrusel (4:5) y luego adapta a stories/reel (9:16), generá la imagen en el
formato del slide donde nace. Si la misma imagen se reusa en un formato distinto, regenerala o recortala
respetando el espacio negativo.

---

## Esqueletos pre-armados por producto

Cada uno trae mood, luz, acento y negativos ya resueltos. **Solo completás `[SUJETO + MOMENTO]`.**

### Energy
```
[SUJETO + MOMENTO] ,
mood fresco y de vitalidad con sensación de claridad , luz natural de mañana, brillante y limpia ,
[ENCUADRE] , sujeto descentrado siguiendo regla de tercios , [ESPACIO NEGATIVO] ,
fotografía realista , profundidad de campo media , tonos neutros con azul claro (#83b5f4) como detalle, no como fondo ,
sin texto , sin palabras , sin logotipos , sin rostros plenamente reconocibles ,
sin estética de pre-workout ni gimnasio hardcore , sin bebidas energéticas ,
[FORMATO según destino]
```

### Sleep
```
[SUJETO + MOMENTO] ,
mood de calma y pausa, atmósfera nocturna serena , luz baja y cálida, tenue ,
[ENCUADRE] , sujeto descentrado siguiendo regla de tercios , [ESPACIO NEGATIVO] ,
fotografía realista , profundidad de campo media , tonos apagados con turquesa (#1eb1bc) como detalle, no como fondo ,
sin texto , sin palabras , sin logotipos , sin rostros plenamente reconocibles ,
sin pastillas ni blísters, sin estética farmacéutica , sin relojes que sugieran insomnio ,
[FORMATO según destino]
```

### Zen
```
[SUJETO + MOMENTO] ,
mood de estabilidad y orden, sensación de aire y espacio , luz natural difusa, suave ,
[ENCUADRE] , sujeto descentrado siguiendo regla de tercios , [ESPACIO NEGATIVO] ,
fotografía realista , profundidad de campo media , tonos neutros con azul medio (#4e82bc) como detalle, no como fondo ,
sin texto , sin palabras , sin logotipos , sin rostros plenamente reconocibles ,
sin iconografía de meditación cliché (loto, incienso), sin estética terapéutica o clínica ,
[FORMATO según destino]
```

### Shield
```
[SUJETO + MOMENTO] ,
mood de cuidado cotidiano y confianza, constancia tranquila , luz cálida y neutra ,
[ENCUADRE] , sujeto descentrado siguiendo regla de tercios , [ESPACIO NEGATIVO] ,
fotografía realista , profundidad de campo media , tonos neutros con naranja (#ffa849) como detalle, no como fondo ,
sin texto , sin palabras , sin logotipos , sin rostros plenamente reconocibles ,
sin iconografía médica, sin termómetros, sin cápsulas, sin cubrebocas, sin señales de enfermedad ni alarma ,
[FORMATO según destino]
```
ADVERTENCIA: Shield es el de mayor riesgo regulatorio. La imagen no debe sugerir enfermedad, contagio ni inmunidad.

### Glow
```
[SUJETO + MOMENTO] ,
mood de vitalidad con luz desde adentro, naturalidad adulta , luz natural suave y ligeramente dorada ,
[ENCUADRE] , sujeto descentrado siguiendo regla de tercios , [ESPACIO NEGATIVO] ,
fotografía realista , profundidad de campo media , tonos cálidos con coral (#f25c54) como detalle, no como fondo ,
sin texto , sin palabras , sin logotipos , sin rostros plenamente reconocibles ,
sin comparaciones antes/después, sin primeros planos clínicos de piel, sin estética cosmética de laboratorio ,
[FORMATO según destino]
```

### Woman
```
[SUJETO + MOMENTO] ,
mood de equilibrio, suavidad y conexión , luz cálida y natural ,
[ENCUADRE] , sujeto descentrado siguiendo regla de tercios , [ESPACIO NEGATIVO] ,
fotografía realista , profundidad de campo media , tonos cálidos con lila (#c693c4) como detalle, no como fondo ,
sin texto , sin palabras , sin logotipos , sin rostros plenamente reconocibles ,
sin rosa-cliché, sin estética de revista femenina, sin iconografía hormonal o médica ,
[FORMATO según destino]
```

---

## Ejemplos completos (esqueleto + variables llenadas)

**Sleep · portada lifestyle:**
> "Una persona bajando el ritmo en su habitación de noche, guardando el teléfono antes de dormir,
> mood de calma y pausa, atmósfera nocturna serena, luz baja y cálida tenue, plano general, ambiente
> amplio, sujeto descentrado siguiendo regla de tercios, espacio negativo en el tercio superior,
> fotografía realista, profundidad de campo media, tonos apagados con turquesa como detalle no como
> fondo, sin texto, sin palabras, sin logotipos, sin rostros plenamente reconocibles, sin pastillas ni
> blísters, sin estética farmacéutica, formato vertical 4:5 (1080×1350)."

**Energy · producto en contexto:**
> "Manos colocando un parche en el brazo al empezar la jornada laboral, mood fresco y de vitalidad con
> sensación de claridad, luz natural de mañana brillante y limpia, plano cerrado, detalle del gesto,
> sujeto descentrado siguiendo regla de tercios, espacio negativo en el tercio superior, fotografía
> realista, profundidad de campo media, tonos neutros con azul claro como detalle no como fondo, sin
> texto, sin palabras, sin logotipos, sin rostros plenamente reconocibles, sin estética de pre-workout
> ni gimnasio hardcore, sin bebidas energéticas, formato vertical 4:5 (1080×1350)."

---

## Producto real vs. generado

**Regla absoluta: el parche Novapatch nunca se genera por IA.** Existen fotos reales (parche suelto y
parche con packaging). Un generador dibujaría un producto falso — forma, color y packaging incorrectos.
Eso es inaceptable: estarías mostrando un producto que no existe.

Los assets reales **viven fuera de esta skill** (repo / Drive de marca). La skill solo indica cuál usar y
cómo reservar espacio; no los empaqueta. Si actualizás el packaging, actualizás el asset en su fuente sin
tocar la skill.

### Qué asset usar según el slide

| Slide | Asset real a componer |
|---|---|
| Producto en contexto de uso (en piel, en la mano) | Packshot del **parche suelto** |
| Comercial / oferta / suscripción | Packshot del **parche con packaging** |
| Unboxing / "qué llega a tu casa" | Packshot **con packaging** |
| Packshot puro sobre fondo de marca | Asset real, sin escena generada |

### Cómo reservar espacio en el prompt de escena

Cuando el parche se ve pero la escena se genera, el prompt debe pedir **explícitamente que NO se dibuje el
producto** y que quede una superficie limpia donde se compone el packshot real en diseño:

> "...una mano con el antebrazo despejado y limpio, superficie de piel vacía sin ningún parche ni objeto,
> espacio claro para componer el producto en post-producción, [resto del esqueleto del producto]..."

Negativo obligatorio en estos casos: **"sin dibujar ningún parche, sticker ni adhesivo en la piel"**.

Luego, en diseño, se superpone el packshot real del producto sobre ese espacio.

Estos prompts funcionan en lenguaje natural en cualquier generador. Ajustes opcionales:
- Si tu herramienta usa relación de aspecto por parámetro, traducí "[FORMATO según destino]" a su sintaxis.
- Si tiene campo de "negativos" separado, podés mover ahí la lista de "sin..." — pero dejarla en el prompt
  también funciona.
- Para generadores de video (Kling, Veo), agregá una frase de movimiento al final ("cámara fija, movimiento
  mínimo del sujeto") — pero el esqueleto base se mantiene.
