import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { loginSchema, type LoginFormData } from '../../schemas/auth.schema'
import { useAuth } from '../../hooks/useAuth'
import { Button } from '../../components/ui/Button/Button'
import { Input } from '../../components/ui/Input/Input'
import { useNotifications } from '../../contexts/NotificationContext'
import { ROUTES } from '../../router/routes'

export default function LoginPage() {
  const { login, isLoading } = useAuth()
  const { error: notifyError } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const from = (location.state as { from?: Location })?.from?.pathname ?? ROUTES.DASHBOARD

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({ resolver: zodResolver(loginSchema) })

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data)
      navigate(from, { replace: true })
    } catch {
      notifyError('E-mail ou senha invalidos.')
    }
  }

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-display text-lg font-bold text-white lg:hidden">
          F
        </div>
        <h1 className="font-display text-2xl font-semibold text-slate-900">Bem-vindo de volta</h1>
        <p className="mt-1 text-sm text-slate-500">Entre com suas credenciais para continuar</p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-4" noValidate>
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
          autoComplete="current-password"
          required
          error={errors.password?.message}
          {...register('password')}
        />

        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="mt-2"
        >
          Entrar
        </Button>
      </form>

      {/* Footer */}
      <p className="mt-6 text-center text-sm text-slate-500">
        Nao tem conta?{' '}
        <Link to={ROUTES.REGISTER} className="font-medium text-blue-600 hover:text-blue-700">
          Criar conta
        </Link>
      </p>
    </div>
  )
}
