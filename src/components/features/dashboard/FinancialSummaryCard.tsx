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
  default: { bg: 'bg-slate-100 dark:bg-slate-800',     text: 'text-slate-600 dark:text-slate-400' },
  success: { bg: 'bg-green-100 dark:bg-green-900/30',  text: 'text-green-600 dark:text-green-400' },
  danger:  { bg: 'bg-red-100 dark:bg-red-900/30',      text: 'text-red-600 dark:text-red-400' },
  warning: { bg: 'bg-amber-100 dark:bg-amber-900/30',  text: 'text-amber-600 dark:text-amber-400' },
  info:    { bg: 'bg-blue-100 dark:bg-blue-900/30',    text: 'text-blue-600 dark:text-blue-400' },
}

export function MetricCard({ title, value, icon, variant = 'default', subtitle, isLoading = false }: MetricCardProps) {
  const v = variants[variant]
  return (
    <Card>
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
        <div className={['flex h-11 w-11 shrink-0 items-center justify-center rounded-xl', v.bg, v.text].join(' ')}>
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

export function SecondaryStats({ activeEmployees, payrollsProcessed, totalReceived, totalTaxesPaid }: SecondaryStatsProps) {
  const stats = [
    { label: 'Funcionários Ativos',  value: activeEmployees.toLocaleString('pt-BR'),   icon: <Users size={18} strokeWidth={1.75} /> },
    { label: 'Folhas Processadas',   value: payrollsProcessed.toLocaleString('pt-BR'), icon: <Receipt size={18} strokeWidth={1.75} /> },
    { label: 'Total Recebido',       value: formatCurrency(totalReceived),             icon: <CheckCircle2 size={18} strokeWidth={1.75} /> },
    { label: 'Impostos Pagos',       value: formatCurrency(totalTaxesPaid),            icon: <Landmark size={18} strokeWidth={1.75} /> },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3 dark:border-slate-800 dark:bg-slate-900">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500 dark:bg-slate-800 dark:text-slate-400">
            {s.icon}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{s.label}</p>
            <p className="truncate text-sm font-semibold tabular-nums text-slate-900 dark:text-slate-100">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}