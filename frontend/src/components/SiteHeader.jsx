/**
 * SiteHeader — shared navbar used by every page.
 *
 * On the Home page  → nav links scroll to anchor sections (#platform, etc.)
 * On other pages    → nav links navigate to /#section (full URL with hash)
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, shortenAddress } from '../context/AuthContext'
import LoginModal from './auth/LoginModal'

/* ── Brand lockup ────────────────────────────────────────── */
function BELNavBrand() {
  return (
    <div className="flex items-center gap-4 py-1 shrink-0">
      <img
        src="/bel-shield.svg"
        alt="BEL Emblem"
        className="h-12 md:h-14 w-auto object-contain flex-shrink-0 drop-shadow-sm"
      />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="bg-[#0B1E36] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
            BEL
          </span>
          <span className="text-[10px] font-bold tracking-[0.14em] text-[#A37E2C] uppercase whitespace-nowrap">
            Govt. of India • Sovereign Ledger
          </span>
        </div>

        <div className="text-2xl md:text-2xl font-black tracking-wider leading-none">
          <span className="text-[#0B2545]">BEL</span>
          <span className="text-[#1565C0]">TAL</span>
        </div>

        <div className="pt-0.5 border-b-2 border-[#C59B27] w-fit">
          <span className="text-[8px] font-bold tracking-wider text-slate-500 uppercase block whitespace-nowrap">
            Blockchain-Enabled Trusted Access &amp; Digital Asset Ledger &amp; ASSET PROVENANCE
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Profile dropdown menu ───────────────────────────────── */
function ProfileMenu() {
  const { user, isAuthenticated, logout } = useAuth()
  const navigate = useNavigate()
  const [open, setOpen] = useState(false)
  const wrapperRef = useRef(null)

  /* Close on outside click */
  useEffect(() => {
    if (!open) return
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [open])

  /* Close on Escape */
  useEffect(() => {
    if (!open) return
    const handler = (e) => { if (e.key === 'Escape') setOpen(false) }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [open])

  const initials = user?.name
    ? user.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()
    : null
  const roleLabel = user?.role ?? 'Guest'
  const roleBadgeColor = {
    ADMIN: 'text-amber-300 bg-amber-900/40 border-amber-700/30',
    OFFICER: 'text-blue-300  bg-blue-900/40  border-blue-700/30',
    AUDITOR: 'text-purple-300 bg-purple-900/40 border-purple-700/30',
    USER: 'text-slate-300 bg-slate-800/60  border-slate-600/30',
  }[user?.role] ?? 'text-slate-400 bg-slate-800/40 border-slate-600/20'

  const handleLogout = () => {
    setOpen(false)
    logout()
    navigate('/')
  }

  const go = (path) => { setOpen(false); navigate(path) }

  return (
    <div ref={wrapperRef} className="relative shrink-0">
      {/* Trigger button */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open officer console"
        aria-expanded={open}
        className={`w-9 h-9 rounded-full flex items-center justify-center transition-all duration-200 ring-2 ring-offset-2 ring-offset-[#FFFDF5] shadow-sm
          ${open
            ? 'bg-[#0D2B4E] ring-[#1E5FA8]'
            : 'bg-[#0B1E36] ring-transparent hover:ring-[#1E5FA8]/60'
          }`}
      >
        {initials ? (
          <span className="text-[11px] font-black text-white leading-none">{initials}</span>
        ) : (
          <span className="material-symbols-outlined text-white text-[20px]" style={{ fontVariationSettings: '"FILL" 1' }}>
            person
          </span>
        )}
      </button>

      {/* Dropdown panel */}
      {open && (
        <div
          className="absolute right-0 mt-2.5 w-64 bg-[#0B1726] border border-[#1E2E48] rounded-xl shadow-2xl z-50 overflow-hidden"
          style={{ animation: 'dropIn 180ms cubic-bezier(0.16,1,0.3,1)' }}
          role="menu"
        >
          <div className="px-4 pt-4 pb-3 border-b border-[#1E2E48]">
            <span className="text-[10px] uppercase font-bold tracking-widest bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded border border-blue-800/30">
              Officer Console
            </span>

            {isAuthenticated ? (
              <div className="mt-3">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-full bg-[#1E3E62] border border-[#1E5FA8]/30 flex items-center justify-center shrink-0">
                    <span className="text-[12px] font-black text-[#7ab0fe]">{initials ?? '??'}</span>
                  </div>
                  <div className="overflow-hidden">
                    <p className="text-[13px] font-bold text-slate-100 truncate">{user?.name ?? 'Officer'}</p>
                    <span className={`inline-block text-[9px] font-bold tracking-widest uppercase px-1.5 py-0.5 rounded border mt-0.5 ${roleBadgeColor}`}>
                      {roleLabel}
                    </span>
                  </div>
                </div>

                {user?.did && (
                  <div className="mt-2.5 bg-[#060D1A] border border-[#1E2E48] rounded-lg px-3 py-1.5">
                    <p className="text-[9px] font-bold tracking-widest text-slate-500 uppercase mb-0.5">Sovereign DID</p>
                    <code className="text-[10px] text-[#7ab0fe] break-all leading-tight">{user.did}</code>
                  </div>
                )}
              </div>
            ) : (
              <div className="mt-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-full bg-[#0D1F38] border border-[#1F293D] flex items-center justify-center shrink-0">
                    <span className="material-symbols-outlined text-slate-500 text-[18px]">person_off</span>
                  </div>
                  <div>
                    <p className="text-[12px] font-bold text-slate-400">Not authenticated</p>
                    <p className="text-[10px] text-slate-600">Guest / Public access</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          <div className="py-1.5">
            {isAuthenticated ? (
              <>
                <MenuRow icon="dashboard" label="Sovereign Dashboard" onClick={() => go('/dashboard')} />
                <MenuRow icon="hub" label="Inspect Sovereign Nodes" onClick={() => go('/admin/nodes')} />
                <MenuRow icon="menu_book" label="Audit Ledger" onClick={() => go('/audit/ledgers')} />
                <MenuRow icon="grid_view" label="UI Kit Showcase" onClick={() => go('/ui-kit')} />
              </>
            ) : (
              <>
                <MenuRow icon="lock_open" label="Sovereign Portal Login" highlight onClick={() => go('/login')} />
                <MenuRow icon="grid_view" label="Component UI Kit Showcase" onClick={() => go('/ui-kit')} />
              </>
            )}

            <div className="border-b border-slate-700/60 my-1.5" />

            {isAuthenticated ? (
              <button
                role="menuitem"
                onClick={handleLogout}
                className="w-full flex items-center gap-3 px-4 py-2.5 text-[13px] text-red-400/80 hover:text-red-400 hover:bg-red-950/30 transition-all text-left"
              >
                <span className="material-symbols-outlined text-[18px]">logout</span>
                Logout
              </button>
            ) : (
              <MenuRow
                icon="info"
                label="About BELTAL"
                onClick={() => { setOpen(false); document.querySelector('#about-bel')?.scrollIntoView({ behavior: 'smooth' }) }}
              />
            )}
          </div>
        </div>
      )}

      <style>{`
        @keyframes dropIn {
          from { opacity: 0; transform: translateY(-6px) scale(0.97); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
      `}</style>
    </div>
  )
}

/* ── Reusable menu row ──────────────────────────────────── */
function MenuRow({ icon, label, onClick, highlight = false }) {
  return (
    <button
      role="menuitem"
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-4 py-2 text-[13px] transition-all text-left
        ${highlight
          ? 'text-[#7ab0fe] hover:bg-[#1E3E62]/40 font-semibold'
          : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
        }`}
    >
      <span className="material-symbols-outlined text-[18px] shrink-0">{icon}</span>
      {label}
    </button>
  )
}

/* ── Wallet connect CTA / address pill ─────────────────────── */
function WalletCTA({ onOpenModal }) {
  const { isAuthenticated, user } = useAuth()

  if (isAuthenticated && user?.walletAddress) {
    return (
      <div
        title={user.walletAddress}
        className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-[#0B1E36] border border-[#1E3E62]/60 shadow-sm shrink-0"
      >
        <span
          className="w-2 h-2 rounded-full bg-emerald-400 shrink-0 shadow-[0_0_6px_rgba(52,211,153,0.8)]"
          aria-label="Connected"
        />
        <code className="text-[11px] font-bold text-[#7ab0fe] tracking-wide whitespace-nowrap">
          {shortenAddress(user.walletAddress)}
        </code>
        <span className="text-[8px] font-black tracking-widest uppercase px-1.5 py-0.5 rounded bg-[#1E3E62]/60 text-[#C59B27] border border-[#C59B27]/20">
          {user.role}
        </span>
      </div>
    )
  }

  return (
    <button
      id="beltal-connect-wallet-header-btn"
      onClick={onOpenModal}
      className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#1E5FA8] hover:bg-[#1a5299] active:bg-[#163f7a] text-white text-[12px] font-black tracking-wide border border-[#2a72c0] shadow-sm transition-all duration-200 shrink-0 whitespace-nowrap"
    >
      <span
        className="material-symbols-outlined text-[16px]"
        style={{ fontVariationSettings: '"FILL" 1' }}
      >
        account_balance_wallet
      </span>
      Connect Sovereign Wallet
    </button>
  )
}

/* ── Main export ─────────────────────────────────────────── */
export default function SiteHeader({ mode = 'home' }) {
  const isHome = mode === 'home'
  const [loginModalOpen, setLoginModalOpen] = useState(false)

  const navLinks = [
    { label: 'Platform', href: isHome ? '#platform' : '/#platform' },
    { label: 'Features', href: isHome ? '#features' : '/#features' },
    { label: 'Technology', href: isHome ? '#technology' : '/#technology' },
    { label: 'Use Cases', href: isHome ? '#use-cases' : '/#use-cases' },
    { label: 'About BEL', href: isHome ? '#about-bel' : '/#about-bel' },
  ]

  const [activeTab, setActiveTab] = useState('#platform')
  const [indicatorStyle, setIndicatorStyle] = useState({ translateX: 0, width: 0, opacity: 0 })
  const navRefs = useRef({})

  useEffect(() => {
    if (!isHome) return
    const el = navRefs.current[activeTab]
    if (!el) return
    let raf1 = requestAnimationFrame(() => {
      let raf2 = requestAnimationFrame(() => {
        setIndicatorStyle({ translateX: el.offsetLeft, width: el.offsetWidth, opacity: 1 })
      })
      return () => cancelAnimationFrame(raf2)
    })
    return () => cancelAnimationFrame(raf1)
  }, [activeTab, isHome])

  useEffect(() => {
    if (!isHome) return
    const onResize = () => {
      const el = navRefs.current[activeTab]
      if (el) setIndicatorStyle({ translateX: el.offsetLeft, width: el.offsetWidth, opacity: 1 })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeTab, isHome])

  useEffect(() => {
    if (!isHome) return
    const sectionIds = navLinks.filter(l => l.href.startsWith('#')).map(l => l.href.slice(1))
    const ratioMap = {}

    const observers = []
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      ratioMap[id] = 0

      const obs = new IntersectionObserver(
        ([entry]) => {
          ratioMap[id] = entry.intersectionRatio
          const best = Object.entries(ratioMap).reduce(
            (a, b) => (b[1] > a[1] ? b : a),
            ['', 0]
          )
          if (best[1] > 0) setActiveTab(`#${best[0]}`)
        },
        { threshold: Array.from({ length: 21 }, (_, i) => i * 0.05) }
      )
      obs.observe(el)
      observers.push(obs)
    })

    return () => observers.forEach(o => o.disconnect())
  }, [isHome])

  const handleClick = (e, href) => {
    if (!isHome) return
    e.preventDefault()
    setActiveTab(href)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  useEffect(() => {
    const handler = () => setLoginModalOpen(false)
    window.addEventListener('beltal:logout', handler)
    return () => window.removeEventListener('beltal:logout', handler)
  }, [])

  return (
    <>
      <LoginModal isOpen={loginModalOpen} onClose={() => setLoginModalOpen(false)} />
      <header className="sticky top-0 w-full z-40 border-b border-surface-container-highest shadow-[0_1px_8px_rgba(13,43,78,0.06)] bg-[#FFFDF5]">
        {/* Adjusted to max-w-[1440px] with responsive padding for spacious distribution */}
        <div className="h-20 max-w-[1440px] mx-auto px-6 lg:px-10 flex items-center justify-between gap-6">

          {/* Brand lockup */}
          <Link to="/" className="flex items-center shrink-0">
            <BELNavBrand />
          </Link>

          {/* Nav links with comfortable horizontal gap and single-line enforcement */}
          <nav className="hidden lg:flex items-center gap-7 xl:gap-9 h-full relative shrink-0">
            {navLinks.map(({ label, href }) => {
              const isActive = isHome && activeTab === href
              return (
                <a
                  key={href}
                  href={href}
                  ref={el => { navRefs.current[href] = el }}
                  onClick={e => handleClick(e, href)}
                  className={`whitespace-nowrap transition-colors duration-200 py-2 text-sm tracking-wide ${isActive
                      ? 'text-[#1565C0] font-bold'
                      : 'text-slate-600 hover:text-[#0B2545] font-semibold'
                    }`}
                >
                  {label}
                </a>
              )
            })}

            {/* Sliding underline indicator */}
            {isHome && (
              <span
                aria-hidden="true"
                style={{
                  position: 'absolute',
                  bottom: 0,
                  left: 0,
                  width: indicatorStyle.width,
                  opacity: indicatorStyle.opacity,
                  height: '2.5px',
                  background: '#1565C0',
                  borderRadius: '2px',
                  transform: `translateX(${indicatorStyle.translateX}px)`,
                  willChange: 'transform, width',
                  transition: [
                    'transform 320ms cubic-bezier(0.4, 0, 0.2, 1)',
                    'width 320ms cubic-bezier(0.4, 0, 0.2, 1)',
                    'opacity 180ms ease',
                  ].join(', '),
                  pointerEvents: 'none',
                }}
              />
            )}
          </nav>

          {/* Wallet button + Profile dropdown with solid separation */}
          <div className="flex items-center gap-4 shrink-0">
            <WalletCTA onOpenModal={() => setLoginModalOpen(true)} />
            <ProfileMenu />
          </div>

        </div>
      </header>
    </>
  )
}
