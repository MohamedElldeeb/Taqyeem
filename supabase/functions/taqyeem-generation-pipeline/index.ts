import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";

import { DEFAULT_TEMPLATE_ID, isTemplateId, type TemplateId } from "./templates.ts";

/**
 * Taqyeem testimonial image generation pipeline.
 *
 * Static-template architecture: the merchant picks one of a fixed set of
 * reusable testimonial templates (merchants.default_template_id). Every
 * review is composed deterministically from the chosen template's exact
 * HTML/CSS source (api/_templates/*.html in the frontend repo) — rendered
 * with real headless Chromium (via the taqyeem.site/api/render-testimonial
 * Vercel function), the only method that reproduces those designs exactly
 * (CSS color-mix(), gradients, Arabic shaping fine details do not survive
 * a hand-rebuilt SVG/canvas port). No AI image-generation API is called
 * anywhere in this flow — cost and output are fully predictable.
 *
 * This function stays the sole privileged orchestrator: it is the only
 * place with service-role Supabase access (auto-injected into every Edge
 * Function's runtime — never seen by n8n, the frontend, or committed
 * anywhere), and it owns idempotency, the merchant_id trust boundary, and
 * the email-claim handshake. The actual pixel rendering is delegated to
 * the Vercel render endpoint over HTTPS, authenticated with a shared
 * secret header so it is never reachable by an anonymous caller.
 *
 * Actions:
 *  - generate: idempotently create/reuse generated_content, resolve the
 *              merchant's default template (falling back to the system
 *              default for merchants who never picked one), render the
 *              FINAL image via the Vercel render endpoint, upload it,
 *              update generated_content/reviews, and atomically claim the
 *              email_deliveries row (Phase 12) — the only path that can
 *              ever trigger a merchant email. merchant_id and all review
 *              content are derived from the review row itself, never
 *              trusted from the caller.
 *  - fail:     mark generated_content/reviews as failed (recoverable) —
 *              never downgrades an already-completed result, since this
 *              action is reachable with only the public anon key.
 *  - mark_email_result: n8n calls this after it actually sends (or fails
 *              to send) the email via its own Resend credential,
 *              recording the terminal state. Only resolves a row
 *              currently 'sending' — an already-settled row can never be
 *              overwritten. The Resend API key itself never touches this
 *              function or Supabase at all — it lives only in n8n's
 *              encrypted credential store.
 */

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

// Must equal the Vercel project's RENDER_SECRET env var — gates the
// render endpoint from the open internet. Set via `supabase secrets set
// RENDER_SECRET=... ` (or the Dashboard's Edge Functions → Secrets page),
// never hardcoded here: this file ships to a public repo.
const RENDER_SECRET = Deno.env.get("RENDER_SECRET") ?? "";
const RENDER_ENDPOINT = "https://taqyeem.site/api/render-testimonial";

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function renderOnce(opts: {
  templateId: TemplateId;
  reviewText: string;
  customerName: string | null;
  rating: number;
  businessName: string;
  brandColor: string;
  logoUrl: string | null;
}): Promise<Uint8Array> {
  const res = await fetch(RENDER_ENDPOINT, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Render-Secret": RENDER_SECRET,
    },
    body: JSON.stringify({
      templateId: opts.templateId,
      quote: opts.reviewText,
      customer: opts.customerName ?? undefined,
      rating: opts.rating,
      merchant: opts.businessName,
      brandColor: opts.brandColor,
      logoUrl: opts.logoUrl ?? undefined,
    }),
  });

  if (!res.ok) {
    const detail = await res.text().catch(() => "");
    throw new Error(`render endpoint failed: ${res.status} ${detail}`);
  }

  return new Uint8Array(await res.arrayBuffer());
}

/**
 * The render endpoint occasionally fails transiently (a cold Chromium
 * launch, a momentary resource hiccup on Vercel) rather than because of
 * anything wrong with the review/template data -- retrying the exact same
 * request a second time has reliably succeeded every time this has been
 * observed. One retry after a short pause turns those into a success
 * instead of leaving the review permanently stuck in a customer-visible
 * "فشل الإنشاء" state until someone manually replays the generate action.
 */
async function renderFinalPng(
  opts: Parameters<typeof renderOnce>[0],
): Promise<Uint8Array> {
  try {
    return await renderOnce(opts);
  } catch (firstError) {
    console.error("render attempt 1 failed, retrying once", firstError);
    await new Promise((resolve) => setTimeout(resolve, 1500));
    return await renderOnce(opts);
  }
}

// --- Action handlers ----------------------------------------------------

/**
 * Atomically claims the email_deliveries row for this review, so at most
 * one caller ever proceeds to send. Resolves the merchant's email
 * authoritatively via the Auth admin API (never trusts the caller, never
 * duplicates the email onto `merchants`).
 */
async function claimEmailDelivery(review_id: string, merchant_id: string) {
  await supabase
    .from("email_deliveries")
    .upsert(
      { review_id, merchant_id, status: "pending" },
      { onConflict: "review_id", ignoreDuplicates: true },
    );

  const { data: claimed } = await supabase
    .from("email_deliveries")
    .update({ status: "sending" })
    .eq("review_id", review_id)
    .in("status", ["pending", "failed"])
    .select("id")
    .maybeSingle();

  if (!claimed) {
    return { should_send_email: false };
  }

  const { data: review } = await supabase
    .from("reviews")
    .select("customer_name, rating, original_text")
    .eq("id", review_id)
    .maybeSingle();

  const { data: merchant } = await supabase
    .from("merchants")
    .select("user_id, business_name, slug")
    .eq("id", merchant_id)
    .maybeSingle();

  if (!review || !merchant) {
    await supabase.from("email_deliveries").update({ status: "failed" }).eq("review_id", review_id);
    return { should_send_email: false };
  }

  const { data: userData, error: userError } = await supabase.auth.admin.getUserById(
    merchant.user_id,
  );
  const merchantEmail = userData?.user?.email;

  if (userError || !merchantEmail) {
    await supabase.from("email_deliveries").update({ status: "failed" }).eq("review_id", review_id);
    return { should_send_email: false };
  }

  return {
    should_send_email: true,
    email: {
      to: merchantEmail,
      business_name: merchant.business_name,
      slug: merchant.slug,
      customer_name: review.customer_name,
      rating: review.rating,
      original_text: review.original_text,
    },
  };
}

