"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";
import { flushStashedPurchase } from "@/lib/meta";
import { resolveShippingEta } from "@/lib/shipping-eta";

export default function GraciasPage() {
  const flushedRef = useRef(false);
  const [address, setAddress] = useState<{
    country_code?: string | null;
    province?: string | null;
  } | null>(null);

  useEffect(() => {
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
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#FAF8F5] px-6 text-center py-16">
      <motion.div
        initial={{ scale: 0.7, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ type: "spring", stiffness: 260, damping: 22 }}
      >
        <div className="w-16 h-16 rounded-full bg-[#0F0F0F] text-white flex items-center justify-center mx-auto mb-6">
          <CheckCircle2 size={32} strokeWidth={2} />
        </div>
      </motion.div>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="max-w-md w-full bg-white rounded-xl border border-[#E6E1D8] shadow-2xs p-8 sm:p-10"
      >
        <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] leading-tight lowercase mb-3">
          ¡pedido confirmado!
        </h1>
        <p className="font-sans text-sm text-[#3A3A37] leading-relaxed mb-6">
          Recibirás un correo de confirmación con los detalles de tu envío.
          Tu parche está en camino.
        </p>
        {eta && (
          <div className="p-3.5 rounded-xl bg-[#FAF8F5] border border-[#E6E1D8] mb-6">
            <p className="font-sans text-xs text-[#3A3A37] leading-relaxed">
              Envío estimado: <span className="font-mono font-bold text-[#0F0F0F]">{eta}</span>.
              <br />
              Te enviaremos la guía por email en las próximas 24 horas.
            </p>
          </div>
        )}
        <Link
          href="/"
          className="inline-flex items-center justify-center gap-2 w-full bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] text-[11px] font-sans font-medium uppercase tracking-[0.12em] px-8 py-3.5 rounded-full transition-all"
        >
          Volver al inicio
        </Link>
      </motion.div>
    </div>
  );
}
