import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { PayrollStatusBadge } from '../../components/features/payroll/PayrollStatusBadge'
import { usePayroll } from '../../hooks/usePayroll'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { processPayrollSchema, type ProcessPayrollFormData } from '../../schemas/payroll.schema'
import { Input } from '../../components/ui/Input/Input'
import { PayrollStatus } from '../../types/enums'
import type { Payroll } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function ProcessForm({ onSubmit, onCancel, isSaving }: { onSubmit: (d: ProcessPayrollFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(processPayrollSchema), defaultValues: { month: new Date().getMonth() + 1, year: new Date().getFullYear() } })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Mês (1-12)" type="number" min="1" max="12" required error={errors.month?.message} {...register('month')} />
        <Input label="Ano" type="number" required error={errors.year?.message} {...register('year')} />
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>Processar folha</Button>
      </div>
    </form>
  )
}

export default function PayrollPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll, process, cancel } = usePayroll()
  const [processOpen, setProcessOpen]   = useState(false)
  const [cancelTarget, setCancelTarget] = useState<Payroll | null>(null)

  const pagedData: PagedResult<Payroll> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetchAll() }, [page])

  const columns: Column<Payroll>[] = [
    { key: 'month',         header: 'Competência',   render: r => `${MONTHS[r.month - 1]} / ${r.year}` },
    { key: 'totalGross',    header: 'Bruto',         render: r => formatCurrency(r.totalGross) },
    { key: 'totalDiscounts',header: 'Descontos',     render: r => formatCurrency(r.totalDiscounts) },
    { key: 'totalNet',      header: 'Líquido',       render: r => <span className="font-semibold">{formatCurrency(r.totalNet)}</span> },
    { key: 'processedAt',   header: 'Processado em', render: r => r.processedAt ? formatDateTime(r.processedAt) : '-' },
    { key: 'status',        header: 'Status',        render: r => <PayrollStatusBadge status={r.status} /> },
    { key: 'actions',       header: '', render: r => r.status !== PayrollStatus.Cancelled
        ? <Button size="sm" variant="ghost" onClick={() => setCancelTarget(r)} className="text-red-500 hover:bg-red-50">Cancelar</Button>
        : null
    },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Folha de Pagamento" subtitle={`${totalCount} folha${totalCount !== 1 ? 's' : ''}`}
        actions={<Button onClick={() => setProcessOpen(true)}>+ Processar folha</Button>} />
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhuma folha processada." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
      <Modal isOpen={processOpen} onClose={() => setProcessOpen(false)} title="Processar folha de pagamento" size="sm">
        <ProcessForm isSaving={isSaving} onCancel={() => setProcessOpen(false)}
          onSubmit={async d => { try { await process(d); success('Folha processada!'); setProcessOpen(false); fetchAll() } catch { notifyError('Erro ao processar folha.') } }} />
      </Modal>
      <ConfirmModal isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)}
        onConfirm={async () => { try { await cancel(cancelTarget!.id); success('Folha cancelada.'); setCancelTarget(null) } catch { notifyError('Erro.') } }}
        title="Cancelar folha"
        message={`Cancelar a folha de ${cancelTarget ? MONTHS[cancelTarget.month - 1] + '/' + cancelTarget.year : ''}?`}
        confirmLabel="Cancelar folha" isLoading={isSaving} />
    </div>
  )
}