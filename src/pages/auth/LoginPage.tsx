import { Link } from 'react-router-dom'
import { ROUTES } from '../../router/routes'
import { LoginForm } from '../../components/features/auth'

export default function LoginPage() {
  return (
    <div>
      <div className="mb-8">
        <div className="mb-6 flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 font-display text-lg font-bold text-white lg:hidden">
          F
        </div>

        <h1 className="font-display text-2xl font-semibold text-slate-900">
          Bem-vindo de volta
        </h1>

        <p className="mt-1 text-sm text-slate-500">
          Entre com suas credenciais para continuar
        </p>
      </div>

      <LoginForm />

      <p className="mt-6 text-center text-sm text-slate-500">
        Nao tem conta?{' '}
        <Link
          to={ROUTES.REGISTER}
          className="font-medium text-blue-600 hover:text-blue-700"
        >
          Criar conta
        </Link>
      </p>
    </div>
  )
}