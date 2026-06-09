import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { departmentSchema, type DepartmentFormData } from '../../../schemas/department.schema'
import { Input } from '../../ui/Input/Input'
import { Button } from '../../ui/Button/Button'
import type { Department } from '../../../types/domain.types'

interface Props { initial?: Department; onSubmit: (d: DepartmentFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }

export function DepartmentForm({ initial, onSubmit, onCancel, isSaving }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<DepartmentFormData>({ resolver: zodResolver(departmentSchema) })

  useEffect(() => {
    if (initial) reset({
      name:        initial.name,
      costCenter:  initial.costCenter,
      description: initial.description ?? '',
    })
  }, [initial, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Nome"            required error={errors.name?.message}       {...register('name')} />
        <Input label="Centro de Custo" required error={errors.costCenter?.message} {...register('costCenter')} />
      </div>
      <Input label="Descrição" error={errors.description?.message} {...register('description')} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>{initial ? 'Salvar alterações' : 'Criar departamento'}</Button>
      </div>
    </form>
  )
}