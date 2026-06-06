import type { AccountType } from './enums'

export interface FinancialSummary {
  period: string
  totalRevenue: number
  totalExpenses: number
  netResult: number
  totalReceivables: number
  totalPayables: number
  cashBalance: number
}
 
export interface TrialBalanceEntry {
  accountCode: string
  accountName: string
  accountType: AccountType
  debitTotal: number
  creditTotal: number
  balance: number
}
 
export interface TrialBalance {
  periodId: string
  periodName: string
  generatedAt: string
  entries: TrialBalanceEntry[]
  totalDebit: number
  totalCredit: number
}