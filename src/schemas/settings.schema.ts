import { z } from 'zod'

export const updateNameSchema = z.object({
  name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(150),
})

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Senha atual obrigatória'),
  newPassword: z.string()
    .min(8, 'Senha deve ter ao menos 8 caracteres')
    .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiúscula')
    .regex(/[0-9]/, 'Deve conter ao menos um número')
    .regex(/[^A-Za-z0-9]/, 'Deve conter ao menos um caractere especial'),
  confirmPassword: z.string().min(1, 'Confirmação obrigatória'),
}).refine(d => d.newPassword === d.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
})

export type UpdateNameFormData = z.infer<typeof updateNameSchema>
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>