import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import type { Customer, CreateCustomerRequest, UpdateCustomerRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export interface GetCustomersParams {
  pageNumber?: number
  pageSize?:   number
  search?:     string
  status?:     string
  personType?: string
}

export const customersService = {
  async getAll(_params?: GetCustomersParams): Promise<PagedResult<Customer>> {
    const data = await get<Customer[]>(API_ROUTES.CUSTOMERS)
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
  async getById(id: string): Promise<Customer> {
    return get<Customer>(`${API_ROUTES.CUSTOMERS}/${id}`)
  },
  async create(data: CreateCustomerRequest): Promise<Customer> {
    return post<Customer>(API_ROUTES.CUSTOMERS, data)
  },
  async update(id: string, data: UpdateCustomerRequest): Promise<Customer> {
    return put<Customer>(`${API_ROUTES.CUSTOMERS}/${id}`, data)
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.CUSTOMERS}/${id}`)
  },
  async block(id: string, reason: string): Promise<void> {
    return post<void>(`${API_ROUTES.CUSTOMERS}/${id}/block`, { reason })
  },
}