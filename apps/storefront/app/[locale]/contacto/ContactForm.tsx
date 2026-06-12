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
      <div className="bg-white rounded-3xl p-10 shadow-[0_4px_20px_rgba(13,27,53,0.06)] border border-[#005088]/6 text-center flex flex-col gap-4 items-center">
        <div className="w-16 h-16 rounded-2xl bg-[#C9D849]/20 flex items-center justify-center">
          <Mail className="w-8 h-8 text-[#3CBFAB]" />
        </div>
        <h2 className="home-item-title text-ocean mb-1">¡Mensaje enviado!</h2>
        <p className="home-body">
          Te responderemos en menos de 24 horas a <strong>{form.email}</strong>
        </p>
        <button
          onClick={() => { setSent(false); setForm({ nombre: "", email: "", asunto: "", mensaje: "" }); }}
          className="home-body mt-2 font-semibold text-teal hover:underline"
        >
          Enviar otro mensaje
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-3xl p-8 shadow-[0_4px_20px_rgba(13,27,53,0.06)] border border-[#005088]/6">
      <h2 className="home-item-title text-ocean mb-6">Envíanos un mensaje</h2>
      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div className="grid md:grid-cols-2 gap-5">
          <div>
            <label className="home-body mb-2 block font-semibold">Nombre</label>
            <input
              required type="text" value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Tu nombre"
              className="w-full px-4 py-3 rounded-xl border border-[#005088]/10 text-sm text-[#005088] placeholder-[#0D1B35]/30 focus:outline-none focus:border-[#3CBFAB]/60 focus:ring-2 focus:ring-[#3CBFAB]/10 transition-all duration-200 bg-[#FAF7F2]"
            />
          </div>
          <div>
            <label className="home-body mb-2 block font-semibold">Email</label>
            <input
              required type="email" value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              placeholder="tu@correo.com"
              className="w-full px-4 py-3 rounded-xl border border-[#005088]/10 text-sm text-[#005088] placeholder-[#0D1B35]/30 focus:outline-none focus:border-[#3CBFAB]/60 focus:ring-2 focus:ring-[#3CBFAB]/10 transition-all duration-200 bg-[#FAF7F2]"
            />
          </div>
        </div>
        <div>
          <label className="home-body mb-2 block font-semibold">Asunto</label>
          <select
            required value={form.asunto}
            onChange={(e) => setForm({ ...form, asunto: e.target.value })}
            className="w-full px-4 py-3 rounded-xl border border-[#005088]/10 text-sm text-[#005088] focus:outline-none focus:border-[#3CBFAB]/60 focus:ring-2 focus:ring-[#3CBFAB]/10 transition-all duration-200 bg-[#FAF7F2] appearance-none"
          >
            <option value="" disabled>Selecciona un asunto</option>
            <option value="pedido">Pedido</option>
            <option value="suscripcion">Suscripción</option>
            <option value="producto">Producto</option>
            <option value="otro">Otro</option>
          </select>
        </div>
        <div>
          <label className="home-body mb-2 block font-semibold">Mensaje</label>
          <textarea
            required rows={5} value={form.mensaje}
            onChange={(e) => setForm({ ...form, mensaje: e.target.value })}
            placeholder="Cuéntanos en qué podemos ayudarte..."
            className="w-full px-4 py-3 rounded-xl border border-[#005088]/10 text-sm text-[#005088] placeholder-[#0D1B35]/30 focus:outline-none focus:border-[#3CBFAB]/60 focus:ring-2 focus:ring-[#3CBFAB]/10 transition-all duration-200 bg-[#FAF7F2] resize-none"
          />
        </div>
        {error && (
          <p className="home-body text-center font-medium text-[#E8503A]">{error}</p>
        )}
        <button
          type="submit" disabled={loading}
          className="w-full rounded-full bg-[#3CBFAB] py-4 font-bold text-white shadow-[0_4px_20px_rgba(60,191,171,0.3)] transition-all duration-200 hover:-translate-y-0.5 hover:bg-[#2da898] hover:shadow-[0_8px_32px_rgba(60,191,171,0.4)] active:scale-[0.97] disabled:cursor-not-allowed disabled:opacity-60 disabled:hover:translate-y-0 disabled:active:scale-100"
        >
          {loading ? "Enviando..." : "Enviar mensaje"}
        </button>
      </form>
    </div>
  );
}
