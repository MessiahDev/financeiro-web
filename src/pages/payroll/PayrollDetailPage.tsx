import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Card, CardHeader } from '../../components/ui/Card/Card'
import { Table, type Column } from '../../components/ui/Table/Table'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { PayrollStatusBadge } from '../../components/features/payroll/PayrollStatusBadge'
import { usePayroll } from '../../hooks/usePayroll'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import { ROUTES } from '../../router/routes'
import type { PayrollDetail, PayrollItem } from '../../types/domain.types'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

export default function PayrollDetailPage() {
  const { id } = useParams<{ id: string }>()
  const { fetchById } = usePayroll()
  const [isLoading, setIsLoading] = useState(false)
  const [selected, setSelected]   = useState<PayrollDetail | null>(null)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    fetchById(id)
      .then(setSelected)
      .catch(() => setSelected(null))
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return <div className="flex justify-center py-20"><Spinner size="lg" className="text-blue-500" /></div>
  if (!selected) return <p className="text-sm text-slate-400 p-6">Folha não encontrada.</p>

  const p = selected
  const columns: Column<PayrollItem>[] = [
    { key: 'employeeName',  header: 'Funcionário',   render: i => <span className="font-medium">{i.employeeName}</span> },
    { key: 'grossSalary',   header: 'Salário Bruto', render: i => formatCurrency(i.grossSalary) },
    { key: 'inssDiscount',  header: 'INSS',          render: i => formatCurrency(i.inssDiscount) },
    { key: 'irpfDiscount',  header: 'IRRF',          render: i => formatCurrency(i.irpfDiscount) },
    { key: 'otherDiscounts',header: 'Outros',        render: i => formatCurrency(i.otherDiscounts) },
    { key: 'netSalary',     header: 'Salário Líq.',  render: i => <span className="font-semibold text-green-600">{formatCurrency(i.netSalary)}</span> },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title={`Folha — ${MONTHS[p.month - 1]}/${p.year}`}
        subtitle={p.processedAt ? `Processada em ${formatDateTime(p.processedAt)}` : 'Não processada'}
        backTo={ROUTES.PAYROLL}
      />
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {[
          { label: 'Total Bruto',   value: p.totalGross,     color: 'text-slate-900' },
          { label: 'INSS + IRRF',   value: p.totalDiscounts, color: 'text-red-600'   },
          { label: 'Total Líquido', value: p.totalNet,       color: 'text-green-600' },
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
          <CardHeader title="Funcionários" subtitle={`${p.items?.length ?? 0} registros`} />
        </div>
        <Table columns={columns} data={p.items ?? []} keyExtractor={i => i.id} emptyMessage="Nenhum funcionário na folha." />
      </Card>
    </div>
  )
}