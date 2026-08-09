# Novapatch Brand — Referencia detallada

## Tabla de contenidos
1. [Contexto de marca](#contexto)
2. [Sistema de color ampliado](#color-ampliado)
3. [Tipografía — casos de uso](#typo-casos)
4. [Spacing — patrones comunes](#spacing-patrones)
5. [Componentes — especificación completa](#componentes)
6. [Social media — guías por formato](#social-guias)
7. [Brand voice — redacción de copy](#voice-copy)
8. [Precios y propuesta de valor](#precios)

---

## Contexto de marca {#contexto}

Novapatch es una marca directa al consumidor (D2C) de parches vitamínicos transdérmicos con suscripción.
Opera actualmente en México (novapatch.care) con expansión planificada a Argentina.

**Posicionamiento central:** Novapatch no vende parches. Vende una nueva forma de incorporar bienestar a la rutina diaria. El parche es el medio — el valor está en cómo el bienestar se integra al día a día sin promesas exageradas, sin fricción, sin ser una rutina más que sostener.

**Pilares de marca:**
- **Simplicidad:** Un solo gesto diario. Sin agua, sin horarios, sin pasos.
- **Constancia:** Lo simple se repite. La adherencia vale más que la potencia.
- **Integración real:** Se adapta a la vida que ya tenés. No la reorganiza.
- **Wellness sin fricción:** Cuidarse no debería sentirse como una obligación.

**Propuesta de valor operativa:** Nutrición diaria sin agua, sin pastillas, con un solo gesto. Práctico, natural, efectivo.

**Posicionamiento regulatorio:** Cuidado preventivo, no terapéutico. La marca acompaña hábitos — no hace promesas médicas.

**Seis productos:** Energy · Sleep · Zen · Shield · Glow · Woman

---

## Fundamento científico del producto {#ciencia}

### La regla de los 500 Daltons

No cualquier ingrediente sirve para un parche transdérmico. El tamaño molecular define qué atraviesa la piel:

- **< 500 Daltons + bien formuladas** → atraviesan · biodisponibles
- **> 500 Daltons** → no atraviesan · no aptas para parche

Las fórmulas de Novapatch se diseñan desde cero para uso transdérmico — no son adaptaciones de suplementos orales. La piel es un órgano activo, no una pared: filtra por tamaño y formulación.

### Atributos canónicos — todos los parches

Aplican a Energy, Sleep, Zen, Shield, Glow y Woman. Cualquier copy puede citarlos.

| Atributo | Detalle |
|---|---|
| 100% vegano | Sin ingredientes de origen animal |
| Sin azúcar | No afecta glucemia ni hábitos |
| Libre de gluten | Apto para sensibilidades |
| Resistente al agua | Ducha, ejercicio, vida normal |
| Sin látex | Adhesivo hipoalergénico |
| Alta absorción | Transdérmica · biodisponible |

---

## Sistema de color ampliado {#color-ampliado}

### Combinaciones aprobadas por fondo

**Sobre fondo Petróleo (`#1e3a5f`)**
- Texto: Crema (`#f5ece6`) o Blanco (`#ffffff`)
- Acento: Color del producto correspondiente
- Logo: Versión crema

**Sobre fondo Negro (`#111111`)**
- Texto: Crema (`#f5ece6`) o Blanco (`#ffffff`)
- Acento: Color del producto correspondiente
- Logo: Versión crema

**Sobre fondo Blanco (`#ffffff`)**
- Texto: Azul Principal (`#1a4b8c`) o Negro (`#111111`)
- Acento: Color del producto correspondiente
- Logo: Versión Azul Principal

**Sobre fondo Crema (`#f5ece6`)**
- Texto: Azul Principal (`#1a4b8c`) o Negro (`#111111`)
- Peso recomendado: SemiBold 600 para mejor legibilidad

### Gradientes (uso excepcional)
Los gradientes no están en la guía oficial. Evitar salvo en contextos decorativos de fondo muy sutiles.
Nunca aplicar gradientes al logo.

### Opacidades
Para overlays sobre imágenes: Petróleo al 80%–90% de opacidad.

---

## Tipografía — casos de uso {#typo-casos}

### Jerarquía en piezas sociales

```
[Badge producto · Label 600/11px · color producto]
[Headline · Hero 800/64px ó Title 700/44px · Crema/Blanco]
[Sub-claim · Body 400/17px · Crema/Blanco · opacidad 80%]
[Handle · Caption 400/14px · Crema/Blanco · opacidad 60%]
```

### Jerarquía en web (UI)
```
[Section label · Label 600/11px/0.12em · Azul Principal]
[Page title · Hero 800/64px · Petróleo/Negro]
[Section heading · Heading 600/30px · Petróleo]
[Body copy · Body 400/17px/1.65lh · Negro/Petróleo]
[Supporting text · Caption 400/14px · Gris medio]
```

### Reglas críticas de tipografía
- **Nunca** usar fuentes diferentes a Outfit
- **Nunca** poner texto sobre color de producto sin suficiente contraste — mínimo 4.5:1 WCAG AA
- **Nunca** usar más de dos niveles de jerarquía tipográfica en una pieza social
- **Siempre** usar tracking negativo en Hero y Title para apariencia premium
- **Siempre** revisar legibilidad en mobile antes de publicar

---

## Spacing — patrones comunes {#spacing-patrones}

### Card de producto (web)
```
padding: 24px (space-6)
gap interno entre elementos: 16px (space-4)
gap entre badge y nombre: 8px (space-2)
gap entre precio y CTA: 24px (space-6)
border-radius: 8px
```

### Botón
```
padding horizontal: 24px (space-6) en tamaño normal
padding horizontal: 32px (space-8) en tamaño large
padding vertical: 12px (space-3) en tamaño normal
padding vertical: 16px (space-4) en tamaño large
border-radius: 9999px (pill)
```

### Layout de página
```
max-width contenedor: 1200px
padding lateral desktop: 64px (space-16)
padding lateral mobile: 24px (space-6)
gap entre secciones principales: 96px ó 80px (múltiplos de 4)
```

---

## Componentes — especificación completa {#componentes}

### Botón primario
```css
background: #1a4b8c;
color: #ffffff;
border-radius: 9999px;
padding: 12px 24px;
font: 600 16px/1 'Outfit', sans-serif;
letter-spacing: 0.02em;
border: none;
cursor: pointer;
transition: opacity 0.2s;

&:hover { opacity: 0.88; }
&:disabled { opacity: 0.4; cursor: not-allowed; }
```

### Botón secundario (outline)
```css
background: transparent;
color: #1a4b8c;
border: 1.5px solid #1a4b8c;
border-radius: 9999px;
padding: 12px 24px;
font: 600 16px/1 'Outfit', sans-serif;
```

### Badge de producto
```css
/* Ejemplo para Energy */
background: #83b5f4;
color: #ffffff;
border-radius: 9999px;
padding: 4px 12px;
font: 600 11px/1 'Outfit', sans-serif;
letter-spacing: 0.12em;
text-transform: uppercase;
```

### Input de formulario
```css
/* Default */
border: 1px solid #d0d8e4;
border-radius: 8px;
padding: 12px 16px;
font: 400 17px/1.65 'Outfit', sans-serif;
color: #111111;
background: #ffffff;
outline: none;

/* Focus */
border: 2px solid #1a4b8c;

/* Error */
border: 2px solid #f25c54;
```

### Toggle
```css
/* Activo */
background: #1a4b8c;
/* Inactivo */
background: #d0d8e4;
/* thumb */
background: #ffffff;
border-radius: 9999px;
```

### Notificación de éxito
```css
background: #ecfdf5;
border-left: 4px solid #10b981;
color: #065f46;
```

### Notificación de error
```css
background: #fef2f2;
border-left: 4px solid #f25c54;
color: #991b1b;
```

### Notificación informativa
```css
background: #eff6ff;
border-left: 4px solid #1a4b8c;
color: #1e3a5f;
```

---

## Social media — guías por formato {#social-guias}

### Feed 1:1 · 1080×1080

**Estructura de layout (de arriba a abajo):**
```
64px zona segura
  Badge (arriba izquierda)
  
  [espacio flexible]
  
  Headline principal (64–80px, Outfit 800)
  16px gap
  Sub-claim (28–32px, Outfit 400, opacidad 80%)
  
  [espacio flexible]
  
  Handle @novapatch.care (Caption, opacidad 60%)
64px zona segura
```

**Fondo:** Petróleo (`#1e3a5f`) o Negro (`#111111`) + color de producto como acento decorativo.

### Feed 4:5 · 1080×1350

El layout extra vertical permite:
- Headline más largo (hasta 3 líneas)
- Imagen de producto (parche) en la zona media
- Más espacio de respiración

**Estructura:**
```
80px zona segura
  Badge + fecha/claim corto
  
  Imagen de producto (zona media, ~40% del alto)
  
  Headline
  Sub-claim
  CTA arrow
  
  Handle
80px zona segura
```

### Story 9:16 · 1080×1920

**Zona segura crítica:** 230px arriba y abajo (UI de Instagram cubre esas zonas).

**Estructura:**
```
230px zona segura (UI Instagram)
  Badge centrado
  
  [espacio]
  
  Headline (80–96px, Outfit 800, centrado)
  24px gap
  Sub-claim (36px, Outfit 400, centrado)
  
  [espacio]
  
  CTA: "Conocé [Producto] →" (centrado)
230px zona segura (UI Instagram)
```

### Carrusel

**Reglas del carrusel:**
- Portada: Hook fuerte con pregunta o dato. "¿Qué parche es para vos?" + "Deslizá →"
- Slides de desarrollo: Un producto por slide. Badge → Headline → Insight breve → Mood palabra clave
- Slide final: CTA + logo centrado + handle
- Consistencia: Mismo sistema cromático en todo el carrusel
- Máx. 10 slides. Recomendado: 6 (portada + 5 productos con CTA final)

---

## Brand voice — redacción de copy {#voice-copy}

### Principios generales de escritura

**El tono de Novapatch es:**
- Honesto y directo (sin exageraciones)
- Funcional (explica el beneficio real)
- Humano (habla de vida cotidiana, no de laboratorio)
- Confiable (no promete milagros)

**El tono de Novapatch NO es:**
- Clínico o médico
- Urgente o presionador
- Aspiracional vacío ("sé la mejor versión de ti")
- Científico denso

### Claims permitidos — lista completa
```
acompaña el bienestar diario
pensado para la vida real
bienestar sin fricción
uso diario y constante
ingredientes naturales seleccionados
se integra a tu rutina
no requiere agua · alternativa a las cápsulas
formato práctico y discreto
bienestar como hábito, no como excepción
diseñado para acompañar, no para forzar
acompaña · apoya · ayuda a · complementa · colabora con
sin fricción · un solo gesto · todos los días · naturalmente
cuidarte mejor · tus propios ritmos · sin agua · en un parche
```

### Claims prohibidos — lista completa
No usar nunca, ni siquiera con disclaimers. Requieren respaldo regulatorio que Novapatch no comunica:
```
cura · trata · previene enfermedades
reemplaza medicación o tratamiento
resultados garantizados
efectos inmediatos
clínicamente probado para X condición
aprobado para tratar X
100% efectivo · funciona en todos los casos
solución mágica · transformación garantizada
lenguaje clínico o médico
promesas anti-edad o de cambio corporal
refuerza (el sistema inmune) · garantiza · terapéutico · medicinal
```

> Regla de escape: si dudás de un claim, reescribilo desde la regla de oro — **acompañamos, no transformamos.**

### Estructura de claim efectivo
```
[Insight humano]. [Beneficio en términos cotidianos].
```

Ejemplos por producto:
- Energy: "No te acelera. Te acompaña." / "Energía celular sostenida."
- Sleep: "Bajá el ritmo. Descansá mejor." / "Acompañamiento nocturno."
- Zen: "Calma para seguir, no para frenar." / "Estar mejor mientras seguís haciendo."
- Shield: "Cuidarse antes es cuidarse mejor." / "Apoyo a las defensas naturales."
- Glow: "Glow no se fuerza. Se acompaña." / "Bienestar que se refleja en la piel."
- Woman: "Respetar los propios ritmos." / "Bienestar femenino sin etiquetas."

### Copy para diferentes formatos

**Headline social (feed):** Máx. 8 palabras. Puntuación mínima. Sin hashtags en la imagen.

**Caption Instagram:** Párrafo corto (2–3 líneas) + salto + bullet points de beneficios + CTA suave + hashtags al final (no en la imagen).

**Copy de card de producto (web):** Nombre → precio → beneficio en una línea → lista corta de ventajas de suscripción.

**Email subject:** Directo, sin emoji al inicio, sin mayúsculas innecesarias. Máx. 50 caracteres.

---

## Targets por producto {#targets}

Usar esta información para adaptar el copy, el tono y los ejemplos en cada pieza según el producto.

### Energy
- **Primario:** 25–45 años. Profesionales, emprendedores, creativos con rutinas intensas. Fatiga mental más que física.
- **Secundario:** Personas que quieren reducir café, tienen sensibilidad gástrica o buscan energía sin afectar el sueño.
- **Insight de copy:** Hablar de claridad mental y rendimiento sostenido, no de "más energía" genérica.

### Sleep
- **Primario:** 25–55 años. Profesionales con estrés, emprendedores, padres. Les cuesta desconectar a la noche.
- **Secundario:** Personas que duermen pero se despiertan cansadas, viajeros frecuentes, quienes evitan pastillas.
- **Insight de copy:** El problema empieza antes de acostarse — el ritual de bajada de ritmo.

### Zen
- **Primario:** 25–50 años. Alta carga mental, trabajan bajo presión. Profesionales, emprendedores, creativos.
- **Secundario:** Practitioners casuales de mindfulness/yoga, quienes buscan reducir estrés sin soluciones fuertes.
- **Insight de copy:** No es detenerse — es seguir funcionando con más calma. Calma funcional, no retiro.

### Shield
- **Primario:** 30–55 años. Padres, viajeros frecuentes, profesionales con rutinas exigentes. Perfil más adulto que el resto.
- **Secundario:** Personas que toman suplementos de forma estacional y buscan alternativas fáciles de sostener.
- **Insight de copy:** El cuidado preventivo, no reactivo. "Antes de que pase algo."

### Glow
- **Primario:** 25–45 años, principalmente mujeres. Interesadas en skincare integral, poco tiempo para rutinas complejas.
- **Secundario:** Quienes ya usan suplementos para piel/pelo/uñas y buscan un formato más simple.
- **Insight de copy:** Skincare desde adentro. No un producto de belleza — un hábito de bienestar que se ve.

### Woman
- **Primario:** 25–50 años, mujeres. Profesionales, madres, emprendedoras. Conectadas con el autocuidado consciente.
- **Secundario:** Mujeres que ya consumen suplementos de bienestar femenino y buscan algo más fácil de sostener.
- **Insight de copy:** El bienestar femenino es cíclico, no lineal. Respetar los ritmos propios, no forzarlos.

---

## Precios y propuesta de valor {#precios}

### Estructura de precios (México)
| Plan | Precio | Descuento |
|---|---|---|
| One-time | $750 MXN | — |
| Mensual (suscripción) | $750 MXN/mes | — |
| Bimestral | $637 MXN/envío | −15% |
| Trimestral | Ver sistema | Ver sistema |
| Semestral | Ver sistema | Ver sistema |

### Ventajas de suscripción (siempre mencionar)
- ✓ Envío incluido
- ✓ Cancelás cuando quieras
- ✓ Pausa sin costo
- ✓ Plan recomendado: Bimestral (mayor ahorro)

### Propuesta de valor en copy
No mencionar el precio primero. Primero el beneficio, luego el precio como confirmación de valor.

❌ "Por solo $750 al mes, obtené Energy"
✅ "Energy · Energía celular sostenida · desde $750/mes"
