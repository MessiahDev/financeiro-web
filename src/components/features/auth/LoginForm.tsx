import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useNavigate, useLocation } from 'react-router-dom'

import { loginSchema, type LoginFormData } from '../../../schemas/auth.schema'
import { useAuth } from '../../../hooks/useAuth'
import { useNotifications } from '../../../contexts/NotificationContext'
import { ROUTES } from '../../../router/routes'

import { Button } from '../../../components/ui/Button/Button'
import { Input } from '../../../components/ui/Input/Input'

export function LoginForm() {
  const { login, isLoading } = useAuth()
  const { error: notifyError } = useNotifications()

  const navigate = useNavigate()
  const location = useLocation()

  const from =
    (location.state as { from?: Location })?.from?.pathname ??
    ROUTES.DASHBOARD

  const [showPassword, setShowPassword] = useState(false)

  const {
    register,
    handleSubmit,
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

  return (
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
          className="absolute right-3 top-[38px] text-xs text-slate-500 hover:text-slate-700"
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
  )
}