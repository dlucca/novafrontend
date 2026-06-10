import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroWithBar from "@/components/home/HeroWithBar";
import HowItWorks from "@/components/home/HowItWorks";
import ComparisonTable from "@/components/home/ComparisonTable";
import CTABanner from "@/components/home/CTABanner";
import { getProducts } from "@/lib/commerce";
import { MARKETS } from "@/lib/markets";
import type { Locale } from "@/i18n/routing";

// Client Components: lazy-loaded to unblock LCP/FCP
const AbsorptionSection = dynamic(() => import("@/components/home/AbsorptionSection"));
const ProductGrid     = dynamic(() => import("@/components/home/ProductGrid"));
const Testimonials    = dynamic(() => import("@/components/home/Testimonials"));
const HomeFAQ         = dynamic(() => import("@/components/home/HomeFAQ"));
const Footer          = dynamic(() => import("@/components/Footer"));

export const revalidate = 3600;

export default async function HomePage({ params }: { params: Promise<{ locale: string }> }) {
  const { locale } = await params;
  const market = MARKETS[locale as Locale] ?? MARKETS.mx;
  const regionId = market.medusaRegionId || undefined;
  const currency = market.currency;

  const products = await getProducts(regionId, currency);
  const basePrice = products[0]?.price ?? 750;

  return (
    <>
      <Navbar />
      <main>
        {/* 1. Hero + Features Bar — shared carousel state */}
        <HeroWithBar />
        {/* 2. Cards de Producto — grilla 2×3, debajo del AttributeBar */}
        <ProductGrid products={products} basePrice={basePrice} currency={currency} />
        {/* 3. Cómo Funciona — how it works, 3 steps */}
        <HowItWorks />
        {/* 4. Absorción — science section, dark blue bg */}
        <AbsorptionSection />
        {/* 5. Comparativo — comparison table */}
        <ComparisonTable />
        {/* 6. Suscripciones — subscription plans */}
        <CTABanner basePrice={basePrice} currency={currency} />
        {/* 8. Social Proof — testimonials */}
        <Testimonials />
        {/* 9. FAQ */}
        <HomeFAQ />
      </main>
      <Footer />
    </>
  );
}
