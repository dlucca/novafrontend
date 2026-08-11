export function mpPublicKeyFor(country: string): string {
  const cc = country.toUpperCase()
  const key =
    (process.env as Record<string, string | undefined>)[`NEXT_PUBLIC_MP_PUBLIC_KEY_${cc}`] ??
    process.env.NEXT_PUBLIC_MP_PUBLIC_KEY
  if (!key) throw new Error(`[MP Brick] Falta NEXT_PUBLIC_MP_PUBLIC_KEY_${cc}`)
  return key
}

export function mpLocaleFor(country: string): "es-MX" | "es-AR" {
  return country === "ar" ? "es-AR" : "es-MX"
}
