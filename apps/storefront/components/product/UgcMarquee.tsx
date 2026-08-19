"use client";

import Image from "next/image";

const IMAGES = Array.from({ length: 16 }, (_, i) => `/comunidad/${i + 1}.webp`);


export default function UgcMarquee({ accent }: { accent: string }) {
  // Double the array to ensure seamless infinite scroll loop
  const doubleImages = [...IMAGES, ...IMAGES];

  return (
    <section className="bg-[#FAF8F5] py-16 overflow-hidden border-b border-[#E6E1D8]">
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

      <div className="text-left max-w-6xl mx-auto mb-8 px-6">
        <h2 className="text-4xl sm:text-5xl lg:text-6xl font-display font-semibold text-[#0F0F0F] tracking-[-0.03em] leading-tight lowercase">
          comunidad novapatch.
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        {/* Soft gradient masks on left and right for high-end look */}
        <div className="absolute left-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-r from-[#FAF8F5] to-transparent z-[2] pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 md:w-32 bg-gradient-to-l from-[#FAF8F5] to-transparent z-[2] pointer-events-none" />

        <div className="animate-marquee gap-4 px-4">
          {doubleImages.map((src, idx) => (
            <div
              key={idx}
              className="relative aspect-[4/5] w-[180px] sm:w-[220px] overflow-hidden rounded-xl bg-[#FAF8F5] border border-[#E6E1D8] shadow-2xs cursor-pointer group"
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
