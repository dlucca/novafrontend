// apps/storefront/app/layout.tsx
import type { Metadata } from 'next'
import { Outfit } from 'next/font/google'
import Script from 'next/script'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['400', '600', '700'],
})

const SITE_URL = 'https://novapatch.care'
const SITE_TITLE = 'Novapatch — Bienestar que no interrumpe tu día'
const SITE_DESCRIPTION =
  'La forma más limpia y práctica de tomar vitaminas. Parches inteligentes de alta absorción transdérmica, sin pastillas ni rellenos.'

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_TITLE,
  description: SITE_DESCRIPTION,
  openGraph: {
    type: 'website',
    siteName: 'Novapatch',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    url: SITE_URL,
    locale: 'es_MX',
    // TODO: cambiar por un OG dedicado 1200×630 (JPG/PNG) para máxima compatibilidad
    // con X/WhatsApp. girls.webp es la imagen lifestyle landscape usada como base.
    images: [{ url: '/girls.webp', width: 1200, height: 630, alt: 'Novapatch — parches inteligentes de bienestar' }],
  },
  twitter: {
    card: 'summary_large_image',
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    images: ['/girls.webp'],
  },
  icons: {
    icon: [
      { url: '/favicon/favicon-16x16.png', sizes: '16x16', type: 'image/png' },
      { url: '/favicon/favicon-32x32.png', sizes: '32x32', type: 'image/png' },
      { url: '/favicon/favicon.ico' },
    ],
    apple: { url: '/favicon/apple-touch-icon.png' },
    other: [{ rel: 'manifest', url: '/favicon/site.webmanifest' }],
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // lang="es" cubre mx/ar/cl/co (mercados lanzados). El root layout no puede leer
  // params; para pt-BR (/br) hay que derivar el lang del locale — ver nota.
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.clerk.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://us.i.posthog.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.openpay.mx" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://connect.facebook.net" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://openpay.s3.amazonaws.com" />
        <link rel="dns-prefetch" href="https://www.facebook.com" />
        {/* Google tag (gtag.js) — GA4 */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=G-5EWD38ZXVW"
          strategy="afterInteractive"
        />
        <Script id="gtag-init" strategy="afterInteractive">
          {`window.dataLayer = window.dataLayer || [];
function gtag(){dataLayer.push(arguments);}
gtag('js', new Date());
gtag('config', 'G-5EWD38ZXVW');`}
        </Script>
        {/* Meta Pixel Code */}
        <Script id="meta-pixel" strategy="afterInteractive">
          {`!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', '988662053738645');
fbq('track', 'PageView');`}
        </Script>
        {/* End Meta Pixel Code */}
      </head>
      <body suppressHydrationWarning className={`${outfit.variable} min-h-screen`}>
        {/* Meta Pixel noscript fallback */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }}
            src="https://www.facebook.com/tr?id=988662053738645&ev=PageView&noscript=1"
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}
