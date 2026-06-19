import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import type { AccountingPeriod } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export interface CreateAccountingPeriodRequest {
  year:  number
  month: number
}

export const accountingPeriodsService = {
  async getAll(_params?: Record<string, unknown>): Promise<PagedResult<AccountingPeriod>> {
    const data = await get<AccountingPeriod[]>(API_ROUTES.ACCOUNTING_PERIODS)
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
  async getById(id: string): Promise<AccountingPeriod> {
    return get<AccountingPeriod>(`${API_ROUTES.ACCOUNTING_PERIODS}/${id}`)
  },
  async create(data: CreateAccountingPeriodRequest): Promise<AccountingPeriod> {
    return post<AccountingPeriod>(API_ROUTES.ACCOUNTING_PERIODS, data)
  },
  async update(id: string, data: Partial<CreateAccountingPeriodRequest>): Promise<AccountingPeriod> {
    return put<AccountingPeriod>(`${API_ROUTES.ACCOUNTING_PERIODS}/${id}`, data)
  },
  async close(id: string): Promise<void> {
    return post<void>(`${API_ROUTES.ACCOUNTING_PERIODS}/${id}/close`, {})
  },
  async reopen(id: string): Promise<void> {
    return post<void>(`${API_ROUTES.ACCOUNTING_PERIODS}/${id}/reopen`, {})
  },
  async lock(id: string): Promise<void> {
    return post<void>(`${API_ROUTES.ACCOUNTING_PERIODS}/${id}/lock`, {})
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.ACCOUNTING_PERIODS}/${id}`)
  },
}