import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { Supplier, CreateSupplierRequest, UpdateSupplierRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export interface GetSuppliersParams {
  pageNumber?: number
  pageSize?:   number
  search?:     string
  status?:     string
  personType?: string
}

export const suppliersService = {
  async getAll(params?: GetSuppliersParams): Promise<PagedResult<Supplier>> {
    return get<PagedResult<Supplier>>(API_ROUTES.SUPPLIERS + buildQueryString(params ?? {}))
  },
  async getById(id: string): Promise<Supplier> {
    return get<Supplier>(`${API_ROUTES.SUPPLIERS}/${id}`)
  },
  async create(data: CreateSupplierRequest): Promise<Supplier> {
    return post<Supplier>(API_ROUTES.SUPPLIERS, data)
  },
  async update(id: string, data: UpdateSupplierRequest): Promise<Supplier> {
    return put<Supplier>(`${API_ROUTES.SUPPLIERS}/${id}`, data)
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.SUPPLIERS}/${id}`)
  },
  async block(id: string, reason: string): Promise<void> {
    return post<void>(`${API_ROUTES.SUPPLIERS}/${id}/block`, { reason })
  },
}