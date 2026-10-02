import { AlertTriangle, RefreshCw, ShieldCheck, Star } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

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
  /** Composed final image URL when available. */
  generatedImageUrl?: string
}

export type GeneratedTestimonialStatus = 'processing' | 'ready' | 'failed'

export interface GeneratedTestimonialCardProps {
  status: GeneratedTestimonialStatus
  data?: GeneratedTestimonialData
  onRetry?: () => void
  className?: string
}

function getReviewTextStyle(text: string) {
  const len = text.trim().length
  if (len < 55) {
    return 'text-base sm:text-lg md:text-xl font-bold leading-relaxed'
  }
  if (len < 110) {
    return 'text-sm sm:text-base md:text-lg font-bold leading-snug'
  }
  if (len < 170) {
    return 'text-xs sm:text-sm md:text-base font-semibold leading-relaxed'
  }
  if (len < 240) {
    return 'text-[11px] sm:text-xs md:text-sm font-medium leading-relaxed'
  }
  return 'text-[10px] sm:text-[11px] md:text-xs font-medium leading-normal'
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
        'group relative aspect-square w-full max-w-[520px] overflow-hidden rounded-2xl border border-border/80 bg-slate-950 shadow-md transition-all duration-300 hover:shadow-xl hover:border-border',
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
    <div className="flex h-full w-full animate-pulse flex-col justify-between bg-slate-950 p-5 sm:p-6 md:p-7">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="size-7 rounded-xl bg-white/10" />
          <div className="h-4 w-24 rounded-full bg-white/10" />
        </div>
        <div className="size-6 rounded-lg bg-white/5" />
      </div>

      <div className="flex flex-col gap-2.5 my-auto">
        <div className="h-4 w-full rounded-full bg-white/10" />
        <div className="h-4 w-5/6 rounded-full bg-white/10" />
        <div className="h-4 w-4/6 rounded-full bg-white/10" />
        <div className="h-4 w-2/3 rounded-full bg-white/10" />
      </div>

      <div className="flex flex-col gap-2 pt-2.5 border-t border-white/5">
        <div className="flex items-center justify-between">
          <div className="h-3.5 w-20 rounded-full bg-white/10" />
          <div className="h-3.5 w-16 rounded-full bg-white/10" />
        </div>
        <div className="flex items-center justify-between pt-0.5">
          <div className="h-2.5 w-14 rounded-full bg-white/5" />
          <div className="h-2.5 w-16 rounded-full bg-white/5" />
        </div>
      </div>
    </div>
  )
}

function FailedState({ onRetry }: { onRetry?: () => void }) {
  return (
    <div className="flex h-full w-full flex-col items-center justify-center gap-3.5 bg-slate-950 p-5 sm:p-6 text-center">
      <div className="flex size-12 items-center justify-center rounded-2xl bg-danger/10 text-danger border border-danger/20">
        <AlertTriangle className="size-6" />
      </div>
      <div className="flex flex-col gap-1">
        <p className="text-sm font-bold text-white">تعذر إنشاء صورة التقييم</p>
        <p className="text-xs text-white/50">حدث خطأ أثناء معالجة الصورة</p>
      </div>
      {onRetry && (
        <Button variant="secondary" size="sm" onClick={onRetry} className="gap-1.5 mt-1">
          <RefreshCw className="size-3.5" />
          إعادة المحاولة
        </Button>
      )}
    </div>
  )
}

