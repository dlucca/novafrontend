"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function HeroImageWithScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.18, 1.0]);

  return (
    <div ref={containerRef} className="relative aspect-square w-full overflow-hidden rounded-xl bg-[#0F0F0F] border border-[#E6E1D8] shadow-2xs">
      <motion.div style={{ scale: imageScale }} className="w-full h-full relative">
        <Image
          src="/productusers/Hero_suscripciones.webp"
          alt="Suscripción de bienestar Novapatch"
          fill
          sizes="(max-width: 1024px) 100vw, 50vw"
          priority
          className="object-cover object-center"
        />
      </motion.div>
      {/* Dark Gradient Overlay matching Home & Ciencia Hero */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10 z-[1] pointer-events-none" />
    </div>
  );
}
