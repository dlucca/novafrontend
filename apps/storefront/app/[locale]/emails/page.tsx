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

interface TemplateInfo {
  key: BackendTemplateKey;
  label: string;
  categoryGroup: string;
  badge: string;
  icon: React.ReactNode;
  subject: string;
}

const BACKEND_TEMPLATES: TemplateInfo[] = [
  {
    key: "order_confirmation",
    label: "Confirmación de Compra (OrderConfirmation.tsx)",
    categoryGroup: "📦 Pedidos & Logística",
    badge: "COMPRA NUEVA",
    icon: <PackageCheck size={16} />,
    subject: "Confirmación de pedido #NV-84920 · Novapatch",
  },
  {
    key: "order_shipped",
    label: "Pedido Enviado con Guía (OrderShipped.tsx)",
    categoryGroup: "📦 Pedidos & Logística",
    badge: "ENVÍO EN CAMINO",
    icon: <Truck size={16} />,
    subject: "Tu pedido #NV-84920 está en camino · Novapatch",
  },
  {
    key: "order_delivered",
    label: "Pedido Entregado (OrderDelivered.tsx)",
    categoryGroup: "📦 Pedidos & Logística",
    badge: "ENTREGA OK",
    icon: <CheckCheck size={16} />,
    subject: "¡Tu pedido fue entregado! · Novapatch",
  },
  {
    key: "order_delivery_failed",
    label: "Intento de Entrega Fallido (OrderDeliveryFailed.tsx)",
    categoryGroup: "📦 Pedidos & Logística",
    badge: "PROBLEMA ENVÍO",
    icon: <AlertTriangle size={16} />,
    subject: "Aviso importante sobre la entrega de tu pedido · Novapatch",
  },
  {
    key: "subscription_welcome",
    label: "Bienvenida a Suscripción (SubscriptionWelcome.tsx)",
    categoryGroup: "🔄 Suscripciones Recurrentes",
    badge: "BIENVENIDA PLAN",
    icon: <Sparkles size={16} />,
    subject: "Bienvenido al plan de bienestar continuo · Novapatch",
  },
  {
    key: "subscription_upcoming_charge",
    label: "Aviso de Próximo Cobro (SubscriptionUpcomingCharge.tsx)",
    categoryGroup: "🔄 Suscripciones Recurrentes",
    badge: "RECORDATORIO COBRO",
    icon: <RefreshCw size={16} />,
    subject: "Tu próxima recarga mensual se procesará pronto · Novapatch",
  },
  {
    key: "subscription_renewed",
    label: "Renovación Exitosa (SubscriptionRenewed.tsx)",
    categoryGroup: "🔄 Suscripciones Recurrentes",
    badge: "RENOVACIÓN OK",
    icon: <CheckCircle2 size={16} />,
    subject: "Tu renovación mensual fue procesada con éxito · Novapatch",
  },
  {
    key: "subscription_payment_failed",
    label: "Pago Fallido de Suscripción (SubscriptionPaymentFailed.tsx)",
    categoryGroup: "🔄 Suscripciones Recurrentes",
    badge: "PAGO RECHAZADO",
    icon: <CreditCard size={16} />,
    subject: "Acción requerida: Problema con el cobro de tu suscripción · Novapatch",
  },
  {
    key: "cart_recovery",
    label: "Recuperación de Carrito (CartRecovery.tsx)",
    categoryGroup: "🛒 Carrito & Marketing",
    badge: "CARRITO GUARDADO",
    icon: <ShoppingBag size={16} />,
    subject: "Tus parches te están esperando · Novapatch",
  },
  {
    key: "influencer_samples",
    label: "Muestras a Influencers / PR (InfluencerSamplesShipped.tsx)",
    categoryGroup: "🛒 Carrito & Marketing",
    badge: "ENVÍO ESPECIAL PR",
    icon: <Gift size={16} />,
    subject: "Tus muestras Novapatch están en camino · Novapatch",
  },
  {
    key: "admin_invite",
    label: "Invitación de Administrador (AdminInvite.tsx)",
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
  const [fetchError, setFetchError] = useState<boolean>(false);

  useEffect(() => {
    setLoadingBackend(true);
    setFetchError(false);
    setBackendHtml(null);

    const backendUrl = process.env.NEXT_PUBLIC_MEDUSA_BACKEND_URL || "https://novabackend-production.up.railway.app";
    fetch(`${backendUrl}/store/custom/emails/preview?template=${activeKey}`)
      .then((res) => {
        if (!res.ok) throw new Error(`HTTP Error ${res.status}`);
        return res.text();
      })
      .then((html) => {
        setBackendHtml(html);
      })
      .catch((err) => {
        setFetchError(true);
        console.error("Error fetching live template from backend:", err);
      })
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
          customerName: "Cristian",
        }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Error al enviar");

      setStatusMessage({
        type: "success",
        text: `¡Email de prueba enviado exitosamente a ${testEmail.trim()}!`,
      });
    } catch (err) {
      setStatusMessage({
        type: "error",
        text: err instanceof Error ? err.message : "No se pudo enviar el correo de prueba.",
      });
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5] py-8 px-4 sm:px-6 lg:px-8 font-sans antialiased text-[#0F0F0F]">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Main Header Card */}
        <div className="bg-white border border-[#E6E1D8] rounded-2xl p-6 sm:p-8 shadow-2xs flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#0F0F0F] text-white text-[10px] font-mono font-bold tracking-widest uppercase">
              Medusa V2 Backend Emails
            </div>
            <h1 className="text-2xl sm:text-3xl font-sans font-extrabold text-[#0F0F0F] tracking-tight">
              hub de correos novapatch
            </h1>
            <p className="text-xs sm:text-sm font-sans text-[#3A3A37] max-w-xl">
              Visualizador oficial de las 11 plantillas cargadas directamente desde el servidor Backend Medusa.
            </p>
          </div>

          {/* Viewport Switcher */}
          <div className="flex items-center gap-1.5 bg-[#FAF8F5] border border-[#E6E1D8] p-1.5 rounded-xl self-start md:self-auto">
            <button
              onClick={() => setDevice("desktop")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-sans font-semibold transition-all ${
                device === "desktop"
                  ? "bg-[#0F0F0F] text-white shadow-xs"
                  : "text-[#3A3A37] hover:text-[#0F0F0F] hover:bg-white"
              }`}
            >
              <Monitor size={14} />
              <span>Escritorio</span>
            </button>
            <button
              onClick={() => setDevice("mobile")}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-sans font-semibold transition-all ${
                device === "mobile"
                  ? "bg-[#0F0F0F] text-white shadow-xs"
                  : "text-[#3A3A37] hover:text-[#0F0F0F] hover:bg-white"
              }`}
            >
              <Smartphone size={14} />
              <span>Móvil</span>
            </button>
          </div>
        </div>

        {/* Template Selector Card */}
        <div className="bg-white border border-[#E6E1D8] rounded-2xl p-6 shadow-2xs space-y-4">
          <label className="block text-[11px] font-mono uppercase font-bold tracking-widest text-[#3A3A37]">
            SELECCIONAR PLANTILLA DEL BACKEND (11 DISPONIBLES):
          </label>
          <div className="relative">
            <select
              value={activeKey}
              onChange={(e) => setActiveKey(e.target.value as BackendTemplateKey)}
              className="w-full appearance-none bg-[#FAF8F5] border border-[#E6E1D8] text-[#0F0F0F] text-sm font-sans font-semibold rounded-xl px-4 py-3.5 pr-10 focus:outline-none focus:border-[#0F0F0F] transition-colors cursor-pointer"
            >
              {BACKEND_TEMPLATES.map((tmpl) => (
                <option key={tmpl.key} value={tmpl.key}>
                  {tmpl.label}
                </option>
              ))}
            </select>
            <ChevronDown size={18} className="absolute right-4 top-1/2 -translate-y-1/2 text-[#3A3A37] pointer-events-none" />
          </div>

          <div className="flex flex-wrap items-center justify-between gap-2 pt-1 text-xs font-sans text-[#3A3A37]">
            <span className="flex items-center gap-1.5 font-semibold text-[#0F0F0F]">
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
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#3A3A37]">Asunto del Backend:</span>
              <p className="text-xs font-sans font-semibold text-[#0F0F0F] truncate">{currentTemplate.subject}</p>
            </div>
          </div>
          <span className="text-[10px] font-mono text-[#3A3A37] shrink-0 hidden sm:inline-block">
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
                <div className="absolute inset-0 bg-white/90 backdrop-blur-xs flex items-center justify-center z-10">
                  <div className="flex items-center gap-2 px-4 py-2 rounded-full bg-[#0F0F0F] text-white text-xs font-sans font-medium">
                    <Loader2 size={14} className="animate-spin" />
                    Consultando plantilla real desde el servidor Medusa backend...
                  </div>
                </div>
              )}

              {fetchError ? (
                <div className="p-8 text-center my-auto space-y-3">
                  <div className="inline-flex p-3 rounded-full bg-red-50 text-red-600">
                    <AlertCircle size={24} />
                  </div>
                  <h3 className="text-base font-sans font-bold text-[#0F0F0F]">
                    No se pudo cargar la plantilla desde el backend
                  </h3>
                  <p className="text-xs font-sans text-[#3A3A37] max-w-md mx-auto">
                    Asegúrate de que el backend en Railway tenga desplegada la última versión con la ruta <code className="font-mono bg-stone-100 px-1 py-0.5 rounded">/store/custom/emails/preview</code>.
                  </p>
                </div>
              ) : (
                <iframe
                  title="Email Preview"
                  srcDoc={backendHtml || ""}
                  className="w-full flex-1 border-0 min-h-[650px] bg-[#FAF8F5]"
                />
              )}
            </div>
          </div>
        </div>

        {/* Test Email Form Footer */}
        <div className="bg-white border border-[#E6E1D8] rounded-2xl p-6 shadow-2xs">
          <form onSubmit={handleSendTest} className="flex flex-col sm:flex-row items-center gap-3">
            <div className="relative flex-1 w-full">
              <Mail size={15} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-[#3A3A37]" />
              <input
                type="email"
                value={testEmail}
                onChange={(e) => setTestEmail(e.target.value)}
                placeholder="Ingresa tu correo para recibir una prueba real..."
                className="w-full pl-10 pr-4 py-3 text-xs font-sans font-medium text-[#0F0F0F] bg-[#FAF8F5] border border-[#E6E1D8] rounded-xl focus:border-[#0F0F0F] focus:outline-none transition-colors"
              />
            </div>
            <button
              type="submit"
              disabled={sending || !testEmail.trim()}
              className="w-full sm:w-auto px-6 py-3 rounded-xl bg-[#0F0F0F] text-white text-xs font-sans font-semibold flex items-center justify-center gap-2 hover:bg-[#252525] disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0"
            >
              {sending ? (
                <>
                  <Loader2 size={14} className="animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <Send size={14} />
                  <span>Enviar prueba</span>
                </>
              )}
            </button>
          </form>

          <AnimatePresence>
            {statusMessage && (
              <motion.div
                initial={{ opacity: 0, y: 5 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -5 }}
                className={`mt-4 p-3.5 rounded-xl text-xs font-sans font-semibold flex items-center gap-2 ${
                  statusMessage.type === "success"
                    ? "bg-[#F0FDF4] text-[#15803D] border border-[#DCFCE7]"
                    : "bg-[#FEF2F2] text-[#DC2626] border border-[#FECACA]"
                }`}
              >
                {statusMessage.type === "success" ? <CheckCircle2 size={16} /> : <AlertCircle size={16} />}
                <span>{statusMessage.text}</span>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </div>
  );
}
