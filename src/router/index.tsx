import { lazy, Suspense } from 'react'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { PrivateRoute } from './PrivateRoute'
import { ROUTES } from './routes'

const LoginPage                   = lazy(() => import('../pages/auth/LoginPage'))
const RegisterPage                = lazy(() => import('../pages/auth/RegisterPage'))
const DashboardPage               = lazy(() => import('../pages/dashboard/DashboardPage'))

const BankAccountsPage            = lazy(() => import('../pages/bankAccounts/BankAccountsPage'))
const BankAccountDetailPage       = lazy(() => import('../pages/bankAccounts/BankAccountDetailPage'))
const BankStatementsPage          = lazy(() => import('../pages/bankStatements/BankStatementsPage'))
const BankReconciliationsPage     = lazy(() => import('../pages/bankReconciliations/BankReconciliationsPage'))
const BankReconciliationDetailPage = lazy(() => import('../pages/bankReconciliations/BankReconciliationDetailPage'))

const AccountingPeriodsPage       = lazy(() => import('../pages/accountingPeriods/AccountingPeriodsPage'))
const ChartOfAccountsPage         = lazy(() => import('../pages/chartOfAccounts/ChartOfAccountsPage'))
const CostCentersPage             = lazy(() => import('../pages/costCenters/CostCentersPage'))
const JournalEntriesPage          = lazy(() => import('../pages/journalEntries/JournalEntriesPage'))
const JournalEntryDetailPage      = lazy(() => import('../pages/journalEntries/JournalEntryDetailPage'))

const AccountsPayablePage         = lazy(() => import('../pages/accountsPayable/AccountsPayablePage'))
const AccountPayableDetailPage    = lazy(() => import('../pages/accountsPayable/AccountPayableDetailPage'))
const AccountsReceivablePage      = lazy(() => import('../pages/accountsReceivable/AccountsReceivablePage'))
const AccountReceivableDetailPage = lazy(() => import('../pages/accountsReceivable/AccountReceivableDetailPage'))
const TransactionsPage            = lazy(() => import('../pages/transactions/TransactionsPage'))
const BudgetsPage                 = lazy(() => import('../pages/budgets/BudgetsPage'))
const BudgetDetailPage            = lazy(() => import('../pages/budgets/BudgetDetailPage'))

const CustomersPage               = lazy(() => import('../pages/customers/CustomersPage'))
const CustomerDetailPage          = lazy(() => import('../pages/customers/CustomerDetailPage'))
const SuppliersPage               = lazy(() => import('../pages/suppliers/SuppliersPage'))
const SupplierDetailPage          = lazy(() => import('../pages/suppliers/SupplierDetailPage'))

const DepartmentsPage             = lazy(() => import('../pages/departments/DepartmentsPage'))
const EmployeesPage               = lazy(() => import('../pages/employees/EmployeesPage'))
const EmployeeDetailPage          = lazy(() => import('../pages/employees/EmployeeDetailPage'))
const PayrollPage                 = lazy(() => import('../pages/payroll/PayrollPage'))
const PayrollDetailPage           = lazy(() => import('../pages/payroll/PayrollDetailPage'))

const TaxEntriesPage              = lazy(() => import('../pages/taxEntries/TaxEntriesPage'))
const TaxEntryDetailPage          = lazy(() => import('../pages/taxEntries/TaxEntryDetailPage'))

const ReportsPage                 = lazy(() => import('../pages/reports/ReportsPage'))
const FinancialSummaryPage        = lazy(() => import('../pages/reports/FinancialSummaryPage'))
const TrialBalancePage            = lazy(() => import('../pages/reports/TrialBalancePage'))

const NotFoundPage                = lazy(() => import('../pages/errors/NotFoundPage'))
const UnauthorizedPage            = lazy(() => import('../pages/errors/UnauthorizedPage'))

const MainLayout   = lazy(() => import('../components/layout/MainLayout/MainLayout'))
const AuthLayout   = lazy(() => import('../components/layout/AuthLayout/AuthLayout'))

function PageLoader() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-50">
      <div className="h-10 w-10 animate-spin rounded-full border-4 border-blue-600 border-t-transparent" />
    </div>
  )
}

function withSuspense(Component: React.ComponentType) {
  return (
    <Suspense fallback={<PageLoader />}>
      <Component />
    </Suspense>
  )
}

