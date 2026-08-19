"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";

// ─── Types ────────────────────────────────────────────────────────────────────

interface AddressData {
  street: string;
  interior: string;
  colonia: string;
  city: string;
  state: string;
  zip: string;
  instructions: string;
}

interface FormData {
  nombre: string;
  email: string;
  telefono: string;
  // País se fija desde la página (mx). No se pide al usuario.
  instagram_handle: string;
  tiktok_handle: string;
  rango_seguidores: string;
  nicho: string[];
  tipo_contenido: string[];
  tiene_contenido_bienestar: string;
  marcas_previas: string;
  parches: string[];
  media_kit: string;
  media_kit_url: string;
  mensaje_libre: string;
  direccion: AddressData;
}

// ─── Data ─────────────────────────────────────────────────────────────────────

const PATCHES = [
  {
    id: "energy",
    name: "Energy",
    tagline: "Energía celular sostenida",
    taglineColor: "#1A5C9A",
    ingredients: ["Vitamina C", "L-Carnitina", "Extracto de Té Verde", "Extracto de Ginseng", "Vitamina B2", "Ácido Fólico", "Vitamina E"],
    tags: ["Energía sostenida", "Sin picos ni caídas"],
    color: "#2B7CC1",
    bg: "#EBF4FB",
    imgSrc: "/products/Energy_thumb.webp",
  },
  {
    id: "sleep",
    name: "Sleep",
    tagline: "Sueño profundo y reparador",
    taglineColor: "#0F6B5C",
    ingredients: ["Triptófano", "Magnesio", "Inositol", "Vitamina B6", "Glicina"],
    tags: ["Descanso nocturno", "Sin somníferos"],
    color: "#138A75",
    bg: "#EBF7F5",
    imgSrc: "/products/Sleep_thumb.webp",
  },
  {
    id: "glow",
    name: "Glow",
    tagline: "Belleza y juventud para una piel visiblemente renovada",
    taglineColor: "#B83525",
    ingredients: ["Vitamina C", "Ácido Hialurónico", "Colágeno Hidrolizado", "Biotina", "Vitamina B3", "Extracto de Centella Asiática", "Vitamina E"],
    tags: ["Bienestar desde adentro", "Constancia"],
    color: "#C94030",
    bg: "#FAF0EE",
    imgSrc: "/products/Glow_thumb.webp",
  },
  {
    id: "shield",
    name: "Shield",
    tagline: "Fortaleza inmune natural",
    taglineColor: "#8C6000",
    ingredients: ["Vitamina C", "Zinc", "Vitamina D3", "Vitamina E", "Niacinamida"],
    tags: ["Cuidado preventivo", "Uso diario"],
    color: "#A07000",
    bg: "#FAF6E9",
    imgSrc: "/products/Shield_thumb.webp",
  },
  {
    id: "zen",
    name: "Zen",
    tagline: "Calma mental diaria",
    taglineColor: "#2A5490",
    ingredients: ["Triptófano", "Magnesio", "Taurina", "Extracto de Manzanilla", "Vitamina B6"],
    tags: ["Calma funcional", "Días intensos"],
    color: "#3A6FA8",
    bg: "#EBF0F9",
    imgSrc: "/products/Zen_thumb.webp",
  },
  {
    id: "woman",
    name: "Woman",
    tagline: "Bienestar hormonal femenino",
    taglineColor: "#6B3080",
    ingredients: ["Extracto de Soya", "Vitamina B6", "Magnesio", "Ácido Fólico", "Hierro"],
    tags: ["Bienestar femenino", "Ritmos naturales"],
    color: "#8A3EBE",
    bg: "#F3EBF9",
    imgSrc: "/products/Woman_thumb.webp",
  },
];

const NICHES = [
  "Wellness", "Fitness", "Lifestyle", "Belleza",
  "Maternidad", "Productividad", "Nutrición", "Viajes", "Otro",
];

const CONTENT_TYPES = [
  "Reels", "Reviews", "Rutinas", "Unboxing", "Educativo", "Vlogs", "Otro",
];

