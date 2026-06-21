import { get, post, put, del } from './api'
import { buildQueryString } from '../utils/pagination'
import { API_ROUTES } from '../utils/constants'
import type { CostCenter, CreateCostCenterRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export type UpdateCostCenterRequest = Partial<CreateCostCenterRequest>

export const costCentersService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<CostCenter>> {
    return get<PagedResult<CostCenter>>(
      API_ROUTES.COST_CENTERS +
      buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>),
    )
  },
  async getById(id: string): Promise<CostCenter> {
    return get<CostCenter>(`${API_ROUTES.COST_CENTERS}/${id}`)
  },
  async create(data: CreateCostCenterRequest): Promise<CostCenter> {
    return post<CostCenter>(API_ROUTES.COST_CENTERS, data)
  },
  async update(id: string, data: UpdateCostCenterRequest): Promise<CostCenter> {
    return put<CostCenter>(`${API_ROUTES.COST_CENTERS}/${id}`, data)
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.COST_CENTERS}/${id}`)
  },
}