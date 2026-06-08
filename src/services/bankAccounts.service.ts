import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { BankAccount } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export interface CreateBankAccountRequest {
  bankName: string; accountNumber: string; agency: string; accountType: string; initialBalance?: number
}
export interface TransferBetweenAccountsRequest {
  sourceAccountId: string; destinationAccountId: string; amount: number; description: string
}

export const bankAccountsService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<BankAccount>> {
    return get<PagedResult<BankAccount>>(API_ROUTES.BANK_ACCOUNTS + buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>))
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