/**
 * Template id registry. The actual rendering (exact HTML/CSS →
 * screenshot) happens outside this function, in the Vercel
 * render-testimonial endpoint (see api/_templates/*.html in the frontend
 * repo) — this module only validates/normalizes which id a merchant's
 * default_template_id refers to.
 */

export type TemplateId =
  | "01-neon-editorial"
  | "02-luxury-editorial"
  | "03-minimal-modern"
  | "04-warm-organic"
  | "05-bold-contemporary"
  | "06-magazine-editorial"
  | "07-soft-premium"
  | "08-brutalist-modern";

export const TEMPLATE_IDS: TemplateId[] = [
  "01-neon-editorial",
  "02-luxury-editorial",
  "03-minimal-modern",
  "04-warm-organic",
  "05-bold-contemporary",
  "06-magazine-editorial",
  "07-soft-premium",
  "08-brutalist-modern",
];

export const DEFAULT_TEMPLATE_ID: TemplateId = "01-neon-editorial";

export function isTemplateId(value: unknown): value is TemplateId {
  return typeof value === "string" && (TEMPLATE_IDS as string[]).includes(value);
}
