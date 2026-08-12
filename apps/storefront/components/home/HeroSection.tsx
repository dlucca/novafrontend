"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

interface Slide {
  src: string;
  alt: string;
  accent: string;
  key: string;
}

interface HeroSectionProps {
  slides: Slide[];
  current: number;
  onNav: (dir: number) => void;
  onDot: (i: number) => void;
  onPause: () => void;
  onResume: () => void;
}

const SWIPE_THRESHOLD = 50;

export default function HeroSection({ slides, current, onNav, onDot, onPause, onResume }: HeroSectionProps) {
  const t = useTranslations("home.hero");
  const shouldReduceMotion = useReducedMotion();
  const pointerStartX = useRef<number | null>(null);
  const swiping = useRef(false);

  const handlePointerDown = useCallback((e: React.PointerEvent) => {
    pointerStartX.current = e.clientX;
    swiping.current = false;
    if (e.pointerType === "touch") {
      onPause();
    }
  }, [onPause]);

  const handlePointerMove = useCallback((e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      swiping.current = true;
    }
  }, []);

  const handlePointerUp = useCallback((e: React.PointerEvent) => {
    if (pointerStartX.current === null) return;
    const dx = e.clientX - pointerStartX.current;
    pointerStartX.current = null;

    if (Math.abs(dx) >= SWIPE_THRESHOLD) {
      onNav(dx < 0 ? 1 : -1);
    } else if (e.pointerType === "touch") {
      onResume();
    }
  }, [onNav, onResume]);

  const handlePointerCancel = useCallback(() => {
    pointerStartX.current = null;
    swiping.current = false;
    onResume();
  }, [onResume]);

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      onNav(-1);
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      onNav(1);
    }
  }, [onNav]);

  return (
    <section
      role="region"
      aria-roledescription="carrusel"
      aria-label="Imágenes destacadas"
      tabIndex={0}
      className="relative w-full overflow-hidden min-h-[580px] sm:min-h-0 sm:aspect-video touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-inset bg-[#001423]"
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerCancel}
      onMouseEnter={onPause}
      onMouseLeave={onResume}
      onFocus={onPause}
      onBlur={onResume}
      onKeyDown={handleKeyDown}
    >
      {/* Screen-reader live announcement — visually hidden */}
      <div aria-live="polite" aria-atomic="true" className="sr-only">
        Imagen {current + 1} de {slides.length}: {slides[current]?.alt}
      </div>

      {/* Cinematic Slide cross-fade and zoom */}
      <div className="absolute inset-0 w-full h-full">
        <AnimatePresence mode="popLayout" initial={false}>
          <motion.div
            key={current}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
            className="absolute inset-0 w-full h-full overflow-hidden"
          >
            <motion.div
              initial={{ scale: shouldReduceMotion ? 1 : 1.02, x: 0 }}
              animate={{ scale: shouldReduceMotion ? 1 : 1.07, x: shouldReduceMotion ? 0 : "-1.2%" }}
              transition={{ duration: 6.5, ease: "linear" }}
              className="relative w-full h-full"
            >
              <Image
                src={slides[current].src}
                alt={slides[current].alt}
                fill
                className="object-cover object-center sm:object-top"
                priority
                sizes="100vw"
              />
            </motion.div>
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Dynamic ambient color gradients */}
      <AnimatePresence mode="popLayout" initial={false}>
        <motion.div
          key={`gradient-${current}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.85, ease: "easeInOut" }}
          className="absolute inset-0 z-[1]"
          style={{
            background: `linear-gradient(to top, rgba(0, 20, 35, 0.85) 0%, rgba(0, 20, 35, 0.4) 50%, ${slides[current].accent}15 100%)`,
          }}
        />
      </AnimatePresence>
      <div
        className="absolute inset-0 z-[1] hidden sm:block"
        style={{
          background: "linear-gradient(100deg, rgba(0,35,45,0.6) 0%, rgba(0,35,45,0.2) 45%, rgba(0,0,0,0) 100%)",
        }}
      />

      {/* ── Text overlay ────────────────────────────────────────────────────────── */}
      <div className="absolute inset-0 z-[2] flex items-end sm:items-center pb-14 sm:pb-0">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-14 w-full">
          <AnimatePresence mode="wait">
            <motion.div
              key={current}
              initial="hidden"
              animate="visible"
              exit="exit"
              variants={{
                hidden: { opacity: 0 },
                visible: {
                  opacity: 1,
                  transition: {
                    staggerChildren: 0.12,
                  },
                },
                exit: {
                  opacity: 0,
                  transition: {
                    duration: 0.2,
                  },
                },
              }}
              className="max-w-[560px] mx-auto sm:mx-0"
            >
              {/* Product Badge */}
              <motion.span
                variants={{
                  hidden: { opacity: 0, y: 15 },
                  visible: { opacity: 0.9, y: 0, transition: { duration: 0.5, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="inline-block text-[11px] font-extrabold uppercase tracking-[0.15em] mb-2 px-3.5 py-1 rounded-full text-white"
                style={{ background: `${slides[current].accent}33`, border: `1px solid ${slides[current].accent}66` }}
              >
                {t("badge")} · {slides[current].alt.split(" ").slice(-1)[0]}
              </motion.span>

              {/* Dynamic Title */}
              <motion.h1
                variants={{
                  hidden: { opacity: 0, y: 24 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.75, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="text-white font-black leading-[1.08] mb-3 sm:mb-4 tracking-[-0.02em] text-center sm:text-left text-balance"
                style={{ fontSize: "clamp(34px, 8vw, 62px)" }}
              >
                {t(`slides.${slides[current].key}.title`)}
              </motion.h1>

              {/* Dynamic Subtitle */}
              <motion.p
                variants={{
                  hidden: { opacity: 0, y: 20 },
                  visible: { opacity: 0.85, y: 0, transition: { duration: 0.7, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="text-white font-normal mb-6 sm:mb-9 leading-[1.6] max-w-[440px] mx-auto sm:mx-0 text-center sm:text-left"
                style={{ fontSize: "clamp(14px, 3.5vw, 17px)" }}
              >
                {t(`slides.${slides[current].key}.subtitle`)}
              </motion.p>

              {/* Staggered CTAs */}
              <motion.div
                variants={{
                  hidden: { opacity: 0, y: 16 },
                  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] } },
                }}
                className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center"
              >
                <Link
                  href="#productos"
                  className="group inline-flex items-center justify-center gap-2 bg-white font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.25)] shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                  style={{ color: "var(--color-ocean)", fontSize: "clamp(14px, 3.5vw, 15px)" }}
                >
                  {t("cta")}
                  <svg
                    width="15"
                    height="15"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2.5"
                    viewBox="0 0 24 24"
                    className="group-hover:translate-x-0.5 transition-transform duration-200"
                  >
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </Link>
                <Link
                  href="#como-funciona"
                  className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:bg-white/15"
                  style={{
                    border: "2px solid rgba(255,255,255,0.4)",
                    fontSize: "clamp(14px, 3.5vw, 15px)",
                  }}
                >
                  {t("ctaSecondary")}
                </Link>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Prev/Next — ocultos en mobile */}
      <button
        onClick={() => onNav(-1)}
        aria-label="Anterior"
        className="hidden sm:flex absolute left-3 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 rounded-full bg-white/90 items-center justify-center text-[#111827] shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all duration-200 hover:bg-white hover:scale-105"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M15 18l-6-6 6-6" />
        </svg>
      </button>
      <button
        onClick={() => onNav(1)}
        aria-label="Siguiente"
        className="hidden sm:flex absolute right-3 top-1/2 -translate-y-1/2 z-[5] w-10 h-10 rounded-full bg-white/90 items-center justify-center text-[#111827] shadow-[0_4px_16px_rgba(0,0,0,0.10)] transition-all duration-200 hover:bg-white hover:scale-105"
      >
        <svg width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
          <path d="M9 18l6-6-6-6" />
        </svg>
      </button>

    </section>
  );
}
