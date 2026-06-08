import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate } from 'react-router-dom'
import { registerSchema, type RegisterFormData } from '../../schemas/auth.schema'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { useNotifications } from '../../contexts/NotificationContext'
import { ROUTES } from '../../router/routes'

export default function RegisterPage() {
  const { register: registerUser, isLoading } = useAuth()
  const { error: notifyError, success } = useNotifications()
  const navigate = useNavigate()

  const { register, handleSubmit, formState: { errors } } = useForm({ resolver: zodResolver(registerSchema) })

  async function onSubmit(data: RegisterFormData) {
    try {
      await registerUser(data)
      success('Conta criada com sucesso!')
      navigate(ROUTES.DASHBOARD, { replace: true })
    } catch {
      notifyError('Nao foi possivel criar a conta. Tente novamente.')
    }
  }

  return (
    <div>
      <div className="mb-8">
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-display text-lg font-bold text-white lg:hidden">
          F
        </div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">Criar conta</h1>
        <p className="mt-1 text-sm text-slate-500">Preencha os dados para criar sua conta</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
        <Input
          label="Nome completo"
          type="text"
          placeholder="Seu nome"
          autoComplete="name"
          required
          error={errors.name?.message}
          {...register('name')}
        />

        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />

        <Input
          label="Senha"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          hint="Minimo 8 caracteres, 1 maiuscula, 1 numero, 1 especial"
          error={errors.password?.message}
          {...register('password')}
        />

        <Input
          label="Confirmar senha"
          type="password"
          placeholder="••••••••"
          autoComplete="new-password"
          required
          error={errors.confirmPassword?.message}
          {...register('confirmPassword')}
        />

        <Button type="submit" fullWidth isLoading={isLoading} className="mt-2">
          Criar conta
        </Button>
      </form>

      <p className="mt-6 text-center text-sm text-slate-500">
        Ja tem conta?{' '}
        <Link to={ROUTES.LOGIN} className="font-medium text-blue-600 hover:text-blue-700">
          Entrar
        </Link>
      </p>
    </div>
  )
}
