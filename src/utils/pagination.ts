import type { PaginationParams } from '../types/pagination.types'
import { DEFAULT_PAGE_SIZE } from '../types/pagination.types'

export function buildPaginationParams(
  page: number,
  pageSize: number = DEFAULT_PAGE_SIZE,
): PaginationParams {
  return { pageNumber: page, pageSize }
}

export function buildQueryString<T extends object>(params: T): string {
  const query = new URLSearchParams()

  for (const [key, value] of Object.entries(params)) {
    if (value !== null && value !== undefined && value !== '') {
      query.append(key, String(value))
    }
  }

  const str = query.toString()
  return str ? `?${str}` : ''
}

export function getTotalPages(totalCount: number, pageSize: number): number {
  return Math.ceil(totalCount / pageSize)
}
