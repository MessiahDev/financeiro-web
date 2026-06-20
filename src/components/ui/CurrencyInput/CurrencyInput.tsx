import { forwardRef, useEffect, useState, type InputHTMLAttributes } from 'react'

export interface CurrencyInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
  label?:    string
  error?:    string
  hint?:     string
  value?:    number
  onChange?: (value: number) => void
}

function formatBRL(cents: number): string {
  return (cents / 100).toLocaleString('pt-BR', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })
}

function parseCents(raw: string): number {
  const digits = raw.replace(/\D/g, '')
  return parseInt(digits || '0', 10)
}

export const CurrencyInput = forwardRef<HTMLInputElement, CurrencyInputProps>(
  ({ label, error, hint, value = 0, onChange, className = '', id, ...props }, ref) => {
    const [display, setDisplay] = useState(() => formatBRL(Math.round(value * 100)))
    const inputId = id ?? label?.toLowerCase().replace(/\s+/g, '-')

    useEffect(() => {
      setDisplay(formatBRL(Math.round(value * 100)))
    }, [value])

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
      const cents = parseCents(e.target.value)
      setDisplay(formatBRL(cents))
      onChange?.(cents / 100)
    }

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label htmlFor={inputId} className="text-sm font-medium text-slate-700 dark:text-slate-300">
            {label}
            {props.required && <span className="ml-1 text-red-500">*</span>}
          </label>
        )}

        <div className="relative">
          <span className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-sm text-slate-400 dark:text-slate-500">
            R$
          </span>
          <input
            ref={ref}
            id={inputId}
            inputMode="numeric"
            value={display}
            onChange={handleChange}
            className={[
              'w-full rounded-lg border bg-white py-2 pl-9 pr-3 text-sm text-slate-900',
              'dark:bg-slate-900 dark:text-slate-100',
              'placeholder:text-slate-400 dark:placeholder:text-slate-500 transition-colors duration-150',
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

CurrencyInput.displayName = 'CurrencyInput'