import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { customerSchema, type CustomerFormData } from '../../../schemas/customer.schema'
import { Input } from '../../ui/Input/Input'
import { Select } from '../../ui/Select/Select'
import { Button } from '../../ui/Button/Button'
import type { Customer } from '../../../types/domain.types'

interface CustomerFormProps {
  initial?:   Customer
  onSubmit:   (data: CustomerFormData) => Promise<void>
  onCancel:   () => void
  isSaving:   boolean
}

const personTypeOptions = [
  { value: '1', label: 'Pessoa Física' },
  { value: '2', label: 'Pessoa Jurídica' },
]

export function CustomerForm({ initial, onSubmit, onCancel, isSaving }: CustomerFormProps) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<CustomerFormData>({
    resolver: zodResolver(customerSchema),
  })

  useEffect(() => {
    if (initial) {
      reset({
        name:        initial.name,
        email:       initial.email,
        phone:       initial.phone ?? '',
        taxId:       initial.taxId,
        personType:  initial.personType,
        creditLimit: initial.creditLimit,
      })
    }
  }, [initial, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Nome"    required error={errors.name?.message}  {...register('name')} />
        <Input label="E-mail" type="email" required error={errors.email?.message} {...register('email')} />
        <Input label="Telefone" error={errors.phone?.message}         {...register('phone')} />
        <Input label="CPF / CNPJ" required error={errors.taxId?.message} {...register('taxId')} />
        <Select
          label="Tipo de pessoa"
          required
          options={personTypeOptions}
          placeholder="Selecione..."
          error={errors.personType?.message}
          {...register('personType', { valueAsNumber: true })}
        />
        <Input
          label="Limite de crédito (R$)"
          type="number"
          step="0.01"
          min="0"
          error={errors.creditLimit?.message}
          {...register('creditLimit', { valueAsNumber: true })}
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>
          Cancelar
        </Button>
        <Button type="submit" isLoading={isSaving}>
          {initial ? 'Salvar alterações' : 'Cadastrar cliente'}
        </Button>
      </div>
    </form>
  )
}