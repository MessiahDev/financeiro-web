import { z } from 'zod'

export const accountingPeriodSchema = z.object({
  name:       z.string().min(2, 'Nome obrigatório').max(100),
  startDate:  z.string().min(1, 'Data inicial obrigatória'),
  endDate:    z.string().min(1, 'Data final obrigatória'),
  fiscalYear: z.coerce.number().int().min(2000).max(2100),
}).refine((d) => d.startDate <= d.endDate, {
  message: 'Data inicial deve ser anterior à data final',
  path: ['endDate'],
})

export type AccountingPeriodFormData = z.infer<typeof accountingPeriodSchema>
