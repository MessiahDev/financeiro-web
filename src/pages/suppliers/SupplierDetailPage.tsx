import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { PersonStatusBadge } from '../../components/features/customers/CustomerStatusBadge'
import { useSuppliers } from '../../hooks/useSuppliers'
import { formatDocument, formatPhone, formatDate } from '../../utils/formatters'
import { PersonType } from '../../types/enums'
import { ROUTES } from '../../router/routes'

export default function SupplierDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useSuppliers()

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Fornecedor não encontrado.</p>

  const s = selected
  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={s.name} subtitle={formatDocument(s.taxId)} backTo={ROUTES.SUPPLIERS} />
      <Card>
        <CardHeader title="Dados do Fornecedor" />
        <CardDivider />
        <dl className="grid grid-cols-2 gap-4 text-sm">
          <div><dt className="text-slate-400">Nome</dt><dd className="font-medium">{s.name}</dd></div>
          <div><dt className="text-slate-400">Documento</dt><dd>{formatDocument(s.taxId)}</dd></div>
          <div><dt className="text-slate-400">E-mail</dt><dd>{s.email}</dd></div>
          <div><dt className="text-slate-400">Telefone</dt><dd>{s.phone ? formatPhone(s.phone) : '-'}</dd></div>
          <div><dt className="text-slate-400">Contato</dt><dd>{s.contactName ?? '-'}</dd></div>
          <div><dt className="text-slate-400">Tipo</dt><dd>{s.personType === PersonType.Individual ? 'Pessoa Física' : 'Pessoa Jurídica'}</dd></div>
          <div><dt className="text-slate-400">Status</dt><dd><PersonStatusBadge status={s.status} /></dd></div>
          <div><dt className="text-slate-400">Cadastrado em</dt><dd>{formatDate(s.createdAt)}</dd></div>
        </dl>
        {(s.bankName || s.bankAgency || s.bankAccount || s.pixKey) && <>
          <CardDivider />
          <p className="text-xs text-slate-400 mb-2">Dados Bancários</p>
          <dl className="grid grid-cols-2 gap-4 text-sm">
            {s.bankName    && <div><dt className="text-slate-400">Banco</dt><dd>{s.bankName}</dd></div>}
            {s.bankAgency  && <div><dt className="text-slate-400">Agência</dt><dd>{s.bankAgency}</dd></div>}
            {s.bankAccount && <div><dt className="text-slate-400">Conta</dt><dd>{s.bankAccount}</dd></div>}
            {s.pixKey      && <div><dt className="text-slate-400">PIX</dt><dd>{s.pixKey}</dd></div>}
          </dl>
        </>}
      </Card>
    </div>
  )
}