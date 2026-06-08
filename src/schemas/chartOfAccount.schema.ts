import { z } from 'zod'

export const chartOfAccountSchema = z.object({
  code:         z.string().min(1, 'Código obrigatório').max(20),
  name:         z.string().min(2, 'Nome obrigatório').max(150),
  accountType:  z.enum(['Asset', 'Liability', 'Equity', 'Revenue', 'Expense'], { message: 'Tipo obrigatório' }),
  nature:       z.enum(['Debit', 'Credit'], { message: 'Natureza obrigatória' }),
  parentId:     z.string().uuid().optional().or(z.literal('')),
  isAnalytical: z.boolean().default(true),
})

export type ChartOfAccountFormData = z.infer<typeof chartOfAccountSchema>
