import { z } from 'zod'

export const processPayrollSchema = z.object({
  month:       z.number().int().min(1).max(12),
  year:        z.number().int().min(2000).max(2100),
  employeeIds: z.array(z.string()).default([]),
})

export type ProcessPayrollFormData = z.infer<typeof processPayrollSchema>