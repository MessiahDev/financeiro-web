import { NavLink, useLocation } from 'react-router-dom'
import { ROUTES } from '../../../router/routes'

interface NavItem {
  label: string
  path: string
  icon: string
}

interface NavGroup {
  group: string
  items: NavItem[]
}

const NAV: NavGroup[] = [
  {
    group: 'Geral',
    items: [
      { label: 'Dashboard',        path: ROUTES.DASHBOARD,        icon: '⬡' },
    ],
  },
  {
    group: 'Banco',
    items: [
      { label: 'Contas Bancarias', path: ROUTES.BANK_ACCOUNTS,        icon: '🏦' },
      { label: 'Extratos',         path: ROUTES.BANK_STATEMENTS,       icon: '📄' },
      { label: 'Conciliacoes',     path: ROUTES.BANK_RECONCILIATIONS,  icon: '⚖' },
    ],
  },
  {
    group: 'Contabilidade',
    items: [
      { label: 'Periodos',         path: ROUTES.ACCOUNTING_PERIODS, icon: '📅' },
      { label: 'Plano de Contas',  path: ROUTES.CHART_OF_ACCOUNTS,  icon: '🗂' },
      { label: 'Centros de Custo', path: ROUTES.COST_CENTERS,       icon: '🎯' },
      { label: 'Lancamentos',      path: ROUTES.JOURNAL_ENTRIES,    icon: '📒' },
    ],
  },
  {
    group: 'Financeiro',
    items: [
      { label: 'Contas a Pagar',   path: ROUTES.ACCOUNTS_PAYABLE,    icon: '↑' },
      { label: 'Contas a Receber', path: ROUTES.ACCOUNTS_RECEIVABLE,  icon: '↓' },
      { label: 'Transacoes',       path: ROUTES.TRANSACTIONS,         icon: '⇄' },
      { label: 'Orcamentos',       path: ROUTES.BUDGETS,              icon: '📊' },
    ],
  },
  {
    group: 'Cadastros',
    items: [
      { label: 'Clientes',         path: ROUTES.CUSTOMERS,  icon: '👤' },
      { label: 'Fornecedores',     path: ROUTES.SUPPLIERS,  icon: '🏭' },
    ],
  },
  {
    group: 'RH',
    items: [
      { label: 'Departamentos',    path: ROUTES.DEPARTMENTS, icon: '🏢' },
      { label: 'Funcionarios',     path: ROUTES.EMPLOYEES,   icon: '👥' },
      { label: 'Folha de Pag.',    path: ROUTES.PAYROLL,     icon: '💰' },
    ],
  },
  {
    group: 'Fiscal',
    items: [
      { label: 'Obrigacoes',       path: ROUTES.TAX_ENTRIES, icon: '📋' },
    ],
  },
  {
    group: 'Relatorios',
    items: [
      { label: 'Relatorios',       path: ROUTES.REPORTS,                   icon: '📈' },
      { label: 'Balancete',        path: ROUTES.REPORTS_TRIAL_BALANCE,     icon: '⚖' },
      { label: 'Resumo Financeiro',path: ROUTES.REPORTS_FINANCIAL_SUMMARY, icon: '💹' },
    ],
  },
]

interface SidebarProps {
  collapsed?: boolean
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const location = useLocation()

  return (
    <aside
      style={{ width: collapsed ? 64 : 'var(--sidebar-width, 256px)' }}
      className="flex h-screen flex-col overflow-hidden bg-slate-900 transition-all duration-300"
    >
      {/* Logo */}
      <div className="flex h-16 shrink-0 items-center gap-3 border-b border-slate-800 px-4">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-600 font-display text-sm font-bold text-white">
          F
        </div>
        {!collapsed && (
          <span className="font-display text-sm font-semibold text-white">
            Financeiro
          </span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto px-2 py-3">
        {NAV.map((group) => (
          <div key={group.group} className="mb-4">
            {!collapsed && (
              <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                {group.group}
              </p>
            )}
            {group.items.map((item) => {
              const isActive =
                item.path === ROUTES.DASHBOARD
                  ? location.pathname === '/'
                  : location.pathname.startsWith(item.path)

              return (
                <NavLink
                  key={item.path}
                  to={item.path}
                  title={collapsed ? item.label : undefined}
                  className={[
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
                    isActive
                      ? 'bg-blue-600/20 text-blue-400 font-medium'
                      : 'text-slate-400 hover:bg-white/5 hover:text-white',
                  ].join(' ')}
                >
                  <span className="shrink-0 text-base leading-none">{item.icon}</span>
                  {!collapsed && <span className="truncate">{item.label}</span>}
                </NavLink>
              )
            })}
          </div>
        ))}
      </nav>
    </aside>
  )
}
