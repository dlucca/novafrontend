# PDP (Product Detail Page) — Diseño

**Fecha:** 2026-06-09
**Repos afectados:** `novafrontend` (storefront) y `novabackend` (Medusa V2)

## Objetivo

Implementar una página de detalle de producto (`/tienda/[handle]`) siguiendo el mockup de Sleep:
imágenes servidas desde Medusa (almacenadas en Cloudflare R2), copy hardcodeado en el frontend,
add-to-cart y selección de suscripción (compra única / mensual 20% / bimestral 15% / trimestral 10%)
desde cada PDP.

## Contexto

- El carrito, descuentos de suscripción y el selector mode/freq ya existen
  (`lib/cart.ts`, `contexts/CartContext.tsx`, `components/store/TiendaExperience.tsx`).
- Medusa ya tiene los 6 productos (Energy, Sleep, Glow, Shield, Zen, Woman) con 4 variantes
  cada uno (Once/Monthly/Bimonthly/Quarterly) y metadata `is_subscription` / `interval_days` /
  `discount_percentage` (`seed-novapatch.ts`).
- El backend en Railway NO tiene file storage configurado (provider local por defecto, disco
  efímero) y el seed no carga imágenes. Las imágenes existen localmente, aún no subidas.
- `next.config.js` solo permite `img.clerk.com` en `remotePatterns`.

## Decisiones tomadas

1. **Storage de imágenes: Cloudflare R2** (cuenta free del usuario) con el módulo oficial
   `@medusajs/file-s3` (R2 es S3-compatible). Se descartó Cloudinary (no hay provider v2,
   requería módulo custom) y hostear en el repo frontend (no escala a uploads por Admin).
2. **Dominio público: `r2.dev`** (el dominio `novapatch.care` está en Namecheap, no en
   Cloudflare, y los custom domains de R2 requieren la zona en Cloudflare). El rate-limiting
   de `r2.dev` se mitiga porque `next/image` sirve las imágenes optimizadas desde el cache de
   Vercel. Migrar a `cdn.novapatch.care` más adelante = cambiar env var + re-seedear URLs.
3. **Copy hardcodeado en frontend**, extendiendo `lib/product-meta.ts` — no metadata en Medusa.
4. **Carga de imágenes por script** (`npx medusa exec`), no a mano por Admin: reproducible
   y versionado.

## Backend (novabackend)

### File Module con R2

- Configurar `@medusajs/file-s3` en `medusa-config.ts`:
  - `endpoint`: `https://<account_id>.r2.cloudflarestorage.com`
  - `file_url`: URL pública `https://pub-<hash>.r2.dev`
  - `region`: `auto`
- Env vars (local + Railway): `S3_FILE_URL`, `S3_ACCESS_KEY_ID`, `S3_SECRET_ACCESS_KEY`,
  `S3_BUCKET`, `S3_ENDPOINT`, `S3_REGION=auto`.
- Pasos manuales del usuario: crear bucket R2, habilitar acceso público (`r2.dev`),
  generar API token R2 (puede requerir agregar método de pago para activar R2 — sin costo
  dentro del free tier: 10 GB, 1M escrituras/mes, egress gratis).

### Script de carga de imágenes

- `src/scripts/upload-product-images.ts` (ejecutable con `npx medusa exec`):
  sube los archivos locales al File Module (→ R2) y asocia `images[]` + `thumbnail`
  a cada producto por handle.

## Frontend (novafrontend)

### Ruta nueva

- `app/[locale]/tienda/[handle]/page.tsx` — Server Component:
  - Busca el producto en Medusa por handle (`images[]` + 4 variantes con precios).
  - Fallback a `PRODUCT_META` + imágenes locales si Medusa no responde.
  - `generateStaticParams` para los 6 handles + ISR `revalidate: 300`.
  - 404 (`notFound()`) para handles desconocidos.

### Componente de detalle

- `components/product/ProductDetail.tsx` (`"use client"`), estructura del mockup:
  - **Galería**: imagen principal + tira de thumbnails clickeables (de `product.images[]`).
  - **Header**: nombre, tagline, descripción, tags (chips).
  - **Selector "¿Cómo querés recibirlo?"**: 4 cards (Única $750 / Mensual $600 20% OFF /
    Bimestral $638 15% OFF / Trimestral $675 10% OFF). Precios desde la variante Medusa
    correspondiente (match por metadata `interval_days`), fallback a `FREQ_DISCOUNTS`.
  - **CTA**: "Suscribirme (N días)" o "Agregar al carrito" según selección →
    `useCart().addToCart()` con el `variantId` de la variante elegida (abre CartDrawer,
    tracking PostHog/Meta ya incluido en el context).
  - Secciones de copy (Framer Motion scroll reveals, patrones existentes):
    beneficios (3 bullets), "¿Cómo te acompaña?" (4 items), "Cómo funciona",
    "Ingredientes clave" (con descripción por ingrediente), "Modo de uso" (3 pasos),
    FAQ (4 preguntas, accordion), CTA final "Agregar al carrito".

### Datos / copy

- Extender `ProductMeta` en `lib/product-meta.ts` con: `tagline`, `benefits[3]`,
  `accompaniment[4]`, `howItWorks`, `ingredientDetails[{name, description}]`,
  `usageSteps[3]`, `faq[{q, a}][4]` — para los 6 productos, redactado siguiendo el tono
  del mockup Sleep y la guía de marca Novapatch.

### Integraciones menores

- Cards de `/tienda` (TiendaExperience) y del home (ProductGrid) linkean a `/tienda/[handle]`.
- `next.config.js`: agregar `*.r2.dev` a `images.remotePatterns`.

## Manejo de errores

- Medusa caído / sin imágenes → fallback a copy local + `/products/{slug}_thumb.webp`
  (mismo patrón que `lib/commerce.ts` hoy).
- Variante sin match por metadata → CTA usa el flujo actual sin `variantId` (localStorage puro).

## Testing / verificación

- No hay framework de tests configurado; verificación manual con dev server (preview):
  navegación tienda → PDP, selección de cada tier, add-to-cart con precio correcto,
  imágenes cargando desde `r2.dev`, fallback con Medusa apagado.

## Fuera de alcance

- Migración del DNS a Cloudflare / `cdn.novapatch.care` (tarea futura separada).
- Localización pt-BR de los copy nuevos.
- Reviews, productos relacionados, breadcrumbs SEO avanzados.
