import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { TaxEntryStatusBadge } from '../../components/features/taxEntries/TaxEntryStatusBadge'
import { Badge } from '../../components/ui/Badge/Badge'
import { useTaxEntries } from '../../hooks/useTaxEntries'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'
import type { TaxPayment } from '../../types/domain.types'
import { TaxPaymentStatus } from '../../types/enums'

export default function TaxEntryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById, payments, fetchPayments } = useTaxEntries()

  useEffect(() => {
    if (id) { fetchById(id); fetchPayments(id) }
  }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Obrigacao nao encontrada.</p>

  const t = selected
  const remaining = t.amount - t.paidAmount

  const columns: Column<TaxPayment>[] = [
    { key: 'paymentDate',    header: 'Data',         render: p => formatDate(p.paymentDate) },
    { key: 'amount',         header: 'Valor',        render: p => formatCurrency(p.amount) },
    { key: 'bankAccountName',header: 'Conta',        render: p => p.bankAccountName },
    { key: 'receiptNumber',  header: 'Recibo',       render: p => p.receiptNumber ?? '-' },
    { key: 'status',         header: 'Status',       render: p => <Badge variant={p.status === TaxPaymentStatus.Confirmed ? 'success' : p.status === TaxPaymentStatus.Cancelled ? 'default' : 'warning'} dot>{p.status}</Badge> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.description} subtitle={`Tributo: ${t.taxType}`} backTo={ROUTES.TAX_ENTRIES} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados da Obrigacao" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Tipo</dt><dd className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded inline-block">{t.taxType}</dd></div>
            <div><dt className="text-slate-400">Status</dt><dd><TaxEntryStatusBadge status={t.status} /></dd></div>
            <div><dt className="text-slate-400">Competencia</dt><dd>{formatDate(t.competenceDate)}</dd></div>
            <div><dt className="text-slate-400">Vencimento</dt><dd>{formatDate(t.dueDate)}</dd></div>
            <div><dt className="text-slate-400">Valor Total</dt><dd className="font-semibold">{formatCurrency(t.amount)}</dd></div>
            <div><dt className="text-slate-400">Valor Pago</dt><dd className="text-green-600 font-semibold">{formatCurrency(t.paidAmount)}</dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Saldo Restante" />
          <CardDivider />
          <p className={`font-display text-3xl font-bold mt-2 ${remaining > 0 ? 'text-red-600' : 'text-green-600'}`}>{formatCurrency(remaining)}</p>
          <p className="mt-1 text-xs text-slate-400">{remaining <= 0 ? 'Quitado' : 'Pendente'}</p>
        </Card>
      </div>
      <Card padding="none">
        <div className="px-5 pt-5 pb-4">
          <CardHeader title="Pagamentos" subtitle={`${payments.length} registro${payments.length !== 1 ? 's' : ''}`} />
        </div>
        <Table columns={columns} data={payments} keyExtractor={p => p.id} emptyMessage="Nenhum pagamento registrado." />
      </Card>
    </div>
  )
}