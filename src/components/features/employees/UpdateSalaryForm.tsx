import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { updateSalarySchema, type UpdateSalaryFormData } from '../../../schemas/employee.schema'
import { CurrencyInput } from '../../ui/CurrencyInput/CurrencyInput'
import { DatePicker } from '../../ui/DatePicker/DatePicker'
import { Input } from '../../ui/Input/Input'
import { Button } from '../../ui/Button/Button'

interface Props { onSubmit: (d: UpdateSalaryFormData) => Promise<void>; onCancel: () => void; isSaving: boolean; currentSalary: number }

export function UpdateSalaryForm({ onSubmit, onCancel, isSaving, currentSalary }: Props) {
  const { register, handleSubmit, setValue, watch, formState: { errors } } = useForm<UpdateSalaryFormData>({ resolver: zodResolver(updateSalarySchema), defaultValues: { newSalary: currentSalary } })
  const salary = watch('newSalary')
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <CurrencyInput label="Novo salario" required value={salary} onChange={(v) => setValue('newSalary', v, { shouldValidate: true })} error={errors.newSalary?.message} />
      <DatePicker label="Data de vigencia" required error={errors.effectiveDate?.message} {...register('effectiveDate')} />
      <Input label="Motivo" error={errors.reason?.message} {...register('reason')} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>Atualizar salario</Button>
      </div>
    </form>
  )
}