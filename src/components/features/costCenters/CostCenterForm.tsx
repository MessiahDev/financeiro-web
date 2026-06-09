import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { costCenterSchema, type CostCenterFormData } from '../../../schemas/costCenter.schema'
import { useCostCenters } from '../../../hooks/useCostCenters'
import type { CostCenter } from '../../../types/domain.types'

interface Props {
  initialData?: CostCenter | null
  onSuccess:   () => void
  onCancel:    () => void
}

export function CostCenterForm({ initialData, onSuccess, onCancel }: Props) {
  const { create, update, isSaving, error } = useCostCenters()

  const { register, handleSubmit, formState: { errors } } = useForm<CostCenterFormData>({
    resolver: zodResolver(costCenterSchema),
    defaultValues: initialData
      ? {
          code:        initialData.code,
          name:        initialData.name,
          description: initialData.description ?? '',
        }
      : undefined,
  })

  async function onSubmit(data: CostCenterFormData) {
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

      <Field label="Descrição (opcional)" error={errors.description?.message}>
        <textarea
          rows={3}
          className={inputCls + ' resize-none'}
          {...register('description')}
          disabled={isSaving}
        />
      </Field>

      <div className="flex justify-end gap-3 pt-2">
        <button type="button" onClick={onCancel} disabled={isSaving}
          className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50">
          Cancelar
        </button>
        <button type="submit" disabled={isSaving}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500 disabled:opacity-50 transition-colors">
          {isSaving ? 'Salvando…' : initialData ? 'Salvar alterações' : 'Criar'}
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