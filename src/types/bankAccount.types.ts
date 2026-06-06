import type { AuditFields } from './common.types'
import type { BankAccountType } from './enums'

export interface BankAccount extends AuditFields {
  id: string
  bankName: string
  accountNumber: string
  agency: string
  accountType: BankAccountType
  balance: number
  isActive: boolean
}