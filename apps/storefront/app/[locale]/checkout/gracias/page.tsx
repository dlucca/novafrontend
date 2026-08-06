"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { flushStashedPurchase } from "@/lib/meta";
import { resolveShippingEta } from "@/lib/shipping-eta";

// Unified order-confirmation ("gracias por tu compra") page. Both the direct
// charge flow and the 3DS return flow redirect here after a confirmed order.
// Firing Purchase here — on a dedicated page with a real URL and guaranteed
// dwell — is far more reliable than the previous in-place React state (direct
// flow, no URL/pageview) or the 3DS-return .then() timing. The purchase payload
// is read from the durable sessionStorage stash written before completion.
export default function GraciasPage() {
  const flushedRef = useRef(false);
  const [address, setAddress] = useState<{
    country_code?: string | null;
    province?: string | null;
  } | null>(null);

  useEffect(() => {
    // flushStashedPurchase is idempotent (clears its own stash), so a refresh
    // won't double-count. The ref guards against React's double effect in dev.
    if (flushedRef.current) return;
    flushedRef.current = true;
    const data = flushStashedPurchase();
    if (data?.address) setAddress(data.address);
  }, []);

  const eta = resolveShippingEta({
    country_code: address?.country_code ?? null,
    province: address?.province ?? null,
  });

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF7F2] px-6 text-center">
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
          href="/"
          className="mt-8 inline-flex items-center gap-2 px-8 py-4 rounded-xl text-[15px] font-bold text-white transition-all duration-200 hover:brightness-95 active:scale-[0.97]"
          style={{ background: "#E8503A" }}
        >
          Volver al inicio
        </Link>
      </motion.div>
    </div>
  );
}
