import { z } from 'zod'

export const accountingPeriodSchema = z.object({
  year:  z.number().int().min(2000).max(2100),
  month: z.number().int().min(1).max(12),
})

export type AccountingPeriodFormData = z.infer<typeof accountingPeriodSchema>