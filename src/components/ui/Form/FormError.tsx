// =============================================================================
// FormError.tsx — exibe mensagem de erro de campo de formulario
// =============================================================================

interface FormErrorProps {
  message?:   string
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
