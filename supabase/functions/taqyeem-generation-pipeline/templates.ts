import opentype from "npm:opentype.js@1.3.4";

/**
 * Reusable testimonial template registry (replaces per-review AI visual
 * generation — see CLAUDE.md §6, updated for this architecture).
 *
 * Each template is a pure function: (exact review data + merchant brand
 * color + logo bytes) -> a complete 1080x1080 SVG string. No AI is
 * involved anywhere in this file. The customer's review text, name,
 * rating, and the merchant's business name are rendered verbatim
 * (XML-escaped only) — never rewritten, translated, or summarized.
 *
 * Eight templates ship, matching the approved designs 1:1 in composition,
 * color, and typography direction: neon, luxury, minimal, organic, bold,
 * magazine, soft, brutalist. Every template takes the same `TemplateInput`
 * and returns the same shape, so adding a future template only means
 * writing one more render function and registering it below — no change
 * to the generation pipeline itself.
 */

export type TemplateId =
  | "neon"
  | "luxury"
  | "minimal"
  | "organic"
  | "bold"
  | "magazine"
  | "soft"
  | "brutalist";

export const TEMPLATE_IDS: TemplateId[] = [
  "neon",
  "luxury",
  "minimal",
  "organic",
  "bold",
  "magazine",
  "soft",
  "brutalist",
];

export const DEFAULT_TEMPLATE_ID: TemplateId = "neon";

export const TEMPLATE_NAMES: Record<TemplateId, string> = {
  neon: "Neon Editorial",
  luxury: "Luxury Editorial",
  minimal: "Minimal Modern",
  organic: "Warm Organic",
  bold: "Bold Contemporary",
  magazine: "Magazine Editorial",
  soft: "Soft Premium",
  brutalist: "Brutalist Modern",
};

export function isTemplateId(value: unknown): value is TemplateId {
  return typeof value === "string" && (TEMPLATE_IDS as string[]).includes(value);
}

export interface TemplateInput {
  reviewText: string;
  customerName: string | null;
  rating: number; // 1-5
  businessName: string;
  brandColor: string; // validated #rrggbb
  logo: { bytes: Uint8Array; mime: string } | null;
  font: opentype.Font; // for measurement only, never for rendering
}

const CANVAS = 1080;
const HEADING_LABEL = "آراء عملاؤنا";

// --- shared primitives ---------------------------------------------------

function escapeXml(input: string): string {
  return input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&apos;");
}

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

/**
 * Picks the largest candidate font size (largest-to-smallest) whose
 * wrapped text block actually fits maxHeightPx, measuring each
 * candidate's own line height (not a line-count proxy — a bigger font
 * wraps into fewer lines but each line is taller, so line count alone
 * does not predict whether the block fits). Falls back to the smallest
 * size otherwise — the exact customer text is never truncated, only
 * ever allowed to run slightly past its nominal safe zone.
 */
function fitQuote(
  font: opentype.Font,
  text: string,
  sizesLargeToSmall: number[],
  maxWidthPx: number,
  maxHeightPx: number,
  lineHeightMultiplier: number,
): { fontSize: number; lines: string[]; lineHeight: number } {
  let chosen = sizesLargeToSmall[sizesLargeToSmall.length - 1];
  let lines = wrapText(font, text, chosen, maxWidthPx);
  let lineHeight = chosen * lineHeightMultiplier;
  for (const size of sizesLargeToSmall) {
    const candidateLines = wrapText(font, text, size, maxWidthPx);
    const candidateLineHeight = size * lineHeightMultiplier;
    if (candidateLines.length * candidateLineHeight <= maxHeightPx) {
      chosen = size;
      lines = candidateLines;
      lineHeight = candidateLineHeight;
      break;
    }
  }
  return { fontSize: chosen, lines, lineHeight };
}

/**
 * Largest candidate size (largest-to-smallest) whose single-line advance
 * width fits maxWidthPx. Used for business-name labels in narrow boxes
 * that must never run outside their designated area — never for the
 * customer quote, which uses fitQuote's multi-line wrapping instead.
 */
function fitSingleLine(font: opentype.Font, text: string, maxWidthPx: number, sizesLargeToSmall: number[]): number {
  for (const size of sizesLargeToSmall) {
    if (font.getAdvanceWidth(text, size) <= maxWidthPx) return size;
  }
  return sizesLargeToSmall[sizesLargeToSmall.length - 1];
}

function clampRating(n: number): number {
  return Math.max(0, Math.min(5, Math.round(n)));
}

function starPath(cx: number, cy: number, r: number): string {
  const points: string[] = [];
  for (let i = 0; i < 5; i++) {
    const outerAngle = Math.PI / 2 + i * ((2 * Math.PI) / 5);
    const innerAngle = outerAngle + Math.PI / 5;
    const ox = cx - r * Math.cos(outerAngle);
    const oy = cy - r * Math.sin(outerAngle);
    const ix = cx - r * 0.42 * Math.cos(innerAngle);
    const iy = cy - r * 0.42 * Math.sin(innerAngle);
    points.push(`${ox},${oy}`, `${ix},${iy}`);
  }
  return `M${points.join("L")}Z`;
}

/**
 * Five stars, read right-to-left (rightmost filled first) to match RTL
 * reading order. Stars are always gold — never recolored by the merchant
 * brand color, per every approved design.
 */
