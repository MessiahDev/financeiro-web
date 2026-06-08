import { z } from 'zod'
export const taxEntrySchema = z.object({
  taxType:        z.enum(['IRPJ','CSLL','PIS','COFINS','ISS','ICMS','IPI','Other']),
  description:    z.string().min(2, 'Descricao obrigatoria'),
  competenceDate: z.string().min(1, 'Data de competencia obrigatoria'),
  dueDate:        z.string().min(1, 'Data de vencimento obrigatoria'),
  amount:         z.number().min(0.01, 'Valor deve ser maior que zero'),
})
export const taxPaymentSchema = z.object({
  paymentDate:    z.string().min(1, 'Data obrigatoria'),
  amount:         z.number().min(0.01, 'Valor obrigatorio'),
  bankAccountId:  z.string().uuid('Conta bancaria obrigatoria'),
  receiptNumber:  z.string().optional(),
})
export type TaxEntryFormData   = z.infer<typeof taxEntrySchema>
export type TaxPaymentFormData = z.infer<typeof taxPaymentSchema>
