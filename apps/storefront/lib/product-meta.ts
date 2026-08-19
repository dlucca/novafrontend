/**
 * product-meta.ts — Fuente única de verdad para toda la metadata de producto.
 * Importado por ProductGrid (home) y TiendaExperience (tienda).
 */

export type ProductMeta = {
  slug: string;
  name: string;
  description: string;
  ingredients: string[];
  imgSrc: string;
  hoverImgSrc?: string;
  howItWorksImage: string;
  color: string;
  bg: string;
  taglineColor: string;
  quote: string;
  tags: string[];
  popular?: boolean;
};

export const PRODUCT_META: Record<string, ProductMeta> = {
  energy: {
    slug: "energy",
    name: "Energy",
    description:
      "Energía que acompaña tu día sin picos ni caídas. Un solo parche en la mañana para sostener el foco y el rendimiento durante horas — sin café extra, sin cápsulas, sin complicaciones.",
    ingredients: [
      "Vitamin C (Ascorbyl Palmitate)",
      "L-Carnitine",
      "Green Tea Extract (20% Caffeine)",
      "Ginseng Extract",
      "Vitamin B2 (Riboflavin)",
      "Folic Acid (L-Methylfolate)",
      "Vitamin E",
    ],
    imgSrc: "/products/Energy_45.webp",
    hoverImgSrc: "/products/Energy_1.webp",
    howItWorksImage: "/infographic/Banner_howitworks_pdp.webp",
    color: "#2B7CC1",
    bg: "#EBF4FB",
    taglineColor: "#1A5C9A",
    quote: '"Tu día no para. Tu energía tampoco."',
    tags: ["Energía sostenida", "Sin picos ni caídas"],
    popular: true,
  },
  glow: {
    slug: "glow",
    name: "Glow",
    description:
      "La piel refleja cómo te cuidas, no solo lo que te pones encima. Glow trabaja desde adentro, día a día, para acompañar el bienestar que con el tiempo se nota hacia afuera.",
    ingredients: [
      "Vitamin C (Magnesium Ascorbyl Phosphate)",
      "Hyaluronic Acid",
      "Hydrolyzed Collagen",
      "Biotin",
      "Niacinamide (Vitamin B3)",
      "Centella Asiatica Extract",
      "Vitamin E",
    ],
    imgSrc: "/products/Glow_45.webp",
    hoverImgSrc: "/products/Glow_1.webp",
    howItWorksImage: "/infographic/Banner_howitworks_pdp.webp",
    color: "#C94030",
    bg: "#FAF0EE",
    taglineColor: "#B83525",
    quote: '"La piel también refleja cómo te cuidas."',
    tags: ["Bienestar desde adentro", "Constancia"],
  },
  sleep: {
    slug: "sleep",
    name: "Sleep",
    description:
      "El descanso empieza antes de acostarse. Sleep acompaña la transición al sueño para que llegues a la cama con el ritmo bajado y despiertes sintiéndote descansado de verdad.",
    ingredients: [
      "Tryptophan",
      "Magnesium (Bisglycinate)",
      "Inositol",
      "Vitamin B6",
      "Glycine",
    ],
    imgSrc: "/products/Sleep_45.webp",
    hoverImgSrc: "/products/Sleep_1.webp",
    howItWorksImage: "/infographic/Banner_howitworks_pdp.webp",
    color: "#138A75",
    bg: "#EBF7F5",
    taglineColor: "#0F6B5C",
    quote: '"Porque descansar también es cuidarse."',
    tags: ["Descanso nocturno", "Sin somníferos"],
  },
  zen: {
    slug: "zen",
    name: "Zen",
    description:
      "Para los días en que todo pide atención al mismo tiempo. Zen acompaña estados de calma funcional — sin apagarte, sin desconectarte — para que sigas presente sin la tensión encima.",
    ingredients: [
      "Tryptophan",
      "Magnesium (Taurate)",
      "Taurine",
      "Chamomile Extract",
      "Vitamin B6",
    ],
    imgSrc: "/products/Zen_45.webp",
    hoverImgSrc: "/products/Zen_1.webp",
    howItWorksImage: "/infographic/Banner_howitworks_pdp.webp",
    color: "#3A6FA8",
    bg: "#EBF0F9",
    taglineColor: "#2A5490",
    quote: '"El equilibrio que no se ve, pero se siente."',
    tags: ["Calma funcional", "Días intensos"],
  },
  shield: {
    slug: "shield",
    name: "Shield",
    description:
      "El cuidado que funciona es el de todos los días, no el de emergencia. Shield se integra a tu rutina diaria como un gesto simple de prevención — constante, sin fricción, sin excusas.",
    ingredients: [
      "Vitamin C (Ascorbyl Palmitate)",
      "Zinc (Picolinate)",
      "Vitamin D3",
      "Vitamin E",
      "Niacinamide",
    ],
    imgSrc: "/products/Shield_45.webp",
    hoverImgSrc: "/products/Shield_1.webp",
    howItWorksImage: "/infographic/Banner_howitworks_pdp.webp",
    color: "#A07000",
    bg: "#FAF6E9",
    taglineColor: "#8C6000",
    quote: '"Tu rutina de cuidado empieza hoy, no cuando algo pasa."',
    tags: ["Cuidado preventivo", "Uso diario"],
  },
  woman: {
    slug: "woman",
    name: "Woman",
    description:
      "Pensado para el cuerpo femenino real, que no es igual todos los días. Woman acompaña el equilibrio natural sin medicalizar, sin forzar — con un gesto simple que se sostiene en el tiempo.",
    ingredients: [
      "Soy Extract",
      "Vitamin B6",
      "Magnesium (Bisglycinate)",
      "Folic Acid (L-Methylfolate)",
      "Iron (Bisglycinate)",
    ],
    imgSrc: "/products/Woman_45.webp",
    hoverImgSrc: "/products/Woman_1.webp",
    howItWorksImage: "/infographic/Banner_howitworks_pdp.webp",
    color: "#8A3EBE",
    bg: "#F3EBF9",
    taglineColor: "#6B3080",
    quote: '"Escucharte también es una forma de cuidarte."',
    tags: ["Bienestar femenino", "Ritmos naturales"],
  },
  "pack-dia-noche": {
    slug: "pack-dia-noche",
    name: "Ritual Día & Noche",
    description:
      "La combinación diseñada para acompañar tu ritmo biológico de 24 horas. Sostiene la claridad y el foco matutino con Energy y acompaña la transición hacia un descanso reparador con Sleep — con un 15% de ahorro permanente.",
    ingredients: [
      "Extracto de Té Verde & Ginseng (Energy)",
      "L-Carnitina & Vitaminas B (Energy)",
      "Triptófano & Bisglicinato de Magnesio (Sleep)",
      "Inositol & Glicina (Sleep)",
    ],
    imgSrc: "/products/Bundle_dianoche_patches_45.webp",
    howItWorksImage: "/infographic/Banner_howitworks_pdp.webp",
    color: "#005088",
    bg: "#EBF4FB",
    taglineColor: "#005088",
    quote: '"Energía para tu día. Descanso para tu noche."',
    tags: ["Ritual 24h", "15% OFF"],
    popular: true,
  },
  "pack-calma-sueno": {
    slug: "pack-calma-sueno",
    name: "Pack Calma & Sueño",
    description:
      "La combinación pensada para desacelerar la mente y preparar el descanso. Acompaña estados de calma funcional por la tarde con Zen y facilita la transición hacia un descanso reparador con Sleep — con un 15% de ahorro permanente.",
    ingredients: [
      "Triptófano & Taurato de Magnesio (Zen)",
      "Taurina & Manzanilla (Zen)",
      "Bisglicinato de Magnesio & Inositol (Sleep)",
      "Glicina & Vitamina B6 (Sleep)",
    ],
    imgSrc: "/products/Bundle_calma_patches_45.webp",
    howItWorksImage: "/infographic/Banner_howitworks_pdp.webp",
    color: "#3A6FA8",
    bg: "#EBF0F9",
    taglineColor: "#3A6FA8",
    quote: '"Desconecta la mente de día, descansa profundo de noche."',
    tags: ["Anti-Estrés", "15% OFF"],
  },
  "pack-glow-balance": {
    slug: "pack-glow-balance",
    name: "Pack Glow & Balance",
    description:
      "Cuidado integral diseñado para la mujer. Acompaña el cuidado de la piel, uñas y cabello desde adentro con Glow y apoya el equilibrio de tus ritmos naturales con Woman — con un 15% de ahorro permanente.",
    ingredients: [
      "Colágeno Hidrolizado & Biotina (Glow)",
      "Ácido Hialurónico & Vitamina C (Glow)",
      "Extracto de Soya & Hierro (Woman)",
      "Magnesio & Ácido Fólico (Woman)",
    ],
    imgSrc: "/products/Bundle_mujer_patches_45.webp",
    howItWorksImage: "/infographic/Banner_howitworks_pdp.webp",
    color: "#8A3EBE",
    bg: "#F3EBF9",
    taglineColor: "#8A3EBE",
    quote: '"Piel radiante y equilibrio biológico a tu ritmo."',
    tags: ["Bienestar Femenino", "15% OFF"],
  },
  "pack-trio-vitalidad": {
    slug: "pack-trio-vitalidad",
    name: "Trío Vitalidad 360°",
    description:
      "El paquete completo de 3 parches para acompañar cada momento de tu día. Sostiene tu foco con Energy, acompaña la calma diurna con Zen y facilita el descanso reparador con Sleep — con un 20% de ahorro permanente.",
    ingredients: [
      "Té Verde & Ginseng (Energy)",
      "Triptófano & Taurato de Magnesio (Zen)",
      "Bisglicinato de Magnesio & Inositol (Sleep)",
      "Vitaminas B, C & Glicina",
    ],
    imgSrc: "/products/Bundle_360_patches_45.webp",
    howItWorksImage: "/infographic/Banner_howitworks_pdp.webp",
    color: "#138A75",
    bg: "#EBF7F5",
    taglineColor: "#138A75",
    quote: '"Energía matutina, calma diurna y descanso nocturno."',
    tags: ["Trío 360°", "20% OFF"],
  },
};

