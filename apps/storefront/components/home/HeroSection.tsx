"use client";

import { useRef, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { useTranslations } from "next-intl";
import { useReducedMotion } from "framer-motion";

interface Slide {
  src: string;
  alt: string;
  accent: string;
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
      // onNav already pauses + schedules resume
    } else if (e.pointerType === "touch") {
      // Touch tap without swipe — resume after delay
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
      className="relative w-full overflow-hidden min-h-[580px] sm:min-h-0 sm:aspect-video touch-pan-y focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-inset"
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

      {/* Carousel track */}
      <div
        className="absolute inset-0 flex"
        style={{
          transform: `translateX(-${current * 100}%)`,
          transition: shouldReduceMotion ? "none" : "transform 600ms cubic-bezier(0.4,0,0.2,1)",
        }}
      >
        {slides.map((slide, i) => (
          <div
            key={i}
            role="group"
            aria-roledescription="diapositiva"
            aria-label={`${i + 1} de ${slides.length}`}
            aria-hidden={i !== current}
            className="relative min-w-full h-full flex-shrink-0"
          >
            <Image
              src={slide.src}
              alt={slide.alt}
              fill
              // En mobile centramos la imagen; en desktop mantenemos object-top
              className="object-cover object-center sm:object-top"
              priority={i === 0}
              sizes="100vw"
            />
          </div>
        ))}
      </div>

      {/* Gradient overlay
          Mobile: gradiente desde abajo (texto va abajo) y una capa superior
          Desktop: gradiente diagonal desde la izquierda como antes */}
      <div
        className="absolute inset-0 z-[1]"
        style={{
          background: [
            /* capa mobile — fondo oscuro abajo para el texto */
            "linear-gradient(to top, rgba(0,30,50,0.80) 0%, rgba(0,30,50,0.50) 40%, rgba(0,0,0,0.15) 100%)",
          ].join(", "),
        }}
      />
      {/* Capa adicional desktop que mantiene el estilo original */}
      <div
        className="absolute inset-0 z-[1] hidden sm:block"
        style={{
          background:
            "linear-gradient(100deg, rgba(0,55,65,0.55) 0%, rgba(0,55,65,0.28) 42%, rgba(0,0,0,0.0) 100%)",
        }}
      />

      {/* ── Text overlay ──────────────────────────────────────────────────────────
          Mobile:   fijo al fondo (items-end), padding generoso, todo centrado
          Desktop:  centrado verticalmente, alineado a la izquierda como antes  */}
      <div className="absolute inset-0 z-[2] flex items-end sm:items-center pb-14 sm:pb-0">
        <div className="max-w-[1200px] mx-auto px-5 sm:px-8 lg:px-14 w-full">
          <div className="max-w-[560px] mx-auto sm:mx-0">

            {/* Headline
                Mobile: más compacto, sin salto de línea forzado → el texto fluye
                Desktop: tamaño grande con salto de línea */}
            <h1
              className="text-white font-black leading-[1.08] mb-3 sm:mb-4 tracking-[-0.02em] text-center sm:text-left"
              style={{ fontSize: "clamp(34px, 8vw, 62px)" }}
            >
              {t("title")}
            </h1>

            {/* Subtitle */}
            <p
              className="text-white/85 font-normal mb-6 sm:mb-9 leading-[1.6] max-w-[400px] mx-auto sm:mx-0 text-center sm:text-left"
              style={{ fontSize: "clamp(14px, 3.5vw, 17px)" }}
            >
              {t("subtitle")}
            </p>

            {/* CTAs
                Mobile: botones full-width apilados verticalmente
                Desktop: fila horizontal */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
              <Link
                href="#productos"
                className="inline-flex items-center justify-center gap-2 bg-white font-bold px-7 py-3.5 rounded-full transition-all duration-200 hover:-translate-y-0.5 hover:shadow-[0_8px_28px_rgba(0,0,0,0.2)] shadow-[0_4px_20px_rgba(0,0,0,0.15)]"
                style={{ color: "var(--color-ocean)", fontSize: "clamp(14px, 3.5vw, 15px)" }}
              >
                {t("cta")}
                <svg width="15" height="15" fill="none" stroke="currentColor" strokeWidth="2.5" viewBox="0 0 24 24">
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </Link>
              <Link
                href="#como-funciona"
                className="inline-flex items-center justify-center gap-2 bg-transparent text-white font-semibold px-6 py-3.5 rounded-full transition-all duration-200 hover:bg-white/15"
                style={{
                  border: "2px solid rgba(255,255,255,0.5)",
                  fontSize: "clamp(14px, 3.5vw, 15px)",
                }}
              >
                {t("ctaSecondary")}
              </Link>
            </div>

          </div>
        </div>
      </div>

      {/* Prev/Next — ocultos en mobile (demasiado pequeños para tocar) */}
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

      {/* Dots — 44×44px touch target wrapping the visual dot */}
      <div role="tablist" aria-label="Diapositivas" className="absolute bottom-0 sm:bottom-1 left-1/2 -translate-x-1/2 z-[5] flex items-center">
        {slides.map((s, i) => (
          <button
            key={i}
            role="tab"
            onClick={() => onDot(i)}
            aria-label={`Diapositiva ${i + 1} de ${slides.length}`}
            aria-selected={i === current}
            className="flex items-center justify-center"
            style={{ width: "44px", height: "44px" }}
          >
            <span
              className="rounded-full block transition-all duration-[350ms]"
              style={{
                height: "8px",
                width: i === current ? "24px" : "8px",
                background: i === current ? s.accent : "rgba(255,255,255,0.5)",
              }}
            />
          </button>
        ))}
      </div>
    </section>
  );
}