function starsRow(rightX: number, y: number, spacing: number, r: number, rating: number, gold = "#F2B600", empty = "rgba(0,0,0,0.18)"): string {
  const clamped = clampRating(rating);
  return Array.from({ length: 5 }, (_, i) => {
    const cx = rightX - i * spacing;
    const filled = i < clamped;
    return `<path d="${starPath(cx, y, r)}" fill="${filled ? gold : empty}"/>`;
  }).join("\n");
}

type LogoShape = "circle" | "roundedSquare" | "square";

function logoMark(opts: {
  cx: number;
  cy: number;
  size: number; // full width/height (diameter for circle)
  shape: LogoShape;
  rounding?: number;
  logo: { bytes: Uint8Array; mime: string } | null;
  fallbackLetter: string;
  fallbackBg: string;
  fallbackTextColor: string;
  border?: { color: string; width: number };
}): string {
  const { cx, cy, size, shape, rounding = 12, logo, fallbackLetter, fallbackBg, fallbackTextColor, border } = opts;
  const half = size / 2;
  const x = cx - half;
  const y = cy - half;
  const clipId = `clip-${Math.round(cx)}-${Math.round(cy)}-${Math.round(size)}`;

  const clipShape =
    shape === "circle"
      ? `<circle cx="${cx}" cy="${cy}" r="${half}"/>`
      : `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${shape === "roundedSquare" ? rounding : 0}"/>`;

  const borderShape =
    shape === "circle"
      ? `<circle cx="${cx}" cy="${cy}" r="${half}" fill="none" stroke="${border?.color}" stroke-width="${border?.width}"/>`
      : `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${shape === "roundedSquare" ? rounding : 0}" fill="none" stroke="${border?.color}" stroke-width="${border?.width}"/>`;

  if (logo) {
    return `<clipPath id="${clipId}">${clipShape}</clipPath>
      <image x="${x}" y="${y}" width="${size}" height="${size}" href="data:${logo.mime};base64,${bytesToBase64(logo.bytes)}" clip-path="url(#${clipId})" preserveAspectRatio="xMidYMid slice"/>
      ${border ? borderShape : ""}`;
  }

  const bgShape =
    shape === "circle"
      ? `<circle cx="${cx}" cy="${cy}" r="${half}" fill="${fallbackBg}"/>`
      : `<rect x="${x}" y="${y}" width="${size}" height="${size}" rx="${shape === "roundedSquare" ? rounding : 0}" fill="${fallbackBg}"/>`;

  return `${bgShape}
    ${border ? borderShape : ""}
    <text x="${cx}" y="${cy + size * 0.12}" font-family="Cairo" font-weight="700" font-size="${size * 0.46}" fill="${fallbackTextColor}" text-anchor="middle">${escapeXml(fallbackLetter)}</text>`;
}

// base64 without relying on Deno std import here (templates.ts stays
// framework-agnostic); index.ts already has encodeBase64 but we keep this
// module self-contained for its own inline image embedding.
function bytesToBase64(bytes: Uint8Array): string {
  let binary = "";
  const chunk = 0x8000;
  for (let i = 0; i < bytes.length; i += chunk) {
    binary += String.fromCharCode(...bytes.subarray(i, i + chunk));
  }
  return btoa(binary);
}

interface Ctx extends TemplateInput {
  safeBrandColor: string;
  businessNameEsc: string;
  customerNameEsc: string | null;
  rating: number;
}

function buildCtx(input: TemplateInput): Ctx {
  const safeBrandColor = /^#[0-9a-fA-F]{6}$/.test(input.brandColor) ? input.brandColor : "#087F5B";
  return {
    ...input,
    safeBrandColor,
    businessNameEsc: escapeXml(input.businessName),
    customerNameEsc: input.customerName ? escapeXml(input.customerName) : null,
    rating: clampRating(input.rating),
  };
}

function brandAlpha(hex: string, alphaHex: string): string {
  return `${hex}${alphaHex}`;
}

// --- 1. Neon Editorial ----------------------------------------------------

