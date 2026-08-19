"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Link } from "@/lib/i18n-navigation";
import Image from "next/image";

export default function HeroSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rhode Skin Scroll Effect: Starts slightly scaled up (1.15) and scales down smoothly to (1.0) on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 1], [1.15, 1.0]);

  return (
    <section className="pt-24 pb-12 sm:pb-16 px-4 sm:px-8 max-w-[1400px] mx-auto bg-[#FAF8F5]">
      {/* Full-width Rhode Skin Style Hero Stage */}
      <div
        ref={containerRef}
        className="relative w-full min-h-[540px] sm:min-h-[640px] lg:min-h-[700px] rounded-xl sm:rounded-2xl overflow-hidden bg-[#0F0F0F] shadow-[0_12px_40px_rgba(15,15,15,0.06)] border border-[#E6E1D8]/80 flex flex-col justify-between p-6 sm:p-12 lg:p-16"
      >
        {/* Background Carousel Image with Scroll-Driven Scale */}
        <motion.div style={{ scale: imageScale }} className="absolute inset-0">
          <Image
            src="/carousel/Banner_hero.webp"
            alt="Novapatch Bienestar Silencioso"
            fill
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover object-center"
          />
        </motion.div>

        {/* Gradient Overlay for Legibility */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/15 z-[1]" />

        {/* Bottom Floating Text Content (Brand Kit V2 — Open Sauce Sans, Lowercase, Left Aligned) */}
        <div className="relative z-10 max-w-2xl mt-auto pt-16 text-left">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="font-display font-bold text-white tracking-[-0.035em] leading-[0.95] mb-5 lowercase"
            style={{ fontSize: "clamp(48px, 7.5vw, 108px)" }}
          >
            bienestar<br />
            silencioso.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.25 }}
            className="font-sans font-normal text-base sm:text-lg text-white/90 leading-relaxed max-w-xl mb-8"
          >
            Suplementación en parches que acompaña tu cuerpo sin estorbar: transparente, sin pastillas y sin horarios rígidos. Te lo pegas y te olvidas. En un mundo de ruidos y distracciones, cuidarte no debería ser un ruido más.
          </motion.p>

          {/* Action Pill Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center gap-4"
          >
            <Link
              href="/tienda"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-[#0F0F0F] hover:bg-[#FAF8F5] rounded-full text-[12px] font-sans font-medium uppercase tracking-[0.14em] transition-all shadow-md active:scale-95"
            >
              ir a tienda
            </Link>
            <Link
              href="/ciencia"
              className="inline-flex items-center justify-center px-8 py-4 bg-black/20 text-white hover:bg-white hover:text-[#0F0F0F] border border-white/70 rounded-full text-[12px] font-sans font-medium uppercase tracking-[0.14em] transition-all backdrop-blur-sm active:scale-95"
            >
              conocer la ciencia
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
