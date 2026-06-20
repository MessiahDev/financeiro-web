import { useNavigate } from 'react-router-dom'
import { ShieldAlert, ArrowLeft, Home } from 'lucide-react'
import { Button } from '../../components/ui/Button/Button'
import { ROUTES } from '../../router/routes'

export default function UnauthorizedPage() {
  const navigate = useNavigate()

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 p-8 text-center dark:bg-slate-950">
      {/* Número gigante de fundo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute font-display text-[14rem] font-bold text-slate-900/[0.03] sm:text-[20rem] dark:text-white/[0.03]"
      >
        403
      </span>

      <div className="relative flex flex-col items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-50 text-red-600 shadow-sm dark:bg-red-900/20 dark:text-red-400">
          <ShieldAlert size={36} strokeWidth={1.5} />
        </div>

        <div>
          <h1 className="font-display text-5xl font-bold text-slate-900 dark:text-slate-100">403</h1>
          <p className="mt-2 text-lg font-medium text-slate-700 dark:text-slate-200">Acesso negado</p>
          <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            Você não tem permissão para acessar esta página.
          </p>
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" leftIcon={<ArrowLeft size={16} />} onClick={() => navigate(-1)}>
            Voltar
          </Button>
          <Button leftIcon={<Home size={16} />} onClick={() => navigate(ROUTES.DASHBOARD)}>
            Ir para o início
          </Button>
        </div>
      </div>
    </div>
  )
}