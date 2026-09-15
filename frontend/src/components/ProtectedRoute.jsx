/**
 * ProtectedRoute — BELTAL role-based access control guard
 *
 * Behaviour
 * ─────────
 * 1. Not authenticated           → redirect to /  (home / login)
 * 2. Authenticated, wrong role   → render institutional 403 card
 *                                  (no redirect — user sees clear feedback)
 * 3. Authenticated, correct role → render <Outlet />
 *
 * Props
 * ─────
 * allowedRoles : string[]  — backend role strings (ADMIN, OFFICER, AUDITOR, USER …)
 *                            If omitted, any authenticated user is allowed.
 */

import { Navigate, Outlet, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { shortenAddress } from '../context/AuthContext';

/* ── Role → display label ───────────────────────────────────── */
const ROLE_LABELS = {
  ADMIN:   'System Administrator',
  OFFICER: 'Defence Officer',
  AUDITOR: 'Sovereign Auditor',
  USER:    'Registered Personnel',
  SYSTEM_CONNECTOR: 'System Connector',
};

const ROLE_DASHBOARDS = {
  ADMIN:   '/admin/users',
  OFFICER: '/dashboard',
  AUDITOR: '/audit/ledgers',
  USER:    '/dashboard',
};

/* ── Role badge colour map ───────────────────────────────────── */
function roleBadgeClass(role) {
  return {
    ADMIN:   'text-amber-300 bg-amber-900/30 border-amber-700/40',
    OFFICER: 'text-blue-300  bg-blue-900/30  border-blue-700/40',
    AUDITOR: 'text-purple-300 bg-purple-900/30 border-purple-700/40',
    USER:    'text-slate-300 bg-slate-800/40  border-slate-600/40',
  }[role] ?? 'text-slate-400 bg-slate-800/30 border-slate-600/30';
}

/* ── 403 Card ────────────────────────────────────────────────── */
function AccessDenied({ user, allowedRoles }) {
  const dashPath = ROLE_DASHBOARDS[user?.role] ?? '/';
  const roleLabel = ROLE_LABELS[user?.role] ?? user?.role ?? 'Unknown';

  return (
    <div className="min-h-screen bg-[#020810] flex items-center justify-center p-6">
      {/* Hex watermark */}
      <svg
        aria-hidden="true"
        className="fixed inset-0 w-full h-full pointer-events-none opacity-[0.025]"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <pattern id="hex403" x="0" y="0" width="56" height="48" patternUnits="userSpaceOnUse">
            <polygon points="28,2 52,14 52,38 28,50 4,38 4,14" fill="none" stroke="#C59B27" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#hex403)" />
      </svg>

      <div className="relative w-full max-w-lg">
        {/* Gold top accent */}
        <div className="h-[2px] w-full bg-gradient-to-r from-transparent via-[#C59B27] to-transparent mb-0 rounded-t-2xl" />

        <div className="bg-[#040B17] border border-[#1E2E48] rounded-2xl shadow-[0_0_60px_rgba(0,0,0,0.8),0_0_24px_rgba(186,26,26,0.08)] overflow-hidden p-8 text-center">
          {/* Error code */}
          <div className="mb-6">
            <span className="text-[9px] font-black tracking-[0.25em] text-red-500/70 uppercase block mb-3">
              ◈ BELTAL — Access Control Layer
            </span>
            <div className="relative inline-block">
              <span
                className="text-[72px] font-black leading-none text-red-900/30 select-none"
                aria-hidden="true"
              >
                403
              </span>
              <span className="absolute inset-0 flex items-center justify-center text-[22px] font-black text-red-400 tracking-wide">
                403
              </span>
            </div>
          </div>

          {/* Shield icon */}
          <div className="w-14 h-14 rounded-full bg-red-950/30 border border-red-800/40 flex items-center justify-center mx-auto mb-5">
            <span
              className="material-symbols-outlined text-[28px] text-red-400"
              style={{ fontVariationSettings: '"FILL" 1' }}
            >
              gpp_bad
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-[18px] font-black text-slate-100 tracking-wide mb-1">
            Security Clearance Insufficient
          </h1>
          <p className="text-[12px] text-slate-500 uppercase tracking-widest font-bold mb-6">
            Access Denied — Restricted Perimeter
          </p>

          {/* Identity strip */}
          <div className="bg-[#060D1A] border border-[#1E2E48] rounded-xl px-5 py-4 mb-6 text-left space-y-3">
            {/* Current identity */}
            <div className="flex items-center justify-between">
              <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">
                Current Identity
              </span>
              <div className="flex items-center gap-2">
                {user?.walletAddress && (
                  <code className="text-[10px] text-[#7ab0fe]">
                    {shortenAddress(user.walletAddress)}
                  </code>
                )}
                <span className={`text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded border ${roleBadgeClass(user?.role)}`}>
                  {roleLabel}
                </span>
              </div>
            </div>

            {/* Required clearance */}
            {allowedRoles?.length > 0 && (
              <div className="flex items-center justify-between border-t border-[#1E2E48] pt-3">
                <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">
                  Required Clearance
                </span>
                <div className="flex items-center gap-1.5">
                  {allowedRoles.map((r) => (
                    <span
                      key={r}
                      className="text-[9px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded border border-[#C59B27]/30 text-[#C59B27] bg-[#C59B27]/10"
                    >
                      {ROLE_LABELS[r] ?? r}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {/* Clearance level */}
            {user?.clearanceLevel !== undefined && (
              <div className="flex items-center justify-between border-t border-[#1E2E48] pt-3">
                <span className="text-[10px] font-bold tracking-widest text-slate-600 uppercase">
                  Your Clearance Level
                </span>
                <span className="text-[10px] font-bold text-slate-400">
                  Level {user.clearanceLevel}
                </span>
              </div>
            )}
          </div>

          {/* Actions */}
          <div className="flex flex-col gap-2.5">
            <Link
              to={dashPath}
              className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-[#1E5FA8] hover:bg-[#1a5299] text-white font-bold text-[13px] rounded-xl border border-[#2a72c0] transition-all"
            >
              <span className="material-symbols-outlined text-[16px]">arrow_back</span>
              Return to Authorized Dashboard
            </Link>
            <Link
              to="/"
              className="w-full flex items-center justify-center gap-2 py-2.5 px-6 bg-transparent hover:bg-white/5 text-slate-500 hover:text-slate-300 font-bold text-[12px] rounded-xl border border-[#1E2E48] transition-all"
            >
              Return to Home
            </Link>
          </div>

          {/* Classification footer */}
          <div className="mt-6 pt-4 border-t border-[#1E2E48] flex items-center justify-between">
            <span className="text-[8px] font-bold tracking-[0.18em] text-slate-700 uppercase">
              BELTAL — Sovereign Defence Ledger
            </span>
            <span className="text-[8px] font-bold tracking-widest text-[#C59B27]/40 uppercase">
              RESTRICTED
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ── Guard ────────────────────────────────────────────────────── */
export default function ProtectedRoute({ allowedRoles }) {
  const { isAuthenticated, user } = useAuth();

  /* Not logged in → send to landing page */
  if (!isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  /* Role mismatch → show 403 card (no silent redirect) */
  if (allowedRoles?.length > 0 && (!user?.role || !allowedRoles.includes(user.role))) {
    return <AccessDenied user={user} allowedRoles={allowedRoles} />;
  }

  return <Outlet />;
}