import { AlertTriangle, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

/**
 * The generated testimonial creative — a visually independent system from
 * the Taqyeem application UI (DESIGN.md §7). It is never styled with the
 * app's warm/emerald palette; its visual direction comes from the supplied
 * reference image, adapted to the current merchant/customer/review.
 *
 * Phase 13: `generatedImageUrl`, when present, is the FINAL composed image
 * — background + exact customer text + real logo + rating already baked
 * in server-side (CLAUDE.md §6.3/§11). This component must NOT overlay its
 * own text/logo/stars on top of it (that would duplicate what's already in
 * the image); it just displays the image as-is, full bleed.
 * When `generatedImageUrl` is absent (mock/preview data, e.g.
 * TestimonialPreviewPage), it falls back to rendering a CSS backdrop with
 * its own live text/logo/stars overlay, so isolated previews still work
 * without a real generated image.
 */

export interface GeneratedTestimonialMerchant {
  businessName: string
  brandColor: string
  logoInitial?: string
}

export interface GeneratedTestimonialData {
  merchant: GeneratedTestimonialMerchant
  customerName?: string
  rating: number
  /** Exact original customer review text. Rendered verbatim — never altered. */
  reviewText: string
  /** Future AI-generated background image (Phase 10). Absent today. */
  generatedImageUrl?: string
}

export type GeneratedTestimonialStatus = 'processing' | 'ready' | 'failed'

export interface GeneratedTestimonialCardProps {
  status: GeneratedTestimonialStatus
  data?: GeneratedTestimonialData
  onRetry?: () => void
  className?: string
}

function GeneratedTestimonialCard({
  status,
  data,
  onRetry,
  className,
}: GeneratedTestimonialCardProps) {
  return (
    <div
      className={cn(
        'relative aspect-square w-full max-w-[520px] overflow-hidden',
        className,
      )}
    >
      {status === 'processing' && <ProcessingState />}
      {status === 'failed' && <FailedState onRetry={onRetry} />}
      {status === 'ready' && data && <ReadyState data={data} />}
    </div>
  )
}

function ProcessingState() {
  return (
    <div className="flex h-full w-full animate-pulse flex-col justify-between bg-[#101114] p-[7%]">
      <div className="h-4 w-1/3 rounded-full bg-white/10" />
      <div className="flex flex-col gap-3">
        <div className="h-5 w-full rounded-full bg-white/10" />
        <div className="h-5 w-5/6 rounded-full bg-white/10" />
        <div className="h-5 w-2/3 rounded-full bg-white/10" />
      </div>
      <p className="text-center text-sm text-white/40">
        جاري إنشاء تصميم التقييم...
      </p>
    </div>
  )
}

function FailedState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-4 bg-[#101114] p-[7%] text-center">
      <AlertTriangle className="size-10 text-danger" strokeWidth={1.5} />
      <p className="text-white/70">تعذر إنشاء صورة التقييم.</p>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry}>
          إعادة المحاولة
        </Button>
      )}
    </div>
  )
}

function ReadyState({ data }: { data: GeneratedTestimonialData }) {
  const { merchant, customerName, rating, reviewText, generatedImageUrl } = data

  // The final composed image already has the quote/name/stars/logo baked
  // in server-side — show it as-is, full bleed, with no overlay on top.
  if (generatedImageUrl) {
    return (
      <div className="relative h-full w-full bg-[#101114]">
        <img src={generatedImageUrl} alt="" className="h-full w-full object-cover" />
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col justify-between bg-[#101114] p-[7%]">
      {/* No real generated image yet (preview/mock data only) — CSS stand-in. */}
      <div className="absolute inset-0">
        <TestimonialBackdrop accentColor={merchant.brandColor} />
      </div>

      {/* Content layer — always rendered on top, deterministic and exact. */}
      <div className="relative flex h-full flex-col justify-between">
        {/* Merchant identity — lowest visual priority, small and quiet. */}
        <div className="flex items-center gap-2">
          <div
            className="flex size-8 items-center justify-center rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: merchant.brandColor }}
            aria-hidden
          >
            {merchant.logoInitial ?? merchant.businessName.trim().charAt(0)}
          </div>
          <span className="text-sm font-medium text-white/60">
            {merchant.businessName}
          </span>
        </div>

        {/* Quote — the hero. */}
        <div className="flex flex-1 flex-col justify-center gap-6 py-[6%]">
          <span
            className="self-end text-7xl font-black leading-none opacity-90"
            style={{ color: merchant.brandColor }}
            aria-hidden
          >
            "
          </span>

          <p className="text-right text-2xl font-bold leading-snug text-white sm:text-3xl">
            {reviewText}
          </p>

          <div className="flex flex-col items-end gap-3">
            {customerName && (
              <span
                className="text-lg font-bold"
                style={{ color: merchant.brandColor }}
              >
                {customerName}
              </span>
            )}
            <div className="flex flex-row-reverse gap-1">
              {Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
                <Star
                  key={star}
                  className="size-6"
                  style={{
                    color:
                      star <= rating ? merchant.brandColor : 'rgba(255,255,255,0.2)',
                    fill: star <= rating ? merchant.brandColor : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestimonialBackdrop({ accentColor }: { accentColor: string }) {
  return (
    <div className="absolute inset-0">
      <div
        className="absolute inset-0 opacity-[0.06]"
        style={{
          backgroundImage:
            'linear-gradient(to right, white 1px, transparent 1px), linear-gradient(to bottom, white 1px, transparent 1px)',
          backgroundSize: '32px 32px',
        }}
        aria-hidden
      />
      <div
        className="absolute -top-1/4 -right-1/4 size-2/3 rounded-full blur-3xl"
        style={{ backgroundColor: accentColor, opacity: 0.28 }}
        aria-hidden
      />
      <div
        className="absolute -bottom-1/4 -left-1/4 size-2/3 rounded-full blur-3xl"
        style={{ backgroundColor: accentColor, opacity: 0.18 }}
        aria-hidden
      />
    </div>
  )
}

export { GeneratedTestimonialCard }
