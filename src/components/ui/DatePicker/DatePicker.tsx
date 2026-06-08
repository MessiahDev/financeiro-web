// =============================================================================
// DatePicker.tsx — wrapper sobre <input type="date"> com formatacao pt-BR
// =============================================================================

import { forwardRef, type InputHTMLAttributes } from 'react'

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
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400">
            <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8"  y1="2" x2="8"  y2="6" />
              <line x1="3"  y1="10" x2="21" y2="10" />
            </svg>
          </span>

          <input
            ref={ref}
            id={inputId}
            type="date"
            className={[
              'w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm text-slate-900',
              'transition-colors duration-150',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:bg-slate-50 disabled:cursor-not-allowed',
              error
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 hover:border-slate-400',
              className,
            ].filter(Boolean).join(' ')}
            {...props}
          />
        </div>

        {error  && <p className="text-xs text-red-600">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    )
  },
)

DatePicker.displayName = 'DatePicker'
