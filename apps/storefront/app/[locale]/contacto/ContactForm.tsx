"use client";

import { useState } from "react";
import { Mail } from "lucide-react";

export default function ContactForm() {
  const [form, setForm] = useState({ nombre: "", email: "", asunto: "", mensaje: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error ?? "Error al enviar el mensaje.");
      }

      setSent(true);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error al enviar el mensaje.");
    } finally {
      setLoading(false);
    }
  };

  if (sent) {
    return (
      <div className="bg-white rounded-xl p-8 border border-[#E6E1D8] shadow-2xs text-center flex flex-col gap-4 items-center">
        <div className="w-14 h-14 rounded-full bg-[#FAF8F5] border border-[#E6E1D8] flex items-center justify-center text-[#0F0F0F]">
          <Mail className="w-6 h-6" />
        </div>
        <h2 className="text-xl font-display font-semibold text-[#0F0F0F] lowercase">¡mensaje enviado!</h2>
        <p className="font-sans text-sm text-[#3A3A37]">
          Te responderemos en menos de 24 horas a <strong>{form.email}</strong>
        </p>
        <button
          onClick={() => { setSent(false); setForm({ nombre: "", email: "", asunto: "", mensaje: "" }); }}
          className="mt-2 text-xs font-sans font-medium text-[#0F0F0F] underline cursor-pointer"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl p-8 border border-[#E6E1D8] shadow-2xs">
      <h2 className="text-xl font-display font-semibold text-[#0F0F0F] lowercase mb-6">envíanos un mensaje</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="font-sans text-xs font-semibold text-[#0F0F0F] mb-2 block">Nombre</label>
            <input
              required type="text" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 rounded-xl border border-[#E6E1D8] text-xs font-sans text-[#0F0F0F] placeholder-[#A8A29A] focus:outline-none focus:border-[#0F0F0F] transition-all bg-[#FAF8F5]"
            />
          </div>
          <div>
            <label className="font-sans text-xs font-semibold text-[#0F0F0F] mb-2 block">Email</label>
            <input
              required type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 rounded-xl border border-[#E6E1D8] text-xs font-sans text-[#0F0F0F] placeholder-[#A8A29A] focus:outline-none focus:border-[#0F0F0F] transition-all bg-[#FAF8F5]"
            />
          </div>
        </div>
        <div>
          <label className="font-sans text-xs font-semibold text-[#0F0F0F] mb-2 block">Asunto</label>
          <select
            required value={form.asunto}
            onChange={(e) => setForm({ ...form, asunto: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#E6E1D8] text-xs font-sans text-[#0F0F0F] focus:outline-none focus:border-[#0F0F0F] transition-all bg-[#FAF8F5] appearance-none"
          >
            <option value="" disabled>Selecciona un asunto</option>
            <option value="pedido">Pedido</option>
            <option value="suscripcion">Suscripción</option>
            <option value="producto">Producto</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="font-sans text-xs font-semibold text-[#0F0F0F] mb-2 block">Mensaje</label>
          <textarea
            required rows={5} value={form.mensaje}
            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
            placeholder="Cuéntanos en qué podemos ayudarte..."
            className="w-full px-4 py-3 rounded-xl border border-[#E6E1D8] text-xs font-sans text-[#0F0F0F] placeholder-[#A8A29A] focus:outline-none focus:border-[#0F0F0F] transition-all bg-[#FAF8F5] resize-none"
          />
        </div>
        {error && (
          <p className="font-sans text-center text-xs font-medium text-red-600">{error}</p>
        )}
        <button
          type="submit" disabled={loading}
          className="w-full rounded-full bg-[#0F0F0F] text-white border border-[#0F0F0F] hover:bg-white hover:text-[#0F0F0F] text-[11px] font-sans font-medium uppercase tracking-[0.12em] py-3.5 transition-all disabled:opacity-40 cursor-pointer"
        >
          {loading ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    </div>
  );
}
