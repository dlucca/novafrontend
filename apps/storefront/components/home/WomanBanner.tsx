"use client";

import { useRef } from "react";
import Image from "next/image";
import { Link } from "@/lib/i18n-navigation";
import { motion, useScroll, useTransform } from "framer-motion";

export default function WomanBanner() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rhode Skin Scroll Effect: Starts slightly scaled up (1.15) and scales down smoothly to (1.0) on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.18, 1.0]);

  return (
    <section className="py-16 sm:py-24 px-4 sm:px-8 max-w-[1400px] mx-auto bg-[#FAF8F5]">
      {/* Boxy Editorial Card Container with Rounded Corners */}
      <div
        ref={containerRef}
        className="relative w-full min-h-[560px] sm:min-h-[660px] lg:min-h-[720px] rounded-xl sm:rounded-2xl overflow-hidden bg-white border border-[#E6E1D8] shadow-2xs flex flex-col justify-center p-8 sm:p-14 lg:p-16"
      >
        {/* Background Image with Scroll-Driven Scale (No Hover Zoom) */}
        <motion.div style={{ scale: imageScale }} className="absolute inset-0">
          <Image
            src="/productusers/Banner_woman.webp"
            alt="Novapatch Woman"
            fill
            priority
            sizes="(max-width: 1400px) 100vw, 1400px"
            className="object-cover object-[82%_center] md:object-center"
          />
        </motion.div>

        {/* Soft Left Background Gradient Mask for Text Legibility (Keeps image crisp & vibrant on the right) */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/60 to-transparent w-[85%] sm:w-[60%] z-[1]" />

        {/* Content Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="relative z-10 max-w-xl flex flex-col items-start"
        >

          {/* Headline in Space Grotesk (Brand Kit Definitivo — lowercase, left aligned, font-display) */}
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight mb-4 lowercase">
            sigue tu ritmo,<br />
            siente tu bienestar.
          </h2>

          {/* Subtitle */}
          <p className="font-sans font-normal text-base sm:text-lg text-[#3A3A37] max-w-md mb-8 leading-relaxed">
            Fórmula diseñada para acompañar cada fase de tu ciclo y brindar soporte natural en tu día a día.
          </p>

          {/* Action Button */}
          <Link
            href="/tienda/woman"
            className="inline-flex items-center justify-center bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] px-8 py-4 rounded-full text-[12px] font-sans font-medium uppercase tracking-[0.12em] transition-all shadow-2xs active:scale-95"
          >
            conocer novapatch woman
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
