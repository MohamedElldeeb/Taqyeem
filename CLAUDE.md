# CLAUDE.md — Taqyeem Engineering & Product Source of Truth

This file is the source of truth for how Taqyeem is built. Read this and [DESIGN.md](DESIGN.md) before writing any code. If something is ambiguous or not covered here, stop and ask rather than inventing a product decision.

---

## 1. What Taqyeem Is

Taqyeem (تقييم) is an Arabic-first SaaS for merchants. A merchant gets a stable review link and QR code. Customers submit a real review (rating + original text + optional name) with no account required. Taqyeem turns that real review into a premium 1:1 AI-generated social-proof image, which is emailed to the merchant, shown in their dashboard, and displayed on their public Wall of Love.

Core value chain:

```
REAL CUSTOMER REVIEW → BEAUTIFUL SOCIAL-PROOF VISUAL → READY TO SHARE
```

The customer's review is the source of truth. The AI's job is visual design only — never copywriting.

---

## 2. Non-Negotiable Product Rules

These rules override any convenient implementation shortcut. If a task seems to require breaking one of these, stop and ask.

1. **The customer's original review text is immutable.** It is never rewritten, paraphrased, summarized, shortened, expanded, translated, "improved," or otherwise altered by AI at any stage.
2. **The AI is a visual designer, not a copywriter.** It generates composition, background, mood, and typography direction — never new or altered wording, claims, or praise.
3. **The reference image is the primary art-direction input** for the generated testimonial creative, not a template to copy. The model adapts its composition/mood/typography direction to the current merchant, customer, and review.
4. **If the image model cannot reliably render Arabic text**, do not attempt to fix this with another AI text pass. Use the deterministic architecture instead (see §6.3): AI generates the visual/background/composition, and the application renders the exact original customer text on top, deterministically.
5. **No additional AI processing steps** beyond the single image-generation call — no captioning, summarizing, sentiment analysis, or marketing copy AI. See §3 for the full exclusion list.
6. **Taqyeem's own application UI and the generated testimonial creative are visually independent.** Never force the app's warm/neutral/emerald UI palette onto the generated image, and never let the generated image's dark/bold/editorial style bleed into the app UI. See [DESIGN.md](DESIGN.md) §"UI vs Generated Image" for details.

---

## 3. V1 Scope

### In scope
1. Landing Page
2. Merchant Authentication
3. Merchant Onboarding
4. Merchant Dashboard
5. Customer Review Page
6. Reviews Management
7. Public Wall of Love
8. QR Code
9. Brand Settings
10. AI Testimonial Image Generation
11. Email Delivery

Generated output format: **1:1 square only.**

### Explicitly out of scope for V1 (do not implement without explicit approval)
- AI captions
- AI summaries
- AI testimonial rewriting
- AI sentiment analysis
- AI marketing copy generation
- Complex analytics, funnels, cohorts, AI insights
- Multiple creative formats (Stories/Reels/WhatsApp Status)
- Unlimited design templates
- Prompt playground for merchants
- Any additional `generated_content`/`reviews` fields such as `processed_text`, `ai_caption`, `ai_summary`, `ai_testimonial`

If a task implies any of the above, stop and flag it instead of building it.

---

## 4. Tech Stack

**Frontend:** React, Vite, TypeScript, Tailwind CSS, shadcn/ui

**Backend:** Supabase (PostgreSQL, Supabase Auth, Supabase Storage)

**Automation:** n8n

**AI:** OpenRouter, configurable image-generation model (currently planned: Nano Banana)

**QR:** lightweight QR code library

**Email:** provider selected during implementation (do not hardcode a choice prematurely; isolate behind a single sending function)

**Hard rule:** Never expose the OpenRouter API key (or any server secret) in frontend code, bundles, or client-visible env vars (no `VITE_OPENROUTER_API_KEY`). All AI calls happen server-side (n8n / server function), never directly from the browser.

---

## 5. Data Model

Supabase Postgres is the single source of truth. `users` comes from Supabase Auth.

```
merchants
  id
  user_id
  business_name
  slug
  logo_url
  brand_color
  created_at
  updated_at

reviews
  id
  merchant_id
  customer_name       -- optional
  rating
  original_text        -- immutable once written
  status
  created_at
  updated_at

generated_content
  id
  review_id
  image_url
  status
  created_at
  updated_at

email_deliveries          -- Phase 12: email delivery state, separate from
  id                      -- generated_content's own status. One row per
  review_id               -- review (unique) — retries update this same
  merchant_id             -- row in place rather than creating new attempts,
  status                  -- which is what guarantees at most one successful
  provider_message_id     -- send per review. pending | sending | sent | failed.
  sent_at
  created_at
  updated_at
```

Rules:
- Do not add fields like `processed_text`, `ai_caption`, `ai_summary`, `ai_testimonial` unless explicitly approved.
- `reviews.original_text` must never be overwritten or transformed in place. If a derived value is ever needed, it lives in `generated_content`, not on the review row.
- `merchants.slug` must remain stable once generated — it is embedded in the QR code and the public review link.
- Schema changes require RLS policies to be added/updated in the same change (see §7).

