/**
 * Launch free-shipping flag. Controls the persuasive "GRATIS" display in the
 * checkout summary and cart drawer. The authoritative $0 charge comes from an
 * automatic promotion in Medusa (target: shipping_methods, 100% off) — this
 * flag governs UI only. Toggle both together.
 * See docs/superpowers/specs/2026-08-06-free-shipping-launch-design.md
 */
export const FREE_SHIPPING = process.env.NEXT_PUBLIC_FREE_SHIPPING === "true";
