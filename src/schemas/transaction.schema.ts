import { z } from 'zod'

export const transactionSchema = z.object({
  bankAccountId:    z.uuid({ message: 'Conta bancária obrigatória' }),
  type:             z.enum(['Income', 'Expense', 'Transfer'], { message: 'Tipo obrigatório' }),
  amount:           z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  description:      z.string().min(2, 'Descrição obrigatória').max(300),
  transactionDate:  z.uuid({ message: 'Data obrigatória' }),
  costCenterId:     z.union([z.uuid(), z.literal('')]).optional(),
  chartOfAccountId: z.union([z.uuid(), z.literal('')]).optional(),
})

export type TransactionFormData = z.infer<typeof transactionSchema>
