import * as React from 'react'
import { useParams } from 'react-router-dom'
import { Check, Heart, MessageSquare, Share2, ShieldCheck, Sparkles, Star } from 'lucide-react'

import { Button } from '@/components/ui/button'
import { LanguageToggle } from '@/components/ui/language-toggle'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import { AnimatedBackground } from '@/components/ui/animated-background'
import { BrandLogo } from '@/components/ui/brand-logo'
import { FullPageSpinner } from '@/components/auth/RequireAuth'
import { GeneratedTestimonialCard } from '@/components/testimonial/GeneratedTestimonialCard'
import { getPublicMerchantBySlug, type PublicMerchant } from '@/lib/public-merchant'
import { getPublicTestimonialsBySlug, type PublicTestimonial } from '@/lib/public-wall-of-love'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/components/ui/toast'

type PageState =
  | { status: 'loading' }
  | { status: 'not-found' }
  | { status: 'ready'; merchant: PublicMerchant; testimonials: PublicTestimonial[] }

function WallOfLovePage() {
  const { slug } = useParams<{ slug: string }>()
  const { t } = useLanguage()
  const { showToast } = useToast()
  const [state, setState] = React.useState<PageState>({ status: 'loading' })
  const [ratingFilter, setRatingFilter] = React.useState<number | null>(null)
  const [copied, setCopied] = React.useState(false)

  React.useEffect(() => {
    let cancelled = false
    setState({ status: 'loading' })

    if (!slug) {
      setState({ status: 'not-found' })
      return
    }

    Promise.all([getPublicMerchantBySlug(slug), getPublicTestimonialsBySlug(slug)])
      .then(([merchant, testimonials]) => {
        if (cancelled) return
        if (!merchant) {
          setState({ status: 'not-found' })
          return
        }
        setState({ status: 'ready', merchant, testimonials })
      })
      .catch((error) => {
        console.error('Failed to load Wall of Love', error)
        if (!cancelled) setState({ status: 'not-found' })
      })

    return () => {
      cancelled = true
    }
  }, [slug])

  async function handleShare() {
    const url = window.location.href
    await navigator.clipboard.writeText(url)
    setCopied(true)
    showToast(t('action_copied'), url, 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  if (state.status === 'loading') {
    return <FullPageSpinner />
  }

  if (state.status === 'not-found') {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4 text-center">
        <p className="text-sm font-semibold text-ink-muted">{t('review_merchant_not_found')}</p>
      </main>
    )
  }

  const { merchant, testimonials } = state

  const filteredTestimonials = ratingFilter
    ? testimonials.filter((item) => item.rating >= ratingFilter)
    : testimonials

  const totalReviews = testimonials.length
  const avgRating = totalReviews > 0
    ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '5.0'

  return (
    <main className="relative min-h-dvh bg-background text-ink pb-24 selection:bg-emerald/20 overflow-x-hidden pt-safe pb-safe">
      {/* Animated Brand Ambience */}
      <AnimatedBackground
        variant="brand"
        brandColor={merchant.brand_color}
        showDots
        showParticles
      />

      {/* Top Navbar */}
      <header className="sticky top-0 z-40 glass-header bg-white/85 dark:bg-[#04120f]/90 border-b border-border dark:border-emerald-500/20 backdrop-blur-xl transition-colors duration-200">
        <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-3.5 py-3 sm:px-6 md:px-8">
          <BrandLogo size="sm" />

          <div className="flex items-center gap-3">
            <Button
              variant="secondary"
              size="sm"
              onClick={handleShare}
              className="gap-1.5 text-xs font-bold shadow-xs"
            >
              {copied ? <Check className="size-3.5 text-emerald" /> : <Share2 className="size-3.5" />}
              <span>{copied ? t('action_copied') : t('wall_share_btn')}</span>
            </Button>
            <ThemeToggle variant="minimal" />
            <LanguageToggle variant="pill" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-10 px-4 pt-10 sm:px-6 md:px-8">
        {/* Merchant Hero Header Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-xl p-8 md:p-14 text-center shadow-xl">
          <div
            className="pointer-events-none absolute inset-0 opacity-20"
            style={{
              background: `radial-gradient(circle at 50% 0%, ${merchant.brand_color}, transparent 70%)`,
            }}
          />

          <div className="relative z-10 flex flex-col items-center gap-6">
            {/* Merchant Logo / Avatar */}
            {merchant.logo_url ? (
              <img
                src={merchant.logo_url}
                alt={merchant.business_name}
                className="size-24 rounded-3xl object-cover border-4 border-white shadow-xl animate-float-gentle"
              />
            ) : (
              <div
                className="flex size-24 items-center justify-center rounded-3xl text-4xl font-extrabold text-white shadow-xl animate-float-gentle"
                style={{ backgroundColor: merchant.brand_color }}
                aria-hidden
              >
                {merchant.business_name.trim().charAt(0) || 'ت'}
              </div>
            )}

            <div className="flex flex-col items-center gap-2 max-w-2xl">
              <div className="inline-flex items-center gap-1.5 rounded-full border border-emerald-border bg-emerald-surface px-3.5 py-1 text-xs font-extrabold text-emerald-deep shadow-xs">
                <ShieldCheck className="size-3.5 text-emerald" />
                <span>{t('wall_title_badge')}</span>
              </div>

              <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-ink tracking-tight">
                {merchant.business_name}
              </h1>

              <p className="text-sm sm:text-base text-ink-muted">
                {t('wall_subtitle')}
              </p>
            </div>

            {/* Rating Summary Capsules */}
            {totalReviews > 0 && (
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <div className="flex items-center gap-2 rounded-2xl border border-border bg-background-subtle px-4 py-2 text-xs font-extrabold text-ink shadow-xs">
                  <Star className="size-4 fill-amber-400 text-amber-400" />
                  <span className="text-base text-ink">{avgRating}</span>
                  <span className="text-ink-subtle">/ 5.0</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-2xl border border-border bg-background-subtle px-4 py-2 text-xs font-bold text-ink shadow-xs">
                  <MessageSquare className="size-4 text-emerald" />
                  <span>{totalReviews} {t('wall_total_reviews')}</span>
                </div>

                <div className="flex items-center gap-1.5 rounded-2xl border border-emerald-border bg-emerald-surface px-4 py-2 text-xs font-bold text-emerald-deep shadow-xs">
                  <span>✓ 100% موثق وحقيقي</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Filter Tabs */}
        {testimonials.length > 0 && (
          <div className="flex items-center justify-center gap-2">
            <button
              type="button"
              onClick={() => setRatingFilter(null)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                ratingFilter === null
                  ? 'bg-ink text-white shadow-sm'
                  : 'bg-surface border border-border text-ink-muted hover:text-ink hover:bg-muted-surface'
              }`}
            >
              {t('action_filter_all')} ({testimonials.length})
            </button>
            <button
              type="button"
              onClick={() => setRatingFilter(5)}
              className={`rounded-full px-5 py-2 text-xs font-bold transition-all cursor-pointer ${
                ratingFilter === 5
                  ? 'bg-emerald text-white shadow-sm button-specular'
                  : 'bg-surface border border-border text-ink-muted hover:text-ink hover:bg-muted-surface'
              }`}
            >
              ⭐⭐⭐⭐⭐ 5.0
            </button>
          </div>
        )}

        {/* Testimonials Grid Showcase */}
        {filteredTestimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-surface py-20 px-6 text-center shadow-xs">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-surface text-emerald">
              <Heart className="size-7" />
            </div>
            <p className="text-lg font-bold text-ink">{t('wall_empty_title')}</p>
            <p className="text-sm text-ink-muted max-w-sm">{t('wall_empty_desc')}</p>
          </div>
        ) : (
          <section
            className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in"
            aria-label="Wall of Love"
          >
            {filteredTestimonials.map((testimonial) => (
              <GeneratedTestimonialCard
                key={testimonial.id}
                status="ready"
                data={{
                  merchant: {
                    businessName: merchant.business_name,
                    brandColor: merchant.brand_color,
                  },
                  customerName: testimonial.customer_name ?? undefined,
                  rating: testimonial.rating,
                  reviewText: testimonial.original_text,
                  generatedImageUrl: testimonial.image_url ?? undefined,
                }}
              />
            ))}
          </section>
        )}

        {/* Footer Branding */}
        <footer className="flex flex-col items-center gap-2 border-t border-border/80 pt-10 text-center">
          <a
            href="/"
            className="inline-flex items-center gap-1.5 text-xs font-bold text-ink-muted hover:text-emerald transition-colors"
          >
            <Sparkles className="size-3.5 text-emerald" />
            <span>{t('wall_powered_by')}</span>
          </a>
        </footer>
      </div>
    </main>
  )
}

export default WallOfLovePage
