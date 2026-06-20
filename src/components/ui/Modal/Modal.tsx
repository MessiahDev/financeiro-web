import { useEffect, useRef, type ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  title: string
  children: ReactNode
  footer?: ReactNode
  size?: 'sm' | 'md' | 'lg' | 'xl'
}

const sizes = {
  sm: 'max-w-sm',
  md: 'max-w-md',
  lg: 'max-w-lg',
  xl: 'max-w-2xl',
}

export function Modal({ isOpen, onClose, title, children, footer, size = 'md' }: ModalProps) {
  const overlayRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!isOpen) return
    const handler = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose() }
    document.addEventListener('keydown', handler)
    return () => document.removeEventListener('keydown', handler)
  }, [isOpen, onClose])

  useEffect(() => {
    document.body.style.overflow = isOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [isOpen])

  if (!isOpen) return null

  return createPortal(
    <div
      ref={overlayRef}
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      onClick={(e) => { if (e.target === overlayRef.current) onClose() }}
    >
      <div className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm dark:bg-black/60" />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
        className={[
          'relative z-10 w-full rounded-2xl bg-white shadow-xl dark:bg-slate-900 dark:border dark:border-slate-800',
          'flex flex-col max-h-[90vh]',
          sizes[size],
        ].join(' ')}
      >
        <div className="flex shrink-0 items-center justify-between border-b border-slate-100 px-6 py-4 dark:border-slate-800">
          <h2 id="modal-title" className="font-display text-base font-semibold text-slate-900 dark:text-slate-100">
            {title}
          </h2>
          <button
            onClick={onClose}
            aria-label="Fechar"
            className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-500 dark:hover:bg-slate-800 dark:hover:text-slate-200"
          >
            <X size={16} />
          </button>
        </div>
        <div className="overflow-y-auto px-6 py-5">{children}</div>
        {footer && (
          <div className="flex shrink-0 justify-end gap-3 border-t border-slate-100 px-6 py-4 dark:border-slate-800">
            {footer}
          </div>
        )}
      </div>
    </div>,
    document.body
  )
}