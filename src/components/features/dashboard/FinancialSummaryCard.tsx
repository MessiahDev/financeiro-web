import { TrendingUp, TrendingDown, Wallet, ArrowDownToLine, ArrowUpFromLine, Users, Receipt, CheckCircle2, Landmark } from 'lucide-react'
import { Card } from '../../ui/Card/Card'
import { formatCurrency } from '../../../utils/formatters'

interface MetricCardProps {
  title:      string
  value:      number
  icon:       React.ReactNode
  variant?:   'default' | 'success' | 'danger' | 'warning' | 'info'
  subtitle?:  string
  isLoading?: boolean
}

const variants = {
  default: { badge: 'bg-gradient-to-br from-slate-400 to-slate-600',  accent: 'before:bg-slate-400 dark:before:bg-slate-600' },
  success: { badge: 'bg-gradient-to-br from-green-400 to-green-600',  accent: 'before:bg-green-500' },
  danger:  { badge: 'bg-gradient-to-br from-red-400 to-red-600',      accent: 'before:bg-red-500' },
  warning: { badge: 'bg-gradient-to-br from-amber-400 to-amber-600',  accent: 'before:bg-amber-500' },
  info:    { badge: 'bg-gradient-to-br from-blue-400 to-blue-600',    accent: 'before:bg-blue-500' },
}

export function MetricCard({ title, value, icon, variant = 'default', subtitle, isLoading = false }: MetricCardProps) {
  const v = variants[variant]
  return (
    <Card
      className={[
        'relative overflow-hidden',
        'before:absolute before:inset-x-0 before:top-0 before:h-[3px]',
        v.accent,
      ].join(' ')}
    >
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-500 dark:text-slate-400">{title}</p>
          {isLoading ? (
            <div className="mt-2 h-7 w-28 animate-pulse rounded bg-slate-100 dark:bg-slate-800" />
          ) : (
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-slate-900 dark:text-slate-100">
              {formatCurrency(value)}
            </p>
          )}
          {subtitle && <p className="mt-0.5 text-xs text-slate-400 dark:text-slate-500">{subtitle}</p>}
        </div>
        <div className={['flex h-11 w-11 shrink-0 items-center justify-center rounded-xl text-white shadow-md', v.badge].join(' ')}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

interface FinancialSummaryCardsProps {
  totalRevenue:        number
  totalExpenses:       number
  netResult:           number
  cashBalance:         number
  pendingReceivables:  number
  pendingPayables:     number
  isLoadingCash?:      boolean
}

export function FinancialSummaryCards(props: FinancialSummaryCardsProps) {
  const { totalRevenue, totalExpenses, netResult, cashBalance, pendingReceivables, pendingPayables, isLoadingCash } = props

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <MetricCard title="Receitas (mês)"     value={totalRevenue}       icon={<TrendingUp size={20} strokeWidth={1.75} />}   variant="success" />
      <MetricCard title="Despesas (mês)"     value={totalExpenses}      icon={<TrendingDown size={20} strokeWidth={1.75} />} variant="danger" />
      <MetricCard title="Resultado Líquido"  value={netResult}          icon={netResult >= 0 ? <TrendingUp size={20} strokeWidth={1.75} /> : <TrendingDown size={20} strokeWidth={1.75} />} variant={netResult >= 0 ? 'success' : 'danger'} />
      <MetricCard title="Saldo em Caixa"     value={cashBalance}        icon={<Wallet size={20} strokeWidth={1.75} />}    variant="default" isLoading={isLoadingCash} subtitle="Soma de todas as contas ativas" />
      <MetricCard title="A Receber"          value={pendingReceivables} icon={<ArrowDownToLine size={20} strokeWidth={1.75} />} variant="info"    subtitle="Pendente no período" />
      <MetricCard title="A Pagar"            value={pendingPayables}    icon={<ArrowUpFromLine size={20} strokeWidth={1.75} />}   variant="warning" subtitle="Pendente no período" />
    </div>
  )
}

interface SecondaryStatsProps {
  activeEmployees:   number
  payrollsProcessed: number
  totalReceived:     number
  totalTaxesPaid:    number
}

const secondaryVariants = {
  blue:   'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400',
  violet: 'bg-violet-50 text-violet-600 dark:bg-violet-900/30 dark:text-violet-400',
  green:  'bg-green-50 text-green-600 dark:bg-green-900/30 dark:text-green-400',
  amber:  'bg-amber-50 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400',
}

export function SecondaryStats({ activeEmployees, payrollsProcessed, totalReceived, totalTaxesPaid }: SecondaryStatsProps) {
  const stats = [
    { label: 'Funcionários Ativos',  value: activeEmployees.toLocaleString('pt-BR'),   icon: <Users size={18} strokeWidth={1.75} />,        color: secondaryVariants.blue },
    { label: 'Folhas Processadas',   value: payrollsProcessed.toLocaleString('pt-BR'), icon: <Receipt size={18} strokeWidth={1.75} />,       color: secondaryVariants.violet },
    { label: 'Total Recebido',       value: formatCurrency(totalReceived),             icon: <CheckCircle2 size={18} strokeWidth={1.75} />,  color: secondaryVariants.green },
    { label: 'Impostos Pagos',       value: formatCurrency(totalTaxesPaid),            icon: <Landmark size={18} strokeWidth={1.75} />,      color: secondaryVariants.amber },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <Card key={s.label} padding="sm" className="flex items-center gap-3">
          <div className={['flex h-9 w-9 shrink-0 items-center justify-center rounded-lg', s.color].join(' ')}>
            {s.icon}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="truncate text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">{s.value}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}