"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";

export default function ComparisonImage() {
  const containerRef = useRef<HTMLDivElement>(null);

  // Rhode Skin Scroll Effect: Starts slightly scaled up (1.18) and scales down smoothly to (1.0) on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.18, 1.0]);

  return (
    <div ref={containerRef} className="relative flex flex-col h-full min-h-[360px] sm:min-h-[420px] lg:min-h-0">
      <div className="flex-1 min-h-[320px] sm:min-h-[380px] lg:min-h-0 rounded-xl overflow-hidden border border-[#E6E1D8] relative bg-[#0F0F0F]">
        <motion.div style={{ scale: imageScale }} className="w-full h-full relative">
          <Image
            src="/productusers/armpatch.webp"
            alt="Novapatch en uso"
            fill
            loading="lazy"
            className="object-cover object-top"
            sizes="(max-width: 1024px) 100vw, 45vw"
          />
        </motion.div>
        {/* Dark Gradient Overlay for rich contrast */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-[1] pointer-events-none" />

        {/* Overlaid Text at Bottom-Left */}
        <div className="absolute bottom-0 left-0 right-0 p-6 sm:p-8 z-[2] text-left">
          <strong className="block text-base sm:text-lg font-sans font-semibold text-white tracking-tight lowercase mb-1">
            un parche por día. 30 en el sobre.
          </strong>
          <span className="text-xs sm:text-sm font-sans font-normal text-white/80 lowercase">
            sin sabor, sin recordar, sin fricción.
          </span>
        </div>
      </div>
    </div>
  );
}
