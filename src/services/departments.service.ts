import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { Department } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export interface CreateDepartmentRequest {
  name:          string
  code:          string
  managerId?:    string
  costCenterId?: string
}

export interface UpdateDepartmentRequest extends Partial<CreateDepartmentRequest> {}

export const departmentsService = {
  async getAll(params?: { pageNumber?: number; pageSize?: number; search?: string }): Promise<PagedResult<Department>> {
    return get<PagedResult<Department>>(API_ROUTES.DEPARTMENTS + buildQueryString(params ?? {}))
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