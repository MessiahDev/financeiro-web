export const UserRole = {
  Admin:    'Admin',
  Manager:  'Manager',
  Employee: 'Employee',
} as const;

export type UserRole = (typeof UserRole)[keyof typeof UserRole];

// Employee

export const Position = {
  Estagiario:           'Estagiario',
  DesenvolvedorJunior:  'DesenvolvedorJunior',
  DesenvolvedorPleno:   'DesenvolvedorPleno',
  DesenvolvedorSenior:  'DesenvolvedorSenior',
  LiderTecnico:         'LiderTecnico',
  Gerente:              'Gerente',
  Diretor:              'Diretor',
  CEO:                  'CEO',
  Analista:             'Analista',
  Coordenador:          'Coordenador',
  Supervisor:           'Supervisor',
  RecursosHumanos:      'RecursosHumanos',
  Contador:             'Contador',
  Vendedor:             'Vendedor',
  AtendimentoAoCliente: 'AtendimentoAoCliente',
} as const;

export type Position = (typeof Position)[keyof typeof Position];

export const ContractType = {
  CLT:        'CLT',
  PJ:         'PJ',
  Internship: 'Internship',
  Temporary:  'Temporary',
} as const;

export type ContractType = (typeof ContractType)[keyof typeof ContractType];

export const EmployeeStatus = {
  Active:     'Active',
  Inactive:   'Inactive',
  OnLeave:    'OnLeave',
  Terminated: 'Terminated',
} as const;

export type EmployeeStatus = (typeof EmployeeStatus)[keyof typeof EmployeeStatus];

// Payroll

export const PayrollStatus = {
  Draft:      'Draft',
  Processing: 'Processing',
  Approved:   'Approved',
  Paid:       'Paid',
  Cancelled:  'Cancelled',
} as const;

export type PayrollStatus = (typeof PayrollStatus)[keyof typeof PayrollStatus];

// Transaction

export const TransactionType = {
  Credit: 'Credit',
  Debit:  'Debit',
} as const;

