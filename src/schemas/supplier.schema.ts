import { z } from 'zod'

export const supplierSchema = z.object({
  name:             z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(150),
  email:            z.string().min(1, 'E-mail obrigatorio').email('E-mail invalido'),
  phone:            z.string().optional(),
  document:         z.string().min(11, 'Documento invalido').max(18),
  personType:       z.enum(['Individual', 'Company'], { required_error: 'Tipo obrigatorio' }),
  paymentTermDays:  z.coerce.number().int().min(0).optional(),
  notes:            z.string().max(500).optional(),
})

export type SupplierFormData = z.infer<typeof supplierSchema>