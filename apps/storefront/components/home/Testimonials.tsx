"use client";

import { useState, useCallback } from "react";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import Image from "next/image";

// Editorial-pride palette — queer-coded but not literal rainbow flag.
// Each testimonial cycles through one accent so the grid feels like a
// magazine spread rather than a corporate block.
const ACCENTS = [
  "#D8456A", // magenta-rosa
  "#F28B40", // coral-naranja
  "#EFC149", // azafrán
  "#7CC27D", // jade
  "#5B9BD5", // cielo
  "#A17FC0", // orquídea
] as const;

const PLUM = "#3C1F4F";
const CREAM = "#FBF5EC";
const CREAM_DEEP = "#F1E7D4";

// Font stacks — families loaded via @import in globals.css
const SERIF = `"Fraunces", Georgia, "Times New Roman", serif`;
const SANS = `"Instrument Sans", ui-sans-serif, system-ui, sans-serif`;

const testimonials = [
  {
    name: "Carlos M.",
    product: "Energy",
    img: "/socialproof/testimonial_2_1x.webp",
    text: "Lo pongo en la mañana y siento que llego al final del día sin ese bajón de siempre. Ya no dependo del tercer café.",
  },
  {
    name: "Sofía R.",
    product: "Sleep",
    img: "/socialproof/testimonial_1_1x.webp",
    text: "Me ayuda a desconectar antes de dormir. Llego a la cama más tranquila y eso lo cambia todo.",
  },
  {
    name: "Diego T.",
    product: "Zen",
    img: "/socialproof/testimonial_5_1x.webp",
    text: "Días de reuniones seguidas y lo noto. No es que el estrés desaparezca, pero lo manejo diferente.",
  },
  {
    name: "Valentina G.",
    product: "Glow",
    img: "/socialproof/testimonial_3_1x.webp",
    text: "Llevo dos meses y mi piel se ve diferente. Más uniforme, más luminosa. La gente me pregunta qué estoy haciendo.",
  },
  {
    name: "Andrés P.",
    product: "Shield",
    img: "/socialproof/testimonial_9_1x.webp",
    text: "Entreno fuerte y necesito que mi cuerpo responda bien. Desde que lo uso me enfermo mucho menos. Simple así.",
  },
  {
    name: "Mariana L.",
    product: "Woman",
    img: "/socialproof/testimonial_8_1x.webp",
    text: "Sentía que mis ciclos me manejaban a mí. Ahora lo vivo diferente — más estable, con menos altibajos emocionales.",
  },
];

const PAGE_SIZE = 3;

function StarIcon({ color, size = 14 }: { color: string; size?: number }) {
  return (
    <svg viewBox="0 0 20 20" fill={color} width={size} height={size} aria-hidden="true">
      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
    </svg>
  );
}

const Stars = ({ color }: { color: string }) => (
  <div role="img" aria-label="Calificación: 5 de 5 estrellas" className="flex gap-[3px] mb-5">
    {[...Array(5)].map((_, i) => (
      <StarIcon key={i} color={color} />
    ))}
  </div>
);

// Hand-drawn wavy underline — SVG so it scales with type size
const HeadingUnderline = () => (
  <svg
    aria-hidden="true"
    viewBox="0 0 420 14"
    preserveAspectRatio="none"
    className="absolute left-0 -bottom-3 w-full h-[10px]"
  >
    <path
      d="M2 8 C 70 1, 140 14, 210 7 S 380 1, 418 9"
      fill="none"
      stroke="#D8456A"
      strokeWidth="3"
      strokeLinecap="round"
    />
  </svg>
);

// Stable tilt per card index
const TILTS = [-0.75, 0.35, -0.25] as const;

