"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

// ─── Types ────────────────────────────────────────────────────────────────────

type FormData = {
  producto: string;
  email: string;
  parches_usados: string;
  uso_diario: string;
  tiempo_uso: string;
  motivo: string;
  motivo_otro: string;
  experiencia: string;
  reaccion: string;
  reaccion_detalle: string;
  empaque: string;
  rating: number;
  menos_gusto: string[];
  mejora: string;
  volveria: string;
  evidencia: string;
  comentario_final: string;
};

const EMPTY: FormData = {
  producto: "", email: "", parches_usados: "", uso_diario: "", tiempo_uso: "",
  motivo: "", motivo_otro: "", experiencia: "", reaccion: "", reaccion_detalle: "",
  empaque: "", rating: 0, menos_gusto: [], mejora: "", volveria: "", evidencia: "",
  comentario_final: "",
};

// ─── Step config ──────────────────────────────────────────────────────────────

const STEPS = [
  { label: "Tu pedido" },
  { label: "Tu experiencia" },
  { label: "Motivo" },
  { label: "Estado" },
  { label: "Opinión" },
];

// ─── Shared field components ──────────────────────────────────────────────────

function Radio({ name, value, label, checked, onChange }: {
  name: string; value: string; label: string; checked: boolean; onChange: () => void;
}) {
  return (
    <label className="flex items-start gap-3 cursor-pointer group">
      <div
        className="mt-0.5 w-4 h-4 rounded-full border shrink-0 flex items-center justify-center transition-all duration-150"
        style={{
          borderColor: checked ? "#0F0F0F" : "#E6E1D8",
          background: checked ? "#0F0F0F" : "white",
        }}
        onClick={onChange}
      >
        {checked && <div className="w-1.5 h-1.5 rounded-full bg-white" />}
      </div>
      <input type="radio" name={name} value={value} checked={checked} onChange={onChange} className="sr-only" />
      <span
        className={`text-xs font-sans transition-colors duration-150 ${checked ? "text-[#0F0F0F] font-semibold" : "text-[#3A3A37]"}`}
        onClick={onChange}
      >
        {label}
      </span>
    </label>
  );
}

function Checkbox({ label, checked, onChange }: { label: string; checked: boolean; onChange: () => void }) {
  return (
    <label className="flex items-start gap-3 cursor-pointer">
      <div
        className="mt-0.5 w-4 h-4 rounded shrink-0 flex items-center justify-center transition-all duration-150 border"
        style={{
          borderColor: checked ? "#0F0F0F" : "#E6E1D8",
          background: checked ? "#0F0F0F" : "white",
        }}
        onClick={onChange}
      >
        {checked && (
          <svg width="10" height="8" viewBox="0 0 10 8" fill="none">
            <path d="M1 4l3 3 5-6" stroke="white" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        )}
      </div>
      <span className={`text-xs font-sans ${checked ? "text-[#0F0F0F] font-semibold" : "text-[#3A3A37]"}`} onClick={onChange}>
        {label}
      </span>
    </label>
  );
}

function FieldLabel({ children }: { children: React.ReactNode }) {
  return <p className="text-sm font-sans font-semibold text-[#0F0F0F] mb-3">{children}</p>;
}

function Optional() {
  return <span className="text-xs font-normal text-[#A8A29A] ml-1.5">opcional</span>;
}

// ─── Steps ────────────────────────────────────────────────────────────────────