export type TransactionType = (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionCategory = {
  Salary:        'Salary',
  Bonus:         'Bonus',
  Deduction:     'Deduction',
  Tax:           'Tax',
  Benefit:       'Benefit',
  Reimbursement: 'Reimbursement',
  Other:         'Other',
} as const;

export type TransactionCategory = (typeof TransactionCategory)[keyof typeof TransactionCategory];

export const TransactionStatus = {
  Pending:   'Pending',
  Confirmed: 'Confirmed',
  Cancelled: 'Cancelled',
} as const;

export type TransactionStatus = (typeof TransactionStatus)[keyof typeof TransactionStatus];

// Person (Customer / Supplier)

export const PersonType = {
  Individual: 'Individual',
  Company:    'Company',
} as const;

export type PersonType = (typeof PersonType)[keyof typeof PersonType];

export const CustomerStatus = {
  Active:   'Active',
  Inactive: 'Inactive',
  Blocked:  'Blocked',
} as const;

export type CustomerStatus = (typeof CustomerStatus)[keyof typeof CustomerStatus];

export const SupplierStatus = {
  Active:   'Active',
  Inactive: 'Inactive',
  Blocked:  'Blocked',
} as const;

export type SupplierStatus = (typeof SupplierStatus)[keyof typeof SupplierStatus];

// Accounts Payable / Receivable

export const AccountPayableStatus = {
  Pending:        'Pending',
  PartiallyPaid:  'PartiallyPaid',
  Paid:           'Paid',
  Overdue:        'Overdue',
  Cancelled:      'Cancelled',
} as const;

export type AccountPayableStatus = (typeof AccountPayableStatus)[keyof typeof AccountPayableStatus];

export const AccountReceivableStatus = {
  Pending:            'Pending',
  PartiallyReceived:  'PartiallyReceived',
  Received:           'Received',
  Overdue:            'Overdue',
  Cancelled:          'Cancelled',
} as const;

export type AccountReceivableStatus = (typeof AccountReceivableStatus)[keyof typeof AccountReceivableStatus];

// Bank Account

export const BankAccountType = {
  Checking: 'Checking',
  Savings:  'Savings',
  Payment:  'Payment',
} as const;

export type BankAccountType = (typeof BankAccountType)[keyof typeof BankAccountType];

// Budget

export const BudgetStatus = {
  Draft:     'Draft',
  Approved:  'Approved',
  Closed:    'Closed',
  Cancelled: 'Cancelled',
} as const;

export type BudgetStatus = (typeof BudgetStatus)[keyof typeof BudgetStatus];

// Cost Center

export const CostCenterStatus = {
  Active:   'Active',
  Inactive: 'Inactive',
} as const;

export type CostCenterStatus = (typeof CostCenterStatus)[keyof typeof CostCenterStatus];

// Chart of Accounts

export const AccountType = {
  Asset:       'Asset',
  Liability:   'Liability',
  Equity:      'Equity',
  Revenue:     'Revenue',
  Expense:     'Expense',
  CostOfGoods: 'CostOfGoods',
} as const;

export type AccountType = (typeof AccountType)[keyof typeof AccountType];

export const AccountNature = {
  Debit:  'Debit',
  Credit: 'Credit',
} as const;

export type AccountNature = (typeof AccountNature)[keyof typeof AccountNature];

// Journal Entry

export const JournalEntryStatus = {
  Draft:    'Draft',
  Posted:   'Posted',
  Reversed: 'Reversed',
} as const;

export type JournalEntryStatus = (typeof JournalEntryStatus)[keyof typeof JournalEntryStatus];

export const JournalEntryType = {
  Manual:             'Manual',
  AccountsPayable:    'AccountsPayable',
  AccountsReceivable: 'AccountsReceivable',
  Payroll:            'Payroll',
  BankTransfer:       'BankTransfer',
  Depreciation:       'Depreciation',
  Opening:            'Opening',
  Closing:            'Closing',
  Reversal:           'Reversal',
} as const;

export type JournalEntryType = (typeof JournalEntryType)[keyof typeof JournalEntryType];

export const DebitCredit = {
  Debit:  'Debit',
  Credit: 'Credit',
} as const;

export type DebitCredit = (typeof DebitCredit)[keyof typeof DebitCredit];

// Accounting Period

export const AccountingPeriodStatus = {
  Open:   'Open',
  Closed: 'Closed',
  Locked: 'Locked',
} as const;

export type AccountingPeriodStatus = (typeof AccountingPeriodStatus)[keyof typeof AccountingPeriodStatus];

// Tax

export const TaxType = {
  ICMS:   'ICMS',
  ISS:    'ISS',
  PIS:    'PIS',
  COFINS: 'COFINS',
  CSLL:   'CSLL',
  IRPJ:   'IRPJ',
  IPI:    'IPI',
  IOF:    'IOF',
  INSS:   'INSS',
  FGTS:   'FGTS',
  Other:  'Other',
} as const;

export type TaxType = (typeof TaxType)[keyof typeof TaxType];

export const TaxEntryStatus = {
  Pending:    'Pending',
  Calculated: 'Calculated',
  Paid:       'Paid',
  Cancelled:  'Cancelled',
} as const;

export type TaxEntryStatus = (typeof TaxEntryStatus)[keyof typeof TaxEntryStatus];

export const TaxPaymentStatus = {
  Pending:   'Pending',
  Paid:      'Paid',
  Overdue:   'Overdue',
  Cancelled: 'Cancelled',
} as const;

export type TaxPaymentStatus = (typeof TaxPaymentStatus)[keyof typeof TaxPaymentStatus];

// Bank Statement

export const BankStatementStatus = {
  Imported:   'Imported',
  Reconciled: 'Reconciled',
  Cancelled:  'Cancelled',
} as const;

export type BankStatementStatus = (typeof BankStatementStatus)[keyof typeof BankStatementStatus];

export const BankStatementEntryType = {
  Credit: 'Credit',
  Debit:  'Debit',
} as const;

export type BankStatementEntryType = (typeof BankStatementEntryType)[keyof typeof BankStatementEntryType];

// Bank Reconciliation

export const BankReconciliationStatus = {
  Open:       'Open',
  InProgress: 'InProgress',
  Completed:  'Completed',
  Cancelled:  'Cancelled',
} as const;

export type BankReconciliationStatus = (typeof BankReconciliationStatus)[keyof typeof BankReconciliationStatus];

export const ReconciliationItemStatus = {
  Pending:   'Pending',
  Matched:   'Matched',
  Unmatched: 'Unmatched',
} as const;

export type ReconciliationItemStatus = (typeof ReconciliationItemStatus)[keyof typeof ReconciliationItemStatus];