# DESIGN.md — Taqyeem Visual & Design Source of Truth

This file is the source of truth for how Taqyeem looks and feels. It covers the application UI and, separately and explicitly, the generated testimonial creative. Read alongside [CLAUDE.md](CLAUDE.md), which covers product/engineering rules.

---

## 1. Brand Feel

Taqyeem should feel: premium, minimal, calm, modern, trustworthy, Arabic-first, editorial, restrained.

Avoid: neon, glassmorphism, excessive gradients, excessive shadows, excessive rounded cards, generic AI-startup aesthetics, random colors, visual clutter, five-star-logo clichés.

### Logo / brand direction (proposal, not final)
- Wordmark: `taqyeem`
- Arabic companion: `تقييم`
- Possible symbol: a minimal abstract rating/check/proof mark — not a literal star or five-star icon.
- Do not over-design the logo. Keep it restrained, consistent with the rest of the brand.

---

## 2. Application UI Palette

This palette applies to the Taqyeem **application UI only** (marketing site, dashboard, auth, settings, wall-of-love chrome). It does not apply to the generated testimonial creative — see §7.

| Token | Hex | Use |
|---|---|---|
| Ink | `#171717` | Primary text, headings |
| Background | `#FAFAF8` | Page background |
| Surface | `#FFFFFF` | Cards, panels |
| Muted Surface | `#F5F4F1` | Secondary surfaces, subtle blocks |
| Border | `#E7E4DE` | Dividers, card borders, input borders |
| Muted Text | `#737373` | Secondary/help text |
| Primary Emerald | `#087F5B` | Primary actions, links, active states |
| Deep Emerald | `#065A42` | Hover/pressed states, emphasis |
| Danger | `#C92A2A` | Errors, destructive actions |
| Warning | `#B7791F` | Warnings, pending states |

Rules:
- Warm neutral + ink + emerald only. No additional accent colors without explicit approval.
- Emerald is the only "brand" color used for interactive emphasis; don't introduce a second accent hue.
- Danger/Warning are reserved for their semantic purpose only (never decorative).

---

## 3. Typography & RTL

- Typeface: **IBM Plex Sans Arabic** (all UI text, Arabic and Latin).
- The application is **true RTL** by default (Arabic-first). `dir="rtl"` at the document/app root; LTR content (e.g. embedded Latin brand names, numbers where appropriate) is scoped locally, not the default.
- Use **logical CSS properties** (`margin-inline-start`, `padding-inline-end`, `inset-inline-*`, `text-align: start/end`, etc.) instead of physical left/right properties, so the layout mirrors correctly and doesn't require a separate LTR pass.
- Keep a calm type scale: a small number of weights/sizes, generous line-height for Arabic script, no more than one display size per screen.

---

## 4. Spacing, Components, Layout

- Restrained, editorial spacing — generous whitespace over dense grids.
- Corners: subtle/minimal rounding, not the heavy rounded-card look common to generic SaaS/AI products.
- Shadows: minimal to none; rely on borders (`#E7E4DE`) and surface contrast (`#FFFFFF` vs `#FAFAF8`/`#F5F4F1`) to separate content instead of drop shadows.
- Components: build from shadcn/ui primitives, restyled to the palette/typography above rather than introducing a separate component system.
- Icons/symbols: simple, minimal, consistent stroke weight; avoid decorative or novelty iconography.

---

## 5. Customer Review Page (`/r/{merchant-slug}`)

This is a critical, mobile-first screen. The customer must be able to finish in seconds.

