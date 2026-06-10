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
    imgSrc: "/products/Energy_thumb.webp",
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
    imgSrc: "/products/Glow_thumb.webp",
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
    imgSrc: "/products/Sleep_thumb.webp",
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
    imgSrc: "/products/Zen_thumb.webp",
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
    imgSrc: "/products/Shield_thumb.webp",
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
    imgSrc: "/products/Woman_thumb.webp",
    color: "#8A3EBE",
    bg: "#F3EBF9",
    taglineColor: "#6B3080",
    quote: '"Escucharte también es una forma de cuidarte."',
    tags: ["Bienestar femenino", "Ritmos naturales"],
  },
};

// Orden de aparición en grillas
export const PRODUCT_ORDER = ["energy", "sleep", "glow", "shield", "zen", "woman"];

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
      { q: "¿Es compatible con anticonceptivos u otra medicación?", a: "Ante cualquier situación particular o tratamiento en curso, lo mejor es consultarlo con un profesional de la salud." },
      { q: "¿Puedo usarlo todos los días?", a: "Sí, está diseñado como un gesto simple que se sostiene en el tiempo, a tu ritmo." },
    ],
  },
};
