import { SignUp } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { Gift, SlidersHorizontal, BellRing, Star } from "lucide-react";
import { novapatchAppearance } from "@/lib/clerk-theme";

const BENEFITS = [
  {
    icon: Gift,
    title: "Descuento en suscripción activa",
    desc:  "Ahorra automáticamente en cada ciclo recurrente.",
  },
  {
    icon: SlidersHorizontal,
    title: "Panel de control completo",
    desc:  "Pausa, cambia o cancela en cualquier momento.",
  },
  {
    icon: BellRing,
    title: "Recordatorios personalizados",
    desc:  "Te avisamos por email antes de cada renovación.",
  },
];

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex bg-[#FAF8F5]">

      {/* ── Panel izquierdo — Marca ── */}
      <div
        className="hidden lg:flex flex-col justify-between w-[460px] shrink-0 relative overflow-hidden px-12 py-12 bg-[#0F0F0F] text-white border-r border-[#E6E1D8]"
      >
        {/* Logo */}
        <Link href="/" className="relative z-10">
          <Image
            src="/logos/logowht.webp"
            alt="Novapatch"
            width={160}
            height={44}
            className="h-[34px] w-auto object-contain"
            priority
          />
        </Link>

        {/* Contenido */}
        <div className="relative z-10 space-y-8">
          <div>
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A] mb-3">
              únete a novapatch
            </p>
            <h2 className="text-3xl lg:text-4xl font-display font-semibold tracking-[-0.035em] text-white lowercase leading-tight mb-4">
              pega el parche.<br />olvídate del resto.
            </h2>
            <p className="font-sans text-sm text-[#A8A29A] leading-relaxed">
              Una cuenta unificada para tus pedidos y suscripciones automáticas.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-3">
            {BENEFITS.map((b) => (
              <div
                key={b.title}
                className="flex gap-3 p-3.5 rounded-xl bg-white/5 border border-white/10"
              >
                <b.icon className="h-5 w-5 shrink-0 mt-0.5 text-white" />
                <div>
                  <p className="font-sans text-xs font-semibold text-white leading-snug">
                    {b.title}
                  </p>
                  <p className="font-sans text-[11px] text-[#A8A29A] mt-0.5 leading-relaxed">
                    {b.desc}
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-3 p-4 rounded-xl bg-white/5 border border-white/10">
            <Star className="h-5 w-5 shrink-0 text-white" fill="currentColor" />
            <div>
              <p className="font-sans text-xs font-semibold text-white">
                +2,400 miembros en México
              </p>
              <p className="font-sans text-[11px] text-[#A8A29A] mt-0.5">
                ya cuidan su bienestar con Novapatch
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-4 text-xs font-sans text-[#A8A29A]">
          <p>© 2026 novapatch</p>
          <span>·</span>
          <a href="mailto:hola@novapatch.care" className="hover:text-white transition-colors">
            hola@novapatch.care
          </a>
        </div>
      </div>

      {/* ── Panel derecho — Formulario Clerk (embedded) ── */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">

        {/* Logo mobile */}
        <Link href="/" className="lg:hidden mb-10">
          <Image
            src="/logos/logocolor.webp"
            alt="Novapatch"
            width={150}
            height={42}
            className="h-[32px] w-auto object-contain"
          />
        </Link>

        {/* Formulario sin card chrome */}
        <div className="w-full" style={{ maxWidth: "400px" }}>
          <SignUp
            appearance={novapatchAppearance}
            routing="path"
            path="/sign-up"
            signInUrl="/sign-in"
            fallbackRedirectUrl="/"
          />
        </div>

        <p className="lg:hidden mt-10 text-xs font-sans text-[#A8A29A]">
          © 2026 novapatch · bienestar en formato tópico
        </p>
      </div>
    </div>
  );
}
