import { forwardRef, type InputHTMLAttributes } from 'react'
import { Calendar } from 'lucide-react'

export interface DatePickerProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string
  error?: string
  hint?:  string
}

export const DatePicker = forwardRef<HTMLInputElement, DatePickerProps>(
  ({ label, error, hint, className = '', id, ...props }, ref) => {
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400 dark:text-slate-500">
            <Calendar size={15} />
          </span>

          <input
            ref={ref}
            id={inputId}
            type="date"
            className={[
              'w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm text-slate-900',
              'dark:bg-slate-900 dark:text-slate-100 dark:[color-scheme:dark]',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:bg-slate-50 disabled:cursor-not-allowed dark:disabled:bg-slate-800',
              error
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600',
              className,
            ].filter(Boolean).join(' ')}
            {...props}
          />
        </div>

        {error  && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      </div>
    )
  },
)

DatePicker.displayName = 'DatePicker'