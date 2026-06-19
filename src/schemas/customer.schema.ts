import { z } from 'zod'

export const customerSchema = z.object({
  name:        z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(150),
  email:       z.string().min(1, 'E-mail obrigatório').email('E-mail inválido'),
  phone:       z.string().optional(),
  taxId:       z.string().min(11, 'Documento inválido').max(18),
  personType:  z.union([z.literal('Individual'), z.literal('Company')], { message: 'Tipo obrigatório' }),
  creditLimit: z.number().min(0).optional(),
})

export type CustomerFormData = z.infer<typeof customerSchema>