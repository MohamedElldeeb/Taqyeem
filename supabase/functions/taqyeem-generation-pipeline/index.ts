import "jsr:@supabase/functions-js/edge-runtime.d.ts";
import { createClient } from "jsr:@supabase/supabase-js@2";
import { encodeBase64, decodeBase64 } from "jsr:@std/encoding/base64";
import { Resvg, initWasm } from "npm:@resvg/resvg-wasm@2.6.2";
import opentype from "npm:opentype.js@1.3.4";

/**
 * Taqyeem AI testimonial image generation pipeline.
 *
 * Phase 13 architecture (CLAUDE.md §6):
 *   AI generates ONLY a visual background/template (no text, no logo, no
 *   stars, no typography — enforced entirely by prompt instruction, since
 *   image models cannot be constrained programmatically). The application
 *   then deterministically composes the FINAL image server-side: the AI
 *   background + the exact customer text + the real merchant logo/name +
 *   a deterministic star rating, rendered via resvg (SVG → PNG, WASM,
 *   no native bindings) with IBM Plex Sans Arabic for correct Arabic
 *   shaping. generated_content.image_url always refers to this FINAL
 *   composed image — the AI-only background is never persisted or served
 *   anywhere; it exists only transiently in this function's memory for
 *   the duration of one request.
 *
 * All privileged Supabase reads/writes (bypassing RLS) live here, using the
 * service-role key Supabase auto-injects into every Edge Function's own
 * runtime — this key is never seen by n8n, the frontend, or committed
 * anywhere. n8n calls this function with the (public, non secret) anon key
 * as bearer auth, purely to gate the endpoint from the open internet — the
 * actual privileged access comes from the function's own service-role
 * client, independent of the caller's identity.
 *
 * Actions:
 *  - start:    load review+merchant (authoritative, never trust caller-
 *              supplied branding), idempotently create/reuse
 *              generated_content, flip statuses to 'processing', return
 *              the reference image + merchant logo as base64 for the
 *              caller (n8n) to hand to the image model.
 *  - complete: takes the AI-generated background, composes the FINAL
 *              image (background + exact text + real logo + rating,
 *              rendered deterministically), uploads ONLY that final PNG,
 *              updates generated_content.image_url + status,
 *              reviews.status. Then atomically claims the email_deliveries
 *              row for this review (Phase 12) — this is the ONLY path
 *              that can ever trigger a merchant email, and it is
 *              idempotent: a review already claimed/sent returns
 *              should_send_email: false. merchant_id is derived from the
 *              review row itself, never trusted from the caller.
 *  - fail:     mark generated_content/reviews as failed (recoverable) —
 *              never downgrades an already-completed result, since this
 *              action is reachable with only the public anon key.
 *  - mark_email_result: n8n calls this after it actually sends (or fails
 *              to send) the email via its own Resend credential, recording
 *              the terminal state. Only resolves a row currently 'sending'
 *              — an already-settled row can never be overwritten. The
 *              Resend API key itself never touches this function or
 *              Supabase at all — it lives only in n8n's encrypted
 *              credential store.
 */

const supabase = createClient(
  Deno.env.get("SUPABASE_URL")!,
  Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
);

function json(body: unknown, status = 200) {
  return new Response(JSON.stringify(body), {
    status,
    headers: { "Content-Type": "application/json" },
  });
}

async function fetchBytes(url: string): Promise<{ bytes: Uint8Array; mime: string } | null> {
  const res = await fetch(url);
  if (!res.ok) return null;
  const mime = res.headers.get("content-type") ?? "image/jpeg";
  return { bytes: new Uint8Array(await res.arrayBuffer()), mime };
}

async function fetchAsBase64(url: string): Promise<{ base64: string; mime: string } | null> {
  const fetched = await fetchBytes(url);
  if (!fetched) return null;
  return { base64: encodeBase64(fetched.bytes), mime: fetched.mime };
}

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

// --- Deterministic composition (Phase 13) -----------------------------

