import { useEffect, useState, useCallback } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { TransactionStatusBadge } from '../../components/features/transactions/TransactionStatusBadge'
import { useTransactions } from '../../hooks/useTransactions'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { transactionSchema, type TransactionFormData } from '../../schemas/transaction.schema'
import { DatePicker } from '../../components/ui/DatePicker/DatePicker'
import { CurrencyInput } from '../../components/ui/CurrencyInput/CurrencyInput'
import { Select } from '../../components/ui/Select/Select'
import type { Transaction } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

const typeOptions = [{ value: 'Income', label: 'Receita' }, { value: 'Expense', label: 'Despesa' }, { value: 'Transfer', label: 'Transferencia' }]

function TransactionForm({ onSubmit, onCancel, isSaving }: { onSubmit: (d: TransactionFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TransactionFormData>({ resolver: zodResolver(transactionSchema) })
  const amount = watch('amount')
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Input label="ID da Conta Bancaria" required error={errors.bankAccountId?.message} {...register('bankAccountId')} />
      <Select label="Tipo" required options={typeOptions} placeholder="Selecione..." error={errors.type?.message} {...register('type')} />
      <Input label="Descricao" required error={errors.description?.message} {...register('description')} />
      <CurrencyInput label="Valor" required value={amount} onChange={v => setValue('amount', v, { shouldValidate: true })} error={errors.amount?.message} />
      <DatePicker label="Data" required error={errors.transactionDate?.message} {...register('transactionDate')} />
      <div className="flex justify-end gap-3"><Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button><Button type="submit" isLoading={isSaving}>Registrar</Button></div>
    </form>
  )
}

const typeLabel: Record<string, string> = { Income: 'Receita', Expense: 'Despesa', Transfer: 'Transferencia' }

export default function TransactionsPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetch, create, confirm, cancel } = useTransactions()
  const [search, setSearch] = useState('')
  const [newOpen, setNewOpen] = useState(false)
  const [cancelOpen, setCancelOpen] = useState(false)
  const [target, setTarget] = useState<Transaction | null>(null)
  const pagedData: PagedResult<Transaction> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetch({ search }) }, [page])
  const handleSearch = useCallback((q: string) => { setSearch(q); setPage(1); fetch({ search: q, pageNumber: 1 }) }, [fetch, setPage])

  const columns: Column<Transaction>[] = [
    { key: 'transactionDate', header: 'Data',       render: r => formatDate(r.transactionDate) },
    { key: 'description',     header: 'Descricao',  render: r => <span className="font-medium">{r.description}</span> },
    { key: 'bankAccountName', header: 'Conta' },
    { key: 'type',            header: 'Tipo',       render: r => typeLabel[r.type] ?? r.type },
    { key: 'amount',          header: 'Valor',      render: r => <span className={r.type === 'Expense' ? 'text-red-600 font-medium' : 'text-green-600 font-medium'}>{formatCurrency(r.amount)}</span> },
    { key: 'status',          header: 'Status',     render: r => <TransactionStatusBadge status={r.status} /> },
    { key: 'actions',         header: '', render: r => (
      <div className="flex items-center justify-end gap-1">
        {r.status === 'Pending' && <Button size="sm" variant="ghost" onClick={async () => { try { await confirm(r.id); success('Confirmado!') } catch { notifyError('Erro.') } }}>Confirmar</Button>}
        {r.status === 'Pending' && <Button size="sm" variant="ghost" onClick={() => { setTarget(r); setCancelOpen(true) }} className="text-red-500 hover:bg-red-50">Cancelar</Button>}
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Transacoes" subtitle={`${totalCount} transacao${totalCount !== 1 ? 'es' : ''}`} />
      <div className="flex gap-3">
        <div className="flex-1 max-w-xs"><Input placeholder="Buscar..." value={search} onChange={e => handleSearch(e.target.value)} /></div>
        <Button onClick={() => setNewOpen(true)}>+ Nova transacao</Button>
      </div>
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhuma transacao encontrada." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Nova transacao" size="md">
        <TransactionForm isSaving={isSaving} onCancel={() => setNewOpen(false)} onSubmit={async d => { try { await create(d); success('Transacao registrada!'); setNewOpen(false); fetch({ search }) } catch { notifyError('Erro.') } }} />
      </Modal>
      <ConfirmModal isOpen={cancelOpen} onClose={() => setCancelOpen(false)} onConfirm={async () => { try { await cancel(target!.id, 'Cancelado'); success('Cancelado.'); setCancelOpen(false) } catch { notifyError('Erro.') } }} title="Cancelar transacao" message={`Cancelar transacao "${target?.description}"?`} confirmLabel="Cancelar" isLoading={isSaving} />
    </div>
  )
}