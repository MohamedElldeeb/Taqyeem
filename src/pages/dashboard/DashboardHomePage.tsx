import * as React from 'react'
import { Link } from 'react-router-dom'
import {
  ArrowLeft,
  ArrowRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  ExternalLink,
  Heart,
  Image as ImageIcon,
  MessageCircle,
  MessageSquareText,
  Palette,
  QrCode,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  TrendingUp,
  BrainCircuit,
} from 'lucide-react'

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { StatCard } from '@/components/ui/stat-card'
import { StarRating } from '@/components/ui/star-rating'
import { EmptyState } from '@/components/ui/empty-state'
import { useMerchant } from '@/hooks/useMerchant'
import { useMerchantReviews, type ReviewDbStatus } from '@/hooks/useMerchantReviews'
import { useLatestWeeklyInsight } from '@/hooks/useLatestWeeklyInsight'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/components/ui/toast'
import { TEMPLATE_IDS, TEMPLATE_LABELS, TEMPLATE_LABELS_EN, DEFAULT_TEMPLATE_ID, type TemplateId } from '@/lib/testimonial-templates'
import { LiveTemplatePreview } from '@/components/testimonial/LiveTemplatePreview'
import { Pagination } from '@/components/ui/pagination'

function DashboardHomePage() {
  const { merchant } = useMerchant()
  const { reviews, loading } = useMerchantReviews(merchant?.id)
  const { insight: weeklyInsight } = useLatestWeeklyInsight(merchant?.id)
  const { t, isRTL, formatDate } = useLanguage()
  const { showToast } = useToast()
  const [copied, setCopied] = React.useState(false)
  const [copiedReviewId, setCopiedReviewId] = React.useState<string | null>(null)
  const [recentPage, setRecentPage] = React.useState(1)
  const recentPageSize = 4
  const templateScrollRef = React.useRef<HTMLDivElement>(null)

  const scrollTemplates = (direction: 'left' | 'right') => {
    if (!templateScrollRef.current) return
    const offset = direction === 'left' ? -340 : 340
    templateScrollRef.current.scrollBy({ left: offset, behavior: 'smooth' })
  }

  const reviewLink = `${window.location.origin}/r/${merchant?.slug ?? ''}`

  const readyCount = reviews.filter((r) => r.generated_content?.status === 'completed').length
  const totalRecentPages = Math.max(1, Math.ceil(reviews.length / recentPageSize))

  const paginatedRecentReviews = React.useMemo(() => {
    const start = (recentPage - 1) * recentPageSize
    return reviews.slice(start, start + recentPageSize)
  }, [reviews, recentPage, recentPageSize])

  const totalReviews = reviews.length
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '5.0'

  const positivePercent = totalReviews > 0
    ? Math.round((reviews.filter((r) => r.rating >= 4).length / totalReviews) * 100)
    : 100

  // Calculate Star Distribution (5 to 1)
  const starCounts = React.useMemo(() => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 }
    reviews.forEach((r) => {
      const star = Math.min(5, Math.max(1, Math.round(r.rating))) as 1 | 2 | 3 | 4 | 5
      counts[star] = (counts[star] || 0) + 1
    })
    return counts
  }, [reviews])

  async function handleCopy() {
    await navigator.clipboard.writeText(reviewLink)
    setCopied(true)
    showToast(t('action_copied'), reviewLink, 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  async function handleCopyReview(review: (typeof reviews)[0]) {
    const quoteText = isRTL
      ? `«${review.original_text}»\n— ${review.customer_name ?? 'عميل موثق'} (${review.rating}/5 نجوم)\n${merchant?.business_name ?? ''}\n${window.location.origin}/w/${merchant?.slug ?? ''}`
      : `“${review.original_text}”\n— ${review.customer_name ?? 'Verified Customer'} (${review.rating}/5 stars)\n${merchant?.business_name ?? ''}\n${window.location.origin}/w/${merchant?.slug ?? ''}`
    await navigator.clipboard.writeText(quoteText)
    setCopiedReviewId(review.id)
    showToast(isRTL ? 'تم نسخ التقييم بنجاح' : 'Review copied!', isRTL ? 'تم نسخ نص التقييم ورابط المتجر للحافظة' : 'Review text & store link copied to clipboard', 'success')
    setTimeout(() => setCopiedReviewId(null), 2000)
  }

  async function handleNativeShare(review: (typeof reviews)[0]) {
    const quoteText = isRTL
      ? `«${review.original_text}»\n— ${review.customer_name ?? 'عميل مميز'} (${review.rating}/5 نجوم)`
      : `“${review.original_text}”\n— ${review.customer_name ?? 'Verified Customer'} (${review.rating}/5 stars)`
    const shareUrl = `${window.location.origin}/w/${merchant?.slug ?? ''}`

    if (typeof navigator.share === 'function') {
      try {
        await navigator.share({
          title: isRTL ? `تقييم ${merchant?.business_name ?? ''}` : `${merchant?.business_name ?? ''} Review`,
          text: quoteText,
          url: shareUrl,
        })
      } catch {
        // User cancelled share
      }
    } else {
      handleCopyReview(review)
    }
  }

  function getReviewWhatsAppUrl(review: (typeof reviews)[0]) {
    const quoteText = isRTL
      ? `«${review.original_text}»\n— تقييم العميل: ${review.customer_name ?? 'عميلنا المميز'} ⭐ (${review.rating}/5)\nلمتجر: ${merchant?.business_name ?? ''}\nرابط الحائط العام: ${window.location.origin}/w/${merchant?.slug ?? ''}`
      : `“${review.original_text}”\n— Customer Review: ${review.customer_name ?? 'Verified Customer'} ⭐ (${review.rating}/5)\nStore: ${merchant?.business_name ?? ''}\nPublic Wall: ${window.location.origin}/w/${merchant?.slug ?? ''}`
    return `https://wa.me/?text=${encodeURIComponent(quoteText)}`
  }

  const whatsappMessage = isRTL
    ? `أهلاً بك! رأيك يهمنا جداً ويساعدنا دائماً في تقديم الأفضل. نسعد بمشاركتك تقييمك السريع عبر الرابط: ${reviewLink}`
    : `Hi! Your feedback means the world to us. Please take a quick moment to share your review here: ${reviewLink}`

  const whatsappShareUrl = `https://wa.me/?text=${encodeURIComponent(whatsappMessage)}`

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

  return (
    <div className="flex flex-col gap-6 animate-fade-in">
      {/* 1. Hero Welcome Header Row */}
      <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
        <div className="flex flex-col gap-1.5">
          <div className="inline-flex items-center gap-2 rounded-full border border-emerald-border bg-emerald-surface px-3 py-1 text-xs font-bold text-emerald-deep w-fit shadow-2xs backdrop-blur-md">
            <span className="size-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>{isRTL ? 'لوحة تحكم المتجر · نشط وتفاعلي' : 'Live Store Dashboard · Active'}</span>
          </div>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight flex items-center gap-2">
            <span>{isRTL ? `أهلاً بك، ${merchant?.business_name || ''}` : `Welcome back, ${merchant?.business_name || ''}`}</span>
            <span className="inline-block origin-bottom-right animate-pulse">👋</span>
          </h1>

          <p className="text-xs sm:text-sm text-ink-muted leading-relaxed">
            {t('dash_home_subtitle')}
          </p>
        </div>

        {/* Header Action Buttons */}
        <div className="flex flex-wrap items-center gap-2.5 shrink-0">
          <Button
            onClick={handleCopy}
            variant="secondary"
            size="sm"
            className="gap-1.5 text-xs font-bold shadow-2xs h-9.5 transition-all active:scale-95"
          >
            {copied ? <Check className="size-4 text-emerald" /> : <Copy className="size-4" />}
            <span>{copied ? t('action_copied') : (isRTL ? 'نسخ الرابط' : 'Copy Link')}</span>
          </Button>

          <Button asChild size="sm" variant="outline" className="gap-1.5 text-xs font-bold shadow-2xs h-9.5 transition-all active:scale-95">
            <Link to="/dashboard/qr">
              <QrCode className="size-4 text-emerald" />
              <span>{t('nav_qr')}</span>
            </Link>
          </Button>

          <Button asChild size="sm" variant="primaryGlow" className="gap-1.5 text-xs font-bold shadow-md h-9.5 transition-all active:scale-95">
            <a href={`/w/${merchant?.slug}`} target="_blank" rel="noreferrer">
              <span>{t('action_view_public')}</span>
              <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </div>
      </header>

      {/* 2. Top Metric Bento Grid (4 Cards) */}
      <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
        <StatCard
          title={t('dash_stat_total_reviews')}
          value={loading ? '—' : reviews.length}
          icon={MessageSquareText}
          iconColor="emerald"
          loading={loading}
          trend={reviews.length > 0 ? (isRTL ? '١٠٠% حقيقي موثق' : '100% Verified') : undefined}
        />
        <StatCard
          title={t('dash_stat_ready_creatives')}
          value={loading ? '—' : readyCount}
          icon={ImageIcon}
          iconColor="indigo"
          loading={loading}
          trend={readyCount > 0 ? (isRTL ? 'جاهز للمشاركة' : 'Ready to Share') : undefined}
        />
        <StatCard
          title={t('dash_stat_avg_rating')}
          value={loading ? '—' : `${avgRating} / 5.0`}
          icon={Star}
          iconColor="amber"
          loading={loading}
          description={isRTL ? 'من ٥ نجوم' : 'Out of 5.0'}
        />
        <StatCard
          title={t('dash_stat_happy_customers')}
          value={loading ? '—' : `${positivePercent}%`}
          icon={TrendingUp}
          iconColor="purple"
          loading={loading}
          trend={isRTL ? 'نسبة إيجابية' : 'Positive Ratio'}
        />
      </div>

      {/* 2.5 Weekly AI Insights Card — shown only once the first digest exists */}
      {weeklyInsight && (
        <Card className="border-indigo-border/60 bg-gradient-to-br from-indigo-50/60 via-surface to-surface dark:from-indigo-950/20 dark:via-surface dark:to-surface shadow-xs">
          <CardHeader className="pb-2">
            <div className="flex items-center gap-3">
              <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-indigo-100 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-500/30">
                <BrainCircuit className="size-5" />
              </div>
              <div className="flex flex-col">
                <CardTitle className="text-sm font-extrabold text-ink">
                  {isRTL ? 'ملخصك الأسبوعي الذكي' : 'Your Weekly AI Insight'}
                </CardTitle>
                <CardDescription className="text-[11px]">
                  {isRTL
                    ? `بناءً على ${weeklyInsight.review_count} تقييم من ${formatDate(weeklyInsight.week_start)} إلى ${formatDate(weeklyInsight.week_end)}`
                    : `Based on ${weeklyInsight.review_count} reviews, ${formatDate(weeklyInsight.week_start)} – ${formatDate(weeklyInsight.week_end)}`}
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-1">
            <div className="rounded-xl border border-indigo-border/50 bg-surface/80 p-4 text-sm text-ink-muted leading-relaxed whitespace-pre-line">
              {weeklyInsight.content}
            </div>
            <p className="mt-2 text-[10px] text-ink-subtle">
              {isRTL
                ? 'ملخص مُولّد بالذكاء الاصطناعي من تقييمات عملائك الحقيقية — اجتهاد تحليلي وليس حقيقة مطلقة.'
                : 'AI-generated from your real customer reviews — an analytical read, not an absolute fact.'}
            </p>
          </CardContent>
        </Card>
      )}

      {/* 3. Middle Bento Grid (Share Hub 7-cols + Rating Analytics 5-cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-stretch">
        {/* Bento Tile 1: Share Hub & Quick Invite (7 cols) */}
        <Card className="lg:col-span-7 flex flex-col justify-between overflow-hidden border-border/80 bg-gradient-to-br from-surface via-surface to-emerald-surface/20 shadow-xs transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2.5">
                <div className="flex size-9 items-center justify-center rounded-xl bg-emerald-surface text-emerald shadow-2xs border border-emerald-border/60">
                  <Share2 className="size-4.5" />
                </div>
                <div className="flex flex-col">
                  <CardTitle className="text-base font-bold text-ink">
                    {isRTL ? 'مركز مشاركة رابط التقييم' : 'Direct Customer Invite Hub'}
                  </CardTitle>
                  <CardDescription className="text-xs text-ink-muted mt-0.5">
                    {t('dash_link_card_desc')}
                  </CardDescription>
                </div>
              </div>

              <Badge variant="default" dot dotColor="#10B981" className="text-[11px] py-0.5 px-2.5 shrink-0">
                {isRTL ? 'جاهز للمشاركة' : 'Live & Active'}
              </Badge>
            </div>
          </CardHeader>

          <CardContent className="px-5 sm:px-6 pb-5 pt-1 flex flex-col gap-4">
            {/* Direct URL Input Bar */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
              <div className="relative flex-1">
                <code className="block w-full truncate rounded-xl border border-border bg-background px-3.5 py-2.5 text-xs font-mono text-ink shadow-2xs select-all">
                  {reviewLink}
                </code>
              </div>
              <Button
                variant="secondary"
                size="sm"
                onClick={handleCopy}
                className="gap-1.5 text-xs font-bold h-9.5 px-4 transition-all active:scale-95 shrink-0"
              >
                {copied ? <Check className="size-4 text-emerald" /> : <Copy className="size-4" />}
                <span>{copied ? t('action_copied') : t('action_copy')}</span>
              </Button>
            </div>

            {/* Quick Share Action Buttons */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
              <Button
                asChild
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-9 text-xs font-bold bg-surface hover:bg-emerald-surface hover:text-emerald hover:border-emerald-border/70 transition-all shadow-2xs"
              >
                <a href={whatsappShareUrl} target="_blank" rel="noreferrer">
                  <MessageCircle className="size-4 text-emerald-600 dark:text-emerald-400" />
                  <span>{isRTL ? 'إرسال دعوة عبر واتساب' : 'Share via WhatsApp'}</span>
                </a>
              </Button>

              <Button
                asChild
                variant="outline"
                size="sm"
                className="justify-start gap-2 h-9 text-xs font-bold bg-surface hover:bg-emerald-surface hover:text-emerald hover:border-emerald-border/70 transition-all shadow-2xs"
              >
                <Link to="/dashboard/qr">
                  <QrCode className="size-4 text-indigo-500" />
                  <span>{isRTL ? 'تحميل وطباعة رمز QR' : 'Download QR Code'}</span>
                </Link>
              </Button>
            </div>

            {/* Pro-Tip Note */}
            <div className="flex items-center gap-2.5 rounded-xl border border-emerald-border/50 bg-emerald-surface/40 p-3 text-[11px] text-ink-muted">
              <Sparkles className="size-4 text-emerald-deep shrink-0" />
              <span>
                {isRTL
                  ? '💡 نصيحة: وضع هذا الرابط في بايو حسابك أو في رسالة إتمام الطلب يزيد التقييمات الإيجابية بنسبة ٤ أضعاف.'
                  : '💡 Pro Tip: Adding this link to your social bio or order confirmation message increases reviews by 4x.'}
              </span>
            </div>
          </CardContent>
        </Card>

        {/* Bento Tile 2: Ratings Analytics & Health Score (5 cols) */}
        <Card className="lg:col-span-5 flex flex-col justify-between border-border/80 bg-surface/90 backdrop-blur-md shadow-xs transition-all duration-300 hover:shadow-md">
          <CardHeader className="pb-3 pt-5 px-5 sm:px-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex size-9 items-center justify-center rounded-xl bg-amber-500/10 text-amber-500 shadow-2xs border border-amber-500/20">
                  <Star className="size-4.5 fill-amber-500 text-amber-500" />
                </div>
                <div>
                  <CardTitle className="text-base font-bold text-ink">
                    {isRTL ? 'تحليل التقييمات' : 'Rating Analytics'}
                  </CardTitle>
                  <CardDescription className="text-xs text-ink-muted">
                    {totalReviews > 0
                      ? (isRTL ? `مبني على ${totalReviews} تقييم موثق` : `Based on ${totalReviews} verified reviews`)
                      : (isRTL ? 'لا توجد تقييمات مسجلة بعد' : 'No reviews recorded yet')}
                  </CardDescription>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-amber-500/10 text-amber-700 dark:text-amber-400 px-2.5 py-1 rounded-xl text-xs font-extrabold border border-amber-500/20">
                <span>{avgRating}</span>
                <span>★</span>
              </div>
            </div>
          </CardHeader>

          <CardContent className="px-5 sm:px-6 pb-5 pt-1 flex flex-col gap-2.5">
            {/* 5-Star Distribution Bars */}
            {[5, 4, 3, 2, 1].map((star) => {
              const count = starCounts[star as keyof typeof starCounts] || 0
              const percentage = totalReviews > 0 ? Math.round((count / totalReviews) * 100) : 0
              return (
                <div key={star} className="flex items-center gap-2.5 text-xs">
                  <span className="w-6 font-bold text-ink-muted flex items-center gap-0.5 shrink-0">
                    <span>{star}</span>
                    <span className="text-amber-500">★</span>
                  </span>

                  {/* Progress Bar Container */}
                  <div className="flex-1 h-2 rounded-full bg-background-subtle overflow-hidden border border-border/40">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-500"
                      style={{ width: `${percentage}%` }}
                    />
                  </div>

                  <span className="w-9 text-end font-mono text-[11px] text-ink-muted shrink-0">
                    {count}
                  </span>
                </div>
              )
            })}

            {/* Quick Action Footer */}
            <div className="pt-2 mt-1 border-t border-border/60 flex items-center justify-between text-xs">
              <span className="text-ink-muted flex items-center gap-1 text-[11px]">
                <ShieldCheck className="size-3.5 text-emerald" />
                <span>{isRTL ? '١٠٠% تقييمات حقيقية' : '100% Authentic'}</span>
              </span>

              <Link
                to="/dashboard/reviews"
                className="inline-flex items-center gap-1 font-bold text-emerald hover:underline text-[11px]"
              >
                <span>{isRTL ? 'عرض سجل التقييمات' : 'View Full Feed'}</span>
                {isRTL ? <ArrowLeft className="size-3" /> : <ArrowRight className="size-3" />}
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 4. Templates Showcase Hub on Dashboard Home */}
      <Card className="border-border/80 bg-surface/90 backdrop-blur-md shadow-xs transition-all duration-300 hover:shadow-md overflow-hidden">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-border/60 py-3.5 px-5 sm:px-6">
          <div className="flex items-center gap-2.5">
            <div className="flex size-8 items-center justify-center rounded-xl bg-gradient-to-tr from-indigo-500 to-purple-600 text-white shadow-2xs">
              <Palette className="size-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <CardTitle className="text-sm sm:text-base font-bold text-ink">
                  {isRTL ? 'قوالب تصاميم التقييمات' : 'Review Card Templates'}
                </CardTitle>
                <Badge variant="default" className="text-[10px] py-0 px-2 font-bold">
                  {TEMPLATE_IDS.length} {isRTL ? 'قالب حصري' : 'Presets'}
                </Badge>
              </div>
              <CardDescription className="text-xs text-ink-muted mt-0.5">
                {isRTL
                  ? `القالب الافتراضي: ${TEMPLATE_LABELS[(merchant?.default_template_id as TemplateId) || DEFAULT_TEMPLATE_ID]}`
                  : `Active default: ${TEMPLATE_LABELS[(merchant?.default_template_id as TemplateId) || DEFAULT_TEMPLATE_ID]}`}
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Quick Carousel Controls */}
            <div className="flex items-center gap-1 me-1">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => scrollTemplates(isRTL ? 'right' : 'left')}
                className="size-8 rounded-lg cursor-pointer text-ink-muted hover:text-ink shadow-2xs"
                title={isRTL ? 'السابق' : 'Previous'}
              >
                {isRTL ? <ChevronRight className="size-4" /> : <ChevronLeft className="size-4" />}
              </Button>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => scrollTemplates(isRTL ? 'left' : 'right')}
                className="size-8 rounded-lg cursor-pointer text-ink-muted hover:text-ink shadow-2xs"
                title={isRTL ? 'التالي' : 'Next'}
              >
                {isRTL ? <ChevronLeft className="size-4" /> : <ChevronRight className="size-4" />}
              </Button>
            </div>

            <Button asChild variant="outline" size="sm" className="h-8 text-xs font-bold gap-1.5 shadow-2xs">
              <Link to="/preview/testimonial">
                <Sparkles className="size-3.5 text-indigo-500" />
                <span>{isRTL ? 'المحاكي' : 'Simulator'}</span>
              </Link>
            </Button>

            <Button asChild variant="primaryGlow" size="sm" className="h-8 text-xs font-bold gap-1.5 shadow-xs">
              <Link to="/dashboard/branding">
                <Palette className="size-3.5" />
                <span>{isRTL ? 'تخصيص' : 'Customize'}</span>
              </Link>
            </Button>
          </div>
        </CardHeader>

        <CardContent className="p-3.5 sm:p-4">
          <div
            ref={templateScrollRef}
            className="flex items-center gap-3 overflow-x-auto scrollbar-hidden overscroll-contain py-1 px-1 scroll-smooth snap-x"
          >
            {TEMPLATE_IDS.map((tId) => {
              const isActive = (merchant?.default_template_id || DEFAULT_TEMPLATE_ID) === tId
              return (
                <Link
                  key={tId}
                  to="/dashboard/branding"
                  className={`group relative flex flex-col items-center overflow-hidden rounded-xl border transition-all duration-200 w-24 sm:w-28 shrink-0 snap-start ${
                    isActive
                      ? 'border-emerald ring-2 ring-emerald/30 shadow-md scale-[1.02] bg-emerald-surface/30'
                      : 'border-border/80 bg-background-subtle/50 hover:border-border hover:bg-surface hover:shadow-xs'
                  }`}
                  title={`${TEMPLATE_LABELS[tId]} - ${isActive ? (isRTL ? 'القالب النشط حالياً' : 'Active Template') : (isRTL ? 'اضغط للتطبيق' : 'Click to apply')}`}
                >
                  <div className="relative aspect-square w-full overflow-hidden bg-slate-100 dark:bg-slate-950">
                    <LiveTemplatePreview
                      templateId={tId}
                      brandColor={merchant?.brand_color}
                      className="size-full pointer-events-none"
                    />
                    {isActive && (
                      <div className="absolute top-1 end-1 flex size-4 items-center justify-center rounded-full bg-emerald text-white shadow-xs z-10">
                        <Check className="size-2.5 stroke-[3]" />
                      </div>
                    )}
                  </div>
                  <span
                    className={`w-full text-center py-1 text-[10px] font-bold truncate px-1 ${
                      isActive ? 'text-emerald-deep font-black' : 'text-ink-muted group-hover:text-ink'
                    }`}
                  >
                    {isRTL ? TEMPLATE_LABELS[tId] : TEMPLATE_LABELS_EN[tId]}
                  </span>
                </Link>
              )
            })}
          </div>
        </CardContent>
      </Card>

      {/* 5. Bottom Section: Recent Reviews Feed */}
      <Card className="shadow-xs border-border/80 bg-surface/90 backdrop-blur-md transition-all duration-300 hover:shadow-md">
        <CardHeader className="flex flex-row items-center justify-between border-b border-border/60 py-4 px-5 sm:px-6">
          <div className="flex flex-col gap-0.5">
            <div className="flex items-center gap-2">
              <div className="flex size-7 items-center justify-center rounded-lg bg-emerald-surface text-emerald shadow-2xs">
                <MessageSquareText className="size-4" />
              </div>
              <CardTitle className="text-base font-bold text-ink">
                {t('dash_recent_reviews_title')}
              </CardTitle>
            </div>
            <CardDescription className="text-xs text-ink-muted">
              {t('dash_recent_reviews_desc')}
            </CardDescription>
          </div>

          {reviews.length > 0 && (
            <Button
              asChild
              variant="ghost"
              size="sm"
              className="hover:bg-emerald-surface/50 hover:text-emerald text-xs font-bold h-8.5 gap-1"
            >
              <Link to="/dashboard/reviews">
                <span>{t('action_view_all')}</span>
                <span>({reviews.length})</span>
                {isRTL ? <ArrowLeft className="size-3" /> : <ArrowRight className="size-3" />}
              </Link>
            </Button>
          )}
        </CardHeader>

        <CardContent className="p-5 sm:p-6">
          {!loading && reviews.length === 0 && (
            <EmptyState
              icon={Heart}
              title={t('dash_empty_reviews_title')}
              description={t('dash_empty_reviews_desc')}
              actionLabel={t('dash_qr_card_title')}
              actionHref="/dashboard/qr"
            />
          )}

          {!loading && reviews.length > 0 && (
            <div className="flex flex-col gap-3.5">
              {paginatedRecentReviews.map((review) => (
                <div
                  key={review.id}
                  className="group/review flex flex-col gap-3 rounded-2xl border border-border/80 bg-surface/80 p-4 sm:p-5 transition-all duration-200 hover:border-emerald-border hover:shadow-xs hover:bg-surface"
                >
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-3">
                      <div className="flex size-9 items-center justify-center rounded-xl bg-muted-surface font-bold text-ink text-xs shadow-2xs border border-border/50">
                        {(review.customer_name?.charAt(0) || 'ع')}
                      </div>
                      <div className="flex flex-col">
                        <span className="text-xs sm:text-sm font-bold text-ink leading-tight">
                          {review.customer_name ?? t('dash_anonymous_customer')}
                        </span>
                        <span className="text-[10px] text-ink-subtle mt-0.5">
                          {formatDate(review.created_at)}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <div className="flex items-center">
                        <StarRating value={review.rating} onChange={() => {}} disabled size="sm" />
                      </div>
                      <Badge variant={statusVariants[review.status]} dot className="text-[11px] py-0.5">
                        {statusLabels[review.status]}
                      </Badge>
                    </div>
                  </div>

                  <p className="text-xs sm:text-sm text-ink-muted leading-relaxed rounded-xl bg-background-subtle/50 p-3.5 border border-border/40 font-normal">
                    "{review.original_text}"
                  </p>

                  {/* Share Actions Bar */}
                  <div className="flex flex-wrap items-center justify-between gap-2 pt-2 border-t border-border/60">
                    <span className="text-[11px] font-semibold text-ink-subtle flex items-center gap-1.5">
                      <Share2 className="size-3.5 text-emerald" />
                      <span>{isRTL ? 'مشاركة التقييم:' : 'Share review:'}</span>
                    </span>

                    <div className="flex flex-wrap items-center gap-1.5">
                      {/* WhatsApp Share */}
                      <Button
                        asChild
                        size="xs"
                        variant="outline"
                        className="h-7.5 px-2.5 text-[11px] font-bold gap-1.5 text-emerald-deep hover:bg-emerald-surface hover:text-emerald hover:border-emerald-border/80 transition-all shadow-2xs"
                      >
                        <a
                          href={getReviewWhatsAppUrl(review)}
                          target="_blank"
                          rel="noreferrer"
                          title={isRTL ? 'مشاركة التقييم عبر واتساب' : 'Share on WhatsApp'}
                        >
                          <MessageCircle className="size-3.5 text-emerald-600 dark:text-emerald-400" />
                          <span>{isRTL ? 'واتساب' : 'WhatsApp'}</span>
                        </a>
                      </Button>

                      {/* Copy Review Quote */}
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        onClick={() => handleCopyReview(review)}
                        className="h-7.5 px-2.5 text-[11px] font-bold gap-1.5 text-ink-muted hover:text-ink hover:bg-muted-surface hover:border-border transition-all shadow-2xs"
                        title={isRTL ? 'نسخ نص التقييم' : 'Copy Review Text'}
                      >
                        {copiedReviewId === review.id ? (
                          <Check className="size-3.5 text-emerald" />
                        ) : (
                          <Copy className="size-3.5" />
                        )}
                        <span>
                          {copiedReviewId === review.id
                            ? (isRTL ? 'تم النسخ' : 'Copied')
                            : (isRTL ? 'نسخ النص' : 'Copy')}
                        </span>
                      </Button>

                      {/* Native Share */}
                      <Button
                        type="button"
                        size="xs"
                        variant="outline"
                        onClick={() => handleNativeShare(review)}
                        className="h-7.5 px-2.5 text-[11px] font-bold gap-1.5 text-ink-muted hover:text-ink hover:bg-muted-surface hover:border-border transition-all shadow-2xs"
                        title={isRTL ? 'مشاركة سريعة' : 'Quick Share'}
                      >
                        <Share2 className="size-3.5 text-indigo-500" />
                        <span>{isRTL ? 'مشاركة' : 'Share'}</span>
                      </Button>

                      {/* View Design / Preview Graphic */}
                      <Button
                        asChild
                        size="xs"
                        variant="ghost"
                        className="h-7.5 px-2.5 text-[11px] font-bold gap-1 text-ink-muted hover:text-emerald hover:bg-emerald-surface/50 transition-all"
                      >
                        <Link to="/dashboard/reviews">
                          <ImageIcon className="size-3.5 text-amber-500" />
                          <span>{isRTL ? 'التصميم' : 'Design'}</span>
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              ))}

              {/* Pagination Controls */}
              {totalRecentPages > 1 && (
                <Pagination
                  currentPage={recentPage}
                  totalPages={totalRecentPages}
                  totalItems={reviews.length}
                  pageSize={recentPageSize}
                  onPageChange={setRecentPage}
                />
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

export default DashboardHomePage


