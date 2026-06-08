// =============================================================================
// TablePagination.tsx
// =============================================================================

import type { PagedResult } from '../../../types/pagination.types'
import { PAGE_SIZE_OPTIONS } from '../../../types/pagination.types'
import { Button } from '../Button/Button'

interface TablePaginationProps {
  pagination: Pick<PagedResult<unknown>, 'totalCount' | 'pageNumber' | 'pageSize' | 'totalPages' | 'hasPreviousPage' | 'hasNextPage'>
  onPageChange: (page: number) => void
  onPageSizeChange?: (size: number) => void
}

export function TablePagination({
  pagination,
  onPageChange,
  onPageSizeChange,
}: TablePaginationProps) {
  const { totalCount, pageNumber, pageSize, totalPages, hasPreviousPage, hasNextPage } = pagination

  const from = Math.min((pageNumber - 1) * pageSize + 1, totalCount)
  const to   = Math.min(pageNumber * pageSize, totalCount)

  return (
    <div className="flex flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between">
      <p className="text-sm text-slate-500">
        Exibindo <span className="font-medium text-slate-700">{from}–{to}</span> de{' '}
        <span className="font-medium text-slate-700">{totalCount}</span> registros
      </p>

      <div className="flex items-center gap-3">
        {onPageSizeChange && (
          <div className="flex items-center gap-2">
            <span className="text-sm text-slate-500">Por pagina:</span>
            <select
              value={pageSize}
              onChange={(e) => onPageSizeChange(Number(e.target.value))}
              className="rounded-lg border border-slate-300 bg-white px-2 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {PAGE_SIZE_OPTIONS.map((s) => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
        )}

        <div className="flex items-center gap-1">
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasPreviousPage}
            onClick={() => onPageChange(1)}
            aria-label="Primeira pagina"
          >
            «
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasPreviousPage}
            onClick={() => onPageChange(pageNumber - 1)}
            aria-label="Pagina anterior"
          >
            ‹
          </Button>

          <span className="px-3 text-sm text-slate-600">
            {pageNumber} / {totalPages}
          </span>

          <Button
            variant="ghost"
            size="sm"
            disabled={!hasNextPage}
            onClick={() => onPageChange(pageNumber + 1)}
            aria-label="Proxima pagina"
          >
            ›
          </Button>
          <Button
            variant="ghost"
            size="sm"
            disabled={!hasNextPage}
            onClick={() => onPageChange(totalPages)}
            aria-label="Ultima pagina"
          >
            »
          </Button>
        </div>
      </div>
    </div>
  )
}
