import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'
import { Sparkles } from 'lucide-react'
import { loginSchema, type LoginFormData } from '../../../schemas/auth.schema'
import { useAuth } from '../../../hooks/useAuth'
import { useNotifications } from '../../../contexts/NotificationContext'
import { ROUTES } from '../../../router/routes'
import { Button } from '../../../components/ui/Button/Button'
import { Input } from '../../../components/ui/Input/Input'

const DEMO_EMAIL = 'admin@financeiro.com'
const DEMO_PASSWORD = 'Admin@123'

export function LoginForm() {
  const { login, isLoading } = useAuth()
  const { error: notifyError } = useNotifications()
  const navigate = useNavigate()
  const location = useLocation()
  const from =
    (location.state as { from?: Location })?.from?.pathname ??
    ROUTES.DASHBOARD
  const [showPassword, setShowPassword] = useState(false)
  const [isDemoLoading, setIsDemoLoading] = useState(false)

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  })

  async function onSubmit(data: LoginFormData) {
    try {
      await login(data)
      navigate(from, { replace: true })
    } catch {
      notifyError('E-mail ou senha invalidos.')
    }
  }

  async function handleDemoLogin() {
    setValue('email', DEMO_EMAIL)
    setValue('password', DEMO_PASSWORD)
    setIsDemoLoading(true)
    try {
      await login({ email: DEMO_EMAIL, password: DEMO_PASSWORD })
      navigate(from, { replace: true })
    } catch {
      notifyError('Conta demo indisponível no momento.')
    } finally {
      setIsDemoLoading(false)
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <button
        type="button"
        onClick={handleDemoLogin}
        disabled={isDemoLoading || isLoading}
        className="flex items-center justify-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2.5 text-sm font-medium text-blue-700 transition-colors hover:bg-blue-100 disabled:opacity-50 dark:border-blue-900/50 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30"
      >
        <Sparkles size={16} />
        {isDemoLoading ? 'Entrando...' : 'Entrar com conta demo (acesso completo)'}
      </button>

      <div className="flex items-center gap-3">
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
        <span className="text-xs text-slate-400 dark:text-slate-500">ou entre com suas credenciais</span>
        <div className="h-px flex-1 bg-slate-200 dark:bg-slate-800" />
      </div>

      <form
        onSubmit={handleSubmit(onSubmit)}
        className="flex flex-col gap-4"
        noValidate
      >
        <Input
          label="E-mail"
          type="email"
          placeholder="seu@email.com"
          autoComplete="email"
          required
          error={errors.email?.message}
          {...register('email')}
        />
        <div className="relative">
          <Input
            label="Senha"
            type={showPassword ? 'text' : 'password'}
            placeholder="••••••••"
            autoComplete="current-password"
            required
            error={errors.password?.message}
            {...register('password')}
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword(v => !v)}
            className="absolute right-3 top-[38px] text-xs text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-300"
          >
            {showPassword ? 'Ocultar' : 'Mostrar'}
          </button>
        </div>
        <Button
          type="submit"
          fullWidth
          isLoading={isLoading}
          className="mt-2"
        >
          Entrar
        </Button>
      </form>
    </div>
  )
}