function renderNeon(ctx: Ctx): string {
  const PAD = 88;
  const left = PAD;
  const right = CANVAS - PAD;
  const width = right - left;

  const headerY = PAD;
  const headerH = 56;
  const footerRowH = 44;
  const footerH = 3 + 28 + footerRowH;
  const gap = 40;
  const quoteTop = headerY + headerH + gap;
  const quoteBottom = CANVAS - PAD - footerH - gap;
  const quoteAvail = quoteBottom - quoteTop;

  const markH = 90;
  const { fontSize, lines, lineHeight } = fitQuote(ctx.font, ctx.reviewText, [58, 52, 46, 41, 37, 33, 29, 26], width, Math.max(0, quoteAvail - markH - 16), 1.3);
  const blockH = markH + 16 + lines.length * lineHeight;
  const blockTop = quoteTop + Math.max(0, (quoteAvail - blockH) / 2);

  const pillText = HEADING_LABEL;
  const pillW = ctx.font.getAdvanceWidth(pillText, 26) + 56;

  const quoteLinesSvg = lines
    .map((line, i) => `<text x="${right}" y="${blockTop + markH + 16 + (i + 1) * lineHeight - lineHeight * 0.28}" font-family="Cairo" font-weight="700" font-size="${fontSize}" fill="#F4F6FB" text-anchor="end" direction="rtl">${escapeXml(line)}</text>`)
    .join("\n");

  const footerTop = CANVAS - PAD - footerH;
  const footerRowTop = footerTop + 3 + 28;
  const footerRowCy = footerRowTop + footerRowH / 2;

  return `
<svg width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="neonGlow1" cx="92%" cy="6%" r="55%">
      <stop offset="0%" stop-color="#22D3EE" stop-opacity="0.30"/>
      <stop offset="100%" stop-color="#22D3EE" stop-opacity="0"/>
    </radialGradient>
    <radialGradient id="neonGlow2" cx="4%" cy="96%" r="55%">
      <stop offset="0%" stop-color="#EC4899" stop-opacity="0.26"/>
      <stop offset="100%" stop-color="#EC4899" stop-opacity="0"/>
    </radialGradient>
  </defs>
  <rect width="${CANVAS}" height="${CANVAS}" fill="#060A14"/>
  <rect width="${CANVAS}" height="${CANVAS}" fill="url(#neonGlow1)"/>
  <rect width="${CANVAS}" height="${CANVAS}" fill="url(#neonGlow2)"/>

  <rect x="${right - pillW}" y="${headerY}" width="${pillW}" height="${headerH}" rx="28" fill="none" stroke="${ctx.safeBrandColor}" stroke-width="2"/>
  <text x="${right - pillW / 2}" y="${headerY + headerH / 2 + 9}" font-family="Cairo" font-weight="700" font-size="26" fill="${ctx.safeBrandColor}" text-anchor="middle">${pillText}</text>

  ${starsRow(left + 4 * 50 + 20, headerY + headerH / 2, 50, 20, ctx.rating, "#FFC83D", "rgba(255,255,255,0.22)")}

  <text x="${right}" y="${blockTop + markH * 0.78}" font-family="Cairo" font-weight="900" font-size="150" fill="${ctx.safeBrandColor}" text-anchor="end" opacity="0.9">&quot;</text>
  ${quoteLinesSvg}

  <rect x="${right - 160}" y="${footerTop}" width="160" height="3" rx="1.5" fill="${ctx.safeBrandColor}"/>

  ${ctx.customerNameEsc ? `<text x="${right}" y="${footerRowCy + 12}" font-family="Cairo" font-weight="700" font-size="36" fill="#FFFFFF" text-anchor="end">${ctx.customerNameEsc}</text>` : ""}

  ${logoMark({
    cx: left + 28,
    cy: footerRowCy,
    size: 56,
    shape: "roundedSquare",
    rounding: 14,
    logo: ctx.logo,
    fallbackLetter: ctx.businessNameEsc.trim().charAt(0),
    fallbackBg: "rgba(255,255,255,0.06)",
    fallbackTextColor: "#FFFFFF",
    border: { color: "rgba(255,255,255,0.28)", width: 1.5 },
  })}
  <text x="${left + 72}" y="${footerRowCy + 8}" font-family="Cairo" font-weight="600" font-size="24" fill="rgba(244,246,251,0.72)" text-anchor="start">${ctx.businessNameEsc}</text>
</svg>`.trim();
}

// --- 2. Luxury Editorial ----------------------------------------------------

