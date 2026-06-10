import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { PersonStatusBadge } from '../../components/features/customers/CustomerStatusBadge'
import { useCustomers } from '../../hooks/useCustomers'
import { formatCurrency, formatDocument, formatPhone, formatDate } from '../../utils/formatters'
import { PersonType } from '../../types/enums'
import { ROUTES } from '../../router/routes'

export default function CustomerDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useCustomers()

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Cliente nao encontrado.</p>

  const c = selected
  return (
  <div className="flex flex-col gap-6">
    <PageHeader title={c.name} subtitle={formatDocument(c.taxId)} backTo={ROUTES.CUSTOMERS} />
    <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
      <Card className="lg:col-span-2">
        <CardHeader title="Dados do Cliente" />
        <CardDivider />
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-slate-400">Nome</dt><dd className="font-medium">{c.name}</dd></div>
          <div><dt className="text-slate-400">Documento</dt><dd>{formatDocument(c.taxId)}</dd></div>
          <div><dt className="text-slate-400">E-mail</dt><dd>{c.email}</dd></div>
          <div><dt className="text-slate-400">Telefone</dt><dd>{c.phone ? formatPhone(c.phone) : '-'}</dd></div>
          <div><dt className="text-slate-400">Tipo</dt><dd>{c.personType === PersonType.Individual ? 'Pessoa Fisica' : 'Pessoa Juridica'}</dd></div>
          <div><dt className="text-slate-400">Status</dt><dd><PersonStatusBadge status={c.status} /></dd></div>
          <div><dt className="text-slate-400">Cadastrado em</dt><dd>{formatDate(c.createdAt)}</dd></div>
          <div><dt className="text-slate-400">Limite de Credito</dt><dd className="font-semibold text-blue-600">{formatCurrency(c.creditLimit)}</dd></div>
        </dl>
      </Card>
      <Card>
        <CardHeader title="Limite de Credito" />
        <CardDivider />
        <p className="font-display text-2xl font-bold mt-2 text-blue-600">{formatCurrency(c.creditLimit)}</p>
      </Card>
    </div>
  </div>
)
}