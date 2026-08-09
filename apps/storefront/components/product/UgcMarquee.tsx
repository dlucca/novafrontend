"use client";

import Image from "next/image";

const IMAGES = Array.from({ length: 16 }, (_, i) => `/comunidad/${i + 1}.webp`);


export default function UgcMarquee({ accent }: { accent: string }) {
  // Double the array to ensure seamless infinite scroll loop
  const doubleImages = [...IMAGES, ...IMAGES];

  return (
    <section className="bg-white py-16 overflow-hidden border-b border-[#0D1B35]/5">
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .animate-marquee {
          display: flex;
          width: max-content;
          animation: marquee 50s linear infinite;
        }
      `}</style>

      <div className="text-center mb-10 px-6">
        <span 
          className="block text-[11px] font-bold uppercase tracking-[0.2em] mb-2"
          style={{ color: accent }}
        >
          Gente real · Bienestar real
        </span>
        <h2 className="text-[clamp(24px,2.5vw,36px)] font-black text-[#0D1B35] tracking-tight">
          Nuestra Comunidad de Novapatchers
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Soft gradient masks on left and right for high-end look */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-white to-transparent z-[2] pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-white to-transparent z-[2] pointer-events-none" />

        <div className="animate-marquee gap-4 px-4">
          {doubleImages.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/5] w-[180px] sm:w-[220px] overflow-hidden rounded-[24px] bg-[#FAF7F2] shadow-sm border border-[#0D1B35]/5 cursor-pointer group"
            >
              <Image
                src={src}
                alt={`Comunidad Novapatch cliente ${idx % IMAGES.length + 1}`}
                fill
                sizes="(max-width: 640px) 180px, 220px"
                className="object-cover"
              />
              {/* Dark overlay that fades out on hover */}
              <div className="absolute inset-0 bg-black/15 z-[1] transition-opacity duration-300 group-hover:opacity-0 pointer-events-none" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
