export const API_BASE_URL = import.meta.env.VITE_API_URL

export const API_VERSION = 'v1'

export const API_ROUTES = {
  AUTH_LOGIN: '/auth/login',
  AUTH_REGISTER: '/auth/register',
  BANK_ACCOUNTS: '/bank-accounts',
  BANK_STATEMENTS: '/bank-statements',
  BANK_RECONCILIATIONS: '/bank-reconciliations',
  ACCOUNTING_PERIODS: '/accounting-periods',
  CHART_OF_ACCOUNTS: '/chart-of-accounts',
  COST_CENTERS: '/cost-centers',
  JOURNAL_ENTRIES: '/journal-entries',
  ACCOUNTS_PAYABLE: '/accounts-payable',
  ACCOUNTS_RECEIVABLE: '/accounts-receivable',
  TRANSACTIONS: '/transactions',
  BUDGETS: '/budgets',
  CUSTOMERS: '/customers',
  SUPPLIERS: '/suppliers',
  DEPARTMENTS: '/departments',
  EMPLOYEES: '/employees',
  PAYROLL: '/payroll',
  TAX_ENTRIES: '/tax-entries',
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
