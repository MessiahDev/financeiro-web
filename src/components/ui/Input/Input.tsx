import { forwardRef, type InputHTMLAttributes } from 'react'
export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  hint?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
}
export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, hint, leftIcon, rightIcon, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700 dark:text-slate-300"
          >
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}
        <div className="relative">
          {leftIcon && (
            <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-slate-500">
              {leftIcon}
            </span>
          )}
          <input
            ref={ref}
            id={inputId}
            className={[
              'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900',
              'dark:bg-slate-900 dark:text-slate-100',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0 focus:border-blue-500',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
              'dark:disabled:bg-slate-800 dark:disabled:text-slate-500',
              error
                ? 'border-red-400 focus:ring-red-400 focus:border-red-400'
                : 'border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600',
              leftIcon  ? 'pl-9' : '',
              rightIcon ? 'pr-9' : '',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          />
          {rightIcon && (
            <span className="absolute inset-y-0 right-3 flex items-center text-slate-400 dark:text-slate-500">
              {rightIcon}
            </span>
          )}
        </div>
        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      </div>
    )
  },
)
Input.displayName = 'Input'