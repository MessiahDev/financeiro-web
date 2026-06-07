interface CardProps {
  children: React.ReactNode
  className?: string
  padding?: 'none' | 'sm' | 'md' | 'lg'
  onClick?: () => void
}

interface CardHeaderProps {
  title: string
  subtitle?: string
  action?: React.ReactNode
  className?: string
}

const paddings = {
  none: '',
  sm:   'p-4',
  md:   'p-5',
  lg:   'p-6',
}

export function Card({ children, className = '', padding = 'md', onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={[
        'rounded-xl border border-slate-200 bg-white shadow-sm',
        paddings[padding],
        onClick ? 'cursor-pointer hover:shadow-md transition-shadow duration-150' : '',
        className,
      ]
        .filter(Boolean)
        .join(' ')}
    >
      {children}
    </div>
  )
}

export function CardHeader({ title, subtitle, action, className = '' }: CardHeaderProps) {
  return (
    <div className={['flex items-start justify-between gap-4', className].join(' ')}>
      <div>
        <h3 className="font-display text-base font-semibold text-slate-900">{title}</h3>
        {subtitle && <p className="mt-0.5 text-sm text-slate-500">{subtitle}</p>}
      </div>
      {action && <div className="shrink-0">{action}</div>}
    </div>
  )
}

export function CardDivider() {
  return <hr className="-mx-5 my-4 border-slate-100" />
}