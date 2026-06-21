import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'
import { Header } from '../Header/Header'

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden bg-slate-100 dark:bg-slate-950">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />
      {/* Main */}
      <div className="relative flex flex-1 flex-col min-h-0">
        <Header
          onToggleSidebar={() => setCollapsed((v) => !v)}
          sidebarCollapsed={collapsed}
        />
        <main className="relative flex-1 overflow-y-auto">
          {/* Glow ambiente decorativo */}
          <div className="pointer-events-none absolute inset-x-0 top-0 -z-0 h-[420px] overflow-hidden">
            <div className="absolute -top-32 left-1/4 h-72 w-72 rounded-full bg-blue-200/40 blur-3xl dark:bg-blue-900/20" />
            <div className="absolute -top-20 right-1/4 h-64 w-64 rounded-full bg-purple-200/30 blur-3xl dark:bg-purple-900/10" />
          </div>
          <div className="relative mx-auto max-w-7xl p-6 page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}