// apps/storefront/lib/markets.ts
import type { Locale } from '@/i18n/routing'

export const MARKETS = {
  mx: {
    locale: 'es-MX',
    currency: 'MXN',
    paymentProvider: 'mercadopago' as const,
    clerkLocaleKey: 'esMX' as const,
    supportEmail: 'soporte@novapatch.mx',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_MX || 'reg_01KNAF0276KEPK8HRMACPEQ80Y',
    addressCountry: 'mx',
    taxLabel: 'IVA 16%',
    country: 'México',
  },
  br: {
    locale: 'pt-BR',
    currency: 'BRL',
    paymentProvider: 'mercadopago' as const,
    clerkLocaleKey: 'ptBR' as const,
    supportEmail: 'suporte@novapatch.com.br',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_BR ?? '',
    addressCountry: 'br',
    taxLabel: 'ICMS',
    country: 'Brasil',
  },
  ar: {
    locale: 'es-AR',
    currency: 'ARS',
    paymentProvider: 'mercadopago' as const,
    clerkLocaleKey: 'esES' as const,
    supportEmail: 'soporte@novapatch.com.ar',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_AR || 'reg_01KP4XCXCFX44HTA01WVC885V2',
    addressCountry: 'ar',
    taxLabel: 'IVA 21%',
    country: 'Argentina',
  },
  cl: {
    locale: 'es-CL',
    currency: 'CLP',
    paymentProvider: 'mercadopago' as const,
    clerkLocaleKey: 'esES' as const,
    supportEmail: 'soporte@novapatch.cl',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_CL ?? '',
    addressCountry: 'cl',
    taxLabel: 'IVA 19%',
    country: 'Chile',
  },
  co: {
    locale: 'es-CO',
    currency: 'COP',
    paymentProvider: 'mercadopago' as const,
    clerkLocaleKey: 'esES' as const,
    supportEmail: 'soporte@novapatch.co',
    medusaRegionId: process.env.NEXT_PUBLIC_MEDUSA_REGION_CO ?? '',
    addressCountry: 'co',
    taxLabel: 'IVA 19%',
    country: 'Colombia',
  },
} as const satisfies Record<Locale, {
  locale: string
  currency: string
  paymentProvider: 'openpay' | 'mercadopago'
  clerkLocaleKey: string
  supportEmail: string
  medusaRegionId: string
  addressCountry: string
  taxLabel: string
  country: string
}>

export type Market = keyof typeof MARKETS
