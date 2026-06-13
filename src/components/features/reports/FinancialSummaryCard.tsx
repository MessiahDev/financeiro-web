import type { FinancialSummary } from '../../../types/domain.types'

const fmt = new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' })

interface Props {
  summary:   FinancialSummary | null
  isLoading: boolean
}

export function FinancialSummaryCard({ summary, isLoading }: Props) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
        {Array.from({ length: 11 }).map((_, i) => (
          <div key={i} className="animate-pulse rounded-lg border border-gray-200 bg-gray-50 p-5 h-24" />
        ))}
      </div>
    )
  }

  if (!summary) return null

  const cards: Array<{ label: string; value: number; variant: 'neutral' | 'positive' | 'negative'; isCount?: boolean }> = [
    { label: 'Total Créditos',       value: summary.totalCredits,       variant: 'positive' },
    { label: 'Total Débitos',        value: summary.totalDebits,        variant: 'negative' },
    { label: 'Saldo Líquido',        value: summary.netBalance,         variant: summary.netBalance >= 0 ? 'positive' : 'negative' },
    { label: 'Total Folha',          value: summary.totalPayroll,       variant: 'neutral'  },
    { label: 'Total Pago (AP)',      value: summary.totalPaid,          variant: 'negative' },
    { label: 'Total Recebido (AR)',  value: summary.totalReceived,      variant: 'positive' },
    { label: 'Total Impostos Pagos', value: summary.totalTaxesPaid,     variant: 'negative' },
    { label: 'AP Pendentes',         value: summary.pendingPayables,    variant: 'negative' },
    { label: 'AR Pendentes',         value: summary.pendingReceivables, variant: 'positive' },
    { label: 'Func. Ativos',         value: summary.activeEmployees,    variant: 'neutral',  isCount: true },
    { label: 'Folhas Processadas',   value: summary.payrollsProcessed,  variant: 'neutral',  isCount: true },
  ]

  const clsMap = {
    positive: { text: 'text-green-700', bg: 'bg-green-50  border-green-200' },
    negative: { text: 'text-red-700',   bg: 'bg-red-50    border-red-200'   },
    neutral:  { text: 'text-gray-900',  bg: 'bg-white     border-gray-200'  },
  }

  return (
    <div className="grid grid-cols-2 gap-4 md:grid-cols-3">
      {cards.map((card) => {
        const cls = clsMap[card.variant]
        return (
          <div key={card.label} className={'rounded-lg border p-5 shadow-sm ' + cls.bg}>
            <p className="text-xs font-medium uppercase tracking-wide text-gray-500">{card.label}</p>
            <p className={'mt-2 text-2xl font-semibold ' + cls.text}>
              {card.isCount
                ? card.value.toLocaleString('pt-BR')
                : fmt.format(card.value)}
            </p>
          </div>
        )
      })}
    </div>
  )
}