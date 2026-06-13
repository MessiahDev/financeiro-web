import type { AuditFields } from './common.types'
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
  ContractType,
  DebitCredit,
  EmployeeStatus,
  JournalEntryStatus,
  JournalEntryType,
  PayrollStatus,
  CustomerStatus,
  SupplierStatus,
  PersonType,
  Position,
  ReconciliationItemStatus,
  TaxEntryStatus,
  TaxPaymentStatus,
  TaxType,
  TransactionCategory,
  TransactionStatus,
  TransactionType,
} from './enums'

// Bank Account

export interface BankAccount extends AuditFields {
  id:           string
  bankName:     string
  bankCode:     string
  agency:       string
  accountNumber: string
  accountType:  BankAccountType
  pixKey?:      string
  balance:      number
  currency:     string
  isActive:     boolean
  description?: string
}

export interface CreateBankAccountRequest {
  bankName:       string
  bankCode:       string
  agency:         string
  accountNumber:  string
  accountType:    BankAccountType
  initialBalance?: number
  pixKey?:        string
  description?:   string
}

export interface TransferBetweenAccountsRequest {
  sourceAccountId:      string
  destinationAccountId: string
  amount:               number
  description:          string
}

// Bank Statement

export interface BankStatement extends AuditFields {
  id:              string
  bankAccountId:   string
  bankAccountName: string
  statementDate:   string
  periodStart:     string
  periodEnd:       string
  openingBalance:  number
  closingBalance:  number
  currency:        string
  status:          BankStatementStatus
  totalEntries:    number
  totalCredits:    number
  totalDebits:     number
  fileName?:       string
  notes?:          string
  entries:         BankStatementEntry[]
}

export interface BankStatementSummary {
  id:              string
  bankAccountId:   string
  bankAccountName: string
  periodStart:     string
  periodEnd:       string
  openingBalance:  number
  closingBalance:  number
  status:          BankStatementStatus
  totalEntries:    number
}

export interface BankStatementEntry {
  id:             string
  date:           string
  description:    string
  amount:         number
  currency:       string
  entryType:      BankStatementEntryType
  documentNumber?: string
  isReconciled:   boolean
}

export interface ImportBankStatementRequest {
  bankAccountId:  string
  statementDate:  string
  periodStart:    string
  periodEnd:      string
  openingBalance: number
  closingBalance: number
  fileName?:      string
  notes?:         string
  entries: Array<{
    date:           string
    description:    string
    amount:         number
    entryType:      BankStatementEntryType
    documentNumber?: string
  }>
}

// Bank Reconciliation

export interface BankReconciliation extends AuditFields {
  id:                     string
  bankAccountId:          string
  bankAccountName:        string
  bankStatementId:        string
  periodStart:            string
  periodEnd:              string
  statementOpeningBalance: number
  statementClosingBalance: number
  systemBalance:          number
  difference:             number
  isBalanced:             boolean
  status:                 BankReconciliationStatus
  totalItems:             number
  matchedItems:           number
  unmatchedItems:         number
  completedAt?:           string
  completedBy?:           string
  notes?:                 string
  items:                  BankReconciliationItem[]
}

export interface BankReconciliationSummary {
  id:              string
  bankAccountId:   string
  bankAccountName: string
  periodStart:     string
  periodEnd:       string
  difference:      number
  isBalanced:      boolean
  status:          BankReconciliationStatus
  totalItems:      number
  matchedItems:    number
}

export interface BankReconciliationItem {
  id:                  string
  bankStatementEntryId: string
  entryDescription:    string
  entryDate:           string
  amount:              number
  currency:            string
  entryType:           BankStatementEntryType
  transactionId?:      string
  status:              ReconciliationItemStatus
  notes?:              string
}

export interface CreateBankReconciliationRequest {
  bankAccountId:   string
  bankStatementId: string
  systemBalance:   number
  notes?:          string
}

export interface AddReconciliationItemRequest {
  bankStatementEntryId: string
  transactionId?:       string
  itemStatus:           ReconciliationItemStatus
  notes?:               string
}

// Accounting Period

export interface AccountingPeriod extends AuditFields {
  id:          string
  name:        string
  year:        number
  month:       number
  periodStart: string
  periodEnd:   string
  status:      AccountingPeriodStatus
  totalEntries: number
}

// Chart of Accounts

