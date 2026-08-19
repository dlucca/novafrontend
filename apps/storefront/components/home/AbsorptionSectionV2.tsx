"use client";

import { useRef } from "react";
import { motion, useInView } from "framer-motion";
import Image from "next/image";
import { Link } from "@/lib/i18n-navigation";

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
        duration: 5.2,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
}

interface Stop {
  icon: React.ReactNode;
  label: string;
  sublabel?: string;
  loss?: string;
  highlight?: boolean;
}

function JourneyColumn({
  title,
  accent,
  stops,
  dotColor,
  dotCount = 3,
  active,
}: {
  title: string;
  accent: string;
  stops: Stop[];
  dotColor: string;
  dotCount?: number;
  active: boolean;
}) {
  return (
    <div className="flex flex-col items-center w-full h-full">
      {/* Column header */}
      <div
        className="w-full text-center py-2 px-1.5 sm:py-2.5 sm:px-3 rounded-lg mb-3 sm:mb-4 font-sans font-medium text-[9.5px] sm:text-[11px] uppercase tracking-[0.08em] sm:tracking-[0.14em] truncate"
        style={{ background: accent, color: "#FAF8F5" }}
      >
        {title}
      </div>

      <div className="relative flex flex-col items-center gap-0 w-full flex-1 justify-between">
        {/* Vertical line */}
        <div
          className="absolute top-0 bottom-0 left-1/2 -translate-x-1/2 w-[2px]"
          style={{ background: `${accent}30` }}
        />

        {/* Traveling dots (Slower 5.2s duration) */}
        {active &&
          Array.from({ length: dotCount }).map((_, i) => (
            <TravelingDot
              key={i}
              color={dotColor}
              delay={i * (5.2 / dotCount)}
              size={dotCount === 3 ? 7 : 9}
              blur={dotCount > 3}
            />
          ))}

        {/* Stops */}
        {stops.map((stop, i) => (
          <div
            key={i}
            className="relative z-10 flex flex-col items-center text-center my-1 sm:my-2 group"
          >
            {/* Icon circle */}
            <div
              className={`rounded-full flex items-center justify-center p-0.5 transition-transform duration-300 ${
                stop.highlight
                  ? "w-12 h-12 sm:w-20 sm:h-20 bg-white border-2 border-[#0F0F0F] shadow-xs"
                  : "w-9 h-9 sm:w-12 sm:h-12 bg-white border border-[#E6E1D8]"
              }`}
            >
              {stop.icon}
            </div>

            {/* Label */}
            <span
              className={`font-sans font-semibold text-[#0F0F0F] mt-1 leading-tight ${
                stop.highlight ? "text-[11px] sm:text-sm max-w-[110px] sm:max-w-[160px]" : "text-[10px] sm:text-xs max-w-[100px] sm:max-w-[140px]"
              }`}
            >
              {stop.label}
            </span>

            {/* Sublabel */}
            {stop.sublabel && (
              <span className="text-[8.5px] sm:text-[10px] font-sans text-[#A8A29A] mt-0.5 max-w-[100px] sm:max-w-[140px] leading-tight">
                {stop.sublabel}
              </span>
            )}

            {/* Loss badge */}
            {stop.loss && (
              <span className="mt-0.5 px-1.5 py-0.5 rounded-full text-[8.5px] sm:text-[10px] font-sans font-medium text-[#3A3A37] bg-[#FAF8F5] border border-[#E6E1D8]">
                {stop.loss}
              </span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

const pillStops: Stop[] = [
  {
    icon: (
      <Image
        src="/infographic/pill_capsule.webp"
        alt="Ingerís la cápsula"
        width={80}
        height={80}
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
        alt="Ácidos estomacales"
        width={80}
        height={80}
        className="w-full h-full object-cover rounded-full"
      />
    ),
    label: "Ácidos estomacales & Digestión",
    sublabel: "Degradación parcial",
    loss: "−45% pérdida",
  },
  {
    icon: (
      <Image
        src="/infographic/pill_liver.webp"
        alt="Filtro hepático"
        width={80}
        height={80}
        className="w-full h-full object-cover rounded-full"
      />
    ),
    label: "Paso por el Hígado",
    sublabel: "Efecto de primer paso",
    loss: "−30% adicional",
  },
  {
    icon: (
      <Image
        src="/infographic/pill_blood.webp"
        alt="Absorción final"
        width={80}
        height={80}
        className="w-full h-full object-cover rounded-full"
      />
    ),
    label: "Solo ~25% llega al cuerpo",
    sublabel: "Carga digestiva requerida",
  },
];

const patchStops: Stop[] = [
  {
    icon: (
      <Image
        src="/infographic/patch_apply.webp"
        alt="Aplicás el parche"
        width={120}
        height={120}
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
        width={120}
        height={120}
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
        width={120}
        height={120}
        className="w-full h-full object-cover rounded-full"
      />
    ),
    label: "Hasta 95% de biodisponibilidad",
    sublabel: "Absorción constante 10-12h",
    highlight: true,
  },
];

const stats = [
  { value: "< 500 Da", label: "Tamaño molecular" },
  { value: "10–12 h", label: "Absorción continua" },
  { value: "0 ×", label: "Carga digestiva" },
];

export default function AbsorptionSectionV2() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "0px 0px -120px 0px" });

  return (
    <section
      ref={ref}
      className="overflow-hidden py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E6E1D8]"
    >
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        {/* Main 12-column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-stretch">

          {/* Column 1: Text & Science Info (Brand Kit Definitivo — Space Grotesk H2, Left Aligned) */}
          <motion.div
            className="lg:col-span-5 flex flex-col justify-between text-left"
            initial={{ opacity: 0, x: -24 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          >
            <div>
              <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight mb-6 lowercase">
                el camino más corto al bienestar.
              </h2>
              <p className="text-sm font-sans font-normal text-[#3A3A37] leading-relaxed mb-8">
                No cualquier ingrediente funciona en un parche. Para integrarse a tu rutina a través
                de la piel, las fórmulas de Novapatch se diseñan desde cero con activos de masa
                molecular menor a 500 Daltons. ¿El resultado? Absorción directa y constante sin
                carga digestiva, acompañándote de 10 a 12 horas continuas.
              </p>
            </div>

            {/* 3 Stats boxes grid (Brand Kit Definitivo — JetBrains Mono for data) */}
            <div className="grid grid-cols-3 gap-2.5 sm:gap-3 mb-8">
              {stats.map((s) => (
                <div
                  key={s.label}
                  className="rounded-xl p-3 sm:p-4 text-center bg-white border border-[#E6E1D8] shadow-2xs flex flex-col justify-center overflow-hidden"
                >
                  <div className="font-mono font-semibold text-base sm:text-lg lg:text-xl text-[#0F0F0F] tracking-tight mb-1 whitespace-nowrap">
                    {s.value}
                  </div>
                  <div className="text-[10px] sm:text-[11px] font-sans font-normal text-[#A8A29A] leading-tight">
                    {s.label}
                  </div>
                </div>
              ))}
            </div>

            {/* CTA button */}
            <div>
              <Link
                href="/tienda"
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] text-[12px] font-sans font-medium uppercase tracking-[0.14em] transition-all shadow-2xs"
              >
                encuentra tu novapatch
              </Link>
            </div>
          </motion.div>

          {/* Comparison Area (Span 7): 2 equal-width columns side-by-side on all screens */}
          <motion.div
            className="lg:col-span-7 grid grid-cols-[1fr_auto_1fr] gap-2 sm:gap-3 items-stretch"
            initial={{ opacity: 0, y: 24 }}
            animate={inView ? { opacity: 1, x: 0, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Infographic 1: Suplemento oral */}
            <div className="rounded-xl p-2.5 sm:p-4.5 bg-white border border-[#E6E1D8] shadow-2xs flex flex-col justify-between">
              <JourneyColumn
                title="Suplemento oral"
                accent="#3A3A37"
                stops={pillStops}
                dotColor="#3A3A37"
                dotCount={3}
                active={inView}
              />
            </div>

            {/* VS Divider Line & Badge */}
            <div className="flex flex-col items-center justify-center gap-2 py-0 px-0.5">
              <div className="flex-1 w-[1px] h-full bg-[#E6E1D8]" />
              <span className="text-[9px] sm:text-[10px] font-sans font-medium uppercase tracking-[0.1em] sm:tracking-[0.14em] px-1.5 sm:px-2.5 py-1 rounded-full flex-shrink-0 bg-white text-[#A8A29A] border border-[#E6E1D8] shadow-2xs">
                VS
              </span>
              <div className="flex-1 w-[1px] h-full bg-[#E6E1D8]" />
            </div>

            {/* Infographic 2: Novapatch */}
            <div className="rounded-xl p-2.5 sm:p-4.5 bg-white border border-[#0F0F0F] shadow-2xs flex flex-col justify-between">
              <JourneyColumn
                title="Novapatch"
                accent="#0F0F0F"
                stops={patchStops}
                dotColor="#0F0F0F"
                dotCount={5}
                active={inView}
              />
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
