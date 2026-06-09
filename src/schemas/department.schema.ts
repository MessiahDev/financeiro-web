import { z } from 'zod'

export const departmentSchema = z.object({
  name:        z.string().min(2, 'Nome obrigatório').max(150),
  costCenter:  z.string().min(1, 'Centro de custo obrigatório'),
  description: z.string().max(300).optional(),
})

export type DepartmentFormData = z.infer<typeof departmentSchema>