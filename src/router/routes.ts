export const ROUTES = {
  LOGIN: '/login',
  REGISTER: '/register',

  DASHBOARD: '/',

  BANK_ACCOUNTS: '/bank-accounts',
  BANK_ACCOUNT_DETAIL: '/bank-accounts/:id',
  BANK_STATEMENTS: '/bank-statements',
  BANK_RECONCILIATIONS: '/bank-reconciliations',
  BANK_RECONCILIATION_DETAIL: '/bank-reconciliations/:id',

  ACCOUNTING_PERIODS: '/accounting-periods',
  CHART_OF_ACCOUNTS: '/chart-of-accounts',
  COST_CENTERS: '/cost-centers',
  JOURNAL_ENTRIES: '/journal-entries',
  JOURNAL_ENTRY_DETAIL: '/journal-entries/:id',

  ACCOUNTS_PAYABLE: '/accounts-payable',
  ACCOUNT_PAYABLE_DETAIL: '/accounts-payable/:id',
  ACCOUNTS_RECEIVABLE: '/accounts-receivable',
  ACCOUNT_RECEIVABLE_DETAIL: '/accounts-receivable/:id',
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  BUDGET_DETAIL: '/budgets/:id',

  CUSTOMERS: '/customers',
  CUSTOMER_DETAIL: '/customers/:id',
  SUPPLIERS: '/suppliers',
  SUPPLIER_DETAIL: '/suppliers/:id',

  DEPARTMENTS: '/departments',
  EMPLOYEES: '/employees',
  EMPLOYEE_DETAIL: '/employees/:id',
  PAYROLL: '/payroll',
  PAYROLL_DETAIL: '/payroll/:id',

  TAX_ENTRIES: '/tax-entries',
  TAX_ENTRY_DETAIL: '/tax-entries/:id',

  REPORTS: '/reports',
  REPORTS_FINANCIAL_SUMMARY: '/reports/financial-summary',
  REPORTS_TRIAL_BALANCE: '/reports/trial-balance',

  NOT_FOUND: '/404',
  UNAUTHORIZED: '/403',
} as const

export function buildPath(
  route: string,
  params: Record<string, string | number>,
): string {
  return Object.entries(params).reduce(
    (path, [key, value]) => path.replace(`:${key}`, String(value)),
    route,
  )
}
