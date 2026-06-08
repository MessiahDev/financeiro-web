import { get, post, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type {
  TaxEntry,
  TaxPayment,
  CreateTaxEntryRequest,
  CreateTaxPaymentRequest,
} from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export const taxEntriesService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<TaxEntry>> {
    return get<PagedResult<TaxEntry>>(
      API_ROUTES.TAX_ENTRIES +
      buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>),
    )
  },
  async getById(id: string): Promise<TaxEntry> {
    return get<TaxEntry>(`${API_ROUTES.TAX_ENTRIES}/${id}`)
  },
  // CORRIGIDO: data tipado com CreateTaxEntryRequest (era unknown)
  async create(data: CreateTaxEntryRequest): Promise<TaxEntry> {
    return post<TaxEntry>(API_ROUTES.TAX_ENTRIES, data)
  },
  async cancel(id: string, reason: string): Promise<void> {
    return post<void>(`${API_ROUTES.TAX_ENTRIES}/${id}/cancel`, { reason })
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.TAX_ENTRIES}/${id}`)
  },
  // CORRIGIDO: data tipado com CreateTaxPaymentRequest (era unknown)
  async pay(id: string, data: CreateTaxPaymentRequest): Promise<TaxPayment> {
    return post<TaxPayment>(`${API_ROUTES.TAX_ENTRIES}/${id}/payments`, data)
  },
}
