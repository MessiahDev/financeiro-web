import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { Button } from '../../components/ui/Button/Button'
import { BudgetStatusBadge } from '../../components/features/budgets/BudgetStatusBadge'
import { useBudgets } from '../../hooks/useBudgets'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'
import type { Budget, BudgetItem, BudgetVsActual, BudgetVsActualItem } from '../../types/domain.types'

export default function BudgetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById, getVsActual } = useBudgets()
  const [vsActual, setVsActual]       = useState<BudgetVsActual | null>(null)
  const [isLoadingVs, setIsLoadingVs] = useState(false)
  const [showVsActual, setShowVsActual] = useState(false)

  useEffect(() => { if (id) fetchById(id) }, [id])

  const handleLoadVsActual = async () => {
    if (!id) return
    setIsLoadingVs(true)
    try {
      const data = await getVsActual(id)
      setVsActual(data)
      setShowVsActual(true)
    } finally {
      setIsLoadingVs(false)
    }
  }

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Orçamento não encontrado.</p>

  const b = selected as Budget

  const columns: Column<BudgetItem>[] = [
    { key: 'category',       header: 'Categoria', render: i => <span className="font-medium">{i.category}</span> },
    { key: 'costCenterName', header: 'C. Custo',  render: i => i.costCenterName },
    { key: 'plannedAmount',  header: 'Planejado', render: i => formatCurrency(i.plannedAmount) },
    { key: 'realizedAmount', header: 'Realizado', render: i => formatCurrency(i.realizedAmount) },
    { key: 'variance',       header: 'Variação',  render: i => (
      <span className={i.variance >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
        {formatCurrency(i.variance)}
      </span>
    )},
  ]

  const vsColumns: Column<BudgetVsActualItem>[] = [
    { key: 'category',       header: 'Categoria',    render: i => <span className="font-medium">{i.category}</span> },
    { key: 'costCenterName', header: 'C. Custo',     render: i => i.costCenterName ?? '—' },
    { key: 'plannedAmount',  header: 'Planejado',    render: i => formatCurrency(i.plannedAmount) },
    { key: 'actualPaid',     header: 'Pago (AP)',    render: i => <span className="text-red-600">{formatCurrency(i.actualPaid)}</span> },
    { key: 'actualReceived', header: 'Recebido (AR)',render: i => <span className="text-green-600">{formatCurrency(i.actualReceived)}</span> },
    { key: 'variance',       header: 'Variação',     render: i => (
      <span className={i.variance >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>
        {formatCurrency(i.variance)}
      </span>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={b.name}
        subtitle={`Ano fiscal ${b.year}`}
        backTo={ROUTES.BUDGETS}
        actions={
          <Button variant="secondary" size="sm" isLoading={isLoadingVs} onClick={handleLoadVsActual}>
            Ver vs Realizado
          </Button>
        }
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados do Orçamento" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Status</dt><dd><BudgetStatusBadge status={b.status} /></dd></div>
            <div><dt className="text-slate-400">Aprovado em</dt><dd className="font-medium">{b.approvedAt ? formatDate(b.approvedAt) : '—'}</dd></div>
            <div><dt className="text-slate-400">Total Planejado</dt><dd className="font-semibold">{formatCurrency(b.totalPlanned)}</dd></div>
            <div><dt className="text-slate-400">Total Realizado</dt><dd className="font-semibold">{formatCurrency(b.totalRealized)}</dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Variação Total" />
          <CardDivider />
          <p className={`font-display text-3xl font-bold mt-2 ${b.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(b.variance)}
          </p>
          <p className="mt-1 text-xs text-slate-400">{b.variance >= 0 ? 'Dentro do orçamento' : 'Acima do orçamento'}</p>
        </Card>
      </div>

      <Card padding="none">
        <div className="px-5 pt-5 pb-4">
          <CardHeader title="Itens do Orçamento" subtitle={`${b.items?.length ?? 0} itens`} />
        </div>
        <Table columns={columns} data={b.items ?? []} keyExtractor={i => i.id} emptyMessage="Nenhum item cadastrado." />
      </Card>

      {showVsActual && vsActual && (
        <Card padding="none">
          <div className="px-5 pt-5 pb-4 flex items-center justify-between">
            <CardHeader
              title="Orçado vs Realizado"
              subtitle={`Total pago: ${formatCurrency(vsActual.totalActualPaid)} | Total recebido: ${formatCurrency(vsActual.totalActualReceived)}`}
            />
            <Button variant="ghost" size="sm" onClick={() => setShowVsActual(false)}>Ocultar</Button>
          </div>
          <Table columns={vsColumns} data={vsActual.items} keyExtractor={i => i.costCenterId + i.category} emptyMessage="Nenhum dado disponível." />
        </Card>
      )}
    </div>
  )
}