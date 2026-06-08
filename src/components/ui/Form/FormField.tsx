// =============================================================================
// FormField.tsx + FormError.tsx
// =============================================================================

import type { ReactNode } from 'react'

// --- FormError ---------------------------------------------------------------
interface FormErrorProps {
  message?: string
  className?: string
}

export function FormError({ message, className = '' }: FormErrorProps) {
  if (!message) return null
  return (
    <p className={['text-xs text-red-600', className].join(' ')} role="alert">
      {message}
    </p>
  )
}

// --- FormField ---------------------------------------------------------------
interface FormFieldProps {
  label?: string
  error?: string
  hint?: string
  required?: boolean
  htmlFor?: string
  children: ReactNode
  className?: string
}

export function FormField({
  label,
  error,
  hint,
  required,
  htmlFor,
  children,
  className = '',
}: FormFieldProps) {
  return (
    <div className={['flex flex-col gap-1.5', className].join(' ')}>
      {label && (
        <label htmlFor={htmlFor} className="text-sm font-medium text-slate-700">
          {label}
          {required && <span className="ml-1 text-red-500">*</span>}
        </label>
      )}
      {children}
      <FormError message={error} />
      {!error && hint && <p className="text-xs text-slate-500">{hint}</p>}
    </div>
  )
}