function renderLuxury(ctx: Ctx): string {
  const left = 132;
  const right = CANVAS - 132;
  const width = right - left;
  const top = 124;
  const bottom = CANVAS - 116;

  const headerH = 22 + 14 + 22; // heading + gap + divider row
  const footerH = 18 + 32 + 18 + 30 + 14; // rating, customer, bar, gap, logo row (approx)
  const quoteTop = top + headerH + 36;
  const quoteBottom = bottom - footerH - 36;
  const quoteAvail = quoteBottom - quoteTop;

  const { fontSize, lines, lineHeight } = fitQuote(ctx.font, ctx.reviewText, [52, 46, 40, 36, 32, 28], width, quoteAvail, 1.8);
  const blockH = lines.length * lineHeight;
  const blockTop = quoteTop + Math.max(0, (quoteAvail - blockH) / 2) + lineHeight * 0.72;

  const quoteLinesSvg = lines
    .map((line, i) => `<text x="${CANVAS / 2}" y="${blockTop + i * lineHeight}" font-family="Cairo" font-weight="400" font-size="${fontSize}" fill="#F2ECE0" text-anchor="middle" direction="rtl">${escapeXml(line)}</text>`)
    .join("\n");

  const ratingY = quoteBottom + 36 + 18;
  const nameY = ratingY + 44;
  const barY = nameY + 26;
  const footerRowY = barY + 14 + 22;

  return `
<svg width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="luxBg" cx="50%" cy="0%" r="85%">
      <stop offset="0%" stop-color="#2A2A2E"/>
      <stop offset="55%" stop-color="#18181B"/>
      <stop offset="100%" stop-color="#121214"/>
    </radialGradient>
  </defs>
  <rect width="${CANVAS}" height="${CANVAS}" fill="url(#luxBg)"/>
  <rect x="44" y="44" width="${CANVAS - 88}" height="${CANVAS - 88}" fill="none" stroke="rgba(201,169,110,0.5)" stroke-width="1"/>
  <rect x="58" y="58" width="${CANVAS - 116}" height="${CANVAS - 116}" fill="none" stroke="rgba(201,169,110,0.18)" stroke-width="1"/>
  <g fill="#C9A96E">
    <rect x="34" y="34" width="10" height="10" transform="rotate(45 39 39)"/>
    <rect x="${CANVAS - 44}" y="34" width="10" height="10" transform="rotate(45 ${CANVAS - 39} 39)"/>
    <rect x="34" y="${CANVAS - 44}" width="10" height="10" transform="rotate(45 39 ${CANVAS - 39})"/>
    <rect x="${CANVAS - 44}" y="${CANVAS - 44}" width="10" height="10" transform="rotate(45 ${CANVAS - 39} ${CANVAS - 39})"/>
  </g>

  <text x="${CANVAS / 2}" y="${top + 26}" font-family="Cairo" font-weight="500" font-size="26" fill="#C9A96E" text-anchor="middle">${HEADING_LABEL}</text>
  <line x1="${CANVAS / 2 - 100}" y1="${top + 58}" x2="${CANVAS / 2 - 20}" y2="${top + 58}" stroke="#C9A96E" stroke-width="1"/>
  <line x1="${CANVAS / 2 + 20}" y1="${top + 58}" x2="${CANVAS / 2 + 100}" y2="${top + 58}" stroke="#C9A96E" stroke-width="1"/>
  <rect x="${CANVAS / 2 - 5}" y="${top + 53}" width="10" height="10" fill="${ctx.safeBrandColor}" transform="rotate(45 ${CANVAS / 2} ${top + 58})"/>

  ${quoteLinesSvg}

  ${starsRow(CANVAS / 2 + 96, ratingY, 48, 17, ctx.rating, "#D4AF37", "rgba(255,255,255,0.18)")}
  ${ctx.customerNameEsc ? `<text x="${CANVAS / 2}" y="${nameY}" font-family="Cairo" font-weight="600" font-size="34" fill="#F2ECE0" text-anchor="middle">${ctx.customerNameEsc}</text>` : ""}
  <rect x="${CANVAS / 2 - 24}" y="${barY}" width="48" height="3" fill="${ctx.safeBrandColor}"/>

  ${logoMark({
    cx: CANVAS / 2 + 58,
    cy: footerRowY,
    size: 44,
    shape: "circle",
    logo: ctx.logo,
    fallbackLetter: ctx.businessNameEsc.trim().charAt(0),
    fallbackBg: "transparent",
    fallbackTextColor: "#C9A96E",
    border: { color: "rgba(201,169,110,0.6)", width: 1 },
  })}
  <text x="${CANVAS / 2 + 30}" y="${footerRowY + 7}" font-family="Cairo" font-weight="500" font-size="20" fill="rgba(242,236,224,0.6)" text-anchor="end" letter-spacing="2">${ctx.businessNameEsc}</text>
</svg>`.trim();
}

// --- 3. Minimal Modern -------------------------------------------------

function renderMinimal(ctx: Ctx): string {
  const PAD = 88;
  const left = PAD;
  const right = CANVAS - PAD;
  const width = right - left;
  const quoteTop = 260;
  const quoteBottom = CANVAS - 300;
  const quoteAvail = quoteBottom - quoteTop;

  const { fontSize, lines, lineHeight } = fitQuote(ctx.font, ctx.reviewText, [62, 56, 50, 44, 38, 34, 30], width, quoteAvail, 1.5);
  const blockH = lines.length * lineHeight;
  const startY = quoteTop + Math.max(0, (quoteAvail - blockH) / 2) + lineHeight * 0.75;

  const quoteLinesSvg = lines
    .map((line, i) => `<text x="${right}" y="${startY + i * lineHeight}" font-family="Cairo" font-weight="800" font-size="${fontSize}" fill="#111111" text-anchor="end" direction="rtl">${escapeXml(line)}</text>`)
    .join("\n");

  const footerTop = CANVAS - 88 - 1 - 16 - (ctx.customerNameEsc ? 34 + 16 : 0) - 30;

  return `
<svg width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${CANVAS}" height="${CANVAS}" fill="#F5F2EC"/>
  <circle cx="-300" cy="${CANVAS + 300}" r="300" fill="${ctx.safeBrandColor}"/>
  <circle cx="304" cy="${CANVAS - 192}" r="44" fill="none" stroke="#111111" stroke-width="2"/>
  <line x1="${left}" y1="200" x2="${right}" y2="200" stroke="#111111" stroke-width="1"/>

  <rect x="${left}" y="88" width="16" height="16" fill="${ctx.safeBrandColor}"/>
  <text x="${left + 30}" y="104" font-family="Cairo" font-weight="700" font-size="26" fill="#111111" text-anchor="start">${HEADING_LABEL}</text>

  ${logoMark({ cx: right - 22, cy: 110, size: 44, shape: "square", logo: ctx.logo, fallbackLetter: ctx.businessNameEsc.trim().charAt(0), fallbackBg: "#111111", fallbackTextColor: "#F5F2EC" })}
  <text x="${right - 56}" y="116" font-family="Cairo" font-weight="600" font-size="20" fill="#555555" text-anchor="end">${ctx.businessNameEsc}</text>

  ${quoteLinesSvg}

  <line x1="${left}" y1="${footerTop}" x2="${right}" y2="${footerTop}" stroke="#111111" stroke-width="1"/>
  ${ctx.customerNameEsc ? `<text x="${left}" y="${footerTop + 50}" font-family="Cairo" font-weight="800" font-size="34" fill="#111111" text-anchor="start">${ctx.customerNameEsc}</text>` : ""}
  ${starsRow(left + 4 * 44 + (ctx.customerNameEsc ? 0 : 0), footerTop + (ctx.customerNameEsc ? 100 : 40), 44, 17, ctx.rating, "#F2B600")}
</svg>`.trim();
}

