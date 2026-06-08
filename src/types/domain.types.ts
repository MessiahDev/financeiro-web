import type { AuditFields, Address } from './common.types'
import type {
  AccountType,
  AccountNature,
  AccountingPeriodStatus,
  AccountPayableStatus,
  AccountReceivableStatus,
  BankAccountType,
  BankReconciliationStatus,
  BankStatementStatus,
  BankStatementEntryType,
  BudgetStatus,
  EmployeeStatus,
  JournalEntryStatus,
  JournalEntryLineType,
  PayrollStatus,
  PersonStatus,
  PersonType,
  TaxEntryStatus,
  TaxPaymentStatus,
  TaxType,
  TransactionStatus,
  TransactionType,
} from './enums'

export interface BankAccount extends AuditFields {
  id:            string
  bankName:      string
  accountNumber: string
  agency:        string
  accountType:   BankAccountType
  balance:       number
  isActive:      boolean
}

export interface CreateBankAccountRequest {
  bankName:      string
  accountNumber: string
  agency:        string
  accountType:   string
  initialBalance?: number
}

export interface BankStatement extends AuditFields {
  id:                string
  bankAccountId:     string
  bankAccountName:   string
  referenceDate:     string
  status:            BankStatementStatus
  entries:           BankStatementEntry[]
}

export interface BankStatementEntry {
  id:               string
  bankStatementId:  string
  date:             string
  description:      string
  amount:           number
  type:             BankStatementEntryType
  isReconciled:     boolean
}

export interface BankReconciliation extends AuditFields {
  id:               string
  bankAccountId:    string
  bankAccountName:  string
  statementDate:    string
  openingBalance:   number
  closingBalance:   number
  status:           BankReconciliationStatus
  items:            BankReconciliationItem[]
}

export interface BankReconciliationItem {
  id:                    string
  bankReconciliationId:  string
  bankStatementEntryId:  string
  transactionId?:        string
  isMatched:             boolean
}

export interface AccountingPeriod extends AuditFields {
  id:         string
  name:       string
  startDate:  string
  endDate:    string
  status:     AccountingPeriodStatus
  fiscalYear: number
}

export interface CreateAccountingPeriodRequest {
  name:       string
  startDate:  string
  endDate:    string
  fiscalYear: number
}

export interface ChartOfAccount extends AuditFields {
  id:           string
  code:         string
  name:         string
  accountType:  AccountType
  nature:       AccountNature
  parentId?:    string
  parentName?:  string
  isAnalytical: boolean
  isActive:     boolean
  children?:    ChartOfAccount[]
}

export interface CreateChartOfAccountRequest {
  code:         string
  name:         string
  accountType:  string
  nature:       string
  parentId?:    string
  isAnalytical: boolean
}

export interface CostCenter extends AuditFields {
  id:          string
  code:        string
  name:        string
  description?: string
  isActive:    boolean
}

export interface CreateCostCenterRequest {
  code:         string
  name:         string
  description?: string
}

export interface JournalEntry extends AuditFields {
  id:                    string
  accountingPeriodId:    string
  accountingPeriodName:  string
  entryDate:             string
  description:           string
  status:                JournalEntryStatus
  referenceNumber?:      string
  totalDebit:            number
  totalCredit:           number
  lines:                 JournalEntryLine[]
}

export interface JournalEntryLine {
  id:                   string
  journalEntryId:       string
  chartOfAccountId:     string
  chartOfAccountCode:   string
  chartOfAccountName:   string
  costCenterId?:        string
  costCenterName?:      string
  type:                 JournalEntryLineType
  amount:               number
  description?:         string
}

export interface CreateJournalEntryRequest {
  accountingPeriodId: string
  entryDate:          string
  description:        string
  referenceNumber?:   string
  lines: Array<{
    chartOfAccountId: string
    costCenterId?:    string
    type:             string
    amount:           number
    description?:     string
  }>
}

export interface AccountPayable extends AuditFields {
  id:                string
  supplierId:        string
  supplierName:      string
  description:       string
  amount:            number
  paidAmount:        number
  dueDate:           string
  paymentDate?:      string
  status:            AccountPayableStatus
  bankAccountId?:    string
  costCenterId?:     string
  chartOfAccountId?: string
}

export interface CreateAccountPayableRequest {
  supplierId:        string
  description:       string
  amount:            number
  dueDate:           string
  bankAccountId?:    string
  costCenterId?:     string
  chartOfAccountId?: string
}

export interface PayAccountPayableRequest {
  paymentDate:    string
  amount:         number
  bankAccountId:  string
}

export interface AccountReceivable extends AuditFields {
  id:                string
  customerId:        string
  customerName:      string
  description:       string
  amount:            number
  receivedAmount:    number
  dueDate:           string
  receiptDate?:      string
  status:            AccountReceivableStatus
  bankAccountId?:    string
  costCenterId?:     string
  chartOfAccountId?: string
}

