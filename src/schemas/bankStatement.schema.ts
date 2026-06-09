import { z } from 'zod'
import { BankStatementEntryType } from '../types/enums'

export const importBankStatementSchema = z.object({
  bankAccountId:  z.uuid({ message: 'Conta bancária obrigatória' }),
  statementDate:  z.string().min(1, 'Data do extrato obrigatória'),
  periodStart:    z.string().min(1, 'Início do período obrigatório'),
  periodEnd:      z.string().min(1, 'Fim do período obrigatório'),
  openingBalance: z.number(),
  closingBalance: z.number(),
  fileName:       z.string().optional(),
  notes:          z.string().optional(),
})

export const bankStatementEntrySchema = z.object({
  date:           z.string().min(1, 'Data obrigatória'),
  description:    z.string().min(1, 'Descrição obrigatória').max(300),
  amount:         z.number().min(0.01, 'Valor deve ser maior que zero'),
  entryType:      z.enum(BankStatementEntryType, { message: 'Tipo obrigatório' }),
  documentNumber: z.string().optional(),
})

export type ImportBankStatementFormData = z.infer<typeof importBankStatementSchema>
export type BankStatementEntryFormData  = z.infer<typeof bankStatementEntrySchema>