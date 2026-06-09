import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import { Sidebar } from '../Sidebar/Sidebar'
import { Header } from '../Header/Header'

export default function MainLayout() {
  const [collapsed, setCollapsed] = useState(false)
  return (
    <div className="flex h-screen overflow-hidden bg-slate-50">
      {/* Sidebar */}
      <Sidebar collapsed={collapsed} />
      {/* Main */}
      <div className="flex flex-1 flex-col min-h-0">
        <Header
          onToggleSidebar={() => setCollapsed((v) => !v)}
          sidebarCollapsed={collapsed}
        />
        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl p-6 page-enter">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
