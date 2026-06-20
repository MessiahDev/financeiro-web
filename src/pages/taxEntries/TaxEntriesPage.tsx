import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
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
import { TaxEntryStatus, TaxType } from '../../types/enums'
import { ROUTES } from '../../router/routes'
import { bankAccountsService } from '../../services/bankAccounts.service'
import type { TaxEntry, CreateTaxEntryRequest, BankAccount } from '../../types/domain.types'
import type { PagedResult } from '../../types/pagination.types'

const taxTypeOptions = [
  { value: String(TaxType.IRPJ),   label: 'IRPJ'   },
  { value: String(TaxType.CSLL),   label: 'CSLL'   },
  { value: String(TaxType.PIS),    label: 'PIS'     },
  { value: String(TaxType.COFINS), label: 'COFINS' },
  { value: String(TaxType.ISS),    label: 'ISS'     },
  { value: String(TaxType.ICMS),   label: 'ICMS'   },
  { value: String(TaxType.IPI),    label: 'IPI'     },
  { value: String(TaxType.Other),  label: 'Outro'  },
]

const taxTypeLabel: Record<string, string> = {
  ICMS:   'ICMS',
  ISS:    'ISS',
  PIS:    'PIS',
  COFINS: 'COFINS',
  CSLL:   'CSLL',
  IRPJ:   'IRPJ',
  IPI:    'IPI',
  IOF:    'IOF',
  INSS:   'INSS',
  FGTS:   'FGTS',
  Other:  'Outro',
}

