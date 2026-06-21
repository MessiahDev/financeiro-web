import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
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
  async getAll(params?: GetCustomersParams): Promise<PagedResult<Customer>> {
    return get<PagedResult<Customer>>(
      API_ROUTES.CUSTOMERS +
      buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>),
    )
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