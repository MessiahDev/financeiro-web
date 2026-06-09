import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'

import {
  registerSchema,
  type RegisterFormData,
} from '../../../schemas/auth.schema'

import { Input } from '../../../components/ui/Input/Input'
import { Button } from '../../../components/ui/Button/Button'

interface RegisterFormProps {
  isLoading?: boolean
  error?: string | null
  onSubmit: (data: RegisterFormData) => Promise<void> | void
}

export function RegisterForm({
  isLoading = false,
  error,
  onSubmit,
}: RegisterFormProps) {
  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) })

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="flex flex-col gap-4"
      noValidate
    >
      {error && (
        <div className="rounded-md border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
          {error}
        </div>
      )}

      <Input
        label="Nome completo"
        type="text"
        placeholder="Seu nome"
        autoComplete="name"
        required
        disabled={isLoading}
        error={errors.name?.message}
        {...register('name')}
      />

      <Input
        label="E-mail"
        type="email"
        placeholder="seu@email.com"
        autoComplete="email"
        required
        disabled={isLoading}
        error={errors.email?.message}
        {...register('email')}
      />

      <Input
        label="Senha"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        disabled={isLoading}
        hint="Minimo 8 caracteres, 1 maiuscula, 1 numero e 1 caractere especial"
        error={errors.password?.message}
        {...register('password')}
      />

      <Input
        label="Confirmar senha"
        type="password"
        placeholder="••••••••"
        autoComplete="new-password"
        required
        disabled={isLoading}
        error={errors.confirmPassword?.message}
        {...register('confirmPassword')}
      />

      <Button
        type="submit"
        fullWidth
        isLoading={isLoading}
        className="mt-2"
      >
        Criar conta
      </Button>
    </form>
  )
}