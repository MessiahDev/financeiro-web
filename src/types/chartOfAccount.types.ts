import type { AuditFields } from './common.types'
import type { AccountType, AccountNature } from './enums'

export interface ChartOfAccount extends AuditFields {
  id: string
  code: string
  name: string
  accountType: AccountType
  nature: AccountNature
  parentId?: string
  parentName?: string
  isAnalytical: boolean
  isActive: boolean
  children?: ChartOfAccount[]
}