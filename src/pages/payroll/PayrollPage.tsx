import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { Input } from '../../components/ui/Input/Input'
import { Spinner } from '../../components/ui/Spinner/Spinner'
import { PayrollStatusBadge } from '../../components/features/payroll/PayrollStatusBadge'
import { usePayroll } from '../../hooks/usePayroll'
import { useNotifications } from '../../contexts/NotificationContext'
import { employeesService } from '../../services/employees.service'
import { formatCurrency, formatDateTime } from '../../utils/formatters'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { processPayrollSchema, type ProcessPayrollFormData } from '../../schemas/payroll.schema'
import { PayrollStatus } from '../../types/enums'
import { ROUTES } from '../../router/routes'
import type { Employee, Payroll } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

const MONTHS = ['Janeiro','Fevereiro','Março','Abril','Maio','Junho','Julho','Agosto','Setembro','Outubro','Novembro','Dezembro']

function ProcessForm({ onSubmit, onCancel, isSaving }: {
  onSubmit: (d: ProcessPayrollFormData) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}) {
  const [employees, setEmployees]     = useState<Employee[]>([])
  const [selectedIds, setSelectedIds] = useState<string[]>([])
  const [isLoadingEmps, setIsLoadingEmps] = useState(false)

  const { register, handleSubmit, formState: { errors } } = useForm<ProcessPayrollFormData>({
    resolver: zodResolver(processPayrollSchema),
    defaultValues: {
      month: new Date().getMonth() + 1,
      year: new Date().getFullYear(),
      employeeIds: [],
    },
  })

  useEffect(() => {
    setIsLoadingEmps(true)
    employeesService.getAll({ status: 'Active', pageSize: 100 })
      .then(r => setEmployees(r.items ?? []))
      .finally(() => setIsLoadingEmps(false))
  }, [])

  const toggleEmployee = (id: string) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    )
  }

  const toggleAll = () => {
    setSelectedIds(prev =>
      prev.length === employees.length ? [] : employees.map(e => e.id)
    )
  }

  const submit = handleSubmit(data => onSubmit({ ...data, employeeIds: selectedIds }))

  return (
    <form onSubmit={submit} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-2 gap-4">
        <Input
          label="Mês (1-12)"
          type="number" min="1" max="12" required
          error={errors.month?.message}
          {...register('month', { valueAsNumber: true })}
        />
        <Input
          label="Ano"
          type="number" required
          error={errors.year?.message}
          {...register('year', { valueAsNumber: true })}
        />
      </div>

      <div className="flex flex-col gap-2">
        <div className="flex items-center justify-between">
          <label className="text-sm font-medium text-slate-700 dark:text-slate-300">
            Funcionários <span className="text-red-500">*</span>
          </label>
          <button
            type="button"
            onClick={toggleAll}
            className="text-xs text-blue-600 hover:underline"
          >
            {selectedIds.length === employees.length ? 'Desmarcar todos' : 'Selecionar todos'}
          </button>
        </div>

        {isLoadingEmps ? (
          <div className="flex justify-center py-4">
            <Spinner size="sm" className="text-blue-500" />
          </div>
        ) : (
          <div className="max-h-48 overflow-y-auto rounded-lg border border-slate-200 dark:border-slate-800 divide-y divide-slate-100">
            {employees.length === 0 ? (
              <p className="text-xs text-slate-400 dark:text-slate-500 p-3">Nenhum funcionário ativo encontrado.</p>
            ) : employees.map(e => (
              <label key={e.id} className="flex items-center gap-3 px-3 py-2 hover:bg-slate-50 dark:bg-slate-800/50 cursor-pointer">
                <input
                  type="checkbox"
                  checked={selectedIds.includes(e.id)}
                  onChange={() => toggleEmployee(e.id)}
                  className="rounded border-slate-300 text-blue-600"
                />
                <span className="text-sm text-slate-700 dark:text-slate-300">{e.fullName}</span>
                <span className="ml-auto text-xs text-slate-400 dark:text-slate-500">{formatCurrency(e.salary)}</span>
              </label>
            ))}
          </div>
        )}

        {selectedIds.length === 0 && (
          <p className="text-xs text-red-600">Selecione ao menos um funcionário.</p>
        )}
      </div>

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSaving} disabled={selectedIds.length === 0}>
          Processar folha ({selectedIds.length} funcionário{selectedIds.length !== 1 ? 's' : ''})
        </Button>
      </div>
    </form>
  )
}

