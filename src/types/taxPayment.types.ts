import type { AuditFields } from './common.types'
import type { TaxPaymentStatus } from './enums'

export interface TaxPayment extends AuditFields {
  id: string
  taxEntryId: string
  paymentDate: string
  amount: number
  status: TaxPaymentStatus
  bankAccountId: string
  bankAccountName: string
  receiptNumber?: string
}