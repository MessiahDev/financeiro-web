import { z } from 'zod'

export const taxEntrySchema = z.object({
  taxType:     z.number().int().min(1, 'Tipo obrigatório'),
  description: z.string().min(2, 'Descrição obrigatória'),
  baseAmount:  z.number().min(0.01, 'Valor deve ser maior que zero'),
  rate:        z.number().min(0, 'Taxa obrigatória'),
  competence:  z.string().min(1, 'Competência obrigatória'),
  dueDate:     z.string().min(1, 'Vencimento obrigatório'),
})

export const taxPaymentSchema = z.object({
  paymentDate:   z.string().min(1, 'Data obrigatória'),
  amount:        z.number().min(0.01, 'Valor obrigatório'),
  bankAccountId: z.string().uuid('Conta bancária obrigatória'),
  receiptCode:   z.string().max(50).optional(),
})

export type TaxEntryFormData   = z.infer<typeof taxEntrySchema>
export type TaxPaymentFormData = z.infer<typeof taxPaymentSchema>