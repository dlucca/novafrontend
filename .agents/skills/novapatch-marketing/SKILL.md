---
name: novapatch-marketing
description: >
  Playbook de marketing de Novapatch (México) para GENERAR contenido: argumentos de venta, ángulos
  educativos, ideas y hooks de contenido, captions, guiones de reel/story, copy de anuncios, emails de
  campaña y respuestas a objeciones. Úsala SIEMPRE que el usuario pida crear o idear contenido de
  marketing, captar demanda, explicar por qué un parche, vender un producto (Energy, Sleep, Zen, Shield,
  Glow, Woman), responder objeciones de clientes, armar un calendario de contenido, o pida "ideas para
  postear", "un hook para", "un guion para", "cómo vendo X". Para la identidad visual, tokens de color,
  tipografía y validación de claims usa la skill `novapatch-brand` en conjunto con esta.
---

# Novapatch — Marketing Playbook (México)

**Versión 1.0 · Mayo 2026 · novapatch.care · Mercado: México**

Este playbook es material accionable para que Claude genere contenido de marketing de Novapatch directamente.
No describe el marketing — provee los argumentos, ángulos y hooks listos para convertir en copy.

> **Relación con la marca:** Esta skill cubre el QUÉ decir y A QUIÉN. Para CÓMO se ve y suena
> (colores, tipografía, voz visual, claims permitidos/prohibidos), usa siempre la skill `novapatch-brand`.
> Todo claim que generes debe pasar el filtro de claims de esa skill: **acompañamos, no transformamos.**

---

## Cómo usar este playbook al generar contenido