const FOLLOWER_RANGES = ["1k–5k", "5k–10k", "10k–50k", "50k–100k", "+100k"];

const STEPS = [
  { label: "Identidad", num: "01" },
  { label: "Comunidad", num: "02" },
  { label: "Fit", num: "03" },
];

// ─── Primitives ───────────────────────────────────────────────────────────────

const NAVY = "#0F0F0F";
const CORAL = "#0F0F0F";
const CREAM = "#FAF8F5";

const inputBase: React.CSSProperties = {
  width: "100%",
  borderRadius: 12,
  padding: "12px 16px",
  fontSize: 14,
  border: `1px solid #E6E1D8`,
  background: "#FAF8F5",
  color: NAVY,
  outline: "none",
  transition: "border-color 0.2s, background-color 0.2s",
  appearance: "none" as const,
};

function Input({
  value,
  onChange,
  placeholder,
  type = "text",
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputBase,
          borderColor: error ? CORAL : focused ? CORAL : "#E6E1D8",
          background: focused ? "white" : "#FAF8F5",
        }}
      />
      {error && (
        <p className="mt-1 text-xs font-sans text-[#0F0F0F]">
          {error}
        </p>
      )}
    </div>
  );
}

function Select({
  value,
  onChange,
  options,
  placeholder,
  error,
}: {
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
  placeholder?: string;
  error?: string;
}) {
  const [focused, setFocused] = useState(false);
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        style={{
          ...inputBase,
          borderColor: error
            ? CORAL
            : focused
            ? CORAL
            : "rgba(13,27,53,0.14)",
          boxShadow: focused && !error
            ? `0 0 0 3px rgba(232,80,58,0.1)`
            : "none",
          color: value ? NAVY : "rgba(13,27,53,0.35)",
          cursor: "pointer",
          paddingRight: 40,
        }}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
      {/* custom caret */}
      <svg
        className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none"
        width="14"
        height="14"
        viewBox="0 0 14 14"
        fill="none"
        aria-hidden
      >
        <path
          d="M2.5 5L7 9.5L11.5 5"
          stroke="rgba(13,27,53,0.4)"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {error && (
        <p className="mt-1 text-xs" style={{ color: CORAL }}>
          {error}
        </p>
      )}
    </div>
  );
}

function Field({
  label,
  required,
  children,
}: {
  label: string;
  required?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="text-xs font-semibold tracking-widest uppercase"
        style={{ color: "rgba(13,27,53,0.4)" }}
      >
        {label}
        {required && (
          <span style={{ color: CORAL, marginLeft: 3 }}>*</span>
        )}
      </label>
      {children}
    </div>
  );
}

function ChipSelect({
  options,
  selected,
  onChange,
  error,
}: {
  options: string[];
  selected: string[];
  onChange: (v: string[]) => void;
  error?: string;
}) {
  const toggle = (o: string) =>
    onChange(
      selected.includes(o)
        ? selected.filter((x) => x !== o)
        : [...selected, o]
    );
  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {options.map((o) => {
          const active = selected.includes(o);
          return (
            <button
              key={o}
              type="button"
              onClick={() => toggle(o)}
              className="px-4 py-2 rounded-full text-sm font-medium transition-all"
              style={{
                border: `1.5px solid ${active ? CORAL : "rgba(13,27,53,0.14)"}`,
                background: active ? "rgba(232,80,58,0.08)" : "transparent",
                color: active ? CORAL : "rgba(13,27,53,0.5)",
              }}
            >
              {o}
            </button>
          );
        })}
      </div>
      {error && (
        <p className="mt-1.5 text-xs" style={{ color: CORAL }}>
          {error}
        </p>
      )}
    </div>
  );
}

