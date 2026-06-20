import { forwardRef, type ButtonHTMLAttributes } from 'react'
import { Spinner } from '../Spinner/Spinner'

export type ButtonVariant = 'primary' | 'secondary' | 'ghost' | 'danger' | 'success'
export type ButtonSize = 'sm' | 'md' | 'lg'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
  isLoading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  fullWidth?: boolean
}

const base =
  'inline-flex items-center justify-center gap-2 font-medium rounded-lg border transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 disabled:opacity-50 disabled:pointer-events-none select-none'

const variants: Record<ButtonVariant, string> = {
  primary:
    'bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 active:bg-blue-800 focus-visible:ring-blue-500',
  secondary:
    'bg-white text-slate-700 border-slate-300 hover:bg-slate-50 hover:border-slate-400 active:bg-slate-100 focus-visible:ring-slate-400 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-700 dark:hover:bg-slate-800 dark:hover:border-slate-600 dark:active:bg-slate-700',
  ghost:
    'bg-transparent text-slate-600 border-transparent hover:bg-slate-100 hover:text-slate-800 active:bg-slate-200 focus-visible:ring-slate-400 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-100 dark:active:bg-slate-700',
  danger:
    'bg-red-600 text-white border-red-600 hover:bg-red-700 hover:border-red-700 active:bg-red-800 focus-visible:ring-red-500',
  success:
    'bg-green-600 text-white border-green-600 hover:bg-green-700 hover:border-green-700 active:bg-green-800 focus-visible:ring-green-500',
}

const sizes: Record<ButtonSize, string> = {
  sm: 'h-8  px-3   text-xs',
  md: 'h-9  px-4   text-sm',
  lg: 'h-11 px-5   text-base',
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      isLoading = false,
      leftIcon,
      rightIcon,
      fullWidth = false,
      children,
      disabled,
      className = '',
      ...props
    },
    ref,
  ) => {
    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={[base, variants[variant], sizes[size], fullWidth ? 'w-full' : '', className]
          .filter(Boolean)
          .join(' ')}
        {...props}
      >
        {isLoading ? (
          <Spinner size="sm" className="text-current" />
        ) : (
          leftIcon && <span className="shrink-0">{leftIcon}</span>
        )}
        {children}
        {!isLoading && rightIcon && <span className="shrink-0">{rightIcon}</span>}
      </button>
    )
  },
)

Button.displayName = 'Button'