const FONT_URL =
  "https://fonts.gstatic.com/s/ibmplexsansarabic/v15/Qw3NZRtWPQCuHme67tEYUIx3Kh0PHR9N6YOG-dCT.ttf";

let wasmReadyPromise: Promise<void> | null = null;
async function ensureWasmReady(): Promise<void> {
  if (!wasmReadyPromise) {
    wasmReadyPromise = (async () => {
      const res = await fetch("https://unpkg.com/@resvg/resvg-wasm@2.6.2/index_bg.wasm");
      await initWasm(await res.arrayBuffer());
    })();
  }
  return wasmReadyPromise;
}

let fontBytesPromise: Promise<Uint8Array> | null = null;
async function getFontBytes(): Promise<Uint8Array> {
  if (!fontBytesPromise) {
    fontBytesPromise = (async () => {
      const res = await fetch(FONT_URL);
      return new Uint8Array(await res.arrayBuffer());
    })();
  }
  return fontBytesPromise;
}

const CANVAS = 1080;
const PAD = 76;
const SAFE_RIGHT = CANVAS - PAD; // 1004 — right-aligned text edge (RTL)
const SAFE_WIDTH = CANVAS - PAD * 2; // wrapping width
const MAX_QUOTE_LINES = 14;
// Largest-to-smallest candidate sizes; the largest that fits within
// MAX_QUOTE_LINES wins. If none fit, the smallest is used as-is — the
// deterministic overflow policy is "allow the block to run slightly past
// its nominal safe zone rather than ever truncating the customer's words".
const QUOTE_FONT_SIZES = [46, 42, 38, 34, 30, 26, 24];

function wrapText(font: opentype.Font, text: string, fontSizePx: number, maxWidthPx: number): string[] {
  const words = text.split(/\s+/).filter(Boolean);
  const lines: string[] = [];
  let current = "";

  for (const word of words) {
    const candidate = current ? `${current} ${word}` : word;
    if (font.getAdvanceWidth(candidate, fontSizePx) <= maxWidthPx || !current) {
      current = candidate;
    } else {
      lines.push(current);
      current = word;
    }
  }
  if (current) lines.push(current);
  return lines;
}

function starPath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = (Math.PI / 2) + i * ((2 * Math.PI) / 5);
    const innerAngle = outerAngle + Math.PI / 5;
    const ox = cx - r * Math.cos(outerAngle);
    const oy = cy - r * Math.sin(outerAngle);
    const ix = cx - (r * 0.42) * Math.cos(innerAngle);
    const iy = cy - (r * 0.42) * Math.sin(innerAngle);
    points.push(`${ox},${oy}`, `${ix},${iy}`);
  }
  return `M${points.join("L")}Z`;
}

interface ComposeInput {
  backgroundBytes: Uint8Array;
  backgroundMime: string;
  reviewText: string;
  customerName: string | null;
  rating: number;
  businessName: string;
  brandColor: string;
  logo: { bytes: Uint8Array; mime: string } | null;
}

