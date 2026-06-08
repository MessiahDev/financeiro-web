import { useEffect, useState, useCallback } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { DepartmentList } from '../../components/features/departments/DepartmentList'
import { DepartmentForm } from '../../components/features/departments/DepartmentForm'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { useDepartments } from '../../hooks/useDepartments'
import { useNotifications } from '../../contexts/NotificationContext'
import type { Department } from '../../types/domain.types'
import type { DepartmentFormData } from '../../schemas/department.schema'
import type { PagedResult } from '../../types/pagination.types'

export default function DepartmentsPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchDepartments, create, update, remove } = useDepartments()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing] = useState<Department | null>(null)
  const [target, setTarget] = useState<Department | null>(null)

  const pagedData: PagedResult<Department> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }

  useEffect(() => { fetchDepartments({ search }) }, [page])
  const handleSearch = useCallback((q: string) => { setSearch(q); setPage(1); fetchDepartments({ search: q, pageNumber: 1 } as Record<string, unknown>) }, [fetchDepartments, setPage])

  async function handleSubmit(data: DepartmentFormData) {
    try {
      editing ? await update(editing.id, data) : await create(data)
      success(editing ? 'Departamento atualizado!' : 'Departamento criado!')
      setFormOpen(false); setEditing(null); fetchDepartments()
    } catch { notifyError('Erro ao salvar departamento.') }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Departamentos" subtitle={`${totalCount} departamento${totalCount !== 1 ? 's' : ''}`} />
      <DepartmentList data={pagedData} isLoading={isLoading} searchValue={search} onSearch={handleSearch} onPageChange={setPage}
        onNew={() => { setEditing(null); setFormOpen(true) }}
        onEdit={(d) => { setEditing(d); setFormOpen(true) }}
        onDelete={(d) => { setTarget(d); setDeleteOpen(true) }}
      />
      <Modal isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null) }} title={editing ? 'Editar departamento' : 'Novo departamento'} size="md">
        <DepartmentForm initial={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => { setFormOpen(false); setEditing(null) }} isSaving={isSaving} />
      </Modal>
      <ConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={async () => { try { await remove(target!.id); success('Departamento excluido.'); setDeleteOpen(false) } catch { notifyError('Nao foi possivel excluir.') } }} title="Excluir departamento" message={`Excluir "${target?.name}"?`} confirmLabel="Excluir" isLoading={isSaving} />
    </div>
  )
}
