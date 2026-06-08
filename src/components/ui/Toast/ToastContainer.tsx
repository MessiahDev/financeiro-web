// =============================================================================
// ToastContainer.tsx — container fixo que renderiza a lista de toasts
// =============================================================================

import { Toast, type ToastData } from './Toast'

interface ToastContainerProps {
  toasts:  ToastData[]
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
