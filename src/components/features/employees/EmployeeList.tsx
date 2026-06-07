import { Table, type Column } from '../../ui/Table/Table'
import { TablePagination } from '../../ui/Table/TablePagination'
import { Button } from '../../ui/Button/Button'
import { Input } from '../../ui/Input/Input'
import { Badge } from '../../ui/Badge/Badge'
import { formatCurrency, formatCPF } from '../../../utils/formatters'
import { EmployeeStatus } from '../../../types/enums'
import type { Employee } from '../../../types/domain.types'
import type { PagedResult } from '../../../types/pagination.types'

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  [EmployeeStatus.Active]:     { label: 'Ativo',     variant: 'success' },
  [EmployeeStatus.Inactive]:   { label: 'Inativo',   variant: 'default' },
  [EmployeeStatus.Terminated]: { label: 'Desligado', variant: 'warning' },
}

interface Props { data: PagedResult<Employee> | null; isLoading: boolean; onEdit: (e: Employee) => void; onDelete: (e: Employee) => void; onUpdateSalary: (e: Employee) => void; onPageChange: (p: number) => void; onSearch: (q: string) => void; searchValue: string; onNew: () => void }

export function EmployeeList({ data, isLoading, onEdit, onDelete, onUpdateSalary, onPageChange, onSearch, searchValue, onNew }: Props) {
  const columns: Column<Employee>[] = [
    { key: 'name',           header: 'Nome',       render: (r) => <span className="font-medium text-slate-900">{r.name}</span> },
    { key: 'cpf',            header: 'CPF',        render: (r) => formatCPF(r.cpf) },
    { key: 'position',       header: 'Cargo' },
    { key: 'departmentName', header: 'Departamento' },
    { key: 'salary',         header: 'Salario',    render: (r) => <span className="font-medium">{formatCurrency(r.salary)}</span> },
    { key: 'status',         header: 'Status',     render: (r) => { const s = statusMap[r.status] ?? { label: r.status, variant: 'default' as const }; return <Badge variant={s.variant} dot>{s.label}</Badge> } },
    { key: 'actions',        header: '', headerClassName: 'w-40', render: (r) => (
      <div className="flex items-center justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => onEdit(r)}>Editar</Button>
        <Button size="sm" variant="ghost" onClick={() => onUpdateSalary(r)}>Salario</Button>
        <Button size="sm" variant="ghost" onClick={() => onDelete(r)} className="text-red-500 hover:bg-red-50">Excluir</Button>
      </div>
    )},
  ]
  const pagination = data ? { totalCount: data.totalCount, pageNumber: data.pageNumber, pageSize: data.pageSize, totalPages: data.totalPages, hasPreviousPage: data.hasPreviousPage, hasNextPage: data.hasNextPage } : null
  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="w-full sm:max-w-xs"><Input placeholder="Buscar funcionario..." value={searchValue} onChange={(e) => onSearch(e.target.value)} /></div>
        <Button onClick={onNew}>+ Novo funcionario</Button>
      </div>
      <Table columns={columns} data={data?.items ?? []} keyExtractor={(r) => r.id} isLoading={isLoading} emptyMessage="Nenhum funcionario cadastrado." />
      {pagination && pagination.totalPages > 1 && <TablePagination pagination={pagination} onPageChange={onPageChange} />}
    </div>
  )
}