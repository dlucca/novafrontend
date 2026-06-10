import { notFound } from "next/navigation"
import type { Metadata } from "next"
import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import ProductDetail from "@/components/product/ProductDetail"
import { getProductDetail } from "@/lib/commerce"
import { PRODUCT_META, PRODUCT_ORDER, PDP_META } from "@/lib/product-meta"
import { MARKETS } from "@/lib/markets"
import type { Locale } from "@/i18n/routing"

export const revalidate = 300 // ISR: 5 minutos

export function generateStaticParams() {
  return PRODUCT_ORDER.map((handle) => ({ handle }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}): Promise<Metadata> {
  const { handle } = await params
  const meta = PRODUCT_META[handle]
  if (!meta) return {}
  return {
    title: `${meta.name} — Novapatch`,
    description: PDP_META[handle]?.tagline ?? meta.description,
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ locale: string; handle: string }>
}) {
  const { locale, handle } = await params

  // Solo handles conocidos: evita fetches arbitrarios a Medusa
  if (!PRODUCT_META[handle]) notFound()

  const market = MARKETS[locale as Locale]
  const regionId = market?.medusaRegionId || undefined
  const currency = market?.currency ?? "MXN"

  const product = await getProductDetail(handle, regionId, currency)
  if (!product) notFound()

  return (
    <>
      <Navbar lightBg />
      <ProductDetail key={product.slug} product={product} currency={currency} />
      <Footer />
    </>
  )
}
