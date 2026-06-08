import { z } from 'zod'

export const processPayrollSchema = z.object({
  referenceMonth: z.coerce.number().int().min(1).max(12),
  referenceYear:  z.coerce.number().int().min(2000).max(2100),
})

export type ProcessPayrollFormData = z.infer<typeof processPayrollSchema>