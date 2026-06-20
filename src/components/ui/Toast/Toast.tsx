import { useEffect } from 'react'
import { CheckCircle2, XCircle, AlertTriangle, Info, X } from 'lucide-react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  type: ToastType
  message: string
  duration?: number
}

interface ToastProps {
  toast: ToastData
  onClose: (id: string) => void
}

const styles: Record<ToastType, { wrapper: string; icon: string }> = {
  success: { wrapper: 'border-green-200 bg-green-50 dark:border-green-900/50 dark:bg-green-900/20',  icon: 'text-green-600 dark:text-green-400' },
  error:   { wrapper: 'border-red-200   bg-red-50 dark:border-red-900/50 dark:bg-red-900/20',         icon: 'text-red-600 dark:text-red-400' },
  warning: { wrapper: 'border-amber-200 bg-amber-50 dark:border-amber-900/50 dark:bg-amber-900/20',   icon: 'text-amber-600 dark:text-amber-400' },
  info:    { wrapper: 'border-blue-200  bg-blue-50 dark:border-blue-900/50 dark:bg-blue-900/20',      icon: 'text-blue-600 dark:text-blue-400' },
}

const icons: Record<ToastType, typeof CheckCircle2> = {
  success: CheckCircle2,
  error:   XCircle,
  warning: AlertTriangle,
  info:    Info,
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  const s = styles[toast.type]
  const Icon = icons[toast.type]

  return (
    <div
      className={[
        'flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg animate-in',
        'min-w-[280px] max-w-sm',
        s.wrapper,
      ].join(' ')}
      role="alert"
    >
      <Icon size={18} className={['mt-0.5 shrink-0', s.icon].join(' ')} />
      <p className="flex-1 text-sm text-slate-700 dark:text-slate-200">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 text-slate-400 hover:text-slate-700 dark:text-slate-500 dark:hover:text-slate-200 transition-colors"
        aria-label="Fechar"
      >
        <X size={14} />
      </button>
    </div>
  )
}

interface ToastContainerProps {
  toasts: ToastData[]
  onClose: (id: string) => void
}

export function ToastContainer({ toasts, onClose }: ToastContainerProps) {
  if (toasts.length === 0) return null

  return (
    <div className="fixed bottom-5 right-5 z-[100] flex flex-col gap-2">
      {toasts.map((t) => (
        <Toast key={t.id} toast={t} onClose={onClose} />
      ))}
    </div>
  )
}