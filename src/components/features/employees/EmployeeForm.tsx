import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { employeeSchema, type EmployeeFormData } from '../../../schemas/employee.schema'
import { Input } from '../../ui/Input/Input'
import { Select } from '../../ui/Select/Select'
import { Button } from '../../ui/Button/Button'
import { CurrencyInput } from '../../ui/CurrencyInput/CurrencyInput'
import { DatePicker } from '../../ui/DatePicker/DatePicker'
import type { Employee, Department } from '../../../types/domain.types'

interface Props { initial?: Employee; departments: Department[]; onSubmit: (d: EmployeeFormData) => Promise<void>; onCancel: () => void; isSaving: boolean }

export function EmployeeForm({ initial, departments, onSubmit, onCancel, isSaving }: Props) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<EmployeeFormData>({ resolver: zodResolver(employeeSchema) })
  const salary = watch('salary')
  const deptOptions = departments.map((d) => ({ value: d.id, label: d.name }))

  useEffect(() => {
    if (initial) reset({ name: initial.name, email: initial.email, cpf: initial.cpf, position: initial.position, departmentId: initial.departmentId, salary: initial.salary, hireDate: initial.hireDate?.split('T')[0] ?? '', bankName: initial.bankName ?? '', bankAgency: initial.bankAgency ?? '', bankAccountNumber: initial.bankAccountNumber ?? '' })
  }, [initial, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Nome completo" required error={errors.name?.message} {...register('name')} />
        <Input label="E-mail" type="email" required error={errors.email?.message} {...register('email')} />
        <Input label="CPF (somente numeros)" required maxLength={11} error={errors.cpf?.message} disabled={!!initial} {...register('cpf')} />
        <Input label="Cargo" required error={errors.position?.message} {...register('position')} />
        <Select label="Departamento" required options={deptOptions} placeholder="Selecione..." error={errors.departmentId?.message} {...register('departmentId')} />
        <CurrencyInput label="Salario" required value={salary} onChange={(v) => setValue('salary', v, { shouldValidate: true })} error={errors.salary?.message} />
        <DatePicker label="Data de admissao" required error={errors.hireDate?.message} {...register('hireDate')} />
      </div>

      <p className="text-xs font-semibold uppercase tracking-wide text-slate-400">Dados bancarios (opcional)</p>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Input label="Banco" {...register('bankName')} />
        <Input label="Agencia" {...register('bankAgency')} />
        <Input label="Conta" {...register('bankAccountNumber')} />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>{initial ? 'Salvar alteracoes' : 'Cadastrar funcionario'}</Button>
      </div>
    </form>
  )
}