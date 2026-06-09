import { Table, type Column } from '../../ui/Table/Table'
import { TablePagination } from '../../ui/Table/TablePagination'
import { Button } from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { PersonStatusBadge } from '../customers/CustomerStatusBadge'
import { formatDocument, formatPhone } from '../../../utils/formatters'
import type { Supplier } from '../../../types/domain.types'
import type { PagedResult } from '../../../types/pagination.types'

interface Props { data: PagedResult<Supplier> | null; isLoading: boolean; onEdit: (s: Supplier) => void; onDelete: (s: Supplier) => void; onBlock: (s: Supplier) => void; onPageChange: (p: number) => void; onSearch: (q: string) => void; searchValue: string; onNew: () => void }

export function SupplierList({ data, isLoading, onEdit, onDelete, onBlock, onPageChange, onSearch, searchValue, onNew }: Props) {
  const columns: Column<Supplier>[] = [
    { key: 'name',   header: 'Nome',     render: (r) => <span className="font-medium text-slate-900">{r.name}</span> },
    { key: 'taxId',  header: 'CPF/CNPJ', render: (r) => formatDocument(r.taxId) },
    { key: 'email',  header: 'E-mail' },
    { key: 'phone',  header: 'Telefone', render: (r) => r.phone ? formatPhone(r.phone) : '-' },
    { key: 'status', header: 'Status',   render: (r) => <PersonStatusBadge status={r.status} /> },
    { key: 'actions', header: '', headerClassName: 'w-32', render: (r) => (
      <div className="flex items-center justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => onEdit(r)}>Editar</Button>
        <Button size="sm" variant="ghost" onClick={() => onBlock(r)}>Bloquear</Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(r)} className="text-red-500 hover:text-red-700 hover:bg-red-50">Excluir</Button>
      </div>
    )},
  ]
  const pagination = data ? { totalCount: data.totalCount, pageNumber: data.pageNumber, pageSize: data.pageSize, totalPages: data.totalPages, hasPreviousPage: data.hasPreviousPage, hasNextPage: data.hasNextPage } : null
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs"><Input placeholder="Buscar fornecedor..." value={searchValue} onChange={(e) => onSearch(e.target.value)} /></div>
        <Button onClick={onNew}>+ Novo fornecedor</Button>
      </div>
      <Table columns={columns} data={data?.items ?? []} keyExtractor={(r) => r.id} isLoading={isLoading} emptyMessage="Nenhum fornecedor cadastrado." />
      {pagination && pagination.totalPages > 1 && <TablePagination pagination={pagination} onPageChange={onPageChange} />}
    </div>
  )
}