// --- 4. Warm Organic ------------------------------------------------------

function renderOrganic(ctx: Ctx): string {
  const cardX = 120;
  const cardY = 140;
  const cardR = CANVAS - 120;
  const cardB = CANVAS - 140;
  const padX = 76;
  const padY = 64;
  const innerLeft = cardX + padX;
  const innerRight = cardR - padX;
  const width = innerRight - innerLeft;

  const headerH = 30;
  const dividerGapTop = 28;
  const footerH = 48;
  const quoteTop = cardY + padY + headerH + 28;
  const quoteBottom = cardB - padY - footerH - dividerGapTop;
  const quoteAvail = quoteBottom - quoteTop;

  const markH = 70;
  const { fontSize, lines, lineHeight } = fitQuote(ctx.font, ctx.reviewText, [50, 45, 40, 36, 32, 28], width, Math.max(0, quoteAvail - markH - 8), 1.8);
  const blockH = markH + 8 + lines.length * lineHeight;
  const blockTop = quoteTop + Math.max(0, (quoteAvail - blockH) / 2);

  const quoteLinesSvg = lines
    .map((line, i) => `<text x="${innerRight}" y="${blockTop + markH + 8 + (i + 1) * lineHeight - lineHeight * 0.3}" font-family="Cairo" font-weight="600" font-size="${fontSize}" fill="#2E2419" text-anchor="end" direction="rtl">${escapeXml(line)}</text>`)
    .join("\n");

  const dividerY = cardB - padY - footerH;
  const footerCy = dividerY + footerH / 2 + 4;

  return `
<svg width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${CANVAS}" height="${CANVAS}" fill="#F1E6D3"/>
  <circle cx="190" cy="90" r="190" fill="rgba(150,110,60,0.08)"/>
  <circle cx="890" cy="990" r="200" fill="rgba(150,110,60,0.09)"/>

  <rect x="${cardX}" y="${cardY}" width="${cardR - cardX}" height="${cardB - cardY}" rx="32" fill="#FBF6EC"/>

  <circle cx="${innerLeft + 6}" cy="${cardY + padY + 12}" r="6" fill="${ctx.safeBrandColor}"/>
  <text x="${innerLeft + 24}" y="${cardY + padY + 18}" font-family="Cairo" font-weight="600" font-size="25" fill="#6E5A43" text-anchor="start">${HEADING_LABEL}</text>
  ${starsRow(innerRight, cardY + padY + 15, 40, 17, ctx.rating, "#E0A82E")}

  <text x="${innerRight}" y="${blockTop + markH * 0.78}" font-family="Cairo" font-weight="800" font-size="110" fill="${ctx.safeBrandColor}" text-anchor="end">&quot;</text>
  ${quoteLinesSvg}

  <line x1="${innerLeft}" y1="${dividerY}" x2="${innerRight}" y2="${dividerY}" stroke="#E4D7C1" stroke-width="1"/>
  ${ctx.customerNameEsc ? `<text x="${innerLeft}" y="${footerCy + 8}" font-family="Cairo" font-weight="700" font-size="32" fill="#2E2419" text-anchor="start">${ctx.customerNameEsc}</text>` : ""}

  ${logoMark({ cx: innerRight - 24, cy: footerCy, size: 48, shape: "circle", logo: ctx.logo, fallbackLetter: ctx.businessNameEsc.trim().charAt(0), fallbackBg: ctx.safeBrandColor, fallbackTextColor: "#FBF6EC" })}
  <text x="${innerRight - 60}" y="${footerCy + 7}" font-family="Cairo" font-weight="600" font-size="21" fill="#8A7760" text-anchor="end">${ctx.businessNameEsc}</text>
</svg>`.trim();
}

// --- 5. Bold Contemporary ------------------------------------------------

