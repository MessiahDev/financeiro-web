// =============================================================================
// Toast.tsx + ToastContainer.tsx
// =============================================================================

import { useEffect } from 'react'

export type ToastType = 'success' | 'error' | 'warning' | 'info'

export interface ToastData {
  id: string
  type: ToastType
  message: string
  duration?: number
}

// --- Toast item --------------------------------------------------------------
interface ToastProps {
  toast: ToastData
  onClose: (id: string) => void
}

const styles: Record<ToastType, { wrapper: string; icon: string }> = {
  success: { wrapper: 'border-green-200 bg-green-50',  icon: 'text-green-600' },
  error:   { wrapper: 'border-red-200   bg-red-50',    icon: 'text-red-600' },
  warning: { wrapper: 'border-amber-200 bg-amber-50',  icon: 'text-amber-600' },
  info:    { wrapper: 'border-blue-200  bg-blue-50',   icon: 'text-blue-600' },
}

const icons: Record<ToastType, string> = {
  success: '✓',
  error:   '✕',
  warning: '⚠',
  info:    'ℹ',
}

export function Toast({ toast, onClose }: ToastProps) {
  useEffect(() => {
    const timer = setTimeout(() => onClose(toast.id), toast.duration ?? 4000)
    return () => clearTimeout(timer)
  }, [toast, onClose])

  const s = styles[toast.type]

  return (
    <div
      className={[
        'flex items-start gap-3 rounded-xl border px-4 py-3 shadow-lg animate-in',
        'min-w-[280px] max-w-sm',
        s.wrapper,
      ].join(' ')}
      role="alert"
    >
      <span className={['mt-0.5 shrink-0 text-sm font-bold', s.icon].join(' ')}>
        {icons[toast.type]}
      </span>
      <p className="flex-1 text-sm text-slate-700">{toast.message}</p>
      <button
        onClick={() => onClose(toast.id)}
        className="shrink-0 text-slate-400 hover:text-slate-700 transition-colors"
        aria-label="Fechar"
      >
        ✕
      </button>
    </div>
  )
}

// --- Toast container ---------------------------------------------------------
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
