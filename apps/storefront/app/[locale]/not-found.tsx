"use client";

import Link from "next/link";
import { useParams } from "next/navigation";

export default function NotFound() {
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";

  return (
    <main className="flex min-h-screen items-center justify-center px-6 py-32 bg-[#FAF8F5]">
      <div className="flex max-w-lg flex-col items-center gap-6 text-center">
        <div className="relative">
          <span className="block select-none font-mono text-8xl font-bold leading-none text-[#E6E1D8]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-4xl">🩹</span>
          </div>
        </div>

        <div>
          <h1 className="mb-3 text-3xl sm:text-4xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] lowercase">
            esta página no existe.
          </h1>
          <p className="font-sans text-base text-[#3A3A37] leading-relaxed">
            Parece que este parche se despegó. La página que buscas no está disponible.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] text-[11px] font-sans font-medium uppercase tracking-[0.12em] px-6 py-3.5 rounded-full transition-all"
          >
            Ir al inicio
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path
                d="M3 8h10M9 4l4 4-4 4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </Link>
          <Link
            href={`/${locale}/tienda`}
            className="inline-flex items-center gap-2 bg-white text-[#0F0F0F] border border-[#E6E1D8] hover:border-[#0F0F0F] text-[11px] font-sans font-medium uppercase tracking-[0.12em] px-6 py-3.5 rounded-full transition-all"
          >
            Ver la tienda
          </Link>
        </div>
      </div>
    </main>
  );
}
