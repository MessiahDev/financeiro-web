import { get } from './api'
import { API_ROUTES } from '../utils/constants'
import type { FinancialSummary, TrialBalance } from '../types/domain.types'

export const reportsService = {
  async getFinancialSummary(params: { periodStart: string; periodEnd: string }): Promise<FinancialSummary> {
    return get<FinancialSummary>(API_ROUTES.REPORTS + '/financial-summary', params)
  },

  async getTrialBalance(accountingPeriodId: string): Promise<TrialBalance> {
    return get<TrialBalance>(API_ROUTES.JOURNAL_ENTRIES + '/trial-balance', { accountingPeriodId })
  },
}