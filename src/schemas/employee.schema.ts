import { z } from 'zod'

export const employeeSchema = z.object({
  firstName:    z.string().min(2, 'Nome obrigatório').max(75),
  lastName:     z.string().min(2, 'Sobrenome obrigatório').max(75),
  email:        z.email('E-mail inválido'),
  cpf:          z.string().length(11, 'CPF deve ter 11 dígitos').regex(/^\d+$/, 'Apenas números'),
  position:     z.string({ message: 'Cargo obrigatório' }),
  departmentId: z.uuid({ message: 'Departamento obrigatório' }),
  salary:       z.number().min(0.01, 'Salário deve ser maior que zero'),
  hireDate:     z.string().min(1, 'Data de admissão obrigatória'),
  contractType: z.string({ message: 'Tipo de contrato obrigatório' }),
})

export const updateSalarySchema = z.object({
  newSalary:     z.number().min(0.01, 'Salário deve ser maior que zero'),
  effectiveDate: z.string().min(1, 'Data obrigatória'),
  reason:        z.string().max(300).optional(),
})

export type EmployeeFormData     = z.infer<typeof employeeSchema>
export type UpdateSalaryFormData = z.infer<typeof updateSalarySchema>