import { NavLink, useLocation } from 'react-router-dom'
import {
  LayoutDashboard, Landmark, FileText, Scale,
  Calendar, FolderTree, Target, BookText,
  ArrowUpCircle, ArrowDownCircle, ArrowLeftRight, PieChart,
  UserCircle, Factory, Building2, Users, Wallet,
  ClipboardList, TrendingUp, LineChart, ShieldCheck,
  type LucideIcon,
} from 'lucide-react'
import { ROUTES } from '../../../router/routes'
import { useAuthContext } from '../../../contexts/AuthContext'

interface NavItem {
  label: string
  path: string
  icon: LucideIcon
}

interface NavGroup {
  group: string
  items: NavItem[]
  requiredRole?: string
}

const NAV: NavGroup[] = [
  {
    group: 'Geral',
    items: [
      { label: 'Dashboard', path: ROUTES.DASHBOARD, icon: LayoutDashboard },
    ],
  },
  {
    group: 'Banco',
    items: [
      { label: 'Contas Bancarias', path: ROUTES.BANK_ACCOUNTS,       icon: Landmark },
      { label: 'Extratos',         path: ROUTES.BANK_STATEMENTS,      icon: FileText },
      { label: 'Conciliacoes',     path: ROUTES.BANK_RECONCILIATIONS, icon: Scale },
    ],
  },
  {
    group: 'Contabilidade',
    items: [
      { label: 'Periodos',         path: ROUTES.ACCOUNTING_PERIODS, icon: Calendar },
      { label: 'Plano de Contas',  path: ROUTES.CHART_OF_ACCOUNTS,  icon: FolderTree },
      { label: 'Centros de Custo', path: ROUTES.COST_CENTERS,       icon: Target },
      { label: 'Lancamentos',      path: ROUTES.JOURNAL_ENTRIES,    icon: BookText },
    ],
  },
  {
    group: 'Financeiro',
    items: [
      { label: 'Contas a Pagar',   path: ROUTES.ACCOUNTS_PAYABLE,   icon: ArrowUpCircle },
      { label: 'Contas a Receber', path: ROUTES.ACCOUNTS_RECEIVABLE, icon: ArrowDownCircle },
      { label: 'Transacoes',       path: ROUTES.TRANSACTIONS,        icon: ArrowLeftRight },
      { label: 'Orcamentos',       path: ROUTES.BUDGETS,             icon: PieChart },
    ],
  },
  {
    group: 'Cadastros',
    items: [
      { label: 'Clientes',     path: ROUTES.CUSTOMERS, icon: UserCircle },
      { label: 'Fornecedores', path: ROUTES.SUPPLIERS, icon: Factory },
    ],
  },
  {
    group: 'RH',
    requiredRole: 'Manager',
    items: [
      { label: 'Departamentos', path: ROUTES.DEPARTMENTS, icon: Building2 },
      { label: 'Funcionarios',  path: ROUTES.EMPLOYEES,   icon: Users },
      { label: 'Folha de Pag.', path: ROUTES.PAYROLL,     icon: Wallet },
    ],
  },
  {
    group: 'Fiscal',
    items: [
      { label: 'Obrigacoes', path: ROUTES.TAX_ENTRIES, icon: ClipboardList },
    ],
  },
  {
    group: 'Relatorios',
    items: [
      { label: 'Relatorios',        path: ROUTES.REPORTS,                   icon: TrendingUp },
      { label: 'Balancete',         path: ROUTES.REPORTS_TRIAL_BALANCE,     icon: Scale },
      { label: 'Resumo Financeiro', path: ROUTES.REPORTS_FINANCIAL_SUMMARY, icon: LineChart },
    ],
  },
  {
    group: 'Administracao',
    requiredRole: 'Admin',
    items: [
      { label: 'Gerenciar Usuarios', path: ROUTES.USER_MANAGEMENT, icon: ShieldCheck },
    ],
  },
]

interface SidebarProps {
  collapsed?: boolean
}

export function Sidebar({ collapsed = false }: SidebarProps) {
  const location = useLocation()
  const { hasMinimumRole } = useAuthContext()

  const visibleNav = NAV.filter(group => !group.requiredRole || hasMinimumRole(group.requiredRole))

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
        {visibleNav.map((group) => (
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

              const Icon = item.icon

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
                  <Icon size={17} className="shrink-0" strokeWidth={2} />
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