function RadioGroup({
  options,
  value,
  onChange,
  error,
}: {
  options: { label: string; value: string }[];
  value: string;
  onChange: (v: string) => void;
  error?: string;
}) {
  return (
    <div>
      <div className="flex flex-wrap gap-6">
        {options.map((o) => {
          const active = value === o.value;
          return (
            <label
              key={o.value}
              className="flex items-center gap-2.5 cursor-pointer"
            >
              <div
                className="w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 transition-all"
                style={{
                  borderColor: active ? CORAL : "rgba(13,27,53,0.25)",
                }}
              >
                {active && (
                  <div
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ background: CORAL }}
                  />
                )}
              </div>
              <input
                type="radio"
                value={o.value}
                checked={active}
                onChange={() => onChange(o.value)}
                className="sr-only"
              />
              <span
                className="text-sm"
                style={{ color: "rgba(13,27,53,0.7)" }}
              >
                {o.label}
              </span>
            </label>
          );
        })}
      </div>
      {error && (
        <p className="mt-1.5 text-xs" style={{ color: CORAL }}>
          {error}
        </p>
      )}
    </div>
  );
}

// ─── Step components ──────────────────────────────────────────────────────────

function Step1({
  data,
  set,
  errors,
}: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <div className="grid sm:grid-cols-2 gap-6">
        <Field label="Nombre completo" required>
          <Input
            value={data.nombre}
            onChange={(v) => set("nombre", v)}
            placeholder="Tu nombre completo"
            error={errors.nombre}
          />
        </Field>
        <Field label="Email profesional" required>
          <Input
            type="email"
            value={data.email}
            onChange={(v) => set("email", v)}
            placeholder="tu@email.com"
            error={errors.email}
          />
        </Field>
      </div>

      <div>
        <Field label="Teléfono móvil" required>
          <Input
            type="tel"
            value={data.telefono}
            onChange={(v) => set("telefono", v.replace(/\D/g, "").slice(0, 10))}
            placeholder="55 1234 5678"
            error={errors.telefono}
          />
        </Field>
        <p
          className="text-xs mt-2"
          style={{ color: "rgba(13,27,53,0.5)" }}
        >
          Necesitamos tu número para que el repartidor pueda contactarte cuando
          entregue tus muestras. No lo usamos para marketing.
        </p>
      </div>

      <div>
        <p
          className="text-xs mb-3"
          style={{ color: "rgba(13,27,53,0.5)" }}
        >
          Indica al menos uno de tus handles. Sin el @ — usamos el handle para
          armar el link de tu perfil automáticamente.
        </p>
        <div className="grid sm:grid-cols-2 gap-6">
          <Field label="Instagram">
            <Input
              value={data.instagram_handle}
              onChange={(v) => set("instagram_handle", v.replace(/^@/, ""))}
              placeholder="ej: novapatch_mx"
              error={errors.instagram_handle}
            />
          </Field>
          <Field label="TikTok">
            <Input
              value={data.tiktok_handle}
              onChange={(v) => set("tiktok_handle", v.replace(/^@/, ""))}
              placeholder="ej: novapatch_mx"
              error={errors.tiktok_handle}
            />
          </Field>
        </div>
        {errors.handles && (
          <p className="mt-2 text-xs" style={{ color: CORAL }}>
            {errors.handles}
          </p>
        )}
      </div>
    </div>
  );
}

function Step2({
  data,
  set,
  setArr,
  errors,
}: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  setArr: (k: keyof FormData, v: string[]) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="flex flex-col gap-6">
      <Field label="Rango de seguidores" required>
        <Select
          value={data.rango_seguidores}
          onChange={(v) => set("rango_seguidores", v)}
          placeholder="¿Cuántos seguidores tienes?"
          error={errors.rango_seguidores}
          options={FOLLOWER_RANGES.map((r) => ({ value: r, label: r }))}
        />
      </Field>

      <Field label="Nicho principal" required>
        <ChipSelect
          options={NICHES}
          selected={data.nicho}
          onChange={(v) => setArr("nicho", v)}
          error={errors.nicho}
        />
      </Field>

      <Field label="Tipo de contenido que hacés" required>
        <ChipSelect
          options={CONTENT_TYPES}
          selected={data.tipo_contenido}
          onChange={(v) => setArr("tipo_contenido", v)}
          error={errors.tipo_contenido}
        />
      </Field>

      <Field label="¿Ya creas contenido de bienestar o suplementos?" required>
        <RadioGroup
          value={data.tiene_contenido_bienestar}
          onChange={(v) => set("tiene_contenido_bienestar", v)}
          error={errors.tiene_contenido_bienestar}
          options={[
            { value: "si", label: "Sí" },
            { value: "no", label: "No" },
          ]}
        />
      </Field>

      {data.tiene_contenido_bienestar === "si" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Field label="¿Qué marcas o productos mencionaste?">
            <Input
              value={data.marcas_previas}
              onChange={(v) => set("marcas_previas", v)}
              placeholder="Ej: Vital Proteins, GNC, Herbalife..."
            />
          </Field>
        </motion.div>
      )}
    </div>
  );
}

