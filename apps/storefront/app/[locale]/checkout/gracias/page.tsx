"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { flushStashedPurchase } from "@/lib/meta";
import { resolveShippingEta } from "@/lib/shipping-eta";
import PaymentStatusBrick from "@/components/checkout/PaymentStatusBrick";

// Unified order-confirmation ("gracias por tu compra") page. Both the direct
// charge flow and the 3DS return flow redirect here after a confirmed order.
// Firing Purchase here — on a dedicated page with a real URL and guaranteed
// dwell — is far more reliable than the previous in-place React state (direct
// flow, no URL/pageview) or the 3DS-return .then() timing. The purchase payload
// is read from the durable sessionStorage stash written before completion.
export default function GraciasPage() {
  const flushedRef = useRef(false);
  const params = useParams();
  const router = useRouter();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";
  const [address, setAddress] = useState<{
    country_code?: string | null;
    province?: string | null;
  } | null>(null);
  const [mpPaymentId, setMpPaymentId] = useState<string | null>(null);
  const [isVoucher, setIsVoucher] = useState(false);

  useEffect(() => {
    // flushStashedPurchase is idempotent (clears its own stash), so a refresh
    // won't double-count. The ref guards against React's double effect in dev.
    if (flushedRef.current) return;
    flushedRef.current = true;
    const data = flushStashedPurchase();
    if (data?.address) setAddress(data.address);
    // Set by the OXXO/SPEI voucher branch in checkout (an MP payment id +
    // voucher flag). Card checkouts don't stash these, so they fall back to the
    // captured-order copy below. Read then clear so a later card order on the
    // same tab doesn't resurface a stale voucher.
    setMpPaymentId(sessionStorage.getItem("novapatch_mp_payment_id"));
    setIsVoucher(sessionStorage.getItem("novapatch_mp_voucher") === "1");
    sessionStorage.removeItem("novapatch_mp_payment_id");
    sessionStorage.removeItem("novapatch_mp_voucher");
    sessionStorage.removeItem("novapatch_mp_voucher_url");
  }, []);

  // Auto-return to the home page after 30s so the confirmation isn't a dead end.
  useEffect(() => {
    const t = setTimeout(() => router.push(`/${locale}`), 30000);
    return () => clearTimeout(t);
  }, [router, locale]);

  const eta = resolveShippingEta({
    country_code: address?.country_code ?? null,
    province: address?.province ?? null,
  });

  if (isVoucher) {
    // Compact voucher layout: the MP Status Screen already carries the green
    // check, amount and "Abrir ticket", so the surrounding chrome stays minimal
    // and the whole page fits in one viewport without scrolling.
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] px-6 py-6 text-center">
        <div className="w-full max-w-md mx-auto flex flex-col items-center">
          {mpPaymentId && (
            <div className="w-full mb-4">
              <PaymentStatusBrick paymentId={mpPaymentId} country={locale === "ar" ? "ar" : "mx"} />
            </div>
          )}
          <h1 className="text-[22px] font-black text-[#005088] tracking-[-0.02em] mb-1.5">
            ¡Pedido reservado!
          </h1>
          <p className="text-[14px] text-[#6B7280] leading-[1.5] max-w-[360px] mb-5">
            Sigue las instrucciones de arriba para completar tu pago. En cuanto lo
            recibamos, te enviaremos la confirmación.
          </p>
          <Link
            href={`/${locale}`}
            className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl text-[15px] font-bold text-white transition-all duration-200 hover:brightness-95 active:scale-[0.97]"
            style={{ background: "#E8503A" }}
          >
            Volver al inicio
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] px-6 py-8 text-center">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <CheckCircle2 size={72} className="mx-auto mb-6" style={{ color: "#E8503A" }} />
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h1 className="text-[32px] font-black text-[#005088] tracking-[-0.03em] mb-3">
          ¡Pedido realizado!
        </h1>
        <p className="text-[16px] text-[#6B7280] leading-[1.6] max-w-[360px] mb-8">
          Recibirás un correo de confirmación con los detalles de tu envío.
          Tu parche está en camino.
        </p>
        {eta && (
          <p className="mt-4 text-[14px] text-[#425066]">
            Envío estimado: <span className="font-bold text-[#0D1B35]">{eta}</span>.
            <br />
            Te enviaremos la guía por email en las próximas 24 horas.
          </p>
        )}
        <Link
          href={`/${locale}`}
          className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[15px] font-bold text-white transition-all duration-200 hover:brightness-95 active:scale-[0.97]"
          style={{ background: "#E8503A" }}
        >
          Volver al inicio
        </Link>
      </motion.div>
    </div>
  );
}
