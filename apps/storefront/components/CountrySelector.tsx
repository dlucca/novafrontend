// apps/storefront/components/CountrySelector.tsx
'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { useTranslations } from 'next-intl'
import { useRouter, usePathname } from '@/lib/i18n-navigation'
import { routing, type Locale } from '@/i18n/routing'

export default function CountrySelector({ currentLocale }: { currentLocale: Locale }) {
  const t = useTranslations('footer')
  const router = useRouter()
  const pathname = usePathname()
  const [open, setOpen] = useState(false)
  const [focusedIndex, setFocusedIndex] = useState<number>(-1)
  const ref = useRef<HTMLDivElement>(null)
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([])
  const locales = routing.locales

  useEffect(() => {
    function handleOutside(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', handleOutside)
    return () => document.removeEventListener('mousedown', handleOutside)
  }, [])

  useEffect(() => {
    if (open && focusedIndex >= 0) {
      optionRefs.current[focusedIndex]?.focus()
    }
  }, [open, focusedIndex])

  function select(locale: Locale) {
    router.push(pathname, { locale })
    setOpen(false)
  }

  function handleTriggerKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'ArrowDown' || e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      setOpen(true)
      setFocusedIndex(0)
    } else if (e.key === 'Escape') {
      setOpen(false)
    }
  }

  const handleOptionKeyDown = useCallback((e: React.KeyboardEvent, index: number, locale: Locale) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setFocusedIndex((index + 1) % locales.length)
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setFocusedIndex((index - 1 + locales.length) % locales.length)
    } else if (e.key === 'Escape') {
      setOpen(false)
    } else if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault()
      select(locale)
    }
  }, [locales.length])

  return (
    <div ref={ref} className="relative">
      <button
        onClick={() => { setOpen(!open); setFocusedIndex(-1) }}
        onKeyDown={handleTriggerKeyDown}
        className="flex items-center gap-1.5 text-[11px] text-[#A8A29A] hover:text-[#0F0F0F] transition-colors duration-200 focus-visible:outline-none focus-visible:text-[#0F0F0F]"
        aria-expanded={open}
        aria-haspopup="listbox"
        aria-label={`Seleccionar región: ${t(`markets.${currentLocale}`)}`}
      >
        <GlobeIcon />
        <span className="font-medium tracking-wide">{t(`markets.${currentLocale}`)}</span>
        <svg
          width="10" height="10" viewBox="0 0 10 10" fill="none"
          className={`transition-transform duration-200 ${open ? 'rotate-180' : ''}`}
          aria-hidden="true"
        >
          <path d="M2 3.5L5 6.5L8 3.5" stroke="currentColor" strokeWidth="1.3" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div
          role="listbox"
          aria-label="Seleccionar región"
          className="absolute bottom-full mb-2.5 left-1/2 -translate-x-1/2 bg-white border border-[#E6E1D8] rounded-xl shadow-md py-1.5 min-w-[130px] z-50"
        >
          {locales.map((locale, index) => (
            <button
              key={locale}
              ref={(el) => { optionRefs.current[index] = el }}
              role="option"
              aria-selected={locale === currentLocale}
              onClick={() => select(locale)}
              onKeyDown={(e) => handleOptionKeyDown(e, index, locale)}
              className={`w-full px-4 py-2 text-left text-[11px] font-medium transition-colors duration-150 focus-visible:outline-none focus-visible:bg-[#FAF8F5] ${
                locale === currentLocale
                  ? 'text-[#0F0F0F] font-bold'
                  : 'text-[#3A3A37] hover:text-[#0F0F0F] hover:bg-[#FAF8F5]'
              }`}
            >
              {t(`markets.${locale}`)}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function GlobeIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
      <circle cx="6" cy="6" r="5" />
      <path d="M6 1c-1.5 1.5-2 3-2 5s.5 3.5 2 5" />
      <path d="M6 1c1.5 1.5 2 3 2 5s-.5 3.5-2 5" />
      <path d="M1 6h10" />
      <path d="M1.5 3.5h9M1.5 8.5h9" />
    </svg>
  )
}
