import type { ReactNode } from 'react'

interface SidebarGroupProps {
  label: string
  collapsed?: boolean
  children: ReactNode
}

export function SidebarGroup({ label, collapsed = false, children }: SidebarGroupProps) {
  return (
    <div className="mb-4">
      {!collapsed && (
        <p className="mb-1 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
          {label}
        </p>
      )}
      <div className="flex flex-col gap-0.5">{children}</div>
    </div>
  )
}
