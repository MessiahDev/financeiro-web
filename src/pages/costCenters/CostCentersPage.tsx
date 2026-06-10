import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { Badge } from '../../components/ui/Badge/Badge'
import { useCrud } from '../../hooks/useCrud'
import { costCentersService } from '../../services/costCenters.service'
import { useNotifications } from '../../contexts/NotificationContext'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { costCenterSchema, type CostCenterFormData } from '../../schemas/costCenter.schema'
import { Input } from '../../components/ui/Input/Input'
import type { CostCenter } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

function CostCenterForm({ initial, onSubmit, onCancel, isSaving }: { initial?: CostCenter; onSubmit: (d: CostCenterFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }) {
  const { register, handleSubmit, formState: { errors } } = useForm<CostCenterFormData>({ resolver: zodResolver(costCenterSchema), defaultValues: initial })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input label="Codigo" required error={errors.code?.message} {...register('code')} />
        <Input label="Nome" required error={errors.name?.message} {...register('name')} />
      </div>
      <Input label="Descricao" error={errors.description?.message} {...register('description')} />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>{initial ? 'Salvar' : 'Criar centro de custo'}</Button>
      </div>
    </form>
  )
}

export default function CostCentersPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll, create, update, remove } = useCrud<CostCenter, CostCenterFormData, Partial<CostCenterFormData>>(costCentersService as never)
  const [formOpen, setFormOpen] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState<CostCenter | null>(null)
  const [editing, setEditing] = useState<CostCenter | null>(null)

  const pagedData: PagedResult<CostCenter> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetchAll() }, [page])

  const columns: Column<CostCenter>[] = [
    { key: 'code',        header: 'Codigo',    render: r => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{r.code}</span> },
    { key: 'name',        header: 'Nome',      render: r => <span className="font-medium">{r.name}</span> },
    { key: 'description', header: 'Descricao', render: r => r.description ?? '-' },
    { key: 'status', header: 'Status', render: r => <Badge variant={r.status === 'Active' ? 'success' : 'default'} dot>{r.status === 'Active' ? 'Ativo' : 'Inativo'}</Badge> },
    { key: 'actions',     header: '', render: r => (
      <div className="flex justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => { setEditing(r); setFormOpen(true) }}>Editar</Button>
        <Button size="sm" variant="ghost" onClick={() => setDeleteTarget(r)} className="text-red-500 hover:bg-red-50">Excluir</Button>
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Centros de Custo" subtitle={`${totalCount} centro${totalCount !== 1 ? 's' : ''}`}
        actions={<Button onClick={() => { setEditing(null); setFormOpen(true) }}>+ Novo centro</Button>} />
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhum centro de custo cadastrado." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
      <Modal isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null) }} title={editing ? 'Editar centro' : 'Novo centro de custo'} size="md">
        <CostCenterForm initial={editing ?? undefined} isSaving={isSaving} onCancel={() => { setFormOpen(false); setEditing(null) }}
          onSubmit={async d => { try { editing ? await update(editing.id, d) : await create(d); success(editing ? 'Atualizado!' : 'Criado!'); setFormOpen(false); setEditing(null); fetchAll() } catch { notifyError('Erro ao salvar.') } }} />
      </Modal>
      <ConfirmModal isOpen={!!deleteTarget} onClose={() => setDeleteTarget(null)}
        onConfirm={async () => { try { await remove(deleteTarget!.id); success('Excluido.'); setDeleteTarget(null) } catch { notifyError('Erro.') } }}
        title="Excluir centro" message={`Excluir "${deleteTarget?.name}"?`} confirmLabel="Excluir" isLoading={isSaving} />
    </div>
  )
}
