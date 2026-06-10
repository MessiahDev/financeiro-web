import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { AccountReceivableStatusBadge } from '../../components/features/accountsReceivable/ReceivableStatusBadge'
import { useCrud } from '../../hooks/useCrud'
import { accountsReceivableService } from '../../services/accountsReceivable.service'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'
import type { AccountReceivable } from '../../types/domain.types'

export default function AccountReceivableDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useCrud<AccountReceivable, unknown, unknown>(accountsReceivableService as never)

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Conta nao encontrada.</p>

  const a = selected
  const remaining = a.totalAmount - a.receivedAmount

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={a.description} subtitle={`Cliente: ${a.customerName}`} backTo={ROUTES.ACCOUNTS_RECEIVABLE} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados da Conta" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Cliente</dt><dd className="font-medium">{a.customerName}</dd></div>
            <div><dt className="text-slate-400">Status</dt><dd><AccountReceivableStatusBadge status={a.status} /></dd></div>
            <div><dt className="text-slate-400">Vencimento</dt><dd>{formatDate(a.dueDate)}</dd></div>
            <div><dt className="text-slate-400">Data de Recebimento</dt><dd>{a.receiptDate ? formatDate(a.receiptDate) : '-'}</dd></div>
            <div><dt className="text-slate-400">Valor Total</dt><dd className="font-semibold">{formatCurrency(a.totalAmount)}</dd></div>
            <div><dt className="text-slate-400">Valor Recebido</dt><dd className="text-green-600 font-semibold">{formatCurrency(a.receivedAmount)}</dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Saldo Restante" />
          <CardDivider />
          <p className={`font-display text-3xl font-bold mt-2 ${remaining > 0 ? 'text-amber-600' : 'text-green-600'}`}>{formatCurrency(remaining)}</p>
          <p className="mt-1 text-xs text-slate-400">{remaining <= 0 ? 'Recebido' : 'Pendente'}</p>
        </Card>
      </div>
    </div>
  )
}