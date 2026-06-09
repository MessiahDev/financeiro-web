import { NavLink } from 'react-router-dom'

interface SidebarItemProps {
  label: string
  path: string
  icon: string
  collapsed?: boolean
  isActive?: boolean
}

export function SidebarItem({ label, path, icon, collapsed = false, isActive }: SidebarItemProps) {
  return (
    <NavLink
      to={path}
      title={collapsed ? label : undefined}
      className={({ isActive: routerActive }) => {
        const active = isActive ?? routerActive
        return [
          'flex items-center gap-3 rounded-lg px-3 py-2 text-sm transition-colors duration-150',
          active
            ? 'bg-blue-600/20 text-blue-400 font-medium'
            : 'text-slate-400 hover:bg-white/5 hover:text-white',
        ].join(' ')
      }}
    >
      <span className="shrink-0 text-base leading-none">{icon}</span>
      {!collapsed && <span className="truncate">{label}</span>}
    </NavLink>
  )
}
