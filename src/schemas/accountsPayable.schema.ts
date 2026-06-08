import { z } from 'zod'

export const accountPayableSchema = z.object({
  supplierId:       z.uuid({ message: 'Fornecedor obrigatório' }),
  description:      z.string().min(2, 'Descrição obrigatória').max(300),
  amount:           z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  dueDate:          z.uuid({ message: 'Data de vencimento obrigatória' }),
  bankAccountId:    z.uuid().optional().or(z.literal('')),
  costCenterId:     z.uuid().optional().or(z.literal('')),
  chartOfAccountId: z.uuid().optional().or(z.literal('')),
})

export const payAccountPayableSchema = z.object({
  paymentDate:   z.string().min(1, 'Data do pagamento obrigatória'),
  amount:        z.coerce.number().min(0.01, 'Valor obrigatório'),
  bankAccountId: z.uuid({ message: 'Conta bancária obrigatória' }),
})

export type AccountPayableFormData    = z.infer<typeof accountPayableSchema>
export type PayAccountPayableFormData = z.infer<typeof payAccountPayableSchema>
