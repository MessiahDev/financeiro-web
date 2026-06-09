import { Link, useNavigate } from 'react-router-dom'

import { useAuth } from '../../hooks/useAuth'
import { useNotifications } from '../../contexts/NotificationContext'

import { ROUTES } from '../../router/routes'

import { RegisterForm } from '../../components/features/auth/RegisterForm'

import type { RegisterFormData } from '../../schemas/auth.schema'

export default function RegisterPage() {
  const { register: registerUser, isLoading, error } = useAuth()
  const { success, error: notifyError } = useNotifications()
  const navigate = useNavigate()

  async function handleRegister(data: RegisterFormData) {
    try {
      await registerUser(data)

      success('Conta criada com sucesso!')

      navigate(ROUTES.DASHBOARD, {
        replace: true,
      })
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

        <h1 className="font-display text-2xl font-semibold text-slate-900">
          Criar conta
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Preencha os dados para criar sua conta
        </p>
      </div>

      <RegisterForm
        isLoading={isLoading}
        error={error}
        onSubmit={handleRegister}
      />

      <p className="mt-6 text-center text-sm text-slate-500">
        Ja tem conta?{' '}
        <Link
          to={ROUTES.LOGIN}
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Entrar
        </Link>
      </p>
    </div>
  )
}