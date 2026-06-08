import { z } from 'zod'

export const bankReconciliationSchema = z.object({
  bankAccountId:  z.uuid({ message: 'Conta bancária obrigatória' }),
  statementDate:  z.string().min(1, 'Data do extrato obrigatória'),
  openingBalance: z.number(),
  closingBalance: z.number(),
})

export const bankReconciliationItemSchema = z.object({
  bankStatementEntryId: z.uuid({ message: 'Entrada de extrato obrigatória' }),
  transactionId:        z.uuid().optional().or(z.literal('')),
})

export type BankReconciliationFormData     = z.infer<typeof bankReconciliationSchema>
export type BankReconciliationItemFormData = z.infer<typeof bankReconciliationItemSchema>
