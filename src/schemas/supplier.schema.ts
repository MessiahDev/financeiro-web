import { z } from 'zod'

export const supplierSchema = z.object({
  name:         z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(150),
  email:        z.email('E-mail inválido'),
  phone:        z.string().optional(),
  taxId:        z.string().min(11, 'Documento inválido').max(18),
  personType:   z.union([z.literal(1), z.literal(2)], { message: 'Tipo obrigatório' }),
  contactName:  z.string().optional(),
})

export type SupplierFormData = z.infer<typeof supplierSchema>