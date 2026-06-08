import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useEffect } from 'react'
import { supplierSchema, type SupplierFormData } from '../../../schemas/supplier.schema'
import { Input } from '../../ui/Input/Input'
import { Select } from '../../ui/Select/Select'
import { Button } from '../../ui/Button/Button'
import type { Supplier } from '../../../types/domain.types'

interface Props { initial?: Supplier; onSubmit: (d: SupplierFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }
const personTypeOptions = [{ value: 'Individual', label: 'Pessoa Fisica' }, { value: 'Company', label: 'Pessoa Juridica' }]

export function SupplierForm({ initial, onSubmit, onCancel, isSaving }: Props) {
  const { register, handleSubmit, reset, formState: { errors } } = useForm<SupplierFormData>({ resolver: zodResolver(supplierSchema) })
  useEffect(() => { if (initial) reset({ name: initial.name, email: initial.email, phone: initial.phone ?? '', document: initial.document, personType: initial.personType as 'Individual' | 'Company', paymentTermDays: initial.paymentTermDays, notes: initial.notes ?? '' }) }, [initial, reset])
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Nome" required error={errors.name?.message} {...register('name')} />
        <Input label="E-mail" type="email" required error={errors.email?.message} {...register('email')} />
        <Input label="Telefone" error={errors.phone?.message} {...register('phone')} />
        <Input label="CPF / CNPJ" required error={errors.document?.message} {...register('document')} />
        <Select label="Tipo de pessoa" required options={personTypeOptions} placeholder="Selecione..." error={errors.personType?.message} {...register('personType')} />
        <Input label="Prazo de pagamento (dias)" type="number" min="0" error={errors.paymentTermDays?.message} {...register('paymentTermDays')} />
      </div>
      <Input label="Observacoes" error={errors.notes?.message} {...register('notes')} />
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>{initial ? 'Salvar alteracoes' : 'Cadastrar fornecedor'}</Button>
      </div>
    </form>
  )
}
