import { SignIn } from "@clerk/nextjs";
import Image from "next/image";
import Link from "next/link";
import { ClipboardList, RefreshCw, CreditCard, MapPin } from "lucide-react";
import { novapatchAppearance } from "@/lib/clerk-theme";

const PERKS = [
  { icon: ClipboardList, label: "Historial de pedidos completo" },
  { icon: RefreshCw,    label: "Gestión de suscripciones activa" },
  { icon: CreditCard,   label: "Tarjetas y pagos tokenizados" },
  { icon: MapPin,       label: "Direcciones de envío guardadas" },
];

export default function SignInPage() {
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

        {/* Contenido central */}
        <div className="relative z-10 space-y-10">
          <div>
            <p className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A] mb-3">
              tu cuenta novapatch
            </p>
            <h2 className="text-3xl lg:text-4xl font-display font-semibold tracking-[-0.035em] text-white lowercase leading-tight mb-4">
              bienestar, siempre contigo.
            </h2>
            <p className="font-sans text-sm text-[#A8A29A] leading-relaxed">
              Ingresa para consultar tus pedidos, personalizar tus suscripciones y gestionar tus preferencias.
            </p>
          </div>

          {/* Perks */}
          <div className="space-y-3">
            {PERKS.map((p) => (
              <div key={p.label} className="flex items-center gap-3 py-1">
                <span className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 shrink-0 text-white">
                  <p.icon className="h-4 w-4" />
                </span>
                <span className="font-sans text-xs text-white/80 font-medium">
                  {p.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Footer */}
        <div className="relative z-10 flex items-center gap-4 text-xs font-sans text-[#A8A29A]">
          <p>© 2026 novapatch</p>
          <span>·</span>
          <Link href="/privacidad" className="hover:text-white transition-colors">
            Privacidad
          </Link>
          <span>·</span>
          <Link href="/terminos" className="hover:text-white transition-colors">
            Términos
          </Link>
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
          <SignIn
            appearance={novapatchAppearance}
            routing="path"
            path="/sign-in"
            signUpUrl="/sign-up"
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