async function composeFinalImage(input: ComposeInput): Promise<Uint8Array> {
  await ensureWasmReady();
  const fontBytes = await getFontBytes();
  const otFont = opentype.parse(fontBytes.buffer.slice(fontBytes.byteOffset, fontBytes.byteOffset + fontBytes.byteLength));

  const safeBrandColor = /^#[0-9a-fA-F]{6}$/.test(input.brandColor) ? input.brandColor : "#087F5B";
  const businessName = escapeXml(input.businessName);
  const customerName = input.customerName ? escapeXml(input.customerName) : null;
  const reviewText = input.reviewText; // wrapped below, escaped per-line

  // Pick the largest font size whose wrapped line count fits the safe area.
  let chosenSize = QUOTE_FONT_SIZES[QUOTE_FONT_SIZES.length - 1];
  let lines: string[] = wrapText(otFont, reviewText, chosenSize, SAFE_WIDTH);
  for (const size of QUOTE_FONT_SIZES) {
    const candidateLines = wrapText(otFont, reviewText, size, SAFE_WIDTH);
    if (candidateLines.length <= MAX_QUOTE_LINES) {
      chosenSize = size;
      lines = candidateLines;
      break;
    }
  }

  const lineHeight = chosenSize * 1.45;
  const quoteStartY = 340;
  const quoteEndY = quoteStartY + lines.length * lineHeight;

  const nameY = quoteEndY + 56;
  const starsY = customerName ? nameY + 46 : quoteEndY + 60;

  const backgroundDataUri = `data:${input.backgroundMime};base64,${encodeBase64(input.backgroundBytes)}`;

  const quoteLinesSvg = lines
    .map(
      (line, i) =>
        `<text x="${SAFE_RIGHT}" y="${quoteStartY + i * lineHeight}" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="${chosenSize}" fill="#ffffff" text-anchor="end" direction="rtl">${escapeXml(line)}</text>`,
    )
    .join("\n");

  const starsSvg = Array.from({ length: 5 }, (_, i) => {
    const cx = SAFE_RIGHT - 18 - i * 46;
    const filled = i < input.rating;
    return `<path d="${starPath(cx, starsY, 18)}" fill="${filled ? safeBrandColor : "rgba(255,255,255,0.18)"}"/>`;
  }).join("\n");

  const markCx = SAFE_RIGHT - 28;
  const markCy = PAD + 28;
  const logoSvg = input.logo
    ? `<clipPath id="logoClip"><circle cx="${markCx}" cy="${markCy}" r="28"/></clipPath>
       <image x="${markCx - 28}" y="${markCy - 28}" width="56" height="56" href="data:${input.logo.mime};base64,${encodeBase64(input.logo.bytes)}" clip-path="url(#logoClip)" preserveAspectRatio="xMidYMid slice"/>`
    : `<circle cx="${markCx}" cy="${markCy}" r="28" fill="${safeBrandColor}"/>
       <text x="${markCx}" y="${markCy + 9}" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="26" fill="#ffffff" text-anchor="middle">${businessName.trim().charAt(0)}</text>`;

  const svg = `
<svg width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <linearGradient id="textScrim" x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%" stop-color="#000000" stop-opacity="0"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.45"/>
    </linearGradient>
  </defs>
  <image x="0" y="0" width="${CANVAS}" height="${CANVAS}" href="${backgroundDataUri}" preserveAspectRatio="xMidYMid slice"/>
  <rect x="0" y="${quoteStartY - 140}" width="${CANVAS}" height="${CANVAS - (quoteStartY - 140)}" fill="url(#textScrim)"/>

  ${logoSvg}
  <text x="${markCx - 44}" y="${markCy + 7}" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="24" fill="rgba(255,255,255,0.7)" text-anchor="end">${businessName}</text>

  <text x="${SAFE_RIGHT}" y="270" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="90" fill="${safeBrandColor}" text-anchor="end" opacity="0.9">&quot;</text>

  ${quoteLinesSvg}

  ${customerName ? `<text x="${SAFE_RIGHT}" y="${nameY}" font-family="IBM Plex Sans Arabic" font-weight="700" font-size="32" fill="${safeBrandColor}" text-anchor="end">${customerName}</text>` : ""}

  ${starsSvg}
</svg>`.trim();

  const resvg = new Resvg(svg, {
    font: {
      fontBuffers: [fontBytes],
      loadSystemFonts: false,
      defaultFontFamily: "IBM Plex Sans Arabic",
    },
  });
  return resvg.render().asPng();
}

// --- Action handlers ----------------------------------------------------

