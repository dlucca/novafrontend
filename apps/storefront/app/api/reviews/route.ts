import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { currentUser } from "@clerk/nextjs/server";

const DB_PATH = path.join(process.cwd(), "reviews.json");

type Review = {
  id: string;
  slug: string;
  rating: number;
  title: string;
  user: string;
  email: string;
  verified: boolean;
  text: string;
  date: string;
  reply?: {
    text: string;
    date: string;
  } | null;
};

// Initial default reviews adapted to Mexican audience
const DEFAULT_REVIEWS: Review[] = [
  // ── ENERGY ──
  {
    id: "e1",
    slug: "energy",
    rating: 5,
    title: "Energía constante sin temblorina",
    user: "Sofi Valenzuela",
    email: "sofi.v@gmail.com",
    verified: true,
    text: "Probé el parche Energy para mi entrenamiento de la mañana y es una maravilla. Siento un foco mental increíble sin la taquicardia que me daba el pre-workout de antes.",
    date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "e2",
    slug: "energy",
    rating: 5,
    title: "Adiós a la acidez por el café",
    user: "Carlos Méndez",
    email: "charliem@outlook.com",
    verified: true,
    text: "Yo era de tomar 4 tazas de café al día en la oficina y siempre terminaba con acidez a las 4pm. Desde que uso los parches rindo parejo todo el día y ya solo tomo un café por gusto.",
    date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "e3",
    slug: "energy",
    rating: 5,
    title: "Excelente para los días largos",
    user: "Valeria Gómez",
    email: "val.gomez@yahoo.com.mx",
    verified: true,
    text: "Súper discreto para llevar a la oficina. Rindo súper bien y lo mejor es que al quitármelo por la tarde puedo dormir en paz sin quedarme despierta con insomnio.",
    date: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "e4",
    slug: "energy",
    rating: 5,
    title: "Enfoque mental real",
    user: "Andrés Lozano",
    email: "andres.l@gmail.com",
    verified: true,
    text: "Me ha ayudado muchísimo a concentrarme en la tesis. No te da el subidón del café sino una claridad constante que dura horas.",
    date: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "e5",
    slug: "energy",
    rating: 4,
    title: "Buenísimo, solo tarda un poco en iniciar",
    user: "Jorge R.",
    email: "jorge.r@gmail.com",
    verified: true,
    text: "Tarda como unos 30-40 minutos en hacer efecto pero una vez que arranca la energía dura todo el día. Muy cómodo de usar.",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "e6",
    slug: "energy",
    rating: 5,
    title: "Foco y concentración al 100",
    user: "Paulina F.",
    email: "pau.f@gmail.com",
    verified: true,
    text: "Me ha ayudado muchísimo con el enfoque en el trabajo creativo. Siento que mi mente fluye súper rápido y sin distracciones.",
    date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "e7",
    slug: "energy",
    rating: 5,
    title: "Súper recomendado",
    user: "Esteban M.",
    email: "esteban.m@gmail.com",
    verified: true,
    text: "Es increíble cómo un parche tan discreto te mantiene despierto todo el día. Ya no ando bostezando a mitad de la tarde.",
    date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "e8",
    slug: "energy",
    rating: 5,
    title: "Energía de verdad limpia",
    user: "Diego H.",
    email: "diego.h@gmail.com",
    verified: true,
    text: "Lo probé para entrenar y rinde excelente. No te da ese bajón o crash al final del día como las bebidas energéticas.",
    date: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString()
  },

  // ── SLEEP ──
  {
    id: "s1",
    slug: "sleep",
    rating: 5,
    title: "Dormir de corrido y sin pastillas",
    user: "Mariana L.",
    email: "mari.yoga@gmail.com",
    verified: true,
    text: "Me lo pongo una hora antes de dormir y es como un interruptor para apagar el estrés del día. Despierto súper fresca, nada que ver con el atontamiento de las pastillas.",
    date: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "s2",
    slug: "sleep",
    rating: 5,
    title: "Mi insomnio por fin cedió",
    user: "Diego Torres",
    email: "diegot@gmail.com",
    verified: true,
    text: "Tengo insomnio recurrente por la presión del trabajo y Sleep me ayudó a regularizar mi descanso. Increíble que algo tan sencillo funcione tan bien.",
    date: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "s3",
    slug: "sleep",
    rating: 5,
    title: "Calidad de descanso real",
    user: "Clara Domínguez",
    email: "clara.d@gmail.com",
    verified: true,
    text: "Duermo toda la noche de corrido y ya no me despierto cansada por la mañana. Se volvió parte fija de mi rutina nocturna.",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "s4",
    slug: "sleep",
    rating: 5,
    title: "Súper recomendado",
    user: "Fer Medina",
    email: "fer.medina@gmail.com",
    verified: true,
    text: "Lo compré para probar y ahora no puedo dormir sin él. Duermo profundo y el adhesivo es súper suave con la piel, no irrita nada.",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "s5",
    slug: "sleep",
    rating: 4,
    title: "Descanso profundo",
    user: "Paulina S.",
    email: "pau.s@gmail.com",
    verified: true,
    text: "Te relaja súper rápido. A veces si sudo mucho en la noche se llega a despegar un poco, pero el efecto es excelente.",
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "s6",
    slug: "sleep",
    rating: 5,
    title: "Sueño profundo y reparador",
    user: "Chantal R.",
    email: "chantal.r@gmail.com",
    verified: true,
    text: "Me súper ayuda a relajarme y apagar el cerebro por las noches. Duermo de corrido y despierto renovada.",
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "s7",
    slug: "sleep",
    rating: 5,
    title: "Mi básico de cada noche",
    user: "Kelly A.",
    email: "kelly.a@gmail.com",
    verified: true,
    text: "Es indispensable en mi rutina de descanso. Ya no tengo que tomar melatonina en gomitas o gotas.",
    date: new Date(Date.now() - 35 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "s8",
    slug: "sleep",
    rating: 5,
    title: "Mente tranquila, mejor descanso",
    user: "Andrea L.",
    email: "andrea.l@gmail.com",
    verified: true,
    text: "Te relaja el cuerpo y desconecta la mente súper rápido. Un cambio total en la calidad de mi sueño.",
    date: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString()
  },

  // ── ZEN ──
  {
    id: "z1",
    slug: "zen",
    rating: 5,
    title: "Calma mental en la oficina",
    user: "Gaby Herrera",
    email: "gaby.mind@gmail.com",
    verified: true,
    text: "Para los días en que todo explota en la oficina, Zen me mantiene centrada sin darme sueño. Calma real para poder seguir rindiendo sin tensión.",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "z2",
    slug: "zen",
    rating: 5,
    title: "Súper ayuda con la ansiedad",
    user: "Esteban Ruiz",
    email: "esteban.dev@gmail.com",
    verified: true,
    text: "Soy programador y la ansiedad antes de un release me mataba. Zen me ayuda a enfocarme en una tarea a la vez sin sentir la presión constante.",
    date: new Date(Date.now() - 9 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "z3",
    slug: "zen",
    rating: 5,
    title: "Paz en los días caóticos",
    user: "Lucía Pérez",
    email: "lu_perez@gmail.com",
    verified: true,
    text: "El equilibrio perfecto para llevar el día a día. Ya no ando reactiva a todo y me siento mucho más tranquila en la rutina diaria.",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "z4",
    slug: "zen",
    rating: 5,
    title: "Adiós al estrés diario",
    user: "Vero T.",
    email: "vero.t@gmail.com",
    verified: true,
    text: "Me mantiene súper tranquila pero activa y con foco. Lo uso los días de juntas largas y me ha cambiado el humor por completo.",
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "z5",
    slug: "zen",
    rating: 5,
    title: "Calma real y natural",
    user: "Rulo M.",
    email: "rulo.m@gmail.com",
    verified: true,
    text: "Excelente para el ritmo de vida acelerado. Te quita esa opresión en el pecho del estrés sin darte nada de sueño.",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "z6",
    slug: "zen",
    rating: 5,
    title: "Súper útil para la ansiedad",
    user: "Caro V.",
    email: "caro.v@gmail.com",
    verified: true,
    text: "Me ayuda a tomarme las cosas con mucha más calma y paciencia. Es un gran aliado diario.",
    date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  },

  // ── GLOW ──
  {
    id: "gl1",
    slug: "glow",
    rating: 5,
    title: "Skincare desde adentro hacia afuera",
    user: "Dania Ortiz",
    email: "dania.beauty@gmail.com",
    verified: true,
    text: "Llevo 3 semanas usándolo a diario y el cambio en la hidratación de la piel se nota muchísimo. Es skincare facilísimo de sostener.",
    date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "gl2",
    slug: "glow",
    rating: 5,
    title: "Mejor que las gomitas de colágeno",
    user: "Sofía Ruiz",
    email: "sofiaruiz@gmail.com",
    verified: true,
    text: "Amé el formato parche porque siempre me olvidaba de tomar las gomitas o cápsulas. Este me lo pego por la mañana y me olvido por completo.",
    date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "gl3",
    slug: "glow",
    rating: 5,
    title: "Piel más luminosa",
    user: "Ana Karen",
    email: "karen_glow@gmail.com",
    verified: true,
    text: "Piel luminosa y cero fricción en mi rutina. Mi parche favorito definitivo de la línea, se adhiere súper bien y no molesta nada.",
    date: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "gl4",
    slug: "glow",
    rating: 5,
    title: "¡Los amo con locura!",
    user: "Karina A.",
    email: "karina.a@gmail.com",
    verified: true,
    text: "Es mi tercer pedido y siento mi piel muchísimo mejor. Ya son parte indispensable de mi rutina diaria de autocuidado.",
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "gl5",
    slug: "glow",
    rating: 5,
    title: "Rutina de belleza simplificada",
    user: "Olivia M.",
    email: "olivia.m@gmail.com",
    verified: true,
    text: "Quería algo fácil para mejorar mi piel sin tener que hacer rutinas eternas de 10 pasos. En pocas semanas mi piel se ve mucho más luminosa.",
    date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "gl6",
    slug: "glow",
    rating: 5,
    title: "Brillo saludable sin esfuerzo",
    user: "Sofía P.",
    email: "sofia.p@gmail.com",
    verified: true,
    text: "Ha sido una adición espectacular a mi día. Es súper cómodo de llevar y noto mi piel mucho más suave y con un brillo natural muy lindo.",
    date: new Date(Date.now() - 42 * 24 * 60 * 60 * 1000).toISOString()
  },

  // ── SHIELD ──
  {
    id: "sh1",
    slug: "shield",
    rating: 5,
    title: "Prevención súper práctica",
    user: "Patricia V.",
    email: "paty_wellness@gmail.com",
    verified: true,
    text: "Con las rutinas tan exigentes que llevo entre el gym y el trabajo, Shield es mi hábito constante de prevención. Súper práctico y discreto.",
    date: new Date(Date.now() - 6 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sh2",
    slug: "shield",
    rating: 5,
    title: "Excelente para el cambio de clima",
    user: "Mauricio F.",
    email: "mau_coach@gmail.com",
    verified: true,
    text: "Ideal para cambios de estación cuando todos se enferman a mi alrededor. Un gesto de cuidado diario que se integra solo.",
    date: new Date(Date.now() - 12 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sh3",
    slug: "shield",
    rating: 5,
    title: "Cómodo y seguro",
    user: "Elena Soto",
    email: "elena_soto@gmail.com",
    verified: true,
    text: "Cuidado diario sin sumar cápsulas a mi cajón de suplementos. Hipoalergénico y muy cómodo de usar incluso haciendo ejercicio.",
    date: new Date(Date.now() - 25 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sh4",
    slug: "shield",
    rating: 5,
    title: "¡Refuerzo de defensas real!",
    user: "Brenda P.",
    email: "brenda.p@gmail.com",
    verified: true,
    text: "Realmente me ha ayudado muchísimo con mis defensas. Antes me enfermaba a cada rato por los cambios de clima y ahora me siento súper fuerte.",
    date: new Date(Date.now() - 32 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sh5",
    slug: "shield",
    rating: 5,
    title: "Ideal para la época de frío",
    user: "Juan R.",
    email: "juan.r@gmail.com",
    verified: true,
    text: "Me encanta la comodidad de estos parches. Son perfectos para el invierno cuando todos a mi alrededor andan con gripe.",
    date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "sh6",
    slug: "shield",
    rating: 5,
    title: "Me siento mucho mejor",
    user: "Oscar M.",
    email: "oscar.m@gmail.com",
    verified: true,
    text: "Los uso desde hace unos meses y he sentido una gran mejoría en mi bienestar general. Excelente calidad.",
    date: new Date(Date.now() - 50 * 24 * 60 * 60 * 1000).toISOString()
  },

  // ── WOMAN ──
  {
    id: "w1",
    slug: "woman",
    rating: 5,
    title: "Alivio real en mis días",
    user: "Renata B.",
    email: "ren_bienestar@gmail.com",
    verified: true,
    text: "Woman me acompaña increíble durante mis días más sensibles del ciclo. Es un alivio natural, sin forzar mis ritmos ni medicalizar mi rutina.",
    date: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "w2",
    slug: "woman",
    rating: 5,
    title: "Equilibrio cíclico",
    user: "Gaby Castillo",
    email: "gabcastillo@gmail.com",
    verified: true,
    text: "Me encanta que respeta la ciclicidad de mi cuerpo. Me lo pongo todos los días y siento que transito el mes de forma mucho más equilibrada.",
    date: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "w3",
    slug: "woman",
    rating: 5,
    title: "Autocuidado sin hormonas",
    user: "Lorena M.",
    email: "lore_health@gmail.com",
    verified: true,
    text: "Un gesto de autocuidado real y libre de hormonas. Se nota la diferencia a las pocas semanas, sobre todo en la inflamación.",
    date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "w4",
    slug: "woman",
    rating: 5,
    title: "Un milagro en parche",
    user: "Elena M.",
    email: "elena.m@gmail.com",
    verified: true,
    text: "Ha hecho una diferencia increíble en mis síntomas menstruales. La inflamación, los cólicos y los cambios de humor disminuyeron muchísimo.",
    date: new Date(Date.now() - 22 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "w5",
    slug: "woman",
    rating: 5,
    title: "Menos cólicos y malestar",
    user: "Sarah K.",
    email: "sarah.k@gmail.com",
    verified: true,
    text: "Con el uso regular he notado que los dolores premenstruales y cólicos fuertes bajaron muchísimo. De verdad funciona excelente.",
    date: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: "w6",
    slug: "woman",
    rating: 5,
    title: "Mi aliado para el SPM",
    user: "Mónica G.",
    email: "monica.g@gmail.com",
    verified: true,
    text: "Me ayuda muchísimo a regular el humor y la irritabilidad cuando entra el SPM. Dura todo el día puesto y es comodísimo.",
    date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString()
  }
];

let reviewsCache: Review[] | null = null;

function getReviews(): Review[] {
  if (reviewsCache) return reviewsCache;
  if (!fs.existsSync(DB_PATH)) {
    try {
      fs.writeFileSync(DB_PATH, JSON.stringify(DEFAULT_REVIEWS, null, 2));
    } catch (e) {
      console.warn("Skipping reviews.json persistence on read-only server filesystem:", e);
    }
    reviewsCache = DEFAULT_REVIEWS;
    return DEFAULT_REVIEWS;
  }
  try {
    const fileContent = fs.readFileSync(DB_PATH, "utf-8");
    reviewsCache = JSON.parse(fileContent);
    return reviewsCache || DEFAULT_REVIEWS;
  } catch (e) {
    reviewsCache = DEFAULT_REVIEWS;
    return DEFAULT_REVIEWS;
  }
}

function saveReviews(reviews: Review[]) {
  reviewsCache = reviews;
  try {
    fs.writeFileSync(DB_PATH, JSON.stringify(reviews, null, 2));
  } catch (e) {
    console.error("Failed to write reviews.json (expected in read-only environment):", e);
  }
}

function getAdminStatus(userEmail: string | undefined): boolean {
  if (!userEmail) return false;
  const normalized = userEmail.toLowerCase();
  return (
    normalized.endsWith("@novapatch.care") ||
    normalized === "esteban.mendezcasariego@gmail.com"
  );
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const slug = searchParams.get("slug");
  const reviews = getReviews();

  if (slug) {
    const filtered = reviews.filter((r) => r.slug === slug);
    return NextResponse.json(filtered);
  }

  return NextResponse.json(reviews);
}

export async function POST(request: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "Debe iniciar sesión para dejar una opinión" }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { slug, rating, title, text } = body;

    if (!slug || !rating || !title || !text) {
      return NextResponse.json({ error: "Faltan campos obligatorios" }, { status: 400 });
    }

    const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
    const user = `${clerkUser.firstName ?? ""} ${clerkUser.lastName ?? ""}`.trim() || "Cliente verificado";

    const reviews = getReviews();
    const newReview: Review = {
      id: Math.random().toString(36).substring(2, 9),
      slug,
      rating: Number(rating),
      title,
      user,
      email,
      verified: true,
      text,
      date: new Date().toISOString()
    };

    reviews.unshift(newReview);
    saveReviews(reviews);

    return NextResponse.json(newReview);
  } catch (e) {
    return NextResponse.json({ error: "Error interno al guardar la opinión" }, { status: 500 });
  }
}

export async function PUT(request: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  if (!getAdminStatus(email)) {
    return NextResponse.json({ error: "No autorizado. Requiere rol Administrador" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { action, reviewId, text } = body;

    const reviews = getReviews();
    const reviewIdx = reviews.findIndex((r) => r.id === reviewId);

    if (reviewIdx === -1) {
      return NextResponse.json({ error: "Opinión no encontrada" }, { status: 404 });
    }

    if (action === "reply") {
      reviews[reviewIdx].reply = {
        text,
        date: new Date().toISOString()
      };
      saveReviews(reviews);
      return NextResponse.json(reviews[reviewIdx]);
    }

    return NextResponse.json({ error: "Acción inválida" }, { status: 400 });
  } catch (e) {
    return NextResponse.json({ error: "Error procesando la solicitud" }, { status: 500 });
  }
}

export async function DELETE(request: Request) {
  const clerkUser = await currentUser();
  if (!clerkUser) {
    return NextResponse.json({ error: "No autorizado" }, { status: 401 });
  }

  const email = clerkUser.emailAddresses[0]?.emailAddress ?? "";
  if (!getAdminStatus(email)) {
    return NextResponse.json({ error: "No autorizado. Requiere rol Administrador" }, { status: 403 });
  }

  const { searchParams } = new URL(request.url);
  const id = searchParams.get("id");

  if (!id) {
    return NextResponse.json({ error: "Falta ID de opinión" }, { status: 400 });
  }

  const reviews = getReviews();
  const filtered = reviews.filter((r) => r.id !== id);

  if (reviews.length === filtered.length) {
    return NextResponse.json({ error: "Opinión no encontrada" }, { status: 404 });
  }

  saveReviews(filtered);
  return NextResponse.json({ success: true });
}
