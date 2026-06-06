import type { AuditFields } from './common.types'
import type { BudgetStatus } from './enums'

export interface Budget extends AuditFields {
  id: string
  name: string
  fiscalYear: number
  startDate: string
  endDate: string
  status: BudgetStatus
  totalPlanned: number
  totalActual: number
  variance: number
  items: BudgetItem[]
}

export interface BudgetItem {
  id: string
  budgetId: string
  chartOfAccountId: string
  chartOfAccountName: string
  costCenterId?: string
  costCenterName?: string
  plannedAmount: number
  actualAmount: number
  variance: number
}