import { useNavigate, useRouteError, isRouteErrorResponse } from 'react-router-dom'
import { AlertTriangle, RotateCw, Home } from 'lucide-react'
import { Button } from '../../components/ui/Button/Button'
import { ROUTES } from '../../router/routes'

function getErrorDetails(error: unknown): { title: string; message: string; detail?: string } {
  if (isRouteErrorResponse(error)) {
    return {
      title: `Erro ${error.status}`,
      message: error.statusText || 'Ocorreu um problema ao carregar esta página.',
    }
  }

  if (error instanceof Error) {
    return {
      title: 'Algo deu errado',
      message: 'Encontramos um erro inesperado nesta página.',
      detail: error.message,
    }
  }

  return {
    title: 'Algo deu errado',
    message: 'Encontramos um erro inesperado. Tente novamente.',
  }
}

export default function ErrorBoundaryPage() {
  const error = useRouteError()
  const navigate = useNavigate()
  const { title, message, detail } = getErrorDetails(error)

  const isDev = import.meta.env.DEV

  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 p-8 text-center dark:bg-slate-950">
      <span
        aria-hidden="true"
        className="pointer-events-none absolute font-display text-[12rem] font-bold text-slate-900/[0.03] sm:text-[16rem] dark:text-white/[0.03]"
      >
        :(
      </span>

      <div className="relative flex flex-col items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-amber-50 text-amber-600 shadow-sm dark:bg-amber-900/20 dark:text-amber-400">
          <AlertTriangle size={36} strokeWidth={1.5} />
        </div>

        <div>
          <h1 className="font-display text-2xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
          <p className="mt-2 max-w-sm text-sm text-slate-500 dark:text-slate-400">{message}</p>

          {isDev && detail && (
            <pre className="mt-4 max-w-md overflow-x-auto rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-left text-xs text-amber-800 dark:border-amber-900/50 dark:bg-amber-900/20 dark:text-amber-300">
              {detail}
            </pre>
          )}
        </div>

        <div className="flex gap-3">
          <Button variant="secondary" leftIcon={<RotateCw size={16} />} onClick={() => window.location.reload()}>
            Tentar novamente
          </Button>
          <Button leftIcon={<Home size={16} />} onClick={() => navigate(ROUTES.DASHBOARD)}>
            Voltar ao início
          </Button>
        </div>
      </div>
    </div>
  )
}