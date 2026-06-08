import { useCrud } from './useCrud'
import {
  accountingPeriodsService,
  type CreateAccountingPeriodRequest,
} from '../services/accountingPeriods.service'
import type { AccountingPeriod } from '../types/domain.types'

export function useAccountingPeriods() {
  const crud = useCrud<
    AccountingPeriod,
    CreateAccountingPeriodRequest,
    Partial<CreateAccountingPeriodRequest>
  >(accountingPeriodsService)

  return { ...crud, fetchPeriods: crud.fetchAll }
}