function PatchCard({
  patch,
  selected,
  disabled,
  onSelect,
}: {
  patch: (typeof PATCHES)[number];
  selected: boolean;
  disabled: boolean;
  onSelect: () => void;
}) {
  return (
    <motion.button
      type="button"
      onClick={onSelect}
      whileHover={!disabled || selected ? { y: -4 } : {}}
      whileTap={!disabled || selected ? { scale: 0.97 } : {}}
      className="relative flex flex-col rounded-[20px] overflow-hidden border text-left w-full transition-all duration-300"
      style={{
        background: "white",
        borderColor: selected ? patch.color : "rgba(0,0,0,0.06)",
        boxShadow: selected
          ? `0 0 0 2px ${patch.color}, 0 12px 32px rgba(0,0,0,0.10)`
          : "0 4px 20px rgba(0,0,0,0.05)",
        cursor: disabled && !selected ? "not-allowed" : "pointer",
        opacity: disabled && !selected ? 0.45 : 1,
      }}
    >
      {/* Selected checkmark */}
      {selected && (
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="absolute top-2.5 right-2.5 w-6 h-6 rounded-full flex items-center justify-center z-10"
          style={{ background: patch.color }}
        >
          <svg width="11" height="11" viewBox="0 0 11 11" fill="none" aria-hidden>
            <path
              d="M2 5.5L4.5 8L9 3"
              stroke="white"
              strokeWidth="1.75"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </motion.div>
      )}

      {/* Image area */}
      <div
        className="relative flex items-center justify-center"
        style={{ background: patch.bg, padding: "28px 20px" }}
      >
        <div className="relative w-24 h-24">
          <Image
            src={patch.imgSrc}
            alt={`Novapatch ${patch.name}`}
            fill
            sizes="96px"
            loading="lazy"
            className="object-contain"
          />
        </div>
      </div>

      {/* Body */}
      <div className="p-4 flex flex-col gap-2 flex-1">
        <div>
          <p
            className="text-[17px] font-black tracking-[-0.01em]"
            style={{ color: patch.taglineColor }}
          >
            {patch.name}
          </p>
          <p
            className="text-[11px] font-semibold leading-[1.4] mt-0.5 opacity-75"
            style={{ color: patch.taglineColor }}
          >
            {patch.tagline}
          </p>
        </div>

        <p className="text-[11px] text-gray-500 leading-[1.5]">
          {patch.ingredients.join(" · ")}
        </p>

        <div className="flex flex-wrap gap-1 mt-auto pt-1">
          {patch.tags.map((tag) => (
            <span
              key={tag}
              className="text-[10px] font-bold px-2.5 py-0.5 rounded-full border-[1.5px]"
              style={{ borderColor: patch.color, color: patch.color }}
            >
              {tag}
            </span>
          ))}
        </div>
      </div>
    </motion.button>
  );
}

