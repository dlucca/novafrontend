"use client";

import * as Sentry from '@sentry/nextjs';
import { useEffect } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function Error({ error, reset }: { error: Error & { digest?: string }; reset: () => void }) {
  useEffect(() => {
    console.error(error);
    Sentry.captureException(error);
  }, [error]);

  const params = useParams();
  const locale = (params?.locale as string) ?? "mx";

  return (
    <main className="min-h-screen flex items-center justify-center px-6 py-32 bg-[#FAF8F5]">
      <div className="max-w-lg text-center flex flex-col items-center gap-6">
        <div className="w-16 h-16 rounded-full bg-white border border-[#E6E1D8] flex items-center justify-center text-3xl shadow-2xs">
          ⚠️
        </div>

        <div>
          <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] lowercase mb-3">
            algo salió mal.
          </h1>
          <p className="font-sans text-base text-[#3A3A37] leading-relaxed">
            Ocurrió un error inesperado. Puedes intentar cargar la página de nuevo o volver al inicio.
          </p>
        </div>

        <div className="flex flex-wrap gap-3 justify-center">
          <button
            onClick={reset}
            className="inline-flex items-center gap-2 bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] text-[11px] font-sans font-medium uppercase tracking-[0.12em] px-6 py-3.5 rounded-full transition-all cursor-pointer"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
              <path d="M13 2v4H9M3 14v-4h4M13 6A6 6 0 1 1 7 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Reintentar
          </button>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 bg-white text-[#0F0F0F] border border-[#E6E1D8] hover:border-[#0F0F0F] text-[11px] font-sans font-medium uppercase tracking-[0.12em] px-6 py-3.5 rounded-full transition-all"
          >
            Ir al inicio
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-[#A8A29A] font-mono">Error ID: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
