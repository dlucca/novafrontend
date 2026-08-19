"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter, useParams } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import posthog from "posthog-js";
import { clearCart } from "@/lib/cart";
import { medusa } from "@/lib/medusa";
import { XCircle, Loader2 } from "lucide-react";

type ReturnStatus = "loading" | "failed";

export default function ThreeDSReturnPage() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const params = useParams();
  const locale = typeof params?.locale === "string" ? params.locale : "mx";
  const [status, setStatus] = useState<ReturnStatus>("loading");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    const transactionId = searchParams.get("id") ?? searchParams.get("Id");
    const cartId =
      typeof window !== "undefined"
        ? sessionStorage.getItem("novapatch_3ds_cart_id")
        : null;

    const cartTotal = sessionStorage.getItem("novapatch_3ds_total");
    const itemCount = sessionStorage.getItem("novapatch_3ds_items");

    if (!transactionId || !cartId) {
      router.replace("/checkout?error=3ds_invalid");
      return;
    }

    const finishSuccess = () => {
      clearCart();
      if (typeof window !== "undefined") {
        localStorage.removeItem("novapatch_medusa_cart_id");
        sessionStorage.removeItem("novapatch_3ds_cart_id");
        sessionStorage.removeItem("novapatch_3ds_total");
        sessionStorage.removeItem("novapatch_3ds_items");
      }
      posthog.capture("order_completed", {
        cart_total: cartTotal ? Number(cartTotal) : undefined,
        item_count: itemCount ? Number(itemCount) : undefined,
        via_3ds: true,
      });
      router.replace(`/${locale}/checkout/gracias`);
    };

    const confirmViaPolling = async (): Promise<boolean> => {
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        try {
          const cart = await medusa.cart.retrieve(cartId);
          if (cart?.completed_at) return true;
        } catch {
          // Keep polling
        }
      }
      return false;
    };

    medusa.checkout
      .complete3DS(cartId, transactionId)
      .then(finishSuccess)
      .catch(async (err: unknown) => {
        const message =
          err instanceof Error ? err.message : "El pago no pudo confirmarse";
        console.error(
          "[3ds-return] complete3DS failed, polling cart for completion:",
          message
        );
        if (await confirmViaPolling()) {
          finishSuccess();
        } else {
          setErrorMessage(message);
          setStatus("failed");
        }
      });
  }, [searchParams, router, locale]);

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={36} className="animate-spin text-[#0F0F0F] mx-auto mb-4" />
          <p className="font-sans text-sm font-semibold text-[#0F0F0F]">Verificando tu pago…</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex flex-col">
      <header className="sticky top-0 z-40 bg-[#FAF8F5]/95 backdrop-blur-xl border-b border-[#E6E1D8]">
        <div className="max-w-6xl mx-auto px-6 h-[64px] flex items-center justify-center">
          <Link
            href="/"
            className="font-sans font-bold text-[22px] tracking-[-0.035em] text-[#0F0F0F] hover:opacity-85 transition-opacity lowercase"
          >
            novapatch
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full bg-white rounded-xl border border-[#E6E1D8] shadow-2xs p-8 text-center"
        >
          <div
            className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#E6E1D8] text-[#0F0F0F]"
          >
            <XCircle size={32} />
          </div>

          <h1 className="text-2xl font-display font-semibold text-[#0F0F0F] mb-2 tracking-[-0.035em] lowercase">
            no pudimos procesar tu pago
          </h1>
          <p className="font-sans text-sm text-[#3A3A37] leading-relaxed mb-8">
            {errorMessage ??
              "Tu banco rechazó la autenticación 3D Secure. Intenta con otra tarjeta o contacta a tu banco."}
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              className="block w-full py-3.5 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] text-center transition-all"
            >
              Volver al checkout
            </Link>
            <Link
              href="/"
              className="block w-full py-3.5 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[#3A3A37] border border-[#E6E1D8] hover:border-[#0F0F0F] text-center transition-colors"
            >
              Volver a la tienda
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
