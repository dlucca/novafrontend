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

export const metadata: Metadata = {
  title: 'Novapatch — Bienestar que no interrumpe tu día',
  description:
    'La forma más limpia y práctica de tomar vitaminas. Parches inteligentes de alta absorción transdérmica, sin pastillas ni rellenos.',
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
  return (
    <html suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://api.clerk.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://us.i.posthog.com" crossOrigin="anonymous" />
        <link rel="preconnect" href="https://js.openpay.mx" crossOrigin="anonymous" />
        <link rel="dns-prefetch" href="https://openpay.s3.amazonaws.com" />
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
      </body>
    </html>
  )
}
