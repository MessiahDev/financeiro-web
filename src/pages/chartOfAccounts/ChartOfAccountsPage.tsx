import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { Badge } from '../../components/ui/Badge/Badge'
import { useCrud } from '../../hooks/useCrud'
import { chartOfAccountsService } from '../../services/chartOfAccounts.service'
import { useNotifications } from '../../contexts/NotificationContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { chartOfAccountSchema, type ChartOfAccountFormData } from '../../schemas/chartOfAccount.schema'
import { Input } from '../../components/ui/Input/Input'
import { Select } from '../../components/ui/Select/Select'
import type { ChartOfAccount } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

const typeOptions = [
  { value: 'Asset',     label: 'Ativo' },
  { value: 'Liability', label: 'Passivo' },
  { value: 'Equity',    label: 'Patrimonio Liquido' },
  { value: 'Revenue',   label: 'Receita' },
  { value: 'Expense',   label: 'Despesa' },
]
const natureOptions = [{ value: 'Debit', label: 'Devedora' }, { value: 'Credit', label: 'Credora' }]
const typeLabels: Record<string, string> = { Asset: 'Ativo', Liability: 'Passivo', Equity: 'Patrimonio', Revenue: 'Receita', Expense: 'Despesa' }

function AccountForm({ onSubmit, onCancel, isSaving }: { onSubmit: (d: ChartOfAccountFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(chartOfAccountSchema), defaultValues: { isAnalytical: true } })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Codigo" required error={errors.code?.message} {...register('code')} />
        <Input label="Nome" required error={errors.name?.message} {...register('name')} />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <Select label="Tipo" required options={typeOptions} placeholder="Selecione..." error={errors.accountType?.message} {...register('accountType')} />
        <Select label="Natureza" required options={natureOptions} placeholder="Selecione..." error={errors.nature?.message} {...register('nature')} />
      </div>
      <label className="flex items-center gap-2 text-sm text-slate-700 dark:text-slate-300 cursor-pointer">
        <input type="checkbox" {...register('isAnalytical')} className="rounded" />
        Conta analitica (aceita lancamentos)
      </label>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>Cadastrar conta</Button>
      </div>
    </form>
  )
}

export default function ChartOfAccountsPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll, create } = useCrud<ChartOfAccount, ChartOfAccountFormData, Partial<ChartOfAccountFormData>>(chartOfAccountsService as never)
  const [newOpen, setNewOpen] = useState(false)
  const [deactivateTarget, setDeactivateTarget] = useState<ChartOfAccount | null>(null)

  const pagedData: PagedResult<ChartOfAccount> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetchAll() }, [page])

  const columns: Column<ChartOfAccount>[] = [
    { key: 'code',        header: 'Codigo',    render: r => <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{r.code}</span> },
    { key: 'name',        header: 'Nome',      render: r => <span className="font-medium">{r.name}</span> },
    { key: 'accountType', header: 'Tipo',      render: r => typeLabels[r.accountType] ?? r.accountType },
    { key: 'nature',      header: 'Natureza',  render: r => r.nature === 'Debit' ? 'Devedora' : 'Credora' },
    { key: 'isAnalytical',header: 'Analitica', render: r => <Badge variant={r.isAnalytical ? 'info' : 'default'}>{r.isAnalytical ? 'Sim' : 'Nao'}</Badge> },
    { key: 'isActive',    header: 'Status',    render: r => <Badge variant={r.isActive ? 'success' : 'default'} dot>{r.isActive ? 'Ativa' : 'Inativa'}</Badge> },
    { key: 'actions',     header: '', render: r => r.isActive ? <Button size="sm" variant="ghost" onClick={() => setDeactivateTarget(r)} className="text-red-500 hover:bg-red-50">Desativar</Button> : null },
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Plano de Contas" subtitle={`${totalCount} conta${totalCount !== 1 ? 's' : ''}`}
        actions={<Button onClick={() => setNewOpen(true)}>+ Nova conta</Button>} />
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhuma conta cadastrada." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Nova conta contabil" size="md">
        <AccountForm isSaving={isSaving} onCancel={() => setNewOpen(false)} onSubmit={async d => { try { await create(d); success('Conta cadastrada!'); setNewOpen(false); fetchAll() } catch { notifyError('Erro ao cadastrar.') } }} />
      </Modal>
      <ConfirmModal isOpen={!!deactivateTarget} onClose={() => setDeactivateTarget(null)}
        onConfirm={async () => { try { await chartOfAccountsService.deactivate(deactivateTarget!.id); success('Conta desativada.'); setDeactivateTarget(null); fetchAll() } catch { notifyError('Erro.') } }}
        title="Desativar conta" message={`Desativar a conta "${deactivateTarget?.name}"?`} confirmLabel="Desativar" isLoading={isSaving} />
    </div>
  )
}
