import type { AuditFields } from './common.types'

export interface Department extends AuditFields {
  id: string
  name: string
  code: string
  managerId?: string
  managerName?: string
  costCenterId?: string
  costCenterName?: string
  isActive: boolean
}