function Step3({
  data,
  set,
  setArr,
  setAddr,
  errors,
}: {
  data: FormData;
  set: (k: keyof FormData, v: string) => void;
  setArr: (k: keyof FormData, v: string[]) => void;
  setAddr: (k: keyof AddressData, v: string) => void;
  errors: Record<string, string>;
}) {
  return (
    <div className="flex flex-col gap-7">
      <Field label="¿Con qué parches Novapatch te identificas?" required>
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs" style={{ color: "rgba(13,27,53,0.4)" }}>
            Elige hasta 6
          </span>
          <span
            className="text-xs font-semibold tabular-nums"
            style={{ color: data.parches.length > 0 ? CORAL : "rgba(13,27,53,0.3)" }}
          >
            {data.parches.length}/6
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {PATCHES.map((p) => {
            const selected = data.parches.includes(p.id);
            const atLimit = data.parches.length >= 6;
            return (
              <PatchCard
                key={p.id}
                patch={p}
                selected={selected}
                disabled={atLimit && !selected}
                onSelect={() => {
                  if (selected) {
                    setArr("parches", data.parches.filter((x) => x !== p.id));
                  } else if (!atLimit) {
                    setArr("parches", [...data.parches, p.id]);
                  }
                }}
              />
            );
          })}
        </div>
        {errors.parches && (
          <p className="mt-2 text-xs" style={{ color: CORAL }}>
            {errors.parches}
          </p>
        )}
      </Field>

      <div>
        <h4
          className="text-sm font-bold mb-1"
          style={{ color: NAVY }}
        >
          ¿A dónde te enviamos tus parches?
        </h4>
        <p
          className="text-xs mb-4"
          style={{ color: "rgba(13,27,53,0.5)" }}
        >
          Si colaboramos, te mandamos los parches a esta dirección. Solo MX
          por ahora.
        </p>
        <div className="flex flex-col gap-5">
          <Field label="Calle y número exterior" required>
            <Input
              value={data.direccion.street}
              onChange={(v) => setAddr("street", v)}
              placeholder="Ej: Insurgentes Sur 1234"
              error={errors["direccion.street"]}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Número interior">
              <Input
                value={data.direccion.interior}
                onChange={(v) => setAddr("interior", v.slice(0, 20))}
                placeholder="Depto, oficina (opcional)"
              />
            </Field>
            <Field label="Código postal" required>
              <Input
                value={data.direccion.zip}
                onChange={(v) => setAddr("zip", v.replace(/\D/g, "").slice(0, 5))}
                placeholder="5 dígitos"
                error={errors["direccion.zip"]}
              />
            </Field>
          </div>

          <Field label="Colonia" required>
            <Input
              value={data.direccion.colonia}
              onChange={(v) => setAddr("colonia", v)}
              placeholder="Nombre de la colonia"
              error={errors["direccion.colonia"]}
            />
          </Field>

          <div className="grid sm:grid-cols-2 gap-5">
            <Field label="Ciudad / Alcaldía" required>
              <Input
                value={data.direccion.city}
                onChange={(v) => setAddr("city", v)}
                placeholder="Ej: Benito Juárez"
                error={errors["direccion.city"]}
              />
            </Field>
            <Field label="Estado" required>
              <Input
                value={data.direccion.state}
                onChange={(v) => setAddr("state", v)}
                placeholder="Ej: CDMX"
                error={errors["direccion.state"]}
              />
            </Field>
          </div>

          <Field label="Instrucciones de entrega">
            <Input
              value={data.direccion.instructions}
              onChange={(v) => setAddr("instructions", v.slice(0, 200))}
              placeholder="Referencias, horario preferido (opcional)"
            />
          </Field>
        </div>
      </div>

      <Field label="¿Tienes media kit?">
        <RadioGroup
          value={data.media_kit}
          onChange={(v) => set("media_kit", v)}
          options={[
            { value: "si", label: "Sí, tengo link" },
            { value: "no", label: "No por ahora" },
            { value: "email", label: "Lo envío por email" },
          ]}
        />
      </Field>

      {data.media_kit === "si" && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
        >
          <Field label="Link a tu media kit">
            <Input
              type="url"
              value={data.media_kit_url}
              onChange={(v) => set("media_kit_url", v)}
              placeholder="https://drive.google.com/..."
            />
          </Field>
        </motion.div>
      )}

      <Field label="¿Algo más que quieras contarnos?">
        <div>
          <textarea
            value={data.mensaje_libre}
            onChange={(e) => set("mensaje_libre", e.target.value)}
            maxLength={300}
            rows={4}
            placeholder="Cuéntanos algo sobre ti o tu comunidad..."
            style={{
              ...inputBase,
              resize: "vertical",
              fontFamily: "inherit",
              lineHeight: 1.6,
            }}
          />
          <p
            className="mt-1 text-xs text-right"
            style={{ color: "rgba(13,27,53,0.3)" }}
          >
            {data.mensaje_libre.length}/300
          </p>
        </div>
      </Field>
    </div>
  );
}

