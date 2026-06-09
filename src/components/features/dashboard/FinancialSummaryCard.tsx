import { Card } from '../../ui/Card/Card'
import { formatCurrency } from '../../../utils/formatters'

interface MetricCardProps {
  title:    string
  value:    number
  icon:     string
  variant?: 'default' | 'success' | 'danger' | 'warning' | 'info'
  subtitle?: string
}

const variants = {
  default: { bg: 'bg-slate-100',  text: 'text-slate-600' },
  success: { bg: 'bg-green-100',  text: 'text-green-600' },
  danger:  { bg: 'bg-red-100',    text: 'text-red-600' },
  warning: { bg: 'bg-amber-100',  text: 'text-amber-600' },
  info:    { bg: 'bg-blue-100',   text: 'text-blue-600' },
}

export function MetricCard({ title, value, icon, variant = 'default', subtitle }: MetricCardProps) {
  const v = variants[variant]
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm text-slate-500">{title}</p>
          <p className="mt-1 font-display text-2xl font-semibold text-slate-900">
            {formatCurrency(value)}
          </p>
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
        </div>
        <div className={['flex h-10 w-10 shrink-0 items-center justify-center rounded-xl text-xl', v.bg, v.text].join(' ')}>
          {icon}
        </div>
      </div>
    </Card>
  )
}

interface FinancialSummaryCardsProps {
  totalRevenue:    number
  totalExpenses:   number
  netResult:       number
  totalReceivables: number
  totalPayables:   number
  cashBalance:     number
}

export function FinancialSummaryCards(props: FinancialSummaryCardsProps) {
  const { totalRevenue, totalExpenses, netResult, totalReceivables, totalPayables, cashBalance } = props

  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
      <MetricCard title="Receitas"          value={totalRevenue}      icon="↓" variant="success" />
      <MetricCard title="Despesas"          value={totalExpenses}     icon="↑" variant="danger"  />
      <MetricCard title="Resultado"         value={netResult}         icon="=" variant={netResult >= 0 ? 'success' : 'danger'} />
      <MetricCard title="A Receber"         value={totalReceivables}  icon="📥" variant="info"   />
      <MetricCard title="A Pagar"           value={totalPayables}     icon="📤" variant="warning" />
      <MetricCard title="Saldo em Caixa"    value={cashBalance}       icon="🏦" variant="default" />
    </div>
  )
}
