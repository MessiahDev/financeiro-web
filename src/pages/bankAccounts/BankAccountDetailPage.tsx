import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Badge } from '../../components/ui/Badge/Badge'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useBankAccounts } from '../../hooks/useBankAccounts'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'

const typeLabel: Record<string, string> = {
  Checking: 'Conta Corrente', Savings: 'Poupanca', Investment: 'Investimento',
}

export default function BankAccountDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useBankAccounts()

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Conta nao encontrada.</p>

  const a = selected
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={a.bankName} subtitle={`Ag. ${a.agency} · Cc. ${a.accountNumber}`} backTo={ROUTES.BANK_ACCOUNTS} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados da Conta" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Banco</dt><dd className="font-medium text-slate-900">{a.bankName}</dd></div>
            <div><dt className="text-slate-400">Tipo</dt><dd>{typeLabel[a.accountType] ?? a.accountType}</dd></div>
            <div><dt className="text-slate-400">Agencia</dt><dd>{a.agency}</dd></div>
            <div><dt className="text-slate-400">Conta</dt><dd>{a.accountNumber}</dd></div>
            <div><dt className="text-slate-400">Status</dt><dd><Badge variant={a.isActive ? 'success' : 'default'} dot>{a.isActive ? 'Ativa' : 'Inativa'}</Badge></dd></div>
            <div><dt className="text-slate-400">Cadastrado em</dt><dd>{formatDate(a.createdAt)}</dd></div>
          </dl>
        </Card>
        <Card>
          <CardHeader title="Saldo Atual" />
          <CardDivider />
          <p className={`font-display text-3xl font-bold mt-2 ${a.balance >= 0 ? 'text-slate-900' : 'text-red-600'}`}>{formatCurrency(a.balance)}</p>
        </Card>
      </div>
    </div>
  )
}