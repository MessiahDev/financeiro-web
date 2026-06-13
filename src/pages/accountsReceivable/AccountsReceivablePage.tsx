import { useEffect, useState, useCallback } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { AccountReceivableStatusBadge } from '../../components/features/accountsReceivable/ReceivableStatusBadge'
import { AccountReceivableStatus } from '../../types/enums'
import { useAccountsReceivable } from '../../hooks/useAccountsReceivable'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  accountReceivableSchema,
  receivePaymentSchema,
  type AccountReceivableFormData,
  type ReceivePaymentFormData
} from '../../schemas/accountsReceivable.schema'
import { DatePicker } from '../../components/ui/DatePicker/DatePicker'
import { CurrencyInput } from '../../components/ui/CurrencyInput/CurrencyInput'
import type { AccountReceivable } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

function NewForm({
  onSubmit,
  onCancel,
  isSaving
}: {
  onSubmit: (d: AccountReceivableFormData) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}) {
  const { register, handleSubmit, setValue, watch, formState: { errors } }
    = useForm<AccountReceivableFormData>({
      resolver: zodResolver(accountReceivableSchema)
    })

  const amount = watch('amount')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input label="ID do Cliente" required error={errors.customerId?.message} {...register('customerId')} />
      <Input label="Descrição" required error={errors.description?.message} {...register('description')} />

      <CurrencyInput
        label="Valor"
        required
        value={amount}
        onChange={v => setValue('amount', v, { shouldValidate: true })}
        error={errors.amount?.message}
      />

      <DatePicker label="Vencimento" required error={errors.dueDate?.message} {...register('dueDate')} />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSaving}>
          Cadastrar
        </Button>
      </div>
    </form>
  )
}

function ReceiveForm({
  item,
  onSubmit,
  onCancel,
  isSaving
}: {
  item: AccountReceivable
  onSubmit: (d: ReceivePaymentFormData) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}) {
  const { register, handleSubmit, setValue, watch, formState: { errors } }
    = useForm<ReceivePaymentFormData>({
      resolver: zodResolver(receivePaymentSchema),
      defaultValues: { amount: item.totalAmount }
    })

  const amount = watch('amount')

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <p className="text-sm text-slate-500">
        Valor original: <strong>{formatCurrency(item.totalAmount)}</strong>
      </p>

      <CurrencyInput
        label="Valor recebido"
        required
        value={amount}
        onChange={v => setValue('amount', v, { shouldValidate: true })}
        error={errors.amount?.message}
      />

      <DatePicker label="Data do recebimento" required {...register('receiptDate')} error={errors.receiptDate?.message} />

      <Input label="ID da Conta Bancária" required {...register('bankAccountId')} error={errors.bankAccountId?.message} />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSaving}>
          Registrar recebimento
        </Button>
      </div>
    </form>
  )
}

export default function AccountsReceivablePage() {
  const { success, error: notifyError } = useNotifications()
  const {
    items,
    isLoading,
    isSaving,
    page,
    totalCount,
    totalPages,
    setPage,
    fetch,
    create,
    receive,
    cancel
  } = useAccountsReceivable()

  const [search, setSearch] = useState('')
  const [newOpen, setNewOpen] = useState(false)
  const [receiveOpen, setReceiveOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [target, setTarget] = useState<AccountReceivable | null>(null)

  const pagedData: PagedResult<AccountReceivable> = {
    items,
    totalCount,
    pageNumber: page,
    pageSize: 10,
    totalPages,
    hasPreviousPage: page > 1,
    hasNextPage: page < totalPages
  }

  useEffect(() => {
    fetch({ search })
  }, [page])

  const handleSearch = useCallback((q: string) => {
    setSearch(q)
    setPage(1)
    fetch({ search: q, pageNumber: 1 })
  }, [fetch, setPage])

  const columns: Column<AccountReceivable>[] = [
    { key: 'customerName', header: 'Cliente', render: r => <span className="font-medium">{r.customerName}</span> },
    { key: 'description', header: 'Descrição' },
    { key: 'amount', header: 'Valor', render: r => formatCurrency(r.totalAmount) },
    { key: 'receivedAmount', header: 'Recebido', render: r => r.receivedAmount > 0 ? formatCurrency(r.receivedAmount) : '-' },
    { key: 'dueDate', header: 'Vencimento', render: r => formatDate(r.dueDate) },
    { key: 'status', header: 'Status', render: r => <AccountReceivableStatusBadge status={r.status} /> },
    {
      key: 'actions',
      header: '',
      render: r => (
        <div className="flex justify-end gap-1">
          {(r.status === AccountReceivableStatus.Pending || r.status === AccountReceivableStatus.Overdue) && (
            <Button size="sm" variant="ghost" onClick={() => { setTarget(r); setReceiveOpen(true) }}>
              Receber
            </Button>
          )}

          {r.status !== AccountReceivableStatus.Cancelled && r.status !== AccountReceivableStatus.Received && (
            <Button size="sm" variant="ghost" className="text-red-500" onClick={() => { setTarget(r); setCancelOpen(true) }}>
              Cancelar
            </Button>
          )}
        </div>
      )
    }
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Contas a Receber" subtitle={`${totalCount} registros`} />

      <div className="flex gap-3">
        <Input placeholder="Buscar..." value={search} onChange={e => handleSearch(e.target.value)} />
        <Button onClick={() => setNewOpen(true)}>+ Nova conta</Button>
      </div>

      <Table
        columns={columns}
        data={items}
        keyExtractor={r => r.id}
        isLoading={isLoading}
      />

      {pagedData.totalPages > 1 && (
        <TablePagination pagination={pagedData} onPageChange={setPage} />
      )}

      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Nova conta a receber">
        <NewForm
          isSaving={isSaving}
          onCancel={() => setNewOpen(false)}
          onSubmit={async d => {
            try {
              await create({
                ...d,
                totalAmount: d.amount
              } as any)

              success('Conta cadastrada!')
              setNewOpen(false)
              fetch({ search })
            } catch {
              notifyError('Erro ao cadastrar.')
            }
          }}
        />
      </Modal>

      <Modal isOpen={receiveOpen} onClose={() => setReceiveOpen(false)} title="Receber conta">
        {target && (
          <ReceiveForm
            item={target}
            isSaving={isSaving}
            onCancel={() => setReceiveOpen(false)}
            onSubmit={async d => {
              try {
                await receive(target.id, d)
                success('Recebimento registrado!')
                setReceiveOpen(false)
                setTarget(null)
              } catch {
                notifyError('Erro ao registrar.')
              }
            }}
          />
        )}
      </Modal>

      <ConfirmModal
        isOpen={cancelOpen}
        onClose={() => setCancelOpen(false)}
        onConfirm={async () => {
          try {
            await cancel(target!.id, 'Cancelado')
            success('Cancelado.')
            setCancelOpen(false)
            setTarget(null)
          } catch {
            notifyError('Erro.')
          }
        }}
        title="Cancelar conta"
        message={`Cancelar conta de "${target?.customerName}"?`}
        confirmLabel="Cancelar"
        isLoading={isSaving}
      />
    </div>
  )
}