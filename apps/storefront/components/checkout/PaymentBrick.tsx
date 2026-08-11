// apps/storefront/components/checkout/PaymentBrick.tsx
"use client";

import { useEffect } from "react";
import { initMercadoPago, Payment } from "@mercadopago/sdk-react";
import { mpPublicKeyFor, mpLocaleFor } from "@/lib/mp-brick-init";

export default function PaymentBrick({
  amount,
  payerEmail,
  country,
  onSubmitPayment,
  onError,
}: {
  amount: number;
  payerEmail: string;
  country: string;
  onSubmitPayment: (formData: unknown) => Promise<void>;
  onError?: (e: unknown) => void;
}) {
  useEffect(() => {
    initMercadoPago(mpPublicKeyFor(country), { locale: mpLocaleFor(country) });
  }, [country]);

  return (
    <Payment
      initialization={{ amount, payer: { email: payerEmail } }}
      customization={{
        paymentMethods: { creditCard: "all", debitCard: "all" },
        visual: {
          style: { theme: "default", customVariables: { baseColor: "#005088" } },
        },
      }}
      onSubmit={async ({ formData }) => {
        await onSubmitPayment(formData);
      }}
      onError={(err) => onError?.(err)}
    />
  );
}
