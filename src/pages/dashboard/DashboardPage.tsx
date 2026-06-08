import { useEffect } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { FinancialSummaryCards } from '../../components/features/dashboard/FinancialSummaryCard'
import { OverdueAlerts } from '../../components/features/dashboard/OverdueAlerts'
import { CashFlowChart } from '../../components/features/dashboard/CashFlowChart'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useReports } from '../../hooks/useReports'
import { useAuthContext } from '../../contexts/AuthContext'
// import { today } from '../../utils/formatters'

const MOCK_CASHFLOW = [
  { month: 'Jan', revenue: 48000, expense: 32000 },
  { month: 'Fev', revenue: 52000, expense: 35000 },
  { month: 'Mar', revenue: 61000, expense: 41000 },
  { month: 'Abr', revenue: 55000, expense: 38000 },
  { month: 'Mai', revenue: 67000, expense: 44000 },
  { month: 'Jun', revenue: 72000, expense: 48000 },
]

export default function DashboardPage() {
  const { user } = useAuthContext()
  const { summary, isLoading, fetchSummary } = useReports()

  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  const greeting = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Bom dia'
    if (hour < 18) return 'Boa tarde'
    return 'Boa noite'
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`${greeting()}, ${user?.name?.split(' ')[0] ?? 'usuario'}!`}
        subtitle={`Resumo financeiro — ${new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}`}
      />

      {isLoading && !summary ? (
        <div className="flex justify-center py-20">
          <Spinner size="lg" className="text-blue-500" />
        </div>
      ) : (
        <>
          {/* Cards de resumo */}
          <FinancialSummaryCards
            totalRevenue={summary?.totalRevenue       ?? 0}
            totalExpenses={summary?.totalExpenses     ?? 0}
            netResult={summary?.netResult             ?? 0}
            totalReceivables={summary?.totalReceivables ?? 0}
            totalPayables={summary?.totalPayables     ?? 0}
            cashBalance={summary?.cashBalance         ?? 0}
          />

          {/* Grafico + alertas */}
          <div className="grid grid-cols-1 gap-6 xl:grid-cols-[1fr_380px]">
            <CashFlowChart data={MOCK_CASHFLOW} />
            <OverdueAlerts items={[]} />
          </div>
        </>
      )}
    </div>
  )
}
