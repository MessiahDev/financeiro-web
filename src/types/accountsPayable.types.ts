import type { AuditFields } from './common.types'
import type { AccountPayableStatus } from './enums'

export interface AccountPayable extends AuditFields {
  id: string
  supplierId: string
  supplierName: string
  description: string
  amount: number
  paidAmount: number
  dueDate: string
  paymentDate?: string
  status: AccountPayableStatus
  bankAccountId?: string
  costCenterId?: string
  chartOfAccountId?: string
}