const router = createBrowserRouter([
  {
    element: <Suspense fallback={<PageLoader />}><AuthLayout /></Suspense>,
    children: [
      { path: ROUTES.LOGIN,    element: withSuspense(LoginPage) },
      { path: ROUTES.REGISTER, element: withSuspense(RegisterPage) },
    ],
  },

  {
    element: <PrivateRoute />,
    children: [
      {
        element: <Suspense fallback={<PageLoader />}><MainLayout /></Suspense>,
        children: [
          { path: ROUTES.DASHBOARD, element: withSuspense(DashboardPage) },

          { path: ROUTES.BANK_ACCOUNTS,              element: withSuspense(BankAccountsPage) },
          { path: ROUTES.BANK_ACCOUNT_DETAIL,        element: withSuspense(BankAccountDetailPage) },
          { path: ROUTES.BANK_STATEMENTS,            element: withSuspense(BankStatementsPage) },
          { path: ROUTES.BANK_RECONCILIATIONS,       element: withSuspense(BankReconciliationsPage) },
          { path: ROUTES.BANK_RECONCILIATION_DETAIL, element: withSuspense(BankReconciliationDetailPage) },

          { path: ROUTES.ACCOUNTING_PERIODS,    element: withSuspense(AccountingPeriodsPage) },
          { path: ROUTES.CHART_OF_ACCOUNTS,     element: withSuspense(ChartOfAccountsPage) },
          { path: ROUTES.COST_CENTERS,          element: withSuspense(CostCentersPage) },
          { path: ROUTES.JOURNAL_ENTRIES,       element: withSuspense(JournalEntriesPage) },
          { path: ROUTES.JOURNAL_ENTRY_DETAIL,  element: withSuspense(JournalEntryDetailPage) },

          { path: ROUTES.ACCOUNTS_PAYABLE,          element: withSuspense(AccountsPayablePage) },
          { path: ROUTES.ACCOUNT_PAYABLE_DETAIL,    element: withSuspense(AccountPayableDetailPage) },
          { path: ROUTES.ACCOUNTS_RECEIVABLE,       element: withSuspense(AccountsReceivablePage) },
          { path: ROUTES.ACCOUNT_RECEIVABLE_DETAIL, element: withSuspense(AccountReceivableDetailPage) },
          { path: ROUTES.TRANSACTIONS,              element: withSuspense(TransactionsPage) },
          { path: ROUTES.BUDGETS,                   element: withSuspense(BudgetsPage) },
          { path: ROUTES.BUDGET_DETAIL,             element: withSuspense(BudgetDetailPage) },

          { path: ROUTES.CUSTOMERS,       element: withSuspense(CustomersPage) },
          { path: ROUTES.CUSTOMER_DETAIL, element: withSuspense(CustomerDetailPage) },
          { path: ROUTES.SUPPLIERS,       element: withSuspense(SuppliersPage) },
          { path: ROUTES.SUPPLIER_DETAIL, element: withSuspense(SupplierDetailPage) },

          { path: ROUTES.DEPARTMENTS,    element: withSuspense(DepartmentsPage) },
          { path: ROUTES.EMPLOYEES,      element: withSuspense(EmployeesPage) },
          { path: ROUTES.EMPLOYEE_DETAIL, element: withSuspense(EmployeeDetailPage) },
          { path: ROUTES.PAYROLL,        element: withSuspense(PayrollPage) },
          { path: ROUTES.PAYROLL_DETAIL, element: withSuspense(PayrollDetailPage) },

          { path: ROUTES.TAX_ENTRIES,      element: withSuspense(TaxEntriesPage) },
          { path: ROUTES.TAX_ENTRY_DETAIL, element: withSuspense(TaxEntryDetailPage) },

          { path: ROUTES.REPORTS,                   element: withSuspense(ReportsPage) },
          { path: ROUTES.REPORTS_FINANCIAL_SUMMARY,  element: withSuspense(FinancialSummaryPage) },
          { path: ROUTES.REPORTS_TRIAL_BALANCE,      element: withSuspense(TrialBalancePage) },
        ],
      },
    ],
  },

  { path: ROUTES.UNAUTHORIZED, element: withSuspense(UnauthorizedPage) },
  { path: ROUTES.NOT_FOUND,    element: withSuspense(NotFoundPage) },
  { path: '*',                 element: withSuspense(NotFoundPage) },
])

export function AppRouter() {
  return <RouterProvider router={router} />
}
