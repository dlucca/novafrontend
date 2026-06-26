// apps/storefront/middleware.ts
import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'
import { routing, type Locale } from './i18n/routing'

// Solo mercados con región Medusa funcional. br/cl/co tienen rutas y traducciones
// listas pero NO región en el backend (checkout no crea carrito), así que no los
// enrutamos por geo: visitantes de esos países (y cualquier otro) caen al
// defaultLocale (mx). Agregar el país acá cuando su mercado tenga región.
const countryToLocale: Record<string, Locale> = {
  MX: 'mx',
  AR: 'ar',
}

const intlMiddleware = createMiddleware(routing)

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Root redirect: detect locale from cookie → IP → default
  if (pathname === '/') {
    const savedLocale = request.cookies.get('NEXT_LOCALE')?.value as Locale | undefined
    const country = request.headers.get('x-vercel-ip-country') ?? ''
    const detectedLocale = countryToLocale[country.toUpperCase()] ?? routing.defaultLocale
    const locale =
      savedLocale && (routing.locales as readonly string[]).includes(savedLocale)
        ? savedLocale
        : detectedLocale

    return NextResponse.redirect(new URL(`/${locale}`, request.url))
  }

  // Let next-intl handle locale validation and routing for all other paths
  const response = intlMiddleware(request)

  // Persist locale in cookie whenever user navigates to a locale-prefixed path
  const localeSegment = pathname.split('/')[1] as Locale
  if ((routing.locales as readonly string[]).includes(localeSegment)) {
    response.cookies.set('NEXT_LOCALE', localeSegment, {
      maxAge: 60 * 60 * 24 * 365,
      sameSite: 'lax',
      path: '/',
    })
  }

  return response
}

export const config = {
  matcher: ['/((?!api|_next|_vercel|.*\\..*).*)'],
}
