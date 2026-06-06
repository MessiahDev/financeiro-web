export const API_BASE_URL = import.meta.env.VITE_API_URL ?? 'http://localhost:5000'
 
export const API_VERSION = 'v1'
 
export const API_ROUTES = {
  // Auth
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
 
  // Bank Accounts
  BANK_ACCOUNTS: '/bank-accounts',
 
  // Bank Statements
  BANK_STATEMENTS: '/bank-statements',
 
  // Accounting Periods
  ACCOUNTING_PERIODS: '/accounting-periods',
 
  // Chart of Accounts
  CHART_OF_ACCOUNTS: '/chart-of-accounts',
 
  // Cost Centers
  COST_CENTERS: '/cost-centers',
 
  // Journal Entries
  JOURNAL_ENTRIES: '/journal-entries',
 
  // Accounts Payable
  ACCOUNTS_PAYABLE: '/accounts-payable',
 
  // Accounts Receivable
  ACCOUNTS_RECEIVABLE: '/accounts-receivable',
 
  // Transactions
  TRANSACTIONS: '/transactions',
 
  // Budgets
  BUDGETS: '/budgets',
 
  // Customers
  CUSTOMERS: '/customers',
 
  // Suppliers
  SUPPLIERS: '/suppliers',
 
  // Departments
  DEPARTMENTS: '/departments',
 
  // Employees
  EMPLOYEES: '/employees',
 
  // Payroll
  PAYROLL: '/payroll',
 
  // Tax Entries
  TAX_ENTRIES: '/tax-entries',
 
  // Reports
  REPORTS: '/reports',
} as const
 
export const STORAGE_KEYS = {
  TOKEN: '@financeiro:token',
  USER: '@financeiro:user',
  REFRESH_TOKEN: '@financeiro:refreshToken',
} as const
 
export const DATE_FORMAT = 'dd/MM/yyyy'
export const DATETIME_FORMAT = 'dd/MM/yyyy HH:mm'
export const MONTH_YEAR_FORMAT = 'MM/yyyy'
 
export const CURRENCY = {
  locale: 'pt-BR',
  currency: 'BRL',
} as const
 
export const BRAZIL_STATES = [
  { value: 'AC', label: 'Acre' },
  { value: 'AL', label: 'Alagoas' },
  { value: 'AP', label: 'Amapa' },
  { value: 'AM', label: 'Amazonas' },
  { value: 'BA', label: 'Bahia' },
  { value: 'CE', label: 'Ceara' },
  { value: 'DF', label: 'Distrito Federal' },
  { value: 'ES', label: 'Espirito Santo' },
  { value: 'GO', label: 'Goias' },
  { value: 'MA', label: 'Maranhao' },
  { value: 'MT', label: 'Mato Grosso' },
  { value: 'MS', label: 'Mato Grosso do Sul' },
  { value: 'MG', label: 'Minas Gerais' },
  { value: 'PA', label: 'Para' },
  { value: 'PB', label: 'Paraiba' },
  { value: 'PR', label: 'Parana' },
  { value: 'PE', label: 'Pernambuco' },
  { value: 'PI', label: 'Piaui' },
  { value: 'RJ', label: 'Rio de Janeiro' },
  { value: 'RN', label: 'Rio Grande do Norte' },
  { value: 'RS', label: 'Rio Grande do Sul' },
  { value: 'RO', label: 'Rondonia' },
  { value: 'RR', label: 'Roraima' },
  { value: 'SC', label: 'Santa Catarina' },
  { value: 'SP', label: 'Sao Paulo' },
  { value: 'SE', label: 'Sergipe' },
  { value: 'TO', label: 'Tocantins' },
] as const