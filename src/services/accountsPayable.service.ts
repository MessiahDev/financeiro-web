import { get, post, put, del } from './api'
import { buildQueryString } from '../utils/pagination'
import { API_ROUTES } from '../utils/constants'
import type { AccountPayable, CreateAccountPayableRequest, PayAccountPayableRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export interface GetAccountsPayableParams {
  pageNumber?: number
  pageSize?:   number
  status?:     string
  supplierId?: string
  search?:     string
}

export const accountsPayableService = {
  async getAll(params?: GetAccountsPayableParams): Promise<PagedResult<AccountPayable>> {
    return get<PagedResult<AccountPayable>>(
      API_ROUTES.ACCOUNTS_PAYABLE +
      buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>),
    )
  },
  async getById(id: string): Promise<AccountPayable> {
    return get<AccountPayable>(`${API_ROUTES.ACCOUNTS_PAYABLE}/${id}`)
  },
  async create(data: CreateAccountPayableRequest): Promise<AccountPayable> {
    return post<AccountPayable>(API_ROUTES.ACCOUNTS_PAYABLE, data)
  },
  async update(id: string, data: Partial<CreateAccountPayableRequest>): Promise<AccountPayable> {
    return put<AccountPayable>(`${API_ROUTES.ACCOUNTS_PAYABLE}/${id}`, data)
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.ACCOUNTS_PAYABLE}/${id}`)
  },
  async pay(id: string, data: PayAccountPayableRequest): Promise<AccountPayable> {
    return post<AccountPayable>(`${API_ROUTES.ACCOUNTS_PAYABLE}/${id}/pay`, data)
  },
  async cancel(id: string, reason: string): Promise<void> {
    return post<void>(`${API_ROUTES.ACCOUNTS_PAYABLE}/${id}/cancel`, { reason })
  },
}