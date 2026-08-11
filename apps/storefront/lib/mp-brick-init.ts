// Next.js only inlines statically-referenced NEXT_PUBLIC_* vars into the
// browser bundle. A computed key (process.env[`NEXT_PUBLIC_..._${cc}`]) is
// NOT inlined and resolves to undefined client-side — so reference each key
// statically here.
const MP_PUBLIC_KEY_BY_COUNTRY: Record<string, string | undefined> = {
  mx: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY_MX,
  ar: process.env.NEXT_PUBLIC_MP_PUBLIC_KEY_AR,
}

export function mpPublicKeyFor(country: string): string {
  const cc = country.toLowerCase()
  const key = MP_PUBLIC_KEY_BY_COUNTRY[cc] ?? process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
  if (!key) throw new Error(`[MP Brick] Falta NEXT_PUBLIC_MP_PUBLIC_KEY_${cc.toUpperCase()}`)
  return key
}

export function mpLocaleFor(country: string): "es-MX" | "es-AR" {
  return country === "ar" ? "es-AR" : "es-MX"
}
