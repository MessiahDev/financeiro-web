import { z } from 'zod'
import { ReconciliationItemStatus } from '../types/enums'

export const bankReconciliationSchema = z.object({
  bankAccountId:   z.uuid({ message: 'Conta bancária obrigatória' }),
  bankStatementId: z.uuid({ message: 'Extrato bancário obrigatório' }),
  systemBalance:   z.number(),
  notes:           z.string().optional(),
})

export const bankReconciliationItemSchema = z.object({
  bankStatementEntryId: z.uuid({ message: 'Entrada de extrato obrigatória' }),
  transactionId:        z.uuid().optional().or(z.literal('')),
  itemStatus:           z.enum(ReconciliationItemStatus),
  notes:                z.string().optional(),
})

export type BankReconciliationFormData     = z.infer<typeof bankReconciliationSchema>
export type BankReconciliationItemFormData = z.infer<typeof bankReconciliationItemSchema>