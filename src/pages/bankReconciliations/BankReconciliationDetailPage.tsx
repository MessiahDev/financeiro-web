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
import type { BankReconciliation, BankReconciliationItem } from '../../types/domain.types'

const statusMap: Record<string, { label: string; variant: BadgeVariant }> = {
  InProgress: { label: 'Em andamento', variant: 'info'    },
  Completed:  { label: 'Concluida',    variant: 'success' },
  Cancelled:  { label: 'Cancelada',    variant: 'default' },
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
    { key: 'bankStatementEntryId', header: 'ID Extrato',    render: i => <span className="font-mono text-xs">{i.bankStatementEntryId}</span> },
    { key: 'transactionId',        header: 'ID Transacao',  render: i => i.transactionId ? <span className="font-mono text-xs">{i.transactionId}</span> : '-' },
    { key: 'isMatched',            header: 'Conciliado',    render: i => <Badge variant={i.isMatched ? 'success' : 'warning'}>{i.isMatched ? 'Sim' : 'Nao'}</Badge> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Detalhe da Conciliacao" subtitle={r.bankAccountName} backTo={ROUTES.BANK_RECONCILIATIONS} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Informacoes" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Conta</dt><dd className="font-medium">{r.bankAccountName}</dd></div>
            <div><dt className="text-slate-400">Data do Extrato</dt><dd>{formatDate(r.statementDate)}</dd></div>
            <div><dt className="text-slate-400">Saldo Inicial</dt><dd>{formatCurrency(r.openingBalance)}</dd></div>
            <div><dt className="text-slate-400">Saldo Final</dt><dd>{formatCurrency(r.closingBalance)}</dd></div>
            <div><dt className="text-slate-400">Status</dt><dd><Badge variant={s.variant} dot>{s.label}</Badge></dd></div>
            <div><dt className="text-slate-400">Itens</dt><dd>{r.items?.length ?? 0} itens</dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Variacao" />
          <CardDivider />
          <p className={`font-display text-2xl font-bold mt-2 ${(r.closingBalance - r.openingBalance) >= 0 ? 'text-green-600' : 'text-red-600'}`}>
            {formatCurrency(r.closingBalance - r.openingBalance)}
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