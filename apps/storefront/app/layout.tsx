import type { Metadata } from 'next'
import { Outfit, Instrument_Serif } from 'next/font/google'
import Script from 'next/script'
import { META_PIXEL_ID } from '@/lib/meta'
import './globals.css'

const outfit = Outfit({
  subsets: ['latin'],
  variable: '--font-outfit',
  display: 'swap',
  weight: ['300', '400', '500', '600', '700', '800'],
})

const instrumentSerif = Instrument_Serif({
  subsets: ['latin'],
  variable: '--font-serif',
  display: 'swap',
  weight: ['400'],
  style: ['normal', 'italic'],
})

const SITE_URL = 'https://novapatch.care'
const SITE_TITLE = 'Novapatch — Bienestar que no interrumpe tu día'
const SITE_DESCRIPTION =
  'La forma más limpia y práctica de acompañar tu bienestar. Parches de liberación tópica continua, sin pastillas ni azúcar añadida.'

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
    icon: '/favicon/favicon.ico',
    apple: '/favicon/apple-touch-icon.png',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // lang="es" cubre mx/ar/cl/co (mercados lanzados). El root layout no puede leer
  // params; para pt-BR (/br) hay que derivar el lang del locale — ver nota.
  return (
    <html lang="es" suppressHydrationWarning>
      <head>
        <meta name="facebook-domain-verification" content="73gpcr6qpc5hv6rdv3uhubs8wrq0hc" />
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
fbq('set', 'autoConfig', 'false', '${META_PIXEL_ID}');
fbq('init', '${META_PIXEL_ID}');
fbq('track', 'PageView');`}
        </Script>
        {/* End Meta Pixel Code */}
      </head>
      <body suppressHydrationWarning className={`${outfit.variable} ${instrumentSerif.variable} min-h-screen font-sans bg-[#FAF8F5] text-[#0F0F0F]`}>
        {/* Meta Pixel noscript fallback */}
        <noscript>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img height="1" width="1" style={{ display: 'none' }}
            src={`https://www.facebook.com/tr?id=${META_PIXEL_ID}&ev=PageView&noscript=1`}
            alt=""
          />
        </noscript>
        {children}
      </body>
    </html>
  )
}
