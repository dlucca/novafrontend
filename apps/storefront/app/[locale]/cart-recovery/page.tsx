"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams, useParams } from "next/navigation";
import Link from "next/link";
import { medusa } from "@/lib/medusa";

const MEDUSA_CART_KEY = "novapatch_medusa_cart_id";

type Status = "loading" | "redirecting" | "completed" | "not-found" | "error";

export default function CartRecoveryPage() {
  const router = useRouter();
  const params = useSearchParams();
  const { locale } = useParams<{ locale: string }>();
  const [status, setStatus] = useState<Status>("loading");
  const [errorMsg, setErrorMsg] = useState("");

  useEffect(() => {
    const cartId = params.get("id");
    if (!cartId) {
      setStatus("error");
      setErrorMsg("Link de recuperación inválido.");
      return;
    }

    let cancelled = false;

    (async () => {
      try {
        const cart = await medusa.cart.retrieve(cartId);
        if (cancelled) return;

        if (cart.completed_at) {
          setStatus("completed");
          setTimeout(() => {
            router.replace(`/${locale ?? "mx"}`);
          }, 1500);
          return;
        }

        if (typeof window !== "undefined") {
          window.localStorage.setItem(MEDUSA_CART_KEY, cart.id);
        }

        setStatus("redirecting");
        router.replace(`/${locale ?? "mx"}/checkout`);
      } catch (err) {
        if (cancelled) return;
        const message = err instanceof Error ? err.message : String(err);
        if (/not found|404/i.test(message)) {
          setStatus("not-found");
        } else {
          setStatus("error");
          setErrorMsg(message);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [params, router, locale]);

  return (
    <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center p-6">
      <div className="max-w-md w-full bg-white rounded-xl border border-[#E6E1D8] p-8 text-center shadow-2xs">
        {(status === "loading" || status === "redirecting") && (
          <div className="flex flex-col items-center gap-4 py-4">
            <span className="h-8 w-8 border-3 border-[#0F0F0F] border-t-transparent rounded-full animate-spin" />
            <p className="text-base font-sans font-semibold text-[#0F0F0F]">
              {status === "loading" ? "Recuperando tu carrito..." : "Te llevamos al checkout..."}
            </p>
          </div>
        )}

        {status === "completed" && (
          <div className="py-2">
            <h2 className="text-lg font-display font-semibold text-[#0F0F0F] mb-2 tracking-[-0.035em] lowercase">
              esta compra ya fue completada
            </h2>
            <p className="text-sm font-sans text-[#3A3A37]">
              Te llevamos al inicio.
            </p>
          </div>
        )}

        {status === "not-found" && (
          <div className="py-2 flex flex-col items-center gap-4">
            <h2 className="text-lg font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] lowercase">
              este carrito ya no está disponible
            </h2>
            <p className="text-sm font-sans text-[#3A3A37] leading-relaxed">
              Probá agregando los productos de nuevo desde la tienda.
            </p>
            <Link
              href={`/${locale ?? "mx"}`}
              className="mt-2 inline-flex items-center px-6 py-3 rounded-full text-xs font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all cursor-pointer"
            >
              Ir a la tienda
            </Link>
          </div>
        )}

        {status === "error" && (
          <div className="py-2 flex flex-col items-center gap-4">
            <h2 className="text-lg font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] lowercase">
              no pudimos recuperar tu carrito
            </h2>
            {errorMsg && (
              <p className="text-xs font-mono text-[#A8A29A]">
                {errorMsg}
              </p>
            )}
            <Link
              href={`/${locale ?? "mx"}`}
              className="mt-2 inline-flex items-center px-6 py-3 rounded-full text-xs font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all cursor-pointer"
            >
              Volver a la tienda
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
