import { z } from 'zod'
import { BankAccountType } from '../types/enums'

export const bankAccountSchema = z.object({
  bankName:       z.string().min(2, 'Nome do banco obrigatório').max(100),
  bankCode:       z.string().min(1, 'Código do banco obrigatório').max(10),
  accountNumber:  z.string().min(1, 'Número da conta obrigatório').max(30),
  agency:         z.string().min(1, 'Agência obrigatória').max(20),
  accountType:    z.enum(BankAccountType),
  initialBalance: z.number().min(0).optional().default(0),
  pixKey:         z.string().max(100).optional(),
  description:    z.string().max(255).optional(),
})

export type BankAccountFormData = z.infer<typeof bankAccountSchema>