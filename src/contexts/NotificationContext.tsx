import { createContext, useCallback, useContext, useState, type ReactNode } from 'react'
import { ToastContainer, type ToastData, type ToastType } from '../components/ui/Toast/Toast'

interface NotificationContextValue {
  success: (message: string) => void
  error: (message: string) => void
  warning: (message: string) => void
  info: (message: string) => void
}

const NotificationContext = createContext<NotificationContextValue | null>(null)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [toasts, setToasts] = useState<ToastData[]>([])

  const push = useCallback((type: ToastType, message: string) => {
    const id = crypto.randomUUID()
    setToasts((prev) => [...prev, { id, type, message }])
  }, [])

  const remove = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  return (
    <NotificationContext.Provider
      value={{
        success: (msg) => push('success', msg),
        error:   (msg) => push('error', msg),
        warning: (msg) => push('warning', msg),
        info:    (msg) => push('info', msg),
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={remove} />
    </NotificationContext.Provider>
  )
}

export function useNotifications(): NotificationContextValue {
  const ctx = useContext(NotificationContext)
  if (!ctx) throw new Error('useNotifications deve ser usado dentro de <NotificationProvider>')
  return ctx
}