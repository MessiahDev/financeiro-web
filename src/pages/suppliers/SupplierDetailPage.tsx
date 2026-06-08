import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { PersonStatusBadge } from '../../components/features/customers/CustomerStatusBadge'
import { useSuppliers } from '../../hooks/useSuppliers'
import { formatDocument, formatPhone, formatDate } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useSuppliers()

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Fornecedor nao encontrado.</p>

  const s = selected
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={s.name} subtitle={formatDocument(s.document)} backTo={ROUTES.SUPPLIERS} />
      <Card>
        <CardHeader title="Dados do Fornecedor" />
        <CardDivider />
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-slate-400">Nome</dt><dd className="font-medium">{s.name}</dd></div>
          <div><dt className="text-slate-400">Documento</dt><dd>{formatDocument(s.document)}</dd></div>
          <div><dt className="text-slate-400">E-mail</dt><dd>{s.email}</dd></div>
          <div><dt className="text-slate-400">Telefone</dt><dd>{s.phone ? formatPhone(s.phone) : '-'}</dd></div>
          <div><dt className="text-slate-400">Tipo</dt><dd>{s.personType === 'Individual' ? 'Pessoa Fisica' : 'Pessoa Juridica'}</dd></div>
          <div><dt className="text-slate-400">Status</dt><dd><PersonStatusBadge status={s.status} /></dd></div>
          <div><dt className="text-slate-400">Prazo de Pagamento</dt><dd>{s.paymentTermDays ? `${s.paymentTermDays} dias` : '-'}</dd></div>
          <div><dt className="text-slate-400">Cadastrado em</dt><dd>{formatDate(s.createdAt)}</dd></div>
        </dl>
        {s.notes && <>
          <CardDivider />
          <div><p className="text-xs text-slate-400 mb-1">Observacoes</p><p className="text-sm text-slate-700">{s.notes}</p></div>
        </>}
      </Card>
    </div>
  )
}