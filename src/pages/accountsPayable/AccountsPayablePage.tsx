import { useEffect, useState, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { Select } from '../../components/ui/Select/Select'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { AccountPayableStatusBadge } from '../../components/features/accountsPayable/PayableStatusBadge'
import { useAccountsPayable } from '../../hooks/useAccountsPayable'
import { useNotifications } from '../../contexts/NotificationContext'
import { bankAccountsService } from '../../services/bankAccounts.service'
import { suppliersService } from '../../services/suppliers.service'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import {
  accountPayableSchema,
  payAccountPayableSchema,
  type AccountPayableFormData,
  type PayAccountPayableFormData
} from '../../schemas/accountsPayable.schema'
import { DatePicker } from '../../components/ui/DatePicker/DatePicker'
import { CurrencyInput } from '../../components/ui/CurrencyInput/CurrencyInput'
import { ROUTES } from '../../router/routes'
import type { AccountPayable, BankAccount, Supplier } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'
import { AccountPayableStatus } from '../../types/enums'

function NewPayableForm({
  onSubmit,
  onCancel,
  isSaving
}: {
  onSubmit: (d: AccountPayableFormData) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}) {
  const { register, handleSubmit, setValue, watch, formState: { errors } }
    = useForm<AccountPayableFormData>({
      resolver: zodResolver(accountPayableSchema)
    })

  const totalAmount = watch('totalAmount')
  const [suppliers, setSuppliers] = useState<Supplier[]>([])
  const [isLoadingSuppliers, setIsLoadingSuppliers] = useState(true)

  useEffect(() => {
    suppliersService.getAll()
      .then(r => setSuppliers(r.items ?? []))
      .finally(() => setIsLoadingSuppliers(false))
  }, [])

  const supplierOptions = suppliers.map(s => ({ value: s.id, label: s.name }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Select
        label="Fornecedor"
        required
        options={supplierOptions}
        placeholder={isLoadingSuppliers ? 'Carregando...' : 'Selecione...'}
        disabled={isLoadingSuppliers}
        error={errors.supplierId?.message}
        {...register('supplierId')}
      />
      <Input label="Descrição" required {...register('description')} error={errors.description?.message} />

      <CurrencyInput
        label="Valor"
        required
        value={totalAmount}
        onChange={v => setValue('totalAmount', v, { shouldValidate: true })}
        error={errors.totalAmount?.message}
      />

      <DatePicker label="Vencimento" required {...register('dueDate')} error={errors.dueDate?.message} />

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

function PayForm({
  item,
  onSubmit,
  onCancel,
  isSaving
}: {
  item: AccountPayable
  onSubmit: (d: PayAccountPayableFormData) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}) {
  const { register, handleSubmit, setValue, watch, formState: { errors } }
    = useForm<PayAccountPayableFormData>({
      resolver: zodResolver(payAccountPayableSchema),
      defaultValues: { amount: item.remainingAmount }
    })

  const amount = watch('amount')
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>([])
  const [isLoadingAccounts, setIsLoadingAccounts] = useState(true)

  useEffect(() => {
    bankAccountsService.getAll()
      .then(r => setBankAccounts((r.items ?? []).filter(a => a.isActive)))
      .finally(() => setIsLoadingAccounts(false))
  }, [])

  const bankAccountOptions = bankAccounts.map(a => ({
    value: a.id,
    label: `${a.bankName} — ${a.accountNumber} (${formatCurrency(a.balance)})`,
  }))

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <p className="text-sm text-slate-500">
        Valor original: <strong>{formatCurrency(item.totalAmount)}</strong>
      </p>

      <p className="text-sm text-slate-500">
        Valor restante: <strong>{formatCurrency(item.remainingAmount)}</strong>
      </p>

      <CurrencyInput
        label="Valor pago"
        required
        value={amount}
        onChange={v => setValue('amount', v, { shouldValidate: true })}
        error={errors.amount?.message}
      />

      <DatePicker
        label="Data do pagamento"
        required
        {...register('paymentDate')}
        error={errors.paymentDate?.message}
      />

      <Select
        label="Conta Bancária"
        required
        options={bankAccountOptions}
        placeholder={isLoadingAccounts ? 'Carregando...' : 'Selecione...'}
        disabled={isLoadingAccounts}
        error={errors.bankAccountId?.message}
        {...register('bankAccountId')}
      />

      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSaving}>
          Registrar pagamento
        </Button>
      </div>
    </form>
  )
}

export default function AccountsPayablePage() {
  const navigate = useNavigate()
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
    pay,
    cancel
  } = useAccountsPayable()

  const [search, setSearch] = useState('')
  const [newOpen, setNewOpen] = useState(false)
  const [payOpen, setPayOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [target, setTarget] = useState<AccountPayable | null>(null)

  const pagedData: PagedResult<AccountPayable> = {
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

  const columns: Column<AccountPayable>[] = [
    { key: 'supplierName', header: 'Fornecedor', render: r => <span className="font-medium">{r.supplierName}</span> },
    { key: 'description', header: 'Descrição' },
    { key: 'totalAmount', header: 'Valor', render: r => formatCurrency(r.totalAmount) },
    { key: 'paidAmount', header: 'Pago', render: r => r.paidAmount > 0 ? formatCurrency(r.paidAmount) : '-' },
    { key: 'dueDate', header: 'Vencimento', render: r => formatDate(r.dueDate) },
    { key: 'status', header: 'Status', render: r => <AccountPayableStatusBadge status={r.status} /> },
    {
      key: 'actions',
      header: '',
      headerClassName: 'w-64',
      render: r => (
        <div className="flex items-center justify-end gap-1">
          <Button size="sm" variant="ghost" onClick={() => navigate(`${ROUTES.ACCOUNTS_PAYABLE}/${r.id}`)}>
            Ver
          </Button>

          {(r.status === AccountPayableStatus.Pending || r.status === AccountPayableStatus.Overdue || r.status === AccountPayableStatus.PartiallyPaid) && (
            <Button size="sm" variant="ghost" onClick={() => { setTarget(r); setPayOpen(true) }}>
              Pagar
            </Button>
          )}

          {(r.status !== AccountPayableStatus.Cancelled && r.status !== AccountPayableStatus.Paid) && (
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
      <PageHeader title="Contas a Pagar" subtitle={`${totalCount} registros`} />

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

      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Nova conta a pagar">
        <NewPayableForm
          isSaving={isSaving}
          onCancel={() => setNewOpen(false)}
          onSubmit={async d => {
            try {
              await create(d)
              success('Conta cadastrada!')
              setNewOpen(false)
              fetch({ search })
            } catch {
              notifyError('Erro ao cadastrar.')
            }
          }}
        />
      </Modal>

      <Modal isOpen={payOpen} onClose={() => setPayOpen(false)} title={`Pagar — ${target?.supplierName}`}>
        {target && (
          <PayForm
            item={target}
            isSaving={isSaving}
            onCancel={() => setPayOpen(false)}
            onSubmit={async d => {
              try {
                await pay(target.id, d)
                success('Pagamento registrado!')
                setPayOpen(false)
                setTarget(null)
                fetch({ search })
              } catch {
                notifyError('Erro ao pagar.')
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
            await cancel(target!.id, 'Cancelado pelo usuário')
            success('Conta cancelada.')
            setCancelOpen(false)
            setTarget(null)
          } catch {
            notifyError('Erro ao cancelar.')
          }
        }}
        title="Cancelar conta"
        message={`Cancelar conta de "${target?.supplierName}"?`}
        confirmLabel="Cancelar conta"
        isLoading={isSaving}
      />
    </div>
  )
}