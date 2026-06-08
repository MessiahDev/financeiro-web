// =============================================================================
// Select.tsx
// =============================================================================

import { forwardRef, type SelectHTMLAttributes } from 'react'
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
          <label htmlFor={selectId} className="text-sm font-medium text-slate-700">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <select
          ref={ref}
          id={selectId}
          className={[
            'w-full rounded-lg border bg-white px-3 py-2 text-sm text-slate-900',
            'transition-colors duration-150 cursor-pointer',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
            'disabled:bg-slate-50 disabled:text-slate-500 disabled:cursor-not-allowed',
            error
              ? 'border-red-400 focus:ring-red-400'
              : 'border-slate-300 hover:border-slate-400',
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

        {error && <p className="text-xs text-red-600">{error}</p>}
        {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
      </div>
    )
  },
)

Select.displayName = 'Select'
