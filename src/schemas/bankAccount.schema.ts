import { z } from 'zod'

export const bankAccountSchema = z.object({
  bankName:       z.string().min(2, 'Nome do banco obrigatório').max(100),
  accountNumber:  z.string().min(1, 'Número da conta obrigatório').max(30),
  agency:         z.string().min(1, 'Agência obrigatória').max(20),
  accountType:    z.enum(['Checking', 'Savings', 'Investment'], { message: 'Tipo obrigatório' }),
  initialBalance: z.number().min(0).optional(),
})

export type BankAccountFormData = z.infer<typeof bankAccountSchema>
