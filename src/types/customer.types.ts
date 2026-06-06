import type { AuditFields, Address } from './common.types'
import type { PersonStatus, PersonType } from './enums'

export interface Customer extends AuditFields {
  id: string
  name: string
  email: string
  phone?: string
  document: string
  personType: PersonType
  status: PersonStatus
  address?: Address
  creditLimit?: number
  notes?: string
}