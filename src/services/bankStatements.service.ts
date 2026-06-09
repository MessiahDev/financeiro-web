import { get, post, del } from './api'
import { API_ROUTES } from '../utils/constants'
import type { BankStatement, ImportBankStatementRequest } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

export const bankStatementsService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<BankStatement>> {
    const { bankAccountId, from, to } = params ?? {}
    const query = new URLSearchParams()
    if (bankAccountId) query.set('bankAccountId', String(bankAccountId))
    if (from)          query.set('from', String(from))
    if (to)            query.set('to', String(to))
    const qs = query.toString() ? `?${query.toString()}` : ''
    const data = await get<BankStatement[]>(`${API_ROUTES.BANK_STATEMENTS}${qs}`)
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
  async getById(id: string): Promise<BankStatement> {
    return get<BankStatement>(`${API_ROUTES.BANK_STATEMENTS}/${id}`)
  },
  async import(data: ImportBankStatementRequest): Promise<BankStatement> {
    return post<BankStatement>(API_ROUTES.BANK_STATEMENTS, data)
  },
  async cancel(id: string, reason: string): Promise<BankStatement> {
    return post<BankStatement>(`${API_ROUTES.BANK_STATEMENTS}/${id}/cancel`, { reason })
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.BANK_STATEMENTS}/${id}`)
  },
}