import type { AuditFields, Address } from './common.types'
import type { PersonStatus, PersonType } from './enums'

export interface Supplier extends AuditFields {
  id: string
  name: string
  email: string
  phone?: string
  document: string
  personType: PersonType
  status: PersonStatus
  address?: Address
  paymentTermDays?: number
  notes?: string
}