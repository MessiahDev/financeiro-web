import type { AuditFields } from './common.types'
import type { BankStatementStatus, BankStatementEntryType } from './enums'

export interface BankStatement extends AuditFields {
  id: string
  bankAccountId: string
  bankAccountName: string
  referenceDate: string
  status: BankStatementStatus
  entries: BankStatementEntry[]
}
 
export interface BankStatementEntry {
  id: string
  bankStatementId: string
  date: string
  description: string
  amount: number
  type: BankStatementEntryType
  isReconciled: boolean
}