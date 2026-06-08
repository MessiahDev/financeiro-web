import { z } from 'zod'

export const budgetItemSchema = z.object({
  chartOfAccountId: z.uuid({ message: 'Conta contábil obrigatória' }),
  costCenterId: z.uuid().optional().or(z.literal('')),
  plannedAmount:    z.coerce.number().min(0.01, 'Valor planejado deve ser maior que zero'),
})

export const budgetSchema = z.object({
  name:       z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(150),
  fiscalYear: z.coerce.number().int().min(2000).max(2100),
  startDate:  z.string().min(1, 'Data inicial obrigatória'),
  endDate:    z.string().min(1, 'Data final obrigatória'),
  items:      z.array(budgetItemSchema).min(1, 'Adicione ao menos um item ao orçamento'),
}).refine((d) => d.startDate <= d.endDate, {
  message: 'Data inicial deve ser anterior à data final',
  path: ['endDate'],
})

export type BudgetFormData     = z.infer<typeof budgetSchema>
export type BudgetItemFormData = z.infer<typeof budgetItemSchema>
