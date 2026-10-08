import * as React from 'react'
import { useParams } from 'react-router-dom'
import { CheckCircle2, Copy, ExternalLink, Gift, Loader2, Sparkles } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { BrandLogo } from '@/components/ui/brand-logo'
import { FullPageSpinner } from '@/components/auth/RequireAuth'
import { StarRating } from '@/components/ui/star-rating'
import { Textarea } from '@/components/ui/textarea'
import { getPublicMerchantBySlug, type PublicMerchant } from '@/lib/public-merchant'
import { submitReview, type ReviewSubmissionResult } from '@/lib/review-submission'
import { useLanguage } from '@/lib/language-context'

function DiscountCodeCard({
  brandColor,
  title,
  desc,
  code,
  percentOff,
  expiresAt,
}: {
  brandColor: string
  title: string
  desc: string
  code: string
  percentOff: number
  expiresAt: string
}) {
  const { t, isRTL } = useLanguage()
  const [copied, setCopied] = React.useState(false)

  async function handleCopy() {
    try {
      await navigator.clipboard.writeText(code)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      // Clipboard access can fail silently (permissions/insecure context) —
      // the code is still visible on screen either way.
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-background-subtle/60 p-4 text-right" dir={isRTL ? 'rtl' : 'ltr'}>
      <div className="flex items-center gap-2">
        <Gift className="size-4" style={{ color: brandColor }} />
        <span className="text-sm font-extrabold text-ink">{title}</span>
      </div>
      <p className="text-xs text-ink-muted leading-relaxed">{desc.replace('{percent}', String(percentOff))}</p>
      <div className="flex items-center gap-2">
        <code
          className="flex-1 rounded-xl border-2 border-dashed px-3 py-2 text-center font-mono text-sm font-extrabold tracking-wider"
          style={{ borderColor: brandColor, color: brandColor }}
        >
          {code}
        </code>
        <Button type="button" size="icon" variant="outline" onClick={handleCopy} aria-label={t('review_discount_code_copy')}>
          {copied ? <CheckCircle2 className="size-4 text-emerald" /> : <Copy className="size-4" />}
        </Button>
      </div>
      <span className="text-[11px] font-semibold text-ink-subtle">
        {t('review_discount_expires', { date: new Date(expiresAt).toLocaleDateString(isRTL ? 'ar-EG' : 'en-US') })}
      </span>
    </div>
  )
}

type SubmitStatus = 'idle' | 'submitting' | 'success' | 'error'
type MerchantLookupState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'found'; merchant: PublicMerchant }

const QUICK_TAGS_AR = ['خدمة سريعة ⚡️', 'جودة ممتازة ✨', 'تغليف راقي 📦', 'طاقم محترم 🤝', 'سعر مناسب 💰']
const QUICK_TAGS_EN = ['Fast Service ⚡️', 'Top Quality ✨', 'Great Packaging 📦', 'Friendly Staff 🤝', 'Great Value 💰']

