import { Link } from 'react-router-dom'
import { SearchX, Home } from 'lucide-react'
import { Button } from '../../components/ui/Button/Button'
import { ROUTES } from '../../router/routes'

export default function NotFoundPage() {
  return (
    <div className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-slate-50 p-8 text-center dark:bg-slate-950">
      {/* Número gigante de fundo */}
      <span
        aria-hidden="true"
        className="pointer-events-none absolute font-display text-[14rem] font-bold text-slate-900/[0.03] sm:text-[20rem] dark:text-white/[0.03]"
      >
        404
      </span>

      <div className="relative flex flex-col items-center gap-6">
        <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-blue-50 text-blue-600 shadow-sm dark:bg-blue-900/20 dark:text-blue-400">
          <SearchX size={36} strokeWidth={1.5} />
        </div>

        <div>
          <h1 className="font-display text-5xl font-bold text-slate-900 dark:text-slate-100">404</h1>
          <p className="mt-2 text-lg font-medium text-slate-700 dark:text-slate-200">Página não encontrada</p>
          <p className="mt-1 max-w-xs text-sm text-slate-500 dark:text-slate-400">
            A página que você procura não existe ou foi movida.
          </p>
        </div>

        <Link to={ROUTES.DASHBOARD}>
          <Button leftIcon={<Home size={16} />}>Voltar ao início</Button>
        </Link>
      </div>
    </div>
  )
}