"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ProcessImageWithScroll() {
  const containerRef = useRef<HTMLDivElement>(null);

  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.18, 1.0]);

  return (
    <div ref={containerRef} className="relative aspect-[3/4] w-full overflow-hidden rounded-xl border border-[#E6E1D8] shadow-2xs bg-[#0F0F0F]">
      <motion.div style={{ scale: imageScale }} className="w-full h-full relative">
        <Image
          src="/productusers/Banner_suscripciones.webp"
          alt="Suscripciones Novapatch así de simple"
          fill
          sizes="(max-width: 1024px) 100vw, 320px"
          className="object-cover object-center"
        />
      </motion.div>
      {/* Dark Gradient Overlay matching Home & Ciencia */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/25 to-black/10 z-[1] pointer-events-none" />
    </div>
  );
}
