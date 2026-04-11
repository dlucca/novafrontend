// apps/storefront/components/PaymentMethodSelector.tsx
"use client";

type PaymentMethod = "card" | "oxxo" | "spei";

interface PaymentMethodSelectorProps {
  value: PaymentMethod;
  onChange: (method: PaymentMethod) => void;
  hasSubscriptionItems: boolean;
}

export function PaymentMethodSelector({
  value,
  onChange,
  hasSubscriptionItems,
}: PaymentMethodSelectorProps) {
  const methods: { id: PaymentMethod; label: string; hint?: string; badge?: string[] }[] = [
    {
      id: "card",
      label: "Tarjeta de crédito / débito",
      badge: ["VISA", "MC", "AMEX"],
    },
    {
      id: "oxxo",
      label: "Efectivo en OXXO",
      hint: "Solo compras únicas",
    },
    {
      id: "spei",
      label: "Transferencia SPEI",
      hint: "Solo compras únicas",
    },
  ];

  return (
    <div className="flex flex-col gap-2 mb-5">
      {methods.map((m) => {
        const disabled = hasSubscriptionItems && m.id !== "card";
        const selected = value === m.id;

        return (
          <label
            key={m.id}
            className={`flex items-center gap-3 px-4 py-3.5 rounded-xl border-2 cursor-pointer transition-all duration-200 ${
              disabled
                ? "opacity-50 cursor-not-allowed border-[#E5E7EB] bg-[#F9FAFB]"
                : selected
                ? "border-[#E8503A] bg-white shadow-sm"
                : "border-[#E5E7EB] bg-white hover:border-[#005088]/30"
            }`}
          >
            <input
              type="radio"
              name="payment-method"
              value={m.id}
              checked={selected}
              disabled={disabled}
              onChange={() => !disabled && onChange(m.id)}
              className="accent-[#E8503A] w-4 h-4 flex-shrink-0"
            />
            <span className="font-semibold text-[14px] text-[#005088] flex-1">{m.label}</span>
            {m.badge && (
              <span className="flex items-center gap-1.5">
                {m.badge.map((b) => (
                  <span
                    key={b}
                    className="px-2 py-0.5 rounded-md border border-[#E5E7EB] text-[10px] font-black text-[#6B7280] bg-[#F9FAFB]"
                  >
                    {b}
                  </span>
                ))}
              </span>
            )}
            {m.hint && (
              <span className="text-[11px] text-[#9CA3AF] flex-shrink-0">{m.hint}</span>
            )}
          </label>
        );
      })}

      {hasSubscriptionItems && (
        <p className="text-[12px] text-[#92400E] bg-[#FEF3C7] border border-[#F59E0B] rounded-lg px-3 py-2.5 mt-1">
          ⚠️ Tu pedido incluye una suscripción. OXXO y SPEI solo están disponibles para compras únicas.
        </p>
      )}
    </div>
  );
}
