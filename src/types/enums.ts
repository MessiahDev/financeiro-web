export const TransactionType = {
  Income: 'Income',
  Expense: 'Expense',
  Transfer: 'Transfer',
} as const;

export type TransactionType =
  (typeof TransactionType)[keyof typeof TransactionType];

export const TransactionStatus = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Cancelled: 'Cancelled',
} as const;

export type TransactionStatus =
  (typeof TransactionStatus)[keyof typeof TransactionStatus];

export const AccountPayableStatus = {
  Pending: 'Pending',
  Paid: 'Paid',
  Overdue: 'Overdue',
  Cancelled: 'Cancelled',
} as const;

export type AccountPayableStatus =
  (typeof AccountPayableStatus)[keyof typeof AccountPayableStatus];

export const AccountReceivableStatus = {
  Pending: 'Pending',
  Received: 'Received',
  Overdue: 'Overdue',
  Cancelled: 'Cancelled',
} as const;

export type AccountReceivableStatus =
  (typeof AccountReceivableStatus)[keyof typeof AccountReceivableStatus];

export const JournalEntryStatus = {
  Draft: 'Draft',
  Posted: 'Posted',
  Reversed: 'Reversed',
} as const;

export type JournalEntryStatus =
  (typeof JournalEntryStatus)[keyof typeof JournalEntryStatus];

export const JournalEntryLineType = {
  Debit: 'Debit',
  Credit: 'Credit',
} as const;

export type JournalEntryLineType =
  (typeof JournalEntryLineType)[keyof typeof JournalEntryLineType];

export const AccountingPeriodStatus = {
  Open: 'Open',
  Closed: 'Closed',
  Locked: 'Locked',
} as const;

export type AccountingPeriodStatus =
  (typeof AccountingPeriodStatus)[keyof typeof AccountingPeriodStatus];

export const AccountType = {
  Asset: 'Asset',
  Liability: 'Liability',
  Equity: 'Equity',
  Revenue: 'Revenue',
  Expense: 'Expense',
} as const;

export type AccountType =
  (typeof AccountType)[keyof typeof AccountType];

export const AccountNature = {
  Debit: 'Debit',
  Credit: 'Credit',
} as const;

export type AccountNature =
  (typeof AccountNature)[keyof typeof AccountNature];

export const BankAccountType = {
  Checking: 'Checking',
  Savings: 'Savings',
  Investment: 'Investment',
} as const;

export type BankAccountType =
  (typeof BankAccountType)[keyof typeof BankAccountType];

export const BankReconciliationStatus = {
  InProgress: 'InProgress',
  Completed: 'Completed',
  Cancelled: 'Cancelled',
} as const;

export type BankReconciliationStatus =
  (typeof BankReconciliationStatus)[keyof typeof BankReconciliationStatus];

export const BudgetStatus = {
  Draft: 'Draft',
  Approved: 'Approved',
  Closed: 'Closed',
} as const;

export type BudgetStatus =
  (typeof BudgetStatus)[keyof typeof BudgetStatus];

export const PersonStatus = {
  Active: 'Active',
  Blocked: 'Blocked',
  Deleted: 'Deleted',
} as const;

export type PersonStatus =
  (typeof PersonStatus)[keyof typeof PersonStatus];

export const PersonType = {
  Individual: 'Individual',
  Company: 'Company',
} as const;

export type PersonType =
  (typeof PersonType)[keyof typeof PersonType];

export const EmployeeStatus = {
  Active: 'Active',
  Inactive: 'Inactive',
  Terminated: 'Terminated',
} as const;

export type EmployeeStatus =
  (typeof EmployeeStatus)[keyof typeof EmployeeStatus];

export const PayrollStatus = {
  Processing: 'Processing',
  Processed: 'Processed',
  Cancelled: 'Cancelled',
} as const;

export type PayrollStatus =
  (typeof PayrollStatus)[keyof typeof PayrollStatus];

export const TaxType = {
  IRPJ: 'IRPJ',
  CSLL: 'CSLL',
  PIS: 'PIS',
  COFINS: 'COFINS',
  ISS: 'ISS',
  ICMS: 'ICMS',
  IPI: 'IPI',
  Other: 'Other',
} as const;

export type TaxType =
  (typeof TaxType)[keyof typeof TaxType];

export const TaxEntryStatus = {
  Pending: 'Pending',
  Paid: 'Paid',
  Overdue: 'Overdue',
  Cancelled: 'Cancelled',
} as const;

export type TaxEntryStatus =
  (typeof TaxEntryStatus)[keyof typeof TaxEntryStatus];

export const TaxPaymentStatus = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Cancelled: 'Cancelled',
} as const;

export type TaxPaymentStatus =
  (typeof TaxPaymentStatus)[keyof typeof TaxPaymentStatus];

export const BankStatementStatus = {
  Active: 'Active',
  Cancelled: 'Cancelled',
} as const;

export type BankStatementStatus =
  (typeof BankStatementStatus)[keyof typeof BankStatementStatus];

export const BankStatementEntryType = {
  Credit: 'Credit',
  Debit: 'Debit',
} as const;

export type BankStatementEntryType =
  (typeof BankStatementEntryType)[keyof typeof BankStatementEntryType];