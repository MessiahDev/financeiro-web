import { Link } from 'react-router-dom'
import { Button } from '../../components/ui/Button/Button'
import { ROUTES } from '../../router/routes'

export default function NotFoundPage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-slate-100 text-4xl">
        🔍
      </div>
      <div>
        <h1 className="font-display text-5xl font-bold text-slate-900">404</h1>
        <p className="mt-2 text-lg font-medium text-slate-700">Pagina nao encontrada</p>
        <p className="mt-1 text-sm text-slate-500">
          A pagina que voce procura nao existe ou foi movida.
        </p>
      </div>
      <Link to={ROUTES.DASHBOARD}>
        <Button>Voltar ao inicio</Button>
      </Link>
    </div>
  )
}