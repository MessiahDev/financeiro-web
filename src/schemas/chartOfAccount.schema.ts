import { z } from 'zod'
import { AccountType, AccountNature } from '../types/enums'

export const chartOfAccountSchema = z.object({
  code:          z.string().min(1, 'Código obrigatório').max(20),
  name:          z.string().min(2, 'Nome obrigatório').max(150),
  description:   z.string().optional(),
  accountType:   z.enum(AccountType,  { message: 'Tipo obrigatório' }),
  accountNature: z.enum(AccountNature, { message: 'Natureza obrigatória' }),
  parentId:      z.uuid().optional().or(z.literal('')),
  acceptsEntries: z.boolean().default(true),
})

export type ChartOfAccountFormData = z.infer<typeof chartOfAccountSchema>