import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import type { Department, CreateDepartmentRequest, UpdateDepartmentRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export type { CreateDepartmentRequest, UpdateDepartmentRequest }

export const departmentsService = {
  async getAll(_params?: Record<string, unknown>): Promise<PagedResult<Department>> {
    const data = await get<Department[]>(API_ROUTES.DEPARTMENTS)
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
  async getById(id: string): Promise<Department> {
    return get<Department>(`${API_ROUTES.DEPARTMENTS}/${id}`)
  },
  async create(data: CreateDepartmentRequest): Promise<Department> {
    return post<Department>(API_ROUTES.DEPARTMENTS, data)
  },
  async update(id: string, data: UpdateDepartmentRequest): Promise<Department> {
    return put<Department>(`${API_ROUTES.DEPARTMENTS}/${id}`, data)
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.DEPARTMENTS}/${id}`)
  },
}