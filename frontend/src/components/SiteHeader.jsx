/**
 * SiteHeader — shared navbar used by every page.
 *
 * On the Home page  → nav links scroll to anchor sections (#platform, etc.)
 * On other pages    → nav links navigate to /#section (full URL with hash)
 *
 * Props
 * ─────
 * mode : 'home' | 'page'
 *   'home'  – links are in-page anchors; IntersectionObserver drives the active
 *             tab and the animated sliding underline is shown.
 *   'page'  – links are plain hrefs (/#section); no IntersectionObserver or
 *             sliding indicator (there are no matching sections on the page).
 */

import { useState, useEffect, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { Menu, X } from 'lucide-react'

/* ── Brand lockup ────────────────────────────────────────── */
function BELNavBrand() {
  return (
    <div className="flex items-center gap-3.5 py-1">
      <img
        src="/bel-shield.svg"
        alt="BEL Emblem"
        className="h-14 md:h-16 w-auto object-contain flex-shrink-0 drop-shadow-sm"
      />
      <div className="flex flex-col justify-center">
        <div className="flex items-center gap-2 mb-0.5">
          <span className="bg-[#0B1E36] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
            BEL
          </span>
          <span className="text-[10.5px] font-bold tracking-[0.14em] text-[#A37E2C] uppercase">
            Govt. of India • Sovereign Ledger
          </span>
        </div>

        <div className="text-2xl md:text-3xl font-black tracking-wider leading-none">
          <span className="text-[#0B2545]">BEL</span>
          <span className="text-[#1565C0]">TAL</span>
        </div>

        <div className="pt-0.5 border-b-2 border-[#C59B27] w-fit">
          <span className="text-[8.5px] font-bold tracking-wider text-slate-500 uppercase block">
            Blockchain-Enabled Trusted Access &amp; Digital Asset Ledger &amp; ASSET PROVENANCE
          </span>
        </div>
      </div>
    </div>
  )
}

/* ── Main export ─────────────────────────────────────────── */
export default function SiteHeader({ mode = 'home' }) {
  const isHome = mode === 'home'

  const navLinks = [
    { label: 'Platform',    href: isHome ? '#platform'    : '/#platform' },
    { label: 'Features',   href: isHome ? '#features'    : '/#features' },
    { label: 'Technology', href: isHome ? '#technology'  : '/#technology' },
    { label: 'Use Cases',  href: isHome ? '#use-cases'   : '/#use-cases' },
    { label: 'About BEL',  href: isHome ? '#about-bel'   : '/#about-bel' },
  ]

  const [activeTab,       setActiveTab]      = useState('#platform')
  const [indicatorStyle,  setIndicatorStyle] = useState({ translateX: 0, width: 0, opacity: 0 })
  const [isMenuOpen,      setIsMenuOpen]     = useState(false)
  const navRefs  = useRef({})
  const navigate = useNavigate()

  /* Recompute sliding indicator whenever activeTab changes (home only) */
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

  /* Recompute on resize so indicator never drifts */
  useEffect(() => {
    if (!isHome) return
    const onResize = () => {
      const el = navRefs.current[activeTab]
      if (el) setIndicatorStyle({ translateX: el.offsetLeft, width: el.offsetWidth, opacity: 1 })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeTab, isHome])

  /* IntersectionObserver — auto-update active tab from visible section */
  useEffect(() => {
    if (!isHome) return
    const sectionIds = navLinks.filter(l => l.href.startsWith('#')).map(l => l.href.slice(1))
    const observers  = []
    const ratioMap   = {}

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
  }, [isHome]) // eslint-disable-line react-hooks/exhaustive-deps

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

  const handleClick = (e, href) => {
    setIsMenuOpen(false)
    if (!isHome) return               // let browser follow /#section normally
    e.preventDefault()
    setActiveTab(href)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <header className="sticky top-0 w-full z-40 border-b border-surface-container-highest shadow-[0_1px_8px_rgba(13,43,78,0.06)] bg-[#FFFDF5]">
      <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between">

        {/* Brand — always links home */}
        <Link to="/" className="flex items-center">
          <BELNavBrand />
        </Link>

        {/* Nav links */}
        <nav className="hidden md:flex items-center gap-space-xl h-full relative">
          {navLinks.map(({ label, href }) => {
            const isActive = isHome && activeTab === href
            return (
              <a
                key={href}
                href={href}
                ref={el => { navRefs.current[href] = el }}
                onClick={e => handleClick(e, href)}
                className={
                  isActive
                    ? 'transition-colors duration-200 py-space-sm text-secondary font-bold font-title-md text-title-md'
                    : 'font-title-md text-title-md text-on-surface-variant hover:text-secondary transition-colors duration-200 py-space-sm'
                }
              >
                {label}
              </a>
            )
          })}

          {/* Sliding underline indicator (home only) */}
          {isHome && (
            <span
              aria-hidden="true"
              style={{
                position:   'absolute',
                bottom:     0,
                left:       0,
                width:      indicatorStyle.width,
                opacity:    indicatorStyle.opacity,
                height:     '2.5px',
                background: '#1e5fa8',
                borderRadius: '2px',
                transform:  `translateX(${indicatorStyle.translateX}px)`,
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
            {isMenuOpen ? <X aria-hidden="true" className="w-5 h-5" /> : <Menu aria-hidden="true" className="w-5 h-5" />}
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
          {navLinks.map(({ label, href }) => {
            const isActive = isHome && activeTab === href
            return (
              <a
                key={href}
                href={href}
                onClick={e => handleClick(e, href)}
                className={
                  isActive
                    ? 'font-title-md text-title-md font-bold text-secondary py-space-sm px-space-sm rounded-lg'
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
