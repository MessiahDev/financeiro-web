import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { bankReconciliationSchema, type BankReconciliationFormData } from '../../../schemas/bankReconciliation.schema'
import { useBankReconciliations } from '../../../hooks/useBankReconciliations'
import { useBankAccounts } from '../../../hooks/useBankAccounts'
import { useBankStatements } from '../../../hooks/useBankStatements'
import type { BankReconciliation } from '../../../types/domain.types'

interface Props {
  initialData?: BankReconciliation | null
  onSuccess:   () => void
  onCancel:    () => void
}

export function BankReconciliationForm({ initialData, onSuccess, onCancel }: Props) {
  const { create, isSaving, error }               = useBankReconciliations()
  const { items: accounts,   fetchAll: fetchAccounts   } = useBankAccounts()
  const { items: statements, fetchAll: fetchStatements } = useBankStatements()

  useEffect(() => { fetchAccounts()   }, [fetchAccounts])
  useEffect(() => { fetchStatements() }, [fetchStatements])

  const { register, handleSubmit, formState: { errors } } = useForm<BankReconciliationFormData>({
    resolver: zodResolver(bankReconciliationSchema),
    defaultValues: initialData
      ? {
          bankAccountId:   initialData.bankAccountId,
          bankStatementId: initialData.bankStatementId,
          systemBalance:   initialData.systemBalance,
          notes:           initialData.notes,
        }
      : undefined,
  })

  async function onSubmit(data: BankReconciliationFormData) {
    try {
      await create(data)
      onSuccess()
    } catch { /* erro gerenciado pelo hook */ }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <Field label="Conta bancária" error={errors.bankAccountId?.message}>
        <select className={inputCls} {...register('bankAccountId')} disabled={isSaving}>
          <option value="">Selecione…</option>
          {accounts.map((a) => (
            <option key={a.id} value={a.id}>{a.bankName} — {a.accountNumber}</option>
          ))}
        </select>
      </Field>

      <Field label="Extrato bancário" error={errors.bankStatementId?.message}>
        <select className={inputCls} {...register('bankStatementId')} disabled={isSaving}>
          <option value="">Selecione…</option>
          {statements.map((s) => (
            <option key={s.id} value={s.id}>{s.bankAccountName} — {s.periodStart} até {s.periodEnd}</option>
          ))}
        </select>
      </Field>

      <Field label="Saldo do sistema" error={errors.systemBalance?.message}>
        <input
          type="number"
          step="0.01"
          className={inputCls}
          {...register('systemBalance', { valueAsNumber: true })}
          disabled={isSaving}
        />
      </Field>

      <Field label="Observações" error={errors.notes?.message}>
        <textarea className={inputCls} rows={3} {...register('notes')} disabled={isSaving} />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} disabled={isSaving}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Cancelar
        </button>
        <button type="submit" disabled={isSaving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors">
          {isSaving ? 'Salvando…' : 'Iniciar Conciliação'}
        </button>
      </div>
    </form>
  )
}

const inputCls =
  'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm ' +
  'focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 ' +
  'disabled:bg-gray-50 disabled:text-gray-500'

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  )
}