async function handleFail(review_id: string) {
  // This action is reachable with only the public, non-secret anon key
  // (n8n has no stronger identity to present), so it must never be able
  // to vandalize an already-completed, real generation — only ever move
  // a still-in-progress review into 'failed'.
  const { data: gc } = await supabase
    .from("generated_content")
    .select("status")
    .eq("review_id", review_id)
    .maybeSingle();

  if (gc?.status === "completed") {
    return json({ ok: true, skipped: true });
  }

  await supabase.from("generated_content").update({ status: "failed" }).eq("review_id", review_id);
  await supabase.from("reviews").update({ status: "failed" }).eq("id", review_id);
  return json({ ok: true });
}

async function handleGenerate(review_id: string) {
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("id, merchant_id, customer_name, rating, original_text, status")
    .eq("id", review_id)
    .maybeSingle();

  if (reviewError || !review) {
    return json({ error: "review_not_found" }, 404);
  }

  const merchant_id = review.merchant_id;

  const { data: merchant, error: merchantError } = await supabase
    .from("merchants")
    .select("id, business_name, brand_color, logo_url, default_template_id")
    .eq("id", merchant_id)
    .maybeSingle();

  if (merchantError || !merchant) {
    return json({ error: "merchant_not_found" }, 404);
  }

  // Idempotent create-or-reuse, keyed on the unique review_id constraint.
  // Never regenerate/overwrite an already-completed result — existing
  // generated images stay exactly as they were even if the merchant later
  // changes their default template.
  const { data: existing } = await supabase
    .from("generated_content")
    .select("id, status, image_url")
    .eq("review_id", review_id)
    .maybeSingle();

  if (existing?.status === "completed") {
    return json({
      alreadyCompleted: true,
      generated_content_id: existing.id,
      image_url: existing.image_url,
    });
  }

  const { error: upsertError } = await supabase
    .from("generated_content")
    .upsert({ review_id, status: "processing" }, { onConflict: "review_id" })
    .select("id")
    .single();

  if (upsertError) {
    return json({ error: "failed_to_create_generated_content" }, 500);
  }

  await supabase.from("reviews").update({ status: "processing" }).eq("id", review_id);

  const templateId: TemplateId = isTemplateId(merchant.default_template_id)
    ? merchant.default_template_id
    : DEFAULT_TEMPLATE_ID;

  let finalPng: Uint8Array;
  try {
    finalPng = await renderFinalPng({
      templateId,
      reviewText: review.original_text,
      customerName: review.customer_name,
      rating: review.rating,
      businessName: merchant.business_name,
      brandColor: merchant.brand_color,
      logoUrl: merchant.logo_url,
    });
  } catch (composeError) {
    console.error("final composition failed", composeError);
    await handleFail(review_id);
    return json({ error: "composition_failed" }, 500);
  }

  const path = `${merchant_id}/${review_id}.png`;
  const { error: uploadError } = await supabase.storage
    .from("generated-content")
    .upload(path, finalPng, { contentType: "image/png", upsert: true });

  if (uploadError) {
    await handleFail(review_id);
    return json({ error: "upload_failed" }, 500);
  }

  const { data: publicUrlData } = supabase.storage.from("generated-content").getPublicUrl(path);

  await supabase
    .from("generated_content")
    .update({ image_url: publicUrlData.publicUrl, status: "completed" })
    .eq("review_id", review_id);

  await supabase.from("reviews").update({ status: "completed" }).eq("id", review_id);

  // Email failure/success is intentionally decided AFTER the lines above
  // have already committed — nothing past this point can ever turn a
  // successful generation back into a failure.
  const emailResult = await claimEmailDelivery(review_id, merchant_id);

  return json({ image_url: publicUrlData.publicUrl, ...emailResult });
}

async function handleMarkEmailResult(
  review_id: string,
  success: boolean,
  provider_message_id: string | undefined,
) {
  const updates = success
    ? {
        status: "sent",
        provider_message_id: provider_message_id ?? null,
        sent_at: new Date().toISOString(),
      }
    : { status: "failed" };

  const { data } = await supabase
    .from("email_deliveries")
    .update(updates)
    .eq("review_id", review_id)
    .eq("status", "sending")
    .select("id")
    .maybeSingle();

  return json({ ok: true, updated: Boolean(data) });
}

Deno.serve(async (req: Request) => {
  if (req.method !== "POST") {
    return json({ error: "method_not_allowed" }, 405);
  }

  let body: Record<string, unknown>;
  try {
    body = await req.json();
  } catch {
    return json({ error: "invalid_json" }, 400);
  }

  const { action, review_id } = body as { action?: string; review_id?: string };

  if (!review_id || typeof review_id !== "string") {
    return json({ error: "review_id_required" }, 400);
  }

  switch (action) {
    case "generate":
      return handleGenerate(review_id);
    case "fail":
      return handleFail(review_id);
    case "mark_email_result": {
      const { success, provider_message_id } = body as {
        success?: boolean;
        provider_message_id?: string;
      };
      return handleMarkEmailResult(review_id, Boolean(success), provider_message_id);
    }
    default:
      return json({ error: "unknown_action" }, 400);
  }
});
