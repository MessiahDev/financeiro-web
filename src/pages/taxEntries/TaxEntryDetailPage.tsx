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
import { TaxType, TaxPaymentStatus } from '../../types/enums'
import { ROUTES } from '../../router/routes'
import type { TaxPayment } from '../../types/domain.types'

const taxTypeLabel: Record<TaxType, string> = {
  [TaxType.ICMS]:   'ICMS',
  [TaxType.ISS]:    'ISS',
  [TaxType.PIS]:    'PIS',
  [TaxType.COFINS]: 'COFINS',
  [TaxType.CSLL]:   'CSLL',
  [TaxType.IRPJ]:   'IRPJ',
  [TaxType.IPI]:    'IPI',
  [TaxType.IOF]:    'IOF',
  [TaxType.INSS]:   'INSS',
  [TaxType.FGTS]:   'FGTS',
  [TaxType.Other]:  'Outro',
}

const paymentStatusLabel: Record<TaxPaymentStatus, string> = {
  [TaxPaymentStatus.Pending]:   'Pendente',
  [TaxPaymentStatus.Paid]:      'Pago',
  [TaxPaymentStatus.Overdue]:   'Vencido',
  [TaxPaymentStatus.Cancelled]: 'Cancelado',
}

export default function TaxEntryDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById, payments } = useTaxEntries()

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Obrigação não encontrada.</p>

  const t = selected

  const columns: Column<TaxPayment>[] = [
    { key: 'paymentDate',    header: 'Data',    render: p => formatDate(p.paymentDate) },
    { key: 'amount',         header: 'Valor',   render: p => formatCurrency(p.amount) },
    { key: 'bankAccountName',header: 'Conta',   render: p => p.bankAccountName },
    { key: 'receiptCode',    header: 'Recibo',  render: p => p.receiptCode ?? '-' },
    { key: 'status',         header: 'Status',  render: p => (
      <Badge variant={p.status === TaxPaymentStatus.Paid ? 'success' : p.status === TaxPaymentStatus.Cancelled ? 'default' : 'warning'} dot>
        {paymentStatusLabel[p.status]}
      </Badge>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={t.description} subtitle={`Tributo: ${taxTypeLabel[t.taxType]}`} backTo={ROUTES.TAX_ENTRIES} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados da Obrigação" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Tipo</dt><dd className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded inline-block">{taxTypeLabel[t.taxType]}</dd></div>
            <div><dt className="text-slate-400">Status</dt><dd><TaxEntryStatusBadge status={t.status} /></dd></div>
            <div><dt className="text-slate-400">Competência</dt><dd>{formatDate(t.competence)}</dd></div>
            <div><dt className="text-slate-400">Vencimento</dt><dd>{formatDate(t.dueDate)}</dd></div>
            <div><dt className="text-slate-400">Base de Cálculo</dt><dd className="font-semibold">{formatCurrency(t.baseAmount)}</dd></div>
            <div><dt className="text-slate-400">Taxa</dt><dd>{t.rate}%</dd></div>
            <div><dt className="text-slate-400">Valor do Tributo</dt><dd className="font-semibold">{formatCurrency(t.taxAmount)}</dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Valor do Tributo" />
          <CardDivider />
          <p className="font-display text-3xl font-bold mt-2 text-red-600">{formatCurrency(t.taxAmount)}</p>
          <p className="mt-1 text-xs text-slate-400">{t.status === 3 ? 'Pago' : 'Pendente'}</p>
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