function renderBold(ctx: Ctx): string {
  const left = 88;
  const right = CANVAS - 88;
  const width = right - left;
  const quoteTop = 400;
  const quoteBottom = CANVAS - 250;
  const quoteAvail = quoteBottom - quoteTop;

  const { fontSize, lines, lineHeight } = fitQuote(ctx.font, ctx.reviewText, [56, 50, 44, 38, 34, 30], width, quoteAvail, 1.55);
  const blockH = lines.length * lineHeight;
  const startY = quoteTop + Math.max(0, (quoteAvail - blockH) / 2) + lineHeight * 0.75;

  const quoteLinesSvg = lines
    .map((line, i) => `<text x="${right}" y="${startY + i * lineHeight}" font-family="Cairo" font-weight="800" font-size="${fontSize}" fill="#FFFFFF" text-anchor="end" direction="rtl">${escapeXml(line)}</text>`)
    .join("\n");

  return `
<svg width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${CANVAS}" height="${CANVAS}" fill="#111111"/>

  <rect x="0" y="0" width="620" height="330" fill="${ctx.safeBrandColor}"/>
  <text x="${right}" y="152" font-family="Cairo" font-weight="900" font-size="44" fill="#FFFFFF" text-anchor="end">${HEADING_LABEL}</text>
  <rect x="${right - 214}" y="184" width="214" height="48" fill="#111111"/>
  ${starsRow(right - 24, 208, 40, 16, ctx.rating, "#FFC83D", "rgba(255,255,255,0.22)")}

  <circle cx="88" cy="173" r="85" fill="none" stroke="rgba(255,255,255,0.22)" stroke-width="2" transform="translate(0,0)"/>
  <rect x="194" y="194" width="32" height="32" fill="#E8E4DC"/>

  ${quoteLinesSvg}

  <rect x="${right - 64}" y="${CANVAS - 96 - 14 - 44 - 6}" width="64" height="6" fill="${ctx.safeBrandColor}"/>
  ${ctx.customerNameEsc ? `<text x="${right}" y="${CANVAS - 96 - 14}" font-family="Cairo" font-weight="800" font-size="36" fill="#FFFFFF" text-anchor="end">${ctx.customerNameEsc}</text>` : ""}

  <rect x="0" y="${CANVAS - 170}" width="400" height="170" fill="#E8E4DC"/>
  ${logoMark({ cx: 88 + 30, cy: CANVAS - 85, size: 60, shape: "square", logo: ctx.logo, fallbackLetter: ctx.businessNameEsc.trim().charAt(0), fallbackBg: "#111111", fallbackTextColor: "#E8E4DC" })}
  <text x="312" y="${CANVAS - 76}" font-family="Cairo" font-weight="800" font-size="${fitSingleLine(ctx.font, ctx.businessNameEsc, 148, [26, 22, 18, 15, 13])}" fill="#111111" text-anchor="end">${ctx.businessNameEsc}</text>
</svg>`.trim();
}

// --- 6. Magazine Editorial ------------------------------------------------

function renderMagazine(ctx: Ctx): string {
  const cardLeft = 120;
  const cardRight = CANVAS - 120;
  const cardTop = 236;
  const cardBottom = CANVAS - 112;
  const padX = 72;
  const padY = 56;
  const innerLeft = cardLeft + padX;
  const innerRight = cardRight - padX;
  const width = innerRight - innerLeft;

  const markH = 110;
  const footerH = 24 + 32;
  const quoteTop = cardTop + padY + markH;
  const quoteBottom = cardBottom - padY - footerH;
  const quoteAvail = quoteBottom - quoteTop;

  const { fontSize, lines, lineHeight } = fitQuote(ctx.font, ctx.reviewText, [52, 46, 40, 36, 32, 28], width, quoteAvail, 1.65);
  const blockH = lines.length * lineHeight;
  const startY = quoteTop + Math.max(0, (quoteAvail - blockH) / 2) + lineHeight * 0.75;

  const quoteLinesSvg = lines
    .map((line, i) => `<text x="${innerRight}" y="${startY + i * lineHeight}" font-family="Cairo" font-weight="700" font-size="${fontSize}" fill="#1A1A1A" text-anchor="end" direction="rtl">${escapeXml(line)}</text>`)
    .join("\n");

  const footerY = cardBottom - padY;

  return `
<svg width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${CANVAS}" height="${CANVAS}" fill="#E5DFD5"/>

  <rect x="88" y="80" width="${CANVAS - 176}" height="3" fill="#1A1A1A"/>
  <text x="${CANVAS - 88}" y="128" font-family="Cairo" font-weight="900" font-size="32" fill="#1A1A1A" text-anchor="end">${HEADING_LABEL}</text>
  ${logoMark({ cx: 88 + 20, cy: 114, size: 40, shape: "square", logo: ctx.logo, fallbackLetter: ctx.businessNameEsc.trim().charAt(0), fallbackBg: "transparent", fallbackTextColor: "#1A1A1A", border: { color: "#1A1A1A", width: 2 } })}
  <text x="${88 + 48}" y="120" font-family="Cairo" font-weight="700" font-size="20" fill="#1A1A1A" text-anchor="start" letter-spacing="1">${ctx.businessNameEsc}</text>
  <rect x="88" y="142" width="${CANVAS - 176}" height="1" fill="#1A1A1A"/>

  <rect x="${150}" y="${250}" width="800" height="720" fill="${ctx.safeBrandColor}" transform="rotate(-4 ${150 + 400} ${250 + 360})"/>
  <rect x="${112}" y="${240}" width="830" height="730" fill="#D3CBBE" transform="rotate(2 ${112 + 415} ${240 + 365})"/>
  <rect x="${cardLeft}" y="${cardTop}" width="${cardRight - cardLeft}" height="${cardBottom - cardTop}" fill="#FFFDF8"/>

  <text x="${innerRight}" y="${cardTop + padY + markH * 0.78}" font-family="Cairo" font-weight="900" font-size="150" fill="${ctx.safeBrandColor}" text-anchor="end">&quot;</text>
  ${quoteLinesSvg}

  <line x1="${innerLeft}" y1="${footerY - 24}" x2="${innerRight}" y2="${footerY - 24}" stroke="#1A1A1A" stroke-width="1"/>
  ${ctx.customerNameEsc ? `<text x="${innerLeft}" y="${footerY}" font-family="Cairo" font-weight="800" font-size="32" fill="#1A1A1A" text-anchor="start">${ctx.customerNameEsc}</text>` : ""}
  ${starsRow(innerRight, footerY - 11, 40, 17, ctx.rating, "#E8A800")}
</svg>`.trim();
}

