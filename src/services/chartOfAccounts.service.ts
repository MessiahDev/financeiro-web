import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { ChartOfAccount, CreateChartOfAccountRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export type { CreateChartOfAccountRequest }
export type UpdateChartOfAccountRequest = Partial<CreateChartOfAccountRequest>

export const chartOfAccountsService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<ChartOfAccount>> {
    return get<PagedResult<ChartOfAccount>>(
      API_ROUTES.CHART_OF_ACCOUNTS +
      buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>),
    )
  },
  async getById(id: string): Promise<ChartOfAccount> {
    return get<ChartOfAccount>(`${API_ROUTES.CHART_OF_ACCOUNTS}/${id}`)
  },
  async create(data: CreateChartOfAccountRequest): Promise<ChartOfAccount> {
    return post<ChartOfAccount>(API_ROUTES.CHART_OF_ACCOUNTS, data)
  },
  async update(id: string, data: UpdateChartOfAccountRequest): Promise<ChartOfAccount> {
    return put<ChartOfAccount>(`${API_ROUTES.CHART_OF_ACCOUNTS}/${id}`, data)
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.CHART_OF_ACCOUNTS}/${id}`)
  },
  async deactivate(id: string): Promise<void> {
    return post<void>(`${API_ROUTES.CHART_OF_ACCOUNTS}/${id}/deactivate`, {})
  },
}
