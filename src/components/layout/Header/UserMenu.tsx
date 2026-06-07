import { useState } from 'react'
import { useAuthContext } from '../../../contexts/AuthContext'

export function UserMenu() {
  const { user, logout } = useAuthContext()
  const [open, setOpen] = useState(false)

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100"
      >
        <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 font-display text-xs font-semibold text-white">
          {user?.name?.charAt(0).toUpperCase() ?? 'U'}
        </div>
        <span className="hidden text-sm font-medium text-slate-700 sm:block">
          {user?.name ?? 'Usuario'}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-slate-400">
          <polyline points="6 9 12 15 18 9" />
        </svg>
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg animate-in">
            <div className="border-b border-slate-100 px-4 py-2.5">
              <p className="truncate text-xs font-medium text-slate-900">{user?.name}</p>
              <p className="truncate text-xs text-slate-500">{user?.email}</p>
            </div>
            <button
              onClick={() => { setOpen(false); logout() }}
              className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50"
            >
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                <polyline points="16 17 21 12 16 7" />
                <line x1="21" y1="12" x2="9" y2="12" />
              </svg>
              Sair
            </button>
          </div>
        </>
      )}
    </div>
  )
}