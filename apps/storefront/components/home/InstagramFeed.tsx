"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import Image from "next/image";

const INSTAGRAM_URL = "https://www.instagram.com/novapatch.mx/";

const posts = [
  { id: 1, img: "/socialproof/1.webp", alt: "Novapatch Instagram 1", likes: 312 },
  { id: 2, img: "/socialproof/2.webp", alt: "Novapatch Instagram 2", likes: 248 },
  { id: 3, img: "/socialproof/3.webp", alt: "Novapatch Instagram 3", likes: 195 },
  { id: 4, img: "/socialproof/4.webp", alt: "Novapatch Instagram 4", likes: 421 },
  { id: 5, img: "/socialproof/5.webp", alt: "Novapatch Instagram 5", likes: 387 },
];

function HeartIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="13" height="13">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
  );
}

function InstagramIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16" strokeLinecap="round" strokeLinejoin="round">
      <rect x="2" y="2" width="20" height="20" rx="5" ry="5" />
      <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </svg>
  );
}

export default function InstagramFeed() {
  const containerRef = useRef<HTMLElement>(null);

  // Rhode Skin Scroll Effect: Starts slightly scaled up (1.18) and scales down smoothly to (1.0) on scroll
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end start"],
  });
  const imageScale = useTransform(scrollYProgress, [0, 0.6], [1.18, 1.0]);

  return (
    <section ref={containerRef} className="py-16 sm:py-24 bg-[#FAF8F5] border-t border-[#E6E1D8]">
      <div className="max-w-[1240px] mx-auto px-6 sm:px-10">

        {/* Section Header */}
        <motion.div
          className="mb-8 text-left"
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        >
          <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase">
            novapatch + tú.
          </h2>
        </motion.div>

        {/* 5-Column Grid of Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3.5 sm:gap-5">
          {posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.4, delay: i * 0.06, ease: [0.22, 1, 0.36, 1] }}
              className="relative aspect-[4/5] rounded-xl overflow-hidden border border-[#E6E1D8] bg-white group shadow-2xs block hover:border-[#0F0F0F]/30 transition-colors"
              aria-label={post.alt}
            >
              {/* Post image with scroll-driven scale */}
              <motion.div style={{ scale: imageScale }} className="w-full h-full relative">
                <Image
                  src={post.img}
                  alt={post.alt}
                  fill
                  sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                  className="object-cover"
                />
              </motion.div>

              {/* Hover Overlay */}
              <div className="absolute inset-0 bg-[#0F0F0F]/75 flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-[#FAF8F5] z-10 px-3 text-center">
                <InstagramIcon />
                <span className="text-[10px] font-sans font-medium tracking-[0.14em] uppercase">
                  @novapatch.mx
                </span>
                <span className="flex items-center gap-1 text-[11px] font-sans font-medium text-[#FAF8F5]/80">
                  <HeartIcon />
                  {post.likes}
                </span>
              </div>
            </motion.a>
          ))}
        </div>

        {/* Footer CTA Button */}
        <div className="mt-10 flex justify-center">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-[#0F0F0F] text-[#FAF8F5] text-[12px] font-sans font-medium uppercase tracking-[0.12em] hover:bg-[#3A3A37] transition-all shadow-2xs active:scale-95"
          >
            <InstagramIcon />
            síguenos en instagram
          </a>
        </div>

      </div>
    </section>
  );
}
