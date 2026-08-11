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
    // MP redirige con ?payment_id=<id> (algunos flujos usan ?id=)
    const transactionId =
      searchParams.get("payment_id") ?? searchParams.get("id") ?? searchParams.get("Id");

    // El cart_id se guarda en sessionStorage antes del redirect 3DS
    const cartId =
      typeof window !== "undefined"
        ? sessionStorage.getItem("novapatch_3ds_cart_id")
        : null;

    const cartTotal = sessionStorage.getItem("novapatch_3ds_total");
    const itemCount = sessionStorage.getItem("novapatch_3ds_items");

    if (!transactionId || !cartId) {
      // Faltan parámetros necesarios para completar el cobro
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
      // Hand off to the unified confirmation page, which fires the stashed
      // Purchase/Subscribe on mount (single, reliable place for both flows).
      // The purchase stash written before the 3DS redirect survives here.
      router.replace(`/${locale}/checkout/gracias`);
    };

    // Post-3DS the charge is already authorized (the bank redirected us back),
    // so the money is committed. complete-3ds can be slow and time out even
    // though the order completes backend-side moments later. Before ever
    // showing a failure, poll the cart: if it completed, treat it as success —
    // otherwise we'd charge the customer and tell them it failed.
    const confirmViaPolling = async (): Promise<boolean> => {
      for (let i = 0; i < 5; i++) {
        await new Promise((r) => setTimeout(r, 3000));
        try {
          const cart = await medusa.cart.retrieve(cartId);
          if (cart?.completed_at) return true;
        } catch {
          // A read hiccup shouldn't end the recovery — keep polling.
        }
      }
      return false;
    };

    // Verificar el cobro con el backend y completar la orden
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
      <div className="min-h-screen bg-[#FAF7F2] flex items-center justify-center">
        <div className="text-center">
          <Loader2 size={40} className="animate-spin text-[#005088] mx-auto mb-4" />
          <p className="text-[15px] font-semibold text-[#005088]">Verificando tu pago…</p>
        </div>
      </div>
    );
  }

  // status === "failed"
  return (
    <div className="min-h-screen bg-[#FAF7F2] flex flex-col">
      <header className="sticky top-0 z-40 bg-[#FAF7F2]/95 backdrop-blur-xl border-b border-[#005088]/8">
        <div className="max-w-6xl mx-auto px-6 h-[64px] flex items-center justify-center">
          <Link href="/">
            <Image
              src="/logos/logocolor.webp"
              alt="NovaPatch"
              width={140}
              height={40}
              className="h-[36px] w-auto object-contain"
              priority
            />
          </Link>
        </div>
      </header>

      <div className="flex-1 flex items-center justify-center px-6 py-16">
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-md w-full bg-white rounded-3xl border border-[#005088]/10 shadow-[0_8px_40px_rgba(0,80,136,0.1)] p-10 text-center"
        >
          <div
            className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full"
            style={{ background: "#FEF2F2" }}
          >
            <XCircle size={40} className="text-[#E8503A]" />
          </div>

          <h1 className="text-[26px] font-black text-[#005088] mb-2 tracking-[-0.02em]">
            No pudimos procesar tu pago
          </h1>
          <p className="text-[15px] text-[#6B7280] leading-[1.6] mb-8">
            {errorMessage ??
              "Tu banco rechazó la autenticación 3D Secure. Intenta con otra tarjeta o contacta a tu banco."}
          </p>

          <div className="flex flex-col gap-3">
            <Link
              href="/checkout"
              className="block w-full py-3.5 rounded-xl text-[15px] font-bold text-white text-center transition-all duration-200 active:scale-[0.97] hover:brightness-95"
              style={{ background: "#E8503A" }}
            >
              Volver al checkout
            </Link>
            <Link
              href="/"
              className="block w-full py-3.5 rounded-xl text-[15px] font-semibold text-center text-[#005088] border border-[#005088]/20 hover:border-[#005088]/40 transition-colors"
            >
              Ir al inicio
            </Link>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
