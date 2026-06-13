import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { Input } from '../../components/ui/Input/Input'
import { BudgetStatusBadge } from '../../components/features/budgets/BudgetStatusBadge'
import { useBudgets } from '../../hooks/useBudgets'
import { useNotifications } from '../../contexts/NotificationContext'
import { useAuth } from '../../hooks/useAuth'
import { formatCurrency } from '../../utils/formatters'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { BudgetStatus } from '../../types/enums'
import { ROUTES } from '../../router/routes'
import type { Budget, CreateBudgetRequest } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'
import { z } from 'zod'

const createBudgetSchema = z.object({
  year:        z.number().int().min(2000).max(2100),
  name:        z.string().min(2, 'Nome deve ter ao menos 2 caracteres'),
  description: z.string().optional(),
})
type CreateBudgetFormData = z.infer<typeof createBudgetSchema>

function BudgetForm({ onSubmit, onCancel, isSaving }: {
  onSubmit: (d: CreateBudgetFormData) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}) {
  const { register, handleSubmit, formState: { errors } } = useForm<CreateBudgetFormData>({
    resolver: zodResolver(createBudgetSchema),
    defaultValues: { year: new Date().getFullYear() },
  })
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input label="Nome" required error={errors.name?.message} {...register('name')} />
      <Input label="Ano fiscal" type="number" required error={errors.year?.message} {...register('year', { valueAsNumber: true })} />
      <Input label="Descrição" {...register('description')} />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>Criar orçamento</Button>
      </div>
    </form>
  )
}

export default function BudgetsPage() {
  const navigate = useNavigate()
  const { user } = useAuth()
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll, create, approve } = useBudgets()
  const [newOpen, setNewOpen]           = useState(false)
  const [approveTarget, setApproveTarget] = useState<Budget | null>(null)

  const pagedData: PagedResult<Budget> = {
    items, totalCount, pageNumber: page, pageSize, totalPages,
    hasPreviousPage: page > 1, hasNextPage: page < totalPages,
  }

  useEffect(() => { fetchAll() }, [page])

  const columns: Column<Budget>[] = [
    { key: 'name',         header: 'Nome',      render: r => <span className="font-medium">{r.name}</span> },
    { key: 'year',         header: 'Ano Fiscal' },
    { key: 'totalPlanned', header: 'Planejado', render: r => formatCurrency(r.totalPlanned) },
    { key: 'totalRealized',header: 'Realizado', render: r => formatCurrency(r.totalRealized) },
    { key: 'variance',     header: 'Variação',  render: r => (
      <span className={r.variance >= 0 ? 'text-green-600' : 'text-red-600'}>{formatCurrency(r.variance)}</span>
    )},
    { key: 'status',  header: 'Status',  render: r => <BudgetStatusBadge status={r.status} /> },
    { key: 'actions', header: '', render: r => (
      <div className="flex gap-2">
        <Button size="sm" variant="ghost" onClick={() => navigate(`${ROUTES.BUDGETS}/${r.id}`)}>Ver</Button>
        {r.status === BudgetStatus.Draft && (
          <Button size="sm" variant="ghost" onClick={() => setApproveTarget(r)} className="text-blue-500 hover:bg-blue-50">
            Aprovar
          </Button>
        )}
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader
        title="Orçamentos"
        subtitle={`${totalCount} orçamento${totalCount !== 1 ? 's' : ''}`}
        actions={<Button onClick={() => setNewOpen(true)}>+ Novo orçamento</Button>}
      />

      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhum orçamento cadastrado." />

      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}

      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Novo orçamento" size="sm">
        <BudgetForm isSaving={isSaving} onCancel={() => setNewOpen(false)}
          onSubmit={async d => {
            try {
              await create(d as unknown as CreateBudgetRequest)
              success('Orçamento criado!')
              setNewOpen(false)
              fetchAll()
            } catch { notifyError('Erro ao criar orçamento.') }
          }}
        />
      </Modal>

      <Modal
        isOpen={!!approveTarget}
        onClose={() => setApproveTarget(null)}
        title="Aprovar orçamento"
        size="sm"
        footer={
          <>
            <Button variant="secondary" onClick={() => setApproveTarget(null)} disabled={isSaving}>Cancelar</Button>
            <Button variant="primary" isLoading={isSaving}
              onClick={async () => {
                try {
                  await approve(approveTarget!.id, user?.id ?? 'system')
                  success('Orçamento aprovado!')
                  setApproveTarget(null)
                  fetchAll()
                } catch { notifyError('Erro ao aprovar orçamento.') }
              }}>
              Confirmar aprovação
            </Button>
          </>
        }
      >
        <p className="text-sm text-slate-600">
          Aprovar o orçamento <strong>"{approveTarget?.name}"</strong>? Esta ação não pode ser desfeita.
        </p>
      </Modal>
    </div>
  )
}