function ReadyState({ data }: { data: GeneratedTestimonialData }) {
  const { merchant, customerName, rating, reviewText, generatedImageUrl } = data

  if (generatedImageUrl) {
    return (
      <div className="relative h-full w-full bg-slate-950">
        <img
          src={generatedImageUrl}
          alt={customerName ? `تقييم من ${customerName}` : 'تقييم العميل'}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
          loading="lazy"
        />
      </div>
    )
  }

  return (
    <div className="relative flex h-full w-full flex-col justify-between bg-slate-950 p-5 sm:p-6 md:p-7 text-white select-none">
      {/* Dynamic Background Glow */}
      <div className="absolute inset-0">
        <TestimonialBackdrop accentColor={merchant.brandColor} />
      </div>

      {/* Content Layer */}
      <div className="relative z-10 flex h-full flex-col justify-between min-h-0">
        {/* Merchant Branding Header + Stylized Quote Icon */}
        <div className="flex items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <div
              className="flex size-7 sm:size-8 shrink-0 items-center justify-center rounded-xl text-xs font-bold text-white shadow-sm ring-1 ring-white/20"
              style={{ backgroundColor: merchant.brandColor }}
              aria-hidden
            >
              {(merchant.logoInitial ?? merchant.businessName.trim().charAt(0)) || 'ت'}
            </div>
            <span className="text-xs sm:text-sm font-bold text-white/90 truncate">
              {merchant.businessName}
            </span>
          </div>

          <div
            className="flex size-7 items-center justify-center rounded-lg bg-white/5 text-sm sm:text-base font-serif font-black opacity-90 shrink-0"
            style={{ color: merchant.brandColor }}
            aria-hidden
          >
            “
          </div>
        </div>

        {/* Customer Review Quote Hero - Guaranteed Non-clipping */}
        <div className="my-auto flex flex-col justify-center py-2.5 min-h-0 overflow-hidden">
          <p
            className={cn(
              'text-start font-sans text-white/95 leading-relaxed tracking-normal',
              getReviewTextStyle(reviewText),
            )}
          >
            {reviewText}
          </p>
        </div>

        {/* Customer Info + Rating Stars + Footer */}
        <div className="flex flex-col gap-2 pt-2.5 border-t border-white/10 shrink-0">
          <div className="flex items-center justify-between gap-2">
            {customerName ? (
              <div className="flex items-center gap-1.5 min-w-0">
                <span
                  className="size-1.5 shrink-0 rounded-full"
                  style={{ backgroundColor: merchant.brandColor }}
                />
                <span className="text-xs sm:text-sm font-bold text-white/90 truncate">
                  {customerName}
                </span>
              </div>
            ) : (
              <span className="text-[11px] sm:text-xs text-white/50 font-medium">
                عميل معتمد
              </span>
            )}

            <div className="flex items-center gap-0.5 sm:gap-1 shrink-0">
              {Array.from({ length: 5 }, (_, index) => index + 1).map((star) => (
                <Star
                  key={star}
                  className="size-3.5 sm:size-4"
                  style={{
                    color: star <= rating ? '#F59E0B' : 'rgba(255,255,255,0.2)',
                    fill: star <= rating ? '#F59E0B' : 'transparent',
                  }}
                />
              ))}
            </div>
          </div>

          {/* Subtle Trust & Watermark */}
          <div className="flex items-center justify-between text-[9px] sm:text-[10px] text-white/40 pt-0.5">
            <span className="flex items-center gap-1">
              <ShieldCheck className="size-3 text-emerald-400" />
              <span>تقييم موثق</span>
            </span>
            <span className="font-mono text-[9px] text-white/30 tracking-wider">
              Taqyeem · تقييم
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

function TestimonialBackdrop({ accentColor }: { accentColor: string }) {
  return (
    <div
      className="absolute inset-0 overflow-hidden"
      style={{
        background: `
          radial-gradient(ellipse 95% 75% at 85% 0%, ${accentColor}55 0%, ${accentColor}25 35%, transparent 75%),
          radial-gradient(circle 500px at 15% 95%, rgba(13, 148, 136, 0.18) 0%, transparent 70%),
          linear-gradient(180deg, #051513 0%, #030d0c 55%, #020707 100%)
        `,
      }}
    >
      <div
        className="absolute inset-0 opacity-[0.05]"
        style={{
          backgroundImage:
            'radial-gradient(circle at 1px 1px, white 1px, transparent 0)',
          backgroundSize: '24px 24px',
        }}
        aria-hidden
      />
      <div
        className="absolute -top-1/4 -right-1/4 size-3/4 rounded-full blur-3xl"
        style={{ backgroundColor: accentColor, opacity: 0.45 }}
        aria-hidden
      />
    </div>
  )
}

export { GeneratedTestimonialCard }

