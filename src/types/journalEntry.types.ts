import type { AuditFields } from './common.types'
import type { JournalEntryStatus, JournalEntryLineType } from './enums'

export interface JournalEntry extends AuditFields {
  id: string
  accountingPeriodId: string
  accountingPeriodName: string
  entryDate: string
  description: string
  status: JournalEntryStatus
  referenceNumber?: string
  totalDebit: number
  totalCredit: number
  lines: JournalEntryLine[]
}

export interface JournalEntryLine {
  id: string
  journalEntryId: string
  chartOfAccountId: string
  chartOfAccountCode: string
  chartOfAccountName: string
  costCenterId?: string
  costCenterName?: string
  type: JournalEntryLineType
  amount: number
  description?: string
}