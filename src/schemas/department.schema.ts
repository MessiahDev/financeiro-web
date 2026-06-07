import { z } from 'zod'

export const departmentSchema = z.object({
  name:          z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100),
  code:          z.string().min(1, 'Codigo obrigatorio').max(20),
  managerId:     z.string().uuid('ID invalido').optional().or(z.literal('')),
  costCenterId:  z.string().uuid('ID invalido').optional().or(z.literal('')),
})

export type DepartmentFormData = z.infer<typeof departmentSchema>