import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { BudgetStatusBadge } from '../../components/features/budgets/BudgetStatusBadge'
import { useCrud } from '../../hooks/useCrud'
import { budgetsService } from '../../services/budgets.service'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { budgetSchema, type BudgetFormData } from '../../schemas/budget.schema'
import { Input } from '../../components/ui/Input/Input'
import { DatePicker } from '../../components/ui/DatePicker/DatePicker'
import type { Budget } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

function BudgetForm({ onSubmit, onCancel, isSaving }: { onSubmit: (d: BudgetFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<BudgetFormData>({ resolver: zodResolver(budgetSchema) })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input label="Nome" required error={errors.name?.message} {...register('name')} />
      <Input label="Ano fiscal" type="number" required error={errors.fiscalYear?.message} {...register('fiscalYear')} />
      <div className="grid grid-cols-2 gap-4">
        <DatePicker label="Inicio" required error={errors.startDate?.message} {...register('startDate')} />
        <DatePicker label="Fim" required error={errors.endDate?.message} {...register('endDate')} />
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>Criar orcamento</Button>
      </div>
    </form>
  )
}

export default function BudgetsPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll, create } = useCrud<Budget, BudgetFormData, Partial<BudgetFormData>>(budgetsService as never)
  const [newOpen, setNewOpen] = useState(false)
  const [approveTarget, setApproveTarget] = useState<Budget | null>(null)

  const pagedData: PagedResult<Budget> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetchAll() }, [page])

  const columns: Column<Budget>[] = [
    { key: 'name',         header: 'Nome',       render: r => <span className="font-medium">{r.name}</span> },
    { key: 'fiscalYear',   header: 'Ano Fiscal' },
    { key: 'startDate',    header: 'Inicio',     render: r => formatDate(r.startDate) },
    { key: 'endDate',      header: 'Fim',        render: r => formatDate(r.endDate) },
    { key: 'totalPlanned', header: 'Planejado',  render: r => formatCurrency(r.totalPlanned) },
    { key: 'totalActual',  header: 'Realizado',  render: r => formatCurrency(r.totalActual) },
    { key: 'variance',     header: 'Variacao',   render: r => <span className={r.variance >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(r.variance)}</span> },
    { key: 'status',       header: 'Status',     render: r => <BudgetStatusBadge status={r.status} /> },
    { key: 'actions',      header: '', render: r => r.status === 'Draft' ? <Button size="sm" variant="ghost" onClick={() => setApproveTarget(r)}>Aprovar</Button> : null },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Orcamentos" subtitle={`${totalCount} orcamento${totalCount !== 1 ? 's' : ''}`}
        actions={<Button onClick={() => setNewOpen(true)}>+ Novo orcamento</Button>} />
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhum orcamento cadastrado." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Novo orcamento" size="md">
        <BudgetForm isSaving={isSaving} onCancel={() => setNewOpen(false)} onSubmit={async d => { try { await create(d); success('Orcamento criado!'); setNewOpen(false); fetchAll() } catch { notifyError('Erro.') } }} />
      </Modal>
      <ConfirmModal isOpen={!!approveTarget} onClose={() => setApproveTarget(null)}
        onConfirm={async () => { try { await budgetsService.approve(approveTarget!.id); success('Orcamento aprovado!'); setApproveTarget(null); fetchAll() } catch { notifyError('Erro.') } }}
        title="Aprovar orcamento" message={`Aprovar "${approveTarget?.name}"? Esta acao nao pode ser desfeita.`} confirmLabel="Aprovar" variant="primary" isLoading={isSaving} />
    </div>
  )
}
