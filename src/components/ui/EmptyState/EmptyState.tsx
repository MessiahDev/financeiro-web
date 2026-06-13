interface EmptyStateProps {
  message?: string
  description?: string
  action?: React.ReactNode
  icon?: React.ReactNode
}

export function EmptyState({
  message = 'Nenhum registro encontrado.',
  description,
  action,
  icon,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 py-8 text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-100 text-slate-400">
        {icon ?? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0H4m8-4v4" />
          </svg>
        )}
      </div>
      <div>
        <p className="text-sm font-medium text-slate-700">{message}</p>
        {description && <p className="mt-1 text-xs text-slate-500">{description}</p>}
      </div>
      {action && <div className="mt-1">{action}</div>}
    </div>
  )
}
