import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card } from '../../components/ui/Card/Card'
import { Button } from '../../components/ui/Button/Button'
import { DatePicker } from '../../components/ui/DatePicker/DatePicker'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useReports } from '../../hooks/useReports'
import { formatCurrency } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'

function MetricRow({ label, value, highlight }: { label: string; value: number; highlight?: 'positive' | 'negative' | 'neutral' }) {
  const color = highlight === 'positive' ? 'text-green-600' : highlight === 'negative' ? 'text-red-600' : 'text-slate-900'
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`font-semibold ${color}`}>{formatCurrency(value)}</span>
    </div>
  )
}

export default function FinancialSummaryPage() {
  const { summary, isLoading, fetchSummary } = useReports()
  const [startDate, setStartDate] = useState('')
  const [endDate, setEndDate] = useState('')

  useEffect(() => { fetchSummary() }, [])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Resumo Financeiro" backTo={ROUTES.REPORTS} />
      <div className="flex flex-wrap items-end gap-3">
        <DatePicker label="De" value={startDate} onChange={e => setStartDate((e.target as HTMLInputElement).value)} />
        <DatePicker label="Ate" value={endDate}   onChange={e => setEndDate((e.target as HTMLInputElement).value)} />
        <Button onClick={() => fetchSummary({ startDate, endDate })}>Filtrar</Button>
      </div>
      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" className="text-blue-500" /></div>
      ) : summary ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-2 font-display font-semibold text-slate-900">Resultado do Periodo</h3>
            <MetricRow label="Total de Receitas"  value={summary.totalRevenue}  highlight="positive" />
            <MetricRow label="Total de Despesas"  value={summary.totalExpenses} highlight="negative" />
            <MetricRow label="Resultado Liquido"  value={summary.netResult}     highlight={summary.netResult >= 0 ? 'positive' : 'negative'} />
          </Card>
          <Card>
            <h3 className="mb-2 font-display font-semibold text-slate-900">Posicao Financeira</h3>
            <MetricRow label="Contas a Receber"   value={summary.totalReceivables} highlight="positive" />
            <MetricRow label="Contas a Pagar"     value={summary.totalPayables}    highlight="negative" />
            <MetricRow label="Saldo em Caixa"     value={summary.cashBalance} />
          </Card>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Nenhum dado disponivel.</p>
      )}
    </div>
  )
}
