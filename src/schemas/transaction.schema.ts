import { z } from 'zod'
import { TransactionType, TransactionCategory } from '../types/enums'

export const transactionSchema = z.object({
  description:     z.string().min(2, 'Descrição obrigatória').max(300),
  amount:          z.number().min(0.01, 'Valor deve ser maior que zero'),
  type:            z.union([z.literal(TransactionType.Credit), z.literal(TransactionType.Debit)], { message: 'Tipo obrigatório' }),
  category:        z.union([
    z.literal(TransactionCategory.Salary),
    z.literal(TransactionCategory.Bonus),
    z.literal(TransactionCategory.Deduction),
    z.literal(TransactionCategory.Tax),
    z.literal(TransactionCategory.Benefit),
    z.literal(TransactionCategory.Reimbursement),
    z.literal(TransactionCategory.Other),
  ], { message: 'Categoria obrigatória' }),
  transactionDate: z.string().optional(),
  referenceNumber: z.string().optional(),
})

export type TransactionFormData = z.infer<typeof transactionSchema>