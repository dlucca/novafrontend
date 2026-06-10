// apps/storefront/app/[locale]/tienda/loading.tsx
import Image from "next/image";

export default function TiendaLoading() {
  return (
    <main className="min-h-screen bg-[#F8F7F4] flex items-center justify-center">
      <div className="flex flex-col items-center">
        <Image
          src="/logos/logo.webp"           // ← Cambia la ruta si tu logo está en otro lugar
          alt="Novapatch"
          width={130}
          height={130}
          className="animate-pulse"
          priority
        />
      </div>
    </main>
  );
}