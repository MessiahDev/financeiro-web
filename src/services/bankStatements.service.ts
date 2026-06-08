import { get, post, del } from './api'
import { API_ROUTES } from '../utils/constants'
import { buildQueryString } from '../utils/pagination'
import type { BankStatement, BankReconciliation } from '../types/domain.types'
import type { PagedResult } from '../types/pagination.types'

const BANK_RECONCILIATIONS = '/bank-reconciliations'

export interface ImportBankStatementRequest {
  bankAccountId:  string
  referenceDate:  string
  openingBalance: number
  closingBalance: number
}

export interface CreateBankReconciliationRequest {
  bankAccountId:  string
  statementDate:  string
  openingBalance: number
  closingBalance: number
}

export const bankStatementsService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<BankStatement>> {
    return get<PagedResult<BankStatement>>(
      API_ROUTES.BANK_STATEMENTS +
      buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>),
    )
  },
  async getById(id: string): Promise<BankStatement> {
    return get<BankStatement>(`${API_ROUTES.BANK_STATEMENTS}/${id}`)
  },
  async import(data: ImportBankStatementRequest): Promise<BankStatement> {
    return post<BankStatement>(API_ROUTES.BANK_STATEMENTS, data)
  },
  async cancel(id: string, reason: string): Promise<void> {
    return post<void>(`${API_ROUTES.BANK_STATEMENTS}/${id}/cancel`, { reason })
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${API_ROUTES.BANK_STATEMENTS}/${id}`)
  },
}

export const bankReconciliationsService = {
  async getAll(params?: Record<string, unknown>): Promise<PagedResult<BankReconciliation>> {
    return get<PagedResult<BankReconciliation>>(
      BANK_RECONCILIATIONS +
      buildQueryString((params ?? {}) as Record<string, string | number | boolean | null | undefined>),
    )
  },
  async getById(id: string): Promise<BankReconciliation> {
    return get<BankReconciliation>(`${BANK_RECONCILIATIONS}/${id}`)
  },
  async create(data: CreateBankReconciliationRequest): Promise<BankReconciliation> {
    return post<BankReconciliation>(BANK_RECONCILIATIONS, data)
  },
  async complete(id: string): Promise<void> {
    return post<void>(`${BANK_RECONCILIATIONS}/${id}/complete`, {})
  },
  async cancel(id: string, reason: string): Promise<void> {
    return post<void>(`${BANK_RECONCILIATIONS}/${id}/cancel`, { reason })
  },
  async delete(id: string): Promise<void> {
    return del<void>(`${BANK_RECONCILIATIONS}/${id}`)
  },
}