Structure, top to bottom:
1. Merchant logo
2. Merchant name
3. Prompt: "إيه رأيك في تجربتك معانا؟"
4. Rating input
5. Review textarea (the customer's own words — this becomes `reviews.original_text` verbatim)
6. Optional customer name field
7. Submit
8. Success / error state

Rules:
- No account creation, ever.
- No unnecessary questions beyond rating + review + optional name.
- Not a dashboard-style UI — no nav chrome, no secondary actions competing with submission.
- Mobile-first layout; this is the screen most customers will use on a phone via QR scan.
- Merchant branding (logo, name, brand color as accent) is visible but never overwhelms the simplicity of the form.

---

## 6. Wall of Love (`/w/{merchant-slug}`)

Public, premium, and visitor-facing — it must not look like an admin dashboard.

Show:
- Merchant branding (logo, business name)
- Generated testimonial visuals as the primary content
- Customer attribution (name if provided)
- Ratings

Rules:
- The customer voices (the generated visuals) are the visual focus of the page — layout should showcase them, not bury them in metadata or admin-style lists.
- No login, no dashboard navigation, no internal-facing controls.
- Merchant's brand color may be used as a light accent, but the page's job is to showcase testimonials, not to be a branded landing page in its own right.

---

## 7. Generated Testimonial Creative — Distinct From App UI

**This is the most important distinction in this document.** The Taqyeem application UI and the generated testimonial image are two separate visual systems with different rules.

| | Application UI | Generated testimonial creative |
|---|---|---|
| Palette | Warm neutral + ink + emerald (§2) | Whatever the reference image's art direction calls for |
| Mood | Calm, minimal, restrained | Can be dark, bold, cinematic, high-contrast, editorial, expressive |
| Source of visual direction | This DESIGN.md | The supplied reference image |
| Purpose | Usable software | Social-media-ready, shareable social proof |

**Never** force the app's warm/emerald palette onto the generated image. **Never** let the generated image's dark/bold/cinematic style bleed back into the app UI. They are art-directed independently.

### 7.1 Reference image as primary art-direction input

The reference image supplied to the image-generation model is used to understand:
- Composition
- Mood
- Visual hierarchy
- Contrast
- Graphic language
- Density
- Overall quality level

The model generates ONLY the visual background/template — never any text, letters, logos, or stars (see CLAUDE.md §6.1/6.2). Typography is not something the model produces at all; it's applied afterward, deterministically, by the application (§7.4). The model must **not** simply copy/paste the reference image as a static template — each output is a new composition informed by the reference's art direction, not a reskin. The background must reserve a genuine text-safe area (lower detail/contrast in the zone where the deterministic text layer will sit) so the composed result reads clearly.

### 7.2 Content hierarchy in the generated output

Priority order, highest first:
1. Customer quote (the hero of the composition)
2. Customer identity (name, if provided)
3. Rating
4. Merchant identity (name/logo)

The quote is the hero. Everything else supports it.

### 7.3 Exact customer-text preservation (hard requirement)

The original customer review text rendered in the final image must be **character-for-character identical** to `reviews.original_text`. No rewriting, paraphrasing, summarizing, shortening, expanding, translating, "improving," or embellishing — under any circumstance, including when the text is long, awkwardly phrased, or difficult to typeset.

If the text is long, solve it with layout (font size, line breaking, composition adjustments) — never by editing the words.

### 7.4 Deterministic text/logo/rating layer (permanent architecture, not a fallback)

Per CLAUDE.md §6.1/6.3, the AI never renders text at all — this isn't a conditional fallback for when a model "can't render Arabic well," it's the permanent, always-on architecture. The application deterministically composes, on top of the AI background: the exact `original_text` (word-wrapped and auto-scaled to fit, never truncated/rewritten), `customer_name`, a star rating drawn from `rating`, the merchant's real `logo_url` (never an AI-drawn logo — a deterministic initial-letter mark is the fallback when no logo exists), and `business_name` — all in IBM Plex Sans Arabic, true RTL. This layer must still visually match the quality bar in §7.5 — it is not a plain fallback-looking overlay; it's the actual final asset.

### 7.5 Quality gate

Before a generated image is considered acceptable to send/display, it should feel:
- Premium
- Editorial
- Social-media ready
- Strongly composed
- Visually memorable
- Worth sharing

It must **not** feel like a generic SaaS testimonial card (avatar + name + gray box + stars). If an output reads as a generic template rather than an art-directed creative, it fails the quality gate regardless of technical correctness.

### 7.6 Format

All V1 generated output is **1:1 square**. No alternate aspect ratios or additional formats in V1 (see CLAUDE.md §3 for the full out-of-scope list — Stories/Reels/WhatsApp formats are explicitly excluded).

---

## 8. Dashboard (Visual Notes)

Uses the application UI system in §2–4. Simple, information-forward, not analytics-heavy (see CLAUDE.md §12 for functional scope). Navigation: الرئيسية · التقييمات · Wall of Love · QR Code · الإعدادات.

---

## 9. Landing Page (Visual Notes)

Uses the application UI system. Suggested sequence: Hero → real customer review transformed into a beautiful testimonial → how it works → generated testimonial example → Wall of Love preview → QR workflow → benefits → pricing → FAQ → CTA.

The hero/example sections should visually demonstrate the generated testimonial creative (§7) as a showcased artifact distinct from the surrounding calm application UI — the contrast between the two systems is itself part of the story: real words in, premium shareable visual out.

---

## 10. Responsive Behavior

- Mobile-first throughout, especially the customer review page (§5), which is the highest-traffic entry point via QR scans.
- Dashboard and Wall of Love should be usable at common tablet/desktop breakpoints but designed mobile-first first.
- Logical properties (§3) keep RTL and responsive behavior consistent without a separate LTR/desktop override pass.
