import { z } from 'zod'
import { UserRole } from '../types/enums'

export const loginSchema = z.object({
  email: z.string().min(1, 'E-mail obrigatorio').pipe(z.email('E-mail invalido')),
  password: z.string().min(1, 'Senha obrigatoria'),
})

export const registerSchema = z
  .object({
    name: z.string().min(2, 'Nome deve ter ao menos 2 caracteres').max(100, 'Nome muito longo'),
    email: z.string().min(1, 'E-mail obrigatorio').pipe(z.email('E-mail invalido')),
    password: z
      .string()
      .min(8, 'Senha deve ter ao menos 8 caracteres')
      .regex(/[A-Z]/, 'Deve conter ao menos uma letra maiuscula')
      .regex(/[0-9]/, 'Deve conter ao menos um numero')
      .regex(/[^A-Za-z0-9]/, 'Deve conter ao menos um caractere especial'),
    confirmPassword: z.string().min(1, 'Confirmacao de senha obrigatoria'),
    role: z.literal(UserRole.Employee).default(UserRole.Employee),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'As senhas nao coincidem',
    path: ['confirmPassword'],
  })

export type LoginFormData = z.infer<typeof loginSchema>
export type RegisterFormData = z.infer<typeof registerSchema>