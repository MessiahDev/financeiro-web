import { Table, type Column } from '../../ui/Table/Table'
import { TablePagination } from '../../ui/Table/TablePagination'
import { Button } from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { Badge } from '../../ui/Badge/Badge'
import type { Department } from '../../../types/domain.types'
import type { PagedResult } from '../../../types/pagination.types'

interface Props { data: PagedResult<Department> | null; isLoading: boolean; onEdit: (d: Department) => void; onDelete: (d: Department) => void; onPageChange: (p: number) => void; onSearch: (q: string) => void; searchValue: string; onNew: () => void }

export function DepartmentList({ data, isLoading, onEdit, onDelete, onPageChange, onSearch, searchValue, onNew }: Props) {
  const columns: Column<Department>[] = [
  { key: 'name',          header: 'Nome',           render: (r) => <span className="font-medium text-slate-900 dark:text-slate-100">{r.name}</span> },
  { key: 'costCenter',    header: 'Centro de Custo', render: (r) => r.costCenter ?? '-' },
  { key: 'description',  header: 'Descrição',       render: (r) => r.description ?? '-' },
  { key: 'employeeCount', header: 'Funcionários',   render: (r) => r.employeeCount },
  { key: 'isActive',      header: 'Status',         render: (r) => <Badge variant={r.isActive ? 'success' : 'default'} dot>{r.isActive ? 'Ativo' : 'Inativo'}</Badge> },
  { key: 'actions',       header: '', headerClassName: 'w-24', render: (r) => (
    <div className="flex items-center justify-end gap-1">
      <Button size="sm" variant="ghost" onClick={() => onEdit(r)}>Editar</Button>
      <Button size="sm" variant="ghost" onClick={() => onDelete(r)} className="text-red-500 hover:bg-red-50">Excluir</Button>
    </div>
  )},
]
  const pagination = data ? { totalCount: data.totalCount, pageNumber: data.pageNumber, pageSize: data.pageSize, totalPages: data.totalPages, hasPreviousPage: data.hasPreviousPage, hasNextPage: data.hasNextPage } : null
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs"><Input placeholder="Buscar departamento..." value={searchValue} onChange={(e) => onSearch(e.target.value)} /></div>
        <Button onClick={onNew}>+ Novo departamento</Button>
      </div>
      <Table columns={columns} data={data?.items ?? []} keyExtractor={(r) => r.id} isLoading={isLoading} emptyMessage="Nenhum departamento cadastrado." />
      {pagination && pagination.totalPages > 1 && <TablePagination pagination={pagination} onPageChange={onPageChange} />}
    </div>
  )
}
