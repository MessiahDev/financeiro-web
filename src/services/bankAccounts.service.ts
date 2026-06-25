import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import type { BankAccount, CreateBankAccountRequest, TransferBetweenAccountsRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export const bankAccountsService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<BankAccount>> {
    return get<PagedResult<BankAccount>>(API_ROUTES.BANK_ACCOUNTS, params)
  },
  async getById(id: string): Promise<BankAccount> {
    return get<BankAccount>(`${API_ROUTES.BANK_ACCOUNTS}/${id}`)
  },
  async create(data: CreateBankAccountRequest): Promise<BankAccount> {
    return post<BankAccount>(API_ROUTES.BANK_ACCOUNTS, data)
  },
  async update(id: string, data: Partial<CreateBankAccountRequest>): Promise<BankAccount> {
    return put<BankAccount>(`${API_ROUTES.BANK_ACCOUNTS}/${id}`, data)
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.BANK_ACCOUNTS}/${id}`)
  },
  async transfer(data: TransferBetweenAccountsRequest): Promise<void> {
    return post<void>(`${API_ROUTES.BANK_ACCOUNTS}/transfer`, data)
  },
}