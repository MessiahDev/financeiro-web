import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
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
  async getAll(_params?: GetSuppliersParams): Promise<PagedResult<Supplier>> {
    const data = await get<Supplier[]>(API_ROUTES.SUPPLIERS)
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