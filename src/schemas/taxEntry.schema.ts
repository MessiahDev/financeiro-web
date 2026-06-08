import { z } from 'zod'

export const taxEntrySchema = z.object({
  taxType:        z.enum(
  ['IRPJ', 'CSLL', 'PIS', 'COFINS', 'ISS', 'ICMS', 'IPI', 'Other'],
  { message: 'Tipo obrigatório' },
),
  description:    z.string().min(2, 'Descrição obrigatória').max(300),
  competenceDate: z.string().min(1, 'Competência obrigatória'),
  dueDate:        z.string().min(1, 'Vencimento obrigatório'),
  amount:         z.coerce.number().min(0.01, 'Valor deve ser maior que zero'),
}).refine((d) => d.competenceDate <= d.dueDate, {
  message: 'Competência deve ser anterior ou igual ao vencimento',
  path: ['dueDate'],
})

export type TaxEntryFormData = z.infer<typeof taxEntrySchema>
