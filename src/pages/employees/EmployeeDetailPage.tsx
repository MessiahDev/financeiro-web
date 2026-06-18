import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader, CardDivider } from '../../components/ui/Card/Card'
import { Badge } from '../../components/ui/Badge/Badge'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { useEmployees } from '../../hooks/useEmployees'
import { formatCurrency, formatCPF, formatDate } from '../../utils/formatters'
import { Position } from '../../types/enums'
import { ROUTES } from '../../router/routes'

const positionMap: Record<number, string> = {
  [Position.Estagiario]:           'Estagiário',
  [Position.DesenvolvedorJunior]:  'Dev Junior',
  [Position.DesenvolvedorPleno]:   'Dev Pleno',
  [Position.DesenvolvedorSenior]:  'Dev Sênior',
  [Position.LiderTecnico]:         'Líder Técnico',
  [Position.Gerente]:              'Gerente',
  [Position.Diretor]:              'Diretor',
  [Position.CEO]:                  'CEO',
  [Position.Analista]:             'Analista',
  [Position.Coordenador]:          'Coordenador',
  [Position.Supervisor]:           'Supervisor',
  [Position.RecursosHumanos]:      'RH',
  [Position.Contador]:             'Contador',
  [Position.Vendedor]:             'Vendedor',
  [Position.AtendimentoAoCliente]: 'Atendimento ao Cliente',
}

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  Active:     { label: 'Ativo',     variant: 'success' },
  Inactive:   { label: 'Inativo',   variant: 'default' },
  Terminated: { label: 'Desligado', variant: 'warning' },
}

export default function EmployeeDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = useEmployees()

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Funcionario nao encontrado.</p>

  const e = selected
  const s = statusMap[e.status] ?? { label: String(e.status), variant: 'default' as const }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title={e.fullName} subtitle={e.departmentName} backTo={ROUTES.EMPLOYEES} />
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <Card className="lg:col-span-2">
          <CardHeader title="Dados Pessoais" />
          <CardDivider />
          <dl className="grid grid-cols-2 gap-4 text-sm">
            <div><dt className="text-slate-400">Nome</dt><dd className="font-medium">{e.fullName}</dd></div>
            <div><dt className="text-slate-400">CPF</dt><dd>{formatCPF(e.cpf)}</dd></div>
            <div><dt className="text-slate-400">E-mail</dt><dd>{e.email}</dd></div>
            <div><dt className="text-slate-400">Cargo</dt><dd>{e.position ? positionMap[e.position] ?? String(e.position) : '—'}</dd></div>
            <div><dt className="text-slate-400">Departamento</dt><dd>{e.departmentName}</dd></div>
            <div><dt className="text-slate-400">Contrato</dt><dd>{e.contractType}</dd></div>
            <div><dt className="text-slate-400">Status</dt><dd><Badge variant={s.variant} dot>{s.label}</Badge></dd></div>
            <div><dt className="text-slate-400">Admissão</dt><dd>{formatDate(e.hireDate)}</dd></div>
            {e.terminationDate && <div><dt className="text-slate-400">Desligamento</dt><dd>{formatDate(e.terminationDate)}</dd></div>}
          </dl>
        </Card>
        <Card>
          <CardHeader title="Salário Atual" />
          <CardDivider />
          <p className="font-display text-2xl font-bold mt-2 text-slate-900">{formatCurrency(e.salary)}</p>
          <p className="text-xs text-slate-400 mt-1">{e.currency}</p>
        </Card>
      </div>
    </div>
  )
}