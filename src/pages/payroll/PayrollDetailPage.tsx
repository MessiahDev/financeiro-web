import { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card/Card'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { PayrollStatusBadge } from '../../components/features/payroll/PayrollStatusBadge'
import { usePayroll } from '../../hooks/usePayroll'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'
import type { PayrollItem } from '../../types/domain.types'

const MONTHS = ['Janeiro','Fevereiro','Marco','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export default function PayrollDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { selected, isLoading, fetchById } = usePayroll()

  useEffect(() => { if (id) fetchById(id) }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Folha nao encontrada.</p>

  const p = selected
  const columns: Column<PayrollItem>[] = [
    { key: 'employeeName',   header: 'Funcionario', render: i => <span className="font-medium">{i.employeeName}</span> },
    { key: 'grossSalary',    header: 'Salario Bruto',render: i => formatCurrency(i.grossSalary) },
    { key: 'inssDeduction',  header: 'INSS',         render: i => formatCurrency(i.inssDeduction) },
    { key: 'irDeduction',    header: 'IRRF',         render: i => formatCurrency(i.irDeduction) },
    { key: 'otherDeductions',header: 'Outros',       render: i => formatCurrency(i.otherDeductions) },
    { key: 'netSalary',      header: 'Salario Liq.', render: i => <span className="font-semibold text-green-600">{formatCurrency(i.netSalary)}</span> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Folha — ${MONTHS[p.referenceMonth - 1]}/${p.referenceYear}`}
        subtitle={p.processedAt ? `Processada em ${formatDateTime(p.processedAt)}` : 'Nao processada'}
        backTo={ROUTES.PAYROLL}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Bruto',    value: p.totalGross,      color: 'text-slate-900' },
          { label: 'INSS + IRRF',    value: p.totalDeductions, color: 'text-red-600'   },
          { label: 'Total Liquido',  value: p.totalNet,        color: 'text-green-600' },
        ].map(m => (
          <Card key={m.label}>
            <p className="text-xs text-slate-400">{m.label}</p>
            <p className={`font-display text-xl font-bold mt-1 ${m.color}`}>{formatCurrency(m.value)}</p>
          </Card>
        ))}
        <Card>
          <p className="text-xs text-slate-400">Status</p>
          <div className="mt-2"><PayrollStatusBadge status={p.status} /></div>
        </Card>
      </div>
      <Card padding="none">
        <div className="px-5 pt-5 pb-4">
          <CardHeader title="Funcionarios" subtitle={`${p.items?.length ?? 0} registros`} />
        </div>
        <Table columns={columns} data={p.items ?? []} keyExtractor={i => i.id} emptyMessage="Nenhum funcionario na folha." />
      </Card>
    </div>
  )
}