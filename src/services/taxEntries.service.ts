import { get, post, del } from './api'
import { API_ROUTES } from '../utils/constants'
import type {
  TaxEntry,
  TaxPayment,
  CreateTaxEntryRequest,
  CreateTaxPaymentRequest,
} from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export const taxEntriesService = {
  async getAll(_params?: Record<string, unknown>): Promise<PagedResult<TaxEntry>> {
    const data = await get<TaxEntry[]>(API_ROUTES.TAX_ENTRIES)
    return {
      items:           data ?? [],
      totalCount:      data?.length ?? 0,
      totalPages:      1,
      pageNumber:      1,
      pageSize:        data?.length ?? 0,
      hasPreviousPage: false,
      hasNextPage:     false,
    }
  },
  async getById(id: string): Promise<TaxEntry> {
    return get<TaxEntry>(`${API_ROUTES.TAX_ENTRIES}/${id}`)
  },
  async create(data: CreateTaxEntryRequest): Promise<TaxEntry> {
    return post<TaxEntry>(API_ROUTES.TAX_ENTRIES, data)
  },
  async cancel(id: string, reason: string): Promise<void> {
    return post<void>(`${API_ROUTES.TAX_ENTRIES}/${id}/cancel`, { reason })
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.TAX_ENTRIES}/${id}`)
  },
  async pay(id: string, data: CreateTaxPaymentRequest): Promise<TaxPayment> {
    return post<TaxPayment>(`${API_ROUTES.TAX_ENTRIES}/${id}/payments`, data)
  },
}