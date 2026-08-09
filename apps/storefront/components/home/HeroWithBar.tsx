"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import HeroSection from "./HeroSection";
import AttributeBar from "./AttributeBar";

export const slides = [
  { src: "/carousel/Glow-new.webp",   alt: "Novapatch Glow",   accent: "#F25C54", key: "glow" },
  { src: "/carousel/Shield-new.webp", alt: "Novapatch Shield", accent: "#FFA849", key: "shield" },
  { src: "/carousel/Energy-new.webp", alt: "Novapatch Energy", accent: "#83B5F4", key: "energy" },
  { src: "/carousel/Sleep-new.webp",  alt: "Novapatch Sleep",  accent: "#1EB1BC", key: "sleep" },
  { src: "/carousel/Woman-new.webp",  alt: "Novapatch Woman",  accent: "#C693C4", key: "woman" },
  { src: "/carousel/Zen-new.webp",    alt: "Novapatch Zen",    accent: "#4E82BC", key: "zen" },
];

const AUTO_ADVANCE_MS = 4500;
const RESUME_DELAY_MS = 6000;

export default function HeroWithBar() {
  const [current, setCurrent] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const pausedRef = useRef(false);
  const resumeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const clearResumeTimer = useCallback(() => {
    if (resumeTimerRef.current) {
      clearTimeout(resumeTimerRef.current);
      resumeTimerRef.current = null;
    }
  }, []);

  const startAutoAdvance = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      if (!pausedRef.current) {
        setCurrent((c) => (c + 1) % slides.length);
      }
    }, AUTO_ADVANCE_MS);
  }, []);

  const pause = useCallback(() => {
    pausedRef.current = true;
    clearResumeTimer();
  }, [clearResumeTimer]);

  const scheduleResume = useCallback(() => {
    clearResumeTimer();
    resumeTimerRef.current = setTimeout(() => {
      pausedRef.current = false;
      startAutoAdvance();
    }, RESUME_DELAY_MS);
  }, [clearResumeTimer, startAutoAdvance]);

  useEffect(() => {
    startAutoAdvance();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      clearResumeTimer();
    };
  }, [startAutoAdvance, clearResumeTimer]);

  const handleNav = (dir: number) => {
    setCurrent((c) => (c + dir + slides.length) % slides.length);
    pause();
    scheduleResume();
  };

  const handleDot = (i: number) => {
    setCurrent(i);
    pause();
    scheduleResume();
  };

  const handlePause = useCallback(() => {
    pause();
  }, [pause]);

  const handleResume = useCallback(() => {
    scheduleResume();
  }, [scheduleResume]);

  return (
    <>
      <HeroSection
        slides={slides}
        current={current}
        onNav={handleNav}
        onDot={handleDot}
        onPause={handlePause}
        onResume={handleResume}
      />
      <AttributeBar accent={slides[current].accent} />
    </>
  );
}