async function handleStart(review_id: string) {
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("id, merchant_id, customer_name, rating, original_text, status")
    .eq("id", review_id)
    .maybeSingle();

  if (reviewError || !review) {
    return json({ error: "review_not_found" }, 404);
  }

  const { data: merchant, error: merchantError } = await supabase
    .from("merchants")
    .select("id, business_name, brand_color, logo_url")
    .eq("id", review.merchant_id)
    .maybeSingle();

  if (merchantError || !merchant) {
    return json({ error: "merchant_not_found" }, 404);
  }

  // Idempotent create-or-reuse, keyed on the unique review_id constraint.
  // Never regenerate/overwrite an already-completed result.
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

  const { data: generatedContent, error: upsertError } = await supabase
    .from("generated_content")
    .upsert(
      { review_id, status: "processing" },
      { onConflict: "review_id" },
    )
    .select("id")
    .single();

  if (upsertError || !generatedContent) {
    return json({ error: "failed_to_create_generated_content" }, 500);
  }

  await supabase.from("reviews").update({ status: "processing" }).eq("id", review_id);

  // Private bucket: download via the service-role client (no public URL exists).
  const { data: refBlob, error: refError } = await supabase.storage
    .from("reference-assets")
    .download("testimonial-reference.png");

  if (refError || !refBlob) {
    return json({ error: "reference_image_unavailable" }, 500);
  }

  const refBytes = new Uint8Array(await refBlob.arrayBuffer());
  const referenceImageBase64 = encodeBase64(refBytes);
  const referenceMime = refBlob.type || "image/jpeg";

  let logoImageBase64: string | null = null;
  let logoMime: string | null = null;
  if (merchant.logo_url) {
    const logo = await fetchAsBase64(merchant.logo_url);
    if (logo) {
      logoImageBase64 = logo.base64;
      logoMime = logo.mime;
    }
  }

  return json({
    generated_content_id: generatedContent.id,
    review: {
      id: review.id,
      customer_name: review.customer_name,
      rating: review.rating,
      original_text: review.original_text,
    },
    merchant: {
      id: merchant.id,
      business_name: merchant.business_name,
      brand_color: merchant.brand_color,
    },
    referenceImageBase64,
    referenceMime,
    logoImageBase64,
    logoMime,
  });
}

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

async function handleComplete(review_id: string, imageBase64: string, imageMime: string) {
  // merchant_id is derived from the review row itself, never trusted from
  // the caller — review IDs and merchant IDs are both publicly readable
  // (via the public RPCs), so accepting a caller-supplied merchant_id here
  // would let someone attach an arbitrary review's content/image to a
  // different merchant's storage path and email inbox.
  const { data: review, error: reviewError } = await supabase
    .from("reviews")
    .select("merchant_id, customer_name, rating, original_text")
    .eq("id", review_id)
    .maybeSingle();

  if (reviewError || !review) {
    return json({ error: "review_not_found" }, 404);
  }

  const merchant_id = review.merchant_id;

  const { data: merchant, error: merchantError } = await supabase
    .from("merchants")
    .select("business_name, brand_color, logo_url")
    .eq("id", merchant_id)
    .maybeSingle();

  if (merchantError || !merchant) {
    return json({ error: "merchant_not_found" }, 404);
  }

  let logo: { bytes: Uint8Array; mime: string } | null = null;
  if (merchant.logo_url) {
    logo = await fetchBytes(merchant.logo_url);
  }

  let finalPng: Uint8Array;
  try {
    finalPng = await composeFinalImage({
      backgroundBytes: decodeBase64(imageBase64),
      backgroundMime: imageMime || "image/jpeg",
      reviewText: review.original_text,
      customerName: review.customer_name,
      rating: review.rating,
      businessName: merchant.business_name,
      brandColor: merchant.brand_color,
      logo,
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

  const { data: publicUrlData } = supabase.storage
    .from("generated-content")
    .getPublicUrl(path);

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

  await supabase
    .from("generated_content")
    .update({ status: "failed" })
    .eq("review_id", review_id);
  await supabase.from("reviews").update({ status: "failed" }).eq("id", review_id);
  return json({ ok: true });
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
    case "start":
      return handleStart(review_id);
    case "complete": {
      const { imageBase64, imageMime } = body as { imageBase64?: string; imageMime?: string };
      if (!imageBase64) {
        return json({ error: "imageBase64_required" }, 400);
      }
      return handleComplete(review_id, imageBase64, imageMime || "image/jpeg");
    }
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