function Step1({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  const productos = ["Energy — energía funcional", "Sleep — descanso nocturno", "Zen — calma y equilibrio mental",
    "Shield — bienestar preventivo", "Glow — bienestar de la piel", "Woman — equilibrio femenino", "Compré varios productos"];
  return (
    <div className="flex flex-col gap-8">
      <div>
        <FieldLabel>¿Qué producto compraste?</FieldLabel>
        <div className="flex flex-col gap-3">
          {productos.map((p) => (
            <Radio key={p} name="producto" value={p} label={p} checked={data.producto === p} onChange={() => set("producto", p)} />
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>¿Cuál es el email con el que hiciste la compra?</FieldLabel>
        <input
          type="email"
          value={data.email}
          onChange={(e) => set("email", e.target.value)}
          placeholder="tu@correo.com"
          className="w-full px-4 py-3 rounded-xl border border-[#E6E1D8] bg-[#FAF8F5] text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] outline-none focus:bg-white focus:border-[#0F0F0F] transition-all"
        />
      </div>
    </div>
  );
}

function Step2({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  const parches = ["Ninguno — no llegué a usar el producto", "1 a 3 parches", "4 a 7 parches", "Más de 7 parches"];
  const uso = ["Sí, lo usé todos los días", "La mayoría de los días, pero hubo interrupciones",
    "Solo algunos días, no fui constante", "No aplica — no llegué a usarlo"];
  const tiempos = ["Menos de 1 semana", "1 a 2 semanas", "2 a 4 semanas", "Más de 1 mes", "No aplica — no lo usé"];

  return (
    <div className="flex flex-col gap-8">
      <div>
        <FieldLabel>¿Cuántos parches usaste antes de pedir el reembolso?</FieldLabel>
        <div className="flex flex-col gap-3">
          {parches.map((p) => (
            <Radio key={p} name="parches_usados" value={p} label={p} checked={data.parches_usados === p} onChange={() => set("parches_usados", p)} />
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>¿Usaste el parche de forma diaria o constante?</FieldLabel>
        <div className="flex flex-col gap-3">
          {uso.map((u) => (
            <Radio key={u} name="uso_diario" value={u} label={u} checked={data.uso_diario === u} onChange={() => set("uso_diario", u)} />
          ))}
        </div>
      </div>
      <div>
        <FieldLabel>¿Cuánto tiempo usaste el producto antes de notar que no era para ti?</FieldLabel>
        <div className="flex flex-col gap-3">
          {tiempos.map((t) => (
            <Radio key={t} name="tiempo_uso" value={t} label={t} checked={data.tiempo_uso === t} onChange={() => set("tiempo_uso", t)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Step3({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  const motivos = ["No noté ningún efecto o resultado", "Tuve una reacción en la piel",
    "El producto llegó dañado o en mal estado", "El envío tardó demasiado",
    "No era lo que esperaba según la descripción", "Simplemente cambié de opinión", "Otro motivo"];
  return (
    <div className="flex flex-col gap-8">
      <div>
        <FieldLabel>¿Cuál es el motivo principal de tu insatisfacción?</FieldLabel>
        <div className="flex flex-col gap-3">
          {motivos.map((m) => (
            <Radio key={m} name="motivo" value={m} label={m} checked={data.motivo === m} onChange={() => set("motivo", m)} />
          ))}
        </div>
        {data.motivo === "Otro motivo" && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
            <textarea
              value={data.motivo_otro}
              onChange={(e) => set("motivo_otro", e.target.value)}
              placeholder="Cuéntanos más..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#E6E1D8] bg-[#FAF8F5] text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] outline-none focus:bg-white focus:border-[#0F0F0F] resize-none transition-all"
            />
          </motion.div>
        )}
      </div>
      <div>
        <FieldLabel>¿Qué resultado esperabas y qué fue lo que experimentaste? <Optional /></FieldLabel>
        <textarea
          value={data.experiencia}
          onChange={(e) => set("experiencia", e.target.value)}
          placeholder="Describe brevemente tu experiencia..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[#E6E1D8] bg-[#FAF8F5] text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] outline-none focus:bg-white focus:border-[#0F0F0F] resize-none transition-all"
        />
      </div>
    </div>
  );
}

function Step4({ data, set }: { data: FormData; set: (k: keyof FormData, v: string) => void }) {
  const reacciones = ["No, ninguna", "Sí — irritación leve en la piel", "Sí — enrojecimiento o picazón",
    "Sí — reacción más intensa", "No lo usé, no puedo saberlo"];
  const empaques = ["Sí, llegó en perfecto estado", "El empaque tenía algún daño visible",
    "El sobre del parche estaba abierto o roto", "Recibí un producto distinto al que pedí"];
  return (
    <div className="flex flex-col gap-8">
      <div>
        <FieldLabel>¿Tuviste alguna reacción física al usar el parche?</FieldLabel>
        <div className="flex flex-col gap-3">
          {reacciones.map((r) => (
            <Radio key={r} name="reaccion" value={r} label={r} checked={data.reaccion === r} onChange={() => set("reaccion", r)} />
          ))}
        </div>
        {data.reaccion === "Sí — reacción más intensa" && (
          <motion.div initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} className="mt-3">
            <textarea
              value={data.reaccion_detalle}
              onChange={(e) => set("reaccion_detalle", e.target.value)}
              placeholder="Describe la reacción con más detalle..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-[#E6E1D8] bg-[#FAF8F5] text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] outline-none focus:bg-white focus:border-[#0F0F0F] resize-none transition-all"
            />
          </motion.div>
        )}
      </div>
      <div>
        <FieldLabel>¿El empaque llegó en buen estado?</FieldLabel>
        <div className="flex flex-col gap-3">
          {empaques.map((e) => (
            <Radio key={e} name="empaque" value={e} label={e} checked={data.empaque === e} onChange={() => set("empaque", e)} />
          ))}
        </div>
      </div>
    </div>
  );
}

function Step5({ data, set, toggle }: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  toggle: (item: string) => void;
}) {
  const menosGusto = ["El precio", "Los resultados", "El tiempo de envío", "El empaque",
    "La adhesividad del parche", "La comunicación de la marca", "La experiencia de compra", "El proceso de devolución"];
  const volveria = ["Sí, definitivamente", "Tal vez, dependiendo de los cambios", "Probablemente no", "No"];
  const evidencia = ["Sí, puedo enviarla si me indican a dónde", "No tengo evidencia", "No aplica para mi caso"];

  return (
    <div className="flex flex-col gap-8">
      {/* Rating */}
      <div>
        <FieldLabel>¿Cómo calificarías tu experiencia general con Novapatch?</FieldLabel>
        <div className="flex gap-3 mt-1">
          {[1, 2, 3, 4, 5].map((n) => (
            <button
              key={n}
              type="button"
              onClick={() => set("rating", String(n))}
              className="w-12 h-12 rounded-xl text-lg font-mono font-bold transition-all duration-150 border cursor-pointer"
              style={{
                borderColor: data.rating >= n ? "#0F0F0F" : "#E6E1D8",
                background: data.rating >= n ? "#0F0F0F" : "#FAF8F5",
                color: data.rating >= n ? "white" : "#A8A29A",
              }}
            >
              {n}
            </button>
          ))}
        </div>
        <div className="flex justify-between mt-1.5">
          <span className="text-[11px] font-sans text-[#A8A29A]">Muy mala</span>
          <span className="text-[11px] font-sans text-[#A8A29A]">Excelente</span>
        </div>
      </div>

      {/* Menos gustó */}
      <div>
        <FieldLabel>¿Qué fue lo que menos te gustó? <span className="text-xs font-normal text-[#A8A29A] ml-1">(puedes elegir más de uno)</span></FieldLabel>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {menosGusto.map((item) => (
            <Checkbox key={item} label={item} checked={data.menos_gusto.includes(item)} onChange={() => toggle(item)} />
          ))}
        </div>
      </div>

      {/* Qué mejorar */}
      <div>
        <FieldLabel>¿Qué podríamos haber hecho diferente para que tu experiencia fuera mejor? <Optional /></FieldLabel>
        <textarea
          value={data.mejora}
          onChange={(e) => set("mejora", e.target.value)}
          placeholder="Tu opinión nos ayuda a mejorar..."
          rows={3}
          className="w-full px-4 py-3 rounded-xl border border-[#E6E1D8] bg-[#FAF8F5] text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] outline-none focus:bg-white focus:border-[#0F0F0F] resize-none transition-all"
        />
      </div>

      {/* Volvería */}
      <div>
        <FieldLabel>¿Volverías a considerar Novapatch en el futuro si mejoramos lo que mencionaste?</FieldLabel>
        <div className="flex flex-col gap-3">
          {volveria.map((v) => (
            <Radio key={v} name="volveria" value={v} label={v} checked={data.volveria === v} onChange={() => set("volveria", v)} />
          ))}
        </div>
      </div>

      {/* Evidencia */}
      <div>
        <FieldLabel>¿Tienes evidencia del problema que tuviste?</FieldLabel>
        <div className="flex flex-col gap-3">
          {evidencia.map((e) => (
            <Radio key={e} name="evidencia" value={e} label={e} checked={data.evidencia === e} onChange={() => set("evidencia", e)} />
          ))}
        </div>
      </div>

      {/* Comentario final */}
      <div>
        <FieldLabel>¿Hay algo más que quieras contarnos? <Optional /></FieldLabel>
        <textarea
          value={data.comentario_final}
          onChange={(e) => set("comentario_final", e.target.value)}
          placeholder="Número de orden, detalles adicionales, o cualquier cosa que quieras compartir..."
          rows={4}
          className="w-full px-4 py-3 rounded-xl border border-[#E6E1D8] bg-[#FAF8F5] text-sm font-sans text-[#0F0F0F] placeholder-[#A8A29A] outline-none focus:bg-white focus:border-[#0F0F0F] resize-none transition-all"
        />
      </div>
    </div>
  );
}

// ─── Validation per step ──────────────────────────────────────────────────────

function canAdvance(step: number, data: FormData): boolean {
  if (step === 0) return !!data.producto && !!data.email && data.email.includes("@");
  if (step === 1) return !!data.parches_usados && !!data.uso_diario && !!data.tiempo_uso;
  if (step === 2) return !!data.motivo;
  if (step === 3) return !!data.reaccion && !!data.empaque;
  if (step === 4) return data.rating > 0 && !!data.volveria && !!data.evidencia;
  return false;
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function ReembolsoPage() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<FormData>(EMPTY);
  const [submitted, setSubmitted] = useState(false);

  const set = (k: keyof FormData, v: string) =>
    setData((prev) => ({ ...prev, [k]: k === "rating" ? Number(v) : v }));

  const toggle = (item: string) =>
    setData((prev) => ({
      ...prev,
      menos_gusto: prev.menos_gusto.includes(item)
        ? prev.menos_gusto.filter((x) => x !== item)
        : [...prev.menos_gusto, item],
    }));

  const next = () => { setDir(1); setStep((s) => s + 1); };
  const prev = () => { setDir(-1); setStep((s) => s - 1); };

  const submit = () => {
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <>
        <Navbar lightBg />
        <main className="min-h-screen bg-[#FAF8F5] flex items-center justify-center px-6 py-20">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] as const }}
            className="max-w-md w-full bg-white rounded-xl border border-[#E6E1D8] p-10 text-center shadow-2xs"
          >
            <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6 bg-[#FAF8F5] border border-[#E6E1D8] text-[#0F0F0F]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                <path d="M5 13l4 4L19 7" stroke="#0F0F0F" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h1 className="text-2xl font-display font-semibold text-[#0F0F0F] mb-3 tracking-[-0.035em] lowercase">
              solicitud recibida
            </h1>
            <p className="text-sm font-sans text-[#3A3A37] leading-relaxed mb-8">
              Gracias por tu tiempo. Nuestro equipo revisará tu caso y te contactará al correo indicado en un plazo de <strong className="text-[#0F0F0F]">2 a 5 días hábiles</strong>.
            </p>
            <Link
              href="/"
              className="inline-flex items-center justify-center px-8 py-3.5 rounded-full text-xs font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all cursor-pointer"
            >
              Volver al inicio
            </Link>
          </motion.div>
        </main>
        <Footer />
      </>
    );
  }

  const progress = ((step) / STEPS.length) * 100;

  return (
    <>
      <Navbar lightBg />
      <main className="min-h-screen bg-[#FAF8F5] pt-28 pb-24 px-6">
        <div className="max-w-[560px] mx-auto">

          {/* Header */}
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="text-center mb-10"
          >
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.14em] mb-4 bg-white border border-[#E6E1D8] text-[#3A3A37]">
              garantía 30 días
            </div>
            <h1 className="text-3xl sm:text-4xl font-display font-semibold text-[#0F0F0F] tracking-[-0.035em] lowercase mb-2">
              solicitud de reembolso.
            </h1>
            <p className="text-sm font-sans text-[#3A3A37]">
              Completa el formulario y te contactamos en 2–5 días hábiles.
            </p>
          </motion.div>

          {/* Progress */}
          <div className="mb-8">
            <div className="flex justify-between mb-2">
              {STEPS.map((s, i) => (
                <span
                  key={s.label}
                  className={`text-[10px] font-sans font-medium uppercase tracking-[0.12em] hidden sm:block ${
                    i === step ? "text-[#0F0F0F] font-semibold" : i < step ? "text-[#0F0F0F]" : "text-[#A8A29A]"
                  }`}
                >
                  {s.label}
                </span>
              ))}
            </div>
            <div className="h-1.5 rounded-full bg-[#E6E1D8] overflow-hidden">
              <motion.div
                className="h-full rounded-full bg-[#0F0F0F]"
                animate={{ width: `${progress + 20}%` }}
                transition={{ duration: 0.4, ease: "easeOut" }}
              />
            </div>
            <p className="text-xs font-mono text-[#A8A29A] mt-2">Paso {step + 1} de {STEPS.length}</p>
          </div>

          {/* Card */}
          <div className="bg-white rounded-xl border border-[#E6E1D8] shadow-2xs overflow-hidden">
            {/* Step header */}
            <div className="px-8 pt-8 pb-6 border-b border-[#E6E1D8]">
              <p className="text-[11px] font-sans font-medium uppercase tracking-[0.14em] mb-1 text-[#A8A29A]">
                {STEPS[step].label}
              </p>
              <h2 className="text-lg font-display font-semibold text-[#0F0F0F] lowercase">
                {["tu pedido", "tu experiencia de uso", "motivo de devolución", "estado del producto", "tu opinión"][step]}
              </h2>
            </div>

            {/* Step content */}
            <div className="px-8 py-8 overflow-hidden">
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  initial={{ opacity: 0, x: dir * 32 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: dir * -32 }}
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] as const }}
                >
                  {step === 0 && <Step1 data={data} set={set} />}
                  {step === 1 && <Step2 data={data} set={set} />}
                  {step === 2 && <Step3 data={data} set={set} />}
                  {step === 3 && <Step4 data={data} set={set} />}
                  {step === 4 && <Step5 data={data} set={set} toggle={toggle} />}
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Nav */}
            <div className="px-8 pb-8 flex items-center justify-between gap-4">
              {step > 0 ? (
                <button
                  onClick={prev}
                  className="flex items-center gap-2 text-xs font-sans font-medium text-[#3A3A37] hover:text-[#0F0F0F] transition-colors duration-150 cursor-pointer"
                >
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M15 18l-6-6 6-6" />
                  </svg>
                  Atrás
                </button>
              ) : (
                <span />
              )}

              {step < STEPS.length - 1 ? (
                <button
                  onClick={next}
                  disabled={!canAdvance(step, data)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Siguiente
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M9 18l6-6-6-6" />
                  </svg>
                </button>
              ) : (
                <button
                  onClick={submit}
                  disabled={!canAdvance(step, data)}
                  className="flex items-center gap-2 px-6 py-3 rounded-full text-[11px] font-sans font-medium uppercase tracking-[0.12em] bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] transition-all duration-200 disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer"
                >
                  Enviar solicitud
                  <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
                    <path d="M5 12h14M12 5l7 7-7 7" />
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Legal note */}
          <p className="text-center text-xs font-sans text-[#A8A29A] mt-6 leading-relaxed">
            Una vez enviado este formulario, nuestro equipo revisará tu caso y te contactará al email indicado.<br />
            ¿Dudas? Escríbenos a{" "}
            <a href="mailto:hola@novapatch.care" className="text-[#0F0F0F] underline font-medium">hola@novapatch.care</a>
          </p>
        </div>
      </main>
      <Footer />
    </>
  );
}
