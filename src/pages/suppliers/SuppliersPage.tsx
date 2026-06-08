import { useEffect, useState, useCallback } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { SupplierList } from '../../components/features/suppliers/SupplierList'
import { SupplierForm } from '../../components/features/suppliers/SupplierForm'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { useSuppliers } from '../../hooks/useSuppliers'
import { useNotifications } from '../../contexts/NotificationContext'
import type { Supplier } from '../../types/domain.types'
import type { SupplierFormData } from '../../schemas/supplier.schema'
import type { PagedResult } from '../../types/pagination.types'

export default function SuppliersPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchSuppliers, create, update, remove, blockSupplier } = useSuppliers()
  const [search, setSearch] = useState('')
  const [formOpen, setFormOpen] = useState(false)
  const [deleteOpen, setDeleteOpen] = useState(false)
  const [blockOpen, setBlockOpen] = useState(false)
  const [editing, setEditing] = useState<Supplier | null>(null)
  const [target, setTarget] = useState<Supplier | null>(null)

  const pagedData: PagedResult<Supplier> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }

  useEffect(() => { fetchSuppliers({ search }) }, [page])

  const handleSearch = useCallback((q: string) => { setSearch(q); setPage(1); fetchSuppliers({ search: q, pageNumber: 1 }) }, [fetchSuppliers, setPage])

  async function handleSubmit(data: SupplierFormData) {
    try {
      editing ? await update(editing.id, data) : await create(data)
      success(editing ? 'Fornecedor atualizado!' : 'Fornecedor cadastrado!')
      setFormOpen(false); setEditing(null); fetchSuppliers({ search })
    } catch { notifyError('Erro ao salvar fornecedor.') }
  }

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Fornecedores" subtitle={`${totalCount} fornecedor${totalCount !== 1 ? 'es' : ''} cadastrado${totalCount !== 1 ? 's' : ''}`} />
      <SupplierList data={pagedData} isLoading={isLoading} searchValue={search} onSearch={handleSearch} onPageChange={setPage}
        onNew={() => { setEditing(null); setFormOpen(true) }}
        onEdit={(s) => { setEditing(s); setFormOpen(true) }}
        onDelete={(s) => { setTarget(s); setDeleteOpen(true) }}
        onBlock={(s) => { setTarget(s); setBlockOpen(true) }}
      />
      <Modal isOpen={formOpen} onClose={() => { setFormOpen(false); setEditing(null) }} title={editing ? 'Editar fornecedor' : 'Novo fornecedor'} size="lg">
        <SupplierForm initial={editing ?? undefined} onSubmit={handleSubmit} onCancel={() => { setFormOpen(false); setEditing(null) }} isSaving={isSaving} />
      </Modal>
      <ConfirmModal isOpen={deleteOpen} onClose={() => setDeleteOpen(false)} onConfirm={async () => { try { await remove(target!.id); success('Fornecedor excluido.'); setDeleteOpen(false); setTarget(null) } catch { notifyError('Nao foi possivel excluir.') } }} title="Excluir fornecedor" message={`Excluir "${target?.name}"?`} confirmLabel="Excluir" isLoading={isSaving} />
      <ConfirmModal isOpen={blockOpen} onClose={() => setBlockOpen(false)} onConfirm={async () => { try { await blockSupplier(target!.id, 'Bloqueado'); success('Fornecedor bloqueado.'); setBlockOpen(false); setTarget(null) } catch { notifyError('Nao foi possivel bloquear.') } }} title="Bloquear fornecedor" message={`Bloquear "${target?.name}"?`} confirmLabel="Bloquear" variant="primary" isLoading={isSaving} />
    </div>
  )
}