function TaxEntryForm({ onSubmit, onCancel, isSaving }: { onSubmit: (d: TaxEntryFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TaxEntryFormData>({ resolver: zodResolver(taxEntrySchema) })
  const baseAmount = watch('baseAmount')
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <Select label="Tipo de tributo" required options={taxTypeOptions} placeholder="Selecione..."
        error={errors.taxType?.message} {...register('taxType', { valueAsNumber: true })} />
      <Input label="Descrição" required error={errors.description?.message} {...register('description')} />
      <CurrencyInput label="Base de cálculo" required
        value={baseAmount}
        onChange={v => setValue('baseAmount', v, { shouldValidate: true })}
        error={errors.baseAmount?.message} />
      <Input label="Taxa (%)" type="number" step="0.01" required
        error={errors.rate?.message} {...register('rate', { valueAsNumber: true })} />
      <div className="grid grid-cols-2 gap-4">
        <DatePicker label="Competência" required error={errors.competence?.message} {...register('competence')} />
        <DatePicker label="Vencimento"  required error={errors.dueDate?.message}    {...register('dueDate')} />
      </div>
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>Cadastrar obrigação</Button>
      </div>
    </form>
  )
}

function TaxPaymentForm({ entry, onSubmit, onCancel, isSaving }: { entry: TaxEntry; onSubmit: (d: TaxPaymentFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<TaxPaymentFormData>({ resolver: zodResolver(taxPaymentSchema), defaultValues: { amount: entry.taxAmount } })
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
      <p className="text-sm text-slate-500 dark:text-slate-400">Tributo: <strong>{taxTypeLabel[entry.taxType] ?? entry.taxType} — {formatCurrency(entry.taxAmount)}</strong></p>
      <CurrencyInput label="Valor pago" required
        value={amount}
        onChange={v => setValue('amount', v, { shouldValidate: true })}
        error={errors.amount?.message} />
      <DatePicker label="Data do pagamento" required error={errors.paymentDate?.message} {...register('paymentDate')} />
      <Select
        label="Conta Bancária"
        required
        options={bankAccountOptions}
        placeholder={isLoadingAccounts ? 'Carregando...' : 'Selecione...'}
        disabled={isLoadingAccounts}
        error={errors.bankAccountId?.message}
        {...register('bankAccountId')}
      />
      <Input label="Código do recibo" error={errors.receiptCode?.message} {...register('receiptCode')} />
      <div className="flex justify-end gap-3">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>Registrar pagamento</Button>
      </div>
    </form>
  )
}

export default function TaxEntriesPage() {
  const navigate = useNavigate()
  const { success, error: notifyError } = useNotifications()
  const { items, isLoading, isSaving, page, pageSize, totalCount, totalPages, setPage, fetchAll, create, cancel, pay } = useTaxEntries()
  const [newOpen, setNewOpen]           = useState(false)
  const [payOpen, setPayOpen]           = useState(false)
  const [cancelTarget, setCancelTarget] = useState<TaxEntry | null>(null)
  const [payTarget, setPayTarget]       = useState<TaxEntry | null>(null)

  const pagedData: PagedResult<TaxEntry> = { items, totalCount, pageNumber: page, pageSize, totalPages, hasPreviousPage: page > 1, hasNextPage: page < totalPages }
  useEffect(() => { fetchAll() }, [page])

  const columns: Column<TaxEntry>[] = [
    { key: 'taxType',     header: 'Tributo',     render: r => <span className="font-mono text-xs bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded">{taxTypeLabel[r.taxType] ?? r.taxType}</span> },
    { key: 'description', header: 'Descrição',   render: r => <span className="font-medium">{r.description}</span> },
    { key: 'competence',  header: 'Competência', render: r => formatDate(r.competence) },
    { key: 'dueDate',     header: 'Vencimento',  render: r => formatDate(r.dueDate) },
    { key: 'taxAmount',   header: 'Valor',       render: r => formatCurrency(r.taxAmount) },
    { key: 'status',      header: 'Status',      render: r => <TaxEntryStatusBadge status={r.status} /> },
    { key: 'actions',     header: '', headerClassName: 'w-52', render: r => (
      <div className="flex justify-end gap-1">
        <Button size="sm" variant="ghost" onClick={() => navigate(`${ROUTES.TAX_ENTRIES}/${r.id}`)}>Ver</Button>
        {(r.status === TaxEntryStatus.Pending || r.status === TaxEntryStatus.Calculated) && <Button size="sm" variant="ghost" onClick={() => { setPayTarget(r); setPayOpen(true) }}>Pagar</Button>}
        {r.status !== TaxEntryStatus.Cancelled && r.status !== TaxEntryStatus.Paid && <Button size="sm" variant="ghost" onClick={() => setCancelTarget(r)} className="text-red-500 hover:bg-red-50">Cancelar</Button>}
      </div>
    )},
  ]

  return (
    <div className="flex flex-col gap-6">
      <PageHeader title="Obrigações Fiscais" subtitle={`${totalCount} obrigaç${totalCount !== 1 ? 'ões' : 'ão'}`}
        actions={<Button onClick={() => setNewOpen(true)}>+ Nova obrigação</Button>} />
      <Table columns={columns} data={items} keyExtractor={r => r.id} isLoading={isLoading} emptyMessage="Nenhuma obrigação cadastrada." />
      {pagedData.totalPages > 1 && <TablePagination pagination={pagedData} onPageChange={setPage} />}
      <Modal isOpen={newOpen} onClose={() => setNewOpen(false)} title="Nova obrigação fiscal" size="md">
        <TaxEntryForm isSaving={isSaving} onCancel={() => setNewOpen(false)}
          onSubmit={async d => { try { await create(d as unknown as CreateTaxEntryRequest); success('Obrigação cadastrada!'); setNewOpen(false); fetchAll() } catch { notifyError('Erro.') } }} />
      </Modal>
      <Modal isOpen={payOpen} onClose={() => { setPayOpen(false); setPayTarget(null) }} title={`Pagar — ${payTarget ? (taxTypeLabel[payTarget.taxType] ?? payTarget.taxType) : ''}`} size="sm">
        {payTarget && <TaxPaymentForm entry={payTarget} isSaving={isSaving} onCancel={() => { setPayOpen(false); setPayTarget(null) }}
          onSubmit={async d => { try { await pay(payTarget.id, { ...d, taxEntryId: payTarget.id }); success('Pagamento registrado!'); setPayOpen(false); setPayTarget(null) } catch { notifyError('Erro.') } }} />}
      </Modal>
      <ConfirmModal isOpen={!!cancelTarget} onClose={() => setCancelTarget(null)}
        onConfirm={async () => { try { await cancel(cancelTarget!.id, 'Cancelado pelo usuário'); success('Cancelado.'); setCancelTarget(null) } catch { notifyError('Erro.') } }}
        title="Cancelar obrigação" message={`Cancelar "${cancelTarget?.description}"?`} confirmLabel="Cancelar" isLoading={isSaving} />
    </div>
  )
}