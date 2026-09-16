import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../../context/AuthContext'

/**
 * Topbar — Active network status + Officer profile menu
 */

export default function Topbar({ onMenuToggle, sidebarCollapsed, theme, onThemeToggle }) {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const [profileOpen, setProfileOpen] = useState(false)

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : 'OF'

  const handleLogout = () => {
    setProfileOpen(false)
    logout()
    navigate('/')
  }

  return (
    <header className="h-14 shrink-0 flex items-center justify-between px-4 md:px-6 border-b border-[#1F293D] bg-[#070F1E] z-20">

      {/* ── Left: Mobile hamburger + page breadcrumb ─────── */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          className="md:hidden w-8 h-8 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all"
          aria-label="Toggle navigation"
        >
          <span className="material-symbols-outlined text-[22px]">menu</span>
        </button>

        {/* Network status pill */}
        <div className="flex items-center gap-2 bg-[#0D1F38] border border-[#1F293D] rounded-full px-3 py-1.5">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-60" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-bold tracking-wider text-emerald-300 hidden sm:inline">
            34 Sovereign Nodes
          </span>
          <span className="text-[10px] text-emerald-400/60 hidden sm:inline">•</span>
          <span className="text-[11px] font-semibold text-emerald-400 hidden sm:inline">
            Active
          </span>
        </div>

        {/* Block counter */}
        <span className="hidden lg:flex items-center gap-1.5 text-[11px] font-mono text-slate-500">
          <span className="material-symbols-outlined text-[14px] text-[#1E5FA8]">receipt_long</span>
          Block #4,928,192
        </span>
      </div>

      {/* ── Right: Profile dropdown ──────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={onThemeToggle}
          className="w-9 h-9 rounded-lg flex items-center justify-center text-slate-400 hover:text-slate-100 hover:bg-white/5 transition-all"
          aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
          title={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
        >
          <span className="material-symbols-outlined text-[20px]">
            {theme === 'dark' ? 'light_mode' : 'dark_mode'}
          </span>
        </button>

        <div className="relative">
        <button
          onClick={() => setProfileOpen((p) => !p)}
          className="flex items-center gap-2.5 pl-2 pr-3 py-1.5 rounded-xl hover:bg-white/5 transition-all"
        >
          {/* Avatar */}
          <div className="w-7 h-7 rounded-full bg-[#1E3E62] border border-[#1E5FA8]/40 flex items-center justify-center shrink-0">
            <span className="text-[11px] font-black text-[#7ab0fe]">{initials}</span>
          </div>
          <div className="hidden sm:flex flex-col items-start leading-none">
            <span className="text-[12px] font-bold text-slate-200">{user?.name ?? 'Officer'}</span>
            <span className="text-[10px] font-medium text-[#D4AF37]/80 capitalize">{user?.role ?? 'user'}</span>
          </div>
          <span className="material-symbols-outlined text-[16px] text-slate-500">expand_more</span>
        </button>

        {/* Dropdown */}
        {profileOpen && (
          <>
            <div
              className="fixed inset-0 z-10"
              onClick={() => setProfileOpen(false)}
              aria-hidden="true"
            />
            <div className="absolute right-0 top-full mt-2 w-52 rounded-xl bg-[#0D1F38] border border-[#1F293D] shadow-[0_16px_48px_rgba(0,0,0,0.6)] overflow-hidden z-20">
              {/* User info */}
              <div className="px-4 py-3 border-b border-[#1F293D]">
                <p className="text-[12px] font-bold text-slate-200 truncate">{user?.name ?? 'Officer'}</p>
                <p className="text-[10px] text-slate-500 truncate">{user?.email ?? ''}</p>
                <span className="inline-block mt-1 text-[9px] font-bold tracking-widest text-[#D4AF37] uppercase bg-[#D4AF37]/10 border border-[#D4AF37]/20 px-2 py-0.5 rounded-full">
                  {user?.role ?? 'user'}
                </span>
              </div>

              {/* Actions */}
              <div className="py-1">
                {[
                  { icon: 'person', label: 'My Profile',   path: '/profile' },
                  { icon: 'settings', label: 'Settings',   path: '/settings' },
                  { icon: 'help',   label: 'Support',      path: '/support' },
                ].map(({ icon, label, path }) => (
                  <button
                    key={path}
                    onClick={() => { setProfileOpen(false); navigate(path) }}
                    className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-slate-400 hover:text-slate-200 hover:bg-white/5 transition-all text-left"
                  >
                    <span className="material-symbols-outlined text-[18px]">{icon}</span>
                    {label}
                  </button>
                ))}
              </div>

              {/* Logout */}
              <div className="border-t border-[#1F293D] py-1">
                <button
                  onClick={handleLogout}
                  className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-400 hover:text-red-300 hover:bg-red-950/30 transition-all text-left"
                >
                  <span className="material-symbols-outlined text-[18px]">logout</span>
                  Logout
                </button>
              </div>
            </div>
          </>
        )}
        </div>
      </div>
    </header>
  )
}
