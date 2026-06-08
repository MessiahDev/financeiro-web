import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { AccountReceivable } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export interface CreateAccountReceivableRequest {
  customerId: string; description: string; amount: number; dueDate: string
  bankAccountId?: string; costCenterId?: string; chartOfAccountId?: string
}
export interface ReceivePaymentRequest {
  receiptDate: string; amount: number; bankAccountId: string
}

export const accountsReceivableService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<AccountReceivable>> {
    return get<PagedResult<AccountReceivable>>(API_ROUTES.ACCOUNTS_RECEIVABLE + buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>))
  },
  async getById(id: string): Promise<AccountReceivable> {
    return get<AccountReceivable>(`${API_ROUTES.ACCOUNTS_RECEIVABLE}/${id}`)
  },
  async create(data: CreateAccountReceivableRequest): Promise<AccountReceivable> {
    return post<AccountReceivable>(API_ROUTES.ACCOUNTS_RECEIVABLE, data)
  },
  async update(id: string, data: Partial<CreateAccountReceivableRequest>): Promise<AccountReceivable> {
    return put<AccountReceivable>(`${API_ROUTES.ACCOUNTS_RECEIVABLE}/${id}`, data)
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.ACCOUNTS_RECEIVABLE}/${id}`)
  },
  async receive(id: string, data: ReceivePaymentRequest): Promise<AccountReceivable> {
    return post<AccountReceivable>(`${API_ROUTES.ACCOUNTS_RECEIVABLE}/${id}/receive`, data)
  },
  async cancel(id: string, reason: string): Promise<void> {
    return post<void>(`${API_ROUTES.ACCOUNTS_RECEIVABLE}/${id}/cancel`, { reason })
  },
}