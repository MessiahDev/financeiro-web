import { useState, useCallback } from 'react'
import { DEFAULT_PAGE_SIZE } from '../types/pagination.types'

export function usePagination(initialPageSize = DEFAULT_PAGE_SIZE) {
  const [page, setPage]         = useState(1)
  const [pageSize, setPageSize] = useState(initialPageSize)

  const goToPage  = useCallback((p: number) => setPage(Math.max(1, p)), [])
  const nextPage  = useCallback(() => setPage((p) => p + 1), [])
  const prevPage  = useCallback(() => setPage((p) => Math.max(1, p - 1)), [])
  const resetPage = useCallback(() => setPage(1), [])

  return { page, pageSize, setPage, setPageSize, goToPage, nextPage, prevPage, resetPage }
}
