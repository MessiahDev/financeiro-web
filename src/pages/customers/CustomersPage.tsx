import { useEffect, useState, useCallback } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { CustomerList } from '../../components/features/customers/CustomerList'
import { CustomerForm } from '../../components/features/customers/CustomerForm'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { useCustomers } from '../../hooks/useCustomers'
import { useNotifications } from '../../contexts/NotificationContext'
import type { Customer } from '../../types/domain.types'
import type { CustomerFormData } from '../../schemas/customer.schema'
import type { PagedResult } from '../../types/pagination.types'

export default function CustomersPage() {
  const { success, error: notifyError } = useNotifications()
  const {
    items, isLoading, isSaving, page, pageSize, totalCount, totalPages,
    setPage, fetchCustomers, create, update, remove, blockCustomer,
  } = useCustomers()

  const [search, setSearch]         = useState('')
  const [formOpen, setFormOpen]     = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [blockOpen, setBlockOpen]   = useState(false)
  const [editing, setEditing]       = useState<Customer | null>(null)
  const [target, setTarget]         = useState<Customer | null>(null)

  const pagedData: PagedResult<Customer> = {
    items, totalCount, pageNumber: page, pageSize,
    totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages,
  }

  useEffect(() => { fetchCustomers({ search }) }, [page])

  const handleSearch = useCallback((q: string) => {
    setSearch(q)
    setPage(1)
    fetchCustomers({ search: q, pageNumber: 1 })
  }, [fetchCustomers, setPage])

  async function handleSubmit(data: CustomerFormData) {
    try {
      if (editing) {
        await update(editing.id, data)
        success('Cliente atualizado com sucesso!')
      } else {
        await create(data)
        success('Cliente cadastrado com sucesso!')
      }
      setFormOpen(false)
      setEditing(null)
      fetchCustomers({ search })
    } catch {
      notifyError('Erro ao salvar cliente.')
    }
  }

  async function handleDelete() {
    if (!target) return
    try {
      await remove(target.id)
      success('Cliente excluido.')
      setDeleteOpen(false)
      setTarget(null)
    } catch {
      notifyError('Nao foi possivel excluir o cliente.')
    }
  }

  async function handleBlock() {
    if (!target) return
    try {
      await blockCustomer(target.id, 'Bloqueado pelo usuario')
      success('Cliente bloqueado.')
      setBlockOpen(false)
      setTarget(null)
    } catch {
      notifyError('Nao foi possivel bloquear o cliente.')
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Clientes"
        subtitle={`${totalCount} cliente${totalCount !== 1 ? 's' : ''} cadastrado${totalCount !== 1 ? 's' : ''}`}
      />

      <CustomerList
        data={pagedData}
        isLoading={isLoading}
        searchValue={search}
        onSearch={handleSearch}
        onPageChange={(p) => setPage(p)}
        onNew={() => { setEditing(null); setFormOpen(true) }}
        onEdit={(c) => { setEditing(c); setFormOpen(true) }}
        onDelete={(c) => { setTarget(c); setDeleteOpen(true) }}
        onBlock={(c) => { setTarget(c); setBlockOpen(true) }}
      />

      <Modal
        isOpen={formOpen}
        onClose={() => { setFormOpen(false); setEditing(null) }}
        title={editing ? 'Editar cliente' : 'Novo cliente'}
        size="lg"
      >
        <CustomerForm
          initial={editing ?? undefined}
          onSubmit={handleSubmit}
          onCancel={() => { setFormOpen(false); setEditing(null) }}
          isSaving={isSaving}
        />
      </Modal>

      <ConfirmModal
        isOpen={deleteOpen}
        onClose={() => setDeleteOpen(false)}
        onConfirm={handleDelete}
        title="Excluir cliente"
        message={`Deseja excluir o cliente "${target?.name}"? Esta acao nao pode ser desfeita.`}
        confirmLabel="Excluir"
        isLoading={isSaving}
      />

      <ConfirmModal
        isOpen={blockOpen}
        onClose={() => setBlockOpen(false)}
        onConfirm={handleBlock}
        title="Bloquear cliente"
        message={`Deseja bloquear o cliente "${target?.name}"?`}
        confirmLabel="Bloquear"
        variant="primary"
        isLoading={isSaving}
      />
    </div>
  )
}