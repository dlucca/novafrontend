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
    <section className="w-full bg-[#FAF8F5] py-10 sm:py-14 border-t border-[#E6E1D8]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">
        <div className="grid grid-cols-5 gap-3 sm:gap-6 items-center text-center">
          {features.map((item, i) => (
            <motion.div
              key={item.label}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06, duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              className="flex flex-col items-center gap-2 group cursor-default"
            >
              <Image
                src={item.icon}
                alt={item.label}
                width={32}
                height={32}
                className="w-6 h-6 sm:w-7 sm:h-7 object-contain brightness-0 opacity-70 group-hover:opacity-100 transition-opacity"
              />
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#3A3A37] group-hover:text-[#0F0F0F] leading-tight transition-colors">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
