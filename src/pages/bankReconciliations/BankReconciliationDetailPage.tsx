import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Badge, type BadgeVariant } from '../../components/ui/Badge/Badge'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useCrud } from '../../hooks/useCrud'
import { bankReconciliationsService } from '../../services/bankReconciliations.service'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'
import { BankReconciliationStatus, ReconciliationItemStatus, BankStatementEntryType } from '../../types/enums'
import type { BankReconciliation, BankReconciliationItem } from '../../types/domain.types'

const statusMap: Record<BankReconciliationStatus, { label: string; variant: BadgeVariant }> = {
  [BankReconciliationStatus.Open]:       { label: 'Aberta',        variant: 'info'    },
  [BankReconciliationStatus.InProgress]: { label: 'Em andamento',  variant: 'warning' },
  [BankReconciliationStatus.Completed]:  { label: 'Concluída',     variant: 'success' },
  [BankReconciliationStatus.Cancelled]:  { label: 'Cancelada',     variant: 'default' },
}

export default function BankReconciliationDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useCrud<BankReconciliation, unknown, unknown>(bankReconciliationsService as never)

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Conciliacao nao encontrada.</p>

  const r = selected
  const s = statusMap[r.status] ?? { label: r.status, variant: 'default' as BadgeVariant }

  const columns: Column<BankReconciliationItem>[] = [
    { key: 'entryDescription', header: 'Descrição',     render: i => i.entryDescription },
    { key: 'entryDate',        header: 'Data',          render: i => formatDate(i.entryDate) },
    { key: 'amount',           header: 'Valor',         render: i => formatCurrency(i.amount) },
    { key: 'entryType',        header: 'Tipo',          render: i => i.entryType === BankStatementEntryType.Credit ? 'Crédito' : 'Débito' },
    { key: 'transactionId',    header: 'ID Transação',  render: i => i.transactionId ? <span className="font-mono text-xs">{i.transactionId}</span> : '-' },
    { key: 'status',           header: 'Status',        render: i => <Badge variant={i.status === ReconciliationItemStatus.Matched ? 'success' : 'warning'}>{i.status === ReconciliationItemStatus.Matched ? 'Conciliado' : 'Pendente'}</Badge> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Detalhe da Conciliacao" subtitle={r.bankAccountName} backTo={ROUTES.BANK_RECONCILIATIONS} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Informacoes" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Período</dt><dd>{formatDate(r.periodStart)} – {formatDate(r.periodEnd)}</dd></div>
            <div><dt className="text-slate-400">Saldo Inicial</dt><dd>{formatCurrency(r.statementOpeningBalance)}</dd></div>
            <div><dt className="text-slate-400">Saldo Final</dt><dd>{formatCurrency(r.statementClosingBalance)}</dd></div>
            <div><dt className="text-slate-400">Diferença</dt><dd>{formatCurrency(r.difference)}</dd></div>
            <div><dt className="text-slate-400">Status</dt><dd><Badge variant={s.variant} dot>{s.label}</Badge></dd></div>
            <div><dt className="text-slate-400">Itens</dt><dd>{r.totalItems} ({r.matchedItems} conciliados)</dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Variacao" />
          <CardDivider />
          <p className={`... ${r.difference === 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(r.difference)}
          </p>
        </Card>
      </div>
      <Card padding="none">
        <div className="px-5 pt-5 pb-4">
          <CardHeader title="Itens da Conciliacao" subtitle={`${r.items?.length ?? 0} registros`} />
        </div>
        <Table columns={columns} data={r.items ?? []} keyExtractor={i => i.id} emptyMessage="Nenhum item adicionado." />
      </Card>
    </div>
  )
}