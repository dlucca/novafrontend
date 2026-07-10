'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect } from 'react'
import { META_PIXEL_ID } from '@/lib/meta'

// Re-calling fbq('init', ...) with a matching object after the base Pixel
// has already fired is the documented way to attach Advanced Matching data
// once it becomes available (Meta hashes em/ph/fn/ln/external_id client-side).
export function useMetaPixelIdentity() {
  const { user, isLoaded } = useUser()

  useEffect(() => {
    if (!isLoaded || !user || typeof window.fbq !== 'function') return

    window.fbq('init', META_PIXEL_ID, {
      em: user.primaryEmailAddress?.emailAddress,
      fn: user.firstName ?? undefined,
      ln: user.lastName ?? undefined,
      external_id: user.id,
    })
  }, [user, isLoaded])
}
