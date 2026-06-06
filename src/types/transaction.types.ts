import type { AuditFields } from './common.types'
import type { TransactionStatus, TransactionType } from './enums'

export interface Transaction extends AuditFields {
  id: string
  bankAccountId: string
  bankAccountName: string
  type: TransactionType
  amount: number
  description: string
  transactionDate: string
  status: TransactionStatus
  referenceId?: string
  costCenterId?: string
  chartOfAccountId?: string
}