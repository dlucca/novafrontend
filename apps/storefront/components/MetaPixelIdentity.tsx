// apps/storefront/components/MetaPixelIdentity.tsx
'use client'
import { useMetaPixelIdentity } from '@/hooks/use-meta-pixel-identity'

export function MetaPixelIdentity() {
  useMetaPixelIdentity()
  return null
}
