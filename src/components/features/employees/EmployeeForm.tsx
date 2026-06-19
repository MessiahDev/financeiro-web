import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { employeeSchema, type EmployeeFormData } from '../../../schemas/employee.schema'
import { Input } from '../../ui/Input/Input'
import { Select } from '../../ui/Select/Select'
import { Button } from '../../ui/Button/Button'
import { CurrencyInput } from '../../ui/CurrencyInput/CurrencyInput'
import { DatePicker } from '../../ui/DatePicker/DatePicker'
import { ContractType, Position } from '../../../types/enums'
import type { Employee, Department } from '../../../types/domain.types'

interface Props {
  initial?: Employee
  departments: Department[]
  onSubmit: (d: EmployeeFormData) => Promise<void>
  onCancel: () => void
  isSaving: boolean
}

const contractTypeOptions = [
  { value: ContractType.CLT,        label: 'CLT'        },
  { value: ContractType.PJ,         label: 'PJ'         },
  { value: ContractType.Internship, label: 'Estágio'    },
  { value: ContractType.Temporary,  label: 'Temporário' },
]

const positionOptions = [
  { value: Position.Estagiario,           label: 'Estagiário'             },
  { value: Position.DesenvolvedorJunior,  label: 'Desenvolvedor Junior'   },
  { value: Position.DesenvolvedorPleno,   label: 'Desenvolvedor Pleno'    },
  { value: Position.DesenvolvedorSenior,  label: 'Desenvolvedor Sênior'   },
  { value: Position.LiderTecnico,         label: 'Líder Técnico'          },
  { value: Position.Gerente,              label: 'Gerente'                },
  { value: Position.Diretor,              label: 'Diretor'                },
  { value: Position.CEO,                  label: 'CEO'                    },
  { value: Position.Analista,             label: 'Analista'               },
  { value: Position.Coordenador,          label: 'Coordenador'            },
  { value: Position.Supervisor,           label: 'Supervisor'             },
  { value: Position.RecursosHumanos,      label: 'Recursos Humanos'       },
  { value: Position.Contador,             label: 'Contador'               },
  { value: Position.Vendedor,             label: 'Vendedor'               },
  { value: Position.AtendimentoAoCliente, label: 'Atendimento ao Cliente' },
]

export function EmployeeForm({ initial, departments, onSubmit, onCancel, isSaving }: Props) {
  const { register, handleSubmit, reset, setValue, watch, formState: { errors } } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
  })

  const salary = watch('salary')

  const deptOptions = departments.map(d => ({ value: d.id, label: d.name }))

  useEffect(() => {
    if (initial) reset({
      firstName:    initial.firstName,
      lastName:     initial.lastName,
      email:        initial.email,
      cpf:          initial.cpf,
      position:     initial.position,
      departmentId: initial.departmentId,
      salary:       initial.salary,
      contractType: initial.contractType,
      hireDate:     initial.hireDate?.split('T')[0] ?? '',
    })
  }, [initial, reset])

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Input label="Nome"      required error={errors.firstName?.message} {...register('firstName')} />
        <Input label="Sobrenome" required error={errors.lastName?.message}  {...register('lastName')} />
        <Input label="E-mail" type="email" required error={errors.email?.message} {...register('email')} />
        <Input label="CPF (somente números)" required maxLength={11} error={errors.cpf?.message} disabled={!!initial} {...register('cpf')} />
        <Select
          label="Cargo" required
          options={positionOptions}
          placeholder="Selecione..."
          error={errors.position?.message}
          {...register('position')}
        />
        <Select
          label="Tipo de contrato" required
          options={contractTypeOptions}
          placeholder="Selecione..."
          error={errors.contractType?.message}
          {...register('contractType')}
        />
        <Select
          label="Departamento" required
          options={deptOptions}
          placeholder="Selecione..."
          error={errors.departmentId?.message}
          {...register('departmentId')}
        />
        <CurrencyInput
          label="Salário" required
          value={salary}
          onChange={v => setValue('salary', v, { shouldValidate: true })}
          error={errors.salary?.message}
        />
        <DatePicker
          label="Data de admissão" required
          error={errors.hireDate?.message}
          {...register('hireDate')}
        />
      </div>
      <div className="flex justify-end gap-3 pt-2">
        <Button type="button" variant="secondary" onClick={onCancel} disabled={isSaving}>Cancelar</Button>
        <Button type="submit" isLoading={isSaving}>{initial ? 'Salvar alterações' : 'Cadastrar funcionário'}</Button>
      </div>
    </form>
  )
}