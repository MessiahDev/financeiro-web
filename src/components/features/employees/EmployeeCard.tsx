import { Card } from '../../ui/Card/Card'
import { Badge } from '../../ui/Badge/Badge'
import { formatCurrency, formatCPF, formatDate } from '../../../utils/formatters'
import { EmployeeStatus } from '../../../types/enums'
import type { Employee } from '../../../types/domain.types'

const statusMap: Record<string, { label: string; variant: 'success' | 'warning' | 'default' }> = {
  [EmployeeStatus.Active]:     { label: 'Ativo',       variant: 'success' },
  [EmployeeStatus.Inactive]:   { label: 'Inativo',     variant: 'default' },
  [EmployeeStatus.Terminated]: { label: 'Desligado',   variant: 'warning' },
}

export function EmployeeCard({ employee }: { employee: Employee }) {
  const s = statusMap[employee.status] ?? { label: employee.status, variant: 'default' as const }
  return (
    <Card>
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 font-display text-sm font-semibold text-blue-700">
            {employee.fullName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-medium text-slate-900 dark:text-slate-100">{employee.fullName}</p>
            <p className="text-sm text-slate-500 dark:text-slate-400">{employee.departmentName}</p>
          </div>
        </div>
        <Badge variant={s.variant} dot>{s.label}</Badge>
      </div>
      <div className="mt-4 grid grid-cols-2 gap-3 text-sm">
        <div><p className="text-xs text-slate-400 dark:text-slate-500">CPF</p><p className="text-slate-700 dark:text-slate-300">{formatCPF(employee.cpf)}</p></div>
        <div><p className="text-xs text-slate-400 dark:text-slate-500">Salário</p><p className="font-medium text-slate-900 dark:text-slate-100">{formatCurrency(employee.salary)}</p></div>
        <div><p className="text-xs text-slate-400 dark:text-slate-500">Admissão</p><p className="text-slate-700 dark:text-slate-300">{formatDate(employee.hireDate)}</p></div>
        <div><p className="text-xs text-slate-400 dark:text-slate-500">E-mail</p><p className="truncate text-slate-700 dark:text-slate-300">{employee.email}</p></div>
      </div>
    </Card>
  )
}
