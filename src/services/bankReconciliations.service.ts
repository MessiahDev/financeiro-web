import { get, post } from './api'
import { API_ROUTES } from '../utils/constants'
import type { BankReconciliation, CreateBankReconciliationRequest, AddReconciliationItemRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export const bankReconciliationsService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<BankReconciliation>> {
    const { bankAccountId, status } = params ?? {}
    const query = new URLSearchParams()
    if (bankAccountId) query.set('bankAccountId', String(bankAccountId))
    if (status)        query.set('status', String(status))
    const qs = query.toString() ? `?${query.toString()}` : ''
    const data = await get<BankReconciliation[]>(`${API_ROUTES.BANK_RECONCILIATIONS}${qs}`)
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

  async getById(id: string): Promise<BankReconciliation> {
    return get<BankReconciliation>(`${API_ROUTES.BANK_RECONCILIATIONS}/${id}`)
  },

  async create(data: CreateBankReconciliationRequest): Promise<BankReconciliation> {
    return post<BankReconciliation>(API_ROUTES.BANK_RECONCILIATIONS, data)
  },

  async addItem(id: string, data: AddReconciliationItemRequest): Promise<BankReconciliation> {
    return post<BankReconciliation>(`${API_ROUTES.BANK_RECONCILIATIONS}/${id}/items`, data)
  },

  async complete(id: string, completedBy: string): Promise<BankReconciliation> {
    return post<BankReconciliation>(`${API_ROUTES.BANK_RECONCILIATIONS}/${id}/complete`, { completedBy })
  },

  async cancel(id: string, reason: string): Promise<BankReconciliation> {
    return post<BankReconciliation>(`${API_ROUTES.BANK_RECONCILIATIONS}/${id}/cancel`, { reason })
  },
}