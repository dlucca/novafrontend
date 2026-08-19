"use client";

import { useState, useEffect, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useUser, useAuth } from "@clerk/nextjs";
import Navbar from "@/components/Navbar";
import {
  medusa,
  type MedusaSubscription,
  type MedusaPaymentMethod,
  type MedusaOrder,
} from "@/lib/medusa";
import { PRODUCT_META } from "@/lib/product-meta";
import {
  Repeat,
  Pause,
  Play,
  X,
  CreditCard,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Clock,
  Package,
  ShieldCheck,
  Plus,
  Loader2,
  RefreshCw,
} from "lucide-react";

// ─── Helpers ──────────────────────────────────────────────────────────────────

function fmt(n: number) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "MXN",
    minimumFractionDigits: 0,
  }).format(n);
}

function fmtDate(iso: string) {
  return new Intl.DateTimeFormat("es-MX", {
    day: "numeric",
    month: "long",
    year: "numeric",
  }).format(new Date(iso));
}

const FREQ_LABELS: Record<number, string> = {
  30: "Mensual",
  60: "Bimestral",
  90: "Trimestral",
};

const SUB_STATUS_CONFIG: Record<string, { label: string; bg: string; color: string; icon: React.ReactNode }> = {
  active:                   { label: "Activa",          bg: "#0F0F0F", color: "#FFFFFF", icon: <CheckCircle2 size={13} /> },
  paused:                   { label: "Pausada",         bg: "#FAF8F5", color: "#3A3A37", icon: <Pause size={13} /> },
  cancelled:                { label: "Cancelada",       bg: "#FAF8F5", color: "#A8A29A", icon: <X size={13} /> },
  past_due:                 { label: "Pago pendiente",  bg: "#0F0F0F", color: "#FFFFFF", icon: <AlertCircle size={13} /> },
  delayed_out_of_stock:     { label: "Sin stock",       bg: "#FAF8F5", color: "#3A3A37", icon: <AlertCircle size={13} /> },
};

const ORDER_STATUS_CONFIG: Record<string, { label: string; bg: string; color: string }> = {
  pending:    { label: "Pendiente",  color: "#3A3A37", bg: "#FAF8F5" },
  processing: { label: "Procesando", color: "#0F0F0F", bg: "#FAF8F5" },
  shipped:    { label: "Enviado",    color: "#0F0F0F", bg: "#FAF8F5" },
  completed:  { label: "Entregado",  color: "#0F0F0F", bg: "#FAF8F5" },
  cancelled:  { label: "Cancelado",  color: "#A8A29A", bg: "#FAF8F5" },
};

// ─── Sub-components ───────────────────────────────────────────────────────────

function SubStatusBadge({ status }: { status: MedusaSubscription["status"] }) {
  const cfg = SUB_STATUS_CONFIG[status] ?? SUB_STATUS_CONFIG.active;
  return (
    <span
      className="inline-flex items-center gap-1 text-[11px] font-mono font-medium uppercase tracking-[0.12em] px-3 py-1 rounded-full border border-[#E6E1D8]"
      style={{ background: cfg.bg, color: cfg.color }}
    >
      {cfg.icon}
      {cfg.label}
    </span>
  );
}

