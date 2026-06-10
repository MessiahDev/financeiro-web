import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { AccountingPeriodStatusBadge } from '../../components/features/accountingPeriods/PeriodStatusBadge'
import { useAccountingPeriods } from '../../hooks/useAccountingPeriods'
import { AccountingPeriodStatus } from '../../types/enums'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatDate } from '../../utils/formatters'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { accountingPeriodSchema, type AccountingPeriodFormData } from '../../schemas/accountingPeriod.schema'
import { Input } from '../../components/ui/Input/Input'
import { DatePicker } from '../../components/ui/DatePicker/DatePicker'
import type { AccountingPeriod } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

function PeriodForm({ onSubmit, onCancel, isSaving }: { onSubmit: (d: AccountingPeriodFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(accountingPeriodSchema) })
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
        <Button type="submit" isLoading={isSaving}>Criar periodo</Button>
      </div>
    </form>
  )
}

export default function AccountingPeriodsPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll, create, close, lock, reopen } = useAccountingPeriods()
  const [newOpen, setNewOpen] = useState(false)
  const [actionOpen, setActionOpen] = useState<{ type: 'close'|'lock'|'reopen'; item: AccountingPeriod } | null>(null)

  const pagedData: PagedResult<AccountingPeriod> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetchAll() }, [page])

  const actionLabels = { close: 'Fechar', lock: 'Bloquear', reopen: 'Reabrir' }

  const columns: Column<AccountingPeriod>[] = [
    { key: 'name',       header: 'Nome',       render: r => <span className="font-medium">{r.name}</span> },
    { key: 'fiscalYear', header: 'Ano Fiscal' },
    { key: 'startDate',  header: 'Inicio',     render: r => formatDate(r.periodStart) },
    { key: 'endDate',    header: 'Fim',        render: r => formatDate(r.periodEnd) },
    { key: 'status',     header: 'Status',     render: r => <AccountingPeriodStatusBadge status={r.status} /> },
    { key: 'actions',    header: '', render: r => (
      <div className="flex items-center justify-end gap-1">
        {r.status === AccountingPeriodStatus.Open   && <Button size="sm" variant="ghost" onClick={() => setActionOpen({ type: 'close',  item: r })}>Fechar</Button>}
        {r.status === AccountingPeriodStatus.Closed && <Button size="sm" variant="ghost" onClick={() => setActionOpen({ type: 'lock',   item: r })}>Bloquear</Button>}
        {r.status === AccountingPeriodStatus.Closed && <Button size="sm" variant="ghost" onClick={() => setActionOpen({ type: 'reopen', item: r })}>Reabrir</Button>}
      </div>
    )},
  ]

  async function handleAction() {
    if (!actionOpen) return
    try {
      if (actionOpen.type === 'close')  await close(actionOpen.item.id)
      if (actionOpen.type === 'lock')   await lock(actionOpen.item.id)
      if (actionOpen.type === 'reopen') await reopen(actionOpen.item.id)
      success('Operacao realizada!')
      setActionOpen(null)
    } catch { notifyError('Erro ao executar operacao.') }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Periodos Contabeis" subtitle={`${totalCount} periodo${totalCount !== 1 ? 's' : ''}`}
        actions={<Button onClick={() => setNewOpen(true)}>+ Novo periodo</Button>} />
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhum periodo cadastrado." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Novo periodo contabil" size="md">
        <PeriodForm isSaving={isSaving} onCancel={() => setNewOpen(false)} onSubmit={async d => { try { await create(d); success('Periodo criado!'); setNewOpen(false); fetchAll() } catch { notifyError('Erro ao criar.') } }} />
      </Modal>
      <ConfirmModal isOpen={!!actionOpen} onClose={() => setActionOpen(null)} onConfirm={handleAction}
        title={`${actionOpen ? actionLabels[actionOpen.type] : ''} periodo`}
        message={`Deseja ${actionOpen ? actionLabels[actionOpen.type].toLowerCase() : ''} o periodo "${actionOpen?.item.name}"?`}
        confirmLabel={actionOpen ? actionLabels[actionOpen.type] : ''} variant="primary" isLoading={isSaving} />
    </div>
  )
}
