"use client"

import Link from "next/link"
import { useParams } from "next/navigation"

// 404 dentro del segmento [locale]: hereda los providers del layout y enlaza
// al home del locale actual. La versión raíz (app/not-found.tsx) queda para
// rutas fuera de todo locale.
export default function NotFound() {
  const params = useParams()
  const locale = typeof params?.locale === "string" ? params.locale : "mx"

  return (
    <main
      className="flex min-h-screen items-center justify-center px-6 py-32"
      style={{ background: "linear-gradient(160deg, #EAF5FB 0%, #FAF7F2 100%)" }}
    >
      <div className="flex max-w-lg flex-col items-center gap-6 text-center">
        <div className="relative">
          <span className="block select-none text-[10rem] font-black leading-none text-[#E8503A]/[0.12]">
            404
          </span>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-6xl">🩹</span>
          </div>
        </div>

        <div>
          <h1 className="mb-3 text-3xl font-bold text-[#0D1B35]">Esta página no existe</h1>
          <p className="text-lg leading-relaxed text-[#0D1B35]/55">
            Parece que este parche se despegó. La página que buscas no está aquí,
            pero el bienestar sí.
          </p>
        </div>

        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 rounded-2xl bg-[#E8503A] px-8 py-4 font-semibold text-white transition hover:opacity-90"
          >
            Ir al inicio
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
            className="inline-flex items-center gap-2 rounded-2xl border-2 border-[#0D1B35]/10 bg-white px-8 py-4 font-semibold text-[#0D1B35] transition hover:border-[#0D1B35]/25"
          >
            Ver la tienda
          </Link>
        </div>
      </div>
    </main>
  )
}
