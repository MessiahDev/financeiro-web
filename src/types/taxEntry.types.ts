import type { AuditFields } from './common.types'
import type { TaxPayment } from './taxPayment.types'
import type { TaxEntryStatus, TaxType } from './enums'

export interface TaxEntry extends AuditFields {
  id: string
  taxType: TaxType
  description: string
  competenceDate: string
  dueDate: string
  amount: number
  paidAmount: number
  status: TaxEntryStatus
  payments: TaxPayment[]
}