import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { AccountingPeriod } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export interface CreateAccountingPeriodRequest {
  name:        string
  year:        number
  month:       number
  periodStart: string
  periodEnd:   string
}

export const accountingPeriodsService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<AccountingPeriod>> {
    return get<PagedResult<AccountingPeriod>>(
      API_ROUTES.ACCOUNTING_PERIODS +
      buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>),
    )
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