export default function PayrollPage() {
  const navigate = useNavigate()
  const { success, error: notifyError } = useNotifications()
  const {
    items, isLoading, isSaving,
    page, pageSize, totalCount, totalPages,
    setPage, fetchAll, process, cancel,
  } = usePayroll()

  const [processOpen, setProcessOpen]   = useState(false)
  const [cancelTarget, setCancelTarget] = useState<Payroll | null>(null)
  const [cancelReason, setCancelReason] = useState('')

  const pagedData: PagedResult<Payroll> = {
    items, totalCount, pageNumber: page, pageSize, totalPages,
    hasPreviousPage: page > 1, hasNextPage: page < totalPages,
  }

  useEffect(() => { fetchAll() }, [page])

  const columns: Column<Payroll>[] = [
    { key: 'month',          header: 'Competência',   render: r => `${MONTHS[r.month - 1]} / ${r.year}` },
    { key: 'totalGross',     header: 'Bruto',         render: r => formatCurrency(r.totalGross) },
    { key: 'totalDiscounts', header: 'Descontos',     render: r => formatCurrency(r.totalDiscounts) },
    { key: 'totalNet',       header: 'Líquido',       render: r => <span className="font-semibold">{formatCurrency(r.totalNet)}</span> },
    { key: 'processedAt',    header: 'Processado em', render: r => r.processedAt ? formatDateTime(r.processedAt) : '—' },
    { key: 'status',         header: 'Status',        render: r => <PayrollStatusBadge status={r.status} /> },
    { key: 'actions',        header: '', render: r => (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => navigate(`${ROUTES.PAYROLL}/${r.id}`)}>
          Ver
        </Button>
        {r.status !== PayrollStatus.Cancelled && r.status !== PayrollStatus.Paid && (
          <Button
            size="sm" variant="ghost"
            onClick={() => { setCancelTarget(r); setCancelReason('') }}
            className="text-red-500 hover:bg-red-50"
          >
            Cancelar
          </Button>
        )}
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Folha de Pagamento"
        subtitle={`${totalCount} folha${totalCount !== 1 ? 's' : ''}`}
        actions={<Button onClick={() => setProcessOpen(true)}>+ Processar folha</Button>}
      />

      <Table
        columns={columns}
        data={items}
        keyExtractor={r => r.id}
        isLoading={isLoading}
        emptyMessage="Nenhuma folha processada."
      />

      {pagedData.totalPages > 1 && (
        <TablePagination pagination={pagedData} onPageChange={setPage} />
      )}

      <Modal
        isOpen={processOpen}
        onClose={() => setProcessOpen(false)}
        title="Processar folha de pagamento"
        size="md"
      >
        <ProcessForm
          isSaving={isSaving}
          onCancel={() => setProcessOpen(false)}
          onSubmit={async d => {
            try {
              await process(d)
              success('Folha processada!')
              setProcessOpen(false)
              fetchAll()
            } catch {
              notifyError('Erro ao processar folha.')
            }
          }}
        />
      </Modal>

      <Modal
        isOpen={!!cancelTarget}
        onClose={() => setCancelTarget(null)}
        title="Cancelar folha"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setCancelTarget(null)} disabled={isSaving}>
              Voltar
            </Button>
            <Button
              variant="danger"
              isLoading={isSaving}
              disabled={!cancelReason.trim()}
              onClick={async () => {
                try {
                  await cancel(cancelTarget!.id, cancelReason)
                  success('Folha cancelada.')
                  setCancelTarget(null)
                } catch {
                  notifyError('Erro ao cancelar.')
                }
              }}
            >
              Confirmar cancelamento
            </Button>
          </>
        }
      >
        <div className="flex flex-col gap-3">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            Cancelar a folha de{' '}
            <strong>
              {cancelTarget ? `${MONTHS[cancelTarget.month - 1]}/${cancelTarget.year}` : ''}
            </strong>?
          </p>
          <Input
            label="Motivo"
            required
            placeholder="Informe o motivo do cancelamento..."
            value={cancelReason}
            onChange={e => setCancelReason(e.target.value)}
          />
        </div>
      </Modal>
    </div>
  )
}