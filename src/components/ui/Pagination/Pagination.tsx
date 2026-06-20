import { Button } from '../Button/Button'

interface PaginationProps {
  currentPage:  number
  totalPages:   number
  onPageChange: (page: number) => void
  showEdges?:   boolean
  className?:   string
}

export function Pagination({
  currentPage,
  totalPages,
  onPageChange,
  showEdges = true,
  className = '',
}: PaginationProps) {
  if (totalPages <= 1) return null

  function getPages(): (number | '...')[] {
    const delta = 2
    const range: number[] = []
    for (
      let i = Math.max(2, currentPage - delta);
      i <= Math.min(totalPages - 1, currentPage + delta);
      i++
    ) {
      range.push(i)
    }

    const pages: (number | '...')[] = [1]
    if (range[0] > 2)              pages.push('...')
    pages.push(...range)
    if (range[range.length - 1] < totalPages - 1) pages.push('...')
    if (totalPages > 1)            pages.push(totalPages)
    return pages
  }

  return (
    <div className={['flex items-center gap-1', className].join(' ')}>
      {showEdges && (
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === 1}
          onClick={() => onPageChange(1)}
          aria-label="Primeira"
        >«</Button>
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === 1}
        onClick={() => onPageChange(currentPage - 1)}
        aria-label="Anterior"
      >‹</Button>

      {getPages().map((page, i) =>
        page === '...' ? (
          <span key={`ellipsis-${i}`} className="px-2 text-sm text-slate-400">…</span>
        ) : (
          <button
            key={page}
            onClick={() => onPageChange(page)}
            aria-current={page === currentPage ? 'page' : undefined}
            className={[
              'flex h-8 w-8 items-center justify-center rounded-lg text-sm font-medium transition-colors',
              page === currentPage
                ? 'bg-blue-600 text-white'
                : 'text-slate-600 hover:bg-slate-100',
            ].join(' ')}
          >
            {page}
          </button>
        ),
      )}

      <Button
        variant="ghost"
        size="sm"
        disabled={currentPage === totalPages}
        onClick={() => onPageChange(currentPage + 1)}
        aria-label="Proxima"
      >›</Button>

      {showEdges && (
        <Button
          variant="ghost"
          size="sm"
          disabled={currentPage === totalPages}
          onClick={() => onPageChange(totalPages)}
          aria-label="Ultima"
        >»</Button>
      )}
    </div>
  )
}
