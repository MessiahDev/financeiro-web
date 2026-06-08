import { z } from 'zod'

export const taxPaymentSchema = z.object({
  taxEntryId:       z.uuid({ message: 'Obrigação fiscal obrigatória' }),
  paymentDate:      z.string().min(1, 'Data do pagamento obrigatória'),
  amount:           z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
  bankAccountId:    z.uuid({ message: 'Conta bancária obrigatória' }),
  receiptNumber:    z.string().max(50).optional(),
})

export type TaxPaymentFormData = z.infer<typeof taxPaymentSchema>