export interface ChartOfAccount extends AuditFields {
  id:                string
  code:              string
  name:              string
  description?:      string
  accountType:       AccountType
  accountNature:     AccountNature
  acceptsEntries:    boolean
  isActive:          boolean
  parentAccountId?:  string
  parentAccountCode?: string
  parentAccountName?: string
  childAccounts?:    ChartOfAccount[]
}

export interface ChartOfAccountSummary {
  id:            string
  code:          string
  name:          string
  accountType:   AccountType
  accountNature: AccountNature
  acceptsEntries: boolean
  isActive:      boolean
}

export interface CreateChartOfAccountRequest {
  code:          string
  name:          string
  description?:  string
  accountType:   AccountType
  accountNature: AccountNature
  parentId?:     string
}

// Cost Center

export interface CostCenter extends AuditFields {
  id:           string
  code:         string
  name:         string
  description?: string
  parentId?:    string
  parentName?:  string
  annualBudget: number
  currency:     string
  status:       string
  managerId?:   string
  managerName?: string
}

export interface CreateCostCenterRequest {
  code:         string
  name:         string
  annualBudget: number
  parentId?:    string
  managerId?:   string
  description?: string
}

export interface UpdateCostCenterRequest {
  code:         string
  name:         string
  description?: string
  managerId?:   string
}

// Journal Entry

export interface JournalEntry extends AuditFields {
  id:                   string
  entryNumber:          string
  description:          string
  entryDate:            string
  status:               JournalEntryStatus
  entryType:            JournalEntryType
  referenceDocument?:   string
  referenceDocumentType?: string
  referenceDocumentId?: string
  accountingPeriodId:   string
  accountingPeriodName: string
  totalDebits:          number
  totalCredits:         number
  isBalanced:           boolean
  lines:                JournalEntryLine[]
}

export interface JournalEntrySummary {
  id:          string
  entryNumber: string
  description: string
  entryDate:   string
  status:      JournalEntryStatus
  entryType:   JournalEntryType
  totalAmount: number
}

export interface JournalEntryLine {
  id:               string
  chartOfAccountId: string
  accountCode:      string
  accountName:      string
  debitCredit:      DebitCredit
  amount:           number
  description?:     string
  lineOrder:        number
}

export interface CreateJournalEntryRequest {
  accountingPeriodId: string
  entryDate:          string
  description:        string
  referenceDocument?: string
  lines: Array<{
    chartOfAccountId: string
    debitCredit:      DebitCredit
    amount:           number
    description?:     string
    lineOrder:        number
  }>
}

// Account Payable

export interface AccountPayable extends AuditFields {
  id:              string
  supplierId:      string
  supplierName:    string
  costCenterId?:   string
  costCenterName?: string
  description:     string
  totalAmount:     number
  paidAmount:      number
  remainingAmount: number
  currency:        string
  dueDate:         string
  paymentDate?:    string
  status:          AccountPayableStatus
  invoiceNumber?:  string
  notes?:          string
}

export interface CreateAccountPayableRequest {
  supplierId:     string
  description:    string
  totalAmount:    number
  dueDate:        string
  costCenterId?:  string
  invoiceNumber?: string
  notes?:         string
}

export interface PayAccountPayableRequest {
  amount:        number
  paymentDate:   string
  bankAccountId: string
}

// Account Receivable

export interface AccountReceivable extends AuditFields {
  id:              string
  customerId:      string
  customerName:    string
  costCenterId?:   string
  costCenterName?: string
  description:     string
  totalAmount:     number
  receivedAmount:  number
  remainingAmount: number
  currency:        string
  dueDate:         string
  receiptDate?:    string
  status:          AccountReceivableStatus
  invoiceNumber?:  string
  notes?:          string
}

export interface CreateAccountReceivableRequest {
  customerId:     string
  description:    string
  totalAmount:    number
  dueDate:        string
  costCenterId?:  string
  invoiceNumber?: string
  notes?:         string
}

export interface ReceivePaymentRequest {
  amount:        number
  receiptDate:   string
  bankAccountId: string
}

// Transaction

export interface Transaction extends AuditFields {
  id:              string
  description:     string
  amount:          number
  currency:        string
  type:            TransactionType
  category:        TransactionCategory
  status:          TransactionStatus
  transactionDate: string
  employeeId?:     string
  payrollId?:      string
  referenceNumber?: string
}

export interface CreateTransactionRequest {
  description:     string
  amount:          number
  type:            TransactionType
  category:        TransactionCategory
  transactionDate?: string
  employeeId?:     string
  payrollId?:      string
  referenceNumber?: string
}

// Budget