1. **Identifica el objetivo**: ¿educar la categoría (por qué un parche) o vender un producto concreto?
2. **Si es categoría** → usa el [núcleo compartido](#nucleo): la regla de los 500 Daltons, adherencia, objeciones universales.
3. **Si es producto** → ve a la [sección del producto](#productos): target, deseo/objeción dominante, argumentos, ángulos educativos y hooks.
4. **Elige el formato** y usa los [patrones de contenido](#formatos) para estructurarlo.
5. **Valida claims** contra `novapatch-brand` antes de entregar.
6. **Default de embudo**: la mayoría de la gente no sabe que existe la categoría → prioriza educación antes que promoción dura.

---

## Núcleo compartido — aplica a los seis productos {#nucleo}

El mayor trabajo de marketing de Novapatch no es "por qué nosotros" sino **"por qué un parche"**. La categoría
es nueva para casi todo el público mexicano. Educar la categoría es el ángulo más potente y casi siempre
debe venir antes del pitch de producto.

### Argumento de categoría — la regla de los 500 Daltons

El hecho técnico que ordena todo el discurso educativo:

- La piel filtra por tamaño molecular. Moléculas **< 500 Daltons** y bien formuladas atraviesan; las grandes no.
- Por eso las fórmulas de Novapatch se diseñan desde cero para uso transdérmico — **no son pastillas pegadas a un sticker.**
- La piel es un órgano activo, no una pared.

**Por qué vende:** convierte "¿esto funciona o es un gadget?" en una conversación de criterio. Posiciona a
Novapatch como la marca que sabe de formulación, no como moda.

**Ideas de contenido listas:** "500 Daltons: el dato que casi nadie te explica" · "Por qué no todo suplemento funciona en un parche" · "El error más común al hablar de parches".

### Argumento de autoridad — la piel absorbe, no solo protege

- La piel es un órgano activo irrigado por capilares; deja pasar ciertas moléculas bien formuladas.
- La absorción transdérmica **no es una moda**: se usa hace décadas en medicina. Novapatch aplica ese conocimiento al bienestar diario.

**Ideas de contenido listas:** "La piel también absorbe, no solo protege" · "No todo tiene que pasar por el estómago" · "Por qué cada vez más personas eligen parches y no cápsulas".

### Argumento de adherencia — lo simple se sostiene

- El suplemento que funciona es el que tomás todos los días. La mayoría abandona las cápsulas en semanas.
- Un gesto al día, sin agua, sin horario, sin acordarte a mitad de la comida → **adherencia real.**
- "La adherencia vale más que la potencia. Lo simple se repite, lo complejo se abandona."

**Por qué vende:** ataca la culpa del frasco de vitaminas a medio terminar en el cajón. Todos lo vivieron.

**Ideas de contenido listas:** "El mejor suplemento es el que realmente usás" · "Por qué casi nadie es constante con los suplementos" · "El problema no sos vos, es el formato" · "Un hábito, no un tratamiento".

### Argumento de fricción cero — se integra a tu día

- No reorganiza tu vida. Se pega y seguís con lo tuyo: ducha, gym, trabajo (resistente al agua).
- Discreto, portable, limpio, minimalista. Sin sabor, sin malestar gástrico, sin pasar por la digestión.
- El problema del formato pastilla: olvido, náuseas, varias cápsulas al día, dependencia de horarios y comidas.

**Ideas de contenido listas:** morning/night routine con el parche · viajes · gimnasio · oficina · "Wellness que no interrumpe tu día".

### Argumento de suscripción

- Llega solo, cuando lo necesitás. Pausás cuando querés, cancelás cuando querés, envío incluido.
- El plan **bimestral** es el recomendado (mejor ahorro, ~15%).
- Encuadre: no es "comprometerte", es "no tener que volver a pensarlo".

### Objeciones universales y cómo responderlas

| Objeción del cliente | Respuesta (ángulo, no claim médico) |
|---|---|
| "¿De verdad funciona o es marketing?" | Regla de los 500 Daltons + formulación transdérmica desde cero. Criterio, no promesa. |
| "¿No es lo mismo que una pastilla?" | No: la pastilla pasa por digestión; el parche es absorción transdérmica continua. Distinto formato, distinto diseño. |
| "¿Se cae en la ducha / haciendo ejercicio?" | Resistente al agua. Ducha, gym, vida normal. |
| "¿Tiene azúcar / es apto para mí?" | 100% vegano, sin azúcar, libre de gluten, sin látex (adhesivo hipoalergénico). |
| "Ya tomo suplementos." | No es uno más: es el formato que sí vas a sostener. Adherencia > stock de frascos. |
| "Es caro." | Encuadre por valor y constancia, nunca precio primero. Costo por día de un hábito que sí mantenés. |

### Atributos canónicos citables (todos los productos)
100% vegano · Sin azúcar · Libre de gluten · Resistente al agua · Sin látex · Alta absorción transdérmica.
Son hechos comunes a los seis parches — se pueden afirmar siempre.

---

## Secciones por producto {#productos}

Cada producto vende a un target distinto por un motivo distinto. Usa el deseo/objeción dominante para elegir
el ángulo. Mood, tono y voz visual detallados están en la skill `novapatch-brand` (sección 06).

> **Claims por producto = ley.** Cada producto tiene su propia lista de claims prohibidos, más estrictos que
> los generales. Antes de entregar cualquier copy, verificá contra la lista del producto específico. Estos
> límites son regulatorios, no estilísticos.

### Energy {#energy}
- **Qué es:** soporte diario para energía real (trabajar, entrenar, sostener rutinas). No es pre-workout, ni golpe de cafeína, ni bebida energética disfrazada.
- **Target primario:** 25–45. Rutinas intensas, muchas horas, se mueven físicamente. Profesionales, emprendedores, creativos. **Fatiga mental más que física.**
- **Target secundario:** quieren reducir café, sienten que el café ya no les funciona, sensibilidad gástrica, buscan energía sin alterar el sueño.
- **NO es target / NO comunicar:** quien busca un "shock" inmediato, estimulantes extremos, "me cambia el día en 10 minutos", fitness hardcore.
- **Deseo dominante:** rendir bien sin estrellarse. Energía progresiva, no explosiva.
- **Frase marco:** "No te acelera. Te acompaña."
- **Idea fuerza:** No cambia tu vida. Te ayuda a sostenerla.
- **Momentos de uso:** inicio del día laboral · media mañana · antes de jornada larga · días de poco descanso · viajes · entrenamiento suave/moderado.
- **Argumentos de venta:** claridad sostenida sin pico y caída · alternativa al cuarto café sin nervios ni acidez · no interfiere con el sueño como la cafeína de la tarde.
- **Ángulos educativos:** tipos de energía · cansancio mental vs. físico · por qué el café deja de funcionar igual · ritual complejo vs. hábito simple.
- **Hooks listos:**
  - "Tu cuarto café no es energía. Es deuda."
  - "Rendir todo el día no debería costarte la noche."
  - "El bajón de las 4pm no es normal. Es tu café cobrándote."
- **Claims PERMITIDOS:** acompaña la energía diaria · energía sostenida · ayuda a mantener el foco · energía sin picos bruscos · ideal para días largos · alternativa simple al café · energía que acompaña tu rutina.
- **Claims PROHIBIDOS:** estimula como un energético · reemplaza el descanso · efecto inmediato · energía instantánea · más fuerte que el café · elimina la fatiga · cura fatiga crónica.

### Sleep {#sleep}
- **Qué es:** acompañamiento del descanso nocturno desde el bienestar, no desde el tratamiento. No es somnífero.
- **Target primario:** 25–55. Estrés diario, les cuesta desconectar de noche, quieren descansar mejor sin medicación. Profesionales, emprendedores, padres y madres.
- **Target secundario:** duermen pero se despiertan cansados · evitan pastillas para dormir · viajan seguido · quieren mejorar su rutina nocturna.
- **NO es target / NO comunicar:** quien busca un somnífero fuerte, problemas de sueño severos o clínicos, resultados inmediatos, soluciones extremas.
- **Deseo dominante:** bajar el ritmo y despertar sin resaca de pastilla.
- **Frase marco:** "Dormir mejor empieza bajando el ritmo."
- **Idea fuerza:** El descanso empieza con un gesto. (Dormir mejor no es apagarse. Es bajar el ritmo.)
- **Momentos de uso:** antes de acostarse · después de la ducha · rutina nocturna sin pantallas · viajes · días de estrés mental.
- **Argumentos de venta:** acompaña el ritual de bajada de ritmo, no te noquea · sin la pesadez ni la dependencia que temés de las pastillas · para los que duermen pero se despiertan cansados.
- **Ángulos educativos:** dormir mejor empieza antes de acostarte · higiene del sueño · lo que hacés a las 9pm decide cómo dormís.
- **Hooks listos:**
  - "No es que no puedas dormir. Es que no podés frenar."
  - "Dormís 8 horas y despertás cansado. El problema no es la cantidad."
  - "Lo que hacés a las 9 de la noche decide cómo amanecés."
- **Claims PERMITIDOS:** acompaña el descanso nocturno · ayuda a bajar el ritmo · pensado para la rutina de noche · apoyo al descanso · dormir mejor como hábito.
- **Claims PROHIBIDOS:** induce el sueño · somnífero natural · dormís en minutos · garantiza sueño profundo · trata insomnio · reemplaza medicación para dormir.

### Zen {#zen}
- **Qué es:** bienestar mental cotidiano, calma funcional. Se posiciona en el bienestar diario, no en la clínica.
- **Target primario:** 25–50. Alta carga mental, trabajan bajo presión, buscan equilibrio sin perder foco. Profesionales, emprendedores, creativos.
- **Target secundario:** mindfulness o yoga casual · reducir estrés cotidiano · no quieren soluciones fuertes · valoran el bienestar emocional.
- **NO es target / NO comunicar:** tratamiento de ansiedad clínica, soluciones sedantes, "desaparecer el estrés", comunicación terapéutica o médica.
- **Deseo dominante:** bajar un cambio **sin dejar de funcionar.**
- **Frase marco:** "Calma para seguir, no para frenar."
- **Idea fuerza:** Bajar un cambio sin salir del juego. (Calma que te deja presente.)
- **Momentos de uso:** jornadas laborales intensas · antes de reuniones importantes · días de mucha demanda mental · viajes · tardes largas.
- **Argumentos de venta:** calma funcional, estás mejor mientras seguís haciendo · no te apaga ni te da sueño, te ordena · para quien no tiene tiempo de "desconectar" pero necesita estabilidad.
- **Ángulos educativos:** la diferencia entre calmarte y frenar · estrés sostenido vs. agudo · no necesitás retirarte a una montaña.
- **Hooks listos:**
  - "No necesitás meditar una hora. Necesitás dejar de vibrar."
  - "Calma no es frenar. Es seguir sin que te tiemble el pulso."
- **Claims PERMITIDOS:** acompaña estados de calma · ayuda a equilibrar el ritmo diario · bienestar mental cotidiano · calma funcional · pensado para días intensos.
- **Claims PROHIBIDOS:** trata ansiedad · reduce ataques de pánico · efecto ansiolítico · sedante natural · elimina el estrés · reemplaza terapia o medicación.

### Shield {#shield}
- **Qué es:** apoyo al cuidado diario desde la prevención consciente, no desde el miedo. Perfil más adulto que el resto.
- **Target primario:** 30–55. Se preocupan por su bienestar, rutinas exigentes, buscan prevención no emergencia. Padres y madres, profesionales, personas activas, viajeros.
- **Target secundario:** toman suplementos estacionalmente · refuerzan hábitos en ciertas épocas · no quieren sumar cápsulas · buscan alternativas fáciles de sostener.
- **NO es target / NO comunicar:** quien busca garantías absolutas, comunicación alarmista, discursos médicos/clínicos, "inmunidad total".
- **Deseo dominante:** cuidarse **antes**, no reaccionar tarde.
- **Frase marco:** "Cuidarse antes es cuidarse mejor."
- **Idea fuerza:** El cuidado diario no debería depender de una alarma. (Cuidarse todos los días es más efectivo que reaccionar tarde.)
- **Momentos de uso:** inicio del día · épocas de mayor exigencia · cambios de estación · viajes · rutinas con poco descanso.
- **Argumentos de venta:** el cuidado que importa se hace antes, como hábito constante · para vida exigente (viajes, hijos, cambios de clima) · constancia sin un frasco más que recordar.
- **Ángulos educativos:** el cuidado preventivo es un hábito, no una reacción · constancia diaria > refuerzo de último momento.
- **Hooks listos:**
  - "El mejor momento para cuidarte fue antes. El segundo mejor es hoy."
  - "Cuidarse no es lo que hacés cuando ya te sentís mal."
- **Claims PERMITIDOS:** acompaña el cuidado diario · apoyo al bienestar general · pensado para la prevención cotidiana · ideal para rutinas exigentes · cuidado consciente.
- **Claims PROHIBIDOS:** refuerza el sistema inmune · previene enfermedades · evita resfríos o gripes · protección total · inmunidad garantizada · uso cuando estás enfermo.
- ⚠️ **El producto de mayor riesgo regulatorio.** Nunca lo posiciones como reacción a estar enfermo ni cerca de "inmunidad". Solo hábito y prevención consciente, sin miedo.

### Glow {#glow}
- **Qué es:** soporte diario que trabaja desde el interior para el cuidado de la piel. No es cosmético ni solución estética inmediata. Glow es un proceso, no un efecto.
- **Target primario:** 25–45, principalmente mujeres. Skincare integral, entienden que la piel refleja hábitos y constancia, poco tiempo para rutinas complejas.
- **Target secundario:** ya usan suplementos para piel/pelo/uñas y buscan el formato más simple.
- **NO es target / NO comunicar:** quien espera resultados estéticos inmediatos, claims cosméticos, lenguaje anti-edad.
- **Deseo dominante:** verse bien desde adentro sin sumar pasos a la rutina.
- **Frase marco:** "Glow no se fuerza. Se acompaña."
- **Idea fuerza:** Cuidarse no debería ser complicado. (Glow es un proceso, no un efecto.)
- **Momentos de uso:** rutina de la mañana · después de la ducha · inicio del día laboral · viajes · días de estrés o poco descanso.
- **Argumentos de venta:** skincare desde adentro, complemento al cuidado tópico · un gesto, no una rutina de 20 minutos · para quien ya usa suplementos de piel y quiere lo más simple.
- **Ángulos educativos:** glow es proceso, no efecto inmediato · belleza desde adentro vs. desde afuera, por qué se complementan.
- **Hooks listos:**
  - "Glow no se fuerza. Se sostiene."
  - "Tu rutina de skincare termina donde empieza tu piel. ¿Y lo de adentro?"
- **Claims PERMITIDOS:** acompaña el bienestar que se refleja en la piel · pensado para la constancia · bienestar desde adentro · apoyo al cuidado diario · parte de una rutina integral · glow como proceso.
- **Claims PROHIBIDOS:** mejora la piel en X días · resultados visibles inmediatos · efecto cosmético · anti-age · rejuvenece · elimina arrugas.

### Woman {#woman}
- **Qué es:** acompañamiento del bienestar femenino sin medicalizar, respetando los ritmos del cuerpo.
- **Target primario:** 25–50, mujeres. Profesionales, madres, emprendedoras, conectadas con el autocuidado consciente.
- **Target secundario:** ya consumen suplementos de bienestar femenino y buscan algo más fácil de sostener.
- **NO es target / NO comunicar:** quien espera solución hormonal o alivio de síntomas específicos, lenguaje medicalizado, estereotipos "femeninos".
- **Deseo dominante:** bienestar que respete sus ritmos, sin promesas vacías ni clichés.
- **Frase marco:** "Respetar los propios ritmos."
- **Idea fuerza:** El bienestar también acompaña los días distintos. (El bienestar femenino no es lineal. Es cíclico.)
- **Momentos de uso:** rutina diaria · días de mayor exigencia · momentos de cambio físico o emocional · viajes · jornadas largas.
- **Argumentos de venta:** el bienestar femenino es cíclico, no lineal · sin clichés ni lenguaje condescendiente · el formato más fácil de sostener.
- **Ángulos educativos:** el bienestar cíclico, por qué el cuerpo no funciona en línea recta · autocuidado consciente vs. de revista.
- **Hooks listos:**
  - "Tu cuerpo no es lineal. Tu bienestar tampoco debería serlo."
  - "Cuidarte es respetarte. Sin etiquetas."
- **Claims PERMITIDOS:** acompaña el bienestar femenino · respeta los ritmos del cuerpo · apoyo al equilibrio diario · pensado para el día a día · bienestar sin medicalizar.
- **Claims PROHIBIDOS:** regula hormonas · alivia síntomas específicos · trata dolor menstrual · equilibra ciclos · reemplaza tratamientos ginecológicos · solución hormonal.
- **Nota de tono:** empático y respetuoso, nunca estereotipado. Evitar rosa-cliché y "para la mujer moderna".

---

## Patrones de contenido por formato {#formatos}

Para dimensiones, zonas seguras y estructura visual, ver `novapatch-brand` (sección 05). Aquí va el QUÉ del contenido.

### Post educativo (categoría)
Estructura: **hook que rompe un supuesto → dato (500 Daltons / adherencia) → reencuadre → CTA suave.**
Un solo producto o institucional. Sin pitch duro. El objetivo es enseñar, no cerrar.

### Post de producto (feed)
Estructura: **deseo/objeción del target → frase marco → 1 beneficio concreto → atributo de respaldo → CTA.**
Máx. 8 palabras en el headline. Un solo producto por pieza.

### Carrusel "¿Qué parche es para vos?"
Portada con hook → un slide por producto (badge + deseo dominante en una línea) → slide final con CTA.
Ideal para top-of-funnel: educa la línea completa sin vender uno solo.

### Reel / Story (guion corto)
Gancho en los primeros 2 segundos (usar un hook de la sección del producto) → reencuadre o mini-demo del
gesto diario → cierre con frase marco + "Conocé [Producto] →". Mantener un solo mensaje.

### Caption de Instagram
Primera línea = hook (corta, sin emoji al inicio). 2–3 líneas de desarrollo. Beneficios en bullets si aplica.
CTA suave. Hashtags al final, nunca en la imagen.

### Email de campaña
Subject directo, < 50 caracteres, sin mayúsculas innecesarias. Cuerpo: un mensaje, un CTA. Para suscripción,
encuadrar como "no volver a pensarlo", no como compromiso.

### Respuesta a objeción (DM / comentario / soporte)
Usar la tabla de objeciones. Reconocer la duda → responder con ángulo (no claim médico) → invitar, sin presión.

---

## Reglas de oro del contenido

- **Educar antes que vender.** La categoría es nueva; el público no sabe que la necesita.
- **Un mensaje, una pieza, un producto.** No amontonar.
- **El precio nunca va primero.** Beneficio → valor → precio como confirmación.
- **Acompañamos, no transformamos.** Ante la duda de un claim, reescribir desde la regla de oro.
- **Hablar como la vida real, no como un laboratorio.** Sin lenguaje clínico.
- **México por ahora.** Modismos y referencias neutro-mexicanos. (Argentina y otros mercados: pendiente, no asumir.)

Para argumentos extendidos, guiones de ejemplo completos y un banco de hooks ampliado por producto, ver
`references/playbook-detail.md`.
