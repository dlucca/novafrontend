"use client";

import { motion } from "framer-motion";
import Image from "next/image";

const INSTAGRAM_URL = "https://www.instagram.com/novapatch.mx/";

const posts = [
  { id: 1, img: "/socialproof/1.webp", alt: "Novapatch Instagram post 1", likes: 312, comments: 24 },
  { id: 2, img: "/socialproof/2.webp", alt: "Novapatch Instagram post 2", likes: 248, comments: 19 },
  { id: 3, img: "/socialproof/3.webp", alt: "Novapatch Instagram post 3", likes: 195, comments: 15 },
  { id: 4, img: "/socialproof/4.webp", alt: "Novapatch Instagram post 4", likes: 421, comments: 38 },
  { id: 5, img: "/socialproof/5.webp", alt: "Novapatch Instagram post 5", likes: 387, comments: 31 },
];

function HeartIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" width="16" height="16">
      <path fillRule="evenodd" d="M18 10c0 3.866-3.582 7-8 7a8.841 8.841 0 01-4.083-.98L2 17l1.338-3.123C2.493 12.767 2 11.434 2 10c0-3.866 3.582-7 8-7s8 3.134 8 7zM7 9H5v2h2V9zm8 0h-2v2h2V9zm-5 0H8v2h2V9z" clipRule="evenodd" />
    </svg>
  );
}

function InstagramGradientIcon({ size = 28 }: { size?: number }) {
  return (
    <svg
      viewBox="0 0 48 48"
      width={size}
      height={size}
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <linearGradient id="ig-grad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f9a825" />
          <stop offset="40%" stopColor="#e91e63" />
          <stop offset="100%" stopColor="#7c4dff" />
        </linearGradient>
      </defs>
      <rect x="4" y="4" width="40" height="40" rx="12" stroke="url(#ig-grad)" strokeWidth="3" fill="none" />
      <circle cx="24" cy="24" r="9" stroke="url(#ig-grad)" strokeWidth="3" fill="none" />
      <circle cx="35.5" cy="12.5" r="2.5" fill="url(#ig-grad)" />
    </svg>
  );
}

export default function InstagramFeed() {
  return (
    <section className="py-20 bg-[var(--color-cream)]">
      <div className="max-w-7xl mx-auto px-4">

        {/* Header */}
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <span className="home-section-eyebrow">SÍGUENOS EN INSTAGRAM</span>
          <h2 className="home-section-title text-ocean mt-3">
            La comunidad que nos mueve
          </h2>
        </motion.div>

        {/* 5-column posts grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3 md:gap-4">
          {posts.map((post, i) => (
            <motion.a
              key={post.id}
              href={INSTAGRAM_URL}
              target="_blank"
              rel="noopener noreferrer"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.45, delay: i * 0.08, ease: [0.22, 1, 0.36, 1] }}
              className="group relative aspect-[4/5] rounded-2xl overflow-hidden shadow-sm block bg-stone-100"
              aria-label={post.alt}
            >
              {/* Post image */}
              <Image
                src={post.img}
                alt={post.alt}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 768px) 33vw, 20vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.06]"
              />

              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col items-center justify-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 text-white z-10 px-2">
                <InstagramGradientIcon size={26} />
                <div className="flex gap-3 text-xs font-bold">
                  <span className="flex items-center gap-1">
                    <HeartIcon />
                    {post.likes}
                  </span>
                  <span className="flex items-center gap-1">
                    <CommentIcon />
                    {post.comments}
                  </span>
                </div>
              </div>


            </motion.a>
          ))}
        </div>

        {/* CTA button */}
        <div className="text-center mt-10">
          <a
            href={INSTAGRAM_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-full border-2 border-stone-300 text-stone-600 font-semibold text-sm hover:border-[#e91e63] hover:text-[#e91e63] transition-all duration-300 hover:shadow-md"
          >
            <InstagramGradientIcon size={18} />
            Ver más en Instagram
          </a>
        </div>

      </div>
    </section>
  );
}
