import type { AuditFields } from './common.types'

export interface CostCenter extends AuditFields {
  id: string
  code: string
  name: string
  description?: string
  isActive: boolean
}