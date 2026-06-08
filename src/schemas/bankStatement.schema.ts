import { z } from 'zod'

export const importBankStatementSchema = z.object({
  bankAccountId:  z.uuid({ message: 'Conta bancária obrigatória' }),
  referenceDate:  z.string().min(1, 'Data de referência obrigatória'),
  openingBalance: z.number(),
  closingBalance: z.number(),
})

export const bankStatementEntrySchema = z.object({
  date:        z.string().min(1, 'Data obrigatória'),
  description: z.string().min(1, 'Descrição obrigatória').max(300),
  amount:      z.number().min(0.01, 'Valor deve ser maior que zero'),
  type:        z.enum(['Credit', 'Debit'], { message: 'Tipo obrigatório' }),
})

export type ImportBankStatementFormData = z.infer<typeof importBankStatementSchema>
export type BankStatementEntryFormData  = z.infer<typeof bankStatementEntrySchema>
