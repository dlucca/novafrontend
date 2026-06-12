"use client";

import { useState } from "react";
import Image from "next/image";
import { useTranslations, useLocale } from 'next-intl'
import { Link } from '@/lib/i18n-navigation'
import CountrySelector from '@/components/CountrySelector'
import type { Locale } from '@/i18n/routing'

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
    if (email) { setSent(true); setEmail(""); }
  };

  return (
    <footer className="bg-blush text-navy">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-16">
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-10">
          {Object.entries(footerLinks).map(([cat, items]) => (
            <div key={cat}>
              <h4 className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-4">{cat}</h4>
              <ul className="flex flex-col gap-2.5">
                {items.map((item) => (
                  <li key={item.label}>
                    <Link href={item.href} className="text-sm text-navy/60 hover:text-navy transition-colors duration-200">
                      {item.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Newsletter */}
          <div className="col-span-2 md:col-span-4 lg:col-span-1">
            <h4 className="text-xs font-bold uppercase tracking-widest text-navy/40 mb-4">Newsletter</h4>
            <p className="text-sm text-navy/55 mb-4 leading-relaxed">{t('newsletter.label')}</p>
            {sent ? (
              <p className="text-sm text-lime font-semibold">{t('newsletter.success')}</p>
            ) : (
              <form onSubmit={handleSubmit} className="flex flex-col gap-2 mb-6">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder={t('newsletter.placeholder')}
                  required
                  className="w-full px-4 py-2.5 rounded-full bg-navy/6 border border-navy/15 text-sm text-navy placeholder-navy/35 focus:outline-none focus:border-coral/60 transition-colors duration-200"
                />
                <button
                  type="submit"
                  className="w-full px-4 py-2.5 bg-coral text-white text-sm font-semibold rounded-full hover:bg-coral-dark active:scale-95 transition-all duration-200"
                >
                  {t('newsletter.button')}
                </button>
              </form>
            )}
            <div className="flex gap-3">
              <a href="https://www.instagram.com/novapatch.mx?igsh=dGZ4cGNoNjluc3Vl" aria-label="Instagram" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-navy/8 hover:bg-navy/15 flex items-center justify-center transition-colors duration-200">
                <InstagramIcon />
              </a>
              <a href="https://www.tiktok.com/@novapatch.mx?_r=1&_t=ZS-95C7N0OkUke" aria-label="TikTok" target="_blank" rel="noopener noreferrer"
                className="w-9 h-9 rounded-xl bg-navy/8 hover:bg-navy/15 flex items-center justify-center transition-colors duration-200">
                <TikTokIcon />
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-navy/10">
        <div className="max-w-7xl mx-auto px-6 lg:px-8 py-5 flex flex-col md:flex-row items-center justify-between gap-4">
          <Image src="/logos/logocolor.webp" alt="Novapatch" width={130} height={36} className="h-7 w-auto object-contain opacity-40" />
          <CountrySelector currentLocale={locale} />
          <p className="text-[11px] text-navy/30 text-center tracking-wide">{t('copyright', { year: new Date().getFullYear() })}</p>
          <PaymentBadges locale={locale} />
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
          className="px-2 py-1 bg-navy/8 rounded text-[10px] text-navy/50 font-medium"
        >
          {m === 'visa' ? 'Visa' : m === 'mastercard' ? 'Mastercard' : m.toUpperCase()}
        </span>
      ))}
    </div>
  )
}

function InstagramIcon() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="var(--color-navy)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" opacity="0.7" aria-hidden="true" focusable="false">
      <title>Instagram</title>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <circle cx="17.5" cy="6.5" r="0.5" fill="var(--color-navy)" stroke="none" />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg width="14" height="16" viewBox="0 0 24 24" fill="var(--color-navy)" opacity="0.7" aria-hidden="true" focusable="false">
      <title>TikTok</title>
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V9.49a8.16 8.16 0 0 0 4.77 1.52V7.56a4.85 4.85 0 0 1-1-.87z" />
    </svg>
  );
}
