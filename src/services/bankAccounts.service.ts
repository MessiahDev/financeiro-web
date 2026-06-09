import { get, post, put, del } from './api'
import { API_ROUTES } from '../utils/constants'
import type { BankAccount } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export interface CreateBankAccountRequest {
  bankName:        string
  bankCode:        string
  accountNumber:   string
  agency:          string
  accountType:     string
  initialBalance?: number
  pixKey?:         string
  description?:    string
}

export interface TransferBetweenAccountsRequest {
  sourceAccountId:      string
  destinationAccountId: string
  amount:               number
  description:          string
}

export const bankAccountsService = {
  async getAll(_params?: Record<string, unknown>): Promise<PagedResult<BankAccount>> {
  const data = await get<BankAccount[]>(API_ROUTES.BANK_ACCOUNTS)
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