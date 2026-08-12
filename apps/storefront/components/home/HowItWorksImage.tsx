"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";

const IMAGES = [
  { src: "/productusers/hombre_patch_arm.webp", alt: "Hombre aplicando parche Novapatch" },
  { src: "/productusers/mujer_patch_ribs.webp", alt: "Mujer aplicando parche Novapatch" },
];

export default function HowItWorksImage() {
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % IMAGES.length);
    }, 7000);

    return () => clearInterval(timer);
  }, []);

  return (
    <div className="relative w-full rounded-3xl overflow-hidden shadow-md border border-stone-200/60 bg-stone-100" style={{ height: "480px" }}>
      <AnimatePresence mode="wait">
        <motion.div
          key={IMAGES[currentIndex].src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
          className="absolute inset-0"
        >
          <Image
            src={IMAGES[currentIndex].src}
            alt={IMAGES[currentIndex].alt}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority={currentIndex === 0}
          />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
