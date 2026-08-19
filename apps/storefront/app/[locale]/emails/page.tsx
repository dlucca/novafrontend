"use client";

import { useState } from "react";
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
  Sparkles,
  ShoppingBag,
  RefreshCw,
} from "lucide-react";
import {
  renderOrderConfirmationEmail,
  renderWelcomeEmail,
  renderCartRecoveryEmail,
  renderSubscriptionAlertEmail,
} from "@/lib/emails/templates";

type EmailTemplateKey = "order" | "welcome" | "cart" | "subscription";

const TEMPLATES: {
  key: EmailTemplateKey;
  label: string;
  badge: string;
  icon: React.ReactNode;
  subject: string;
}[] = [
  {
    key: "order",
    label: "Confirmación de Compra",
    badge: "ORDEN CONFIRMADA",
    icon: <PackageCheck size={16} />,
    subject: "Confirmación de pedido #NV-84920 · Novapatch",
  },
  {
    key: "welcome",
    label: "Bienvenida & Guía de Uso",
    badge: "BIENVENIDO",
    icon: <Sparkles size={16} />,
    subject: "Bienvenido a Novapatch · Tu ritual empieza hoy",
  },
  {
    key: "cart",
    label: "Recuperación de Carrito",
    badge: "CARRITO GUARDADO",
    icon: <ShoppingBag size={16} />,
    subject: "Tus parches te están esperando · Novapatch",
  },
  {
    key: "subscription",
    label: "Aviso de Suscripción",
    badge: "RENOVACIÓN",
    icon: <RefreshCw size={16} />,
    subject: "Tu próxima recarga mensual se prepara · Novapatch",
  },
];

export default function EmailsPreviewPage() {
  const [activeKey, setActiveKey] = useState<EmailTemplateKey>("order");
  const [device, setDevice] = useState<"desktop" | "mobile">("desktop");
  const [testEmail, setTestEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [statusMessage, setStatusMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Generate HTML for current template
  const getHtml = (key: EmailTemplateKey) => {
    const origin = typeof window !== "undefined" ? window.location.origin : "";
    switch (key) {
      case "order":
        return renderOrderConfirmationEmail({
          orderNumber: "NV-84920",
          customerName: "Esteban",
          customerEmail: "esteban@ejemplo.com",
          items: [
            { title: "Novapatch Energy", quantity: 1, price: 750, image: "/products/Energy_thumb.webp" },
            { title: "Novapatch Sleep", quantity: 1, price: 750, image: "/products/Sleep_thumb.webp" },
          ],
          subtotal: 1500,
          bundleDiscount: 225,
          bundleName: "Pack Día & Noche (15% OFF)",
          total: 1275,
          shippingAddress: {
            address: "Av. Insurgentes Sur 1602, Piso 4",
            city: "Ciudad de México",
            state: "CDMX",
            postalCode: "03940",
          },
        }, origin);

      case "welcome":
        return renderWelcomeEmail("Esteban", origin);

      case "cart":
        return renderCartRecoveryEmail("Esteban", [
          { title: "Novapatch Glow", quantity: 1, price: 750, image: "/products/Glow_thumb.webp" },
          { title: "Novapatch Woman", quantity: 1, price: 750, image: "/products/Woman_thumb.webp" },
        ], 1275, origin);

      case "subscription":
        return renderSubscriptionAlertEmail("Esteban", "Suscripción Pack Día & Noche (15% OFF)", "18 de Agosto, 2026", 1275, origin);
    }
  };

  const currentTemplate = TEMPLATES.find((t) => t.key === activeKey)!;
  const currentHtml = getHtml(activeKey);

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
                CENTRO DE EMAILS TRANSACCIONALES
              </span>
            </div>
            <h1 className="text-2xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] lowercase">
              vista previa de correos novapatch
            </h1>
            <p className="text-xs font-sans text-[#A8A29A] mt-0.5">
              Plantillas HTML diseñadas según el Brand Kit Definitivo. Listas para producción vía Resend.
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

        {/* Template Selector Tabs */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {TEMPLATES.map((t) => {
            const isActive = activeKey === t.key;
            return (
              <button
                key={t.key}
                onClick={() => setActiveKey(t.key)}
                className={`p-4 rounded-xl border text-left transition-all duration-200 cursor-pointer flex flex-col justify-between h-24 ${
                  isActive
                    ? "bg-white border-[#0F0F0F] shadow-md ring-1 ring-[#0F0F0F]"
                    : "bg-white border-[#E6E1D8] hover:border-[#AEAEAF] shadow-2xs"
                }`}
              >
                <div className="flex items-center justify-between w-full">
                  <span className={`p-2 rounded-lg ${isActive ? "bg-[#0F0F0F] text-white" : "bg-[#FAF8F5] text-[#0F0F0F]"}`}>
                    {t.icon}
                  </span>
                  <span className="text-[9px] font-mono font-bold uppercase tracking-wider px-2 py-0.5 rounded-full bg-[#FAF8F5] text-[#3A3A37] border border-[#E6E1D8]">
                    {t.badge}
                  </span>
                </div>
                <p className="text-xs font-sans font-semibold text-[#0F0F0F] truncate">
                  {t.label}
                </p>
              </button>
            );
          })}
        </div>

        {/* Subject Header Bar */}
        <div className="bg-white border border-[#E6E1D8] rounded-xl px-5 py-3.5 flex items-center justify-between gap-4 shadow-2xs">
          <div className="flex items-center gap-3 min-w-0">
            <Mail size={16} className="text-[#0F0F0F] shrink-0" />
            <div className="min-w-0">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#A8A29A]">Asunto:</span>
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
            <div className="bg-white border border-[#E6E1D8] rounded-2xl shadow-lg overflow-hidden min-h-[600px] flex flex-col">
              <iframe
                title="Email Preview"
                srcDoc={currentHtml}
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