function CustomerReviewPage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, isRTL } = useLanguage()
  const [lookup, setLookup] = React.useState<MerchantLookupState>({ status: 'loading' })

  React.useEffect(() => {
    let cancelled = false
    setLookup({ status: 'loading' })

    if (!slug) {
      setLookup({ status: 'not-found' })
      return
    }

    getPublicMerchantBySlug(slug)
      .then((merchant) => {
        if (cancelled) return
        setLookup(merchant ? { status: 'found', merchant } : { status: 'not-found' })
      })
      .catch((error) => {
        console.error('Failed to load merchant by slug', error)
        if (!cancelled) setLookup({ status: 'not-found' })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  const [rating, setRating] = React.useState(5)
  const [reviewText, setReviewText] = React.useState('')
  const [customerName, setCustomerName] = React.useState('')
  const [orderNumber, setOrderNumber] = React.useState('')
  const [status, setStatus] = React.useState<SubmitStatus>('idle')
  const [attemptedSubmit, setAttemptedSubmit] = React.useState(false)
  const [result, setResult] = React.useState<ReviewSubmissionResult | null>(null)

  const isLowRating = rating > 0 && rating <= 3

  const quickTags = isRTL ? QUICK_TAGS_AR : QUICK_TAGS_EN

  function handleTagClick(tag: string) {
    const cleanTag = tag.replace(/ [^\s]+$/, '')
    setReviewText((prev) => (prev ? `${prev}، ${cleanTag}` : cleanTag))
  }

  if (lookup.status === 'loading') {
    return <FullPageSpinner />
  }

  if (lookup.status === 'not-found') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4 text-center">
        <Card className="max-w-sm p-6">
          <p className="text-sm font-semibold text-ink-muted">{t('review_merchant_not_found')}</p>
        </Card>
      </main>
    )
  }

  const merchant = lookup.merchant
  const ratingMissing = attemptedSubmit && rating === 0
  const textMissing = attemptedSubmit && reviewText.trim().length === 0

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault()

    if (rating === 0 || reviewText.trim().length === 0) {
      setAttemptedSubmit(true)
      return
    }

    setStatus('submitting')
    try {
      const submissionResult = await submitReview({
        merchantId: merchant.id,
        rating,
        reviewText,
        customerName,
        orderNumber: isLowRating ? orderNumber : undefined,
      })
      setResult(submissionResult)
      setStatus('success')
    } catch {
      setStatus('error')
    }
  }

  if (status === 'success') {
    const isLowRatingResult = result ? !result.isPublished : isLowRating

    return (
      <main className="relative flex min-h-dvh items-center justify-center bg-background px-4 py-8 overflow-hidden">
        {/* Animated Brand Ambience */}
        <AnimatedBackground
          variant="brand"
          brandColor={merchant.brand_color}
          showDots
          showParticles
        />

        <Card className="w-full max-w-md border-border bg-surface/95 backdrop-blur-xl p-8 text-center shadow-2xl animate-scale-in relative z-10">
          <div className="flex flex-col items-center gap-5">
            <div
              className="relative flex size-20 items-center justify-center rounded-3xl text-white shadow-lg animate-float-gentle"
              style={{ backgroundColor: merchant.brand_color }}
            >
              <CheckCircle2 className="size-10 stroke-[2.2]" />
              <div
                className="absolute inset-0 rounded-3xl blur-xl opacity-40 -z-10"
                style={{ backgroundColor: merchant.brand_color }}
              />
            </div>

            <div className="flex flex-col gap-2">
              <h1 className="text-2xl font-extrabold text-ink tracking-tight">
                {isLowRatingResult ? t('review_low_rating_success_title') : t('review_success_title')}
              </h1>
              <p className="text-sm text-ink-muted leading-relaxed">
                {t(
                  isLowRatingResult ? 'review_low_rating_success_desc' : 'review_high_rating_success_desc',
                  { business: merchant.business_name },
                )}
              </p>
            </div>

            {result?.repeatCode && (
              <DiscountCodeCard
                brandColor={merchant.brand_color}
                title={t('review_discount_repeat_title')}
                desc={t('review_discount_repeat_desc')}
                code={result.repeatCode.code}
                percentOff={result.repeatCode.percentOff}
                expiresAt={result.repeatCode.expiresAt}
              />
            )}

            {result?.shareCode && (
              <div className="flex w-full flex-col gap-3">
                <DiscountCodeCard
                  brandColor={merchant.brand_color}
                  title={t('review_discount_share_title')}
                  desc={t('review_discount_share_desc')}
                  code={result.shareCode.code}
                  percentOff={result.shareCode.percentOff}
                  expiresAt={result.shareCode.expiresAt}
                />
                <div className="flex flex-wrap items-center justify-center gap-2">
                  {result.googleReviewUrl && (
                    <a href={result.googleReviewUrl} target="_blank" rel="noopener noreferrer">
                      <Button type="button" size="sm" variant="outline" className="gap-1.5">
                        <ExternalLink className="size-3.5" />
                        {t('review_discount_share_google_btn')}
                      </Button>
                    </a>
                  )}
                  {result.facebookReviewUrl && (
                    <a href={result.facebookReviewUrl} target="_blank" rel="noopener noreferrer">
                      <Button type="button" size="sm" variant="outline" className="gap-1.5">
                        <ExternalLink className="size-3.5" />
                        {t('review_discount_share_facebook_btn')}
                      </Button>
                    </a>
                  )}
                </div>
              </div>
            )}

            <div className="mt-2 inline-flex items-center gap-1.5 text-xs font-bold text-ink-subtle">
              <Sparkles className="size-3.5 text-emerald" />
              <span>{t('wall_powered_by')}</span>
            </div>
          </div>
        </Card>
      </main>
    )
  }

  const isSubmitting = status === 'submitting'

  return (
    <main className="relative flex min-h-dvh flex-col justify-between bg-background selection:bg-emerald/20 overflow-x-hidden pt-safe pb-safe">
      {/* Dynamic Animated Brand Background */}
      <AnimatedBackground
        variant="brand"
        brandColor={merchant.brand_color}
        showDots
        showParticles
      />

      {/* Top Header */}
      <header className="flex items-center justify-between px-4 py-3 border-b border-border/60 bg-surface/85 backdrop-blur-md sticky top-0 z-20">
        <BrandLogo size="xs" />
        <div className="flex items-center gap-2">
          <ThemeToggle variant="minimal" />
          <LanguageToggle variant="minimal" />
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-lg flex-1 flex-col justify-center px-3 sm:px-6 py-4 sm:py-8 z-10">
        <Card className="overflow-hidden border border-border/90 bg-surface/95 shadow-2xl backdrop-blur-xl animate-scale-in rounded-3xl">
          {/* Card Top Brand Header */}
          <div
            className="relative flex flex-col items-center gap-3 p-6 sm:p-8 text-center border-b border-border/60"
            style={{
              background: `linear-gradient(to bottom, ${merchant.brand_color}15, transparent)`,
            }}
          >
            {merchant.logo_url ? (
              <img
                src={merchant.logo_url}
                alt={merchant.business_name}
                className="size-20 rounded-3xl object-cover border-2 border-white shadow-md"
              />
            ) : (
              <div
                className="flex size-20 items-center justify-center rounded-3xl text-3xl font-extrabold text-white shadow-md"
                style={{ backgroundColor: merchant.brand_color }}
                aria-hidden
              >
                {merchant.business_name.trim().charAt(0) || 'ت'}
              </div>
            )}

            <div className="flex flex-col gap-1">
              <h1 className="text-xl font-extrabold text-ink tracking-tight">
                {merchant.business_name}
              </h1>
              <p className="text-sm font-bold text-emerald-deep">
                {t('review_prompt_title')}
              </p>
            </div>
          </div>

          <CardContent className="p-6 sm:p-8">
            <form onSubmit={handleSubmit} className="flex flex-col gap-6">
              {/* Star Rating Block */}
              <div className="flex flex-col items-center gap-3 rounded-2xl border border-border/80 bg-background-subtle/60 p-5 shadow-xs">
                <Label className="text-xs font-extrabold text-ink-muted">
                  {t('review_rating_label')}
                </Label>
                <StarRating
                  value={rating}
                  onChange={setRating}
                  disabled={isSubmitting}
                  accentColor={merchant.brand_color}
                  size="xl"
                  showLabel
                />
                {ratingMissing && (
                  <p className="text-xs font-bold text-danger animate-fade-in">
                    {t('review_rating_required')}
                  </p>
                )}
              </div>

              {/* Quick Praise Tags */}
              <div className="flex flex-col gap-2">
                <span className="text-xs font-bold text-ink-muted">
                  {isRTL ? 'إشارات سريعة للتعبير عن رأيك:' : 'Quick tags:'}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {quickTags.map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => handleTagClick(tag)}
                      disabled={isSubmitting}
                      className="rounded-full border border-border bg-background-subtle/80 px-3 py-1 text-xs font-bold text-ink shadow-xs transition-all hover:border-emerald-border hover:bg-emerald-surface hover:text-emerald-deep active:scale-95 cursor-pointer"
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>

              {/* Review Textarea */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="reviewText" className="text-xs font-bold text-ink">
                    {t('review_text_label')} <span className="text-danger">*</span>
                  </Label>
                  <span className="text-[11px] font-mono text-ink-subtle">
                    {reviewText.length} {isRTL ? 'حرف' : 'chars'}
                  </span>
                </div>
                <Textarea
                  id="reviewText"
                  value={reviewText}
                  onChange={(event) => setReviewText(event.target.value)}
                  disabled={isSubmitting}
                  placeholder={t('review_text_placeholder')}
                  rows={4}
                  hasError={textMissing}
                />
                {textMissing && (
                  <p className="text-xs font-bold text-danger animate-fade-in">
                    {t('review_text_required')}
                  </p>
                )}
                {isLowRating && (
                  <p className="text-xs font-bold text-danger/90 animate-fade-in">
                    {t('review_low_rating_hint')}
                  </p>
                )}
              </div>

              {/* Order Number — only surfaced for low ratings, routed straight
                  to the merchant alert (Feature 1), never posted publicly. */}
              {isLowRating && (
                <div className="flex flex-col gap-2 animate-fade-in">
                  <Label htmlFor="orderNumber" className="text-xs font-bold text-ink">
                    {t('review_order_number_label')}
                  </Label>
                  <Input
                    id="orderNumber"
                    value={orderNumber}
                    onChange={(event) => setOrderNumber(event.target.value)}
                    disabled={isSubmitting}
                    placeholder={t('review_order_number_placeholder')}
                  />
                </div>
              )}

              {/* Customer Name */}
              <div className="flex flex-col gap-2">
                <Label htmlFor="customerName" className="text-xs font-bold text-ink">
                  {t('review_name_label')}
                </Label>
                <Input
                  id="customerName"
                  value={customerName}
                  onChange={(event) => setCustomerName(event.target.value)}
                  disabled={isSubmitting}
                  placeholder={t('review_name_placeholder')}
                />
              </div>

              {status === 'error' && (
                <div className="rounded-xl border border-danger-border bg-danger-surface p-3 text-xs font-bold text-danger animate-fade-in">
                  {t('review_error_msg')}
                </div>
              )}

              {/* Submit Button */}
              <Button
                type="submit"
                size="xl"
                disabled={isSubmitting}
                style={{ backgroundColor: merchant.brand_color }}
                className="w-full text-white font-extrabold shadow-lg hover:brightness-105 active:scale-[0.98] button-specular"
              >
                {isSubmitting && <Loader2 className="animate-spin" />}
                {isSubmitting ? t('review_submitting_btn') : t('review_submit_btn')}
              </Button>
            </form>
          </CardContent>
        </Card>

        <p className="text-center text-xs text-ink-subtle mt-6 font-semibold">
          {t('wall_powered_by')}
        </p>
      </div>
    </main>
  )
}

export default CustomerReviewPage