// --- 7. Soft Premium -------------------------------------------------------

function renderSoft(ctx: Ctx): string {
  const cardLeft = 96;
  const cardRight = CANVAS - 96;
  const cardTop = 96;
  const cardBottom = CANVAS - 96;
  const padX = 80;
  const padY = 72;
  const innerLeft = cardLeft + padX;
  const innerRight = cardRight - padX;
  const width = innerRight - innerLeft;

  const headerH = 56;
  const footerH = 72;
  const gap = 32;
  const quoteTop = cardTop + padY + headerH + gap;
  const quoteBottom = cardBottom - padY - footerH - gap;
  const quoteAvail = quoteBottom - quoteTop;

  const { fontSize, lines, lineHeight } = fitQuote(ctx.font, ctx.reviewText, [50, 44, 40, 36, 32, 28], width, quoteAvail, 1.8);
  const blockH = lines.length * lineHeight;
  const startY = quoteTop + Math.max(0, (quoteAvail - blockH) / 2) + lineHeight * 0.75;

  const quoteLinesSvg = lines
    .map((line, i) => `<text x="${innerRight}" y="${startY + i * lineHeight}" font-family="Cairo" font-weight="500" font-size="${fontSize}" fill="#2A2420" text-anchor="end" direction="rtl">${escapeXml(line)}</text>`)
    .join("\n");

  const headerCy = cardTop + padY + headerH / 2;
  const footerTop = cardBottom - padY - footerH;
  const footerCy = footerTop + footerH / 2;
  const avatarLetter = ctx.customerNameEsc ? ctx.customerNameEsc.trim().charAt(0) : "م";
  const pillText = HEADING_LABEL;
  const pillW = ctx.font.getAdvanceWidth(pillText, 24) + 70;

  return `
<svg width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <defs>
    <radialGradient id="softOrb" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="${brandAlpha(ctx.safeBrandColor, "40")}"/>
      <stop offset="70%" stop-color="${brandAlpha(ctx.safeBrandColor, "00")}"/>
    </radialGradient>
  </defs>
  <rect width="${CANVAS}" height="${CANVAS}" fill="#ECE6DF"/>
  <circle cx="${CANVAS - 180}" cy="130" r="350" fill="url(#softOrb)"/>
  <circle cx="-20" cy="${CANVAS + 100}" r="380" fill="rgba(255,255,255,0.55)"/>

  <rect x="${cardLeft}" y="${cardTop}" width="${cardRight - cardLeft}" height="${cardBottom - cardTop}" rx="56" fill="#FAF7F3"/>

  <rect x="${innerLeft}" y="${headerCy - 24}" width="${pillW}" height="48" rx="24" fill="${brandAlpha(ctx.safeBrandColor, "1F")}"/>
  <circle cx="${innerLeft + 26}" cy="${headerCy}" r="5" fill="${ctx.safeBrandColor}"/>
  <text x="${innerLeft + 42}" y="${headerCy + 8}" font-family="Cairo" font-weight="600" font-size="24" fill="#3A332C" text-anchor="start">${pillText}</text>
  ${starsRow(innerRight, headerCy, 38, 16, ctx.rating, "#E5AE2E")}

  ${quoteLinesSvg}

  <rect x="${innerLeft}" y="${footerTop}" width="${innerRight - innerLeft}" height="${footerH}" rx="32" fill="#F2EDE7"/>
  ${logoMark({ cx: innerLeft + 36 + 18, cy: footerCy, size: 72, shape: "circle", logo: ctx.logo, fallbackLetter: avatarLetter, fallbackBg: ctx.safeBrandColor, fallbackTextColor: "#FFFFFF" })}
  ${ctx.customerNameEsc ? `<text x="${innerLeft + 36 + 54}" y="${footerCy + 11}" font-family="Cairo" font-weight="700" font-size="32" fill="#2A2420" text-anchor="start">${ctx.customerNameEsc}</text>` : ""}

  ${logoMark({ cx: innerRight - 24, cy: footerCy, size: 48, shape: "roundedSquare", rounding: 16, logo: ctx.logo, fallbackLetter: ctx.businessNameEsc.trim().charAt(0), fallbackBg: "#FFFFFF", fallbackTextColor: "#3A332C" })}
  <text x="${innerRight - 60}" y="${footerCy + 7}" font-family="Cairo" font-weight="600" font-size="20" fill="#7A6F66" text-anchor="end">${ctx.businessNameEsc}</text>
</svg>`.trim();
}

// --- 8. Brutalist Modern ---------------------------------------------------

