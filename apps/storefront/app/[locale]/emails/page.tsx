"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Mail,
  Send,
  Smartphone,
  Monitor,
  CheckCircle2,
  AlertCircle,
  Loader2,
  PackageCheck,
  Truck,
  CheckCheck,
  AlertTriangle,
  Sparkles,
  RefreshCw,
  CreditCard,
  ShoppingBag,
  Gift,
  KeyRound,
  ChevronDown,
} from "lucide-react";

type BackendTemplateKey =
  | "order_confirmation"
  | "order_shipped"
  | "order_delivered"
  | "order_delivery_failed"
  | "subscription_welcome"
  | "subscription_upcoming_charge"
  | "subscription_renewed"
  | "subscription_payment_failed"
  | "cart_recovery"
  | "influencer_samples"
  | "admin_invite";

const BACKEND_TEMPLATES: {
  key: BackendTemplateKey;
  label: string;
  categoryGroup: string;
  badge: string;
  icon: React.ReactNode;
  subject: string;
}[] = [
  {
    key: "order_confirmation",
    label: "Confirmación de Compra",
    categoryGroup: "📦 Pedidos & Logística",
    badge: "COMPRA CONFIRMADA",
    icon: <PackageCheck size={16} />,
    subject: "Confirmación de pedido #NV-84920 · Novapatch",
  },
  {
    key: "order_shipped",
    label: "Pedido Enviado (Guía de Rastreo)",
    categoryGroup: "📦 Pedidos & Logística",
    badge: "EN CAMINO",
    icon: <Truck size={16} />,
    subject: "Tu pedido #NV-84920 está en camino · Novapatch",
  },
  {
    key: "order_delivered",
    label: "Pedido Entregado",
    categoryGroup: "📦 Pedidos & Logística",
    badge: "ENTREGADO",
    icon: <CheckCheck size={16} />,
    subject: "¡Tu pedido #NV-84920 fue entregado con éxito! · Novapatch",
  },
  {
    key: "order_delivery_failed",
    label: "Intento de Entrega Fallido",
    categoryGroup: "📦 Pedidos & Logística",
    badge: "PROBLEMA ENVÍO",
    icon: <AlertTriangle size={16} />,
    subject: "Aviso importante sobre la entrega de tu pedido · Novapatch",
  },
  {
    key: "subscription_welcome",
    label: "Bienvenida a Suscripción",
    categoryGroup: "🔄 Suscripciones Recurrentes",
    badge: "BIENVENIDA PLAN",
    icon: <Sparkles size={16} />,
    subject: "Bienvenido al plan de bienestar continuo · Novapatch",
  },
  {
    key: "subscription_upcoming_charge",
    label: "Aviso de Próximo Cobro",
    categoryGroup: "🔄 Suscripciones Recurrentes",
    badge: "RECORDATORIO COBRO",
    icon: <RefreshCw size={16} />,
    subject: "Tu próxima recarga mensual se procesará pronto · Novapatch",
  },
  {
    key: "subscription_renewed",
    label: "Renovación Exitosa",
    categoryGroup: "🔄 Suscripciones Recurrentes",
    badge: "RENOVACIÓN OK",
    icon: <CheckCircle2 size={16} />,
    subject: "Tu renovación mensual fue procesada con éxito · Novapatch",
  },
  {
    key: "subscription_payment_failed",
    label: "Pago Fallido de Suscripción",
    categoryGroup: "🔄 Suscripciones Recurrentes",
    badge: "PAGO RECHAZADO",
    icon: <CreditCard size={16} />,
    subject: "Acción requerida: Problema con el cobro de tu suscripción · Novapatch",
  },
  {
    key: "cart_recovery",
    label: "Recuperación de Carrito Abandonado",
    categoryGroup: "🛒 Carrito & Marketing",
    badge: "CARRITO GUARDADO",
    icon: <ShoppingBag size={16} />,
    subject: "Tus parches te están esperando · Novapatch",
  },
  {
    key: "influencer_samples",
    label: "Muestras a Influencers / PR",
    categoryGroup: "🛒 Carrito & Marketing",
    badge: "ENVÍO ESPECIAL PR",
    icon: <Gift size={16} />,
    subject: "Tus muestras Novapatch están en camino · Novapatch",
  },
  {
    key: "admin_invite",
    label: "Invitación de Administrador",
    categoryGroup: "🔐 Administración Interna",
    badge: "INVITACIÓN PANEL",
    icon: <KeyRound size={16} />,
    subject: "Invitación de acceso al panel de administración · Novapatch",
  },
];

