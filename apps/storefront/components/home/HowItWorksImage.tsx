"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";

const IMAGES = [
  { src: "/productusers/hombre_patch_arm.webp", alt: "Hombre aplicando parche Novapatch" },
  { src: "/productusers/mujer_patch_ribs.webp", alt: "Mujer aplicando parche Novapatch" },
];

export default function HowItWorksImage() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const containerRef = useRef<HTMLDivElement>(null);

  // Rhode Skin Scroll Effect: Starts slightly scaled up (1.18) and scales down smoothly to (1.0) on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.18, 1.0]);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 3500);

    return () => clearInterval(timer);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative w-full rounded-xl overflow-hidden shadow-2xs border border-[#E6E1D8] bg-[#FAF8F5]"
      style={{ height: "480px" }}
    >
      <AnimatePresence mode="wait">
        <motion.div
          key={IMAGES[currentIndex].src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <motion.div style={{ scale: imageScale }} className="w-full h-full relative">
            <Image
              src={IMAGES[currentIndex].src}
              alt={IMAGES[currentIndex].alt}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
              priority={currentIndex === 0}
            />
          </motion.div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
