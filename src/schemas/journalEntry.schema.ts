import { z } from 'zod'

export const journalEntryLineSchema = z.object({
  chartOfAccountId:   z.uuid({ message: 'Conta obrigatória' }),
  costCenterId:       z.uuid().optional().or(z.literal('')),
type:                 z.enum(['Debit', 'Credit'], { message: 'Tipo obrigatório' }),
  amount:             z.number().min(0.01, 'Valor deve ser maior que zero'),
  description:        z.string().max(300).optional(),
})

export const journalEntrySchema = z.object({
  accountingPeriodId: z.uuid({ message: 'Período contábil obrigatório' }),
  entryDate:          z.string().min(1, 'Data do lançamento obrigatória'),
  description:        z.string().min(2, 'Descrição obrigatória').max(300),
  referenceNumber:    z.string().max(50).optional(),
  lines:              z.array(journalEntryLineSchema).min(2, 'Mínimo de 2 linhas'),
}).refine((d) => {
  const debits  = d.lines.filter((l) => l.type === 'Debit').reduce((s, l) => s + l.amount, 0)
  const credits = d.lines.filter((l) => l.type === 'Credit').reduce((s, l) => s + l.amount, 0)
  return Math.abs(debits - credits) < 0.01
}, { message: 'Débitos e créditos devem ser iguais', path: ['lines'] })

export type JournalEntryFormData     = z.infer<typeof journalEntrySchema>
export type JournalEntryLineFormData = z.infer<typeof journalEntryLineSchema>
