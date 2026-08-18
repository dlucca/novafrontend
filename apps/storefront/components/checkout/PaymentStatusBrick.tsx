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

  // Hide the "Descripción" (status details) and "Operación" (transaction date)
  // rows so the voucher fits on the confirmation page without scrolling — the
  // amount, expiry and "Abrir ticket" button carry everything the user needs.
  return (
    <StatusScreen
      initialization={{ paymentId }}
      customization={{ visual: { hideStatusDetails: true, hideTransactionDate: true } }}
    />
  );
}
