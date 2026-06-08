import { z } from 'zod'
export const accountReceivableSchema = z.object({
  customerId:       z.string().uuid('Cliente obrigatorio'),
  description:      z.string().min(2, 'Descricao obrigatoria'),
  amount:           z.number().min(0.01, 'Valor deve ser maior que zero'),
  dueDate:          z.string().min(1, 'Data de vencimento obrigatoria'),
  bankAccountId:    z.uuid().optional().or(z.literal('')),
  costCenterId:     z.uuid().optional().or(z.literal('')),
  chartOfAccountId: z.uuid().optional().or(z.literal('')),
})
export const receivePaymentSchema = z.object({
  receiptDate:   z.string().min(1, 'Data de recebimento obrigatoria'),
  amount:        z.number().min(0.01, 'Valor obrigatorio'),
  bankAccountId: z.uuid('Conta bancaria obrigatoria'),
})
export type AccountReceivableFormData = z.infer<typeof accountReceivableSchema>
export type ReceivePaymentFormData    = z.infer<typeof receivePaymentSchema>