export const BUNDLE_ORIGINAL_PRICES: Record<string, number> = {
  "pack-dia-noche": 1500,
  "pack-calma-sueno": 1500,
  "pack-glow-balance": 1500,
  "pack-trio-vitalidad": 2250,
};

// Orden de aparición en grillas
export const PRODUCT_ORDER = [
  "energy",
  "sleep",
  "glow",
  "shield",
  "zen",
  "woman",
  "pack-dia-noche",
  "pack-calma-sueno",
  "pack-glow-balance",
  "pack-trio-vitalidad",
];

export function getOrderedMeta(): ProductMeta[] {
  return PRODUCT_ORDER.map((slug) => PRODUCT_META[slug]).filter(Boolean);
}

// ─── PDP (Product Detail Page) ────────────────────────────────────────────────

export type PdpMeta = {
  /** Subtítulo bajo el nombre del producto */
  tagline: string;
  /** Sección "¿Cómo te acompaña?" — 4 bullets */
  accompaniment: string[];
  /** Párrafo específico del producto en "Cómo funciona" (sigue a HOW_IT_WORKS_INTRO) */
  howItWorks: string;
  /** Ingredientes con descripción ("Asociado con…") */
  ingredientDetails: { name: string; description: string }[];
  /** "Modo de uso" — 3 pasos */
  usageSteps: [string, string, string];
  /** Preguntas frecuentes — 4 */
  faq: { q: string; a: string }[];
};

