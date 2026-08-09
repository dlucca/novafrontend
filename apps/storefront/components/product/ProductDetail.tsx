"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { useUser } from "@clerk/nextjs";
import { useCart } from "@/contexts/CartContext";
import { trackMeta } from "@/lib/meta";
import { formatPrice } from "@/lib/format";
import type { ProductDetail as ProductDetailData, PurchaseOption } from "@/lib/commerce";
import {
  PRODUCT_META,
  PDP_META,
  SUBSCRIPTION_PERKS,
  HOW_IT_WORKS_INTRO,
  type ProductMeta,
  type PdpMeta,
} from "@/lib/product-meta";
import RealSocialReviews, { Review } from "@/components/product/RealSocialReviews";
import UgcMarquee from "@/components/product/UgcMarquee";

const sectionReveal = {
  initial: { opacity: 0, y: 24 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: "-80px" },
  transition: { duration: 0.5, ease: "easeOut" as const },
};

type MediaItem = 
  | { type: "image"; src: string }
  | { type: "video"; src: string; thumbnail: string };

function Gallery({
  media,
  title,
  bg,
  accent,
}: {
  media: MediaItem[];
  title: string;
  bg: string;
  accent: string;
}) {
  const [active, setActive] = useState(0);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const prev = () => setActive((a) => (a - 1 + media.length) % media.length);
  const next = () => setActive((a) => (a + 1) % media.length);

  useEffect(() => {
    if (videoRef.current) {
      if (media[active]?.type === "video") {
        videoRef.current.play().catch(() => {});
      } else {
        videoRef.current.pause();
      }
    }
  }, [active, media]);

  return (
    <div>
      <div
        className="relative aspect-[4/5] w-full overflow-hidden rounded-[24px]"
        style={{ background: bg }}
      >
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            className="absolute inset-0 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {media[active].type === "image" ? (
              <Image
                src={media[active].src}
                alt={`${title} — imagen ${active + 1}`}
                fill
                priority={active === 0}
                sizes="(max-width: 1024px) 100vw, 50vw"
                className="object-contain p-3 sm:p-1"
              />
            ) : (
              <div className="relative w-full h-full">
                <video
                  ref={videoRef}
                  src={media[active].src}
                  loop
                  muted={isMuted}
                  playsInline
                  autoPlay
                  onClick={() => {
                    if (videoRef.current) {
                      if (videoRef.current.paused) {
                        videoRef.current.play();
                      } else {
                        videoRef.current.pause();
                      }
                    }
                  }}
                  className="w-full h-full object-cover cursor-pointer"
                />
                
                {/* Mute/unmute button */}
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    setIsMuted(!isMuted);
                  }}
                  className="absolute bottom-4 right-4 z-[2] flex h-9 w-9 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition active:scale-95"
                >
                  {isMuted ? (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: "16px", height: "16px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M17.25 9.75L19.5 12m0 0l2.25 2.25M19.5 12l2.25-2.25M19.5 12l-2.25 2.25m-10.5-6L4.5 9H1.5v6h3l4.5 3.75V5.25z" />
                    </svg>
                  ) : (
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: "16px", height: "16px" }}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.756 3.63 8.25 4.51 8.25H6.75z" />
                    </svg>
                  )}
                </button>
                
                {/* Visual indicator that it's a video */}
                <div className="absolute top-4 left-4 z-[2] flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-bold text-white uppercase tracking-wider backdrop-blur-sm">
                  <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                  Video UGC
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
        {media.length > 1 && (
          <>
            <button
              onClick={prev}
              aria-label="Media anterior"
              className="absolute left-3 top-1/2 z-[1] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0D1B35] shadow-[0_2px_10px_rgba(13,27,53,0.12)] transition hover:bg-white active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ width: "18px", height: "18px" }}>
                <path d="M15 5l-7 7 7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
            <button
              onClick={next}
              aria-label="Media siguiente"
              className="absolute right-3 top-1/2 z-[1] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/90 text-[#0D1B35] shadow-[0_2px_10px_rgba(13,27,53,0.12)] transition hover:bg-white active:scale-95"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true" style={{ width: "18px", height: "18px" }}>
                <path d="M9 5l7 7-7 7" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </button>
          </>
        )}
      </div>
      {media.length > 1 && (
        <div
          className="mt-4 grid gap-3 justify-center md:justify-start"
          style={{ gridTemplateColumns: `repeat(${media.length}, minmax(0, 1fr))` }}
        >
          {media.map((item, i) => (
            <button
              key={i}
              onClick={() => setActive(i)}
              aria-label={`Ver media ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-[4/5] w-full max-w-[110px] overflow-hidden rounded-2xl border-2 transition-all duration-200 group ${
                i === active 
                  ? 'border-black scale-105 shadow-md' 
                  : 'border-transparent hover:border-gray-300'
              }`}
              style={{
                background: bg,
              }}
            >
              <Image 
                src={item.type === "image" ? item.src : item.thumbnail} 
                alt={`${title} vista ${i + 1}`}
                fill 
                sizes="120px"
                className="object-cover" 
              />
              
              {/* Play icon overlay on the video thumbnail */}
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group hover:bg-black/30 transition">
                  <div className="flex h-7 w-7 items-center justify-center rounded-full bg-white/90 text-[#0D1B35] shadow-md transition group-hover:scale-110">
                    <svg className="w-3 h-3 ml-0.5" fill="currentColor" viewBox="0 0 24 24" style={{ width: "12px", height: "12px" }}>
                      <path d="M8 5v14l11-7z" />
                    </svg>
                  </div>
                </div>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TierSelector({
  options,
  selected,
  onSelect,
  currency,
  color,
  bg,
}: {
  options: PurchaseOption[];
  selected: PurchaseOption;
  onSelect: (o: PurchaseOption) => void;
  currency: string;
  color: string;
  bg: string;
}) {
  return (
    <div>
      <p className="mb-3 text-sm font-semibold text-[#0D1B35]">¿Cómo quieres recibirlo?</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((o) => {
          const isActive = o.tier === selected.tier;
          return (
            <button
              key={o.tier}
              onClick={() => onSelect(o)}
              aria-pressed={isActive}
              className="rounded-2xl border-2 px-3 py-3 text-left transition"
              style={{
                // Neutros cálidos (cream) en reposo; el tier activo toma un velo del tint del producto
                borderColor: isActive ? color : "#E7E1D6",
                background: isActive ? `color-mix(in srgb, ${bg} 45%, #fff)` : "#FCFAF6",
                boxShadow: isActive ? "0 4px 16px rgba(13,27,53,0.08)" : "none",
              }}
            >
              <span className="block text-xs font-semibold text-[#0D1B35]">{o.label}</span>
              <span className="mt-1 block text-lg font-extrabold text-[#0D1B35]">
                {formatPrice(o.price, currency)}
              </span>
              {o.discountPct > 0 && (
                <span className="mt-0.5 block text-[11px] font-bold" style={{ color }}>
                  {o.discountPct}% OFF
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

function Eyebrow({ children, color }: { children: React.ReactNode; color: string }) {
  return (
    <p
      className="text-[11px] font-semibold uppercase tracking-[0.18em]"
      style={{ color }}
    >
      {children}
    </p>
  );
}

function FaqAccordion({ faq, accent }: { faq: PdpMeta["faq"]; accent: string }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="space-y-3">
      {faq.map((item, i) => (
        <div key={item.q} className="overflow-hidden rounded-2xl bg-white shadow-sm">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            aria-controls={`faq-panel-${i}`}
            className="flex w-full items-center justify-between px-6 py-4 text-left"
          >
            <span className="text-sm font-bold text-[#0D1B35]">{item.q}</span>
            <span
              className="ml-4 text-xl leading-none transition-transform"
              style={{
                transform: open === i ? "rotate(45deg)" : "none",
                color: open === i ? accent : "rgba(13,27,53,0.45)",
              }}
            >
              +
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                id={`faq-panel-${i}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25 }}
              >
                <p className="px-6 pb-5 text-sm leading-6 text-[#425066]">{item.a}</p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      ))}
    </div>
  );
}

const QUICK_FAQS: Record<string, { q: string; a: string }[]> = {
  energy: [
    {
      q: "¿Cuándo empiezo a sentir el efecto?",
      a: "La liberación de los ingredientes es gradual. La mayoría de las personas empieza a notar el foco y la claridad sostenida dentro de los primeros 30 a 45 minutos de aplicación."
    },
    {
      q: "¿Me va a quitar el sueño por la noche?",
      a: "Está pensado para acompañar tu energía durante el día. Al retirarlo por la noche, la liberación se corta y no interfiere con tu descanso."
    },
    {
      q: "¿Es seguro usarlo todos los días?",
      a: "Sí, está diseñado para uso diario y constante. El adhesivo es hipoalergénico (libre de látex) y sus extractos son de alta pureza."
    }
  ],
  sleep: [
    {
      q: "¿Cuándo empiezo a sentir el efecto?",
      a: "Recomendamos aplicarlo 1 hora antes de acostarte. Sentirás cómo tu cuerpo empieza a bajar el ritmo de forma natural y relajada."
    },
    {
      q: "¿Da somnolencia al despertar?",
      a: "No. Al no contener somníferos químicos pesados, despiertas con una sensación de descanso real, sin el 'efecto resaca' común de las pastillas."
    },
    {
      q: "¿Es seguro usarlo todas las noches?",
      a: "Sí, está formulado para acompañar tu descanso diario sin generar dependencia ni habituación."
    }
  ],
  zen: [
    {
      q: "¿Me dará sueño durante el día?",
      a: "No. Zen ofrece 'calma funcional', ayudando a reducir la tensión mental y a ordenar el foco de atención sin darte sueño ni desconectarte."
    },
    {
      q: "¿Cuándo empiezo a sentirlo?",
      a: "La absorción transdérmica gradual actúa entre 30 y 45 minutos tras la colocación."
    },
    {
      q: "¿Puedo usarlo todos los días?",
      a: "Sí, ideal para sostener la presencia y calmar la tensión en días de alta demanda mental."
    }
  ],
  glow: [
    {
      q: "¿En cuánto tiempo se notan los resultados?",
      a: "Glow es un proceso de renovación constante de la piel desde adentro, empezando a notarse a las pocas semanas de uso regular diario."
    },
    {
      q: "¿Se puede combinar con otros parches?",
      a: "Sí, no interfiere con otros parches de la línea. Podés combinarlos según tus necesidades diarias."
    },
    {
      q: "¿Se cae con las cremas de skincare?",
      a: "Para asegurar adherencia, aplícalo en piel limpia y seca (brazo, abdomen o espalda) antes de colocar cremas tópicas."
    }
  ],
  shield: [
    {
      q: "¿Es para usar cuando ya me siento mal?",
      a: "No, Shield es cuidado preventivo y constante. Se usa a diario para acompañar tus defensas naturales antes de que algo pase."
    },
    {
      q: "¿Es resistente al agua y ejercicio?",
      a: "Sí, el adhesivo hipoalergénico resiste la ducha, el sudor y el ejercicio diario."
    },
    {
      q: "¿Se puede usar de forma continua?",
      a: "Sí, ideal para integrar de forma constante en cambios de estación y rutinas intensas."
    }
  ],
  woman: [
    {
      q: "¿Cómo ayuda a mi ciclo?",
      a: "Acompaña el bienestar femenino sin medicalizar ni alterar tus ciclos naturales, aportando nutrientes y extractos botánicos seleccionados."
    },
    {
      q: "¿Cuándo se debe usar?",
      a: "Es de uso diario y constante para mantener la estabilidad a lo largo de todas las fases del ciclo."
    },
    {
      q: "¿Tiene hormonas sintéticas?",
      a: "No, es 100% libre de hormonas sintéticas, utilizando fitoestrógenos naturales y bisglicinatos de alta absorción."
    }
  ]
};

export default function ProductDetail({
  product,
  currency,
}: {
  product: ProductDetailData;
  currency: string;
}) {
  const { addToCart } = useCart();
  const { user, isLoaded } = useUser();

  // Reviews state and fetch logic for header and component sync
  const [reviews, setReviews] = useState<Review[]>([]);
  const [reviewsLoading, setReviewsLoading] = useState(true);

  const loadReviews = async () => {
    try {
      const res = await fetch(`/api/reviews?slug=${product.slug}`);
      if (res.ok) {
        const data = await res.json();
        setReviews(data);
      }
    } catch (e) {
      console.error("Error loading reviews", e);
    } finally {
      setReviewsLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, [product.slug]);

  const totalCount = reviews.length;
  const averageRating = totalCount
    ? Number((reviews.reduce((sum, r) => sum + r.rating, 0) / totalCount).toFixed(1))
    : 5.0;

  // Meta ViewContent — se dispara una vez al abrir la PDP, esperando a que
  // Clerk resuelva para adjuntar identidad (mejor match quality en CAPI).
  const viewTracked = useRef(false);
  useEffect(() => {
    if (!isLoaded || viewTracked.current) return;
    viewTracked.current = true;
    const defaultOption =
      product.options.find((o) => o.tier === "monthly") ?? product.options[0];
    trackMeta(
      "ViewContent",
      {
        currency,
        value: product.basePrice,
        content_ids: [defaultOption?.variantId ?? product.slug],
        content_name: product.title,
        content_type: "product",
      },
      {
        email: user?.primaryEmailAddress?.emailAddress,
        phone: user?.primaryPhoneNumber?.phoneNumber ?? undefined,
        firstName: user?.firstName ?? undefined,
        lastName: user?.lastName ?? undefined,
        externalId: user?.id,
      },
    );
  }, [isLoaded, user, product, currency]);

  const meta: ProductMeta | undefined = PRODUCT_META[product.slug];
  const pdp: PdpMeta | undefined = PDP_META[product.slug];
  const color = meta?.color ?? "var(--color-coral)";
  const bg = meta?.bg ?? "#FFFFFF";
  // Shade del producto para texto/acentos sobre fondos claros (mejor contraste que el base)
  const accent = meta?.taglineColor ?? color;
  // La galería muestra la primera imagen, un video UGC local en el 2º slot,
  // y el resto de las imágenes.
  const mediaList = [
    { type: "image" as const, src: product.images[0] },
    { type: "video" as const, src: "/videos/ugc_galeria.mp4", thumbnail: "/comunidad/9.webp" },
    ...product.images.slice(1, 5).map((img) => ({ type: "image" as const, src: img }))
  ];
  const lifestyleA = meta?.howItWorksImage;         // Imagen seccion Como funciona
  const lifestyleB = "/productusers/FAQ_image.webp";                   // Imagen FIJA para FAQ

  // Default: Compra única (freq === null)
  const [selected, setSelected] = useState<PurchaseOption>(
    product.options.find((o) => o.freq === null) ?? product.options[0]
  );
  const [openMiniFaq, setOpenMiniFaq] = useState<number | null>(null);

  const handleAdd = (option: PurchaseOption) => {
    addToCart({
      slug: product.slug,
      title: product.title,
      image: product.images[0],
      price: product.basePrice,
      color,
      bg,
      mode: option.freq === null ? "once" : "sub",
      freq: option.freq ?? 30,
      variantId: option.variantId,
    });
  };

  const ctaLabel =
    selected.freq === null
      ? `Comprar ahora · ${formatPrice(selected.price, currency)}`
      : `Suscribirme · cada ${selected.freq} días`;

  return (
    <main className="min-h-screen bg-[#FAF7F2]">
      {/* ── Hero: galería + info ── */}
      <section className="mx-auto grid max-w-6xl gap-10 px-6 pt-28 pb-16 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 self-start">
          <Gallery media={mediaList} title={product.title} bg={bg} accent={accent} />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-5xl font-black" style={{ color }}>
            {product.title}
          </h1>
          <a
            href="#reviews-section"
            className="group flex items-center gap-1.5 mt-2 self-start text-[13px] font-bold text-[#0D1B35]/70 hover:text-[#0D1B35] transition-all duration-300"
          >
            <div className="flex text-[#F59E0B] tracking-tight group-hover:scale-105 transition-transform duration-300">
              {"★".repeat(Math.round(averageRating))}
              {"☆".repeat(5 - Math.round(averageRating))}
            </div>
            <span>{averageRating}</span>
            <span className="text-[#0D1B35]/40 font-normal">|</span>
            <span className="underline decoration-black/20 group-hover:decoration-black transition-colors">
              {totalCount} opiniones reales
            </span>
          </a>
          {pdp && (
            <p className="mt-4 text-lg font-semibold text-[#0D1B35]">{pdp.tagline}</p>
          )}
          <p className="mt-4 max-w-md text-sm leading-6 text-[#425066]">
            {product.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {/* Solid badge indicating patch count */}
            <span
              className="rounded-full px-3 py-1 text-xs font-bold text-white shadow-sm flex items-center gap-1"
              style={{ backgroundColor: color }}
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24" style={{ width: "12px", height: "12px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              30 parches por sobre
            </span>

            {/* Outlined benefit tags */}
            {meta?.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border px-3 py-1 text-xs font-semibold"
                style={{ borderColor: color, color }}
              >
                {tag}
              </span>
            ))}
          </div>

          <div className="mt-8">
            <TierSelector
              options={product.options}
              selected={selected}
              onSelect={setSelected}
              currency={currency}
              color={color}
              bg={bg}
            />
          </div>

          {/* Grilla de Trust Badges Premium (Encima del CTA) */}
          <div className="grid grid-cols-2 gap-3 mt-6 mb-2">
            {[
              {
                title: "Pioneros en México",
                desc: "Primera marca de parches de bienestar",
                icon: (
                  <svg className="w-5 h-5 flex-shrink-0" width="20" height="20" style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 01-1.043 3.296 3.745 3.745 0 01-3.296 1.043A3.745 3.745 0 0112 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 01-3.296-1.043 3.745 3.745 0 01-1.043-3.296A3.745 3.745 0 013 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 011.043-3.296 3.746 3.746 0 013.296-1.043A3.746 3.746 0 0112 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 013.296 1.043 3.746 3.746 0 011.043 3.296A3.745 3.745 0 0121 12z" />
                  </svg>
                ),
              },
              {
                title: "Fórmula Limpia",
                desc: "100% Vegano · Sin gluten · Sin azúcar",
                icon: (
                  <svg className="w-5 h-5 flex-shrink-0" width="20" height="20" style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24">
                    <path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L21 12l-5.813-1.912a2 2 0 0 1-1.275-1.275L12 3Z" />
                  </svg>
                ),
              },
              {
                title: "Ingredientes Naturales",
                desc: "Extractos botánicos de alta pureza y absorción",
                icon: (
                  <svg className="w-5 h-5 flex-shrink-0" width="20" height="20" style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2 22C2 22 2.5 16.5 8 11.5M8 11.5C11.5 8 16.5 7.5 22 7.5C22 7.5 21.5 13 18 16.5C14.5 20 8.5 20 8.5 20L2 22M8 11.5c-3 3-5 7.5-6 10.5" />
                  </svg>
                ),
              },
              {
                title: "Compra Asegurada",
                desc: "30 días de garantía total + Envío GRATIS",
                icon: (
                  <svg className="w-5 h-5 flex-shrink-0" width="20" height="20" style={{ width: "20px", height: "20px" }} fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.57-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" />
                  </svg>
                ),
              },
            ].map((b, idx) => (
              <div
                key={idx}
                className="flex flex-col gap-1.5 p-3 rounded-2xl border border-black/[0.03] transition-all duration-300 hover:shadow-sm"
                style={{
                  background: `color-mix(in srgb, ${bg} 25%, #fff)`,
                  borderColor: `color-mix(in srgb, ${color} 10%, transparent)`,
                }}
              >
                <div className="flex items-center gap-2" style={{ color: accent }}>
                  {b.icon}
                  <span className="text-[12px] font-black tracking-tight">{b.title}</span>
                </div>
                <p className="text-[10px] leading-tight text-[#425066] font-medium">{b.desc}</p>
              </div>
            ))}
          </div>

          <button
            onClick={() => handleAdd(selected)}
            className="mt-6 w-full rounded-full py-4 text-base font-bold text-white transition hover:opacity-90"
            style={{ background: color }}
          >
            {ctaLabel}
          </button>
          {selected.freq === null ? (
            <p className="mt-3 text-center text-xs text-[#0D1B35]/55">
              Envío GRATIS · Llega en 2-4 días hábiles · 30 días de garantía total con tu primer pedido
            </p>
          ) : (
            <p className="mt-3 text-center text-xs font-bold text-[#1E7D4F]">
              Ahorras {formatPrice(product.basePrice - selected.price, currency)} · Pausa/cancela cuando quieras · Sin penalizaciones · Envío GRATIS siempre
            </p>
          )}

          {/* Mini-FAQ interactivo (acordeón de 3 preguntas clave) */}
          {QUICK_FAQS[product.slug] && (
            <div className="mt-8 border-t border-[#0D1B35]/10 pt-6">
              <div className="space-y-2.5">
                {QUICK_FAQS[product.slug].map((item, idx) => {
                  const isOpen = openMiniFaq === idx;
                  return (
                    <div
                      key={idx}
                      className="border-b border-[#0D1B35]/5 pb-2.5 last:border-0 last:pb-0"
                    >
                      <button
                        onClick={() => setOpenMiniFaq(isOpen ? null : idx)}
                        className="flex w-full items-center justify-between text-left text-sm font-semibold text-[#0D1B35] hover:text-black transition-colors py-1.5"
                      >
                        <span>{item.q}</span>
                        <span
                          className="text-base leading-none transition-transform duration-200"
                          style={{
                            transform: isOpen ? "rotate(45deg)" : "none",
                            color: isOpen ? accent : "rgba(13,27,53,0.35)",
                          }}
                        >
                          +
                        </span>
                      </button>
                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.2, ease: "easeInOut" }}
                            className="overflow-hidden"
                          >
                            <p className="mt-2 text-xs leading-relaxed text-[#425066] font-medium">
                              {item.a}
                            </p>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* ── Perks de suscripción — solo si hay un tier de suscripción elegido ── */}
      <AnimatePresence initial={false}>
        {selected.freq !== null && (
          <motion.section
            key="subscription-perks"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{
              height: { duration: 0.4, ease: [0.4, 0, 0.2, 1] },
              opacity: { duration: 0.25, ease: "easeOut" },
            }}
            className="overflow-hidden border-y border-[#E8E2D8] bg-[#FAF7F2]"
          >
            <motion.div
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="mx-auto grid max-w-6xl gap-8 px-6 py-10 sm:grid-cols-3"
            >
              {SUBSCRIPTION_PERKS.map((perk) => (
                <div key={perk.title}>
                  <p className="text-sm font-bold" style={{ color }}>
                    {perk.title}
                  </p>
                  <p className="mt-1 text-xs leading-5 text-[#425066]">{perk.description}</p>
                </div>
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

      {/* ── UgcMarquee — carrusel de fotos reales ── */}
      <UgcMarquee accent={accent} />

      {pdp && (
        <>
          {/* ── ¿Cómo te acompaña? — heading lateral + lista con divisores ── */}
          <motion.section {...sectionReveal} className="bg-white py-24">
            <div className="mx-auto max-w-6xl px-6 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5">
                <Eyebrow color={accent}>{product.title} · todos los días</Eyebrow>
                <h2 className="mt-3 text-[clamp(28px,3vw,40px)] font-black leading-tight text-[#0D1B35]">
                  ¿Cómo te acompaña?
                </h2>
                {meta?.quote && (
                  <p className="mt-5 max-w-xs text-lg font-medium italic leading-snug" style={{ color: accent }}>
                    {meta.quote}
                  </p>
                )}
              </div>
              <div className="lg:col-span-7">
                {pdp.accompaniment.map((item, i) => (
                  <div
                    key={item}
                    className="flex items-baseline gap-5 border-b py-5 first:pt-1"
                    style={{ borderColor: `color-mix(in srgb, ${accent} 22%, transparent)` }}
                  >
                    <span className="text-xs font-black tabular-nums" style={{ color: accent }}>
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-[17px] font-semibold leading-snug text-[#0D1B35]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── Cómo funciona — foto lifestyle a la DERECHA + texto ── */}
          <motion.section {...sectionReveal} className="py-20">
            <div className="mx-auto grid max-w-6xl items-center gap-12 px-6 lg:grid-cols-12">
              
              {/* Texto a la izquierda */}
              <div className={lifestyleA ? "lg:col-span-7" : "lg:col-span-8"}>
                <Eyebrow color={accent}>La ciencia del parche</Eyebrow>
                <h2 className="mt-3 text-[clamp(28px,3vw,40px)] font-black leading-tight text-[#0D1B35]">
                  Cómo funciona
                </h2>
                <p className="mt-6 max-w-xl text-[15px] leading-7 text-[#425066]">
                  {HOW_IT_WORKS_INTRO}
                </p>
                <p className="mt-4 max-w-xl text-[15px] leading-7 text-[#425066]">
                  {pdp.howItWorks}
                </p>
              </div>

              {/* Imagen a la derecha */}
              {lifestyleA && (
                <div className="lg:col-span-5">
                  <div
                    className="relative aspect-[4/5] overflow-hidden rounded-[24px]"
                    style={{ background: bg }}
                  >
                    <Image
                      src={lifestyleA}
                      alt={`${product.title} en uso`}
                      fill
                      sizes="(max-width: 1024px) 100vw, 40vw"
                      className="object-cover"
                    />
                  </div>
                </div>
              )}
            </div>
          </motion.section>

          {/* ── Ingredientes clave — banda tint del producto ── */}
          <motion.section {...sectionReveal} style={{ background: bg }} className="py-20">
            <div className="mx-auto max-w-6xl px-6">
              <div className="flex flex-wrap items-end justify-between gap-4">
                <div>
                  <Eyebrow color={accent}>Fórmula {product.title}</Eyebrow>
                  <h2 className="mt-3 text-[clamp(28px,3vw,40px)] font-black leading-tight text-[#0D1B35]">
                    Ingredientes clave
                  </h2>
                </div>
                <p className="text-sm font-semibold" style={{ color: accent }}>
                  {pdp.ingredientDetails.length} activos seleccionados
                </p>
              </div>
              <div className="mt-10 grid gap-x-12 sm:grid-cols-2">
                {pdp.ingredientDetails.map((ing) => (
                  <div key={ing.name} className="border-t border-[#0D1B35]/10 py-4">
                    <p className="text-[15px] font-bold text-[#0D1B35]">{ing.name}</p>
                    <p className="mt-1 text-[13px] leading-5 text-[#0D1B35]/65">
                      {ing.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── Modo de uso ── */}
          <motion.section {...sectionReveal} className="bg-white py-24">
            <div className="mx-auto max-w-6xl px-6 grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Columna Izquierda: Imagen de uso */}
              <div className="relative aspect-[4/5] sm:aspect-[3/4] lg:aspect-[4/5] overflow-hidden rounded-[32px] bg-[#FAF7F2] shadow-sm border border-[#0D1B35]/5">
                <Image
                  src="/productusers/How_to_use_GIF.webp"
                  alt="Aplicación de parche Novapatch"
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover"
                />
              </div>

              {/* Columna Derecha: Pasos de uso */}
              <div className="flex flex-col justify-center">
                <Eyebrow color={accent}>Un gesto simple</Eyebrow>
                <h2 className="mt-3 text-[clamp(28px,3vw,40px)] font-black leading-tight text-[#0D1B35]">
                  Modo de uso
                </h2>
                
                <div className="mt-8 flex flex-col gap-6">
                  {pdp.usageSteps.map((step, i) => (
                    <div key={step} className="flex gap-6 items-start border-t border-[#0D1B35]/10 pt-5">
                      <span
                        className="text-[clamp(32px,3.5vw,48px)] font-black leading-none shrink-0"
                        style={{ color: accent }}
                      >
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-[14px] leading-6 text-[#425066] pt-1">{step}</p>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </motion.section>

          {/* ── Reseñas reales de redes sociales ── */}
          <RealSocialReviews 
            slug={product.slug} 
            accent={accent} 
            bg={bg} 
            reviews={reviews} 
            onRefresh={loadReviews}
            loading={reviewsLoading}
          />

          {/* ── FAQ — heading lateral + accordion ── */}
          <motion.section id="faq-section" {...sectionReveal} className="mx-auto max-w-6xl px-6 py-20">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4">
                <Eyebrow color={accent}>Antes de empezar</Eyebrow>
                <h2 className="mt-3 text-[clamp(28px,3vw,40px)] font-black leading-tight text-[#0D1B35]">
                  Preguntas frecuentes
                </h2>
              </div>
              <div className="lg:col-span-8">
                <FaqAccordion faq={pdp.faq} accent={accent} />
              </div>
            </div>
          </motion.section>
        </>
      )}

      {/* ── CTA final — banda tint asimétrica ── */}
      <motion.section {...sectionReveal} className="px-6 pb-24">
        <div
          className="mx-auto flex max-w-6xl flex-col items-start gap-6 rounded-[28px] px-10 py-12 sm:flex-row sm:items-center sm:justify-between"
          style={{ background: bg }}
        >
          <div>
            <h2 className="text-[clamp(24px,2.5vw,32px)] font-black leading-tight text-[#0D1B35]">
              ¿Listo para probar {product.title}?
            </h2>
            <p className="mt-1 text-sm text-[#0D1B35]/65">
              Pausa, cambia o cancela cuando quieras.
            </p>
          </div>
          <button
            onClick={() => handleAdd(selected)}
            className="shrink-0 rounded-full px-10 py-4 text-base font-bold text-white transition hover:opacity-90"
            style={{ background: color }}
          >
            {ctaLabel}
          </button>
        </div>
      </motion.section>
    </main>
  );
}
