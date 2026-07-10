// apps/storefront/app/[locale]/layout.tsx
import { notFound } from 'next/navigation'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import Script from 'next/script'
import { ClerkProvider } from '@clerk/nextjs'
import { CartProvider } from '@/contexts/CartContext'
import CartDrawer from '@/components/CartDrawer'
import { SentryIdentity } from '@/components/SentryIdentity'
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
        <PostHogProvider />
        <CartProvider>
          {children}
          <CartDrawer />
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

        <Script id="meta-pixel" strategy="afterInteractive">
          {`
            !function(f,b,e,v,n,t,s)
            {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
            n.callMethod.apply(n,arguments):n.queue.push(arguments)};
            if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
            n.queue=[];t=b.createElement(e);t.async=!0;
            t.src=v;s=b.getElementsByTagName(e)[0];
            s.parentNode.insertBefore(t,s)}(window,document,'script',
            'https://connect.facebook.net/en_US/fbevents.js');
            fbq('init', '988662053738645');
            fbq('track', 'PageView');
          `}
        </Script>
        <noscript>
          <img
            height="1"
            width="1"
            style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=988662053738645&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
      </ClerkProvider>
    </NextIntlClientProvider>
  )
}
