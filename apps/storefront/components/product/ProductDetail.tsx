"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
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

function StarIcon({ size = 13, filled = true }: { size?: number; filled?: boolean }) {
  return (
    <svg viewBox="0 0 20 20" fill={filled ? "#0F0F0F" : "#E6E1D8"} width={size} height={size} className="shrink-0 inline-block">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

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
  const [[active, direction], setActiveState] = useState([0, 0]);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  const setPage = (newIndex: number) => {
    if (newIndex === active) return;
    const dir = newIndex > active ? 1 : -1;
    setActiveState([newIndex, dir]);
  };

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
    <div 
      style={{ aspectRatio: "1 / 1" }}
      className="relative w-full max-w-[520px] max-h-[calc(100vh-150px)] mx-auto overflow-hidden rounded-2xl bg-white border border-[#E6E1D8] shadow-2xs group/gallery"
    >
      {/* Animated Image Stage with Slide Transition */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={active}
          custom={direction}
          variants={{
            enter: (dir: number) => ({
              x: dir > 0 ? 35 : -35,
              opacity: 0,
              scale: 0.98,
            }),
            center: {
              x: 0,
              opacity: 1,
              scale: 1,
            },
            exit: (dir: number) => ({
              x: dir > 0 ? -35 : 35,
              opacity: 0,
              scale: 0.98,
            }),
          }}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0 flex items-center justify-center"
        >
          {media[active].type === "image" ? (
            <Image
              src={media[active].src}
              alt={`${title} — imagen ${active + 1}`}
              fill
              priority={active === 0}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover p-0 select-none pointer-events-none"
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
              <div className="absolute top-4 left-4 z-[2] flex items-center gap-1.5 rounded-full bg-black/60 px-3 py-1 text-[11px] font-sans font-medium text-white uppercase tracking-wider backdrop-blur-sm">
                <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
                Video UGC
              </div>
            </div>
          )}
        </motion.div>
      </AnimatePresence>

      {/* Translucent Overlay Floating Thumbnails at Bottom-Left */}
      {media.length > 1 && (
        <div className="absolute bottom-4 left-4 z-20 flex gap-2 p-1.5 rounded-2xl bg-white/40 backdrop-blur-md border border-white/60 shadow-md max-w-[calc(100%-2rem)] overflow-x-auto">
          {media.map((item, i) => (
            <button
              key={i}
              onMouseEnter={() => setPage(i)}
              onClick={() => setPage(i)}
              aria-label={`Ver media ${i + 1}`}
              aria-current={i === active}
              className={`relative aspect-square h-12 w-12 overflow-hidden rounded-xl border transition-all duration-200 group/thumb flex-shrink-0 cursor-pointer ${
                i === active 
                  ? 'border-[#0F0F0F] bg-white scale-105 shadow-sm opacity-100 ring-2 ring-black/10' 
                  : 'border-white/50 bg-white/70 opacity-70 hover:opacity-100 hover:scale-105 hover:bg-white hover:border-white'
              }`}
            >
              <Image 
                src={item.type === "image" ? item.src : item.thumbnail} 
                alt={`${title} vista ${i + 1}`}
                fill 
                sizes="80px"
                className="object-cover p-0" 
              />
              
              {/* Play icon overlay on the video thumbnail */}
              {item.type === "video" && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/20 group-hover/thumb:bg-black/30 transition">
                  <div className="flex h-5 w-5 items-center justify-center rounded-full bg-white/90 text-[#0D1B35] shadow-xs">
                    <svg className="w-2.5 h-2.5 ml-0.5" fill="currentColor" viewBox="0 0 24 24" style={{ width: "10px", height: "10px" }}>
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

const BUNDLE_ORIGINAL_PRICES: Record<string, number> = {
  "pack-dia-noche": 1500,
  "pack-calma-sueno": 1500,
  "pack-glow-balance": 1500,
  "pack-trio-vitalidad": 2250,
};

const BUNDLE_PATCH_COUNTS: Record<string, string> = {
  "pack-dia-noche": "60 parches en total (30 Energy + 30 Sleep) · 15% OFF INCLUIDO",
  "pack-calma-sueno": "60 parches en total (30 Zen + 30 Sleep) · 15% OFF INCLUIDO",
  "pack-glow-balance": "60 parches en total (30 Glow + 30 Woman) · 15% OFF INCLUIDO",
  "pack-trio-vitalidad": "90 parches en total (30 Energy + 30 Sleep + 30 Zen) · 20% OFF INCLUIDO",
};

const BUNDLE_HOW_IT_WORKS_IMAGES: Record<string, string[]> = {
  "pack-dia-noche": ["/products/Energy_4.webp", "/products/Sleep_4.webp"],
  "pack-calma-sueno": ["/products/Zen_4.webp", "/products/Sleep_4.webp"],
  "pack-glow-balance": ["/products/Glow_4.webp", "/products/Woman_4.webp"],
  "pack-trio-vitalidad": ["/products/Energy_4.webp", "/products/Zen_4.webp", "/products/Sleep_4.webp"],
};

function HowItWorksPdpImage({
  images,
  title,
  bg,
}: {
  images: string[];
  title: string;
  bg: string;
}) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (images.length <= 1) return;
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % images.length);
    }, 3500);
    return () => clearInterval(timer);
  }, [images]);

  if (images.length === 0) return null;

  return (
    <div
      className="relative aspect-[4/5] overflow-hidden rounded-xl bg-white border border-[#E6E1D8] shadow-2xs"
    >
      <AnimatePresence mode="sync">
        <motion.div
          key={images[index]}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeInOut" }}
          className="absolute inset-0 w-full h-full"
        >
          <Image
            src={images[index]}
            alt={`${title} en uso (${index + 1})`}
            fill
            sizes="(max-width: 1024px) 100vw, 40vw"
            className="object-contain p-4 sm:p-6"
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

const USAGE_IMAGES = [
  { src: "/productusers/Howtouse_1.webp", alt: "Paso 1: Aplicar parche Novapatch" },
  { src: "/productusers/Howtouse_2.webp", alt: "Paso 2: Liberación gradual de activos" },
  { src: "/productusers/Howtouse_3.webp", alt: "Paso 3: Disfrutar del bienestar continuo" },
];

function PdpUsageImage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.14, 1.0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % USAGE_IMAGES.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative aspect-square w-full overflow-hidden rounded-xl bg-white shadow-2xs border border-[#E6E1D8]"
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={USAGE_IMAGES[currentIndex].src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <motion.div style={{ scale: imageScale }} className="w-full h-full relative">
            <Image
              src={USAGE_IMAGES[currentIndex].src}
              alt={USAGE_IMAGES[currentIndex].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={currentIndex === 0}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}

function HowItWorksBannerCard({
  introText,
  detailText,
}: {
  introText: string;
  detailText: string;
}) {
  return (
    <>
      {/* ── MOBILE VIEW (< md): Text First, Image Second ── */}
      <div className="md:hidden flex flex-col gap-5 w-full text-left">
        {/* Text Content Card */}
        <div className="bg-[#FAF8F5] border border-[#E6E1D8] rounded-2xl p-6 flex flex-col justify-center shadow-2xs">
          <h2 className="text-3xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-4">
            cómo funciona.
          </h2>

          <div className="flex flex-wrap gap-2 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E6E1D8] text-[11px] font-sans font-medium text-[#0F0F0F] shadow-2xs">
              <span className="text-[#A8A29A]">✓</span> Liberación tópica gradual
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E6E1D8] text-[11px] font-sans font-medium text-[#0F0F0F] shadow-2xs">
              <span className="text-[#A8A29A]">✓</span> 0% impacto digestivo
            </span>
            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-[#E6E1D8] text-[11px] font-sans font-medium text-[#0F0F0F] shadow-2xs">
              <span className="text-[#A8A29A]">✓</span> Absorción continua de 10h
            </span>
          </div>

          <div className="space-y-3">
            <p className="font-sans font-normal text-sm text-[#3A3A37] leading-relaxed">
              {introText}
            </p>
            <p className="font-sans font-normal text-sm text-[#3A3A37] leading-relaxed">
              {detailText}
            </p>
          </div>
        </div>

        {/* Dedicated 1:1 Mobile Infographic Image Card */}
        <div className="relative w-full aspect-square rounded-2xl overflow-hidden bg-white border border-[#E6E1D8] shadow-2xs">
          <Image
            src="/infographic/Infografia_movil.webp"
            alt="Cómo funciona Novapatch"
            fill
            sizes="100vw"
            className="object-contain p-2"
            priority
          />
        </div>
      </div>

      {/* ── DESKTOP VIEW (md+): Original Integrated Full-Width Banner ── */}
      <div className="hidden md:flex relative w-full aspect-[21/9] min-h-[340px] lg:min-h-[380px] rounded-2xl overflow-hidden bg-[#FAF8F5] border border-[#E6E1D8] shadow-md flex-col justify-end p-9 lg:p-10 text-left">
        {/* Background Image */}
        <div className="absolute inset-0">
          <Image
            src="/infographic/Banner_howitworks_pdp.webp"
            alt="Cómo funciona Novapatch"
            fill
            sizes="1240px"
            className="object-cover object-center"
            priority
          />
        </div>

        {/* Soft Bone Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#FAF8F5] via-[#FAF8F5]/85 to-transparent z-[1] pointer-events-none" />

        {/* Text Content Layer */}
        <div className="relative z-10 w-full lg:w-1/2 lg:max-w-[50%] flex flex-col justify-end">
          <h2 className="text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-4">
            cómo funciona.
          </h2>

          <div className="flex flex-wrap gap-2.5 mb-5">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E6E1D8] text-xs font-sans font-medium text-[#0F0F0F] shadow-2xs">
              <span className="text-[#A8A29A]">✓</span> Liberación tópica gradual
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E6E1D8] text-xs font-sans font-medium text-[#0F0F0F] shadow-2xs">
              <span className="text-[#A8A29A]">✓</span> 0% impacto digestivo
            </span>
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full bg-white border border-[#E6E1D8] text-xs font-sans font-medium text-[#0F0F0F] shadow-2xs">
              <span className="text-[#A8A29A]">✓</span> Absorción continua de 10h
            </span>
          </div>

          <div className="space-y-3">
            <p className="font-sans font-normal text-base text-[#3A3A37] leading-relaxed">
              {introText}
            </p>
            <p className="font-sans font-normal text-base text-[#3A3A37] leading-relaxed">
              {detailText}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

const SYNERGY_SECTIONS: Record<string, {
  eyebrow: string;
  title: string;
  desc: string;
  cards: {
    icon: string;
    timeTag: string;
    name: string;
    text: string;
    img: string;
    ingredients: string;
  }[];
}> = {
  "pack-dia-noche": {
    eyebrow: "SINERGIA 24 HORAS",
    title: "Tu Ritmo Diario de Mañana a Noche",
    desc: "Energy y Sleep se complementan para acompañar tu jornada completa: claridad y foco de día, calma y descanso de noche.",
    cards: [
      {
        icon: "",
        timeTag: "MAÑANA · 8:00 AM",
        name: "Novapatch Energy",
        text: "Acompaña tu jornada con foco sostenido y claridad mental. Sin cafeína extra, sin temblores ni picos repentinos.",
        img: "/products/Energy_thumb.webp",
        ingredients: "Té Verde, Ginseng, L-Carnitina, Vit B2 & C",
      },
      {
        icon: "",
        timeTag: "NOCHE · 10:00 PM",
        name: "Novapatch Sleep",
        text: "Aplica 1 hora antes de acostarte para acompañar la bajada de ritmo y preparar el cuerpo para un descanso reparador.",
        img: "/products/Sleep_thumb.webp",
        ingredients: "Triptófano, Bisglicinato de Magnesio, Glicina",
      },
    ],
  },
  "pack-calma-sueno": {
    eyebrow: "DESCONEXIÓN Y RESTAURACIÓN",
    title: "Mente en Calma y Sueño Reparador",
    desc: "Zen y Sleep se complementan para acompañar la desaceleración del día: calma funcional por la tarde y descanso reparador de noche.",
    cards: [
      {
        icon: "",
        timeTag: "TARDE · 5:00 PM",
        name: "Novapatch Zen",
        text: "Acompaña la calma funcional por la tarde, ayudando a transitar horas de alta exigencia con serenidad sin somnolencia.",
        img: "/products/Zen_thumb.webp",
        ingredients: "Triptófano, Taurato de Magnesio, Taurina, Manzanilla",
      },
      {
        icon: "",
        timeTag: "NOCHE · 10:00 PM",
        name: "Novapatch Sleep",
        text: "Aplica 1 hora antes de acostarte para acompañar la bajada de ritmo y preparar el cuerpo para un descanso reparador.",
        img: "/products/Sleep_thumb.webp",
        ingredients: "Triptófano, Bisglicinato de Magnesio, Glicina",
      },
    ],
  },
  "pack-glow-balance": {
    eyebrow: "BIENESTAR Y SALUD FEMENINA",
    title: "Piel Radiante y Equilibrio Femenino",
    desc: "Glow y Woman se complementan para acompañar tu cuidado integral: nutrición de la piel desde adentro y apoyo al equilibrio de tus ritmos naturales.",
    cards: [
      {
        icon: "",
        timeTag: "MAÑANA · DÍA",
        name: "Novapatch Glow",
        text: "Acompaña la nutrición de la piel desde adentro con colágeno hidrolizado, ácido hialurónico, biotina y antioxidantes.",
        img: "/products/Glow_thumb.webp",
        ingredients: "Colágeno Hidrolizado, Ácido Hialurónico, Biotina, Vit C",
      },
      {
        icon: "",
        timeTag: "DIARIO · A TU RITMO",
        name: "Novapatch Woman",
        text: "Acompaña la estabilidad natural del bienestar femenino con fitoestrógenos botánicos de soya y minerales esenciales.",
        img: "/products/Woman_thumb.webp",
        ingredients: "Extracto de Soya, Bisglicinato de Hierro, Magnesio, Vit B6",
      },
    ],
  },
  "pack-trio-vitalidad": {
    eyebrow: "COBERTURA COMPLETA 360°",
    title: "La Tríada de Bienestar 24 Horas",
    desc: "Tres parches especializados para acompañar cada fase del día: foco matutino con Energy, calma vespertina con Zen y descanso nocturno con Sleep.",
    cards: [
      {
        icon: "",
        timeTag: "MAÑANA · 8:00 AM",
        name: "Novapatch Energy",
        text: "Acompaña tu jornada con claridad mental y foco sostenido sin picos de cafeína.",
        img: "/products/Energy_thumb.webp",
        ingredients: "Té Verde, Ginseng, L-Carnitina, Vit B12 & C",
      },
      {
        icon: "",
        timeTag: "TARDE · 5:00 PM",
        name: "Novapatch Zen",
        text: "Acompaña la calma funcional por la tarde en momentos de exigencia sin somnolencia.",
        img: "/products/Zen_thumb.webp",
        ingredients: "Triptófano, Taurato de Magnesio, Taurina, Manzanilla",
      },
      {
        icon: "",
        timeTag: "NOCHE · 10:00 PM",
        name: "Novapatch Sleep",
        text: "Aplica 1 hora antes de acostarte para acompañar la bajada de ritmo y preparar el descanso.",
        img: "/products/Sleep_thumb.webp",
        ingredients: "Triptófano, Bisglicinato de Magnesio, Inositol, Glicina",
      },
    ],
  },
};

function TierSelector({
  options,
  selected,
  onSelect,
  currency,
  color,
  bg,
  slug,
}: {
  options: PurchaseOption[];
  selected: PurchaseOption;
  onSelect: (o: PurchaseOption) => void;
  currency: string;
  color: string;
  bg: string;
  slug?: string;
}) {
  const originalPrice = BUNDLE_ORIGINAL_PRICES[slug ?? ""] ?? null;
  const isBundle = Boolean(originalPrice);

  return (
    <div>
      <p className="mb-3 text-sm font-sans font-semibold text-[#0F0F0F]">¿Cómo quieres recibirlo?</p>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {options.map((o) => {
          const isActive = o.tier === selected.tier;
          const totalDiscountPct = isBundle && originalPrice
            ? Math.round((1 - o.price / originalPrice) * 100)
            : o.discountPct;

          return (
            <button
              key={o.tier}
              onClick={() => onSelect(o)}
              aria-pressed={isActive}
              className={`rounded-xl border-2 px-3.5 py-3 text-left transition flex flex-col justify-between ${
                isActive
                  ? "border-[#0F0F0F] bg-white shadow-2xs"
                  : "border-[#E6E1D8] bg-[#FAF8F5] hover:border-[#A8A29A]"
              }`}
            >
              <div>
                <span className="block text-xs font-sans font-semibold text-[#0F0F0F]">{o.label}</span>
                {isBundle && originalPrice && (
                  <span className="block text-[11px] font-mono font-medium text-[#A8A29A] line-through mt-0.5">
                    {formatPrice(originalPrice, currency)}
                  </span>
                )}
                <span className="mt-0.5 block text-base font-mono font-bold text-[#0F0F0F]">
                  {formatPrice(o.price, currency)}
                </span>
              </div>
              <div>
                {isBundle ? (
                  <span className="mt-1 block text-[10px] font-sans font-medium uppercase tracking-tight text-[#0F0F0F]">
                    {totalDiscountPct}% OFF TOTAL
                  </span>
                ) : (
                  o.discountPct > 0 && (
                    <span className="mt-0.5 block text-[10px] font-sans font-medium uppercase tracking-tight text-[#0F0F0F]">
                      {o.discountPct}% OFF
                    </span>
                  )
                )}
              </div>
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

function FaqAccordion({ faq }: { faq: PdpMeta["faq"] }) {
  const [open, setOpen] = useState<number | null>(0);
  return (
    <div className="divide-y divide-[#E6E1D8] border-y border-[#E6E1D8]">
      {faq.map((item, i) => (
        <div key={item.q} className="py-5 text-left">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            aria-expanded={open === i}
            aria-controls={`faq-panel-${i}`}
            className="flex w-full items-center justify-between text-left group cursor-pointer"
          >
            <span className="text-base sm:text-lg font-sans font-semibold text-[#0F0F0F] group-hover:text-[#3A3A37] transition-colors">
              {item.q}
            </span>
            <span className="shrink-0 w-6 h-6 rounded-full border border-[#E6E1D8] bg-[#FAF8F5] flex items-center justify-center font-mono text-xs text-[#0F0F0F]">
              {open === i ? "−" : "+"}
            </span>
          </button>
          <AnimatePresence initial={false}>
            {open === i && (
              <motion.div
                id={`faq-panel-${i}`}
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.25, ease: "easeInOut" }}
                className="overflow-hidden"
              >
                <p className="pt-3 text-xs sm:text-sm font-sans font-normal text-[#3A3A37] leading-relaxed max-w-2xl">
                  {item.a}
                </p>
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
      a: "La absorción tópica gradual actúa entre 30 y 45 minutos tras la colocación."
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
  ],
  "pack-dia-noche": [
    {
      q: "¿Cómo combino ambos parches en mi rutina?",
      a: "Aplicas 1 parche Energy por la mañana (ej. 8:00 AM) para acompañar tu enfoque y vitalidad. Lo retiras por la tarde/noche y aplicas 1 parche Sleep 1 hora antes de dormir para acompañar la bajada de ritmo y el descanso reparador."
    },
    {
      q: "¿El descuento del 15% viene aplicado?",
      a: "¡Sí! El precio del Ritual Día & Noche incluye un 15% OFF de descuento permanente comparado con la compra individual de ambos sobres."
    },
    {
      q: "¿Se pueden suspender o pausar las entregas?",
      a: "Totalmente. Si eliges la opción de suscripción (Mensual, Bimestral o Trimestral), puedes pausar, reprogramar o cancelar en 1 solo clic desde tu panel de usuario sin cargos adicionales."
    }
  ],
  "pack-calma-sueno": [
    {
      q: "¿Cómo combino ambos parches en mi rutina?",
      a: "Aplicas 1 parche Zen por la tarde (4:00 PM - 6:00 PM) para acompañar la calma funcional en horas de exigencia. Lo retiras por la noche y aplicas 1 parche Sleep 1 hora antes de acostarte."
    },
    {
      q: "¿El descuento del 15% viene aplicado?",
      a: "¡Sí! El precio del Pack Calma & Sueño incluye un 15% OFF de descuento permanente comparado con la compra individual de ambos sobres."
    },
    {
      q: "¿Se pueden suspender o pausar las entregas?",
      a: "Totalmente. Si eliges la opción de suscripción, puedes pausar, reprogramar o cancelar las entregas con 1 solo clic desde tu cuenta sin penalizaciones."
    }
  ],
  "pack-glow-balance": [
    {
      q: "¿Puedo usar ambos parches al mismo tiempo?",
      a: "Sí. Aplicas 1 parche Glow y 1 parche Woman por la mañana en piel limpia y seca. La absorción tópica de ambas fórmulas es totalmente independiente y complementaria."
    },
    {
      q: "¿El descuento del 15% viene aplicado?",
      a: "¡Sí! El precio del Pack Glow & Balance incluye un 15% OFF de descuento permanente comparado con la compra de ambos sobres por separado."
    },
    {
      q: "¿Se pueden suspender o pausar las entregas?",
      a: "Totalmente. Puedes administrar, pausar o cancelar tus entregas en cualquier momento desde tu panel de usuario sin costos adicionales."
    }
  ],
  "pack-trio-vitalidad": [
    {
      q: "¿Cómo distribuyo los 3 parches en el día?",
      a: "Aplicas Energy por la mañana al despertar (8:00 AM), Zen por la tarde en horas de exigencia mental (5:00 PM), y Sleep 1 hora antes de ir a dormir (10:00 PM)."
    },
    {
      q: "¿El descuento del 20% viene aplicado?",
      a: "¡Sí! El Trío Vitalidad 360° incluye un 20% OFF de ahorro permanente en comparación con la compra individual de los 3 productos."
    },
    {
      q: "¿Se pueden suspender o pausar las entregas?",
      a: "Totalmente. Puedes pausar, modificar la frecuencia o cancelar tu suscripción en cualquier momento desde tu cuenta con 1 solo clic."
    }
  ],
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
  const color = meta?.color ?? "#0F0F0F";
  const bg = meta?.bg ?? "#FFFFFF";
  // Shade del producto para texto/acentos sobre fondos claros (mejor contraste que el base)
  const accent = meta?.taglineColor ?? color;
  // La galería muestra las imágenes del producto.
  const mediaList = product.images.map((img) => ({ type: "image" as const, src: img }));
  
  const howItWorksImages = ["/infographic/Howitworks_pdp.webp"];
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
    <main className="min-h-screen bg-[#FAF8F5]">
      {/* ── Hero: galería + info ── */}
      <section className="mx-auto grid max-w-[1400px] gap-10 px-4 sm:px-8 pt-28 pb-16 lg:grid-cols-2">
        <div className="lg:sticky lg:top-28 self-start w-full flex justify-center">
          <Gallery media={mediaList} title={product.title} bg={bg} accent={accent} />
        </div>

        <div className="flex flex-col justify-center">
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase">
            {product.title}.
          </h1>
          <a
            href="#reviews-section"
            className="group flex items-center gap-1.5 mt-2 self-start text-[13px] font-sans font-medium text-[#3A3A37] hover:text-[#0F0F0F] transition-all duration-300"
          >
            <div className="flex gap-0.5 items-center group-hover:scale-105 transition-transform duration-300">
              {[...Array(5)].map((_, i) => (
                <StarIcon key={i} size={13} filled={i < Math.round(averageRating)} />
              ))}
            </div>
            <span className="font-mono">{averageRating}</span>
            <span className="text-[#A8A29A] font-normal">|</span>
            <span className="underline decoration-black/20 group-hover:decoration-black transition-colors">
              {totalCount} opiniones reales
            </span>
          </a>
          {pdp && (
            <p className="mt-4 text-base sm:text-lg font-sans font-medium text-[#3A3A37] leading-relaxed">{pdp.tagline}</p>
          )}

          {/* Precio y Ahorro en PDP */}
          {(() => {
            const originalPrice = BUNDLE_ORIGINAL_PRICES[product.slug] ?? product.basePrice;
            const hasSavings = originalPrice > selected.price;
            const savingsAmount = originalPrice - selected.price;
            return (
              <div className="mt-4 flex items-baseline gap-3">
                <span className="text-3xl sm:text-4xl font-mono font-bold text-[#0F0F0F]">
                  {formatPrice(selected.price, currency)}
                </span>
                {hasSavings && (
                  <span className="text-lg font-mono font-medium text-[#A8A29A] line-through">
                    {formatPrice(originalPrice, currency)}
                  </span>
                )}
                {hasSavings && (
                  <span className="text-[11px] font-sans font-medium uppercase tracking-[0.1em] text-[#0F0F0F] bg-white px-3 py-1 rounded-full border border-[#E6E1D8] shadow-2xs">
                    ¡AHORRAS {formatPrice(savingsAmount, currency)}!
                  </span>
                )}
              </div>
            );
          })()}

          <p className="mt-3 max-w-md text-sm font-sans font-normal text-[#3A3A37] leading-relaxed">
            {product.description}
          </p>

          <div className="mt-4 flex flex-wrap items-center gap-2">
            {/* Solid Ink Badge Protagonista según Brand Kit v3 */}
            <span className="rounded-full px-3.5 py-1.5 text-[11px] font-sans font-semibold uppercase tracking-[0.12em] bg-[#0F0F0F] border border-[#0F0F0F] text-white shadow-2xs flex items-center gap-1.5">
              <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24" style={{ width: "12px", height: "12px" }}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              {BUNDLE_PATCH_COUNTS[product.slug] ?? "30 parches por sobre"}
            </span>
          </div>

          {/* Grilla de Trust Badges Premium */}
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
                className="flex flex-col gap-1 p-3 rounded-xl bg-white border border-[#E6E1D8] shadow-2xs"
              >
                <div className="flex items-center gap-2 text-[#0F0F0F]">
                  {b.icon}
                  <span className="text-[12px] font-sans font-semibold text-[#0F0F0F]">{b.title}</span>
                </div>
                <p className="text-[10px] font-sans font-normal text-[#3A3A37] leading-tight">{b.desc}</p>
              </div>
            ))}
          </div>

          {/* Selector de frecuencia (abajo de la grilla de badges y justo arriba de la CTA de compra) */}
          <div className="mt-6">
            <TierSelector
              options={product.options}
              selected={selected}
              onSelect={setSelected}
              currency={currency}
              color={color}
              bg={bg}
              slug={product.slug}
            />
          </div>

          <button
            onClick={() => handleAdd(selected)}
            className="mt-6 w-full rounded-full py-4 text-xs font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all shadow-2xs active:scale-95"
          >
            {ctaLabel}
          </button>
          {(() => {
            const origPrice = BUNDLE_ORIGINAL_PRICES[product.slug];
            if (origPrice) {
              const savings = origPrice - selected.price;
              if (selected.freq === null) {
                return (
                  <p className="mt-3 text-center text-xs font-bold text-[#1E7D4F]">
                    ¡Ahorras {formatPrice(savings, currency)} frente a la compra individual! · Envío GRATIS · 30 días de garantía
                  </p>
                );
              }
              return (
                <p className="mt-3 text-center text-xs font-bold text-[#1E7D4F]">
                  Ahorras {formatPrice(savings, currency)} · Pausa/cancela cuando quieras · Sin penalizaciones · Envío GRATIS siempre
                </p>
              );
            }

            if (selected.freq === null) {
              return (
                <p className="mt-3 text-center text-xs text-[#0D1B35]/55">
                  Envío GRATIS · Llega en 2-4 días hábiles · 30 días de garantía total con tu primer pedido
                </p>
              );
            }

            return (
              <p className="mt-3 text-center text-xs font-bold text-[#1E7D4F]">
                Ahorras {formatPrice(product.basePrice - selected.price, currency)} · Pausa/cancela cuando quieras · Sin penalizaciones · Envío GRATIS siempre
              </p>
            );
          })()}

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
                        <span className="shrink-0 w-5 h-5 rounded-full border border-[#E6E1D8] bg-[#FAF8F5] flex items-center justify-center font-mono text-[11px] text-[#0F0F0F]">
                          {isOpen ? "−" : "+"}
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
            className="overflow-hidden border-y border-[#E6E1D8] bg-[#FAF8F5]"
          >
            <motion.div
              initial={{ y: -6 }}
              animate={{ y: 0 }}
              exit={{ y: -6 }}
              transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
              className="mx-auto grid max-w-[1240px] gap-8 px-6 sm:px-10 py-10 sm:grid-cols-3 text-left"
            >
              {SUBSCRIPTION_PERKS.map((perk) => (
                <div key={perk.title}>
                  <p className="font-sans font-semibold text-sm text-[#0F0F0F] mb-1">
                    {perk.title}
                  </p>
                  <p className="font-sans text-xs text-[#3A3A37] leading-relaxed">
                    {perk.description}
                  </p>
                </div>
              ))}
            </motion.div>
          </motion.section>
        )}
      </AnimatePresence>

          {/* ── Sección de Sinergia exclusiva para paquetes/bundles ── */}
          {SYNERGY_SECTIONS[product.slug] && (
            <motion.section {...sectionReveal} className="bg-[#FAF8F5] py-20 px-6 border-t border-b border-[#E6E1D8]">
              <div className="max-w-5xl mx-auto text-left mb-12">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase">
                  {SYNERGY_SECTIONS[product.slug].title}
                </h2>
                <p className="text-[#3A3A37] font-sans max-w-2xl mt-3 text-sm sm:text-base leading-relaxed">
                  {SYNERGY_SECTIONS[product.slug].desc}
                </p>
              </div>

              <div className={`max-w-5xl mx-auto grid grid-cols-1 ${SYNERGY_SECTIONS[product.slug].cards.length === 3 ? "md:grid-cols-3" : "md:grid-cols-2"} gap-8`}>
                {SYNERGY_SECTIONS[product.slug].cards.map((c, idx) => (
                  <div key={idx} className="bg-[#FAF8F5] border border-[#E6E1D8] shadow-2xs rounded-xl p-8 relative overflow-hidden flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-4">
                        {c.icon ? <span className="text-3xl">{c.icon}</span> : <div />}
                        <span className="text-[10px] font-sans font-medium uppercase tracking-[0.14em] px-3 py-1 rounded-full bg-white border border-[#E6E1D8] text-[#0F0F0F] shadow-2xs">
                          {c.timeTag}
                        </span>
                      </div>
                      <h3 className="text-2xl font-display font-semibold text-[#0F0F0F] lowercase">{c.name}</h3>
                      <p className="text-[#3A3A37] text-sm font-sans mt-2 leading-relaxed">
                        {c.text}
                      </p>
                    </div>
                    <div className="mt-8 pt-6 border-t border-[#E6E1D8] flex items-center gap-4">
                      <Image
                        src={c.img}
                        alt={c.name}
                        width={72}
                        height={72}
                        className="w-16 h-16 rounded-xl bg-white p-1.5 border border-[#E6E1D8] object-contain shrink-0"
                      />
                      <div>
                        <p className="text-xs font-sans font-semibold text-[#0F0F0F]">Ingredientes activos clave</p>
                        <p className="text-xs font-sans text-[#3A3A37] mt-1 leading-snug">{c.ingredients}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.section>
          )}

      {/* ── UgcMarquee — carrusel de fotos reales ── */}
      <UgcMarquee accent={accent} />

      {pdp && (
        <>
          {/* ── ¿Cómo te acompaña? — heading lateral + lista con divisores ── */}
          <motion.section {...sectionReveal} className="bg-[#FAF8F5] py-20 border-b border-[#E6E1D8]">
            <div className="mx-auto max-w-[1240px] px-6 sm:px-10 grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-5 text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase">
                  ¿cómo te acompaña?
                </h2>
                {meta?.quote && (
                  <p className="mt-4 max-w-xs text-base font-sans font-medium text-[#3A3A37] leading-snug">
                    {meta.quote}
                  </p>
                )}
              </div>
              <div className="lg:col-span-7">
                {pdp.accompaniment.map((item, i) => (
                  <div
                    key={item}
                    className="flex items-baseline gap-5 border-b border-[#E6E1D8] py-4 first:pt-0"
                  >
                    <span className="text-xs font-mono font-semibold tabular-nums text-[#A8A29A]">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <p className="text-base sm:text-lg font-sans font-medium leading-snug text-[#0F0F0F]">
                      {item}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── Cómo funciona (Banner 16:9 con Scroll-Driven Zoom Scale) ── */}
          <motion.section {...sectionReveal} className="py-16 sm:py-20 px-6 sm:px-10 max-w-[1240px] mx-auto">
            <HowItWorksBannerCard introText={HOW_IT_WORKS_INTRO} detailText={pdp.howItWorks} />
          </motion.section>

          {/* ── Ingredientes clave — banda tint del producto ── */}
          <motion.section {...sectionReveal} className="py-20 bg-[#FAF8F5] border-b border-[#E6E1D8]">
            <div className="mx-auto max-w-[1240px] px-6 sm:px-10 text-left">
              <div className="flex flex-wrap items-end justify-between gap-4 mb-8">
                <div>
                  <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase">
                    ingredientes clave.
                  </h2>
                </div>
                <p className="text-xs font-mono font-medium text-[#A8A29A] uppercase tracking-wider">
                  activos seleccionados
                </p>
              </div>
              <div className="mt-8 grid gap-x-12 gap-y-6 sm:grid-cols-2">
                {pdp.ingredientDetails.map((ing) => (
                  <div key={ing.name} className="border-t border-[#E6E1D8] pt-4">
                    <p className="text-sm sm:text-base font-sans font-semibold text-[#0F0F0F]">{ing.name}</p>
                    <p className="mt-1 text-xs sm:text-sm font-sans text-[#3A3A37] leading-relaxed">
                      {ing.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </motion.section>

          {/* ── Modo de uso ── */}
          <motion.section {...sectionReveal} className="bg-[#FAF8F5] py-20 border-b border-[#E6E1D8]">
            <div className="mx-auto max-w-[1240px] px-6 sm:px-10 grid gap-12 lg:grid-cols-2 lg:items-center">
              {/* Columna Izquierda: Imagen de uso animada con transición suave */}
              <PdpUsageImage />

              {/* Columna Derecha: Pasos de uso */}
              <div className="flex flex-col justify-center text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase mb-6">
                  modo de uso.
                </h2>
                
                <div className="flex flex-col gap-6">
                  {pdp.usageSteps.map((step, i) => (
                    <div key={step} className="flex gap-6 items-start border-t border-[#E6E1D8] pt-5">
                      <span className="text-2xl sm:text-3xl font-mono font-semibold text-[#0F0F0F] shrink-0">
                        {String(i + 1).padStart(2, '0')}
                      </span>
                      <p className="text-sm font-sans text-[#3A3A37] leading-relaxed pt-1">{step}</p>
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
          <motion.section id="faq-section" {...sectionReveal} className="mx-auto max-w-[1240px] px-6 sm:px-10 py-20">
            <div className="grid gap-10 lg:grid-cols-12">
              <div className="lg:col-span-4 text-left">
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase">
                  preguntas frecuentes.
                </h2>
              </div>
              <div className="lg:col-span-8">
                <FaqAccordion faq={pdp.faq} />
              </div>
            </div>
          </motion.section>
        </>
      )}

      {/* ── CTA final simplificado ── */}
      <motion.section {...sectionReveal} className="px-6 pb-24 max-w-5xl mx-auto">
        <div className="rounded-xl p-8 sm:p-12 bg-white border border-[#E6E1D8] shadow-2xs text-center flex flex-col items-center gap-4 sm:gap-6">
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase">
            ¿listo para probar {product.title}?
          </h2>
          <p className="text-sm sm:text-base font-sans font-normal text-[#3A3A37] max-w-md">
            Pausa, cambia o cancela cuando quieras. Sin compromiso.
          </p>
          <button
            onClick={() => handleAdd(selected)}
            className="mt-2 rounded-full px-8 py-4 text-[11px] font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all shadow-2xs active:scale-95 cursor-pointer"
          >
            {ctaLabel}
          </button>
        </div>
      </motion.section>
    </main>
  );
}
