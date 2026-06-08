import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { Budget, CreateBudgetRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export type UpdateBudgetRequest = Partial<CreateBudgetRequest>

export const budgetsService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<Budget>> {
    return get<PagedResult<Budget>>(
      API_ROUTES.BUDGETS +
      buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>),
    )
  },
  async getById(id: string): Promise<Budget> {
    return get<Budget>(`${API_ROUTES.BUDGETS}/${id}`)
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
  async approve(id: string): Promise<Budget> {
    return post<Budget>(`${API_ROUTES.BUDGETS}/${id}/approve`, {})
  },
  async close(id: string): Promise<void> {
    return post<void>(`${API_ROUTES.BUDGETS}/${id}/close`, {})
  },
}
