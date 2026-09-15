import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import Topbar from './Topbar'

/**
 * BaseLayout — Persistent dark defense shell
 *
 * Structure:
 *   ┌─────────────────────────────────────────┐
 *   │  Sidebar  │  Topbar                      │
 *   │  (fixed)  ├─────────────────────────────┤
 *   │           │  <Outlet /> (page content)   │
 *   └───────────┴─────────────────────────────┘
 */
export default function BaseLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)

  return (
    <div className="dashboard-theme flex h-screen overflow-hidden bg-[#070F1E] text-slate-100">

      {/* Sidebar */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
      />

      {/* Right column: Topbar + scrollable content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <Topbar
          sidebarCollapsed={sidebarCollapsed}
          onMenuToggle={() => setSidebarCollapsed((c) => !c)}
        />

        {/* Page content */}
        <main
          className="flex-1 overflow-y-auto
            [&::-webkit-scrollbar]:w-1.5
            [&::-webkit-scrollbar-track]:bg-[#0D1F38]
            [&::-webkit-scrollbar-thumb]:bg-[#1E5FA8]/40
            [&::-webkit-scrollbar-thumb]:rounded-full"
        >
          {/* Inner padding wrapper */}
          <div className="p-5 md:p-7 min-h-full">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  )
}
