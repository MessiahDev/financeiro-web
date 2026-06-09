import { useCrud } from './useCrud'
import { chartOfAccountsService } from '../services/chartOfAccounts.service'
import type { ChartOfAccount, CreateChartOfAccountRequest } from '../types/domain.types'

export function useChartOfAccounts() {
  const crud = useCrud<ChartOfAccount, CreateChartOfAccountRequest, Partial<CreateChartOfAccountRequest>>(chartOfAccountsService)
  return { ...crud }
}