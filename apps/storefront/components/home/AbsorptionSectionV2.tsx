"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import Link from "next/link";

/* ─────────────────────────────────────────────
   Animated dot that travels vertically down a path
───────────────────────────────────────────── */
function TravelingDot({
  color,
  delay = 0,
  size = 8,
  blur = false,
}: {
  color: string;
  delay?: number;
  size?: number;
  blur?: boolean;
}) {
  return (
    <motion.div
      className="absolute left-1/2 -translate-x-1/2 rounded-full"
      style={{
        width: size,
        height: size,
        background: color,
        boxShadow: blur ? `0 0 ${size * 2}px ${color}` : "none",
      }}
      initial={{ top: "0%", opacity: 0 }}
      animate={{ top: "100%", opacity: [0, 1, 1, 0] }}
      transition={{
        duration: 2.4,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

/* ─────────────────────────────────────────────
   Single path column (pill or patch journey)
───────────────────────────────────────────── */
/* ─────────────────────────────────────────────
   Single path column (pill or patch journey)
───────────────────────────────────────────── */
interface Stop {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  loss?: string; // e.g. "−45%"
  highlight?: boolean;
}

function JourneyColumn({
  title,
  accent,
  stops,
  dotColor,
  dotCount = 3,
  active,
  iconSize = "w-14 h-14",
}: {
  title: string;
  accent: string;
  stops: Stop[];
  dotColor: string;
  dotCount?: number;
  active: boolean;
  iconSize?: string;
}) {
  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Column header */}
      <div
        className="w-full text-center py-2.5 px-3 rounded-2xl mb-3.5 font-black text-[12px] uppercase tracking-[0.12em] shadow-xs"
        style={{ background: accent, color: "#fff" }}
      >
        {title}
      </div>

      <div className="relative flex flex-col items-center gap-0 w-full flex-1 justify-between">
        {/* Vertical line */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px]"
          style={{ background: `${accent}35` }}
        />

        {/* Traveling dots */}
        {active &&
          Array.from({ length: dotCount }).map((_, i) => (
            <TravelingDot
              key={i}
              color={dotColor}
              delay={i * (2.4 / dotCount)}
              size={dotCount === 3 ? 7 : 10}
              blur={dotCount > 3}
            />
          ))}

        {/* Stops */}
        {stops.map((stop, i) => (
          <div key={i} className="relative z-10 flex flex-col items-center w-full my-0.5">
            <div
              className={`${iconSize} rounded-full p-0.5 flex items-center justify-center mb-1 relative transition-all duration-300 hover:scale-110 ${stop.highlight
                  ? "bg-white border-2 border-[#005088] ring-3 ring-[#005088]/15 shadow-md shadow-[#005088]/15"
                  : "bg-white border border-stone-200/80 shadow-xs"
                }`}
            >
              {stop.icon}
              {stop.loss && (
                <span
                  className="absolute -top-1.5 -right-1 text-[8.5px] font-black px-1.5 py-0.5 rounded-full shadow-xs z-10"
                  style={{ background: "#EF4444", color: "#fff" }}
                >
                  {stop.loss}
                </span>
              )}
            </div>
            <p
              className={`text-[11.5px] font-black text-center leading-snug ${stop.highlight ? "text-[#005088]" : "text-[#0D1B35]/85"
                }`}
            >
              {stop.label}
            </p>
            {stop.sublabel && (
              stop.highlight ? (
                <span className="inline-block text-[10px] font-bold text-[#005088] bg-[#005088]/10 px-2 py-0.5 rounded-full mt-0.5 border border-[#005088]/20 shadow-2xs">
                  {stop.sublabel}
                </span>
              ) : (
                <p className="text-[9.5px] text-center mt-0.5 font-medium text-[#0D1B35]/50">
                  {stop.sublabel}
                </p>
              )
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────────
   Main Section Data — 3D Custom Generated Icons
───────────────────────────────────────────── */
const pillStops: Stop[] = [
  {
    icon: (
      <Image
        src="/infographic/pill_capsule.webp"
        alt="Ingerís la cápsula"
        width={64}
        height={64}
        className="w-full h-full object-cover rounded-full"
      />
    ),
    label: "Ingerís la cápsula",
    sublabel: "Dosis inicial: 100%",
  },
  {
    icon: (
      <Image
        src="/infographic/pill_stomach.webp"
        alt="Paso por la digestión"
        width={64}
        height={64}
        className="w-full h-full object-cover rounded-full"
      />
    ),
    label: "Paso por la digestión",
    sublabel: "Ácidos del estómago",
    loss: "−45%",
  },
  {
    icon: (
      <Image
        src="/infographic/pill_liver.webp"
        alt="Filtro del hígado"
        width={64}
        height={64}
        className="w-full h-full object-cover rounded-full"
      />
    ),
    label: "Filtro del hígado",
    sublabel: "Metabolismo hepático",
    loss: "−30%",
  },
  {
    icon: (
      <Image
        src="/infographic/pill_blood.webp"
        alt="Solo ~25% llega"
        width={64}
        height={64}
        className="w-full h-full object-cover rounded-full"
      />
    ),
    label: "Solo ~25% llega",
    sublabel: "Al resto del cuerpo",
  },
];

const patchStops: Stop[] = [
  {
    icon: (
      <Image
        src="/infographic/patch_apply.webp"
        alt="Aplicás el parche"
        width={80}
        height={80}
        className="w-full h-full object-cover rounded-full"
      />
    ),
    label: "Aplicás el parche",
    sublabel: "Dosis inicial: 100%",
    highlight: true,
  },
  {
    icon: (
      <Image
        src="/infographic/patch_direct.webp"
        alt="Absorción directa"
        width={80}
        height={80}
        className="w-full h-full object-cover rounded-full"
      />
    ),
    label: "Absorción directa a través de la piel",
    sublabel: "Moléculas < 500 Daltons",
    highlight: true,
  },
  {
    icon: (
      <Image
        src="/infographic/patch_blood.webp"
        alt="Hasta 95% libre"
        width={80}
        height={80}
        className="w-full h-full object-cover rounded-full"
      />
    ),
    label: "Hasta 95% libre",
    sublabel: "Absorción constante 10-12h",
    highlight: true,
  },
];

const stats = [
  { value: "< 500 Da", label: "Tamaño molecular" },
  { value: "10–12 h", label: "Absorción continua" },
  { value: "0 ×", label: "Carga digestiva" },
];

const BRAND_ACCENT = "#005088"; // Ocean Blue - Confiable, saludable, positivo

export default function AbsorptionSectionV2() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -120px 0px" });

  return (
    <section
      ref={ref}
      className="overflow-hidden py-20 sm:py-24"
      style={{ background: "var(--color-blush)" }}
    >
      <div className="max-w-7xl mx-auto px-4">
        {/* Main 12-column Grid: Col 1 (5 cols) + Comparison Area (7 cols) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">

          {/* ── Column 1: Text & Science Info (Span 5) ── */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-between"
            initial={{ opacity: 0, x: -28 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <span className="home-section-eyebrow">
                LA CIENCIA DEL BIENESTAR
              </span>
              <h2 className="home-section-title text-ocean mt-3">
                El camino más corto{" "}
                <span className="text-teal">al bienestar.</span>
              </h2>
              <p className="home-body text-stone-600 mt-4 leading-relaxed text-sm md:text-base">
                No cualquier ingrediente funciona en un parche. Para integrarse a tu rutina a través
                de la piel, las fórmulas de Novapatch se diseñan desde cero con activos de masa
                molecular menor a 500 Daltons. ¿El resultado? Absorción directa y constante sin
                carga digestiva, acompañándote de 10 a 12 horas continuas.
              </p>
            </div>

            {/* 3 Stats boxes grid */}
            <div className="mt-8 grid grid-cols-3 gap-3">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl p-3.5 text-center bg-white/80 border border-stone-200/80 shadow-xs flex flex-col justify-center"
                >
                  <div className="font-black text-lg md:text-xl leading-none mb-1 text-ocean">
                    {s.value}
                  </div>
                  <div className="text-[10px] md:text-[11px] font-semibold leading-tight text-stone-500">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div className="mt-8">
              <Link
                href="/tienda"
                className="inline-flex items-center gap-2 font-bold text-sm md:text-[15px] px-8 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 bg-ocean text-white hover:bg-ocean-dark shadow-md hover:shadow-lg"
              >
                Encuentra tu parche
                <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
            </div>
          </motion.div>

          {/* ── Comparison Area (Span 7): 2 equal-width columns + VS divider ── */}
          <motion.div
            className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-[1fr_auto_1fr] gap-4 sm:gap-2 items-stretch"
            initial={{ opacity: 0, y: 28 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Infographic 1: Suplemento oral */}
            <div className="rounded-3xl p-4 pt-4 sm:p-4.5 bg-white/70 border border-stone-200/80 shadow-sm flex flex-col justify-between">
              <JourneyColumn
                title="Suplemento oral"
                accent="#71717A"
                stops={pillStops}
                dotColor="#71717A"
                dotCount={3}
                active={inView}
              />
            </div>

            {/* VS Divider Line & Badge */}
            <div className="flex sm:flex-col items-center justify-center gap-2 py-2 sm:py-0 px-1">
              <div className="flex-1 sm:w-[1px] h-[1px] sm:h-full bg-stone-300" />
              <span className="text-[11px] font-black tracking-[0.2em] px-2.5 py-1 rounded-full flex-shrink-0 bg-white text-stone-500 border border-stone-200 shadow-xs">
                VS
              </span>
              <div className="flex-1 sm:w-[1px] h-[1px] sm:h-full bg-stone-300" />
            </div>

            {/* Infographic 2: Novapatch (Novapatch logo badge + Novapatch header) */}
            <div className="rounded-3xl p-4 pt-4 sm:p-4.5 relative bg-white border-2 border-[#005088]/25 shadow-md flex flex-col justify-between mt-7 sm:mt-0">
              {/* "Novapatch" isologo top badge */}
              <div
                className="absolute -top-7 left-1/2 -translate-x-1/2 p-2 rounded-full text-white shadow-md flex items-center justify-center"
                style={{ background: BRAND_ACCENT }}
              >
                <Image
                  src="/logos/iconwht.webp"
                  alt="Novapatch"
                  width={32}
                  height={32}
                  className="h-6.5 w-6.5 object-contain"
                />
              </div>
              <JourneyColumn
                title="Novapatch"
                accent={BRAND_ACCENT}
                stops={patchStops}
                dotColor={BRAND_ACCENT}
                dotCount={5}
                active={inView}
                iconSize="w-16 h-16 sm:w-[68px] sm:h-[68px]"
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
