import Footer from "@/components/Footer"
import Navbar from "@/components/Navbar"
import TiendaExperience from "@/components/store/TiendaExperience"
import { getProducts, type Product } from "@/lib/commerce"
import { MARKETS } from "@/lib/markets"
import type { Locale } from "@/i18n/routing"

export const revalidate = 3600 // ISR: revalida productos cada hora

const PRODUCT_ORDER = ["shield", "glow", "sleep", "energy", "zen", "woman"] as const

function getOrderedProducts(products: Product[]) {
  return [...products].sort((a, b) => {
    return PRODUCT_ORDER.indexOf(a.slug as (typeof PRODUCT_ORDER)[number]) -
      PRODUCT_ORDER.indexOf(b.slug as (typeof PRODUCT_ORDER)[number])
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
        <main className="min-h-screen bg-[#F8F0E5] px-6 pt-32 pb-24">
          <div className="mx-auto max-w-5xl rounded-[36px] border border-[#E8D7BF] bg-white/85 px-10 py-20 text-center shadow-[0_24px_80px_rgba(13,27,53,0.08)]">
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-[#0AA6C6]">
              Tienda Novapatch
            </p>
            <h1 className="mt-4 text-4xl font-black text-[#0D1B35]">
              Aun no hay productos publicados
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-7 text-[#425066]">
              Aun no hay productos disponibles en la tienda.
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
