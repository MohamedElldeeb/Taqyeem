import * as React from 'react'
import {
  ArrowUpDown,
  Check,
  Copy,
  ExternalLink,
  Heart,
  MessageSquare,
  RotateCcw,
  Search,
  Sparkles,
  Star,
  X,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Pagination } from '@/components/ui/pagination'
import { EmptyState } from '@/components/ui/empty-state'
import { Skeleton } from '@/components/ui/skeleton'
import { GeneratedTestimonialCard } from '@/components/testimonial/GeneratedTestimonialCard'
import { useMerchant } from '@/hooks/useMerchant'
import { useMerchantReviews } from '@/hooks/useMerchantReviews'
import { toCardStatus } from '@/lib/generated-content-status'
import { useLanguage } from '@/lib/language-context'
import { useToast } from '@/components/ui/toast'

type SortOption = 'newest' | 'highest' | 'lowest'

function DashboardWallOfLovePage() {
  const { merchant } = useMerchant()
  const { reviews, loading } = useMerchantReviews(merchant?.id)
  const { t, isRTL } = useLanguage()
  const { showToast } = useToast()

  const [searchQuery, setSearchQuery] = React.useState('')
  const [ratingFilter, setRatingFilter] = React.useState<number | null>(null)
  const [sortBy, setSortBy] = React.useState<SortOption>('newest')
  const [currentPage, setCurrentPage] = React.useState(1)
  const [pageSize, setPageSize] = React.useState(6)
  const [copied, setCopied] = React.useState(false)

  const publicUrl = merchant ? `${window.location.origin}/w/${merchant.slug}` : ''

  async function handleCopyLink() {
    if (!publicUrl) return
    await navigator.clipboard.writeText(publicUrl)
    setCopied(true)
    showToast(t('action_copied'), publicUrl, 'success')
    setTimeout(() => setCopied(false), 2000)
  }

  function handleClearFilters() {
    setSearchQuery('')
    setRatingFilter(null)
    setSortBy('newest')
    setCurrentPage(1)
  }

  const totalReviews = reviews.length
  const fiveStarReviews = reviews.filter((r) => r.rating === 5).length
  const avgRating = totalReviews > 0
    ? (reviews.reduce((acc, curr) => acc + curr.rating, 0) / totalReviews).toFixed(1)
    : '5.0'

  // Filter and sort reviews (called unconditionally before early return)
  const filteredAndSortedReviews = React.useMemo(() => {
    return reviews
      .filter((review) => {
        if (ratingFilter !== null && review.rating < ratingFilter) {
          return false
        }
        if (searchQuery.trim()) {
          const query = searchQuery.trim().toLowerCase()
          const matchText = (review.original_text || '').toLowerCase().includes(query)
          const matchCustomer = (review.customer_name || '').toLowerCase().includes(query)
          if (!matchText && !matchCustomer) return false
        }
        return true
      })
      .sort((a, b) => {
        if (sortBy === 'highest') return b.rating - a.rating
        if (sortBy === 'lowest') return a.rating - b.rating
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
      })
  }, [reviews, ratingFilter, searchQuery, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredAndSortedReviews.length / pageSize))

  // Ensure current page is valid when count changes
  React.useEffect(() => {
    if (currentPage > totalPages) {
      setCurrentPage(totalPages)
    }
  }, [totalPages, currentPage])

  const paginatedReviews = React.useMemo(() => {
    const start = (currentPage - 1) * pageSize
    return filteredAndSortedReviews.slice(start, start + pageSize)
  }, [filteredAndSortedReviews, currentPage, pageSize])

  const hasActiveFilters = searchQuery.trim().length > 0 || ratingFilter !== null || sortBy !== 'newest'

  if (!merchant) return null

  return (
    <div className="flex flex-col gap-6 animate-fade-in pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-col gap-1.5">
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-ink tracking-tight">
              {t('dash_wall_title')}
            </h1>
            <span className="inline-flex items-center gap-1 rounded-full border border-emerald-border bg-emerald-surface px-2.5 py-0.5 text-[11px] font-bold text-emerald-deep shadow-2xs">
              <Sparkles className="size-3" />
              {t('dash_wall_preview_badge')}
            </span>
          </div>
          <p className="text-sm text-ink-muted">
            {t('dash_wall_subtitle')}
          </p>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={handleCopyLink}
            className="gap-1.5 text-xs font-bold shadow-2xs cursor-pointer"
          >
            {copied ? <Check className="size-3.5 text-emerald" /> : <Copy className="size-3.5" />}
            <span>{copied ? t('action_copied') : t('action_copy')}</span>
          </Button>

          <Button asChild size="sm" variant="primaryGlow" className="shadow-md transition-all active:scale-95 text-xs font-bold gap-1.5">
            <a href={`/w/${merchant.slug}`} target="_blank" rel="noreferrer">
              <span>{t('dash_wall_open_public')}</span>
              <ExternalLink className="size-3.5" />
            </a>
          </Button>
        </div>
      </div>

      {/* Metrics Banner */}
      {!loading && reviews.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md px-4 py-3 shadow-xs">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-emerald-surface text-emerald shadow-2xs">
              <MessageSquare className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-ink-subtle">{t('wall_total_reviews')}</span>
              <span className="text-lg font-extrabold text-ink leading-tight">{totalReviews}</span>
            </div>
          </div>

          <div className="flex items-center gap-3 rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md px-4 py-3 shadow-xs">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-amber-50 dark:bg-amber-900/20 text-amber-500 shadow-2xs">
              <Star className="size-4 fill-amber-400 stroke-amber-400" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-ink-subtle">{t('wall_avg_rating')}</span>
              <span className="text-lg font-extrabold text-ink leading-tight">{avgRating} / 5.0</span>
            </div>
          </div>

          <div className="col-span-2 sm:col-span-1 flex items-center gap-3 rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md px-4 py-3 shadow-xs">
            <div className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-indigo-50 dark:bg-indigo-900/20 text-indigo-500 shadow-2xs">
              <Sparkles className="size-4" />
            </div>
            <div className="flex flex-col min-w-0">
              <span className="text-[11px] font-semibold text-ink-subtle">{isRTL ? 'تقييمات 5 نجوم' : '5-Star Reviews'}</span>
              <span className="text-lg font-extrabold text-ink leading-tight">{fiveStarReviews} ({totalReviews > 0 ? Math.round((fiveStarReviews / totalReviews) * 100) : 100}%)</span>
            </div>
          </div>
        </div>
      )}

      {/* Interactive Search & Filter Controls */}
      {!loading && reviews.length > 0 && (
        <section className="flex flex-col gap-3 rounded-2xl border border-border/80 bg-surface/90 backdrop-blur-md p-4 shadow-xs">
          <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
            {/* Search Input */}
            <div className="flex-1 min-w-0">
              <Input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('wall_search_placeholder')}
                startIcon={<Search className="size-4 text-ink-muted" />}
                endIcon={
                  searchQuery ? (
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="p-1 rounded-full text-ink-muted hover:text-ink hover:bg-muted-surface transition-colors cursor-pointer"
                      title={isRTL ? 'مسح البحث' : 'Clear search'}
                    >
                      <X className="size-3.5" />
                    </button>
                  ) : undefined
                }
                className="h-10 bg-background-subtle/70 border-border/80 rounded-xl text-xs focus:border-emerald"
              />
            </div>

            {/* Sort Control */}
            <div className="flex items-center gap-2 shrink-0">
              <span className="text-xs font-bold text-ink-muted hidden sm:inline-flex items-center gap-1">
                <ArrowUpDown className="size-3" />
                {t('wall_sort_label')}
              </span>
              <div className="flex items-center gap-1 bg-background-subtle/80 p-0.5 rounded-xl border border-border/70">
                <button
                  type="button"
                  onClick={() => setSortBy('newest')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sortBy === 'newest'
                      ? 'bg-surface text-ink shadow-2xs font-extrabold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {t('wall_sort_newest')}
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('highest')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    sortBy === 'highest'
                      ? 'bg-surface text-ink shadow-2xs font-extrabold'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {t('wall_sort_highest')}
                </button>
                <button
                  type="button"
                  onClick={() => setSortBy('lowest')}
                  className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all cursor-pointer ${
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

          {/* Rating filter chips & counter */}
          <div className="flex flex-wrap items-center justify-between gap-2.5 pt-1 border-t border-border/60">
            <div className="flex flex-wrap items-center gap-1.5">
              <button
                type="button"
                onClick={() => setRatingFilter(null)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer ${
                  ratingFilter === null
                    ? 'bg-emerald text-white shadow-xs'
                    : 'bg-background-subtle border border-border/70 text-ink-muted hover:text-ink'
                }`}
              >
                {t('action_filter_all')} ({reviews.length})
              </button>
              <button
                type="button"
                onClick={() => setRatingFilter(5)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  ratingFilter === 5
                    ? 'bg-emerald text-white shadow-xs'
                    : 'bg-background-subtle border border-border/70 text-ink-muted hover:text-ink'
                }`}
              >
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>5.0 ({fiveStarReviews})</span>
              </button>
              <button
                type="button"
                onClick={() => setRatingFilter(4)}
                className={`rounded-lg px-3 py-1 text-xs font-bold transition-all cursor-pointer flex items-center gap-1 ${
                  ratingFilter === 4
                    ? 'bg-emerald text-white shadow-xs'
                    : 'bg-background-subtle border border-border/70 text-ink-muted hover:text-ink'
                }`}
              >
                <Star className="size-3 fill-amber-400 text-amber-400" />
                <span>4★+ ({reviews.filter((r) => r.rating >= 4).length})</span>
              </button>
            </div>

            <div className="flex items-center gap-3">
              <span className="text-[11px] font-semibold text-ink-subtle">
                {t('wall_showing_count')
                  .replace('{count}', String(filteredAndSortedReviews.length))
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

      {/* Loading */}
      {loading && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="aspect-square w-full rounded-2xl" />
          <Skeleton className="aspect-square w-full rounded-2xl" />
        </div>
      )}

      {/* Empty State (No reviews at all) */}
      {!loading && reviews.length === 0 && (
        <EmptyState
          icon={Heart}
          title={t('dash_empty_reviews_title')}
          description={t('dash_empty_reviews_desc')}
          actionLabel={t('dash_qr_card_title')}
          actionHref="/dashboard/qr"
        />
      )}

      {/* Empty Search State */}
      {!loading && reviews.length > 0 && filteredAndSortedReviews.length === 0 && (
        <div className="flex flex-col items-center justify-center gap-4 rounded-2xl border border-dashed border-border bg-surface/80 py-16 px-6 text-center shadow-xs animate-fade-in">
          <div className="flex size-12 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-500">
            <Search className="size-6" />
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
            className="mt-1 gap-1.5 font-bold cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            <span>{t('wall_clear_filters')}</span>
          </Button>
        </div>
      )}

      {/* Testimonials Preview Grid */}
      {!loading && filteredAndSortedReviews.length > 0 && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 animate-fade-in">
            {paginatedReviews.map((review) => (
              <div
                key={review.id}
                className="transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
              >
                <GeneratedTestimonialCard
                  status={
                    review.generated_content ? toCardStatus(review.generated_content.status) : 'processing'
                  }
                  data={{
                    merchant: {
                      businessName: merchant.business_name,
                      brandColor: merchant.brand_color,
                    },
                    customerName: review.customer_name ?? undefined,
                    rating: review.rating,
                    reviewText: review.original_text,
                    generatedImageUrl: review.generated_content?.image_url ?? undefined,
                  }}
                />
              </div>
            ))}
          </div>

          {/* Pagination Controls */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            totalItems={filteredAndSortedReviews.length}
            pageSize={pageSize}
            pageSizeOptions={[6, 12, 24]}
            onPageChange={setCurrentPage}
            onPageSizeChange={(newSize) => {
              setPageSize(newSize)
              setCurrentPage(1)
            }}
          />
        </div>
      )}
    </div>
  )
}

export default DashboardWallOfLovePage

