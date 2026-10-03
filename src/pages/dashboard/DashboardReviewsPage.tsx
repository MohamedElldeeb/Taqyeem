import * as React from 'react'
import {
  Check,
  Copy,
  Heart,
  MessageCircle,
  MessageSquareText,
  Palette,
  RefreshCw,
  Share2,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from 'lucide-react'
import { Link } from 'react-router-dom'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { StarRating } from '@/components/ui/star-rating'
import { GeneratedTestimonialCard } from '@/components/testimonial/GeneratedTestimonialCard'
import { useMerchant } from '@/hooks/useMerchant'
import { useMerchantReviews, type MerchantReview, type ReviewDbStatus } from '@/hooks/useMerchantReviews'
import { toCardStatus } from '@/lib/generated-content-status'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/components/ui/toast'
import { TEMPLATE_LABELS, DEFAULT_TEMPLATE_ID, type TemplateId } from '@/lib/testimonial-templates'

type FilterTab = 'all' | 'completed' | 'processing' | 'failed'

function DashboardReviewsPage() {
  const { merchant } = useMerchant()
  const { reviews, loading, error, refetch } = useMerchantReviews(merchant?.id)
  const { t, isRTL, formatDate } = useLanguage()
  const [activeTab, setActiveTab] = React.useState<FilterTab>('all')

  const filteredReviews = React.useMemo(() => {
    if (activeTab === 'all') return reviews
    return reviews.filter((r) => r.status === activeTab)
  }, [reviews, activeTab])

  const statusLabels: Record<ReviewDbStatus, string> = {
    submitted: t('status_submitted'),
    processing: t('status_processing'),
    completed: t('status_completed'),
    failed: t('status_failed'),
  }

  const statusVariants: Record<ReviewDbStatus, 'default' | 'secondary' | 'destructive'> = {
    submitted: 'secondary',
    processing: 'secondary',
    completed: 'default',
    failed: 'destructive',
  }

  const readyCount = reviews.filter((r) => r.status === 'completed').length
  const processingCount = reviews.filter(
    (r) => r.status === 'processing' || r.status === 'submitted',
  ).length
  const failedCount = reviews.filter((r) => r.status === 'failed').length

  const avgRating =
    reviews.length > 0
      ? (reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length).toFixed(1)
      : '—'

  const filterTabs: { id: FilterTab; label: string; count: number; show: boolean }[] = [
    { id: 'all', label: t('dash_reviews_filter_all'), count: reviews.length, show: true },
    { id: 'completed', label: t('dash_reviews_filter_ready'), count: readyCount, show: true },
    { id: 'processing', label: t('dash_reviews_filter_processing'), count: processingCount, show: processingCount > 0 },
    { id: 'failed', label: t('dash_reviews_filter_failed'), count: failedCount, show: failedCount > 0 },
  ]

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* Page Header */}
      <header className="flex flex-col gap-2">
        <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-border bg-emerald-surface px-3 py-1 text-xs font-bold text-emerald-deep w-fit shadow-2xs">
          <MessageSquareText className="size-3.5" />
          <span>{isRTL ? 'إدارة التقييمات · Reviews Feed' : 'Reviews & Customer Feedback'}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
          {t('dash_reviews_title')}
        </h1>
        <p className="text-sm text-ink-muted">{t('dash_reviews_subtitle')}</p>
      </header>

      {/* Active Designer Template Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md p-3.5 sm:p-4 shadow-2xs">
        <div className="flex items-center gap-3">
          <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-2xs">
            <Palette className="size-4.5" />
          </div>
          <div className="flex flex-col text-start">
            <span className="text-xs sm:text-sm font-bold text-ink">
              {isRTL
                ? `قالب التصميم المطبق: ${TEMPLATE_LABELS[(merchant?.default_template_id as TemplateId) || DEFAULT_TEMPLATE_ID]}`
                : `Active Card Template: ${TEMPLATE_LABELS[(merchant?.default_template_id as TemplateId) || DEFAULT_TEMPLATE_ID]}`}
            </span>
            <span className="text-[11px] text-ink-muted">
              {isRTL
                ? 'يتم إنشاء صور التقييمات تلقائياً بالقالب المختار مع ألوان وشعار متجرك.'
                : 'All incoming reviews are automatically rendered with your selected designer template.'}
            </span>
          </div>
        </div>

        <Button asChild size="sm" variant="outline" className="text-xs font-bold gap-1.5 shadow-2xs shrink-0">
          <Link to="/dashboard/branding">
            <Palette className="size-3.5 text-emerald" />
            <span>{isRTL ? 'تغيير القالب (8 قوالب)' : 'Change Template (8)'}</span>
          </Link>
        </Button>
      </div>

      {/* Stats Strip */}
      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface/80 backdrop-blur-sm px-4 py-3.5 shadow-xs transition-all hover:shadow-sm hover:border-border">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-surface text-emerald shadow-2xs">
              <MessageSquareText className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-ink-subtle truncate">{isRTL ? 'إجمالي التقييمات' : 'Total Reviews'}</span>
              <span className="text-xl font-extrabold text-ink leading-tight">{reviews.length}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface/80 backdrop-blur-sm px-4 py-3.5 shadow-xs transition-all hover:shadow-sm hover:border-border">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-surface text-emerald shadow-2xs">
              <Zap className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-ink-subtle truncate">{isRTL ? 'بطاقات جاهزة' : 'Cards Ready'}</span>
              <span className="text-xl font-extrabold text-ink leading-tight">{readyCount}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface/80 backdrop-blur-sm px-4 py-3.5 shadow-xs transition-all hover:shadow-sm hover:border-border">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 shadow-2xs">
              <Star className="size-4 fill-amber-400 stroke-amber-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-ink-subtle truncate">{isRTL ? 'متوسط التقييم' : 'Avg. Rating'}</span>
              <span className="text-xl font-extrabold text-ink leading-tight">{avgRating}</span>
            </div>
          </div>
          <div className="flex items-center gap-3 rounded-2xl border border-border/70 bg-surface/80 backdrop-blur-sm px-4 py-3.5 shadow-xs transition-all hover:shadow-sm hover:border-border">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 shadow-2xs">
              <TrendingUp className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-ink-subtle truncate">{isRTL ? 'قيد المعالجة' : 'Processing'}</span>
              <span className="text-xl font-extrabold text-ink leading-tight">{processingCount}</span>
            </div>
          </div>
        </div>
      )}

      {/* Filter Tabs */}
      {!loading && reviews.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 border-b border-border/60 pb-4">
          {filterTabs
            .filter((tab) => tab.show)
            .map((tab) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 rounded-full px-4 py-1.5 text-xs font-bold transition-all duration-200 cursor-pointer ${
                  activeTab === tab.id
                    ? 'bg-emerald text-white shadow-md shadow-emerald/25 scale-[1.02]'
                    : 'bg-surface border border-border text-ink-muted hover:text-ink hover:bg-muted-surface active:scale-95'
                }`}
              >
                <span>{tab.label}</span>
                <span className={`inline-flex items-center justify-center rounded-full min-w-[18px] px-1.5 text-[10px] font-extrabold ${
                  activeTab === tab.id ? 'bg-white/20 text-white' : 'bg-muted-surface text-ink-subtle'
                }`}>
                  {tab.count}
                </span>
              </button>
            ))}
        </div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="flex flex-col gap-4">
          <Skeleton className="h-52 w-full rounded-2xl" />
          <Skeleton className="h-52 w-full rounded-2xl" />
          <Skeleton className="h-52 w-full rounded-2xl" />
        </div>
      )}

      {/* Error State */}
      {!loading && error && (
        <Card className="border-danger-border bg-danger-surface/50 shadow-xs">
          <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
            <p className="text-sm font-bold text-danger">{t('dash_reviews_load_error')}</p>
            <Button variant="secondary" size="sm" onClick={refetch} className="gap-1.5 transition-all active:scale-95">
              <RefreshCw className="size-3.5" />
              <span>{t('action_retry')}</span>
            </Button>
          </CardContent>
        </Card>
      )}

      {/* Empty State - no reviews at all */}
      {!loading && !error && reviews.length === 0 && (
        <EmptyState
          icon={Heart}
          title={t('dash_empty_reviews_title')}
          description={t('dash_empty_reviews_desc')}
          actionLabel={t('dash_qr_card_title')}
          actionHref="/dashboard/qr"
        />
      )}

      {/* Empty filter result */}
      {!loading && !error && reviews.length > 0 && filteredReviews.length === 0 && (
        <div className="flex flex-col items-center gap-3 py-16 text-center">
          <div className="flex size-14 items-center justify-center rounded-2xl bg-muted-surface text-ink-subtle">
            <MessageSquareText className="size-6" />
          </div>
          <p className="text-sm font-semibold text-ink-muted">
            {isRTL ? 'لا توجد تقييمات في هذا التصنيف' : 'No reviews in this category'}
          </p>
        </div>
      )}

      {/* Reviews List */}
      {!loading && !error && filteredReviews.length > 0 && (
        <div className="flex flex-col gap-4">
          {filteredReviews.map((review) => (
            <ReviewRow
              key={review.id}
              review={review}
              businessName={merchant?.business_name ?? ''}
              brandColor={merchant?.brand_color ?? '#059669'}
              statusLabel={statusLabels[review.status]}
              statusVariant={statusVariants[review.status]}
              formatDate={formatDate}
              anonymousLabel={t('dash_anonymous_customer')}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function ReviewRow({
  review,
  businessName,
  brandColor,
  statusLabel,
  statusVariant,
  formatDate,
  anonymousLabel,
}: {
  review: MerchantReview
  businessName: string
  brandColor: string
  statusLabel: string
  statusVariant: 'default' | 'secondary' | 'destructive'
  formatDate: (iso: string) => string
  anonymousLabel: string
}) {
  const { isRTL } = useLanguage()
  const { showToast } = useToast()
  const [copied, setCopied] = React.useState(false)

  const cardStatus = review.generated_content
    ? toCardStatus(review.generated_content.status)
    : 'processing'

  async function handleCopy() {
    const quoteText = isRTL
      ? `«${review.original_text}»\n— ${review.customer_name ?? anonymousLabel} (${review.rating}/5 نجوم)\n${businessName}`
      : `“${review.original_text}”\n— ${review.customer_name ?? anonymousLabel} (${review.rating}/5 stars)\n${businessName}`
    await navigator.clipboard.writeText(quoteText)
    setCopied(true)
    showToast(isRTL ? 'تم نسخ التقييم' : 'Review copied', isRTL ? 'تم نسخ نص التقييم للحافظة' : 'Review text copied to clipboard', 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleShare() {
    const quoteText = isRTL
      ? `«${review.original_text}»\n— ${review.customer_name ?? anonymousLabel} (${review.rating}/5 نجوم)`
      : `“${review.original_text}”\n— ${review.customer_name ?? anonymousLabel} (${review.rating}/5 stars)`

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: isRTL ? `تقييم ${businessName}` : `${businessName} Review`,
          text: quoteText,
        })
      } catch {
        // ignore
      }
    } else {
      handleCopy()
    }
  }

  const whatsappUrl = `https://wa.me/?text=${encodeURIComponent(
    isRTL
      ? `«${review.original_text}»\n— تقييم العميل المميز: ${review.customer_name ?? anonymousLabel} ⭐ (${review.rating}/5)\nلمتجر: ${businessName}`
      : `“${review.original_text}”\n— Review from ${review.customer_name ?? anonymousLabel} ⭐ (${review.rating}/5)\nStore: ${businessName}`,
  )}`

  const initials = review.customer_name?.trim().charAt(0)?.toUpperCase() || 'ع'

  return (
    <div className="group/card relative rounded-2xl border border-border/80 bg-surface/85 backdrop-blur-sm shadow-xs transition-all duration-300 hover:shadow-md hover:border-border hover:bg-surface overflow-hidden">
      {/* Subtle top accent */}
      <div
        className="absolute inset-x-0 top-0 h-0.5 opacity-0 group-hover/card:opacity-100 transition-opacity duration-300"
        style={{ background: `linear-gradient(to right, transparent, ${brandColor}66, transparent)` }}
      />
      <div className="flex flex-col gap-5 p-5 sm:flex-row sm:items-start sm:gap-6">
        {/* Review text & metadata */}
        <div className="flex flex-1 flex-col gap-4 min-w-0">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div
                className="flex size-10 shrink-0 items-center justify-center rounded-xl font-extrabold text-white text-sm shadow-xs"
                style={{ backgroundColor: brandColor }}
              >
                {initials}
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-ink text-sm leading-tight">{review.customer_name ?? anonymousLabel}</span>
                <span className="text-[11px] text-ink-subtle mt-0.5">{formatDate(review.created_at)}</span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <StarRating value={review.rating} onChange={() => {}} disabled size="sm" />
              <Badge variant={statusVariant} dot>{statusLabel}</Badge>
            </div>
          </div>

          <blockquote className="relative text-sm text-ink-muted leading-relaxed whitespace-pre-wrap bg-background-subtle/60 rounded-xl border border-border/50 p-4 italic">
            <span className="not-italic text-emerald-deep font-black text-lg leading-none me-1 align-top">"</span>
            {review.original_text}
            <span className="not-italic text-emerald-deep font-black text-lg leading-none ms-1 align-bottom">"</span>
          </blockquote>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] font-bold text-ink-subtle flex items-center gap-1.5">
              <Share2 className="size-3 text-emerald" />
              {isRTL ? 'مشاركة:' : 'Share:'}
            </span>
            <div className="flex flex-wrap items-center gap-1.5">
              <Button asChild size="xs" variant="outline" className="h-7.5 px-2.5 text-[11px] font-bold gap-1.5 text-emerald-deep hover:bg-emerald-surface hover:text-emerald hover:border-emerald-border/80 transition-all shadow-2xs">
                <a href={whatsappUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                  <span>{isRTL ? 'واتساب' : 'WhatsApp'}</span>
                </a>
              </Button>
              <Button type="button" size="xs" variant="outline" onClick={handleCopy} className="h-7.5 px-2.5 text-[11px] font-bold gap-1.5 text-ink-muted hover:text-ink hover:bg-muted-surface hover:border-border transition-all shadow-2xs">
                {copied ? <Check className="size-3.5 text-emerald" /> : <Copy className="size-3.5" />}
                <span>{copied ? (isRTL ? 'تم النسخ!' : 'Copied!') : (isRTL ? 'نسخ النص' : 'Copy')}</span>
              </Button>
              <Button type="button" size="xs" variant="outline" onClick={handleShare} className="h-7.5 px-2.5 text-[11px] font-bold gap-1.5 text-ink-muted hover:text-ink hover:bg-muted-surface hover:border-border transition-all shadow-2xs">
                <Share2 className="size-3.5 text-indigo-500" />
                <span>{isRTL ? 'مشاركة' : 'Share'}</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Generated Creative Preview */}
        <div className="w-full sm:w-[200px] shrink-0 flex flex-col gap-1.5">
          <div className="flex items-center justify-between px-0.5 text-[10px] font-bold">
            <span className="inline-flex items-center gap-1 text-emerald-deep bg-emerald-surface px-2 py-0.5 rounded-md border border-emerald-border/60">
              <Sparkles className="size-2.5" />
              <span>{isRTL ? 'قالب التصميم' : 'Template'}</span>
            </span>
            <span className="text-ink-subtle font-mono">4K UHD</span>
          </div>

          <GeneratedTestimonialCard
            className="w-full rounded-2xl shadow-xs"
            status={cardStatus}
            data={
              cardStatus === 'ready' && review.generated_content?.image_url
                ? {
                    merchant: { businessName, brandColor },
                    customerName: review.customer_name ?? undefined,
                    rating: review.rating,
                    reviewText: review.original_text,
                    generatedImageUrl: review.generated_content.image_url,
                  }
                : undefined
            }
          />
        </div>
      </div>
    </div>
  )
}

export default DashboardReviewsPage

