import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import HeroWithBar from "@/components/home/HeroWithBar";
import HowItWorks from "@/components/home/HowItWorks";
import ComparisonTable from "@/components/home/ComparisonTable";
import { getProducts } from "@/lib/commerce";
import { MARKETS } from "@/lib/markets";
import type { Locale } from "@/i18n/routing";

import FeaturesBanner from "@/components/home/FeaturesBanner";

// Dynamic sections for this preview to prevent blocking initial load
const BestsellersGrid = dynamic(() => import("@/components/home/BestsellersGrid"));
const SocialCommunity = dynamic(() => import("@/components/home/SocialCommunity"));
const InstagramFeed   = dynamic(() => import("@/components/home/InstagramFeed"));
const AbsorptionSectionV2 = dynamic(() => import("@/components/home/AbsorptionSectionV2"));
const Footer          = dynamic(() => import("@/components/Footer"));
const WomanBanner     = dynamic(() => import("@/components/home/WomanBanner"));

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string }>;
}): Promise<Metadata> {
  const { locale } = await params;
  return {
    title: "Home Preview | Novapatch",
    alternates: { canonical: `/home-preview` },
  };
}

export default async function HomePreviewPage({ params }: { params: Promise<{ locale: string }> }) {
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

        {/* 1b. Sección de Best Sellers Estilo Clásico (3 Columnas) [NUEVO] */}
        <BestsellersGrid products={products} basePrice={basePrice} currency={currency} />

        {/* 1c. Sección de Social & Comunidad UGC [NUEVO] */}
        <SocialCommunity />

        {/* 6. Tabla Comparativa General */}
        <ComparisonTable />

        {/* Banner de Atributos/Beneficios Estático con Fondo Claro */}
        <FeaturesBanner />

        {/* 4. Cómo Funciona */}
        <HowItWorks />

        {/* 5. Absorción y Ciencia V2 */}
        <AbsorptionSectionV2 />

        {/* 6b. Banner Promocional Woman [NUEVO] */}
        <WomanBanner />

        {/* 8. Instagram Feed Banner [NUEVO] */}
        <InstagramFeed />
      </main>
      <Footer />
    </>
  );
}