export interface Budget extends AuditFields {
  id:            string
  year:          number
  name:          string
  description?:  string
  status:        BudgetStatus
  totalPlanned:  number
  totalRealized: number
  variance:      number
  currency:      string
  approvedAt?:   string
  approvedBy?:   string
  items:         BudgetItem[]
}

export interface BudgetSummary {
  id:            string
  year:          number
  name:          string
  status:        BudgetStatus
  totalPlanned:  number
  totalRealized: number
  variance:      number
  approvedAt?:   string
}

export interface BudgetItem {
  id:              string
  costCenterId:    string
  costCenterName:  string
  category:        string
  plannedAmount:   number
  realizedAmount:  number
  variance:        number
  isOverBudget:    boolean
}

export interface CreateBudgetRequest {
  year:         number
  name:         string
  description?: string
}

export interface AddBudgetItemRequest {
  costCenterId:  string
  category:      string
  plannedAmount: number
}

export interface ApproveBudgetRequest {
  approvedBy: string
}

// Budget vs Actual

export interface BudgetVsActualItem {
  costCenterId:    string
  costCenterName?: string
  category:        string
  plannedAmount:   number
  actualPaid:      number
  actualReceived:  number
  variance:        number
}

export interface BudgetVsActual {
  budgetId:            string
  year:                number
  name:                string
  totalPlanned:        number
  totalActualPaid:     number
  totalActualReceived: number
  items:               BudgetVsActualItem[]
}

// Customer

export interface Customer extends AuditFields {
  id:           string
  name:         string
  taxId:        string
  personType:   PersonType
  email:        string
  phone?:       string
  contactName?: string
  status:       CustomerStatus
  creditLimit:  number
  currency:     string
}

export interface CustomerSummary {
  id:          string
  name:        string
  taxId:       string
  personType:  PersonType
  status:      CustomerStatus
  creditLimit: number
}

export interface CreateCustomerRequest {
  name:         string
  taxId:        string
  personType:   PersonType
  email:        string
  phone?:       string
  contactName?: string
  creditLimit?: number
}

export interface UpdateCustomerRequest {
  name:         string
  email:        string
  phone?:       string
  contactName?: string
}

export interface UpdateCreditLimitRequest {
  creditLimit: number
}

// Supplier

export interface Supplier extends AuditFields {
  id:           string
  name:         string
  taxId:        string
  personType:   PersonType
  email:        string
  phone?:       string
  contactName?: string
  status:       SupplierStatus
  bankName?:    string
  bankAgency?:  string
  bankAccount?: string
  pixKey?:      string
}

export interface SupplierSummary {
  id:         string
  name:       string
  taxId:      string
  personType: PersonType
  status:     SupplierStatus
}

export interface CreateSupplierRequest {
  name:         string
  taxId:        string
  personType:   PersonType
  email:        string
  phone?:       string
  contactName?: string
}

export interface UpdateSupplierRequest {
  name:         string
  email:        string
  phone?:       string
  contactName?: string
}

export interface UpdateSupplierBankingRequest {
  bankName:    string
  bankAgency:  string
  bankAccount: string
  pixKey?:     string
}

export interface BlockSupplierRequest {
  reason: string
}

// Department

export interface Department extends AuditFields {
  id:            string
  name:          string
  description?:  string
  costCenter:    string
  isActive:      boolean
  employeeCount: number
}

export interface CreateDepartmentRequest {
  name:         string
  costCenter:   string
  description?: string
}

export interface UpdateDepartmentRequest {
  name:         string
  costCenter:   string
  description?: string
}

// Employee

export interface Employee extends AuditFields {
  id:               string
  firstName:        string
  lastName:         string
  fullName:         string
  email:            string
  cpf:              string
  position?:        Position
  departmentId:     string
  departmentName:   string
  salary:           number
  currency:         string
  status:           EmployeeStatus
  contractType:     ContractType
  hireDate:         string
  terminationDate?: string
}

export interface EmployeeSummary {
  id:             string
  fullName:       string
  position?:      Position
  departmentId:   string
  departmentName: string
  salary:         number
  status:         EmployeeStatus
}

export interface CreateEmployeeRequest {
  firstName:    string
  lastName:     string
  email:        string
  cpf:          string
  position?:    Position
  departmentId: string
  salary:       number
  contractType: ContractType
  hireDate?:    string
}

export interface UpdateEmployeeRequest {
  firstName:    string
  lastName:     string
  email:        string
  position?:    Position
  departmentId: string
}