export interface CreateAccountReceivableRequest {
  customerId:        string
  description:       string
  amount:            number
  dueDate:           string
  bankAccountId?:    string
  costCenterId?:     string
  chartOfAccountId?: string
}

export interface ReceivePaymentRequest {
  receiptDate:    string
  amount:         number
  bankAccountId:  string
}

export interface Transaction extends AuditFields {
  id:                string
  bankAccountId:     string
  bankAccountName:   string
  type:              TransactionType
  amount:            number
  description:       string
  transactionDate:   string
  status:            TransactionStatus
  referenceId?:      string
  costCenterId?:     string
  chartOfAccountId?: string
}

export interface CreateTransactionRequest {
  bankAccountId:     string
  type:              string
  amount:            number
  description:       string
  transactionDate:   string
  costCenterId?:     string
  chartOfAccountId?: string
}

export interface Budget extends AuditFields {
  id:            string
  name:          string
  fiscalYear:    number
  startDate:     string
  endDate:       string
  status:        BudgetStatus
  totalPlanned:  number
  totalActual:   number
  variance:      number
  items:         BudgetItem[]
}

export interface BudgetItem {
  id:                   string
  budgetId:             string
  chartOfAccountId:     string
  chartOfAccountName:   string
  costCenterId?:        string
  costCenterName?:      string
  plannedAmount:        number
  actualAmount:         number
  variance:             number
}

export interface CreateBudgetRequest {
  name:       string
  fiscalYear: number
  startDate:  string
  endDate:    string
  items: Array<{
    chartOfAccountId: string
    costCenterId?:    string
    plannedAmount:    number
  }>
}

export interface Customer extends AuditFields {
  id:           string
  name:         string
  email:        string
  phone?:       string
  document:     string
  personType:   PersonType
  status:       PersonStatus
  address?:     Address
  creditLimit?: number
  notes?:       string
}

export interface Supplier extends AuditFields {
  id:                string
  name:              string
  email:             string
  phone?:            string
  document:          string
  personType:        PersonType
  status:            PersonStatus
  address?:          Address
  paymentTermDays?:  number
  notes?:            string
}

export interface Department extends AuditFields {
  id:               string
  name:             string
  code:             string
  managerId?:       string
  managerName?:     string
  costCenterId?:    string
  costCenterName?:  string
  isActive:         boolean
}

export interface Employee extends AuditFields {
  id:                  string
  name:                string
  email:               string
  cpf:                 string
  position:            string
  departmentId:        string
  departmentName:      string
  salary:              number
  hireDate:            string
  terminationDate?:    string
  status:              EmployeeStatus
  bankAccountNumber?:  string
  bankAgency?:         string
  bankName?:           string
}

export interface Payroll extends AuditFields {
  id:               string
  referenceMonth:   number
  referenceYear:    number
  processedAt?:     string
  status:           PayrollStatus
  totalGross:       number
  totalDeductions:  number
  totalNet:         number
  items:            PayrollItem[]
}

export interface PayrollItem {
  id:              string
  payrollId:       string
  employeeId:      string
  employeeName:    string
  grossSalary:     number
  inssDeduction:   number
  irDeduction:     number
  otherDeductions: number
  netSalary:       number
}

export interface ProcessPayrollRequest {
  referenceMonth: number
  referenceYear:  number
}

export interface TaxEntry extends AuditFields {
  id:               string
  taxType:          TaxType
  description:      string
  competenceDate:   string
  dueDate:          string
  amount:           number
  paidAmount:       number
  status:           TaxEntryStatus
  payments:         TaxPayment[]
}

export interface CreateTaxEntryRequest {
  taxType:        string
  description:    string
  competenceDate: string
  dueDate:        string
  amount:         number
}

export interface TaxPayment extends AuditFields {
  id:              string
  taxEntryId:      string
  paymentDate:     string
  amount:          number
  status:          TaxPaymentStatus
  bankAccountId:   string
  bankAccountName: string
  receiptNumber?:  string
}

export interface CreateTaxPaymentRequest {
  taxEntryId:     string
  paymentDate:    string
  amount:         number
  bankAccountId:  string
  receiptNumber?: string
}

export interface FinancialSummary {
  period:            string
  totalRevenue:      number
  totalExpenses:     number
  netResult:         number
  totalReceivables:  number
  totalPayables:     number
  cashBalance:       number
}

export interface TrialBalanceEntry {
  accountCode:  string
  accountName:  string
  accountType:  AccountType
  debitTotal:   number
  creditTotal:  number
  balance:      number
}

export interface TrialBalance {
  periodId:     string
  periodName:   string
  generatedAt:  string
  entries:      TrialBalanceEntry[]
  totalDebit:   number
  totalCredit:  number
}
