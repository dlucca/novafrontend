// apps/storefront/components/MetaPixelIdentity.tsx
'use client'
import { usePathname } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useMetaPixelIdentity } from '@/hooks/use-meta-pixel-identity'

export function MetaPixelIdentity() {
  useMetaPixelIdentity()
  const pathname = usePathname()
  const isFirstRender = useRef(true)

  useEffect(() => {
    // Evitamos duplicar el PageView del primer render, ya que layout.tsx ya lo dispara
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }
    if (typeof window.fbq === 'function') {
      window.fbq('track', 'PageView')
    }
  }, [pathname])

  return null
}
