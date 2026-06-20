import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Menu, ChevronDown, Settings, LogOut } from 'lucide-react'
import { useAuthContext } from '../../../contexts/AuthContext'
import { ROUTES } from '../../../router/routes'

interface HeaderProps {
  onToggleSidebar: () => void
  sidebarCollapsed: boolean
}

export function Header({ onToggleSidebar, sidebarCollapsed }: HeaderProps) {
  const { user, logout } = useAuthContext()
  const navigate = useNavigate()
  const [menuOpen, setMenuOpen] = useState(false)

  return (
    <header className="flex h-16 shrink-0 items-center justify-between border-b border-slate-200 bg-white px-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      {/* Left */}
      <button
        onClick={onToggleSidebar}
        aria-label={sidebarCollapsed ? 'Expandir menu' : 'Recolher menu'}
        className="flex h-8 w-8 items-center justify-center rounded-lg text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-slate-200"
      >
        <Menu size={18} />
      </button>

      {/* Right */}
      <div className="relative">
        <button
          onClick={() => setMenuOpen((v) => !v)}
          className="flex items-center gap-2 rounded-lg px-2 py-1.5 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-blue-600 font-display text-xs font-semibold text-white">
            {user?.name?.charAt(0).toUpperCase() ?? 'U'}
          </div>
          <span className="hidden text-sm font-medium text-slate-700 dark:text-slate-300 sm:block">
            {user?.name ?? 'Usuario'}
          </span>
          <ChevronDown size={14} className="text-slate-400 dark:text-slate-500" />
        </button>

        {menuOpen && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setMenuOpen(false)} />
            <div className="absolute right-0 top-full z-20 mt-1 w-48 rounded-xl border border-slate-200 bg-white py-1 shadow-lg animate-in dark:border-slate-700 dark:bg-slate-900">
              <div className="border-b border-slate-100 px-4 py-2.5 dark:border-slate-800">
                <p className="text-xs font-medium text-slate-900 truncate dark:text-slate-100">{user?.name}</p>
                <p className="text-xs text-slate-500 truncate dark:text-slate-400">{user?.email}</p>
              </div>
              <button
                onClick={() => { setMenuOpen(false); navigate(ROUTES.SETTINGS) }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-slate-700 transition-colors hover:bg-slate-50 dark:text-slate-300 dark:hover:bg-slate-800"
              >
                <Settings size={14} />
                Configurações
              </button>
              <button
                onClick={() => { setMenuOpen(false); logout() }}
                className="flex w-full items-center gap-2 px-4 py-2 text-sm text-red-600 transition-colors hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-900/20"
              >
                <LogOut size={14} />
                Sair
              </button>
            </div>
          </>
        )}
      </div>
    </header>
  )
}