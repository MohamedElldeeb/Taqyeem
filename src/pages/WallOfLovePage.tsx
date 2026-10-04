import * as React from 'react'
import { useParams } from 'react-router-dom'
import {
  ArrowUpDown,
  Check,
  Heart,
  MessageSquare,
  RotateCcw,
  Search,
  Share2,
  ShieldCheck,
  Sparkles,
  Star,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
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

type SortOption = 'newest' | 'highest' | 'lowest'

function WallOfLovePage() {
  const { slug } = useParams<{ slug: string }>()
  const { t, isRTL } = useLanguage()
  const { showToast } = useToast()
  const [state, setState] = React.useState<PageState>({ status: 'loading' })
  const [searchQuery, setSearchQuery] = React.useState('')
  const [ratingFilter, setRatingFilter] = React.useState<number | null>(null)
  const [sortBy, setSortBy] = React.useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(9)
  const [copied, setCopied] = React.useState(false)

  // Reset pagination when filter/search/sort changes
  const handleSearchChange = (query: string) => {
    setSearchQuery(query)
    setCurrentPage(1)
  }

  const handleRatingFilterChange = (rating: number | null) => {
    setRatingFilter(rating)
    setCurrentPage(1)
  }

  const handleSortChange = (sort: SortOption) => {
    setSortBy(sort)
    setCurrentPage(1)
  }

  const handleClearFilters = () => {
    setSearchQuery('')
    setRatingFilter(null)
    setSortBy('newest')
    setCurrentPage(1)
  }

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

  const testimonials = state.status === 'ready' ? state.testimonials : []
  const merchant = state.status === 'ready' ? state.merchant : null
  const totalReviews = testimonials.length

  // Filter and Sort testimonials (called unconditionally)
  const filteredAndSortedTestimonials = React.useMemo(() => {
    return testimonials
      .filter((item) => {
        // Rating filter
        if (ratingFilter !== null && item.rating < ratingFilter) {
          return false
        }

        // Search query filter (matches customer name or review text)
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase()
          const matchText = (item.original_text || '').toLowerCase().includes(query)
          const matchCustomer = (item.customer_name || '').toLowerCase().includes(query)
          if (!matchText && !matchCustomer) return false
        }

        return true
      })
      .sort((a, b) => {
        if (sortBy === 'highest') return b.rating - a.rating
        if (sortBy === 'lowest') return a.rating - b.rating
        // 'newest' default
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }, [testimonials, ratingFilter, searchQuery, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedTestimonials.length / pageSize))

  // Ensure current page is valid when count changes
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const paginatedTestimonials = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredAndSortedTestimonials.slice(start, start + pageSize)
  }, [filteredAndSortedTestimonials, currentPage, pageSize])

  const avgRating = totalReviews > 0
    ? (testimonials.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '5.0'

  const hasActiveFilters = searchQuery.trim().length > 0 || ratingFilter !== null || sortBy !== 'newest'

  if (state.status === 'loading') {
    return <FullPageSpinner />
  }

  if (state.status === 'not-found' || !merchant) {
    return (
      <main className="flex min-h-dvh items-center justify-center bg-background px-4 text-center">
        <p className="text-sm font-semibold text-ink-muted">{t('review_merchant_not_found')}</p>
      </main>
    )
  }

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
              className="gap-1.5 text-xs font-bold shadow-xs cursor-pointer"
            >
              {copied ? <Check className="size-3.5 text-emerald" /> : <Share2 className="size-3.5" />}
              <span>{copied ? t('action_copied') : t('wall_share_btn')}</span>
            </Button>
            <ThemeToggle variant="minimal" />
            <LanguageToggle variant="pill" />
          </div>
        </div>
      </header>

      <div className="mx-auto flex w-full max-w-6xl flex-col gap-8 px-4 pt-8 sm:px-6 md:px-8">
        {/* Merchant Hero Header Banner */}
        <section className="relative overflow-hidden rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-xl p-8 md:p-12 text-center shadow-xl">
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
                className="size-24 rounded-3xl object-cover border-4 border-white dark:border-slate-800 shadow-xl animate-float-gentle"
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
                  <span>✓ 100% {isRTL ? 'موثق وحقيقي' : 'Verified Real Customers'}</span>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Search & Interactive Filter Bar */}
        {testimonials.length > 0 && (
          <section className="flex flex-col gap-4 rounded-3xl border border-border/80 bg-surface/90 backdrop-blur-md p-4 sm:p-5 shadow-sm">
            <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
              {/* Search Box */}
              <div className="flex-1 min-w-0">
                <Input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  placeholder={t('wall_search_placeholder')}
                  startIcon={<Search className="size-4 text-ink-muted" />}
                  endIcon={
                    searchQuery ? (
                      <button
                        type="button"
                        onClick={() => handleSearchChange('')}
                        className="p-1 rounded-full text-ink-muted hover:text-ink hover:bg-muted-surface transition-colors cursor-pointer"
                        title={isRTL ? 'مسح البحث' : 'Clear search'}
                      >
                        <X className="size-3.5" />
                      </button>
                    ) : undefined
                  }
                  className="h-11 bg-background-subtle/70 border-border/80 rounded-2xl text-sm focus:border-emerald"
                />
              </div>

              {/* Sort Selector */}
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs font-bold text-ink-muted hidden sm:inline-flex items-center gap-1">
                  <ArrowUpDown className="size-3.5" />
                  {t('wall_sort_label')}
                </span>
                <div className="flex items-center gap-1 bg-background-subtle/80 p-1 rounded-2xl border border-border/70">
                  <button
                    type="button"
                    onClick={() => handleSortChange('newest')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      sortBy === 'newest'
                        ? 'bg-surface text-ink shadow-2xs font-extrabold'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {t('wall_sort_newest')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortChange('highest')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      sortBy === 'highest'
                        ? 'bg-surface text-ink shadow-2xs font-extrabold'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {t('wall_sort_highest')}
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSortChange('lowest')}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                      sortBy === 'lowest'
                        ? 'bg-surface text-ink shadow-2xs font-extrabold'
                        : 'text-ink-muted hover:text-ink'
                    }`}
                  >
                    {t('wall_sort_lowest')}
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Pills & Result Counter */}
            <div className="flex flex-wrap items-center justify-between gap-3 pt-1 border-t border-border/60">
              <div className="flex flex-wrap items-center gap-1.5">
                <button
                  type="button"
                  onClick={() => handleRatingFilterChange(null)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer ${
                    ratingFilter === null
                      ? 'bg-emerald text-white shadow-xs'
                      : 'bg-background-subtle border border-border/70 text-ink-muted hover:text-ink hover:bg-muted-surface'
                  }`}
                >
                  {t('action_filter_all')} ({testimonials.length})
                </button>
                <button
                  type="button"
                  onClick={() => handleRatingFilterChange(5)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    ratingFilter === 5
                      ? 'bg-emerald text-white shadow-xs'
                      : 'bg-background-subtle border border-border/70 text-ink-muted hover:text-ink hover:bg-muted-surface'
                  }`}
                >
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span>5.0 ({testimonials.filter((x) => x.rating === 5).length})</span>
                </button>
                <button
                  type="button"
                  onClick={() => handleRatingFilterChange(4)}
                  className={`rounded-xl px-3.5 py-1.5 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                    ratingFilter === 4
                      ? 'bg-emerald text-white shadow-xs'
                      : 'bg-background-subtle border border-border/70 text-ink-muted hover:text-ink hover:bg-muted-surface'
                  }`}
                >
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span>4★+ ({testimonials.filter((x) => x.rating >= 4).length})</span>
                </button>
              </div>

              <div className="flex items-center gap-3">
                <span className="text-xs font-semibold text-ink-subtle">
                  {t('wall_showing_count')
                    .replace('{count}', String(filteredAndSortedTestimonials.length))
                    .replace('{total}', String(totalReviews))}
                </span>

                {hasActiveFilters && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="xs"
                    onClick={handleClearFilters}
                    className="text-xs text-danger hover:text-danger hover:bg-danger-surface gap-1"
                  >
                    <RotateCcw className="size-3" />
                    <span>{t('wall_clear_filters')}</span>
                  </Button>
                )}
              </div>
            </div>
          </section>
        )}

        {/* Testimonials Grid Showcase */}
        {testimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-border bg-surface py-20 px-6 text-center shadow-xs">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-emerald-surface text-emerald">
              <Heart className="size-7" />
            </div>
            <p className="text-lg font-bold text-ink">{t('wall_empty_title')}</p>
            <p className="text-sm text-ink-muted max-w-sm">{t('wall_empty_desc')}</p>
          </div>
        ) : filteredAndSortedTestimonials.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 rounded-3xl border border-dashed border-border bg-surface/80 py-16 px-6 text-center shadow-xs animate-fade-in">
            <div className="flex size-14 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
              <Search className="size-7" />
            </div>
            <div className="flex flex-col gap-1 max-w-sm">
              <p className="text-base font-bold text-ink">{t('wall_no_search_results')}</p>
              <p className="text-xs text-ink-muted">{t('wall_no_search_desc')}</p>
            </div>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClearFilters}
              className="mt-2 gap-1.5 font-bold cursor-pointer"
            >
              <RotateCcw className="size-3.5" />
              <span>{t('wall_clear_filters')}</span>
            </Button>
          </div>
        ) : (
          <div className="flex flex-col gap-8">
            <section
              className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in"
              aria-label="Wall of Love"
            >
              {paginatedTestimonials.map((testimonial) => (
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

            {/* Pagination */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={filteredAndSortedTestimonials.length}
              pageSize={pageSize}
              pageSizeOptions={[6, 9, 18, 36]}
              onPageChange={setCurrentPage}
              onPageSizeChange={(newSize) => {
                setPageSize(newSize)
                setCurrentPage(1)
              }}
            />
          </div>
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
