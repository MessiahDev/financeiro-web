import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import type { AccountReceivable, CreateAccountReceivableRequest, ReceivePaymentRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export const accountsReceivableService = {
  async getAll(_params?: Record<string, unknown>): Promise<PagedResult<AccountReceivable>> {
    const data = await get<AccountReceivable[]>(API_ROUTES.ACCOUNTS_RECEIVABLE)
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