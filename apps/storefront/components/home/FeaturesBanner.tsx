"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const features = [
  { icon: "/features/not_sugar-cropped.svg", label: "Sin azúcar" },
  { icon: "/features/vegan-cropped.svg", label: "100% Vegano" },
  { icon: "/features/gluten_free-cropped.svg", label: "Sin gluten" },
  { icon: "/features/water_proo-cropped.svg", label: "Resistente al agua" },
  { icon: "/features/not_latex-cropped.svg", label: "Sin látex" },
];

export default function FeaturesBanner() {
  return (
    <section className="w-full bg-gradient-to-b from-white to-stone-50 py-8 sm:py-10 border-none">
      <div className="max-w-5xl mx-auto px-2 sm:px-6 overflow-x-auto no-scrollbar">
        <div className="grid grid-cols-5 gap-1.5 sm:gap-4 items-start sm:items-center text-center min-w-[340px] sm:min-w-0">
          {features.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-1.5 sm:gap-2 group cursor-default px-0.5"
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={32}
                height={32}
                className="w-6 h-6 sm:w-8 sm:h-8 object-contain brightness-0 opacity-75 group-hover:opacity-100 group-hover:scale-105 transition-all duration-200"
              />
              <span className="text-[10px] sm:text-[13px] font-semibold text-[#0D1B35]/80 group-hover:text-[#0D1B35] leading-tight transition-colors">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
