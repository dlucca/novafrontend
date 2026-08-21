"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Check, Copy, ArrowRight } from "lucide-react";
import { trackMeta } from "@/lib/meta";

const COUPON_CODE = "BIENVENIDO10";
const STORAGE_CLOSED_KEY = "novapatch_discount_popup_closed_at";
const STORAGE_SUBMITTED_KEY = "novapatch_discount_popup_submitted";
const TWO_HOURS_MS = 2 * 60 * 60 * 1000; // 2 horas en milisegundos (7.200.000 ms)

export default function DiscountPopup() {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [copied, setCopied] = useState(false);
  const [loading, setLoading] = useState(false);

  const isClosedRecently = () => {
    const closedAt = localStorage.getItem(STORAGE_CLOSED_KEY);
    if (!closedAt) return false;
    const timePassed = Date.now() - parseInt(closedAt, 10);
    return timePassed < TWO_HOURS_MS;
  };

  useEffect(() => {
    // 1. Si el usuario ya se suscribió, NUNCA vuelve a aparecer
    const isSubmitted = localStorage.getItem(STORAGE_SUBMITTED_KEY);
    if (isSubmitted) return;

    // 2. Si el usuario lo cerró hace menos de 2 horas, no mostrar
    if (isClosedRecently()) return;

    // Timer: mostrar popup a los 6 segundos de navegación
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 6000);

    // Exit Intent: mostrar si el mouse sale por la parte superior
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isClosedRecently() && !localStorage.getItem(STORAGE_SUBMITTED_KEY)) {
        setIsOpen(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      clearTimeout(timer);
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    // Guardar timestamp exacto del cierre para iniciar la ventana de 2 horas
    localStorage.setItem(STORAGE_CLOSED_KEY, Date.now().toString());
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes("@")) return;

    setLoading(true);

    try {
      // Disparar evento Lead en Meta Pixel
      trackMeta("Lead", { content_name: "10_percent_discount_popup" }, { email });

      // Guardar suscriptor en backend silenciosamente si aplica
      const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://novabackend-production.up.railway.app";
      fetch(`${backendUrl}/store/custom/subscribers`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      }).catch(() => { /* silent fallback */ });

      setSubmitted(true);
      // Guardar suscripción permanente
      localStorage.setItem(STORAGE_SUBMITTED_KEY, "true");
    } finally {
      setLoading(false);
    }
  };

  const handleCopyCode = () => {
    navigator.clipboard.writeText(COUPON_CODE);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleClose}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
        />

        {/* Modal Window with Full Image & Gradient Background */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", duration: 0.5, bounce: 0.1 }}
          className="relative z-10 w-full max-w-[580px] border border-white/20 rounded-3xl shadow-2xl overflow-hidden text-center"
        >
          {/* Background Image Container */}
          <div className="absolute inset-0 z-0">
            <img
              src="/productusers/Newsletter_banner.png"
              alt="Novapatch Banner"
              className="w-full h-full object-cover object-center"
            />
            {/* Gradient Overlay */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/80 backdrop-blur-[1px]" />
          </div>

          {/* Close button */}
          <button
            onClick={handleClose}
            aria-label="Cerrar modal"
            className="absolute right-4 top-4 z-20 flex items-center justify-center w-9 h-9 rounded-full bg-white/20 border border-white/30 text-white hover:bg-white hover:text-[#0F0F0F] transition-all cursor-pointer shadow-md backdrop-blur-md"
          >
            <X size={18} />
          </button>

          {/* Centered Modal Body */}
          <div className="relative z-10 p-8 sm:p-12 flex flex-col items-center justify-center space-y-6 text-white">
            {/* Header Titles */}
            <div className="space-y-1">
              <h2 className="text-5xl sm:text-6xl font-sans font-extrabold tracking-tight leading-none text-white drop-shadow-md">
                10% OFF
              </h2>
              <p className="text-xs sm:text-sm font-mono uppercase font-bold tracking-[0.2em] text-white/80 pt-1">
                EN TU PRIMERA COMPRA
              </p>
            </div>

            {!submitted ? (
              <>
                <p className="text-xs sm:text-sm font-sans text-white/90 leading-relaxed max-w-md mx-auto">
                  Ingresa tu correo electrónico a continuación y recibe tu código de descuento inmediato para usar en el checkout.
                </p>

                <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-3 mx-auto">
                  <div>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Ingresa tu correo electrónico..."
                      required
                      className="w-full px-4 py-3.5 text-xs sm:text-sm font-sans text-[#0F0F0F] bg-white/95 border border-white/30 rounded-xl focus:bg-white focus:outline-none transition-colors text-center placeholder:text-[#A8A29A]"
                    />
                  </div>

                  <button
                    type="submit"
                    disabled={loading || !email}
                    className="w-full py-4 px-6 bg-white text-[#0F0F0F] hover:bg-[#FAF8F5] text-xs font-sans font-bold uppercase tracking-widest rounded-xl transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 disabled:opacity-50"
                  >
                    <span>OBTENER MI DESCUENTO</span>
                    <ArrowRight size={14} />
                  </button>
                </form>
              </>
            ) : (
              <div className="w-full max-w-sm space-y-4 pt-2 mx-auto">
                <div className="p-3.5 rounded-xl bg-emerald-500/20 border border-emerald-400/40 text-xs font-sans text-emerald-200 font-semibold flex items-center justify-center gap-2 backdrop-blur-md">
                  <Check size={16} />
                  <span>¡Te has suscrito con éxito!</span>
                </div>

                <p className="text-xs font-sans text-white/80">
                  Usa este código de cupón al finalizar tu compra:
                </p>

                <div className="bg-white/10 backdrop-blur-md border border-white/25 p-4 rounded-xl flex items-center justify-between gap-3">
                  <span className="font-mono text-2xl font-extrabold tracking-wider text-white">
                    {COUPON_CODE}
                  </span>
                  <button
                    onClick={handleCopyCode}
                    className="px-4 py-2.5 bg-white text-[#0F0F0F] text-xs font-sans font-bold rounded-lg flex items-center gap-1.5 hover:bg-[#FAF8F5] transition-colors cursor-pointer shrink-0 shadow-md"
                  >
                    {copied ? (
                      <>
                        <Check size={14} />
                        <span>Copiado</span>
                      </>
                    ) : (
                      <>
                        <Copy size={14} />
                        <span>Copiar</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            )}

            <p className="text-[10px] font-sans text-white/60 pt-2">
              Válido únicamente para tu primera orden. Sin letras chicas.
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
