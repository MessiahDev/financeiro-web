import type { AuditFields } from './common.types'
import type { AccountingPeriodStatus } from './enums'

export interface AccountingPeriod extends AuditFields {
  id: string
  name: string
  startDate: string
  endDate: string
  status: AccountingPeriodStatus
  fiscalYear: number
}