import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Badge } from '../../components/ui/Badge/Badge'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useEmployees } from '../../hooks/useEmployees'
import { formatCurrency, formatCPF, formatDate } from '../../utils/formatters'
import { EmployeeStatus } from '../../types/enums'
import { ROUTES } from '../../router/routes'

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  [EmployeeStatus.Active]:     { label: 'Ativo',     variant: 'success' },
  [EmployeeStatus.Inactive]:   { label: 'Inativo',   variant: 'default' },
  [EmployeeStatus.Terminated]: { label: 'Desligado', variant: 'warning' },
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useEmployees()

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Funcionario nao encontrado.</p>

  const e = selected
  const s = statusMap[e.status] ?? { label: e.status, variant: 'default' as const }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={e.name} subtitle={`${e.position} · ${e.departmentName}`} backTo={ROUTES.EMPLOYEES} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados Pessoais" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Nome</dt><dd className="font-medium">{e.name}</dd></div>
            <div><dt className="text-slate-400">CPF</dt><dd>{formatCPF(e.cpf)}</dd></div>
            <div><dt className="text-slate-400">E-mail</dt><dd>{e.email}</dd></div>
            <div><dt className="text-slate-400">Cargo</dt><dd>{e.position}</dd></div>
            <div><dt className="text-slate-400">Departamento</dt><dd>{e.departmentName}</dd></div>
            <div><dt className="text-slate-400">Status</dt><dd><Badge variant={s.variant} dot>{s.label}</Badge></dd></div>
            <div><dt className="text-slate-400">Admissao</dt><dd>{formatDate(e.hireDate)}</dd></div>
            {e.terminationDate && <div><dt className="text-slate-400">Desligamento</dt><dd>{formatDate(e.terminationDate)}</dd></div>}
          </dl>
        </Card>
        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader title="Salario Atual" />
            <CardDivider />
            <p className="font-display text-2xl font-bold mt-2 text-slate-900">{formatCurrency(e.salary)}</p>
          </Card>
          {(e.bankName || e.bankAgency || e.bankAccountNumber) && (
            <Card>
              <CardHeader title="Dados Bancarios" />
              <CardDivider />
              <dl className="flex flex-col gap-2 text-sm">
                {e.bankName          && <div><dt className="text-slate-400">Banco</dt><dd>{e.bankName}</dd></div>}
                {e.bankAgency        && <div><dt className="text-slate-400">Agencia</dt><dd>{e.bankAgency}</dd></div>}
                {e.bankAccountNumber && <div><dt className="text-slate-400">Conta</dt><dd>{e.bankAccountNumber}</dd></div>}
              </dl>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}