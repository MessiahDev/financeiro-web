import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { chartOfAccountSchema, type ChartOfAccountFormData } from '../../../schemas/chartOfAccount.schema'
import { useChartOfAccounts } from '../../../hooks/useChartOfAccounts'
import type { ChartOfAccount } from '../../../types/domain.types'

interface Props {
  initialData?: ChartOfAccount | null
  onSuccess:   () => void
  onCancel:    () => void
}

export function ChartOfAccountForm({ initialData, onSuccess, onCancel }: Props) {
  const { create, update, isSaving, error } = useChartOfAccounts()

  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: zodResolver(chartOfAccountSchema),
    defaultValues: initialData
      ? {
          code:          initialData.code,
          name:          initialData.name,
          description:   initialData.description ?? '',
          accountType:   initialData.accountType  as ChartOfAccountFormData['accountType'],
          accountNature: initialData.accountNature as ChartOfAccountFormData['accountNature'],
          parentId:      initialData.parentAccountId ?? '',
          acceptsEntries: initialData.acceptsEntries,
        }
      : { acceptsEntries: true },
  })

  async function onSubmit(data: ChartOfAccountFormData) {
    try {
      if (initialData) {
        await update(initialData.id, data)
      } else {
        await create(data)
      }
      onSuccess()
    } catch { /* erro gerenciado pelo hook */ }
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4" noValidate>
      {error && (
        <div className="rounded-md bg-red-50 border border-red-200 px-4 py-3 text-sm text-red-700">{error}</div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Field label="Código" error={errors.code?.message}>
          <input type="text" className={inputCls} {...register('code')} disabled={isSaving} />
        </Field>
        <Field label="Nome" error={errors.name?.message}>
          <input type="text" className={inputCls} {...register('name')} disabled={isSaving} />
        </Field>
      </div>

      <Field label="Descrição" error={errors.description?.message}>
        <input type="text" className={inputCls} {...register('description')} disabled={isSaving} />
      </Field>

      <div className="grid grid-cols-2 gap-4">
        <Field label="Tipo de conta" error={errors.accountType?.message}>
          <select className={inputCls} {...register('accountType')} disabled={isSaving}>
            <option value="">Selecione…</option>
            <option value="Asset">Ativo</option>
            <option value="Liability">Passivo</option>
            <option value="Equity">Patrimônio Líquido</option>
            <option value="Revenue">Receita</option>
            <option value="Expense">Despesa</option>
            <option value="CostOfGoods">Custo de Mercadorias</option>
          </select>
        </Field>
        <Field label="Natureza" error={errors.accountNature?.message}>
          <select className={inputCls} {...register('accountNature')} disabled={isSaving}>
            <option value="">Selecione…</option>
            <option value="Debit">Devedora</option>
            <option value="Credit">Credora</option>
          </select>
        </Field>
      </div>

      <Field label="Conta pai (opcional — ID UUID)" error={errors.parentId?.message}>
        <input type="text" placeholder="Deixe em branco para conta raiz" className={inputCls} {...register('parentId')} disabled={isSaving} />
      </Field>

      <div className="flex items-center gap-2">
        <input type="checkbox" id="acceptsEntries" className="h-4 w-4 rounded border-gray-300 text-blue-600" {...register('acceptsEntries')} disabled={isSaving} />
        <label htmlFor="acceptsEntries" className="text-sm font-medium text-gray-700">Aceita lançamentos</label>
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} disabled={isSaving}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Cancelar
        </button>
        <button type="submit" disabled={isSaving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors">
          {isSaving ? 'Salvando…' : initialData ? 'Salvar alterações' : 'Criar conta'}
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