import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { BudgetStatusBadge } from '../../components/features/budgets/BudgetStatusBadge'
import { useCrud } from '../../hooks/useCrud'
import { budgetsService } from '../../services/budgets.service'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'
import type { Budget, BudgetItem } from '../../types/domain.types'

export default function BudgetDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useCrud<Budget, unknown, unknown>(budgetsService as never)

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Orcamento nao encontrado.</p>

  const b = selected
  const columns: Column<BudgetItem>[] = [
    { key: 'category',       header: 'Categoria',  render: i => <span className="font-medium">{i.category}</span> },
    { key: 'costCenterName', header: 'C. Custo',   render: i => i.costCenterName },
    { key: 'plannedAmount',  header: 'Planejado',  render: i => formatCurrency(i.plannedAmount) },
    { key: 'realizedAmount', header: 'Realizado',  render: i => formatCurrency(i.realizedAmount) },
    { key: 'variance',       header: 'Variação',   render: i => <span className={i.variance >= 0 ? 'text-green-600 font-medium' : 'text-red-600 font-medium'}>{formatCurrency(i.variance)}</span> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={b.name} subtitle={`Ano fiscal ${b.year}`} backTo={ROUTES.BUDGETS} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados do Orcamento" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Status</dt><dd><BudgetStatusBadge status={b.status} /></dd></div>
            <div><dt className="text-slate-400">Aprovado em</dt><dd className="font-medium">{b.approvedAt ? formatDate(b.approvedAt) : '—'}</dd></div>
            <div><dt className="text-slate-400">Total Planejado</dt><dd className="font-semibold">{formatCurrency(b.totalPlanned)}</dd></div>
            <div><dt className="text-slate-400">Total Realizado</dt><dd className="font-semibold">{formatCurrency(b.totalRealized)}</dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Variacao Total" />
          <CardDivider />
          <p className={`font-display text-3xl font-bold mt-2 ${b.variance >= 0 ? 'text-green-600' : 'text-red-600'}`}>{formatCurrency(b.variance)}</p>
          <p className="mt-1 text-xs text-slate-400">{b.variance >= 0 ? 'Dentro do orcamento' : 'Acima do orcamento'}</p>
        </Card>
      </div>
      <Card padding="none">
        <div className="px-5 pt-5 pb-4">
          <CardHeader title="Itens do Orcamento" subtitle={`${b.items?.length ?? 0} itens`} />
        </div>
        <Table columns={columns} data={b.items ?? []} keyExtractor={i => i.id} emptyMessage="Nenhum item cadastrado." />
      </Card>
    </div>
  )
}