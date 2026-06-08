import { get, post, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { Transaction, CreateTransactionRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export const transactionsService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<Transaction>> {
    return get<PagedResult<Transaction>>(
      API_ROUTES.TRANSACTIONS +
      buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>),
    )
  },
  async getById(id: string): Promise<Transaction> {
    return get<Transaction>(`${API_ROUTES.TRANSACTIONS}/${id}`)
  },
  async create(data: CreateTransactionRequest): Promise<Transaction> {
    return post<Transaction>(API_ROUTES.TRANSACTIONS, data)
  },
  async confirm(id: string): Promise<Transaction> {
    return post<Transaction>(`${API_ROUTES.TRANSACTIONS}/${id}/confirm`, {})
  },
  async cancel(id: string, reason: string): Promise<void> {
    return post<void>(`${API_ROUTES.TRANSACTIONS}/${id}/cancel`, { reason })
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.TRANSACTIONS}/${id}`)
  },
}
