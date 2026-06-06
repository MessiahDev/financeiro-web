import type { AuditFields } from './common.types'
import type { AccountReceivableStatus } from './enums'

export interface AccountReceivable extends AuditFields {
  id: string
  customerId: string
  customerName: string
  description: string
  amount: number
  receivedAmount: number
  dueDate: string
  receiptDate?: string
  status: AccountReceivableStatus
  bankAccountId?: string
  costCenterId?: string
  chartOfAccountId?: string
}