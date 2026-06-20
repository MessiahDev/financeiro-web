import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'

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
            className="flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
            aria-label="Voltar"
          >
            <ArrowLeft size={16} />
          </button>
        )}
        <div>
          <h1 className="font-display text-xl font-semibold text-slate-900 dark:text-slate-100">{title}</h1>
          {subtitle && <p className="mt-0.5 text-sm text-slate-500 dark:text-slate-400">{subtitle}</p>}
        </div>
      </div>
      {actions && <div className="flex shrink-0 items-center gap-2">{actions}</div>}
    </div>
  )
}