function FrequencySelector({
  current,
  sub_id,
  token,
  onUpdate,
}: {
  current: 30 | 60 | 90;
  sub_id: string;
  token: string;
  onUpdate: (sub: MedusaSubscription) => void;
}) {
  const [loading, setLoading] = useState(false);
  const [open, setOpen] = useState(false);

  async function change(days: 30 | 60 | 90) {
    if (days === current) { setOpen(false); return; }
    setLoading(true);
    try {
      const updated = await medusa.subscriptions.updateFrequency(sub_id, days, token);
      onUpdate(updated);
    } catch {
      // revert silently
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        disabled={loading}
        className="flex items-center gap-1.5 text-xs font-sans font-semibold text-[#0F0F0F] hover:text-[#3A3A37] transition-colors disabled:opacity-50 cursor-pointer"
      >
        {loading ? <Loader2 size={12} className="animate-spin" /> : <Repeat size={12} />}
        {FREQ_LABELS[current]}
        <ChevronRight size={12} className={`transition-transform ${open ? "rotate-90" : ""}`} />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -6, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -6, scale: 0.95 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 mt-1 bg-white rounded-xl border border-[#E6E1D8] shadow-2xs z-20 overflow-hidden min-w-[140px]"
          >
            {([30, 60, 90] as const).map((d) => (
              <button
                key={d}
                onClick={() => change(d)}
                className={`w-full flex items-center justify-between px-4 py-2.5 text-xs font-sans font-medium transition-colors text-left ${
                  d === current ? "bg-[#FAF8F5] text-[#0F0F0F] font-semibold" : "text-[#3A3A37] hover:bg-[#FAF8F5]"
                }`}
              >
                {FREQ_LABELS[d]}
                {d === current && <CheckCircle2 size={12} className="text-[#0F0F0F]" />}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function SubscriptionCard({
  sub,
  token,
  onUpdate,
}: {
  sub: MedusaSubscription;
  token: string;
  onUpdate: (updated: MedusaSubscription) => void;
}) {
  const [loading, setLoading] = useState<"pause" | "resume" | "cancel" | null>(null);
  const [confirmCancel, setConfirmCancel] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const slug = sub.product_title.toLowerCase();
  const meta = PRODUCT_META[slug];
  const isCancelled = sub.status === "cancelled";
  const isAttention = sub.status === "past_due" || sub.status === "delayed_out_of_stock";

  async function action(type: "pause" | "resume" | "cancel") {
    setLoading(type);
    setError(null);
    const prev = { ...sub };
    const statusMap = { pause: "paused", resume: "active", cancel: "cancelled" } as const;
    onUpdate({ ...sub, status: statusMap[type] });
    try {
      let updated: MedusaSubscription;
      if (type === "pause")   updated = await medusa.subscriptions.pause(sub.id, token);
      else if (type === "resume") updated = await medusa.subscriptions.resume(sub.id, token);
      else                    updated = await medusa.subscriptions.cancel(sub.id, token);
      onUpdate(updated);
    } catch {
      onUpdate(prev);
      setError(type === "cancel" ? "No se pudo cancelar. Intenta de nuevo." : "No se pudo actualizar. Intenta de nuevo.");
    } finally {
      setLoading(null);
      setConfirmCancel(false);
    }
  }

  return (
    <motion.div
      layout
      className={`bg-white rounded-xl border border-[#E6E1D8] shadow-2xs overflow-hidden transition-all duration-300 ${
        isCancelled ? "opacity-60" : ""
      }`}
    >
      <div className="p-5 flex gap-4">
        <div
          className="shrink-0 w-16 h-16 rounded-xl border border-[#E6E1D8] bg-[#FAF8F5] flex items-center justify-center"
        >
          {meta && (
            <div className="relative w-12 h-12">
              <Image src={meta.imgSrc} alt={sub.product_title} fill className="object-contain" />
            </div>
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2 mb-1.5">
            <div>
              <p className="text-base font-sans font-semibold text-[#0F0F0F] leading-tight">
                Novapatch {sub.product_title}
              </p>
              <p className="text-xs font-mono text-[#3A3A37] mt-0.5">
                {fmt(sub.unit_price * sub.quantity)} / entrega
              </p>
            </div>
            <SubStatusBadge status={sub.status} />
          </div>

          <div className="flex flex-wrap items-center gap-3 mt-2">
            {!isCancelled && !isAttention && (
              <FrequencySelector
                current={sub.interval_days}
                sub_id={sub.id}
                token={token}
                onUpdate={onUpdate}
              />
            )}
            {sub.status === "active" && (
              <span className="flex items-center gap-1 text-xs font-mono text-[#A8A29A]">
                <Clock size={11} />
                Próxima entrega: {fmtDate(sub.next_delivery_at)}
              </span>
            )}
            {sub.status === "paused" && (
              <span className="flex items-center gap-1 text-xs font-sans text-[#3A3A37]">
                <Pause size={11} />
                Envíos pausados
              </span>
            )}
            {isAttention && (
              <span className="flex items-center gap-1 text-xs font-sans text-[#0F0F0F] font-medium">
                <AlertCircle size={11} />
                Requiere atención — contacta a soporte
              </span>
            )}
          </div>
        </div>
      </div>

      {error && (
        <div className="px-5 pb-2">
          <p className="text-xs font-sans text-[#0F0F0F] font-medium">{error}</p>
        </div>
      )}

      {!isCancelled && !isAttention && (
        <div className="px-5 pb-4 flex items-center gap-2 flex-wrap pt-2 border-t border-[#E6E1D8]/60">
          {sub.status === "active" && (
            <button
              onClick={() => action("pause")}
              disabled={loading !== null}
              className="flex items-center gap-1.5 text-xs font-sans font-medium px-3.5 py-1.5 rounded-full border border-[#E6E1D8] bg-[#FAF8F5] text-[#3A3A37] hover:bg-white hover:text-[#0F0F0F] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading === "pause" ? <Loader2 size={12} className="animate-spin" /> : <Pause size={12} />}
              Pausar
            </button>
          )}
          {sub.status === "paused" && (
            <button
              onClick={() => action("resume")}
              disabled={loading !== null}
              className="flex items-center gap-1.5 text-xs font-sans font-medium px-3.5 py-1.5 rounded-full bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all disabled:opacity-50 cursor-pointer"
            >
              {loading === "resume" ? <Loader2 size={12} className="animate-spin" /> : <Play size={12} />}
              Reanudar
            </button>
          )}

          {!confirmCancel ? (
            <button
              onClick={() => setConfirmCancel(true)}
              className="flex items-center gap-1.5 text-xs font-sans text-[#A8A29A] hover:text-[#0F0F0F] transition-colors ml-auto cursor-pointer"
            >
              <X size={12} />
              Cancelar suscripción
            </button>
          ) : (
            <motion.div
              initial={{ opacity: 0, x: 8 }}
              animate={{ opacity: 1, x: 0 }}
              className="ml-auto flex items-center gap-2"
            >
              <span className="text-xs font-sans text-[#0F0F0F] font-bold">¿Confirmar cancelación?</span>
              <button
                onClick={() => action("cancel")}
                disabled={loading !== null}
                className="text-xs font-sans font-medium px-3 py-1 rounded-full bg-[#0F0F0F] text-white hover:bg-[#3A3A37] transition-colors disabled:opacity-50 cursor-pointer"
              >
                {loading === "cancel" ? <Loader2 size={11} className="animate-spin" /> : "Sí, cancelar"}
              </button>
              <button
                onClick={() => setConfirmCancel(false)}
                className="text-xs font-sans text-[#A8A29A] hover:text-[#0F0F0F] transition-colors cursor-pointer"
              >
                No
              </button>
            </motion.div>
          )}
        </div>
      )}
    </motion.div>
  );
}

function PaymentMethodCard({ pm }: { pm: MedusaPaymentMethod }) {
  return (
    <div className="flex items-center gap-4 p-4 bg-white rounded-xl border border-[#E6E1D8] shadow-2xs">
      <div
        className="flex h-10 w-14 items-center justify-center rounded-lg text-xs font-mono font-bold text-white bg-[#0F0F0F] shrink-0"
      >
        {pm.brand.slice(0, 4)}
      </div>
      <div className="flex-1">
        <p className="text-sm font-sans font-semibold text-[#0F0F0F]">•••• {pm.last4.slice(-4)}</p>
        <p className="text-xs font-mono text-[#A8A29A]">
          Vence {pm.exp_month.toString().padStart(2, "0")}/{pm.exp_year}
        </p>
      </div>
      {pm.is_default && (
        <span className="text-[10px] font-mono uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#0F0F0F] text-white">
          Principal
        </span>
      )}
    </div>
  );
}

function OrderRow({ order }: { order: MedusaOrder }) {
  const cfg = ORDER_STATUS_CONFIG[order.status] ?? { label: order.status, color: "#3A3A37", bg: "#FAF8F5" };

  return (
    <div className="bg-white rounded-xl border border-[#E6E1D8] shadow-2xs p-5">
      <div className="flex items-start justify-between gap-3 mb-3">
        <div>
          <p className="text-sm font-sans font-semibold text-[#0F0F0F]">
            Pedido #{order.display_id}
          </p>
          <p className="text-xs font-mono text-[#A8A29A] mt-0.5">
            {fmtDate(order.created_at)}
          </p>
        </div>
        <span
          className="text-xs font-mono uppercase tracking-wider px-2.5 py-1 rounded-full border border-[#E6E1D8] shrink-0"
          style={{ background: cfg.bg, color: cfg.color }}
        >
          {cfg.label}
        </span>
      </div>

      <div className="flex flex-col gap-1.5 mt-1">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center gap-2">
            <Package size={13} className="text-[#A8A29A] shrink-0" />
            <span className="text-xs font-sans text-[#3A3A37]">
              {item.title}
              {item.quantity > 1 && (
                <span className="ml-1.5 font-mono text-[11px] text-[#A8A29A]">×{item.quantity}</span>
              )}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function TabSkeleton() {
  return (
    <div className="space-y-3">
      {[1, 2].map((i) => (
        <div key={i} className="bg-white rounded-xl border border-[#E6E1D8] p-5 animate-pulse">
          <div className="flex gap-4">
            <div className="w-16 h-16 rounded-xl bg-[#FAF8F5]" />
            <div className="flex-1 space-y-2">
              <div className="h-4 w-32 rounded bg-[#FAF8F5]" />
              <div className="h-3 w-20 rounded bg-[#FAF8F5]" />
              <div className="h-3 w-28 rounded bg-[#FAF8F5]" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TabError({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="bg-white rounded-xl border border-[#E6E1D8] p-8 text-center">
      <AlertCircle size={24} className="mx-auto text-[#0F0F0F] mb-3" />
      <p className="text-sm font-sans text-[#3A3A37] mb-4">No se pudo cargar la información.</p>
      <button
        onClick={onRetry}
        className="inline-flex items-center gap-2 text-xs font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] hover:underline cursor-pointer"
      >
        <RefreshCw size={13} />
        Reintentar
      </button>
    </div>
  );
}

// ─── Tab contents ─────────────────────────────────────────────────────────────

function TabSuscripciones({
  subscriptions,
  loading,
  error,
  token,
  onUpdate,
  onRetry,
}: {
  subscriptions: MedusaSubscription[];
  loading: boolean;
  error: boolean;
  token: string;
  onUpdate: (sub: MedusaSubscription) => void;
  onRetry: () => void;
}) {
  if (loading) return <TabSkeleton />;
  if (error) return <TabError onRetry={onRetry} />;

  const active    = subscriptions.filter((s) => s.status === "active");
  const paused    = subscriptions.filter((s) => s.status === "paused");
  const attention = subscriptions.filter((s) => s.status === "past_due" || s.status === "delayed_out_of_stock");
  const cancelled = subscriptions.filter((s) => s.status === "cancelled");

  if (subscriptions.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <Repeat size={36} className="mx-auto text-[#A8A29A] mb-4" />
        <h3 className="text-xl font-display font-semibold text-[#0F0F0F] mb-2 tracking-[-0.035em] lowercase">
          aún no tienes suscripciones
        </h3>
        <p className="text-sm font-sans text-[#3A3A37] mb-6 max-w-[280px] mx-auto leading-relaxed">
          Suscribite a tus parches favoritos y ahorra hasta 20% en cada entrega.
        </p>
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all cursor-pointer"
        >
          Ver suscripciones disponibles
          <ChevronRight size={14} />
        </Link>
      </motion.div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Requieren atención */}
      {attention.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#E6E1D8]">
              <AlertCircle size={14} className="text-[#0F0F0F]" />
            </div>
            <h2 className="text-base font-display font-semibold text-[#0F0F0F] tracking-[-0.02em] lowercase">
              requieren atención ({attention.length})
            </h2>
          </div>
          <div className="space-y-3">
            {attention.map((sub) => (
              <SubscriptionCard key={sub.id} sub={sub} token={token} onUpdate={onUpdate} />
            ))}
          </div>
        </section>
      )}

      {/* Activas */}
      <section>
        <div className="flex items-center gap-2 mb-3">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#E6E1D8]">
            <CheckCircle2 size={14} className="text-[#0F0F0F]" />
          </div>
          <h2 className="text-base font-display font-semibold text-[#0F0F0F] tracking-[-0.02em] lowercase">
            activas
            <span className="ml-2 text-xs font-mono text-[#A8A29A]">({active.length})</span>
          </h2>
        </div>
        {active.length === 0 ? (
          <div className="bg-white rounded-xl border border-dashed border-[#E6E1D8] p-6 text-center">
            <p className="text-xs font-sans text-[#A8A29A]">No tienes suscripciones activas.</p>
            <Link href="/tienda" className="inline-flex items-center gap-1.5 mt-3 text-xs font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] hover:underline">
              Explorar productos <ChevronRight size={13} />
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {active.map((sub) => (
              <SubscriptionCard key={sub.id} sub={sub} token={token} onUpdate={onUpdate} />
            ))}
          </div>
        )}
      </section>

      {/* Pausadas */}
      {paused.length > 0 && (
        <section>
          <div className="flex items-center gap-2 mb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#E6E1D8]">
              <Pause size={14} className="text-[#0F0F0F]" />
            </div>
            <h2 className="text-base font-display font-semibold text-[#0F0F0F] tracking-[-0.02em] lowercase">
              pausadas
              <span className="ml-2 text-xs font-mono text-[#A8A29A]">({paused.length})</span>
            </h2>
          </div>
          <div className="space-y-3">
            {paused.map((sub) => (
              <SubscriptionCard key={sub.id} sub={sub} token={token} onUpdate={onUpdate} />
            ))}
          </div>
        </section>
      )}

      {/* Canceladas (collapsible) */}
      {cancelled.length > 0 && (
        <section>
          <details className="group">
            <summary className="flex items-center gap-2 cursor-pointer list-none mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF8F5] border border-[#E6E1D8]">
                <X size={14} className="text-[#A8A29A]" />
              </div>
              <h2 className="text-base font-display font-semibold text-[#A8A29A] tracking-[-0.02em] lowercase">
                canceladas ({cancelled.length})
              </h2>
              <ChevronRight size={13} className="text-[#A8A29A] ml-auto group-open:rotate-90 transition-transform" />
            </summary>
            <div className="space-y-3">
              {cancelled.map((sub) => (
                <SubscriptionCard key={sub.id} sub={sub} token={token} onUpdate={onUpdate} />
              ))}
            </div>
          </details>
        </section>
      )}
    </div>
  );
}

function TabPedidos({
  orders,
  loading,
  error,
  onRetry,
}: {
  orders: MedusaOrder[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  if (loading) return <TabSkeleton />;
  if (error) return <TabError onRetry={onRetry} />;

  if (orders.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center py-16"
      >
        <Package size={36} className="mx-auto text-[#A8A29A] mb-4" />
        <h3 className="text-xl font-display font-semibold text-[#0F0F0F] mb-2 tracking-[-0.035em] lowercase">
          aún no tienes pedidos
        </h3>
        <p className="text-sm font-sans text-[#3A3A37] mb-6 max-w-[260px] mx-auto leading-relaxed">
          Tus compras aparecerán aquí una vez que realices tu primer pedido.
        </p>
        <Link
          href="/tienda"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-full text-xs font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all cursor-pointer"
        >
          Ir a la tienda
          <ChevronRight size={14} />
        </Link>
      </motion.div>
    );
  }

  const sorted = [...orders].sort(
    (a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
  );

  return (
    <div className="space-y-3">
      {sorted.map((order) => (
        <OrderRow key={order.id} order={order} />
      ))}
    </div>
  );
}

function TabPago({
  paymentMethods,
  loading,
  error,
  onRetry,
}: {
  paymentMethods: MedusaPaymentMethod[];
  loading: boolean;
  error: boolean;
  onRetry: () => void;
}) {
  if (loading) return <TabSkeleton />;
  if (error) return <TabError onRetry={onRetry} />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-base font-display font-semibold text-[#0F0F0F] tracking-[-0.02em] lowercase">tarjetas guardadas</h2>
        <button className="flex items-center gap-1 text-xs font-sans font-medium uppercase tracking-[0.12em] text-[#0F0F0F] hover:underline cursor-pointer">
          <Plus size={12} />
          Agregar
        </button>
      </div>

      {paymentMethods.length === 0 ? (
        <div className="bg-white rounded-xl border border-dashed border-[#E6E1D8] p-6 text-center">
          <CreditCard size={24} className="mx-auto text-[#A8A29A] mb-3" />
          <p className="text-xs font-sans text-[#A8A29A]">No tienes tarjetas guardadas.</p>
        </div>
      ) : (
        <div className="space-y-2">
          {paymentMethods.map((pm) => (
            <PaymentMethodCard key={pm.id} pm={pm} />
          ))}
        </div>
      )}

      <div className="flex items-center gap-2 p-3 rounded-xl bg-white border border-[#E6E1D8]">
        <ShieldCheck size={14} className="text-[#0F0F0F] shrink-0" />
        <p className="text-xs font-sans text-[#3A3A37] leading-relaxed">
          Tus datos de pago están encriptados y gestionados de forma segura por{" "}
          <span className="font-semibold text-[#0F0F0F]">Openpay</span>. Novapatch nunca almacena datos de tarjeta.
        </p>
      </div>
    </div>
  );
}

// ─── Main Page ────────────────────────────────────────────────────────────────

const TABS = [
  { id: "suscripciones", label: "Suscripciones" },
  { id: "pedidos",       label: "Pedidos" },
  { id: "pago",          label: "Pago" },
] as const;

type TabId = typeof TABS[number]["id"];

function MiCuentaContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const { getToken } = useAuth();

  const rawTab = searchParams.get("tab");
  const activeTab: TabId = (["suscripciones", "pedidos", "pago"] as const).includes(rawTab as TabId)
    ? (rawTab as TabId)
    : "suscripciones";

  const [token, setToken] = useState<string>("");
  const [subscriptions, setSubscriptions] = useState<MedusaSubscription[]>([]);
  const [orders, setOrders] = useState<MedusaOrder[]>([]);
  const [paymentMethods, setPaymentMethods] = useState<MedusaPaymentMethod[]>([]);

  const [loading, setLoading] = useState({ subs: true, orders: true, pms: true });
  const [errors, setErrors]   = useState({ subs: false, orders: false, pms: false });

  const loadSubs = useCallback(async (tok: string) => {
    setLoading((l) => ({ ...l, subs: true }));
    setErrors((e) => ({ ...e, subs: false }));
    medusa.subscriptions.list(tok)
      .then(setSubscriptions)
      .catch(() => setErrors((e) => ({ ...e, subs: true })))
      .finally(() => setLoading((l) => ({ ...l, subs: false })));
  }, []);

  const loadOrders = useCallback(async (tok: string) => {
    setLoading((l) => ({ ...l, orders: true }));
    setErrors((e) => ({ ...e, orders: false }));
    medusa.orders.list(tok)
      .then(setOrders)
      .catch(() => setErrors((e) => ({ ...e, orders: true })))
      .finally(() => setLoading((l) => ({ ...l, orders: false })));
  }, []);

  const loadPms = useCallback(async (tok: string) => {
    setLoading((l) => ({ ...l, pms: true }));
    setErrors((e) => ({ ...e, pms: false }));
    medusa.paymentMethods.list(tok)
      .then(setPaymentMethods)
      .catch(() => setErrors((e) => ({ ...e, pms: true })))
      .finally(() => setLoading((l) => ({ ...l, pms: false })));
  }, []);

  const loadData = useCallback(async () => {
    const tok = await getToken();
    if (!tok) {
      setLoading({ subs: false, orders: false, pms: false });
      return;
    }
    setToken(tok);
    loadSubs(tok);
    loadOrders(tok);
    loadPms(tok);
  }, [getToken, loadSubs, loadOrders, loadPms]);

  useEffect(() => {
    if (isLoaded && user) loadData();
  }, [isLoaded, user, loadData]);

  function updateSub(updated: MedusaSubscription) {
    setSubscriptions((prev) =>
      prev.map((s) => (s.id === updated.id ? { ...s, ...updated } : s))
    );
  }

  function setTab(id: TabId) {
    router.push(`/cuenta?tab=${id}`, { scroll: false });
  }

  if (!isLoaded) {
    return (
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#0F0F0F]" />
      </div>
    );
  }

  if (!user) {
    router.replace("/sign-in");
    return null;
  }

  return (
    <div className="min-h-screen bg-[#FAF8F5]">
      <Navbar lightBg={true} />

      {/* Account hero — bone brand header */}
      <div className="pt-[76px]">
        <div className="relative overflow-hidden bg-[#FAF8F5] border-b border-[#E6E1D8]">
          <div className="relative z-10 max-w-2xl mx-auto px-6 py-8 flex items-center gap-5">
            {/* Avatar */}
            <div className="relative h-[60px] w-[60px] shrink-0 overflow-hidden rounded-full border border-[#E6E1D8] bg-white">
              {user.imageUrl ? (
                <Image src={user.imageUrl} alt={user.fullName ?? "Avatar"} fill sizes="60px" className="object-cover" />
              ) : (
                <div className="flex h-full w-full items-center justify-center bg-[#0F0F0F] text-lg font-mono font-bold text-white">
                  {user.firstName?.[0] ?? "N"}
                </div>
              )}
            </div>
            <div className="min-w-0">
              <span className="text-[11px] font-sans font-medium uppercase tracking-[0.12em] text-[#A8A29A] block mb-1">
                mi cuenta
              </span>
              <h1 className="text-2xl sm:text-3xl font-display font-semibold text-[#0F0F0F] leading-tight tracking-[-0.035em] truncate lowercase">
                {user.fullName ?? user.primaryEmailAddress?.emailAddress}
              </h1>
              {user.fullName && (
                <p className="text-xs font-sans text-[#3A3A37] mt-0.5 truncate">
                  {user.primaryEmailAddress?.emailAddress}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Sticky tab nav */}
        <div className="sticky top-[76px] z-30 bg-[#FAF8F5] border-b border-[#E6E1D8]">
          <div className="max-w-2xl mx-auto px-6">
            <div className="flex">
              {TABS.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setTab(tab.id)}
                  className={`px-5 py-4 text-xs font-sans font-medium uppercase tracking-[0.12em] border-b-2 transition-all duration-200 cursor-pointer ${
                    activeTab === tab.id
                      ? "border-[#0F0F0F] text-[#0F0F0F]"
                      : "border-transparent text-[#A8A29A] hover:text-[#0F0F0F]"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Tab content */}
      <div className="max-w-2xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.18 }}
          >
            {activeTab === "suscripciones" && (
              <TabSuscripciones
                subscriptions={subscriptions}
                loading={loading.subs}
                error={errors.subs}
                token={token}
                onUpdate={updateSub}
                onRetry={() => { getToken().then((tok) => { if (tok) loadSubs(tok); }); }}
              />
            )}
            {activeTab === "pedidos" && (
              <TabPedidos
                orders={orders}
                loading={loading.orders}
                error={errors.orders}
                onRetry={() => { getToken().then((tok) => { if (tok) loadOrders(tok); }); }}
              />
            )}
            {activeTab === "pago" && (
              <TabPago
                paymentMethods={paymentMethods}
                loading={loading.pms}
                error={errors.pms}
                onRetry={() => { getToken().then((tok) => { if (tok) loadPms(tok); }); }}
              />
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default function MiCuentaPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#FAF8F5] flex items-center justify-center">
        <Loader2 size={28} className="animate-spin text-[#0F0F0F]" />
      </div>
    }>
      <MiCuentaContent />
    </Suspense>
  );
}
