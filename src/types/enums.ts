export const UserRole = {
  Admin:    1,
  Manager:  2,
  Employee: 3,
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Employee

export const Position = {
  Estagiario:           1,
  DesenvolvedorJunior:  2,
  DesenvolvedorPleno:   3,
  DesenvolvedorSenior:  4,
  LiderTecnico:         5,
  Gerente:              6,
  Diretor:              7,
  CEO:                  8,
  Analista:             9,
  Coordenador:          10,
  Supervisor:           11,
  RecursosHumanos:      12,
  Contador:             13,
  Vendedor:             14,
  AtendimentoAoCliente: 15,
} as const;

export type Position = (typeof Position)[keyof typeof Position];

export const ContractType = {
  CLT:        1,
  PJ:         2,
  Internship: 3,
  Temporary:  4,
} as const;

export type ContractType = (typeof ContractType)[keyof typeof ContractType];

export const EmployeeStatus = {
  Active:     1,
  Inactive:   2,
  OnLeave:    3,
  Terminated: 4,
} as const;

export type EmployeeStatus = (typeof EmployeeStatus)[keyof typeof EmployeeStatus];

// Payroll

export const PayrollStatus = {
  Draft:      1,
  Processing: 2,
  Approved:   3,
  Paid:       4,
  Cancelled:  5,
} as const;

export type PayrollStatus = (typeof PayrollStatus)[keyof typeof PayrollStatus];

// Transaction

export const TransactionType = {
  Credit: 1,
  Debit:  2,
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionCategory = {
  Salary:        1,
  Bonus:         2,
  Deduction:     3,
  Tax:           4,
  Benefit:       5,
  Reimbursement: 6,
  Other:         7,
} as const;

export type TransactionCategory = (typeof TransactionCategory)[keyof typeof TransactionCategory];

export const TransactionStatus = {
  Pending:   1,
  Confirmed: 2,
  Cancelled: 3,
} as const;

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

// Person (Customer / Supplier)

export const PersonType = {
  Individual: 1,
  Company:    2,
} as const;

export type PersonType = (typeof PersonType)[keyof typeof PersonType];

export const CustomerStatus = {
  Active:   1,
  Inactive: 2,
  Blocked:  3,
} as const;

export type CustomerStatus = (typeof CustomerStatus)[keyof typeof CustomerStatus];

export const SupplierStatus = {
  Active:   1,
  Inactive: 2,
  Blocked:  3,
} as const;

export type SupplierStatus = (typeof SupplierStatus)[keyof typeof SupplierStatus];

// Accounts Payable / Receivable

export const AccountPayableStatus = {
  Pending:        1,
  PartiallyPaid:  2,
  Paid:           3,
  Overdue:        4,
  Cancelled:      5,
} as const;

export type AccountPayableStatus = (typeof AccountPayableStatus)[keyof typeof AccountPayableStatus];

export const AccountReceivableStatus = {
  Pending:            1,
  PartiallyReceived:  2,
  Received:           3,
  Overdue:            4,
  Cancelled:          5,
} as const;

export type AccountReceivableStatus = (typeof AccountReceivableStatus)[keyof typeof AccountReceivableStatus];

// Bank Account

export const BankAccountType = {
  Checking: 1,
  Savings:  2,
  Payment:  3,
} as const;

export type BankAccountType = (typeof BankAccountType)[keyof typeof BankAccountType];

// Budget

export const BudgetStatus = {
  Draft:     1,
  Approved:  2,
  Closed:    3,
  Cancelled: 4,
} as const;

export type BudgetStatus = (typeof BudgetStatus)[keyof typeof BudgetStatus];

// Cost Center

export const CostCenterStatus = {
  Active:   1,
  Inactive: 2,
} as const;

export type CostCenterStatus = (typeof CostCenterStatus)[keyof typeof CostCenterStatus];

// Chart of Accounts

export const AccountType = {
  Asset:       1,
  Liability:   2,
  Equity:      3,
  Revenue:     4,
  Expense:     5,
  CostOfGoods: 6,
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const AccountNature = {
  Debit:  1,
  Credit: 2,
} as const;

export type AccountNature = (typeof AccountNature)[keyof typeof AccountNature];

// Journal Entry

export const JournalEntryStatus = {
  Draft:    1,
  Posted:   2,
  Reversed: 3,
} as const;

export type JournalEntryStatus = (typeof JournalEntryStatus)[keyof typeof JournalEntryStatus];

export const JournalEntryType = {
  Manual:             1,
  AccountsPayable:    2,
  AccountsReceivable: 3,
  Payroll:            4,
  BankTransfer:       5,
  Depreciation:       6,
  Opening:            7,
  Closing:            8,
  Reversal:           9,
} as const;

export type JournalEntryType = (typeof JournalEntryType)[keyof typeof JournalEntryType];

export const DebitCredit = {
  Debit:  1,
  Credit: 2,
} as const;

export type DebitCredit = (typeof DebitCredit)[keyof typeof DebitCredit];

// Accounting Period

export const AccountingPeriodStatus = {
  Open:   1,
  Closed: 2,
  Locked: 3,
} as const;

export type AccountingPeriodStatus = (typeof AccountingPeriodStatus)[keyof typeof AccountingPeriodStatus];

// Tax

export const TaxType = {
  ICMS:   1,
  ISS:    2,
  PIS:    3,
  COFINS: 4,
  CSLL:   5,
  IRPJ:   6,
  IPI:    7,
  IOF:    8,
  INSS:   9,
  FGTS:   10,
  Other:  99,
} as const;

export type TaxType = (typeof TaxType)[keyof typeof TaxType];

export const TaxEntryStatus = {
  Pending:    1,
  Calculated: 2,
  Paid:       3,
  Cancelled:  4,
} as const;

export type TaxEntryStatus = (typeof TaxEntryStatus)[keyof typeof TaxEntryStatus];

export const TaxPaymentStatus = {
  Pending:   1,
  Paid:      2,
  Overdue:   3,
  Cancelled: 4,
} as const;

export type TaxPaymentStatus = (typeof TaxPaymentStatus)[keyof typeof TaxPaymentStatus];

// Bank Statement

export const BankStatementStatus = {
  Imported:   1,
  Reconciled: 2,
  Cancelled:  3,
} as const;

export type BankStatementStatus = (typeof BankStatementStatus)[keyof typeof BankStatementStatus];

export const BankStatementEntryType = {
  Credit: 1,
  Debit:  2,
} as const;

export type BankStatementEntryType = (typeof BankStatementEntryType)[keyof typeof BankStatementEntryType];

// Bank Reconciliation

export const BankReconciliationStatus = {
  Open:       1,
  InProgress: 2,
  Completed:  3,
  Cancelled:  4,
} as const;

export type BankReconciliationStatus = (typeof BankReconciliationStatus)[keyof typeof BankReconciliationStatus];

export const ReconciliationItemStatus = {
  Pending:   1,
  Matched:   2,
  Unmatched: 3,
} as const;

export type ReconciliationItemStatus = (typeof ReconciliationItemStatus)[keyof typeof ReconciliationItemStatus];