/** Beneficios de suscripción — compartidos por todos los productos */
export const SUBSCRIPTION_PERKS = [
  {
    title: "Sin interrupciones",
    description:
      "Tu parche llega antes de que se te acabe. Sin acordarte. Sin perder el ritmo.",
  },
  {
    title: "Precio de suscriptor",
    description:
      "Siempre más bajo que la compra individual. El hábito que se sostiene, conviene.",
  },
  {
    title: "Tú controlas",
    description:
      "Pausa, cambia o cancela cuando quieras. Sin llamadas, sin penalizaciones.",
  },
] as const;

/** Párrafo introductorio de "Cómo funciona" — compartido */
export const HOW_IT_WORKS_INTRO =
  "Los parches Novapatch liberan sus ingredientes activos de forma gradual directamente a través de la piel hacia el torrente sanguíneo.";

export const PDP_META: Record<string, PdpMeta> = {
  energy: {
    tagline: "Energía sostenida para tu día",
    accompaniment: [
      "Acompaña el foco y la claridad durante el día",
      "Apoya la energía sostenida, sin picos ni caídas",
      "Ayuda a reducir la sensación de fatiga a media tarde",
      "Favorece el rendimiento en rutinas exigentes",
    ],
    howItWorks:
      "Novapatch Energy libera sus ingredientes de forma gradual durante el día, acompañando los niveles naturales de energía sin los picos y caídas asociados al exceso de café.",
    ingredientDetails: [
      { name: "Extracto de Té Verde (20% cafeína)", description: "Asociado con la energía y el estado de alerta, con liberación gradual de cafeína." },
      { name: "L-Carnitina", description: "Asociada con el metabolismo energético celular." },
      { name: "Extracto de Ginseng", description: "Asociado con la vitalidad y la resistencia a la fatiga." },
      { name: "Vitamina C (palmitato de ascorbilo)", description: "Asociada con la reducción del cansancio y el apoyo antioxidante." },
      { name: "Vitamina B2 (riboflavina)", description: "Asociada con el metabolismo energético normal." },
      { name: "Ácido Fólico (L-metilfolato)", description: "Asociado con la función cognitiva y la reducción de la fatiga." },
      { name: "Vitamina E", description: "Asociada con la protección antioxidante." },
    ],
    usageSteps: [
      "Aplica 1 parche por la mañana en el brazo, abdomen o parte superior de la espalda. Elige una zona cómoda y con poco vello.",
      "Déjalo actuar durante el día. El parche libera los ingredientes de forma controlada mientras sigues con tu rutina.",
      "Retíralo por la noche y desecha. Lava suavemente el área. Úsalo todos los días para obtener mejores resultados.",
    ],
    faq: [
      { q: "¿Me va a quitar el sueño?", a: "Está pensado para acompañar tu energía durante el día. Al retirarlo por la noche, la liberación se corta y no interfiere con tu descanso." },
      { q: "¿Reemplaza al café?", a: "Muchas personas lo usan para reducir el café sin resignar foco. Puedes combinarlo o usarlo como alternativa, según tu rutina." },
      { q: "¿Voy a sentir un pico de energía?", a: "No. La liberación es gradual: la idea es acompañar tu día parejo, sin picos ni caídas." },
      { q: "¿Puedo usarlo todos los días?", a: "Sí, está pensado para uso diario como parte de tu rutina. La constancia es lo que hace la diferencia." },
    ],
  },
  sleep: {
    tagline: "Descanso nocturno más reparador",
    accompaniment: [
      "Acompaña la relajación antes de dormir",
      "Apoya un sueño más profundo y reparador",
      "Ayuda a reducir la mente inquieta por la noche",
      "Favorece despertar con mayor sensación de descanso",
    ],
    howItWorks:
      "Novapatch Sleep libera sus ingredientes de forma controlada durante la noche, apoyando los procesos naturales de relajación del cuerpo para favorecer un sueño más profundo y reparador.",
    ingredientDetails: [
      { name: "Triptófano", description: "Asociado con el apoyo a la producción natural de melatonina y serotonina." },
      { name: "Magnesio (bisglicinato)", description: "Asociado con la relajación muscular y el apoyo para bajar el ritmo." },
      { name: "Inositol", description: "Asociado con el apoyo al equilibrio emocional y la calidad del descanso." },
      { name: "Vitamina B6", description: "Asociada con el apoyo al metabolismo de neurotransmisores relacionados con el sueño." },
      { name: "Glicina", description: "Asociada con la mejora de la calidad del sueño y la sensación de descanso reparador." },
    ],
    usageSteps: [
      "Aplica 1 parche 1 hora antes de acostarte en el brazo, abdomen o parte superior de la espalda. Elige una zona cómoda donde no interfiera con tu sueño.",
      "Déjalo actuar durante toda la noche. El parche libera los ingredientes de forma controlada mientras descansas.",
      "Retíralo por la mañana y desecha. Lava suavemente el área. Úsalo todas las noches para obtener mejores resultados.",
    ],
    faq: [
      { q: "¿Es adictivo o genera dependencia?", a: "No. No contiene melatonina ni sustancias sedantes fuertes. Ayuda a relajar el cuerpo de forma natural sin crear hábito." },
      { q: "¿Puedo usarlo todas las noches?", a: "Sí, está pensado para uso nocturno regular. Muchas personas lo usan todas las noches como parte de su rutina de descanso." },
      { q: "¿Funciona desde la primera noche?", a: "Algunos notan mejor conciliación del sueño desde la primera vez, pero los resultados más profundos y reparadores aparecen con el uso constante." },
      { q: "¿Me va a dar sueño durante el día?", a: "No. Está formulado para actuar principalmente por la noche y no genera somnolencia diurna." },
    ],
  },
  zen: {
    tagline: "Calma para seguir, no para frenar",
    accompaniment: [
      "Acompaña estados de calma funcional durante el día",
      "Apoya el equilibrio en jornadas de alta carga mental",
      "Ayuda a bajar la tensión sin desconectarte",
      "Favorece la sensación de presencia y claridad",
    ],
    howItWorks:
      "Novapatch Zen libera sus ingredientes de forma gradual durante el día, acompañando los procesos naturales de regulación del cuerpo para que la calma no signifique frenar.",
    ingredientDetails: [
      { name: "Triptófano", description: "Asociado con el apoyo a la producción natural de serotonina." },
      { name: "Magnesio (taurato)", description: "Asociado con la relajación y el equilibrio del sistema nervioso." },
      { name: "Taurina", description: "Asociada con el apoyo a la regulación del sistema nervioso." },
      { name: "Extracto de Manzanilla", description: "Asociada tradicionalmente con la calma y la relajación." },
      { name: "Vitamina B6", description: "Asociada con el metabolismo de neurotransmisores vinculados al estado de ánimo." },
    ],
    usageSteps: [
      "Aplica 1 parche por la mañana en el brazo, abdomen o parte superior de la espalda. Elige una zona cómoda y con poco vello.",
      "Déjalo actuar durante el día. El parche libera los ingredientes de forma controlada mientras sigues presente en lo tuyo.",
      "Retíralo por la noche y desecha. Lava suavemente el área. Úsalo todos los días para obtener mejores resultados.",
    ],
    faq: [
      { q: "¿Me va a dar sueño o me va a 'apagar'?", a: "No. Zen acompaña la calma funcional: la idea es seguir con tu día con menos tensión encima, no frenarlo." },
      { q: "¿Cuándo conviene usarlo?", a: "En días de alta carga mental o épocas intensas. Como todo hábito, funciona mejor con uso constante que como recurso de emergencia." },
      { q: "¿Puedo combinarlo con Sleep?", a: "Sí: Zen acompaña el día y Sleep la noche. Son fórmulas distintas pensadas para momentos distintos." },
      { q: "¿Puedo usarlo todos los días?", a: "Sí, está pensado para uso diario como parte de tu rutina." },
    ],
  },
  shield: {
    tagline: "Cuidado preventivo, todos los días",
    accompaniment: [
      "Acompaña tus defensas naturales día a día",
      "Apoya una rutina de cuidado preventivo sin fricción",
      "Ayuda a sostener la constancia en épocas exigentes",
      "Favorece el aporte diario de vitaminas y minerales clave",
    ],
    howItWorks:
      "Novapatch Shield libera sus ingredientes de forma gradual durante el día, acompañando el funcionamiento normal de las defensas como un gesto simple de prevención cotidiana.",
    ingredientDetails: [
      { name: "Vitamina C (palmitato de ascorbilo)", description: "Asociada con el funcionamiento normal de las defensas y el apoyo antioxidante." },
      { name: "Zinc (picolinato)", description: "Asociado con el apoyo al sistema inmune." },
      { name: "Vitamina D3", description: "Asociada con el funcionamiento normal del sistema inmune." },
      { name: "Vitamina E", description: "Asociada con la protección antioxidante." },
      { name: "Niacinamida", description: "Asociada con el metabolismo energético normal." },
    ],
    usageSteps: [
      "Aplica 1 parche por la mañana en el brazo, abdomen o parte superior de la espalda. Elige una zona cómoda y con poco vello.",
      "Déjalo actuar durante el día. El parche libera los ingredientes de forma controlada mientras haces tu vida normal.",
      "Retíralo por la noche y desecha. Lava suavemente el área. Úsalo todos los días para obtener mejores resultados.",
    ],
    faq: [
      { q: "¿Cuándo conviene usarlo?", a: "Todo el año. El cuidado que funciona es el constante, no el de emergencia — por eso Shield está pensado como hábito diario." },
      { q: "¿Reemplaza una alimentación equilibrada?", a: "No. Shield acompaña tu rutina de cuidado; no reemplaza una alimentación variada ni hábitos saludables." },
      { q: "¿Sirve solo en invierno?", a: "Está pensado para uso diario en cualquier época. La constancia diaria vale más que el refuerzo estacional." },
      { q: "¿Puedo usarlo todos los días?", a: "Sí, está diseñado exactamente para eso: un gesto simple que se sostiene en el tiempo." },
    ],
  },
  glow: {
    tagline: "Bienestar que se nota hacia afuera",
    accompaniment: [
      "Acompaña el cuidado de la piel desde adentro",
      "Apoya una rutina de bienestar integral, día a día",
      "Ayuda a sostener la constancia que la piel agradece",
      "Favorece el aporte de nutrientes asociados a piel, pelo y uñas",
    ],
    howItWorks:
      "Novapatch Glow libera sus ingredientes de forma gradual durante el día, acompañando desde adentro los procesos naturales de la piel. Glow no es un efecto: es un proceso que se construye con constancia.",
    ingredientDetails: [
      { name: "Vitamina C (ascorbil fosfato de magnesio)", description: "Asociada con la formación normal de colágeno y el apoyo antioxidante." },
      { name: "Ácido Hialurónico", description: "Asociado con la hidratación y la elasticidad de la piel." },
      { name: "Colágeno Hidrolizado", description: "Asociado con el aporte de aminoácidos vinculados a la piel." },
      { name: "Biotina", description: "Asociada con el mantenimiento normal de la piel y el pelo." },
      { name: "Niacinamida (vitamina B3)", description: "Asociada con el mantenimiento normal de la piel." },
      { name: "Extracto de Centella Asiática", description: "Asociada tradicionalmente con el cuidado y la regeneración de la piel." },
      { name: "Vitamina E", description: "Asociada con la protección antioxidante." },
    ],
    usageSteps: [
      "Aplica 1 parche por la mañana en el brazo, abdomen o parte superior de la espalda. Elige una zona cómoda y con poco vello.",
      "Déjalo actuar durante el día. El parche libera los ingredientes de forma controlada mientras sigues con tu rutina.",
      "Retíralo por la noche y desecha. Lava suavemente el área. Úsalo todos los días para obtener mejores resultados.",
    ],
    faq: [
      { q: "¿En cuánto tiempo se nota?", a: "Glow no es un efecto inmediato, es un proceso. El bienestar que se construye día a día es el que con el tiempo se nota hacia afuera." },
      { q: "¿Reemplaza mi rutina de skincare?", a: "No, la complementa. Tu skincare trabaja por fuera; Glow acompaña por dentro." },
      { q: "¿Sirve también para pelo y uñas?", a: "Su fórmula incluye nutrientes asociados al mantenimiento normal de piel, pelo y uñas, como biotina y colágeno hidrolizado." },
      { q: "¿Puedo usarlo todos los días?", a: "Sí, está pensado para uso diario. La constancia es justamente lo que hace al proceso." },
    ],
  },
  woman: {
    tagline: "Bienestar femenino, a tu ritmo",
    accompaniment: [
      "Acompaña el equilibrio natural del cuerpo femenino",
      "Apoya el bienestar en los distintos momentos del ciclo",
      "Ayuda a sostener la energía y el ánimo día a día",
      "Favorece el aporte de nutrientes clave para la mujer",
    ],
    howItWorks:
      "Novapatch Woman libera sus ingredientes de forma gradual durante el día, acompañando el equilibrio natural del cuerpo femenino — que no es igual todos los días — sin medicalizar y sin forzar.",
    ingredientDetails: [
      { name: "Extracto de Soya", description: "Asociado con el apoyo al equilibrio natural del bienestar femenino." },
      { name: "Vitamina B6", description: "Asociada con la regulación de la actividad hormonal normal." },
      { name: "Magnesio (bisglicinato)", description: "Asociado con la relajación muscular y la reducción del cansancio." },
      { name: "Ácido Fólico (L-metilfolato)", description: "Asociado con la reducción de la fatiga y la función cognitiva." },
      { name: "Hierro (bisglicinato)", description: "Asociado con el transporte normal de oxígeno y la reducción del cansancio." },
    ],
    usageSteps: [
      "Aplica 1 parche por la mañana en el brazo, abdomen o parte superior de la espalda. Elige una zona cómoda y con poco vello.",
      "Déjalo actuar durante el día. El parche libera los ingredientes de forma controlada mientras sigues con tu rutina.",
      "Retíralo por la noche y desecha. Lava suavemente el área. Úsalo todos los días para obtener mejores resultados.",
    ],
    faq: [
      { q: "¿Contiene hormonas?", a: "No. Su fórmula se basa en nutrientes y extractos naturales, sin hormonas." },
      { q: "¿Puedo usarlo durante todo el ciclo?", a: "Sí, está pensado para acompañar el día a día de forma constante, en todos los momentos del ciclo." },
      { q: "¿Es compatible con anticonceptivos u otra medicación?", a: "Ante cualquier situación particular o tratamiento en curso, lo mejor es consultarlo with un profesional de la salud." },
      { q: "¿Puedo usarlo todos los días?", a: "Sí, está diseñado como un gesto simple que se sostiene en el tiempo, a tu ritmo." },
    ],
  },
  "pack-dia-noche": {
    tagline: "Ritual 24 horas: Claridad de día y descanso de noche",
    accompaniment: [
      "Energy (Mañana): Acompaña la claridad mental y el foco diurno sin picos ni caídas",
      "Sleep (Noche): Acompaña la bajada de ritmo y la transición al descanso nocturno",
      "Acompaña tu rutina las 24 horas de forma simple, sin agua y sin cápsulas",
      "Ahorro del 15% OFF permanente comparado con la compra individual",
    ],
    howItWorks:
      "El Ritual Día & Noche acompaña tu jornada en dos momentos clave: por la mañana, el parche Energy libera gradualmente sus nutrientes asociados al foco; por la noche, el parche Sleep acompaña la bajada de ritmo para llegar a la cama con el cuerpo relajado.",
    ingredientDetails: [
      { name: "Extracto de Té Verde & Ginseng (Energy)", description: "Asociados con la energía equilibrada y el foco sostenido durante el día." },
      { name: "L-Carnitina & Vitaminas B (Energy)", description: "Asociadas con el metabolismo energético normal y la claridad diurna." },
      { name: "Triptófano & Bisglicinato de Magnesio (Sleep)", description: "Asociados con el apoyo a la relajación muscular y la calma nocturna." },
      { name: "Inositol & Glicina (Sleep)", description: "Asociadas con el descanso reparador y la bajada de ritmo." },
    ],
    usageSteps: [
      "Mañana (8:00 AM): Aplica 1 parche Energy en piel limpia y seca (brazo, abdomen o espalda).",
      "Noche (10:00 PM): Retira el parche Energy y aplica 1 parche Sleep 1 hora antes de acostarte.",
      "Mañana siguiente: Retira el parche Sleep. Mantén este hábito constante para acompañar tu rutina diaria.",
    ],
    faq: [
      { q: "¿Puedo usar ambos parches el mismo día?", a: "Sí, están diseñados para acompañar tu día en dos momentos distintos: Energy durante la jornada laboral y Sleep antes de ir a dormir." },
      { q: "¿Tengo un descuento comprando el kit?", a: "Sí, el Ritual Día & Noche incluye un 15% OFF de descuento permanente comparado con la compra individual de ambos sobres." },
      { q: "¿Se pueden suspender o pausar las entregas si elijo suscripción?", a: "Totalmente. Puedes pausar, reprogramar o cancelar las entregas en un solo clic desde tu panel de usuario sin cargos ni compromisos." },
      { q: "¿Interfieren las fórmulas entre sí?", a: "No. Al retirarse el parche Energy por la tarde, la absorción tópica finaliza, permitiendo que el parche Sleep actúe libremente por la noche." },
    ],
  },
  "pack-calma-sueno": {
    tagline: "Calma funcional de tarde y descanso reparador de noche",
    accompaniment: [
      "Zen (Tarde): Acompaña la calma funcional y ayuda a bajar la tensión en momentos de exigencia",
      "Sleep (Noche): Acompaña la bajada de ritmo y la transición al descanso nocturno",
      "Acompaña tu bienestar sin somnolencia diurna y sin cápsulas difíciles de tragar",
      "Ahorro del 15% OFF permanente comparado con la compra individual",
    ],
    howItWorks:
      "El Pack Calma & Sueño acompaña tu bienestar en dos etapas clave del día: por la tarde, Zen aporta nutrientes asociados a la calma funcional para continuar tus tareas con serenidad; por la noche, Sleep facilita la bajada de ritmo para preparar el cuerpo antes de ir a la cama.",
    ingredientDetails: [
      { name: "Triptófano & Taurato de Magnesio (Zen)", description: "Asociados con la calma funcional y la relajación del sistema nervioso durante el día." },
      { name: "Taurina & Extracto de Manzanilla (Zen)", description: "Asociados tradicionalmente con la serenidad y la regulación de la tensión diurna." },
      { name: "Bisglicinato de Magnesio & Inositol (Sleep)", description: "Asociados con la relajación muscular y el apoyo para la bajada de ritmo nocturna." },
      { name: "Glicina, Triptófano & Vitamina B6 (Sleep)", description: "Asociados con el descanso nocturno reparador y la producción natural de serotonina." },
    ],
    usageSteps: [
      "Tarde (4:00 PM - 6:00 PM): Aplica 1 parche Zen en piel limpia y seca (brazo, abdomen o espalda).",
      "Noche (10:00 PM): Retira Zen y aplica 1 parche Sleep 1 hora antes de acostarte.",
      "Mañana siguiente: Retira el parche Sleep. Mantén este hábito constante para acompañar tu rutina diaria.",
    ],
    faq: [
      { q: "¿Zen me va a dar sueño durante el trabajo?", a: "No. Zen acompaña la calma funcional: ayuda a transitar el día con menos tensión encima sin generar somnolencia ni pesadez." },
      { q: "¿Puedo usarlos todos los días?", a: "Sí, están diseñados para uso continuo como parte de tu rutina diaria de autocuidado." },
      { q: "¿Cuál es la diferencia entre Zen y Sleep?", a: "Zen se usa por la tarde para estar presente con serenidad; Sleep se aplica 1h antes de dormir para preparar el descanso nocturno." },
      { q: "¿Puedo pausar o modificar mi suscripción?", a: "Sí, desde tu panel de usuario puedes pausar, reprogramar o cancelar las entregas en cualquier momento con un solo clic." },
    ],
  },
  "pack-glow-balance": {
    tagline: "Nutrición de la piel y equilibrio de tus ritmos: Glow + Woman",
    accompaniment: [
      "Glow (Diario): Acompaña el cuidado de la piel, pelo y uñas desde adentro",
      "Woman (Diario): Acompaña el equilibrio de los ritmos naturales femeninos",
      "Acompaña tu bienestar con colágeno hidrolizado, fitoestrógenos vegetales y antioxidantes",
      "Ahorro del 15% OFF permanente comparado con la compra individual",
    ],
    howItWorks:
      "El Pack Glow & Balance acompaña la rutina de cuidado femenino desde dos ángulos complementarios: por un lado, Glow aporta nutrientes vinculados a la nutrición de la piel desde adentro; por otro, Woman aporta minerales y extractos botánicos asociados al equilibrio de los ritmos femeninos.",
    ingredientDetails: [
      { name: "Colágeno Hidrolizado, Ácido Hialurónico & Biotina (Glow)", description: "Asociados con la hidratación, elasticidad y mantenimiento normal de piel, pelo y uñas." },
      { name: "Vitamina C, Niacinamida & Centella Asiática (Glow)", description: "Asociadas con la protección antioxidante y el cuidado de la piel desde adentro." },
      { name: "Extracto de Soya & Fitoestrógenos (Woman)", description: "Asociados tradicionalmente con el apoyo al equilibrio natural del bienestar femenino." },
      { name: "Bisglicinato de Hierro, Magnesio & Ácido Fólico (Woman)", description: "Asociados con el metabolismo energético normal y el aporte de nutrientes esenciales." },
    ],
    usageSteps: [
      "Mañana: Aplica 1 parche Glow y 1 parche Woman en piel limpia y seca (brazo, abdomen o espalda).",
      "Día: Déjalos actuar durante la jornada mientras sigues con tu rutina normal.",
      "Noche: Retíralos y desecha. Lava suavemente la zona. Mantén el uso diario para acompañar tu bienestar.",
    ],
    faq: [
      { q: "¿Puedo usar dos parches al mismo tiempo?", a: "Sí. La absorción tópica de ambas fórmulas es independiente y están diseñadas para aplicarse simultáneamente." },
      { q: "¿Contienen hormonas sintéticas?", a: "No. Woman contiene únicamente extracto de soya con fitoestrógenos de origen vegetal y nutrientes puros." },
      { q: "¿Glow reemplaza mi rutina de cuidado facial?", a: "No, la complementa. Tu rutina facial actúa por fuera; Glow acompaña la nutrición desde adentro." },
      { q: "¿Puedo pausar o modificar mi suscripción?", a: "Sí, desde tu panel de usuario puedes pausar, reprogramar o cancelar las entregas en cualquier momento con un solo clic." },
    ],
  },
  "pack-trio-vitalidad": {
    tagline: "Cobertura 360° para tu rutina diaria: Energy + Zen + Sleep",
    accompaniment: [
      "Energy (Mañana): Acompaña la claridad mental y el foco sin picos ni caídas de cafeína",
      "Zen (Tarde): Acompaña la calma funcional en momentos de exigencia diurna",
      "Sleep (Noche): Acompaña la bajada de ritmo y la transición hacia un descanso reparador",
      "Ahorro del 20% OFF permanente comparado con la compra individual de los 3 productos",
    ],
    howItWorks:
      "El Trío Vitalidad 360° acompaña cada etapa clave de tu ciclo de 24 horas: por la mañana, Energy libera sus nutrientes de foco; por la tarde, Zen aporta calma funcional para transitar la jornada con serenidad; y por la noche, Sleep prepara el cuerpo para descansar.",
    ingredientDetails: [
      { name: "Extracto de Té Verde, Ginseng & Vitamina B12 (Energy)", description: "Asociados con la energía equilibrada y la claridad mental durante el día." },
      { name: "Triptófano, Taurato de Magnesio & Taurina (Zen)", description: "Asociados con la calma funcional y la relajación del sistema nervioso por la tarde." },
      { name: "Bisglicinato de Magnesio, Inositol & Glicina (Sleep)", description: "Asociados con el apoyo a la relajación muscular y el descanso nocturno reparador." },
      { name: "Vitamina C, B6 & Manzanilla (Multinutrientes)", description: "Asociados con la protección antioxidante y el equilibrio integral del cuerpo." },
    ],
    usageSteps: [
      "8:00 AM (Mañana): Aplica 1 parche Energy para acompañar el inicio de tu jornada.",
      "5:00 PM (Tarde): Aplica 1 parche Zen para acompañar la calma en horas de alta exigencia.",
      "10:00 PM (Noche): Aplica 1 parche Sleep 1 hora antes de acostarte para preparar el descanso.",
    ],
    faq: [
      { q: "¿En qué orden me conviene usar los 3 parches?", a: "Energy por la mañana al despertar, Zen por la tarde en horas de exigencia, y Sleep por la noche 1h antes de dormir." },
      { q: "¿Obtengo un descuento mayor con el Trío?", a: "Sí, el Trío Vitalidad 360° incluye un 20% OFF permanente de descuento respecto a la compra individual de los 3 sobres." },
      { q: "¿Interfieren las fórmulas entre sí?", a: "No. Cada fórmula está pensada para actuar en un momento específico del día acompañando las necesidades de ese momento." },
      { q: "¿Puedo pausar o modificar mi suscripción?", a: "Sí, puedes pausar, reprogramar o cancelar las entregas en cualquier momento desde tu cuenta con un solo clic." },
    ],
  },
};