// ─── Progress indicator ───────────────────────────────────────────────────────

function StepProgress({ current }: { current: number }) {
  return (
    <div className="flex items-center gap-0 mb-10">
      {STEPS.map((s, i) => {
        const done = i < current;
        const active = i === current;
        return (
          <div key={s.label} className="flex items-center flex-1 last:flex-none">
            <div className="flex flex-col items-center gap-1.5">
              <div
                className="w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all duration-300"
                style={{
                  background: done
                    ? CORAL
                    : active
                    ? NAVY
                    : "rgba(13,27,53,0.08)",
                  color: done || active ? "white" : "rgba(13,27,53,0.3)",
                  boxShadow: active ? `0 0 0 4px rgba(232,80,58,0.15)` : "none",
                }}
              >
                {done ? (
                  <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                    <path
                      d="M2.5 7L5.5 10L11.5 4"
                      stroke="white"
                      strokeWidth="1.75"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                ) : (
                  s.num
                )}
              </div>
              <span
                className="text-xs font-medium whitespace-nowrap"
                style={{
                  color: active ? NAVY : done ? CORAL : "rgba(13,27,53,0.3)",
                }}
              >
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div
                className="h-px flex-1 mx-3 mt-[-10px] transition-all duration-300"
                style={{
                  background: i < current
                    ? CORAL
                    : "rgba(13,27,53,0.1)",
                }}
              />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Success screen ───────────────────────────────────────────────────────────

function SuccessScreen({ nombre }: { nombre: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
      className="text-center py-10 flex flex-col items-center gap-6"
    >
      <div
        className="w-20 h-20 rounded-full flex items-center justify-center"
        style={{ background: "rgba(232,80,58,0.1)" }}
      >
        <svg width="36" height="36" viewBox="0 0 36 36" fill="none" aria-hidden>
          <path
            d="M7 18L14 25L29 10"
            stroke={CORAL}
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>
      <div>
        <h3
          className="text-2xl font-bold mb-2"
          style={{ color: NAVY }}
        >
          ¡Gracias, {nombre}!
        </h3>
        <p
          className="text-base leading-relaxed"
          style={{ color: "rgba(13,27,53,0.55)", maxWidth: 380, margin: "0 auto" }}
        >
          Listo, ya tenemos tu info. Te escribimos pronto para ver cómo seguimos.
        </p>
      </div>
      <div
        className="px-6 py-4 rounded-2xl text-sm"
        style={{
          background: "rgba(13,27,53,0.04)",
          color: "rgba(13,27,53,0.5)",
          maxWidth: 360,
        }}
      >
        Mientras tanto, seguinos en{" "}
        <a
          href="https://instagram.com/novapatch.mx"
          target="_blank"
          rel="noopener noreferrer"
          style={{ color: CORAL, fontWeight: 600 }}
        >
          @novapatch.mx
        </a>{" "}
        para estar al tanto de novedades.
      </div>
    </motion.div>
  );
}

// ─── Main component ───────────────────────────────────────────────────────────

const EMPTY_ADDRESS: AddressData = {
  street: "", interior: "", colonia: "", city: "", state: "", zip: "",
  instructions: "",
};

const EMPTY: FormData = {
  nombre: "", email: "", telefono: "",
  instagram_handle: "", tiktok_handle: "",
  rango_seguidores: "", nicho: [], tipo_contenido: [],
  tiene_contenido_bienestar: "", marcas_previas: "",
  parches: [], media_kit: "", media_kit_url: "",
  mensaje_libre: "",
  direccion: EMPTY_ADDRESS,
};

const slideVariants = {
  enter: (dir: number) => ({
    x: dir > 0 ? 40 : -40,
    opacity: 0,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? -40 : 40,
    opacity: 0,
  }),
};

export default function InfluencerForm() {
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);
  const [data, setData] = useState<FormData>(EMPTY);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const set = (k: keyof FormData, v: string) =>
    setData((d) => ({ ...d, [k]: v }));

  const setArr = (k: keyof FormData, v: string[]) =>
    setData((d) => ({ ...d, [k]: v }));

  const setAddr = (k: keyof AddressData, v: string) =>
    setData((d) => ({ ...d, direccion: { ...d.direccion, [k]: v } }));

  const validate = (s: number): Record<string, string> => {
    const e: Record<string, string> = {};
    if (s === 0) {
      if (!data.nombre.trim()) e.nombre = "Requerido";
      if (!data.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
        e.email = "Ingresa un email válido";
      if (!/^\d{10}$/.test(data.telefono))
        e.telefono = "Ingresa 10 dígitos (sin lada del país)";
      // Al menos un handle (Instagram o TikTok). Ninguno es obligatorio
      // por separado, pero al menos uno tiene que estar.
      if (!data.instagram_handle.trim() && !data.tiktok_handle.trim()) {
        e.handles = "Indica al menos un handle: Instagram o TikTok";
      }
    }
    if (s === 1) {
      if (!data.rango_seguidores) e.rango_seguidores = "Requerido";
      if (!data.nicho.length) e.nicho = "Elige al menos un nicho";
      if (!data.tipo_contenido.length)
        e.tipo_contenido = "Elige al menos un tipo";
      if (!data.tiene_contenido_bienestar)
        e.tiene_contenido_bienestar = "Requerido";
    }
    if (s === 2) {
      if (!data.parches.length)
        e.parches = "Elige al menos un parche";
      const a = data.direccion;
      if (!a.street.trim()) e["direccion.street"] = "Requerido";
      if (!a.colonia.trim()) e["direccion.colonia"] = "Requerido";
      if (!a.city.trim()) e["direccion.city"] = "Requerido";
      if (!a.state.trim()) e["direccion.state"] = "Requerido";
      if (!/^\d{5}$/.test(a.zip)) e["direccion.zip"] = "5 dígitos";
    }
    return e;
  };

  const next = () => {
    const e = validate(step);
    setErrors(e);
    if (Object.keys(e).length) return;
    setDir(1);
    setStep((s) => s + 1);
  };

  const back = () => {
    setDir(-1);
    setStep((s) => s - 1);
    setErrors({});
  };

  const submit = async () => {
    const e = validate(2);
    setErrors(e);
    if (Object.keys(e).length) return;
    setSubmitting(true);
    setSubmitError("");
    try {
      // Esta página solo se usa para MX. El backend igual valida el campo
      // pais, así que lo enviamos hardcoded.
      const payload = { ...data, pais: "mx" };
      const res = await fetch("/api/influencers", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) {
        // Try to surface the backend's validation message when present so the
        // user can fix the issue (instead of a generic "try again").
        let message = "No se pudo enviar el formulario. Por favor inténtalo de nuevo.";
        try {
          const data = (await res.json()) as { error?: string };
          if (data.error) message = data.error;
        } catch {
          /* response wasn't JSON — keep generic message */
        }
        setSubmitError(message);
        return;
      }
      setSubmitted(true);
    } catch {
      setSubmitError("No se pudo enviar el formulario. Por favor inténtalo de nuevo.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section
      id="aplicar"
      style={{ background: CREAM }}
      className="py-24 px-6"
    >
      <div className="max-w-2xl mx-auto">
        {/* Section header */}
        {!submitted && (
          <div className="text-center mb-14">
            <p
              className="text-xs font-semibold tracking-widest uppercase mb-3"
              style={{ color: CORAL }}
            >
              Colaboremos
            </p>
            <h2
              className="text-4xl font-bold mb-3"
              style={{ color: NAVY, letterSpacing: "-0.02em" }}
            >
              Cuéntanos sobre ti
            </h2>
            <p
              className="text-base"
              style={{ color: "rgba(13,27,53,0.45)", maxWidth: 380, margin: "0 auto" }}
            >
              3 pasos · menos de 4 minutos · sin crear una cuenta
            </p>
          </div>
        )}

        {/* Form card */}
        <div
          className="rounded-3xl p-8 sm:p-10"
          style={{
            background: "white",
            boxShadow:
              "0 4px 6px rgba(13,27,53,0.04), 0 20px 60px rgba(13,27,53,0.08)",
          }}
        >
          {submitted ? (
            <SuccessScreen nombre={data.nombre.split(" ")[0]} />
          ) : (
            <>
              <StepProgress current={step} />

              {/* Step title */}
              <div className="mb-8">
                <h3
                  className="text-xl font-bold"
                  style={{ color: NAVY }}
                >
                  {step === 0 && "Cuéntanos quién eres"}
                  {step === 1 && "Tu comunidad y contenido"}
                  {step === 2 && "Tu fit con Novapatch"}
                </h3>
                <p
                  className="text-sm mt-1"
                  style={{ color: "rgba(13,27,53,0.4)" }}
                >
                  {step === 0 && "Datos básicos para conocerte"}
                  {step === 1 && "Cuéntanos sobre tu audiencia y lo que creas"}
                  {step === 2 && "Último paso y listo"}
                </p>
              </div>

              {/* Animated step content */}
              <AnimatePresence mode="wait" custom={dir}>
                <motion.div
                  key={step}
                  custom={dir}
                  variants={slideVariants}
                  initial="enter"
                  animate="center"
                  exit="exit"
                  transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                >
                  {step === 0 && (
                    <Step1 data={data} set={set} errors={errors} />
                  )}
                  {step === 1 && (
                    <Step2
                      data={data}
                      set={set}
                      setArr={setArr}
                      errors={errors}
                    />
                  )}
                  {step === 2 && (
                    <Step3
                      data={data}
                      set={set}
                      setArr={setArr}
                      setAddr={setAddr}
                      errors={errors}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Submit error */}
              {submitError && (
                <p
                  className="mt-4 text-sm text-center"
                  style={{ color: CORAL }}
                >
                  {submitError}
                </p>
              )}

              {/* Navigation */}
              <div
                className="flex items-center justify-between mt-10 pt-8"
                style={{ borderTop: "1px solid rgba(13,27,53,0.07)" }}
              >
                {step > 0 ? (
                  <button
                    type="button"
                    onClick={back}
                    className="flex items-center gap-2 text-sm font-medium transition-all hover:gap-3"
                    style={{ color: "rgba(13,27,53,0.45)" }}
                  >
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" aria-hidden>
                      <path
                        d="M10 3L5 8L10 13"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Atrás
                  </button>
                ) : (
                  <span />
                )}

                {step < 2 ? (
                  <button
                    type="button"
                    onClick={next}
                    className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:shadow-lg"
                    style={{ background: NAVY }}
                  >
                    Continuar
                    <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                      <path
                        d="M2.5 7H11.5M11.5 7L7 2.5M11.5 7L7 11.5"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </button>
                ) : (
                  <button
                    type="button"
                    onClick={submit}
                    disabled={submitting}
                    className="flex items-center gap-2.5 px-7 py-3.5 rounded-full font-semibold text-sm text-white transition-all hover:shadow-xl disabled:opacity-60"
                    style={{ background: CORAL }}
                  >
                    {submitting ? "Enviando..." : "Quiero colaborar"}
                    {!submitting && (
                      <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden>
                        <path
                          d="M2.5 7H11.5M11.5 7L7 2.5M11.5 7L7 11.5"
                          stroke="currentColor"
                          strokeWidth="1.5"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
                    )}
                  </button>
                )}
              </div>
            </>
          )}
        </div>

        <p
          className="text-center text-xs mt-6 leading-relaxed"
          style={{ color: "rgba(13,27,53,0.3)" }}
        >
          Al enviar este formulario confirmas que leíste y aceptas los{" "}
          <a href="/terminos-influencers" target="_blank" rel="noopener noreferrer" style={{ color: CORAL, fontWeight: 500 }}>
            Términos de Colaboración para Influencers
          </a>
          {" "}de Novapatch.
        </p>
      </div>
    </section>
  );
}
