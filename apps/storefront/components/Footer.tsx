"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n-navigation'
import CountrySelector from '@/components/CountrySelector'
import type { Locale } from '@/i18n/routing'
import { trackMeta } from '@/lib/meta'

export default function Footer() {
  const t = useTranslations('footer')
  const locale = useLocale() as Locale
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);

  const footerLinks = {
    [t('sections.comprar')]: [
      { label: t('links.tienda'), href: "/tienda" },
      { label: t('links.suscripciones'), href: "/suscripciones" },
      { label: t('links.garantia'), href: "/garantia" },
    ],
    [t('sections.ayuda')]: [
      { label: t('links.contacto'), href: "/contacto" },
      { label: t('links.faq'), href: "/faq" },
      { label: t('links.reembolso'), href: "/reembolso" },
    ],
    [t('sections.nosotros')]: [
      { label: t('links.nosotros'), href: "/nosotros" },
      { label: "La Ciencia", href: "/ciencia" },
      { label: t('links.porQue'), href: "/nosotros#por-que" },
      { label: t('links.suscribeteAhorra'), href: "/suscripciones" },
    ],
    [t('sections.legal')]: [
      { label: t('links.privacidad'), href: "/privacidad" },
      { label: t('links.terminos'), href: "/terminos" },
    ],
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      // Meta Lead — alta al newsletter (capturar email antes de limpiarlo).
      trackMeta("Lead", { content_name: "newsletter" }, { email });
      setSent(true);
      setEmail("");
    }
  };

  return (
    <footer className="bg-white text-[#0F0F0F] border-t border-[#E6E1D8]">
      <div className="max-w-[1240px] mx-auto px-6 lg:px-10 py-16 sm:py-20">
        <div className="grid grid-cols-1 md:grid-cols-6 gap-8 lg:gap-10 pb-16 border-b border-[#E6E1D8]">
          {/* Brand Block */}
          <div className="md:col-span-2 space-y-3 pr-4">
            <Link
              href="/"
              aria-label="Novapatch"
              className="font-sans font-bold text-[24px] tracking-[-0.035em] text-[#0F0F0F] hover:opacity-85 transition-opacity inline-block lowercase"
            >
              novapatch
            </Link>
            <p className="text-xs font-sans font-normal text-[#3A3A37] max-w-sm leading-relaxed">
              Bienestar en formato tópico de liberación continua. Seis fórmulas diseñadas para acompañar tu día — no para reinventarlo.
            </p>
          </div>

          {/* Links Columns (4 Columns: Comprar, Ayuda, Nosotros, Legal) */}
          {Object.entries(footerLinks).map(([cat, items]) => (
            <div key={cat} className="md:col-span-1">
              <h4 className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A] mb-4">{cat}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-xs font-sans text-[#3A3A37] hover:text-[#0F0F0F] transition-colors">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter Subscription Block */}
          <div className="md:col-span-2 space-y-3">
            <h4 className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A]">boletín</h4>
            <p className="text-xs font-sans text-[#3A3A37] leading-relaxed">
              Un solo correo cuando haya novedades o lanzamientos. Sin spam.
            </p>
            {sent ? (
              <div className="p-3 rounded-full bg-[#FAF8F5] border border-[#E6E1D8] text-xs font-sans text-[#0F0F0F] text-center font-medium">
                ✓ Te has suscrito correctamente.
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="tu@email.com"
                  required
                  className="flex-1 px-4 py-2 text-xs font-sans text-[#0F0F0F] bg-white border border-[#E6E1D8] focus:border-[#0F0F0F] focus:outline-none rounded-full"
                />
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] text-[11px] font-sans font-medium uppercase tracking-[0.12em] rounded-full transition-all cursor-pointer"
                >
                  Unirme
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Base Footer Row */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-sans text-[#A8A29A]">
          <span>© 2026 novapatch · méxico</span>
          <div className="flex items-center gap-6">
            <CountrySelector currentLocale={locale} />
            <PaymentBadges locale={locale} />
          </div>
        </div>
      </div>
    </footer>
  );
}

const PAYMENT_METHODS: Record<string, Array<'visa' | 'mastercard' | 'oxxo' | 'spei' | 'pix' | 'boleto'>> = {
  mx: ['visa', 'mastercard'],
  br: ['visa', 'mastercard', 'pix', 'boleto'],
  ar: ['visa', 'mastercard'],
  cl: ['visa', 'mastercard'],
  co: ['visa', 'mastercard'],
}

function PaymentBadges({ locale }: { locale: string }) {
  const methods = PAYMENT_METHODS[locale] ?? ['visa', 'mastercard']
  return (
    <div className="flex items-center gap-1.5">
      {methods.map((m) => (
        <span
          key={m}
          className="px-2.5 py-0.5 bg-[#FAF8F5] border border-[#E6E1D8] rounded-full text-[10px] font-mono text-[#3A3A37] font-medium"
        >
          {m === 'visa' ? 'Visa' : m === 'mastercard' ? 'Mastercard' : m.toUpperCase()}
        </span>
      ))}
    </div>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" aria-hidden="true" focusable="false">
      <title>Instagram</title>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 24 24" fill="currentColor" opacity="0.7" aria-hidden="true" focusable="false">
      <title>TikTok</title>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.49a8.16 8.16 0 0 0 4.77 1.52V7.56a4.85 4.85 0 0 1-1-.87z" />
    </svg>
  );
}
