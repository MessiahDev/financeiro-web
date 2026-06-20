export type BadgeVariant = 'default' | 'success' | 'warning' | 'danger' | 'info' | 'purple'

interface BadgeProps {
  children: React.ReactNode
  variant?: BadgeVariant
  dot?: boolean
  className?: string
}

const variants: Record<BadgeVariant, string> = {
  default: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
  success: 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400',
  warning: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  danger:  'bg-red-100  text-red-700 dark:bg-red-900/30 dark:text-red-400',
  info:    'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400',
  purple:  'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-400',
}

const dots: Record<BadgeVariant, string> = {
  default: 'bg-slate-500',
  success: 'bg-green-500',
  warning: 'bg-amber-500',
  danger:  'bg-red-500',
  info:    'bg-blue-500',
  purple:  'bg-purple-500',
}

export function Badge({ children, variant = 'default', dot = false, className = '' }: BadgeProps) {
  return (
    <span
      className={[
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium',
        variants[variant],
        className,
      ].join(' ')}
    >
      {dot && (
        <span className={['h-1.5 w-1.5 rounded-full shrink-0', dots[variant]].join(' ')} />
      )}
      {children}
    </span>
  )
}