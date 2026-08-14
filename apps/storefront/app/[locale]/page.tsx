import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroWithBar from "@/components/home/HeroWithBar";
import HowItWorks from "@/components/home/HowItWorks";
import ComparisonTable from "@/components/home/ComparisonTable";
import FeaturesBanner from "@/components/home/FeaturesBanner";
import { getProducts } from "@/lib/commerce";
import { MARKETS } from "@/lib/markets";
import type { Locale } from "@/i18n/routing";

// Client Components: lazy-loaded to unblock LCP/FCP
const BestsellersGrid = dynamic(() => import("@/components/home/BestsellersGrid"));
const SocialCommunity = dynamic(() => import("@/components/home/SocialCommunity"));
const AbsorptionSectionV2 = dynamic(() => import("@/components/home/AbsorptionSectionV2"));
const WomanBanner     = dynamic(() => import("@/components/home/WomanBanner"));
const InstagramFeed   = dynamic(() => import("@/components/home/InstagramFeed"));
const Footer          = dynamic(() => import("@/components/Footer"));

export const revalidate = 3600;

// Canonical por locale: evita que las variantes con UTM (?utm_source=meta…) se
// indexen como páginas duplicadas. metadataBase está en el root layout.
export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    alternates: { canonical: `/${locale}` },
    openGraph: { url: `/${locale}` },
  };
}

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
        {/* 1. Hero + Features Bar */}
        <HeroWithBar />

        {/* 2. Sección de Best Sellers (3 Columnas + Banner Ritual) */}
        <BestsellersGrid products={products} basePrice={basePrice} currency={currency} />

        {/* 3. Sección de Social & Comunidad UGC */}
        <SocialCommunity />

        {/* 4. Tabla Comparativa General */}
        <ComparisonTable />

        {/* 5. Banner de Atributos/Beneficios */}
        <FeaturesBanner />

        {/* 6. Cómo Funciona */}
        <HowItWorks />

        {/* 7. Absorción y Ciencia V2 */}
        <AbsorptionSectionV2 />

        {/* 8. Banner Promocional Woman */}
        <WomanBanner />

        {/* 9. Instagram Feed Banner */}
        <InstagramFeed />
      </main>
      <Footer />
    </>
  );
}
