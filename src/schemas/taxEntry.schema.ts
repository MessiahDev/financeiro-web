import { z } from 'zod'

export const taxEntrySchema = z.object({
  taxType:      z.number().int().min(1, 'Tipo obrigatório'),
  description:  z.string().min(2, 'Descrição obrigatória'),
  baseAmount:   z.number().min(0.01, 'Valor deve ser maior que zero'),
  rate:         z.number().min(0).max(100, 'Taxa deve estar entre 0 e 100'),
  competence:   z.string().min(1, 'Competência obrigatória'),
  dueDate:      z.string().min(1, 'Vencimento obrigatório'),
  costCenterId: z.string().uuid().optional().or(z.literal('')),
})

export const taxPaymentSchema = z.object({
  paymentDate:   z.string().min(1, 'Data obrigatória'),
  amount:        z.number().min(0.01, 'Valor obrigatório'),
  bankAccountId: z.string().uuid('Conta bancária obrigatória'),
  fine:          z.number().min(0).optional(),
  interest:      z.number().min(0).optional(),
  darfNumber:    z.string().max(50).optional(),
  receiptCode:   z.string().max(50).optional(),
})

export type TaxEntryFormData   = z.infer<typeof taxEntrySchema>
export type TaxPaymentFormData = z.infer<typeof taxPaymentSchema>