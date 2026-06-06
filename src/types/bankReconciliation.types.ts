import type { AuditFields } from './common.types'
import type { BankReconciliationStatus } from './enums'

export interface BankReconciliation extends AuditFields {
  id: string
  bankAccountId: string
  bankAccountName: string
  statementDate: string
  openingBalance: number
  closingBalance: number
  status: BankReconciliationStatus
  items: BankReconciliationItem[]
}
 
export interface BankReconciliationItem {
  id: string
  bankReconciliationId: string
  bankStatementEntryId: string
  transactionId?: string
  isMatched: boolean
}