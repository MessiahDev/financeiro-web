import type { AuditFields, Address } from './common.types'
import type { PayrollStatus } from './enums'

export interface Payroll extends AuditFields {
  id: string
  referenceMonth: number
  referenceYear: number
  processedAt?: string
  status: PayrollStatus
  totalGross: number
  totalDeductions: number
  totalNet: number
  items: PayrollItem[]
}

export interface PayrollItem {
  id: string
  payrollId: string
  employeeId: string
  employeeName: string
  grossSalary: number
  inssDeduction: number
  irDeduction: number
  otherDeductions: number
  netSalary: number
}