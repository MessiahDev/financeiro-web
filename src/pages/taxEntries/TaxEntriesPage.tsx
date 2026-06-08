import { useEffect, useState } from 'react'
import { PageHeader } from '../../components/layout/PageHeader/PageHeader'
import { Table, type Column } from '../../components/ui/Table/Table'
import { TablePagination } from '../../components/ui/Table/TablePagination'
import { Button } from '../../components/ui/Button/Button'
import { Modal } from '../../components/ui/Modal/Modal'
import { ConfirmModal } from '../../components/ui/Modal/ConfirmModal'
import { TaxEntryStatusBadge } from '../../components/features/taxEntries/TaxEntryStatusBadge'
import { useTaxEntries } from '../../hooks/useTaxEntries'
import { useNotifications } from '../../contexts/NotificationContext'
import { formatCurrency, formatDate } from '../../utils/formatters'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { taxEntrySchema, taxPaymentSchema, type TaxEntryFormData, type TaxPaymentFormData } from '../../schemas/taxEntry.schema'
import { Input } from '../../components/ui/Input/Input'
import { Select } from '../../components/ui/Select/Select'
import { DatePicker } from '../../components/ui/DatePicker/DatePicker'
import { CurrencyInput } from '../../components/ui/CurrencyInput/CurrencyInput'
import type { TaxEntry } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

const taxTypeOptions = ['IRPJ','CSLL','PIS','COFINS','ISS','ICMS','IPI','Other'].map(v => ({ value: v, label: v }))

function TaxEntryForm({ onSubmit, onCancel, isSaving }: { onSubmit: (d: TaxEntryFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm({ resolver: zodResolver(taxEntrySchema) })
  const amount = watch('amount')
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Select label="Tipo de tributo" required options={taxTypeOptions} placeholder="Selecione..." error={errors.taxType?.message} {...register('taxType')} />
      <Input label="Descricao" required error={errors.description?.message} {...register('description')} />
      <CurrencyInput label="Valor" required value={amount} onChange={v => setValue('amount', v, { shouldValidate: true })} error={errors.amount?.message} />
      <div className="grid grid-cols-2 gap-4">
        <DatePicker label="Competencia" required error={errors.competenceDate?.message} {...register('competenceDate')} />
        <DatePicker label="Vencimento" required error={errors.dueDate?.message} {...register('dueDate')} />
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>Cadastrar obrigacao</Button>
      </div>
    </form>
  )
}

function TaxPaymentForm({ entry, onSubmit, onCancel, isSaving }: { entry: TaxEntry; onSubmit: (d: TaxPaymentFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TaxPaymentFormData>({ resolver: zodResolver(taxPaymentSchema), defaultValues: { amount: entry.amount } })
  const amount = watch('amount')
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <p className="text-sm text-slate-500">Tributo: <strong>{entry.taxType} — {formatCurrency(entry.amount)}</strong></p>
      <CurrencyInput label="Valor pago" required value={amount} onChange={v => setValue('amount', v, { shouldValidate: true })} error={errors.amount?.message} />
      <DatePicker label="Data do pagamento" required error={errors.paymentDate?.message} {...register('paymentDate')} />
      <Input label="ID da Conta Bancaria" required error={errors.bankAccountId?.message} {...register('bankAccountId')} />
      <Input label="Numero do recibo" error={errors.receiptNumber?.message} {...register('receiptNumber')} />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>Registrar pagamento</Button>
      </div>
    </form>
  )
}

export default function TaxEntriesPage() {
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll, create, cancel, createPayment } = useTaxEntries()
  const [newOpen, setNewOpen] = useState(false)
  const [payOpen, setPayOpen] = useState(false)
  const [cancelTarget, setCancelTarget] = useState<TaxEntry | null>(null)
  const [payTarget, setPayTarget] = useState<TaxEntry | null>(null)

  const pagedData: PagedResult<TaxEntry> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetchAll() }, [page])

  const columns: Column<TaxEntry>[] = [
    { key: 'taxType',       header: 'Tributo',     render: r => <span className="font-mono text-xs bg-slate-100 px-2 py-0.5 rounded">{r.taxType}</span> },
    { key: 'description',   header: 'Descricao',   render: r => <span className="font-medium">{r.description}</span> },
    { key: 'competenceDate',header: 'Competencia', render: r => formatDate(r.competenceDate) },
    { key: 'dueDate',       header: 'Vencimento',  render: r => formatDate(r.dueDate) },
    { key: 'amount',        header: 'Valor',       render: r => formatCurrency(r.amount) },
    { key: 'paidAmount',    header: 'Pago',        render: r => r.paidAmount > 0 ? formatCurrency(r.paidAmount) : '-' },
    { key: 'status',        header: 'Status',      render: r => <TaxEntryStatusBadge status={r.status} /> },
    { key: 'actions',       header: '', render: r => (
      <div className="flex justify-end gap-1">
        {(r.status === 'Pending' || r.status === 'Overdue') && <Button size="sm" variant="ghost" onClick={() => { setPayTarget(r); setPayOpen(true) }}>Pagar</Button>}
        {r.status !== 'Cancelled' && r.status !== 'Paid' && <Button size="sm" variant="ghost" onClick={() => setCancelTarget(r)} className="text-red-500 hover:bg-red-50">Cancelar</Button>}
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Obrigacoes Fiscais" subtitle={`${totalCount} obrigacao${totalCount !== 1 ? 'es' : ''}`}
        actions={<Button onClick={() => setNewOpen(true)}>+ Nova obrigacao</Button>} />
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhuma obrigacao cadastrada." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Nova obrigacao fiscal" size="md">
        <TaxEntryForm isSaving={isSaving} onCancel={() => setNewOpen(false)} onSubmit={async d => { try { await create(d); success('Obrigacao cadastrada!'); setNewOpen(false); fetchAll() } catch { notifyError('Erro.') } }} />
      </Modal>
      <Modal isOpen={payOpen} onClose={() => { setPayOpen(false); setPayTarget(null) }} title={`Pagar — ${payTarget?.taxType}`} size="sm">
        {payTarget && <TaxPaymentForm entry={payTarget} isSaving={isSaving} onCancel={() => { setPayOpen(false); setPayTarget(null) }} onSubmit={async d => { try { await createPayment({ ...d, taxEntryId: payTarget.id }); success('Pagamento registrado!'); setPayOpen(false); setPayTarget(null) } catch { notifyError('Erro.') } }} />}
      </Modal>
      <ConfirmModal isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)}
        onConfirm={async () => { try { await cancel(cancelTarget!.id); success('Cancelado.'); setCancelTarget(null) } catch { notifyError('Erro.') } }}
        title="Cancelar obrigacao" message={`Cancelar "${cancelTarget?.description}"?`} confirmLabel="Cancelar" isLoading={isSaving} />
    </div>
  )
}
