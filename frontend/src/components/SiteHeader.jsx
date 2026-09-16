/**
 * SiteHeader — shared navbar used by every page.
 *
 * On the Home page  → nav links scroll to anchor sections (#platform, etc.)
 * On other pages    → nav links navigate to /#section (full URL with hash)
 * On other pages    → nav links navigate to / and scroll once the landing
 *                     page's sections exist (handled by ScrollToHashSection
 *                     in App.jsx) — this is a real SPA transition, never a
 *                     full page reload.
 *
 * Props
 * ─────
 * mode : 'home' | 'page'
 *   'home'  – links are in-page anchors; IntersectionObserver drives the active
 *             tab and the animated sliding underline is shown.
 *   'page'  – links navigate to the home route (client-side) then scroll;
 *             no IntersectionObserver or sliding indicator (there are no
 *             matching sections on the page itself).
 */

import { useEffect, useRef, useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useAuth, shortenAddress } from '../context/AuthContext'
import LoginModal from './auth/LoginModal'
import { motion } from 'framer-motion'

/* ── Brand lockup ────────────────────────────────────────── */
function BELNavBrand() {
  return (
    <div className="flex items-center gap-4 py-1 shrink-0">
      <img
        src="/bel-shield.svg"
        alt="BEL Emblem"
        className="h-12 md:h-14 w-auto object-contain flex-shrink-0 drop-shadow-sm"
        className="h-10 sm:h-14 md:h-16 w-auto object-contain flex-shrink-0 drop-shadow-sm"
      />
      <div className="flex flex-col justify-center min-w-0">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="bg-[#0B1E36] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase shrink-0">
            BEL
          </span>
          <span className="text-[10px] font-bold tracking-[0.14em] text-[#A37E2C] uppercase whitespace-nowrap">
          <span className="hidden sm:inline text-[10.5px] font-bold tracking-[0.14em] text-[#A37E2C] uppercase whitespace-nowrap">
            Govt. of India • Sovereign Ledger
          </span>
        </div>

        <div className="text-2xl md:text-2xl font-black tracking-wider leading-none">
        <div className="text-xl sm:text-2xl md:text-3xl font-black tracking-wider leading-none">
          <span className="text-[#0B2545]">BEL</span>
          <span className="text-[#1565C0]">TAL</span>
        </div>

        <div className="pt-0.5 border-b-2 border-[#C59B27] w-fit">
          <span className="text-[8px] font-bold tracking-wider text-slate-500 uppercase block whitespace-nowrap">
        {/* Full descriptive tagline only where there's room for it (tablet+) */}
        <div className="hidden md:block pt-0.5 border-b-2 border-[#C59B27] w-fit">
          <span className="text-[8.5px] font-bold tracking-wider text-slate-500 uppercase block">
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
    { label: 'Platform',    id: 'platform' },
    { label: 'Features',    id: 'features' },
    { label: 'Technology',  id: 'technology' },
    { label: 'Use Cases',   id: 'use-cases' },
    { label: 'About BEL',   id: 'about-bel' },
  ]

  const [activeTab,  setActiveTab]  = useState('platform')
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const navigate = useNavigate()

  // While true, the IntersectionObserver ignores what's scrolling past —
  // set the instant a nav link is clicked, cleared once the resulting
  // scroll has actually settled (debounced on the 'scroll' event itself,
  // so it adapts to however long the scroll really takes instead of a
  // guessed timeout). This is what stopped the sliding indicator from
  // being yanked to whatever section flew past mid-scroll.
  const suppressObserverRef = useRef(false)
  const settleTimerRef = useRef(null)

  const releaseObserverWhenSettled = () => {
    const SETTLE_MS = 150
    const onScroll = () => {
      clearTimeout(settleTimerRef.current)
      settleTimerRef.current = setTimeout(() => {
        suppressObserverRef.current = false
        window.removeEventListener('scroll', onScroll)
      }, SETTLE_MS)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll() // arm the timer immediately in case the scroll distance is ~0
  }

  useEffect(() => () => clearTimeout(settleTimerRef.current), [])

  useEffect(() => {
    if (!isHome) return
    const sectionIds = navLinks.filter(l => l.href.startsWith('#')).map(l => l.href.slice(1))
    const ratioMap = {}
    const sectionIds = navLinks.map(l => l.id)
    const observers  = []
    const ratioMap   = {}

    const observers = []
    sectionIds.forEach(id => {
      const el = document.getElementById(id)
      if (!el) return
      ratioMap[id] = 0

      const obs = new IntersectionObserver(
        ([entry]) => {
          if (suppressObserverRef.current) return
          ratioMap[id] = entry.intersectionRatio
          const best = Object.entries(ratioMap).reduce(
            (a, b) => (b[1] > a[1] ? b : a),
            ['', 0]
          )
          if (best[1] > 0) setActiveTab(best[0])
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isHome])

  /* Close the mobile menu on Escape, or if the viewport grows past the md breakpoint */
  useEffect(() => {
    if (!isMenuOpen) return
    const handleKeyDown = e => { if (e.key === 'Escape') setIsMenuOpen(false) }
    const handleResize = () => { if (window.innerWidth >= 768) setIsMenuOpen(false) }
    document.addEventListener('keydown', handleKeyDown)
    window.addEventListener('resize', handleResize)
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      window.removeEventListener('resize', handleResize)
    }
  }, [isMenuOpen])

  const handleClick = (e, id) => {
    e.preventDefault()
    setIsMenuOpen(false)

    if (!isHome) {
      // SPA navigation, never a full reload — ScrollToHashSection (mounted
      // once in App.jsx) picks up the hash once the landing page's
      // sections actually exist and scrolls to it.
      navigate(`/#${id}`)
      return
    }

    suppressObserverRef.current = true
    setActiveTab(id)
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' })
    releaseObserverWhenSettled()
  }

  const renderLink = (label, id, extraClass) => {
    const isActive = isHome && activeTab === id
    return (
      <a
        key={id}
        href={isHome ? `#${id}` : `/#${id}`}
        onClick={e => handleClick(e, id)}
        className={`relative ${extraClass} ${
          isActive
            ? 'text-secondary font-bold'
            : 'text-on-surface-variant hover:text-secondary'
        }`}
      >
        {label}
        {isActive && (
          <motion.span
            layoutId="nav-underline"
            className="absolute left-0 right-0 -bottom-[3px] h-[2.5px] rounded-full bg-secondary"
            transition={{ type: 'spring', stiffness: 420, damping: 34 }}
          />
        )}
      </a>
    )
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
    <header className="sticky top-0 w-full z-40 border-b border-surface-container-highest shadow-[0_1px_8px_rgba(13,43,78,0.06)] bg-[#FFFDF5]">
      <div className="min-h-16 md:h-20 py-2 md:py-0 max-w-7xl mx-auto px-margin flex items-center justify-between">

        {/* Brand — always links home */}
        <Link to="/" className="flex items-center">
          <BELNavBrand />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-space-xl h-full relative">
          {navLinks.map(({ label, id }) =>
            renderLink(label, id, 'transition-colors duration-200 py-space-sm font-title-md text-title-md')
          )}
        </nav>

        {/* CTA + avatar */}
        <div className="flex items-center gap-space-md">
          <button
            onClick={() => navigate('/contact')}
            className="hidden md:inline-flex bg-secondary text-on-secondary hover:bg-primary-container font-label-md text-label-md px-space-lg py-space-sm rounded-lg transition-colors items-center shadow-sm cursor-pointer"
          >
            Contact Us
          </button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center" aria-hidden="true">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>

          {/* Mobile menu toggle */}
          <button
            type="button"
            className="md:hidden flex items-center justify-center w-9 h-9 rounded-lg text-primary-container hover:bg-surface-container-low transition-colors cursor-pointer"
            aria-label={isMenuOpen ? 'Close navigation menu' : 'Open navigation menu'}
            aria-expanded={isMenuOpen}
            aria-controls="mobile-nav-panel"
            onClick={() => setIsMenuOpen(open => !open)}
          >
            <span aria-hidden="true" className="material-symbols-outlined text-[22px]">
              {isMenuOpen ? 'close' : 'menu'}
            </span>
          </button>
        </div>

      </div>

      {/* Mobile nav panel */}
      {isMenuOpen && (
        <nav
          id="mobile-nav-panel"
          aria-label="Mobile navigation"
          className="md:hidden border-t border-surface-container-highest bg-[#FFFDF5] px-margin py-space-md flex flex-col gap-1"
        >
          {navLinks.map(({ label, id }) => {
            const isActive = isHome && activeTab === id
            return (
              <a
                key={id}
                href={isHome ? `#${id}` : `/#${id}`}
                onClick={e => handleClick(e, id)}
                className={
                  isActive
                    ? 'font-title-md text-title-md font-bold text-secondary py-space-sm px-space-sm rounded-lg bg-surface-container-low'
                    : 'font-title-md text-title-md text-on-surface-variant hover:text-secondary hover:bg-surface-container-low transition-colors py-space-sm px-space-sm rounded-lg'
                }
              >
                {label}
              </a>
            )
          })}
          <button
            onClick={() => { setIsMenuOpen(false); navigate('/contact') }}
            className="mt-space-sm bg-secondary text-on-secondary hover:bg-primary-container font-label-md text-label-md px-space-lg py-space-sm rounded-lg transition-colors flex items-center justify-center shadow-sm cursor-pointer"
          >
            Contact Us
          </button>
        </nav>
      )}
    </header>
  )
}
