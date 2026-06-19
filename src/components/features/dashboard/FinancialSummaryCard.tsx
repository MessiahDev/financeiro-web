import { Card } from '../../ui/Card/Card'
import { formatCurrency } from '../../../utils/formatters'

function TrendUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 17 9 11 13 15 21 7" />
      <polyline points="14 7 21 7 21 14" />
    </svg>
  )
}

function TrendDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="3 7 9 13 13 9 21 17" />
      <polyline points="14 17 21 17 21 10" />
    </svg>
  )
}

function WalletIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 7a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v10a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V7Z" />
      <path d="M16 13h2" />
      <path d="M3 9h18" />
    </svg>
  )
}

function InboxDownIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
      <path d="M4 12h4l2 3h4l2-3h4" />
      <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
    </svg>
  )
}

function InboxUpIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12V6a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v6" />
      <path d="M4 12h4l2-3h4l2 3h4" />
      <path d="M4 12v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6" />
    </svg>
  )
}

function UsersIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H7a4 4 0 0 0-4 4v2" />
      <circle cx="10" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}

function ReceiptIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M6 3h12v18l-3-2-3 2-3-2-3 2V3Z" />
      <path d="M9 8h6M9 12h6" />
    </svg>
  )
}

function CheckCircleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="9" />
      <path d="m9 12 2 2 4-4" />
    </svg>
  )
}

function LandmarkIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3 21h18" />
      <path d="M5 21V10M9 21V10M15 21V10M19 21V10" />
      <path d="M3 10l9-6 9 6" />
    </svg>
  )
}

interface MetricCardProps {
  title:      string
  value:      number
  icon:       React.ReactNode
  variant?:   'default' | 'success' | 'danger' | 'warning' | 'info'
  subtitle?:  string
  isLoading?: boolean
}

const variants = {
  default: { bg: 'bg-slate-100', text: 'text-slate-600' },
  success: { bg: 'bg-green-100', text: 'text-green-600' },
  danger:  { bg: 'bg-red-100',   text: 'text-red-600' },
  warning: { bg: 'bg-amber-100', text: 'text-amber-600' },
  info:    { bg: 'bg-blue-100',  text: 'text-blue-600' },
}

export function MetricCard({ title, value, icon, variant = 'default', subtitle, isLoading = false }: MetricCardProps) {
  const v = variants[variant]
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="text-sm text-slate-500">{title}</p>
          {isLoading ? (
            <div className="mt-2 h-7 w-28 animate-pulse rounded bg-slate-100" />
          ) : (
            <p className="mt-1 font-display text-2xl font-bold tabular-nums text-slate-900">
              {formatCurrency(value)}
            </p>
          )}
          {subtitle && <p className="mt-0.5 text-xs text-slate-400">{subtitle}</p>}
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
      <MetricCard title="Receitas (mês)"     value={totalRevenue}       icon={<TrendUpIcon />}   variant="success" />
      <MetricCard title="Despesas (mês)"     value={totalExpenses}      icon={<TrendDownIcon />} variant="danger" />
      <MetricCard title="Resultado Líquido"  value={netResult}          icon={netResult >= 0 ? <TrendUpIcon /> : <TrendDownIcon />} variant={netResult >= 0 ? 'success' : 'danger'} />
      <MetricCard title="Saldo em Caixa"     value={cashBalance}        icon={<WalletIcon />}    variant="default" isLoading={isLoadingCash} subtitle="Soma de todas as contas ativas" />
      <MetricCard title="A Receber"          value={pendingReceivables} icon={<InboxDownIcon />} variant="info"    subtitle="Pendente no período" />
      <MetricCard title="A Pagar"            value={pendingPayables}    icon={<InboxUpIcon />}   variant="warning" subtitle="Pendente no período" />
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
    { label: 'Funcionários Ativos',  value: activeEmployees.toLocaleString('pt-BR'), icon: <UsersIcon /> },
    { label: 'Folhas Processadas',   value: payrollsProcessed.toLocaleString('pt-BR'), icon: <ReceiptIcon /> },
    { label: 'Total Recebido',       value: formatCurrency(totalReceived), icon: <CheckCircleIcon /> },
    { label: 'Impostos Pagos',       value: formatCurrency(totalTaxesPaid), icon: <LandmarkIcon /> },
  ]

  return (
    <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
      {stats.map((s) => (
        <div key={s.label} className="flex items-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-slate-50 text-slate-500">
            {s.icon}
          </div>
          <div className="min-w-0">
            <p className="truncate text-xs text-slate-500">{s.label}</p>
            <p className="truncate text-sm font-semibold tabular-nums text-slate-900">{s.value}</p>
          </div>
        </div>
      ))}
    </div>
  )
}