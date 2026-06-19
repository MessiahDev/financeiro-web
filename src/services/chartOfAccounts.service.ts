import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import type { ChartOfAccount, CreateChartOfAccountRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export type { CreateChartOfAccountRequest }
export type UpdateChartOfAccountRequest = Partial<CreateChartOfAccountRequest>

export const chartOfAccountsService = {
  async getAll(_params?: Record<string, unknown>): Promise<PagedResult<ChartOfAccount>> {
    const data = await get<ChartOfAccount[]>(API_ROUTES.CHART_OF_ACCOUNTS)
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