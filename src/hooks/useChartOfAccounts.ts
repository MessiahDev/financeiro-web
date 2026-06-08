import { useCrud } from './useCrud'
import {
  chartOfAccountsService,
  type CreateChartOfAccountRequest,
  type UpdateChartOfAccountRequest,
} from '../services/chartOfAccounts.service'
import type { ChartOfAccount } from '../types/domain.types'

export function useChartOfAccounts() {
  const crud = useCrud<
    ChartOfAccount,
    CreateChartOfAccountRequest,
    UpdateChartOfAccountRequest
  >(chartOfAccountsService)

  return { ...crud, fetchAccounts: crud.fetchAll }
}
