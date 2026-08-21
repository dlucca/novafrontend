// apps/storefront/app/[locale]/layout.tsx
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Script from 'next/script'
import { ClerkProvider } from '@clerk/nextjs'
import { CartProvider } from '@/contexts/CartContext'
import CartDrawer from '@/components/CartDrawer'
import DiscountPopup from '@/components/DiscountPopup'
import { SentryIdentity } from '@/components/SentryIdentity'
import { MetaPixelIdentity } from '@/components/MetaPixelIdentity'
import { PostHogProvider } from '@/components/PostHogProvider'
import { getClerkLocalization } from '@/lib/clerk-theme'
import { MARKETS } from '@/lib/markets'
import { routing, type Locale } from '@/i18n/routing'

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {
  const { locale } = await params

  if (!(routing.locales as readonly string[]).includes(locale)) {
    notFound()
  }

  const typedLocale = locale as Locale
  const market = MARKETS[typedLocale]
  const messages = await getMessages()

  return (
    <NextIntlClientProvider messages={messages}>
      <ClerkProvider
        localization={getClerkLocalization(typedLocale)}
        signInUrl={`/${locale}/sign-in`}
        signUpUrl={`/${locale}/sign-up`}
        signInFallbackRedirectUrl={`/${locale}`}
        signUpFallbackRedirectUrl={`/${locale}`}
      >
        <SentryIdentity />
        <MetaPixelIdentity />
        <PostHogProvider />
        <CartProvider>
          {children}
          <CartDrawer />
          <DiscountPopup />
        </CartProvider>

        {market.paymentProvider === 'openpay' && (
          <>
            <Script
              src="https://js.openpay.mx/openpay.v1.min.js"
              strategy="lazyOnload"
            />
            <Script
              src="https://openpay.s3.amazonaws.com/openpay-data.v1.min.js"
              strategy="lazyOnload"
            />
          </>
        )}
      </ClerkProvider>
    </NextIntlClientProvider>
  )
}
