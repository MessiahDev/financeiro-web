import { Table, type Column } from '../../ui/Table/Table'
import { TablePagination } from '../../ui/Table/TablePagination'
import { Button } from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { PersonStatusBadge } from './CustomerStatusBadge'
import { formatDocument, formatPhone } from '../../../utils/formatters'
import type { Customer } from '../../../types/domain.types'
import type { PagedResult } from '../../../types/pagination.types'

interface CustomerListProps {
  data:         PagedResult<Customer> | null
  isLoading:    boolean
  onEdit:       (c: Customer) => void
  onDelete:     (c: Customer) => void
  onBlock:      (c: Customer) => void
  onPageChange: (page: number) => void
  onSearch:     (q: string) => void
  searchValue:  string
  onNew:        () => void
}

export function CustomerList({
  data, isLoading, onEdit, onDelete, onBlock,
  onPageChange, onSearch, searchValue, onNew,
}: CustomerListProps) {

  const columns: Column<Customer>[] = [
    { key: 'name',     header: 'Nome',      render: (r) => <span className="font-medium text-slate-900">{r.name}</span> },
    { key: 'document', header: 'CPF/CNPJ',  render: (r) => formatDocument(r.document) },
    { key: 'email',    header: 'E-mail' },
    { key: 'phone',    header: 'Telefone',  render: (r) => r.phone ? formatPhone(r.phone) : '-' },
    { key: 'status',   header: 'Status',    render: (r) => <PersonStatusBadge status={r.status} /> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'w-32',
      render: (r) => (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => onEdit(r)}>Editar</Button>
          <Button size="sm" variant="ghost" onClick={() => onBlock(r)}>Bloquear</Button>
          <Button size="sm" variant="ghost" onClick={() => onDelete(r)}
            className="text-red-500 hover:text-red-700 hover:bg-red-50">
            Excluir
          </Button>
        </div>
      ),
    },
  ]

  const pagination = data
    ? { totalCount: data.totalCount, pageNumber: data.pageNumber, pageSize: data.pageSize, totalPages: data.totalPages, hasPreviousPage: data.hasPreviousPage, hasNextPage: data.hasNextPage }
    : null

  return (
    <div className="flex flex-col gap-4">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs">
          <Input
            placeholder="Buscar por nome, e-mail ou documento..."
            value={searchValue}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
        <Button onClick={onNew}>+ Novo cliente</Button>
      </div>

      <Table
        columns={columns}
        data={data?.items ?? []}
        keyExtractor={(r) => r.id}
        isLoading={isLoading}
        emptyMessage="Nenhum cliente cadastrado."
      />

      {pagination && pagination.totalPages > 1 && (
        <TablePagination pagination={pagination} onPageChange={onPageChange} />
      )}
    </div>
  )
}