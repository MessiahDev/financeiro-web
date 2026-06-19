import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import type { Budget, CreateBudgetRequest, BudgetVsActual } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export type UpdateBudgetRequest = Partial<CreateBudgetRequest>

export const budgetsService = {
  async getAll(_params?: Record<string, unknown>): Promise<PagedResult<Budget>> {
    const data = await get<Budget[]>(API_ROUTES.BUDGETS)
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
  async getById(id: string): Promise<Budget> {
    return get<Budget>(`${API_ROUTES.BUDGETS}/${id}`)
  },
  async getVsActual(id: string): Promise<BudgetVsActual> {
    return get<BudgetVsActual>(`${API_ROUTES.BUDGETS}/${id}/vs-actual`)
  },
  async create(data: CreateBudgetRequest): Promise<Budget> {
    return post<Budget>(API_ROUTES.BUDGETS, data)
  },
  async update(id: string, data: UpdateBudgetRequest): Promise<Budget> {
    return put<Budget>(`${API_ROUTES.BUDGETS}/${id}`, data)
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.BUDGETS}/${id}`)
  },
  async approve(id: string, approvedBy: string): Promise<Budget> {
    return post<Budget>(`${API_ROUTES.BUDGETS}/${id}/approve`, { approvedBy })
  },
  async close(id: string): Promise<void> {
    return post<void>(`${API_ROUTES.BUDGETS}/${id}/close`, {})
  },
}