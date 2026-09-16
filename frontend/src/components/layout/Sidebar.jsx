import { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const ROLE_LINKS = {
  ADMIN: [
    { path: '/admin', icon: 'dashboard', label: 'Admin Dashboard' },
    { path: '/admin/identities', icon: 'manage_accounts', label: 'Identity Ledger' },
    { path: '/admin/roles', icon: 'admin_panel_settings', label: 'Role & Clearance' },
    { path: '/admin/mint-asset', icon: 'token', label: 'Mint Asset' },
    { path: '/admin/assets', icon: 'inventory_2', label: 'Asset Ledger' },
    { path: '/admin/transfers', icon: 'swap_horiz', label: 'Transfer Approvals' },
    { path: '/admin/nodes', icon: 'hub', label: 'Sovereign Nodes' },
    { path: '/admin/audit', icon: 'policy', label: 'Audit Vault' },
  ],
  MANAGER: [
    { path: '/manager/dashboard', icon: 'dashboard', label: 'Manager Dashboard' },
    { path: '/team', icon: 'groups', label: 'Team Members' },
    { path: '/team-assets', icon: 'inventory_2', label: 'Team Assets' },
    { path: '/transfer/initiate', icon: 'swap_horiz', label: 'Initiate Transfer' },
    { path: '/transfers', icon: 'approval', label: 'Transfer Approvals' },
    { path: '/assets/ledger', icon: 'token', label: 'Asset Provenance Ledger' },
    { path: '/did/issue', icon: 'badge', label: 'DID Issuance' },
    { path: '/dispatch/sign', icon: 'verified_user', label: 'Sign Dispatch' },
  ],
  AUDITOR: [
    { path: '/auditor/dashboard', icon: 'dashboard', label: 'Auditor Dashboard' },
    { path: '/audit/explorer', icon: 'search', label: 'Audit Trail Explorer' },
    { path: '/audit/ledgers', icon: 'menu_book', label: 'Read-Only Ledgers' },
    { path: '/audit/logs', icon: 'receipt_long', label: 'Verification Logs' },
  ],
  USER: [
    { path: '/dashboard', icon: 'dashboard', label: 'My Dashboard' },
    { path: '/my-assets', icon: 'inventory_2', label: 'My Assets' },
    { path: '/transfer/request', icon: 'swap_horiz', label: 'Request Transfer' },
    { path: '/profile', icon: 'person', label: 'My Profile' },
  ],
};

function NavIcon({ name, active }) {
  return (
    <span
      className={`material-symbols-outlined text-[20px] shrink-0 transition-colors ${active ? 'text-[#D4AF37]' : 'text-slate-400 group-hover:text-slate-200'
        }`}
      style={active ? { fontVariationSettings: '"FILL" 1' } : {}}
    >
      {name}
    </span>
  );
}

export default function Sidebar({ collapsed, onToggle }) {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const role = user?.role ?? 'USER';
  const links = ROLE_LINKS[role] ?? ROLE_LINKS.USER;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <>
      {/* Desktop sidebar */}
      <aside
        className={`hidden md:flex flex-col h-screen sticky top-0 shrink-0 transition-all duration-300 z-30
          bg-[#060D1A] border-r border-[#1F293D]
          ${collapsed ? 'w-[64px]' : 'w-[220px]'}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-3 px-4 py-5 border-b border-[#1F293D] shrink-0">
          <img
            src="/bel-shield.svg"
            alt="BEL Shield"
            className="w-8 h-8 object-contain shrink-0"
          />
          {!collapsed && (
            <div className="overflow-hidden">
              <div className="text-[15px] font-black text-white tracking-widest leading-none">
                BEL<span className="text-[#1E5FA8]">TAL</span>
              </div>
              <div className="text-[8px] font-bold tracking-[0.18em] text-[#D4AF37]/80 uppercase mt-0.5">
                Sovereign Ledger
              </div>
            </div>
          )}
        </div>

        {/* Role badge */}
        {!collapsed && (
          <div className="mx-3 my-3 px-3 py-1.5 rounded-lg bg-[#0D1F38] border border-[#1F293D] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span className="text-[10px] font-bold tracking-widest text-[#7ab0fe] uppercase">
              {role}
            </span>
          </div>
        )}

        {/* Nav links */}
        <nav className="flex-1 overflow-y-auto py-2 px-2 space-y-1">
          {links.map(({ path, icon, label }) => (
            <NavLink
              key={path}
              to={path}
              className={({ isActive }) =>
                `group flex items-center gap-3 px-3 py-2.5 rounded-lg text-[13px] font-semibold tracking-wide transition-all duration-150
                ${isActive
                  ? 'bg-[#1E3E62]/60 text-[#D4AF37] border border-[#1E5FA8]/30'
                  : 'text-slate-400 hover:bg-white/5 hover:text-slate-200 border border-transparent'
                }`
              }
              title={collapsed ? label : undefined}
            >
              {({ isActive }) => (
                <>
                  <NavIcon name={icon} active={isActive} />
                  {!collapsed && <span className="truncate">{label}</span>}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer: collapse toggle + logout */}
        <div className="shrink-0 border-t border-[#1F293D] p-2 space-y-1">
          <button
            onClick={onToggle}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-slate-500 hover:text-slate-300 hover:bg-white/5 transition-all text-[13px] font-medium"
            title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            <span className="material-symbols-outlined text-[20px]">
              {collapsed ? 'chevron_right' : 'chevron_left'}
            </span>
            {!collapsed && <span>Collapse</span>}
          </button>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 w-full px-3 py-2 rounded-lg text-red-500/80 hover:text-red-400 hover:bg-red-950/30 transition-all text-[13px] font-medium"
          >
            <span className="material-symbols-outlined text-[20px]">logout</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>
    </>
  );
}