export interface UpdateSalaryRequest {
  newSalary: number
  reason:    string
}

// Payroll

export interface Payroll extends AuditFields {
  id:             string
  month:          number
  year:           number
  period:         string
  status:         PayrollStatus
  totalGross:     number
  totalDiscounts: number
  totalNet:       number
  employeeCount:  number
  processedAt?:   string
  paidAt?:        string
}

export interface PayrollDetail extends AuditFields {
  id:             string
  month:          number
  year:           number
  period:         string
  status:         PayrollStatus
  totalGross:     number
  totalDiscounts: number
  totalNet:       number
  notes?:         string
  processedAt?:   string
  paidAt?:        string
  items:          PayrollItem[]
}

export interface PayrollItem {
  id:             string
  employeeId:     string
  employeeName:   string
  grossSalary:    number
  inssDiscount:   number
  irpfDiscount:   number
  otherDiscounts: number
  netSalary:      number
}

export interface ProcessPayrollRequest {
  month:       number
  year:        number
  employeeIds: string[]
}

export interface ApprovePayrollRequest {
  payrollId: string
}

export interface PayPayrollRequest {
  bankAccountId: string
}

// Tax Entry

export interface TaxEntry extends AuditFields {
  id:               string
  taxType:          TaxType
  description:      string
  baseAmount:       number
  rate:             number
  taxAmount:        number
  currency:         string
  competence:       string
  dueDate:          string
  status:           TaxEntryStatus
  referenceDocument?: string
  referenceDocumentId?: string
  costCenterId?:    string
  costCenterName?:  string
  notes?:           string
  payments:         TaxPayment[]
}

export interface TaxEntrySummary {
  id:          string
  taxType:     TaxType
  description: string
  taxAmount:   number
  currency:    string
  competence:  string
  dueDate:     string
  status:      TaxEntryStatus
}

export interface CreateTaxEntryRequest {
  taxType:            TaxType
  description:        string
  baseAmount:         number
  rate:               number
  competence:         string
  dueDate:            string
  costCenterId?:      string
  referenceDocument?: string
  referenceDocumentId?: string
  notes?:             string
}

// Tax Payment

export interface TaxPayment extends AuditFields {
  id:              string
  taxEntryId:      string
  taxType:         string
  bankAccountId:   string
  bankAccountName: string
  amount:          number
  fine:            number
  interest:        number
  totalPaid:       number
  currency:        string
  paymentDate:     string
  darfNumber?:     string
  receiptCode?:    string
  status:          TaxPaymentStatus
  notes?:          string
}

export interface CreateTaxPaymentRequest {
  taxEntryId:    string
  bankAccountId: string
  amount:        number
  paymentDate:   string
  fine?:         number
  interest?:     number
  darfNumber?:   string
  receiptCode?:  string
  notes?:        string
}

export interface CancelTaxPaymentRequest {
  reason: string
}

// Financial Summary

export interface FinancialSummary {
  from:                string
  to:                  string
  totalCredits:        number
  totalDebits:         number
  netBalance:          number
  payrollsProcessed:   number
  totalPayroll:        number
  activeEmployees:     number
  totalPaid:           number
  totalReceived:       number
  totalTaxesPaid:      number
  pendingPayables:     number
  pendingReceivables:  number
  breakdown:           CategoryBreakdown[]
  monthlyTrend:        MonthlyTrend[]
}

export interface CategoryBreakdown {
  category: string
  type:     string
  total:    number
  count:    number
}

export interface MonthlyTrend {
  month:      string
  credits:    number
  debits:     number
  netBalance: number
}

// Trial Balance / Ledger

export interface TrialBalanceLine {
  accountId:     string
  accountCode:   string
  accountName:   string
  accountType:   AccountType
  totalDebits:   number
  totalCredits:  number
  balance:       number
  balanceNature: AccountNature
}

export interface TrialBalance {
  accountingPeriodId: string
  periodName:         string
  generatedAt:        string
  totalDebits:        number
  totalCredits:       number
  lines:              TrialBalanceLine[]
}

export interface LedgerEntry {
  entryDate:   string
  entryNumber: string
  description: string
  debit?:      number
  credit?:     number
  balance:     number
}

export interface AccountLedger {
  chartOfAccountId: string
  accountCode:      string
  accountName:      string
  accountNature:    AccountNature
  from:             string
  to:               string
  openingBalance:   number
  totalDebits:      number
  totalCredits:     number
  closingBalance:   number
  entries:          LedgerEntry[]
}