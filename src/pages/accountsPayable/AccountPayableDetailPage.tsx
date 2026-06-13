import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { AccountPayableStatusBadge } from '../../components/features/accountsPayable/PayableStatusBadge'
import { useCrud } from '../../hooks/useCrud'
import { accountsPayableService } from '../../services/accountsPayable.service'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'
import type { AccountPayable } from '../../types/domain.types'

export default function AccountPayableDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } =
    useCrud<AccountPayable, unknown, unknown>(accountsPayableService as never)

  useEffect(() => {
    if (id) fetchById(id)
  }, [id, fetchById])

  if (isLoading)
    return (
      <div className="flex justify-center py-20">
        <Spinner size="lg" className="text-blue-500" />
      </div>
    )

  if (!selected)
    return <p className="text-sm text-slate-400 p-6">Conta não encontrada.</p>

  const a = selected
  const remaining = a.totalAmount - a.paidAmount

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={a.description}
        subtitle={`Fornecedor: ${a.supplierName}`}
        backTo={ROUTES.ACCOUNTS_PAYABLE}
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados da Conta" />
          <CardDivider />

          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <dt className="text-slate-400">Fornecedor</dt>
              <dd className="font-medium">{a.supplierName}</dd>
            </div>

            <div>
              <dt className="text-slate-400">Status</dt>
              <dd>
                <AccountPayableStatusBadge status={a.status} />
              </dd>
            </div>

            <div>
              <dt className="text-slate-400">Vencimento</dt>
              <dd>{formatDate(a.dueDate)}</dd>
            </div>

            <div>
              <dt className="text-slate-400">Data de Pagamento</dt>
              <dd>{a.paymentDate ? formatDate(a.paymentDate) : '-'}</dd>
            </div>

            <div>
              <dt className="text-slate-400">Valor Total</dt>
              <dd className="font-semibold">
                {formatCurrency(a.totalAmount)}
              </dd>
            </div>

            <div>
              <dt className="text-slate-400">Valor Pago</dt>
              <dd className="text-green-600 font-semibold">
                {formatCurrency(a.paidAmount)}
              </dd>
            </div>
          </dl>
        </Card>

        <Card>
          <CardHeader title="Saldo Restante" />
          <CardDivider />

          <p
            className={`font-display text-3xl font-bold mt-2 ${
              remaining > 0 ? 'text-red-600' : 'text-green-600'
            }`}
          >
            {formatCurrency(remaining)}
          </p>

          <p className="mt-1 text-xs text-slate-400">
            {remaining <= 0 ? 'Quitado' : 'Pendente'}
          </p>
        </Card>
      </div>
    </div>
  )
}