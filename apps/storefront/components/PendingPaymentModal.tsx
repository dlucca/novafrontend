// apps/storefront/components/PendingPaymentModal.tsx
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { X } from "lucide-react";

function fmt(n: number): string {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 2,
  }).format(n);
}

// Formatea referencia OXXO en grupos de 4: "9282330080700003" → "9282 3300 8070 0003"
function fmtReference(ref: string): string {
  return ref.replace(/(\d{4})/g, "$1 ").trim();
}

// Formatea CLABE en grupos de 4 manteniendo los últimos 2 dígitos: "646180000275643908" → "6461 8000 0275 6439 08"
function fmtClabe(clabe: string): string {
  return clabe.replace(/(\d{4})(?=\d)/g, "$1 ");
}

interface PendingPaymentModalProps {
  open: boolean;
  method: "oxxo" | "spei";
  // OXXO
  reference?: string;
  due_date?: string;
  // SPEI
  clabe?: string;
  bank?: string;
  beneficiary?: string;
  // Común
  amount: number;
  onClose: () => void;
}

export function PendingPaymentModal({
  open,
  method,
  reference,
  due_date,
  clabe,
  bank,
  beneficiary,
  amount,
  onClose,
}: PendingPaymentModalProps) {
  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="pending-modal-backdrop"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: "rgba(13,27,53,0.7)", backdropFilter: "blur(4px)" }}
        >
          <motion.div
            key="pending-modal-card"
            initial={{ opacity: 0, scale: 0.95, y: 16 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 16 }}
            transition={{ type: "spring", stiffness: 300, damping: 28 }}
            className="bg-white rounded-2xl shadow-2xl w-full max-w-sm relative overflow-hidden"
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-1.5 rounded-full text-[#9CA3AF] hover:text-[#0D1B35] hover:bg-[#F3F4F6] transition-colors z-10"
              aria-label="Cerrar"
            >
              <X size={18} />
            </button>

            <div className="p-6 pt-10">
              {method === "oxxo" ? (
                <OxxoContent reference={reference!} amount={amount} due_date={due_date} />
              ) : (
                <SpeiContent clabe={clabe!} bank={bank!} beneficiary={beneficiary!} amount={amount} />
              )}

              <p className="text-[11px] text-[#9CA3AF] text-center mt-4">
                📧 También enviamos esta información a tu correo
              </p>

              <button
                onClick={onClose}
                className="mt-4 w-full py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200 hover:brightness-95 active:scale-[0.97]"
                style={{ background: "#E8503A" }}
              >
                {method === "oxxo" ? "Entendido, iré a pagar" : "Entendido, haré la transferencia"}
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function OxxoContent({
  reference,
  amount,
  due_date,
}: {
  reference: string;
  amount: number;
  due_date?: string;
}) {
  const deadline = due_date
    ? new Date(due_date).toLocaleDateString("es-MX", {
        weekday: "long",
        day: "numeric",
        month: "long",
      })
    : "72 horas";

  return (
    <>
      <div className="text-center mb-5">
        <div className="text-4xl mb-2">🏪</div>
        <h3 className="text-[18px] font-black text-[#0D1B35] mb-1">Paga en OXXO</h3>
        <p className="text-[13px] text-[#6B7280]">
          Tienes hasta el <strong className="text-[#0D1B35]">{deadline}</strong>
        </p>
      </div>

      <div className="bg-[#FAF7F2] rounded-xl p-4 text-center mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-1.5">
          Referencia de pago
        </p>
        <p className="text-[26px] font-black text-[#0D1B35] tracking-widest leading-none">
          {fmtReference(reference)}
        </p>
      </div>

      <div className="bg-[#FEF3C7] rounded-xl px-4 py-3 mb-4 flex items-center justify-between">
        <span className="text-[13px] font-semibold text-[#92400E]">Monto a pagar</span>
        <span className="text-[15px] font-black text-[#92400E]">{fmt(amount)}</span>
      </div>

      <div className="text-[12px] text-[#475569] space-y-1.5">
        <p className="font-semibold text-[#0D1B35] mb-2">¿Cómo pagar?</p>
        <p>1. Ve a cualquier tienda OXXO</p>
        <p>2. Dile al cajero "pago de servicio"</p>
        <p>3. Proporciona la referencia y conserva tu ticket</p>
      </div>
    </>
  );
}

function SpeiContent({
  clabe,
  bank,
  beneficiary,
  amount,
}: {
  clabe: string;
  bank: string;
  beneficiary: string;
  amount: number;
}) {
  return (
    <>
      <div className="text-center mb-5">
        <div className="text-4xl mb-2">🏦</div>
        <h3 className="text-[18px] font-black text-[#0D1B35] mb-1">Transfiere por SPEI</h3>
        <p className="text-[13px] text-[#6B7280]">Tu pedido se confirma al recibir la transferencia</p>
      </div>

      <div className="bg-[#FAF7F2] rounded-xl p-4 mb-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-[#9CA3AF] mb-1.5">
          CLABE interbancaria
        </p>
        <p className="text-[18px] font-black text-[#0D1B35] tracking-wider leading-none mb-3">
          {fmtClabe(clabe)}
        </p>
        <div className="grid grid-cols-2 gap-2 text-[12px]">
          <div>
            <span className="text-[#9CA3AF]">Banco</span>
            <p className="font-bold text-[#0D1B35]">{bank}</p>
          </div>
          <div>
            <span className="text-[#9CA3AF]">Beneficiario</span>
            <p className="font-bold text-[#0D1B35] truncate">{beneficiary}</p>
          </div>
        </div>
      </div>

      <div className="bg-[#FEF3C7] border border-[#F59E0B] rounded-xl px-4 py-3 mb-4">
        <p className="text-[13px] font-semibold text-[#92400E]">Monto exacto</p>
        <p className="text-[18px] font-black text-[#92400E]">{fmt(amount)}</p>
        <p className="text-[11px] text-[#92400E] mt-1">
          ⚠️ Transfiere el monto exacto o el pago no se acreditará
        </p>
      </div>
    </>
  );
}
