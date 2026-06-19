import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card } from '../../components/ui/Card/Card'
import { Button } from '../../components/ui/Button/Button'
import { DatePicker } from '../../components/ui/DatePicker/DatePicker'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useReports } from '../../hooks/useReports'
import { formatCurrency } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'

function MetricRow({ label, value, highlight, isCount }: {
  label: string
  value: number
  highlight?: 'positive' | 'negative' | 'neutral'
  isCount?: boolean
}) {
  const color = highlight === 'positive' ? 'text-green-600' : highlight === 'negative' ? 'text-red-600' : 'text-slate-900'
  return (
    <div className="flex items-center justify-between border-b border-slate-100 py-3 last:border-0">
      <span className="text-sm text-slate-600">{label}</span>
      <span className={`font-semibold ${color}`}>
        {isCount ? value.toLocaleString('pt-BR') : formatCurrency(value)}
      </span>
    </div>
  )
}

function startOfMonth(d: Date): string {
  return new Date(d.getFullYear(), d.getMonth(), 1).toISOString().split('T')[0]
}

function todayStr(): string {
  return new Date().toISOString().split('T')[0]
}

export default function FinancialSummaryPage() {
  const { summary, isLoading, fetchSummary } = useReports()
  const [periodStart, setPeriodStart] = useState(startOfMonth(new Date()))
  const [periodEnd, setPeriodEnd]     = useState(todayStr())

  useEffect(() => {
    fetchSummary({ periodStart, periodEnd })
  }, [])

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Resumo Financeiro" backTo={ROUTES.REPORTS} />

      <div className="flex flex-wrap items-end gap-3">
        <DatePicker label="De"  value={periodStart} onChange={e => setPeriodStart((e.target as HTMLInputElement).value)} />
        <DatePicker label="Até" value={periodEnd}   onChange={e => setPeriodEnd((e.target as HTMLInputElement).value)} />
        <Button onClick={() => fetchSummary({ periodStart, periodEnd })}>Filtrar</Button>
      </div>

      {isLoading ? (
        <div className="flex justify-center py-16"><Spinner size="lg" className="text-blue-500" /></div>
      ) : summary ? (
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <Card>
            <h3 className="mb-2 font-display font-semibold text-slate-900">Resultado do Período</h3>
            <MetricRow label="Total de Créditos"  value={summary.totalCredits} highlight="positive" />
            <MetricRow label="Total de Débitos"   value={summary.totalDebits}  highlight="negative" />
            <MetricRow label="Resultado Líquido"  value={summary.netBalance}   highlight={summary.netBalance >= 0 ? 'positive' : 'negative'} />
          </Card>

          <Card>
            <h3 className="mb-2 font-display font-semibold text-slate-900">Folha e Equipe</h3>
            <MetricRow label="Total Folha de Pagamento" value={summary.totalPayroll}      highlight="negative" />
            <MetricRow label="Funcionários Ativos"      value={summary.activeEmployees}   highlight="neutral" isCount />
            <MetricRow label="Folhas Processadas"       value={summary.payrollsProcessed} highlight="neutral" isCount />
          </Card>

          <Card>
            <h3 className="mb-2 font-display font-semibold text-slate-900">Contas a Pagar e Receber</h3>
            <MetricRow label="Total Pago (AP)"      value={summary.totalPaid}          highlight="negative" />
            <MetricRow label="Total Recebido (AR)"  value={summary.totalReceived}      highlight="positive" />
            <MetricRow label="Pendente a Pagar"     value={summary.pendingPayables}    highlight="negative" />
            <MetricRow label="Pendente a Receber"   value={summary.pendingReceivables} highlight="positive" />
          </Card>

          <Card>
            <h3 className="mb-2 font-display font-semibold text-slate-900">Tributos</h3>
            <MetricRow label="Total de Impostos Pagos" value={summary.totalTaxesPaid} highlight="negative" />
          </Card>
        </div>
      ) : (
        <p className="text-sm text-slate-400">Nenhum dado disponível.</p>
      )}
    </div>
  )
}