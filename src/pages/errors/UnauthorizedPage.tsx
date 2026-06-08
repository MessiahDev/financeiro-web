import { useNavigate } from 'react-router-dom'
import { Button } from '../../components/ui/Button/Button'
import { ROUTES } from '../../router/routes'

export default function UnauthorizedPage() {
  const navigate = useNavigate()
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6 bg-slate-50 p-8 text-center">
      <div className="flex h-20 w-20 items-center justify-center rounded-2xl bg-red-100 text-4xl">
        🔒
      </div>
      <div>
        <h1 className="font-display text-5xl font-bold text-slate-900">403</h1>
        <p className="mt-2 text-lg font-medium text-slate-700">Acesso negado</p>
        <p className="mt-1 text-sm text-slate-500">
          Voce nao tem permissao para acessar esta pagina.
        </p>
      </div>
      <div className="flex gap-3">
        <Button variant="secondary" onClick={() => navigate(-1)}>Voltar</Button>
        <Button onClick={() => navigate(ROUTES.DASHBOARD)}>Ir para o inicio</Button>
      </div>
    </div>
  )
}