export default function EmailsPreviewPage() {
  const [activeKey, setActiveKey] = useState<BackendTemplateKey>("order_confirmation");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  const [backendHtml, setBackendHtml] = useState<string | null>(null);
  const [loadingBackend, setLoadingBackend] = useState<boolean>(true);

  useEffect(() => {
    setLoadingBackend(true);
    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://novabackend-production.up.railway.app";
    fetch(`${backendUrl}/store/emails/preview?template=${activeKey}`)
      .then((res) => (res.ok ? res.text() : null))
      .then((html) => {
        if (html) setBackendHtml(html);
      })
      .catch(() => { /* silent fallback */ })
      .finally(() => setLoadingBackend(false));
  }, [activeKey]);

  const currentTemplate = BACKEND_TEMPLATES.find((t) => t.key === activeKey) || BACKEND_TEMPLATES[0];

  async function handleSendTest(e: React.FormEvent) {
    e.preventDefault();
    if (!testEmail.trim()) return;

    setSending(true);
    setStatusMessage(null);

    try {
      const res = await fetch("/api/emails/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          template: activeKey,
          targetEmail: testEmail.trim(),
          customerName: "Esteban",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar");

      setStatusMessage({
        type: "success",
        text: data.mode === "resend" ? `¡Email enviado exitosamente a ${testEmail} vía Resend!` : `Email simulado correctamente para ${testEmail}`,
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "Error al enviar el email",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] pt-24 pb-16 px-4 sm:px-6">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header */}
        <div className="bg-white border border-[#E6E1D8] rounded-2xl p-6 shadow-2xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-[10px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#0F0F0F] text-white">
                MEDUSA V2 BACKEND EMAILS
              </span>
            </div>
            <h1 className="text-2xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] lowercase">
              hub de correos novapatch
            </h1>
            <p className="text-xs font-sans text-[#A8A29A] mt-0.5">
              Visualizador oficial de las 11 plantillas cargadas directamente desde el servidor Backend Medusa.
            </p>
          </div>

          {/* Viewport Switcher */}
          <div className="flex items-center gap-1 bg-[#FAF8F5] p-1 border border-[#E6E1D8] rounded-full shrink-0">
            <button
              onClick={() => setDevice("desktop")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                device === "desktop"
                  ? "bg-[#0F0F0F] text-white shadow-2xs"
                  : "text-[#3A3A37] hover:text-[#0F0F0F]"
              }`}
            >
              <Monitor size={14} />
              Escritorio
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-xs font-sans font-medium transition-all cursor-pointer ${
                device === "mobile"
                  ? "bg-[#0F0F0F] text-white shadow-2xs"
                  : "text-[#3A3A37] hover:text-[#0F0F0F]"
              }`}
            >
              <Smartphone size={14} />
              Móvil
            </button>
          </div>
        </div>

        {/* Dropdown Selector for 11 Templates */}
        <div className="bg-white border border-[#E6E1D8] rounded-2xl p-5 shadow-2xs space-y-3">
          <label className="block text-xs font-sans font-bold uppercase tracking-[0.1em] text-[#3A3A37]">
            Seleccionar Plantilla del Backend (11 Disponibles):
          </label>
          <div className="relative">
            <select
              value={activeKey}
              onChange={(e) => setActiveKey(e.target.value as BackendTemplateKey)}
              className="w-full appearance-none bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl px-4 py-3.5 pr-10 text-sm font-sans font-semibold text-[#0F0F0F] focus:border-[#0F0F0F] focus:outline-none cursor-pointer transition-colors"
            >
              <optgroup label="📦 Pedidos & Logística">
                <option value="order_confirmation">Confirmación de Compra (OrderConfirmation.tsx)</option>
                <option value="order_shipped">Pedido Enviado - Guía de Rastreo (OrderShipped.tsx)</option>
                <option value="order_delivered">Pedido Entregado (OrderDelivered.tsx)</option>
                <option value="order_delivery_failed">Intento de Entrega Fallido (OrderDeliveryFailed.tsx)</option>
              </optgroup>
              <optgroup label="🔄 Suscripciones Recurrentes">
                <option value="subscription_welcome">Bienvenida a Suscripción (SubscriptionWelcome.tsx)</option>
                <option value="subscription_upcoming_charge">Aviso de Próximo Cobro (SubscriptionUpcomingCharge.tsx)</option>
                <option value="subscription_renewed">Renovación Exitosa (SubscriptionRenewed.tsx)</option>
                <option value="subscription_payment_failed">Pago Fallido de Suscripción (SubscriptionPaymentFailed.tsx)</option>
              </optgroup>
              <optgroup label="🛒 Carrito & PR Marketing">
                <option value="cart_recovery">Recuperación de Carrito Abandonado (CartRecovery.tsx)</option>
                <option value="influencer_samples">Envío de Muestras a Influencers / PR (InfluencerSamplesShipped.tsx)</option>
              </optgroup>
              <optgroup label="🔐 Administración Interna">
                <option value="admin_invite">Invitación de Administrador (AdminInvite.tsx)</option>
              </optgroup>
            </select>
            <ChevronDown size={18} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0F0F0F] pointer-events-none" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-sans text-[#A8A29A]">
            <span className="flex items-center gap-1.5 font-medium text-[#0F0F0F]">
              {currentTemplate.icon}
              {currentTemplate.label}
            </span>
            <span className="font-mono text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-md bg-[#FAF8F5] border border-[#E6E1D8] text-[#3A3A37]">
              {currentTemplate.categoryGroup}
            </span>
          </div>
        </div>

        {/* Subject Header Bar */}
        <div className="bg-white border border-[#E6E1D8] rounded-xl px-5 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <Mail size={16} className="text-[#0F0F0F] shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A8A29A]">Asunto del Backend:</span>
              <p className="text-xs font-sans font-semibold text-[#0F0F0F] truncate">{currentTemplate.subject}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#A8A29A] shrink-0 hidden sm:inline-block">
            De: hola@novapatch.care
          </span>
        </div>

        {/* Preview Frame Stage */}
        <div className="flex justify-center">
          <div
            className={`transition-all duration-300 w-full ${
              device === "mobile" ? "max-w-[380px]" : "max-w-[680px]"
            }`}
          >
            <div className="bg-white border border-[#E6E1D8] rounded-2xl shadow-lg overflow-hidden min-h-[600px] flex flex-col relative">
              {loadingBackend && (
                <div className="absolute inset-0 bg-white/80 backdrop-blur-xs flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F0F0F] text-white text-xs font-sans font-medium">
                    <Loader2 size={14} className="animate-spin" />
                    Cargando plantilla del Backend...
                  </div>
                </div>
              )}
              <iframe
                title="Email Preview"
                srcDoc={backendHtml || "<p style='padding:20px;text-align:center;'>Cargando plantilla del servidor backend...</p>"}
                className="w-full flex-1 border-0 min-h-[650px] bg-[#FAF8F5]"
              />
            </div>
          </div>
        </div>

        {/* Test Email Form Footer */}
        <div className="bg-white border border-[#E6E1D8] rounded-2xl p-6 shadow-2xs">
          <form onSubmit={handleSendTest} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#A8A29A]" />
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Ingresa tu correo para recibir una prueba real..."
                className="w-full pl-10 pr-4 py-3 text-xs font-sans font-medium text-[#0F0F0F] bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl focus:border-[#0F0F0F] focus:outline-none transition-colors"
                required
              />
            </div>
            <button
              type="submit"
              disabled={sending || !testEmail.trim()}
              className="w-full sm:w-auto shrink-0 flex items-center justify-center gap-2 px-6 py-3 bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] disabled:opacity-50 text-xs font-sans font-medium uppercase tracking-[0.12em] rounded-full transition-all duration-200 cursor-pointer shadow-2xs"
            >
              {sending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  Enviando...
                </>
              ) : (
                <>
                  <Send size={14} />
                  Enviar prueba
                </>
              )}
            </button>
          </form>

          {/* Status feedback */}
          <AnimatePresence>
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className={`mt-3 p-3 rounded-xl border flex items-center gap-2 text-xs font-sans font-medium ${
                  statusMessage.type === "success"
                    ? "bg-green-50 border-green-200 text-green-700"
                    : "bg-red-50 border-red-200 text-red-700"
                }`}
              >
                {statusMessage.type === "success" ? (
                  <CheckCircle2 size={15} className="shrink-0 text-green-600" />
                ) : (
                  <AlertCircle size={15} className="shrink-0 text-red-600" />
                )}
                {statusMessage.text}
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}

