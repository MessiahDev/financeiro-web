import { z } from 'zod'

export const accountReceivableSchema = z.object({
  customerId:       z.uuid({ message: 'Cliente obrigatório' }),
  description:      z.string().min(2, 'Descrição obrigatória').max(300),
  amount:           z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  dueDate:          z.uuid({ message: 'Data de vencimento obrigatória' }),
  bankAccountId:    z.uuid().optional().or(z.literal('')),
  costCenterId:     z.uuid().optional().or(z.literal('')),
  chartOfAccountId: z.uuid().optional().or(z.literal('')),
})

export const receivePaymentSchema = z.object({
  receiptDate:   z.string().min(1, 'Data do recebimento obrigatória'),
  amount:        z.coerce.number().min(0.01, 'Valor obrigatório'),
  bankAccountId: z.uuid({ message: 'Conta bancária obrigatória' }),
})

export type AccountReceivableFormData = z.infer<typeof accountReceivableSchema>
export type ReceivePaymentFormData    = z.infer<typeof receivePaymentSchema>
