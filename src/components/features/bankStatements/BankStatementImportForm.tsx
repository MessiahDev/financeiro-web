import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { importBankStatementSchema, type ImportBankStatementFormData } from '../../../schemas/bankStatement.schema'
import { useBankStatements } from '../../../hooks/useBankStatements'
import { useBankAccounts } from '../../../hooks/useBankAccounts'

interface Props {
  onSuccess: () => void
  onCancel:  () => void
}

export function BankStatementImportForm({ onSuccess, onCancel }: Props) {
  const { importStatement, isSaving, error } = useBankStatements()
  const { items: accounts, fetchAll: fetchAccounts } = useBankAccounts()

  useEffect(() => { fetchAccounts() }, [fetchAccounts])

  const { register, handleSubmit, formState: { errors } } = useForm<ImportBankStatementFormData>({
    resolver: zodResolver(importBankStatementSchema),
  })

  async function onSubmit(data: ImportBankStatementFormData) {
    try {
      await importStatement({ ...data, entries: [] })
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

      <Field label="Data do extrato" error={errors.statementDate?.message}>
        <input type="date" className={inputCls} {...register('statementDate')} disabled={isSaving} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Início do período" error={errors.periodStart?.message}>
          <input type="date" className={inputCls} {...register('periodStart')} disabled={isSaving} />
        </Field>
        <Field label="Fim do período" error={errors.periodEnd?.message}>
          <input type="date" className={inputCls} {...register('periodEnd')} disabled={isSaving} />
        </Field>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Saldo inicial" error={errors.openingBalance?.message}>
          <input type="number" step="0.01" className={inputCls}
            {...register('openingBalance', { valueAsNumber: true })} disabled={isSaving} />
        </Field>
        <Field label="Saldo final" error={errors.closingBalance?.message}>
          <input type="number" step="0.01" className={inputCls}
            {...register('closingBalance', { valueAsNumber: true })} disabled={isSaving} />
        </Field>
      </div>

      <Field label="Nome do arquivo" error={errors.fileName?.message}>
        <input type="text" className={inputCls} {...register('fileName')} disabled={isSaving} />
      </Field>

      <Field label="Observações" error={errors.notes?.message}>
        <textarea className={inputCls} rows={2} {...register('notes')} disabled={isSaving} />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} disabled={isSaving}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Cancelar
        </button>
        <button type="submit" disabled={isSaving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors">
          {isSaving ? 'Importando…' : 'Importar Extrato'}
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