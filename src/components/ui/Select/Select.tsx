import { forwardRef, type SelectHTMLAttributes } from 'react'
import { ChevronDown } from 'lucide-react'
import type { SelectOption } from '../../../types/common.types'

export interface SelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  error?: string
  hint?: string
  options: SelectOption[]
  placeholder?: string
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ label, error, hint, options, placeholder, className = '', id, ...props }, ref) => {
    const selectId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={selectId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <select
            ref={ref}
            id={selectId}
            className={[
              'w-full appearance-none rounded-lg border bg-white px-3 py-2 pr-9 text-sm text-slate-900',
              'dark:bg-slate-900 dark:text-slate-100',
              'transition-colors duration-150 cursor-pointer',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
              'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
              'dark:disabled:bg-slate-800 dark:disabled:text-slate-500',
              error
                ? 'border-red-400 focus:ring-red-400'
                : 'border-slate-300 hover:border-slate-400 dark:border-slate-700 dark:hover:border-slate-600',
              className,
            ]
              .filter(Boolean)
              .join(' ')}
            {...props}
          >
            {placeholder && (
              <option value="" disabled>
                {placeholder}
              </option>
            )}
            {options.map((opt) => (
              <option key={String(opt.value)} value={String(opt.value)} disabled={opt.disabled}>
                {opt.label}
              </option>
            ))}
          </select>
          <ChevronDown size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
        </div>

        {error && <p className="text-xs text-red-600 dark:text-red-400">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-500 dark:text-slate-400">{hint}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'