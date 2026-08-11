// apps/storefront/components/checkout/PaymentStatusBrick.tsx
"use client";

import { useEffect } from "react";
import { initMercadoPago, StatusScreen } from "@mercadopago/sdk-react";
import { mpPublicKeyFor, mpLocaleFor } from "@/lib/mp-brick-init";

export default function PaymentStatusBrick({
  paymentId,
  country,
}: {
  paymentId: string;
  country: string;
}) {
  useEffect(() => {
    initMercadoPago(mpPublicKeyFor(country), { locale: mpLocaleFor(country) });
  }, [country]);

  return <StatusScreen initialization={{ paymentId }} />;
}
