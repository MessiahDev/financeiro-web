import { useEffect, useState, useCallback } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { EmployeeList } from '../../components/features/employees/EmployeeList'
import { EmployeeForm } from '../../components/features/employees/EmployeeForm'
import { UpdateSalaryForm } from '../../components/features/employees/UpdateSalaryForm'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { useEmployees } from '../../hooks/useEmployees'
import { useDepartments } from '../../hooks/useDepartments'
import { useNotifications } from '../../contexts/NotificationContext'
import type { Employee } from '../../types/domain.types'
import type { EmployeeFormData, UpdateSalaryFormData } from '../../schemas/employee.schema'
import type { PagedResult } from '../../types/pagination.types'

export default function EmployeesPage() {
  const { success, error: notifyError } = useNotifications()
  const {
    items, isLoading, isSaving,
    page, pageSize, totalCount, totalPages,
    setPage, fetchEmployees, create, update, remove, updateSalary,
  } = useEmployees()

  const { items: departments, fetchDepartments } = useDepartments()

  const [search, setSearch]         = useState('')
  const [formOpen, setFormOpen]     = useState(false)
  const [salaryOpen, setSalaryOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [editing, setEditing]       = useState<Employee | null>(null)
  const [target, setTarget]         = useState<Employee | null>(null)

  const pagedData: PagedResult<Employee> = {
    items, totalCount, pageNumber: page, pageSize, totalPages,
    hasPreviousPage: page > 1, hasNextPage: page < totalPages,
  }

  useEffect(() => { fetchEmployees({ search }) }, [page])

  useEffect(() => { fetchDepartments({ pageSize: 100 }) }, [])

  const handleSearch = useCallback((q: string) => {
    setSearch(q)
    setPage(1)
    fetchEmployees({ search: q, pageNumber: 1 })
  }, [fetchEmployees, setPage])

  async function handleSubmit(data: EmployeeFormData) {
    try {
      editing ? await update(editing.id, data) : await create(data)
      success(editing ? 'Funcionário atualizado!' : 'Funcionário cadastrado!')
      setFormOpen(false)
      setEditing(null)
      fetchEmployees({ search })
    } catch {
      notifyError('Erro ao salvar funcionário.')
    }
  }

  async function handleSalary(data: UpdateSalaryFormData) {
    if (!target) return
    try {
      await updateSalary(target.id, data)
      success('Salário atualizado!')
      setSalaryOpen(false)
      setTarget(null)
      fetchEmployees({ search })
    } catch {
      notifyError('Erro ao atualizar salário.')
    }
  }

  async function handleDelete() {
    if (!target) return
    try {
      await remove(target.id)
      success('Funcionário excluído.')
      setDeleteOpen(false)
      setTarget(null)
    } catch {
      notifyError('Não foi possível excluir.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Funcionários"
        subtitle={`${totalCount} funcionário${totalCount !== 1 ? 's' : ''} cadastrado${totalCount !== 1 ? 's' : ''}`}
      />

      <EmployeeList
        data={pagedData}
        isLoading={isLoading}
        searchValue={search}
        onSearch={handleSearch}
        onPageChange={setPage}
        onNew={() => { setEditing(null); setFormOpen(true) }}
        onEdit={(e) => { setEditing(e); setFormOpen(true) }}
        onUpdateSalary={(e) => { setTarget(e); setSalaryOpen(true) }}
        onDelete={(e) => { setTarget(e); setDeleteOpen(true) }}
      />

      <Modal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        title={editing ? 'Editar funcionário' : 'Novo funcionário'}
        size="xl"
      >
        <EmployeeForm
          initial={editing ?? undefined}
          departments={departments}
          onSubmit={handleSubmit}
          onCancel={() => { setFormOpen(false); setEditing(null) }}
          isSaving={isSaving}
        />
      </Modal>

      <Modal
        isOpen={salaryOpen}
        onClose={() => { setSalaryOpen(false); setTarget(null) }}
        title={`Atualizar salário — ${target?.fullName ?? ''}`}
        size="sm"
      >
        <UpdateSalaryForm
          currentSalary={target?.salary ?? 0}
          onSubmit={handleSalary}
          onCancel={() => { setSalaryOpen(false); setTarget(null) }}
          isSaving={isSaving}
        />
      </Modal>

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Excluir funcionário"
        message={`Deseja excluir "${target?.fullName}"? Esta ação não pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={isSaving}
      />
    </div>
  )
}