function renderBrutalist(ctx: Ctx): string {
  const outer = 56;
  const borderW = 5;
  const frameLeft = outer;
  const frameRight = CANVAS - outer;
  const frameTop = outer;
  const frameBottom = CANVAS - outer;

  const headerH = 210;
  const footerH = 160;
  const accentW = 300;
  const midTop = frameTop + headerH;
  const midBottom = frameBottom - footerH;
  const padX = 56;
  const innerLeft = frameLeft + padX;
  const innerRight = frameRight - padX;
  const width = innerRight - innerLeft;
  const markH = 90;
  const quoteAvail = midBottom - midTop - 96;

  const { fontSize, lines, lineHeight } = fitQuote(ctx.font, ctx.reviewText, [60, 54, 48, 42, 36, 32], width, Math.max(0, quoteAvail - markH), 1.45);
  const blockH = markH + lines.length * lineHeight;
  const blockTop = midTop + 48 + Math.max(0, (midBottom - 48 - (midTop + 48) - blockH) / 2);

  const quoteLinesSvg = lines
    .map((line, i) => `<text x="${innerRight}" y="${blockTop + markH + (i + 1) * lineHeight - lineHeight * 0.3}" font-family="Cairo" font-weight="900" font-size="${fontSize}" fill="#0A0A0A" text-anchor="end" direction="rtl">${escapeXml(line)}</text>`)
    .join("\n");

  const footerCy = midBottom + footerH / 2;

  return `
<svg width="${CANVAS}" height="${CANVAS}" viewBox="0 0 ${CANVAS} ${CANVAS}" xmlns="http://www.w3.org/2000/svg">
  <rect width="${CANVAS}" height="${CANVAS}" fill="#F0F0EE"/>
  <rect x="${frameLeft}" y="${frameTop}" width="${frameRight - frameLeft}" height="${frameBottom - frameTop}" fill="none" stroke="#0A0A0A" stroke-width="${borderW}"/>

  <rect x="${frameLeft}" y="${frameTop}" width="${frameRight - frameLeft - accentW}" height="${headerH}" fill="#0A0A0A"/>
  <text x="${frameRight - accentW - 56}" y="${frameTop + headerH / 2 + 18}" font-family="Cairo" font-weight="900" font-size="50" fill="#F0F0EE" text-anchor="end">${HEADING_LABEL}</text>

  <rect x="${frameRight - accentW}" y="${frameTop}" width="${accentW}" height="${headerH}" fill="${ctx.safeBrandColor}"/>
  ${logoMark({ cx: frameRight - accentW + 40 + 36, cy: frameTop + 70, size: 72, shape: "square", logo: ctx.logo, fallbackLetter: ctx.businessNameEsc.trim().charAt(0), fallbackBg: "#F0F0EE", fallbackTextColor: "#0A0A0A", border: { color: "#0A0A0A", width: 5 } })}
  <text x="${frameRight - 40}" y="${frameTop + 70 + 56}" font-family="Cairo" font-weight="800" font-size="${fitSingleLine(ctx.font, ctx.businessNameEsc, accentW - 80, [22, 19, 16, 14, 12])}" fill="#0A0A0A" text-anchor="end">${ctx.businessNameEsc}</text>

  <rect x="${frameLeft}" y="${midTop}" width="${frameRight - frameLeft}" height="${midBottom - midTop}" fill="none" stroke="#0A0A0A" stroke-width="${borderW}"/>
  <rect x="${innerLeft}" y="${blockTop - 58}" width="64" height="64" fill="none" stroke="#0A0A0A" stroke-width="5" transform="rotate(45 ${innerLeft + 32} ${blockTop - 26})"/>
  <text x="${innerRight}" y="${blockTop + markH * 0.78}" font-family="Cairo" font-weight="900" font-size="150" fill="#0A0A0A" text-anchor="end">&quot;</text>
  ${quoteLinesSvg}

  <rect x="${frameLeft}" y="${midBottom}" width="${frameRight - frameLeft - accentW}" height="${footerH}" fill="none" stroke="#0A0A0A" stroke-width="${borderW}"/>
  <rect x="${innerLeft}" y="${footerCy - 12}" width="24" height="24" fill="${ctx.safeBrandColor}" stroke="#0A0A0A" stroke-width="4"/>
  ${ctx.customerNameEsc ? `<text x="${innerLeft + 44}" y="${footerCy + 13}" font-family="Cairo" font-weight="800" font-size="38" fill="#0A0A0A" text-anchor="start">${ctx.customerNameEsc}</text>` : ""}

  <rect x="${frameRight - accentW}" y="${midBottom}" width="${accentW}" height="${footerH}" fill="#0A0A0A"/>
  ${starsRow(frameRight - accentW / 2 + 80, footerCy, 40, 18, ctx.rating, "#FFC21A", "rgba(255,255,255,0.22)")}
</svg>`.trim();
}

// --- registry --------------------------------------------------------------

const RENDERERS: Record<TemplateId, (ctx: Ctx) => string> = {
  neon: renderNeon,
  luxury: renderLuxury,
  minimal: renderMinimal,
  organic: renderOrganic,
  bold: renderBold,
  magazine: renderMagazine,
  soft: renderSoft,
  brutalist: renderBrutalist,
};

export function renderTemplate(id: TemplateId, input: TemplateInput): string {
  const ctx = buildCtx(input);
  const renderer = RENDERERS[id] ?? RENDERERS[DEFAULT_TEMPLATE_ID];
  return renderer(ctx);
}
