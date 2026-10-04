import * as React from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react'

import { Button } from '@/components/ui/button'
import { useLanguage } from '@/lib/language-context'

export interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
  totalItems?: number
  pageSize?: number
  pageSizeOptions?: number[]
  onPageSizeChange?: (pageSize: number) => void
  className?: string
  showSummary?: boolean
  siblingCount?: number
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  totalItems,
  pageSize,
  pageSizeOptions,
  onPageSizeChange,
  className = '',
  showSummary = true,
  siblingCount = 1,
}: PaginationProps) {
  const { isRTL, t } = useLanguage()

  // Generate pagination range with smart ellipsis (called unconditionally before early return)
  const paginationRange = React.useMemo(() => {
    if (totalPages <= 1) return []
    const totalPageNumbers = siblingCount + 5 // first, last, current, 2*sibling, 2*dots

    if (totalPageNumbers >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1)
    }

    const leftSiblingIndex = Math.max(currentPage - siblingCount, 1)
    const rightSiblingIndex = Math.min(currentPage + siblingCount, totalPages)

    const shouldShowLeftDots = leftSiblingIndex > 2
    const shouldShowRightDots = rightSiblingIndex < totalPages - 2

    const firstPageIndex = 1
    const lastPageIndex = totalPages

    if (!shouldShowLeftDots && shouldShowRightDots) {
      const leftItemCount = 3 + 2 * siblingCount
      const leftRange = Array.from({ length: leftItemCount }, (_, i) => i + 1)
      return [...leftRange, 'DOTS', totalPages]
    }

    if (!shouldShowLeftDots && !shouldShowRightDots) {
      const rightItemCount = 3 + 2 * siblingCount
      const rightRange = Array.from(
        { length: rightItemCount },
        (_, i) => totalPages - rightItemCount + i + 1,
      )
      return [firstPageIndex, 'DOTS', ...rightRange]
    }

    if (shouldShowLeftDots && shouldShowRightDots) {
      const middleRange = Array.from(
        { length: rightSiblingIndex - leftSiblingIndex + 1 },
        (_, i) => leftSiblingIndex + i,
      )
      return [firstPageIndex, 'DOTS', ...middleRange, 'DOTS', lastPageIndex]
    }

    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }, [totalPages, siblingCount, currentPage])

  if (totalPages <= 1 && (!totalItems || totalItems <= (pageSize ?? 10))) {
    return null
  }

  const fromItem = totalItems && pageSize ? (currentPage - 1) * pageSize + 1 : 0
  const toItem = totalItems && pageSize ? Math.min(currentPage * pageSize, totalItems) : 0

  const PrevIcon = isRTL ? ChevronRight : ChevronLeft
  const NextIcon = isRTL ? ChevronLeft : ChevronRight
  const FirstIcon = isRTL ? ChevronsRight : ChevronsLeft
  const LastIcon = isRTL ? ChevronsLeft : ChevronsRight

  return (
    <nav
      role="navigation"
      aria-label={isRTL ? 'التنقل بين الصفحات' : 'Pagination Navigation'}
      className={`flex flex-col sm:flex-row items-center justify-between gap-3 pt-4 border-t border-border/70 ${className}`}
    >
      {/* Summary info & Page size switcher */}
      <div className="flex flex-wrap items-center gap-3 text-xs text-ink-muted">
        {showSummary && totalItems !== undefined && (
          <span className="font-semibold">
            {isRTL
              ? `عرض ${fromItem} - ${toItem} من إجمالي ${totalItems}`
              : `Showing ${fromItem} - ${toItem} of ${totalItems}`}
          </span>
        )}

        {pageSizeOptions && pageSize && onPageSizeChange && (
          <div className="flex items-center gap-1.5 ms-auto sm:ms-0">
            <span className="text-[11px] text-ink-subtle">{t('pagination_per_page') || (isRTL ? 'لكل صفحة:' : 'per page:')}</span>
            <div className="flex items-center gap-1 bg-background-subtle/80 p-0.5 rounded-lg border border-border/70">
              {pageSizeOptions.map((size) => (
                <button
                  key={size}
                  type="button"
                  onClick={() => onPageSizeChange(size)}
                  className={`px-2 py-0.5 rounded-md text-[11px] font-bold transition-all cursor-pointer ${
                    pageSize === size
                      ? 'bg-surface text-emerald font-extrabold shadow-2xs border border-border/60'
                      : 'text-ink-muted hover:text-ink'
                  }`}
                >
                  {size}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-1">
        {/* First Page */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(1)}
          disabled={currentPage <= 1}
          aria-label={isRTL ? 'الصفحة الأولى' : 'First page'}
          className="size-8 rounded-xl border-border/70 text-ink-muted hover:text-ink disabled:opacity-30 cursor-pointer shadow-2xs"
          title={isRTL ? 'الصفحة الأولى' : 'First page'}
        >
          <FirstIcon className="size-3.5" />
        </Button>

        {/* Previous Page */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage <= 1}
          aria-label={isRTL ? 'الصفحة السابقة' : 'Previous page'}
          className="h-8 px-2.5 rounded-xl border-border/70 text-ink-muted hover:text-ink disabled:opacity-30 gap-1 text-xs font-bold cursor-pointer shadow-2xs"
        >
          <PrevIcon className="size-3.5" />
          <span className="hidden sm:inline">{t('pagination_prev') || (isRTL ? 'السابق' : 'Prev')}</span>
        </Button>

        {/* Page Numbers */}
        <div className="flex items-center gap-1 px-1">
          {paginationRange.map((pageNumber, idx) => {
            if (pageNumber === 'DOTS') {
              return (
                <span
                  key={`dots-${idx}`}
                  className="px-1.5 text-xs font-bold text-ink-subtle select-none"
                >
                  …
                </span>
              )
            }

            const page = pageNumber as number
            const isActive = page === currentPage

            return (
              <button
                key={page}
                type="button"
                onClick={() => onPageChange(page)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex size-8 items-center justify-center rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                  isActive
                    ? 'bg-emerald text-white shadow-sm ring-2 ring-emerald-500/20 scale-105'
                    : 'bg-surface/80 border border-border/70 text-ink-muted hover:text-ink hover:border-emerald-border hover:bg-surface shadow-2xs active:scale-95'
                }`}
              >
                {page}
              </button>
            )
          })}
        </div>

        {/* Next Page */}
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage >= totalPages}
          aria-label={isRTL ? 'الصفحة التالية' : 'Next page'}
          className="h-8 px-2.5 rounded-xl border-border/70 text-ink-muted hover:text-ink disabled:opacity-30 gap-1 text-xs font-bold cursor-pointer shadow-2xs"
        >
          <span className="hidden sm:inline">{t('pagination_next') || (isRTL ? 'التالي' : 'Next')}</span>
          <NextIcon className="size-3.5" />
        </Button>

        {/* Last Page */}
        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() => onPageChange(totalPages)}
          disabled={currentPage >= totalPages}
          aria-label={isRTL ? 'الصفحة الأخيرة' : 'Last page'}
          className="size-8 rounded-xl border-border/70 text-ink-muted hover:text-ink disabled:opacity-30 cursor-pointer shadow-2xs"
          title={isRTL ? 'الصفحة الأخيرة' : 'Last page'}
        >
          <LastIcon className="size-3.5" />
        </Button>
      </div>
    </nav>
  )
}
