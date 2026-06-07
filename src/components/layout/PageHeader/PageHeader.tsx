import { useNavigate } from 'react-router-dom'
import { Button } from '../../ui/Button/Button'

interface PageHeaderProps {
  title: string
  subtitle?: string
  actions?: React.ReactNode
  backTo?: string
}

export function PageHeader({ title, subtitle, actions, backTo }: PageHeaderProps) {
  const navigate = useNavigate()

  return (
    <div className="flex items-start justify-between gap-4 pb-6">
      <div className="flex items-center gap-3">
        {backTo && (
          <button
            onClick={() => navigate(backTo)}
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700"
            aria-label="Voltar"
          >
            ←
          </button>
        )}
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-900">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}