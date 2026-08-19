import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import TiendaExperience from "@/components/store/TiendaExperience"
import { getProducts, type Product } from "@/lib/commerce"
import { MARKETS } from "@/lib/markets"
import type { Locale } from "@/i18n/routing"

export const revalidate = 3600 // ISR: revalida productos cada hora

const PRODUCT_ORDER = [
  "energy",
  "sleep",
  "glow",
  "shield",
  "zen",
  "woman",
  "pack-dia-noche",
  "pack-calma-sueno",
  "pack-glow-balance",
  "pack-trio-vitalidad",
] as const

function getOrderedProducts(products: Product[]) {
  return [...products].sort((a, b) => {
    const idxA = PRODUCT_ORDER.indexOf(a.slug as (typeof PRODUCT_ORDER)[number])
    const idxB = PRODUCT_ORDER.indexOf(b.slug as (typeof PRODUCT_ORDER)[number])
    const orderA = idxA === -1 ? 999 : idxA
    const orderB = idxB === -1 ? 999 : idxB
    return orderA - orderB
  })
}

export default async function TiendaPage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params
  const market = MARKETS[locale as Locale]
  const regionId = market?.medusaRegionId || undefined
  const currency = market?.currency ?? "MXN"
  const products = getOrderedProducts(await getProducts(regionId, currency))

  if (products.length === 0) {
    return (
      <>
        <Navbar lightBg />
        <main className="min-h-screen bg-[#FAF8F5] px-6 pt-32 pb-24">
          <div className="mx-auto max-w-5xl rounded-xl border border-[#E6E1D8] bg-white px-10 py-20 text-center shadow-2xs">
            <span className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] text-[#A8A29A]">
              tienda novapatch
            </span>
            <h1 className="mt-4 text-3xl sm:text-4xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] lowercase">
              aún no hay productos publicados.
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-sm font-sans leading-relaxed text-[#3A3A37]">
              Aún no hay productos disponibles en la tienda.
            </p>
          </div>
        </main>
        <Footer />
      </>
    )
  }

  return (
    <>
      <Navbar lightBg />
      <TiendaExperience products={products} currency={currency} />
      <Footer />
    </>
  )
}