---

## 6. AI Architecture

### 6.1 Isolation — and the canonical final-image pipeline (Phase 13)

**Non-negotiable split of responsibility:** the AI model generates ONLY a visual background/template. It is never asked to render any text, letters, numbers, logos, stars, or typography — not even the customer's name. The application deterministically composes the FINAL image server-side, on top of that AI background:

```
reviews row (real customer text/name/rating)
  → n8n generation pipeline
  → AI generates visual background/template ONLY (no text, no logo, no stars)
  → Edge Function (taqyeem-generation-pipeline, `complete` action):
      background + EXACT original_text + customer_name + rating
      + REAL merchant logo (fetched from merchants.logo_url, never AI-drawn)
      + merchant business_name
      → rendered deterministically (SVG → PNG via resvg, IBM Plex Sans Arabic)
      → FINAL TESTIMONIAL IMAGE
  → uploaded to generated-content/{merchant_id}/{review_id}.png
  → generated_content.image_url = this FINAL image (never the AI-only background)
  → Dashboard, Wall of Love, and Email all consume this same image_url —
    none of them independently reconstruct or re-render the visual.
```

The AI-only background is never persisted anywhere and never reaches any consumer — it exists only transiently in memory during the single `complete` request. `generated_content.status` only becomes `completed` once the final composed image has been successfully stored; a failure at either the AI-generation stage or the deterministic-composition stage results in `failed`, recoverable, with the original review left completely intact.

UI code never talks to OpenRouter directly. Provider/model configuration (API key, model id) is isolated in server-side config, not in UI code.

### 6.2 Inputs to the model (background generation only)

- Reference image (primary art-direction input) — the actual image bytes, not just a filename mention
- Merchant brand color (used as a controlled accent in the prompt — never used to recolor the whole image)
- Square (1:1) format instruction
- Explicit, concrete negative instructions: no text, no letters, no numbers, no logos, no stars, no typography of any kind, no people/photographic elements
- An explicit reserved text-safe-area instruction (roughly the right two-thirds of the frame), since real text is composited there afterward

The model is never given the customer's review text, name, rating, business name, or logo — there is nothing for it to rewrite, because it never receives the words at all.

### 6.3 Deterministic final composition

Implemented via **resvg** (SVG → PNG rasterizer, WASM build, no native bindings — runs directly in the Supabase Edge Function's Deno runtime) with **IBM Plex Sans Arabic** for correct Arabic shaping (verified: proper letter joining, correct RTL), and **opentype.js** for accurate glyph-width text measurement (used to word-wrap the testimonial and to auto-scale its font size down through a fixed set of candidate sizes until it fits a maximum line count — never by truncating or altering the customer's words). The real merchant logo is fetched from `merchants.logo_url` and embedded as-is (circularly clipped); if no logo exists, a deterministic initial-letter mark is used instead — never an AI-invented logo. Rating stars are drawn as plain SVG paths, filled up to `reviews.rating`. All user-supplied text is XML-escaped before being embedded in the SVG.

Do not solve any text-rendering concern by adding another AI step that "cleans up," rewrites, or regenerates the text. That would violate the immutability rule in §2. This deterministic-composition architecture *is* the permanent solution, not a fallback for only some cases.

### 6.4 Environment variables

```
OPENROUTER_API_KEY
OPENROUTER_IMAGE_MODEL
```

These live server-side only (n8n credentials / server function env), never in frontend `.env` files that ship to the client.

---

## 7. Security

- Supabase Row Level Security (RLS) is mandatory on all tables.
- A merchant can only read/write their own `merchants`, `reviews`, and `generated_content` rows.
- The public Wall of Love (`/w/{merchant-slug}`) and the review submission endpoint (`/r/{merchant-slug}`) are the only paths with any public/anonymous access, and only to the specific fields needed:
  - Public review submission: needs merchant branding fields (name, logo, brand color) to render the form, and an insert-only path into `reviews`.
  - Public Wall of Love: needs merchant branding + published testimonial content (customer name/rating/generated image), not full row contents.
- Never expose internal IDs unnecessarily in public-facing responses/URLs beyond what's needed for routing.
- Never expose merchant private data (email, auth info, internal settings) on public routes.
- OpenRouter API key and any other provider secrets stay server-side (n8n credential store / server env), never shipped to the client.
- Customers never get an account; there is no customer auth to secure — the trust boundary is entirely about protecting merchant data and controlling what's public.

---

## 8. n8n Workflow Architecture

Conceptual flow, triggered on review submission:

```
Review submitted
  → Webhook
  → Validate payload
  → Mark generated_content status = processing
  → Call secure image-generation service (ImageGenerationService)
  → OpenRouter / configured image model
  → Store generated image in Supabase Storage
  → Update generated_content (status = ready, image_url set)
  → Email merchant
```

Failure path:

```
→ generated_content.status = failed
→ log / notify appropriately
```

