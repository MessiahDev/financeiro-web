import { z } from 'zod'

export const employeeSchema = z.object({
  name:               z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(150),
  email:              z.string().min(1, 'E-mail obrigatorio').email('E-mail invalido'),
  cpf:                z.string().length(11, 'CPF deve ter 11 digitos').regex(/^\d+$/, 'Apenas numeros'),
  position:           z.string().min(2, 'Cargo obrigatorio').max(100),
  departmentId:       z.string().uuid('Departamento obrigatorio'),
  salary:             z.coerce.number().min(0.01, 'Salario deve ser maior que zero'),
  hireDate:           z.string().min(1, 'Data de admissao obrigatoria'),
  bankName:           z.string().optional(),
  bankAgency:         z.string().optional(),
  bankAccountNumber:  z.string().optional(),
})

export const updateSalarySchema = z.object({
  newSalary:     z.coerce.number().min(0.01, 'Salario deve ser maior que zero'),
  effectiveDate: z.string().min(1, 'Data obrigatoria'),
  reason:        z.string().max(300).optional(),
})

export type EmployeeFormData    = z.infer<typeof employeeSchema>
export type UpdateSalaryFormData = z.infer<typeof updateSalarySchema>