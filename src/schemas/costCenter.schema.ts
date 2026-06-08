import { z } from 'zod'

export const costCenterSchema = z.object({
  code:        z.string().min(1, 'Código obrigatório').max(20),
  name:        z.string().min(2, 'Nome obrigatório').max(150),
  description: z.string().max(300).optional(),
})

export type CostCenterFormData = z.infer<typeof costCenterSchema>
