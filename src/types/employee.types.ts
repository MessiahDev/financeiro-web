import type { AuditFields } from './common.types'
import type { EmployeeStatus } from './enums'

export interface Employee extends AuditFields {
  id: string
  name: string
  email: string
  cpf: string
  position: string
  departmentId: string
  departmentName: string
  salary: number
  hireDate: string
  terminationDate?: string
  status: EmployeeStatus
  bankAccountNumber?: string
  bankAgency?: string
  bankName?: string
}