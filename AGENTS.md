# AGENTS.md

This file provides guidance to Codex (Codex.ai/code) when working with code in this repository.

## Commands

All commands run from `apps/storefront/`:

```bash
pnpm install        # Install dependencies
pnpm run dev        # Start dev server at http://localhost:3000
pnpm run build      # Production build
pnpm run start      # Run production server
pnpm run lint       # Run ESLint
```

No test framework is configured yet. E2E tests with Playwright are planned per the PRD.

## Architecture Overview

Novapatch's subscription-based e-commerce platform targeting Mexico and Brazil. Currently a single Next.js storefront at `apps/storefront/`. The PRD plans a full monorepo with a Medusa backend and shared packages, but those don't exist yet — no workspace config is in place.

### Storefront (`apps/storefront/`)

**Framework:** Next.js 15.2 with App Router, React 19, TypeScript strict mode.

**Path alias:** `@/*` resolves to `apps/storefront/` (i.e., `@/components/Navbar` → `apps/storefront/components/Navbar.tsx`).

**Key libraries:**
- **Clerk** (`@clerk/nextjs`) — authentication. `ClerkProvider` wraps the entire app in `app/layout.tsx`. Replaces Medusa's default auth.
- **Framer Motion** — animations throughout (carousels, scroll reveals, staggered items, accordions).
- **shadcn/ui** — component library using New York style, neutral base color. Components live in `components/ui/`.
- **Tailwind CSS v4** — uses `@import "tailwindcss"` syntax (not `@tailwind` directives). Custom brand tokens defined in `app/globals.css` via `@theme`.
- **Openpay** — Mexican payment gateway. Scripts loaded via `<Script>` tags in `app/layout.tsx`. MercadoPago is planned for Brazil.

### Server vs. Client Components

- Pages default to Server Components (async data fetching). Mark with `"use client"` only when needed (interactivity, hooks, browser APIs).
- `app/tienda/page.tsx` is an async Server Component that will fetch products from `@/lib/commerce` (not yet implemented).
- Interactive pages (forms, carousels) use `"use client"`.

### Missing Implementations

These modules are imported but **do not yet exist** — implement them as the backend integration progresses:

- `@/lib/cart.ts` — exports `getCartItemCount()` and `CART_UPDATED_EVENT` constant. Cart state uses `localStorage` + custom DOM events.
- `@/lib/commerce.ts` — exports `getProducts()` and `getOrderedProducts()`, and the `Product` type.
- `@/lib/utils.ts` — should export the `cn()` utility (class merging, used by shadcn/ui).
- `app/checkout/cart/page.tsx` — shopping cart page (linked from Navbar).

### Brand Colors

Defined as CSS custom properties in `app/globals.css`:

| Token | Hex | Usage |
|-------|-----|-------|
| `--color-coral` | `#E8503A` | Primary CTA, accents |
| `--color-navy` | `#0D1B35` | Text, dark backgrounds |
| `--color-sky` | `#5BA8D5` | Secondary accents |
| `--color-cream` | `#FAF7F2` | Light backgrounds |
| `--color-lime` | `#C9D849` | Highlight accents |

### Subscription Model

Per the PRD, the platform supports three subscription tiers:
- **Monthly**: 20% discount
- **Bi-monthly**: 15% discount
- **Quarterly**: 10% discount

Subscription workflows will be orchestrated via **Temporal.io** (not yet integrated).

### Multi-Region

Two regions are planned:
- **Mexico**: MXN, Spanish (es-MX), Openpay (OXXO, SPEI, cards), IVA 16%
- **Brazil**: BRL, Portuguese (pt-BR), MercadoPago (PIX, Boleto, cards), ICMS

The `app/layout.tsx` sets `lang="es"` (Mexico-first). Brazilian localization requires a separate region implementation.

### External Services (planned integrations)

| Service | Purpose |
|---------|---------|
| Medusa V2 | Commerce backend (products, orders, subscriptions) |
| Clerk | Auth with Google/Facebook/Apple social login + MFA |
| Resend | Transactional email (order confirmations, subscription alerts) |
| PostHog | User analytics and A/B testing |
| Sentry | Error tracking and performance monitoring |
| Temporal.io | Subscription recurring billing workflows |
| Railway | Backend hosting / disaster recovery |
| Vercel | Frontend + API routes hosting |

## Important Backend Rules & Lessons

- **Medusa V2 Promotions**: When creating or seeding promotions in Medusa V2 via `createPromotionsWorkflow` or DTOs, ALWAYS explicitly include `status: PromotionStatus.ACTIVE` (imported from `@medusajs/framework/utils`). Omitting `status` breaks TypeScript compilation in production builds with error `TS2741`.