export default function Testimonials() {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(testimonials.length / PAGE_SIZE);
  const visible = testimonials.slice(page * PAGE_SIZE, page * PAGE_SIZE + PAGE_SIZE);
  const shouldReduceMotion = useReducedMotion();

  const go = (dir: number) => {
    setPage((p) => (p + dir + totalPages) % totalPages);
  };

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    },
    [go] // eslint-disable-line react-hooks/exhaustive-deps
  );

  return (
    <section
      className="relative py-20 sm:py-28 px-5 sm:px-8 lg:px-12"
      style={{ background: CREAM, fontFamily: SANS, color: PLUM }}
    >
      {/* Header — editorial, left-aligned */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className="max-w-[1100px] mx-auto mb-16 sm:mb-20 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-6"
      >
        <div className="flex-1">
          <p
            className="text-[11px] uppercase mb-5 inline-flex items-center gap-2"
            style={{
              letterSpacing: "0.22em",
              color: "#D8456A",
              fontFamily: SANS,
              fontWeight: 600,
            }}
          >
            <span className="inline-block w-8 h-px" style={{ background: "#D8456A" }} />
            Volumen 01 · Testimonios
          </p>
          <h2
            className="relative inline-block leading-[0.98]"
            style={{
              fontFamily: SERIF,
              fontWeight: 900,
              fontStyle: "italic",
              fontSize: "clamp(40px, 5.5vw, 68px)",
              color: PLUM,
              letterSpacing: "-0.02em",
            }}
          >
            Lo que dicen
            <br />
            <span style={{ fontStyle: "normal", fontWeight: 400 }}>quienes ya lo usan.</span>
            <HeadingUnderline />
          </h2>
        </div>

        {/* Rating pill — right side */}
        <div className="flex items-center gap-3 shrink-0" style={{ fontFamily: SANS }}>
          <div className="flex items-center gap-[3px]">
            {[...Array(5)].map((_, i) => (
              <StarIcon key={i} color="#EFC149" />
            ))}
          </div>
          <div>
            <p
              style={{
                fontFamily: SERIF,
                fontWeight: 700,
                fontSize: 28,
                lineHeight: 1,
                color: PLUM,
              }}
            >
              4.8
            </p>
            <p
              className="text-[11px] uppercase mt-1"
              style={{ letterSpacing: "0.18em", color: PLUM, opacity: 0.55 }}
            >
              de 5 estrellas
            </p>
          </div>
        </div>
      </motion.div>

      {/* Cards */}
      <div
        role="region"
        aria-roledescription="carrusel"
        aria-label="Testimonios de clientes"
        aria-live="polite"
        tabIndex={0}
        className="max-w-[1100px] mx-auto relative focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-4 rounded-2xl"
        style={{ outlineColor: "#D8456A" }}
        onKeyDown={handleKeyDown}
      >
        <div aria-live="assertive" aria-atomic="true" className="sr-only">
          Página {page + 1} de {totalPages}
        </div>
        <AnimatePresence mode="wait">
          <motion.div
            key={page}
            initial={shouldReduceMotion ? false : { opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            exit={shouldReduceMotion ? {} : { opacity: 0, y: -24 }}
            transition={{ duration: shouldReduceMotion ? 0 : 0.4, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-7"
          >
            {visible.map((t, idx) => {
              const globalIdx = page * PAGE_SIZE + idx;
              const accent = ACCENTS[globalIdx % ACCENTS.length];
              const tilt = TILTS[idx % TILTS.length];

              return (
                <motion.article
                  key={t.name}
                  role="group"
                  aria-roledescription="slide"
                  aria-label={`Testimonio de ${t.name}`}
                  initial={shouldReduceMotion ? false : { rotate: tilt }}
                  animate={{ rotate: shouldReduceMotion ? 0 : tilt }}
                  whileHover={
                    shouldReduceMotion
                      ? {}
                      : { rotate: 0, y: -4, transition: { duration: 0.3 } }
                  }
                  style={{
                    background: "white",
                    boxShadow:
                      "0 1px 0 rgba(60, 31, 79, 0.06), 0 18px 40px -24px rgba(60, 31, 79, 0.22)",
                  }}
                  className="relative rounded-[28px] p-8 pt-11 flex flex-col overflow-hidden"
                >
                  {/* Top colored rule */}
                  <span
                    aria-hidden="true"
                    className="absolute top-0 left-0 right-0 h-[6px]"
                    style={{ background: accent }}
                  />

                  {/* Oversized decorative quote */}
                  <span
                    aria-hidden="true"
                    className="absolute pointer-events-none select-none"
                    style={{
                      top: -18,
                      right: 22,
                      fontFamily: SERIF,
                      fontWeight: 900,
                      fontStyle: "italic",
                      fontSize: 120,
                      lineHeight: 1,
                      color: accent,
                      opacity: 0.18,
                    }}
                  >
                    “
                  </span>

                  <Stars color={accent} />

                  <p
                    className="flex-1 mb-7"
                    style={{
                      fontFamily: SERIF,
                      fontWeight: 400,
                      fontSize: 17,
                      lineHeight: 1.55,
                      color: PLUM,
                      letterSpacing: "-0.005em",
                    }}
                  >
                    {t.text}
                  </p>

                  <div className="flex items-center gap-3">
                    <div
                      className="w-12 h-12 rounded-full overflow-hidden flex-shrink-0 p-[2px]"
                      style={{ background: accent }}
                    >
                      <div className="w-full h-full rounded-full overflow-hidden bg-white">
                        <Image
                          src={t.img}
                          alt={`Foto de ${t.name}`}
                          width={48}
                          height={48}
                          loading="lazy"
                          className="object-cover w-full h-full"
                        />
                      </div>
                    </div>
                    <div>
                      <p
                        className="text-[14px]"
                        style={{ fontFamily: SANS, fontWeight: 600, color: PLUM }}
                      >
                        {t.name}
                      </p>
                      <p
                        className="text-[12px] mt-0.5"
                        style={{
                          fontFamily: SERIF,
                          fontStyle: "italic",
                          color: accent,
                        }}
                      >
                        Novapatch {t.product}
                      </p>
                    </div>
                  </div>
                </motion.article>
              );
            })}
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Nav */}
      <div className="max-w-[1100px] mx-auto flex justify-between items-center mt-12">
        <div className="flex items-center gap-2">
          {Array.from({ length: totalPages }).map((_, i) => (
            <button
              key={i}
              onClick={() => setPage(i)}
              className="flex items-center justify-center w-8 h-8 border-none cursor-pointer bg-transparent"
              aria-label={`Página ${i + 1}`}
              aria-current={i === page ? "true" : undefined}
            >
              <span
                className="block rounded-full transition-all duration-300"
                style={{
                  width: i === page ? 28 : 8,
                  height: 8,
                  background: i === page ? PLUM : "rgba(60, 31, 79, 0.22)",
                }}
              />
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => go(-1)}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{
              border: `1.5px solid ${PLUM}22`,
              color: PLUM,
              background: CREAM_DEEP,
            }}
            aria-label="Anterior"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M15 18l-6-6 6-6" />
            </svg>
          </button>
          <button
            onClick={() => go(1)}
            className="w-11 h-11 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer"
            style={{ border: "none", color: "white", background: PLUM }}
            aria-label="Siguiente"
          >
            <svg
              width="14"
              height="14"
              fill="none"
              stroke="currentColor"
              strokeWidth="2.5"
              viewBox="0 0 24 24"
            >
              <path d="M9 18l6-6-6-6" />
            </svg>
          </button>
        </div>
      </div>
    </section>
  );
}