Make the workflow idempotent where practical (e.g., safe to retry on a given review without creating duplicate generated_content rows or duplicate emails).

---

## 9. Email

**Provider: Resend** (Phase 12). Chosen for a simple REST API (`POST api.resend.com/emails`, one fetch call — no heavy SDK needed from an Edge Function), attachment support, a generous free tier, and a native `Idempotency-Key` header as a second layer of duplicate-send protection on top of our own DB state.

**Architecture:**
```
reviews insert → trigger → n8n webhook → ... → Complete Generation
  → generated_content/reviews = completed
  → claim email_deliveries row (atomic; Edge Function, service-role)
  → should_send_email? → n8n builds the email HTML → Resend API (n8n credential)
  → n8n reports result back to the Edge Function → email_deliveries = sent | failed
```
- The **Edge Function** (`taqyeem-generation-pipeline`) is the sole source of truth for idempotency and authorization: it derives `merchant_id` from the review row itself (never trusts a caller-supplied value — review/merchant IDs are both publicly readable via the RPCs), atomically claims the `email_deliveries` row (only a row in `pending`/`failed` can be claimed), and resolves the merchant's email server-side via the Supabase Auth admin API (`auth.admin.getUserById`) — never duplicated onto `merchants`.
- The **actual Resend HTTP call** happens in n8n, using a dedicated n8n credential (`Resend account`, `httpHeaderAuth`) — the Resend API key never touches the frontend, Supabase, or git.
- Email is triggered **only** by the `complete` action succeeding — never by the frontend, dashboard, or Wall of Love opening.
- `mark_email_result` (and `fail`) only ever transition a row out of its current in-flight state (`sending` → `sent`/`failed`; non-`completed` → `failed`) — an already-settled row can never be overwritten, which is what stops the public anon key from forging delivery state.

Merchant email must contain:
- Customer name (if provided)
- Rating
- Original testimonial text (verbatim)
- Generated image
- Link back to the dashboard (a Wall of Love CTA is added once a fixed production origin exists — omitted for now rather than guessing a domain)

Do not generate an AI caption or any AI-written copy for the email body beyond the fixed template.

---

## 10. Main User Flows (Reference)

**A — Merchant Onboarding:** Landing → Sign Up → Business Setup → Upload Logo → Choose Brand Color → Generate Review Link → Generate QR → Dashboard

**B — Customer Review:** `/r/{merchant-slug}` → Merchant branding → Rating → Original review text → Optional customer name → Submit → Success. No account.

**C — Image Generation:** Review submitted → Review stored → Image generation triggered → ImageGenerationService → OpenRouter → configured image model → Generated image → Supabase Storage → `generated_content` updated → Merchant notified by email.

**D — Wall of Love:** `/w/{merchant-slug}` → Merchant branding → Testimonials → Generated testimonial visuals → Customer attribution → Ratings. No login.

**E — QR:** Dashboard → Copy review link → Download/show QR → Customer scans → `/r/{merchant-slug}`. The slug must remain stable.

---

## 11. Development Workflow (How Claude Code Should Operate Here)

Before any implementation task:
1. Read this file (CLAUDE.md).
2. Read [DESIGN.md](DESIGN.md).
3. Inspect the existing project structure.
4. Identify existing dependencies/components already in the repo.
5. Reuse existing patterns rather than introducing new ones.
6. Make the smallest appropriate change for the task.

For any non-trivial implementation task, before writing code, explain:
- Understanding of the task
- Affected files
- Implementation plan
- Any ambiguity found

Then implement.

After implementation:
- Run relevant checks (typecheck/lint/tests as applicable)
- Fix issues found
- Verify the UI where relevant (see root-level guidance on testing UI changes in a browser)
- Summarize exactly what changed

Do not rewrite unrelated code. Do not silently invent product decisions — if the spec doesn't cover it, ask.

### Implementation order

Work in phases; do not implement all phases at once.

1. Design foundation
2. Customer review page
3. Generated testimonial output experience
4. Wall of Love
5. Dashboard shell
6. Authentication + onboarding
7. Supabase schema + RLS
8. Real customer review flow
9. QR + stable review link
10. AI image generation
11. n8n workflow
12. Email
13. Reviews management
14. Landing page
15. Final polish/testing

---

## 12. Dashboard Scope Guardrail

The dashboard must stay simple. It should let a merchant answer:
- How many reviews do I have?
- What are my latest reviews?
- Which generated images are ready?
- What is my review link?
- Where is my QR?
- What does my Wall of Love look like?

It is not an analytics platform. Do not add funnels, cohorts, or insight dashboards.

Suggested navigation: الرئيسية · التقييمات · Wall of Love · QR Code · الإعدادات

---

## 13. Brand Direction (Summary)

No finalized logo yet. Direction: wordmark `taqyeem` with Arabic companion `تقييم`; possible minimal abstract rating/check/proof symbol. Avoid a traditional five-star logo and avoid over-designing. Full visual language lives in [DESIGN.md](DESIGN.md).
