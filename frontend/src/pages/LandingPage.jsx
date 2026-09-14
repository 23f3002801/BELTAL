import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'

/**
 * LandingPage — faithful React conversion of code.html
 * Uses the Tailwind v4 custom tokens defined in DESIGN.md / tailwind.config
 *
 * Tailwind token quick-ref (from code.html tailwind-config):
 *   primary            = #001631
 *   primary-container  = #0D2B4E
 *   secondary          = #1E5FA8
 *   secondary-container= #7ab0fe
 *   tertiary-container = #c8a74c   (Navratna Gold)
 *   surface            = #f9f9ff
 *   surface-container-lowest = #ffffff
 *   surface-container-low    = #f0f3ff
 *   on-primary         = #ffffff
 *   on-primary-container = #7993bc
 *   on-surface-variant = #43474e
 *   outline            = #74777f
 *   outline-variant    = #c4c6cf
 */

/* ─────────────────────────────────────────────────────────
   BEL BRAND COMPONENTS
───────────────────────────────────────────────────────── */

/** Inline shield SVG — reused across sizes */
function BELShieldSVG({ className = 'h-10 w-10' }) {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" className={className}>
      <rect width="100" height="100" rx="20" fill="#031024" />
      <circle cx="50" cy="50" r="42" stroke="#0284C7" strokeWidth="1.5" strokeDasharray="4 3" opacity="0.6" />
      <path d="M50 18L76 28V50C76 66 65 78 50 83C35 78 24 66 24 50V28L50 18Z" fill="#0A2540" stroke="#00D2FE" strokeWidth="2.5" />
      <polygon points="50,30 65,39 65,57 50,66 35,57 35,39" fill="#134E5E" stroke="#38BDF8" strokeWidth="1.5" />
      <circle cx="50" cy="48" r="6" fill="#F59E0B" />
      <path d="M50 54V62M45 58H55" stroke="#FFFFFF" strokeWidth="2.5" strokeLinecap="round" />
    </svg>
  )
}

/**
 * Horizontal brand lockup for the Navbar.
 * Shield image | BEL pill + tagline + wordmark + sub-tagline
 */
function BELNavBrand() {
  return (
    <div className="flex items-center gap-3.5 py-1">
      {/* Shield Emblem */}
      <img
        src="/bel-shield.svg"
        alt="BEL Emblem"
        className="h-14 md:h-16 w-auto object-contain flex-shrink-0 drop-shadow-sm"
      />

      {/* Brand Text Cluster */}
      <div className="flex flex-col justify-center">
        {/* Top Tagline with Pill */}
        <div className="flex items-center gap-2 mb-0.5">
          <span className="bg-[#0B1E36] text-white text-[10px] font-black px-1.5 py-0.5 rounded tracking-wider uppercase">
            BEL
          </span>
          <span className="text-[10.5px] font-bold tracking-[0.14em] text-[#A37E2C] uppercase">
            Govt. of India • Sovereign Ledger
          </span>
        </div>

        {/* Main Wordmark */}
        <div className="text-2xl md:text-3xl font-black tracking-wider leading-none">
          <span className="text-[#0B2545]">BEL</span>
          <span className="text-[#1565C0]">TAL</span>
        </div>

        {/* Sub-tagline with Accent Border */}
        <div className="pt-0.5 border-b-2 border-[#C59B27] w-fit">
          <span className="text-[8.5px] font-bold tracking-wider text-slate-500 uppercase block">
            Blockchain-Enabled Trusted Access & Digital Asset Ledger &amp; ASSET PROVENANCE
          </span>
        </div>
      </div>
    </div>
  )
}

/** Clean shield badge for the footer — no outer card */
function BELFooterBadge() {
  return (
    <img
      src="/bel-shield.svg"
      alt="BEL Shield"
      className="h-12 w-auto object-contain"
    />
  )
}


/* ─────────────────────────────────────────────────────────
   GOVERNMENT BANNER  (code.html lines 46-54)
───────────────────────────────────────────────────────── */
function GovBanner() {
  return (
    <div className="w-full bg-primary-container h-9 border-b-2 border-tertiary-container px-margin-desktop flex items-center justify-between z-50 relative">
      <div className="flex items-center gap-space-sm">
        <span className="text-on-primary font-code-sm text-code-sm tracking-wider uppercase opacity-95">
          Government of India | Ministry of Defence
        </span>
      </div>
      <div className="flex items-center gap-space-sm">
        <span className="text-on-primary font-code-sm text-code-sm tracking-wide opacity-90">
          A Navratna Company | CIN: L32309KA1954GOI000787
        </span>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   CONTACT US MODAL
───────────────────────────────────────────────────────── */
function ContactModal({ onClose }) {
  const [submitted, setSubmitted] = useState(false)
  const [form, setForm] = useState({ name: '', designation: '', email: '', inquiryType: '', message: '' })

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }))

  const handleSubmit = e => {
    e.preventDefault()
    setSubmitted(true)
    setTimeout(() => onClose(), 2200)
  }

  const inputCls = 'border border-slate-300 rounded-lg px-3.5 py-2.5 text-sm focus:ring-2 focus:ring-blue-600 focus:border-transparent outline-none w-full bg-slate-50/50 transition-all'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="bg-white border border-slate-200 rounded-2xl max-w-lg w-full p-6 md:p-8 shadow-2xl relative" role="dialog" aria-modal="true" aria-labelledby="contact-title">

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-all"
          aria-label="Close dialog"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {submitted ? (
          /* ── Success state ── */
          <div className="flex flex-col items-center justify-center py-10 text-center gap-4">
            <div className="w-14 h-14 rounded-full bg-emerald-100 flex items-center justify-center">
              <span className="material-symbols-outlined text-emerald-600 text-[32px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified</span>
            </div>
            <h3 className="text-lg font-bold text-[#0B2545]">Transmission Verified</h3>
            <p className="text-sm text-slate-600 max-w-xs leading-relaxed">
              Your inquiry has been routed to the BELTAL technical secretariat. Closing…
            </p>
          </div>
        ) : (
          /* ── Form ── */
          <>
            {/* Header */}
            <span className="text-[10px] font-bold tracking-widest text-blue-800 bg-blue-50 px-2.5 py-1 rounded uppercase">
              Defence &amp; Enterprise Inquiry
            </span>
            <h2 id="contact-title" className="text-xl font-extrabold text-[#0B2545] mt-3 mb-1" style={{ fontFamily: '"Times New Roman", Times, serif' }}>
              Connect with BELTAL Operations
            </h2>
            <p className="text-xs text-slate-500 mb-6 leading-relaxed">
              Inquire about sovereign DID onboarding, air-gapped node integration, or pilot clearances.
            </p>

            <form onSubmit={handleSubmit} className="flex flex-col gap-4">
              {/* Full Name */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Officer / Representative Name</label>
                <input
                  type="text" name="name" required placeholder="e.g. Wg Cdr Arjun Sharma"
                  value={form.name} onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Designation */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Official Designation &amp; Department / Agency</label>
                <input
                  type="text" name="designation" required placeholder="e.g. Director IT, MoD / DRDO / Enterprise"
                  value={form.designation} onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Email */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Official Email Address</label>
                <input
                  type="email" name="email" required placeholder="yourname@gov.in"
                  value={form.email} onChange={handleChange}
                  className={inputCls}
                />
              </div>

              {/* Inquiry Type */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Clearance / Inquiry Type</label>
                <select
                  name="inquiryType" required
                  value={form.inquiryType} onChange={handleChange}
                  className={inputCls}
                >
                  <option value="" disabled>Select inquiry type…</option>
                  <option>Sovereign Ledger Node Integration</option>
                  <option>Defense Asset Tokenization</option>
                  <option>DID Verification Pilot</option>
                  <option>General Technical Query</option>
                </select>
              </div>

              {/* Message */}
              <div>
                <label className="text-xs font-semibold text-slate-600 mb-1 block">Message / Dispatch Brief</label>
                <textarea
                  name="message" rows={4} placeholder="Describe your requirement or operational context…"
                  value={form.message} onChange={handleChange}
                  className={inputCls + ' resize-none'}
                />
              </div>

              {/* Submit */}
              <button
                type="submit"
                className="bg-[#0B2545] hover:bg-blue-900 text-white font-semibold py-2.5 px-6 rounded-lg w-full transition-all shadow-md flex items-center justify-center gap-2 mt-1"
              >
                <span className="material-symbols-outlined text-[18px]">send</span>
                Transmit Inquiry
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   GOVERNMENT BANNER  (code.html lines 46-54)
───────────────────────────────────────────────────────── */
function Header() {
  const navLinks = [
    { label: 'Platform', href: '#platform' },
    { label: 'Features', href: '#features' },
    { label: 'Technology', href: '#technology' },
    { label: 'Use Cases', href: '#use-cases' },
    { label: 'About BEL', href: '#about-bel' },
  ]

  const [activeTab, setActiveTab] = useState('#platform')
  const [indicatorStyle, setIndicatorStyle] = useState({ translateX: 0, width: 0, opacity: 0 })
  const navigate = useNavigate()
  const navRefs = useRef({})

  // Recompute sliding indicator position whenever activeTab changes
  useEffect(() => {
    const el = navRefs.current[activeTab]
    if (!el) return
    // Double-rAF: first frame lets browser finish layout, second reads stable geometry
    let raf1 = requestAnimationFrame(() => {
      let raf2 = requestAnimationFrame(() => {
        setIndicatorStyle({
          translateX: el.offsetLeft,
          width: el.offsetWidth,
          opacity: 1,
        })
      })
      return () => cancelAnimationFrame(raf2)
    })
    return () => cancelAnimationFrame(raf1)
  }, [activeTab])

  // Recompute on resize so indicator never drifts
  useEffect(() => {
    const onResize = () => {
      const el = navRefs.current[activeTab]
      if (el) setIndicatorStyle({ translateX: el.offsetLeft, width: el.offsetWidth, opacity: 1 })
    }
    window.addEventListener('resize', onResize)
    return () => window.removeEventListener('resize', onResize)
  }, [activeTab])

  // IntersectionObserver — auto-update active tab based on visible section
  useEffect(() => {
    const sectionIds = navLinks.map(l => l.href.slice(1))
    const observers = []
    const ratioMap = {}

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
  }, [])

  const handleClick = (e, href) => {
    e.preventDefault()
    setActiveTab(href)
    document.querySelector(href)?.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <>
    <header className="sticky top-0 w-full z-40 border-b border-surface-container-highest shadow-[0_1px_8px_rgba(13,43,78,0.06)] bg-[#FFFDF5]">
      <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center">
          <BELNavBrand />
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-space-xl h-full relative">
          {navLinks.map(({ label, href }) => {
            const isActive = activeTab === href
            return (
              <a
                key={href}
                href={href}
                ref={el => { navRefs.current[href] = el }}
                onClick={e => handleClick(e, href)}
                className={
                  isActive
                    ? 'transition-colors duration-200 py-space-sm text-secondary font-bold'
                    : 'font-title-md text-title-md text-on-surface-variant hover:text-secondary transition-colors duration-200 py-space-sm'
                }
              >
                {label}
              </a>
            )
          })}
          {/* Sliding underline indicator — GPU-accelerated via transform */}
          <span
            aria-hidden="true"
            style={{
              position: 'absolute',
              bottom: 0,
              left: 0,
              width: indicatorStyle.width,
              opacity: indicatorStyle.opacity,
              height: '2.5px',
              background: '#1e5fa8',
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
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-space-md">
          <button
            onClick={() => navigate('/contact')}
            className="bg-secondary text-on-secondary hover:bg-primary-container font-label-md text-label-md px-space-lg py-space-sm rounded-lg transition-colors flex items-center shadow-sm cursor-pointer"
          >
            Contact Us
          </button>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
    </>
  )
}

/* ─────────────────────────────────────────────────────────
   SECTION 1: HERO  (code.html lines 91-375)
───────────────────────────────────────────────────────── */
/* ─────────────────────────────────────────────────────────
   PROBLEM STATEMENT MODAL
───────────────────────────────────────────────────────── */
const PROBLEM_PAIRS = [
  {
    id: 1,
    title: 'Centralized Identity Vulnerability',
    problem:
      'Centralized databases represent single points of failure vulnerable to state-sponsored intrusions and credential leaks.',
    solution:
      'W3C Decentralized Identifiers (DIDs) with zero-knowledge cryptographic authentication across defense personnel.',
  },
  {
    id: 2,
    title: 'Untracked Supply Chain & Counterfeiting',
    problem:
      'Mission-critical hardware components and classified asset movements are difficult to audit across disparate legacy registries.',
    solution:
      'Non-fungible Asset Provenance (NFTs) that register immutable custody transfers directly on-chain.',
  },
  {
    id: 3,
    title: 'Authorization Latency & Siloed Approvals',
    problem:
      'Manual, paper-bound multi-agency clearance bottlenecks slow tactical deployment during critical operations.',
    solution:
      'Self-executing Byzantine Fault Tolerant (BFT) Smart Contracts granting instantaneous, role-based cryptographic clearances.',
  },
]

function ProblemModal({ onClose }) {
  // Close on Escape key
  useEffect(() => {
    const handler = e => { if (e.key === 'Escape') onClose() }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [onClose])

  return (
    <div
      className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
      role="dialog"
      aria-modal="true"
      aria-labelledby="problem-modal-title"
    >
      <div className="bg-[#F8F3E6] border-2 border-[#C59B27] rounded-2xl max-w-4xl w-full p-6 md:p-8 shadow-2xl relative max-h-[90vh] overflow-y-auto">

        {/* Close button */}
        <button
          onClick={onClose}
          aria-label="Close dialog"
          className="absolute top-4 right-4 w-9 h-9 rounded-full flex items-center justify-center text-slate-500 hover:text-[#0B2545] hover:bg-amber-100 transition-all"
        >
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" className="w-4 h-4">
            <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        </button>

        {/* Header */}
        <div className="mb-6">
          <span className="text-[10px] font-bold tracking-widest text-[#0B2545] bg-amber-200/60 px-2.5 py-1 rounded uppercase">
            Defence &amp; Sovereign Ledger Mandate
          </span>
          <h2
            id="problem-modal-title"
            className="text-2xl md:text-3xl font-bold text-[#0B2545] mt-3 leading-snug"
            style={{ fontFamily: '"Times New Roman", Times, serif' }}
          >
            Sovereign Problem Statements &amp; BELTAL Solutions
          </h2>
          <div className="mt-2 h-0.5 w-20 rounded bg-[#C59B27]" />
        </div>

        {/* 3 paired cards */}
        <div className="flex flex-col gap-5">
          {PROBLEM_PAIRS.map(({ id, title, problem, solution }) => (
            <div
              key={id}
              className="bg-white rounded-xl border border-amber-200/60 shadow-sm overflow-hidden"
            >
              {/* Card header */}
              <div className="bg-[#0D2B4E] px-5 py-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-[#C8A74C]/20 border border-[#C8A74C]/40 flex items-center justify-center shrink-0">
                  <span className="text-[11px] font-black text-[#C8A74C]">{String(id).padStart(2, '0')}</span>
                </span>
                <h3 className="text-[13px] font-bold text-white tracking-wide">{title}</h3>
              </div>

              {/* Problem / Solution row */}
              <div className="grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-100">
                {/* Problem */}
                <div className="p-4 flex gap-3 items-start">
                  <div className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-red-50 border border-red-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-500 text-[15px]">warning</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-red-600 uppercase mb-1">Problem</p>
                    <p className="text-[13px] text-slate-700 leading-relaxed">{problem}</p>
                  </div>
                </div>

                {/* Solution */}
                <div className="p-4 flex gap-3 items-start bg-[#F0F8FF]/50">
                  <div className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-blue-50 border border-blue-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-[#1E5FA8] text-[15px]" style={{ fontVariationSettings: '"FILL" 1' }}>shield</span>
                  </div>
                  <div>
                    <p className="text-[10px] font-bold tracking-widest text-[#1E5FA8] uppercase mb-1">BELTAL Solution</p>
                    <p className="text-[13px] text-slate-700 leading-relaxed">{solution}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="mt-8 flex justify-center">
          <button
            onClick={onClose}
            className="bg-[#0B2545] hover:bg-[#163761] text-white px-8 py-2.5 rounded-xl font-bold text-[14px] transition-all shadow-md flex items-center gap-2"
          >
            <span className="material-symbols-outlined text-[16px]">check_circle</span>
            Understood &amp; Return to Platform
          </button>
        </div>
      </div>
    </div>
  )
}

function HeroSection() {
  const [isProblemModalOpen, setIsProblemModalOpen] = useState(false)

  return (
    <>
    <section id="platform" className="w-full bg-gradient-to-b from-[#E8F1FB] to-surface-container-lowest py-24 px-8 border-b border-surface-container-highest">
      <div className="max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 items-center gap-12">

        {/* LEFT: 7 cols */}
        <div className="lg:col-span-7 flex flex-col items-start">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#E8F1FB] border border-[#3B82C4]/30 font-label-md text-label-md font-bold text-secondary uppercase tracking-wider mb-6 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-secondary animate-pulse" />
            <span>BLOCKCHAIN &amp; CYBERSECURITY INITIATIVE</span>
          </div>

          {/* H1 */}
          <h1 className="font-display-hero text-display-hero text-primary-container leading-tight mb-5 tracking-tight">
            Secure Digital Identity. <br className="hidden sm:inline" />
            <span className="text-secondary">Tamper-Proof</span> Asset Ownership.
          </h1>

          {/* Sub */}
          <p className="text-[18px] text-on-surface-variant w-full max-w-3xl mb-10 leading-relaxed font-normal tracking-wide">
            Engineered by Bharat Electronics Limited (BEL) for the Ministry of Defence and sovereign
            public infrastructure, Bharat SecureChain delivers an air-gapped, zero-trust cryptographic
            architecture. It unifies W3C-compliant Decentralized Identifiers (DIDs), post-quantum
            encrypted access control, and immutable tokenized asset provenance to eliminate single
            points of failure across critical national governance networks.
          </p>

          {/* 3 Stat Badges */}
          <div className="flex flex-wrap sm:flex-nowrap items-center gap-4 sm:gap-6 mb-8 w-full">
            {[
              { icon: 'shield', fill: true, label: '100% Decentralized' },
              { icon: 'token', fill: false, label: 'NFT-Based Ownership' },
              { icon: 'lock', fill: true, label: 'Smart Contract Secured' },
            ].map(({ icon, fill, label }) => (
              <div
                key={label}
                className="bg-[#FFFDF8] border border-amber-200/40 py-3 px-5 rounded-lg shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex items-center gap-3 flex-1 min-w-[150px]"
              >
                <div className="w-8 h-8 rounded bg-[#E8F1FB] flex items-center justify-center text-secondary shrink-0">
                  <span
                    className="material-symbols-outlined text-[20px]"
                    style={fill ? { fontVariationSettings: '"FILL" 1' } : {}}
                  >
                    {icon}
                  </span>
                </div>
                <span className="font-label-md text-label-md font-bold text-primary-container leading-tight">
                  {label}
                </span>
              </div>
            ))}
          </div>

          {/* CTAs */}
          <div className="flex flex-wrap items-center gap-4 sm:gap-6 mb-6">
            <a
              className="bg-secondary hover:bg-[#164882] text-on-secondary font-headline-sm text-[18px] font-bold px-8 py-4 rounded-xl inline-flex items-center gap-3 shadow-lg hover:shadow-xl transition-all focus:ring-2 focus:ring-[#3B82C4]"
              href="#features"
            >
              <span>Explore Platform</span>
              <span className="material-symbols-outlined text-[20px]">arrow_forward</span>
            </a>
            <button
              className="bg-surface-container-lowest border-2 border-secondary text-secondary hover:bg-[#E8F1FB] font-headline-sm text-[18px] font-bold px-8 py-4 rounded-xl inline-flex items-center gap-2 transition-all shadow-xs cursor-pointer"
              onClick={() => setIsProblemModalOpen(true)}
            >
              <span>View Problem Statement</span>
            </button>
          </div>

          {/* Trust line */}
          <div className="flex items-center gap-2 font-code-sm text-code-sm text-outline font-medium">
            <span className="material-symbols-outlined text-[16px] text-tertiary">verified_user</span>
            <span>No centralized database • ISO 27001 Compliant • Made in India</span>
          </div>
        </div>

        {/* RIGHT: 5 cols — Mockup Dashboard */}
        <div className="lg:col-span-5 relative flex justify-center">
          <div className="w-full max-w-[480px] backdrop-blur rounded-2xl border shadow-xl p-6 relative overflow-visible bg-[#FFFDF5] border-tertiary-container/40">

            {/* Top status header */}
            <div className="flex items-center justify-between border-b border-[#E2E8F0] pb-4 mb-4">
              <div className="flex items-center gap-2">
                <span className="relative flex h-3 w-3">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-600" />
                </span>
                <span className="font-label-sm text-label-sm font-bold text-primary-container tracking-wider">
                  BEL-DEFNET MAINNET ACTIVE
                </span>
              </div>
              <div className="flex items-center gap-2 font-code-sm text-code-sm text-outline font-semibold">
                <span>Block: #4,928,192</span>
              </div>
            </div>

            {/* Consensus bar */}
            <div className="flex items-center justify-between bg-surface-container-low px-3 py-2 rounded mb-5 border border-slate-100">
              <span className="font-code-sm text-code-sm text-on-surface-variant font-medium">Consensus State</span>
              <span className="font-label-sm text-label-sm font-bold text-secondary flex items-center gap-1">
                <span className="material-symbols-outlined text-[14px]">done_all</span>
                100% Byzantine Fault Tolerant
              </span>
            </div>

            {/* Network SVG */}
            <div className="w-full h-72 bg-primary-container rounded-xl relative p-3 mb-5 overflow-hidden border border-primary flex flex-col justify-between shadow-inner">
              <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#ffffff_1px,transparent_1px),linear-gradient(to_bottom,#ffffff_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

              {/* Top HUD */}
              <div className="relative z-20 flex items-center justify-between px-1">
                <div className="flex items-center gap-2 bg-[#001631]/80 backdrop-blur border border-[#3B82C4]/30 px-2 py-0.5 rounded">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                  <span className="font-code-sm text-[11px] font-bold text-emerald-400 tracking-wider uppercase">
                    BFT-PoA Consensus • 14,200 TPS
                  </span>
                </div>
                <div className="flex items-center gap-1.5 bg-[#001631]/80 backdrop-blur border border-tertiary-container/40 px-2 py-0.5 rounded">
                  <span className="material-symbols-outlined text-[12px] text-tertiary-fixed-dim">lock</span>
                  <span className="font-code-sm text-[11px] font-semibold text-tertiary-fixed-dim">PQ-Dilithium / AES-256</span>
                </div>
              </div>

              {/* SVG topology */}
              <div className="w-full h-48 relative z-10 my-auto">
                <svg className="w-full h-full" fill="none" viewBox="0 0 440 190" xmlns="http://www.w3.org/2000/svg">
                  <defs>
                    <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
                      <feGaussianBlur stdDeviation="3" result="blur" />
                      <feComposite in="SourceGraphic" in2="blur" operator="over" />
                    </filter>
                    <radialGradient id="coreGlow" cx="50%" cy="50%" r="50%">
                      <stop offset="0%" stopColor="#1e5fa8" stopOpacity="0.6" />
                      <stop offset="100%" stopColor="#001631" stopOpacity="0" />
                    </radialGradient>
                  </defs>
                  <circle cx="220" cy="95" r="54" fill="url(#coreGlow)" />
                  <line x1="220" y1="95" x2="60" y2="45" stroke="#3b82c4" strokeWidth="1.5" strokeOpacity="0.6" />
                  <line x1="220" y1="95" x2="60" y2="145" stroke="#3b82c4" strokeWidth="1.5" strokeOpacity="0.6" />
                  <line x1="220" y1="95" x2="380" y2="45" stroke="#3b82c4" strokeWidth="1.5" strokeOpacity="0.6" />
                  <line x1="220" y1="95" x2="380" y2="145" stroke="#3b82c4" strokeWidth="1.5" strokeOpacity="0.6" />
                  <line x1="220" y1="95" x2="220" y2="22" stroke="#c8a74c" strokeDasharray="3 3" strokeWidth="1.5" strokeOpacity="0.8" />
                  <line x1="60" y1="45" x2="60" y2="145" stroke="#7ab0fe" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.4" />
                  <line x1="380" y1="45" x2="380" y2="145" stroke="#7ab0fe" strokeDasharray="4 4" strokeWidth="1" strokeOpacity="0.4" />
                  {/* animated packets */}
                  <circle cx="140" cy="70" r="2.5" fill="#7ab0fe" opacity="0.9">
                    <animate attributeName="cx" from="60" to="220" dur="2.4s" repeatCount="indefinite" />
                    <animate attributeName="cy" from="45" to="95" dur="2.4s" repeatCount="indefinite" />
                  </circle>
                  <circle cx="300" cy="70" r="2.5" fill="#e6c364" opacity="0.9">
                    <animate attributeName="cx" from="220" to="380" dur="3.1s" repeatCount="indefinite" />
                    <animate attributeName="cy" from="95" to="45" dur="3.1s" repeatCount="indefinite" />
                  </circle>
                  {/* orbit ring */}
                  <circle cx="220" cy="95" r="32" fill="none" stroke="#c8a74c" strokeWidth="1" strokeDasharray="4 2" opacity="0.6" />
                  {/* BEL core node */}
                  <circle cx="220" cy="95" r="24" fill="#001631" stroke="#c8a74c" strokeWidth="2.5" filter="url(#glow)" />
                  <circle cx="220" cy="95" r="14" fill="#1e5fa8" />
                  <text x="220" y="99" textAnchor="middle" fill="#ffffff" fontFamily="Public Sans" fontSize="9.5" fontWeight="800" letterSpacing="0.5">BEL</text>
                  <text x="220" y="132" textAnchor="middle" fill="#ffe08f" fontFamily="Inter" fontSize="8.5" fontWeight="700">GENESIS CORE</text>
                  {/* SAT node */}
                  <g transform="translate(220, 22)">
                    <circle cx="0" cy="0" r="10" fill="#001631" stroke="#c8a74c" strokeWidth="1.5" />
                    <text x="0" y="3" textAnchor="middle" fill="#ffe08f" fontFamily="Inter" fontSize="7.5" fontWeight="700">SAT</text>
                    <text x="0" y="-14" textAnchor="middle" fill="#aec8f3" fontFamily="Inter" fontSize="7.5" fontWeight="600">SatCom Sync</text>
                  </g>
                  {/* BLR Validator */}
                  <g transform="translate(60, 45)">
                    <circle cx="0" cy="0" r="13" fill="#0d2b4e" stroke="#3b82c4" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="4" fill="#7ab0fe" />
                    <text x="0" y="-18" textAnchor="middle" fill="#dae3f7" fontFamily="Inter" fontSize="8" fontWeight="700">BLR Validator</text>
                    <text x="0" y="-27" textAnchor="middle" fill="#34d399" fontFamily="Inter" fontSize="7" fontWeight="600">Air Force Hub</text>
                  </g>
                  {/* MoD Gateway */}
                  <g transform="translate(60, 145)">
                    <circle cx="0" cy="0" r="13" fill="#0d2b4e" stroke="#3b82c4" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="4" fill="#7ab0fe" />
                    <text x="0" y="24" textAnchor="middle" fill="#dae3f7" fontFamily="Inter" fontSize="8" fontWeight="700">MoD Gateway</text>
                    <text x="0" y="32" textAnchor="middle" fill="#aec8f3" fontFamily="Inter" fontSize="7">Delhi Crypt Enclave</text>
                  </g>
                  {/* DRDO Ledger */}
                  <g transform="translate(380, 45)">
                    <circle cx="0" cy="0" r="13" fill="#0d2b4e" stroke="#3b82c4" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="4" fill="#e6c364" />
                    <text x="0" y="-18" textAnchor="middle" fill="#dae3f7" fontFamily="Inter" fontSize="8" fontWeight="700">DRDO Ledger</text>
                    <text x="0" y="-27" textAnchor="middle" fill="#34d399" fontFamily="Inter" fontSize="7" fontWeight="600">R&amp;D Proof Node</text>
                  </g>
                  {/* Tactical Edge */}
                  <g transform="translate(380, 145)">
                    <circle cx="0" cy="0" r="13" fill="#0d2b4e" stroke="#3b82c4" strokeWidth="1.5" />
                    <circle cx="0" cy="0" r="4" fill="#7ab0fe" />
                    <text x="0" y="24" textAnchor="middle" fill="#dae3f7" fontFamily="Inter" fontSize="8" fontWeight="700">Tactical Edge</text>
                    <text x="0" y="32" textAnchor="middle" fill="#aec8f3" fontFamily="Inter" fontSize="7">Forward Command</text>
                  </g>
                </svg>
              </div>

              {/* Bottom HUD */}
              <div className="relative z-20 flex items-center justify-between border-t border-white/10 pt-2 px-1 text-[11px] font-code-sm text-outline-variant">
                <div className="flex items-center gap-3">
                  <span className="flex items-center gap-1 text-on-primary-container">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" /> 34 Sovereign Nodes
                  </span>
                  <span className="hidden sm:inline text-outline">|</span>
                  <span className="text-on-primary-container">
                    Latency: <strong className="text-[#A8C8E8] font-semibold">11ms</strong>
                  </span>
                </div>
                <div className="flex items-center gap-1.5 text-on-primary-container font-medium">
                  <span className="material-symbols-outlined text-[13px] text-emerald-400">shield</span>
                  <span>Air-Gapped Sync</span>
                </div>
              </div>
            </div>

            {/* Identity Credential Inset */}
            <div className="bg-surface-container-low border border-[#E2E8F0] rounded-xl p-3.5 mb-3 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="font-label-sm text-label-sm uppercase font-bold text-on-surface-variant">
                  Identity Credential Inset
                </span>
                <span className="bg-[#FFFDF5] text-tertiary border border-tertiary-container font-label-sm text-label-sm px-2 py-0.5 rounded font-bold">
                  Level 5 Clearance
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="font-code-sm text-code-sm text-outline">DID:</span>
                <span className="font-code-sm text-code-sm font-semibold text-primary-container truncate max-w-[210px]">
                  did:bharat:bel-8921a-9f4c
                </span>
              </div>
              <div className="flex items-center gap-2 pt-1 border-t border-slate-200">
                <span className="material-symbols-outlined text-[15px] text-emerald-600">fingerprint</span>
                <span className="font-code-sm text-code-sm text-outline">
                  Biometric Hash: <span className="text-on-surface font-semibold">0x9F...A302 (HSM Signed)</span>
                </span>
              </div>
            </div>

            {/* NFT Badge */}
            <div className="flex items-center justify-between bg-surface border border-slate-200 rounded-lg px-3 py-2 text-xs">
              <div className="flex items-center gap-2">
                <span className="material-symbols-outlined text-[16px] text-secondary">verified</span>
                <span className="font-code-sm text-code-sm font-semibold text-on-surface">Defence Contract #7821-C</span>
              </div>
              <span className="bg-secondary/10 text-secondary font-label-sm text-label-sm px-2 py-0.5 rounded font-bold">
                Immutable NFT
              </span>
            </div>

            {/* Floating badge */}
            <div className="absolute -bottom-4 -left-4 z-20 bg-surface-container-lowest px-4 py-2.5 rounded-xl shadow-lg border border-emerald-200 flex items-center gap-2.5">
              <div className="w-6 h-6 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <span className="material-symbols-outlined text-[16px] font-bold">check</span>
              </div>
              <div className="flex flex-col">
                <span className="font-label-md text-label-md font-bold text-primary-container leading-none">Legal Identity Pass</span>
                <span className="font-code-sm text-code-sm text-outline leading-tight mt-0.5">Sovereign State Verified</span>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>

    {/* Problem Statement Modal */}
    {isProblemModalOpen && <ProblemModal onClose={() => setIsProblemModalOpen(false)} />}
    </>
  )
}

/* ─────────────────────────────────────────────────────────
   SECTION 2: TRUST STRIP  (code.html lines 377-413)
───────────────────────────────────────────────────────── */
function TrustSection() {
  const partners = [
    { name: 'BEL', sub: 'Defence Electronics' },
    { name: 'DRDO', sub: 'R&D Ecosystem' },
    { name: 'NIC', sub: 'National Informatics' },
    { name: 'MeitY', sub: 'Electronics & IT' },
    { name: 'Digital India', sub: 'Sovereign Infra' },
  ]

  return (
    <section className="w-full border-t border-[#E2E8F0] bg-[#E8F1FB]">
      <div className="max-w-7xl mx-auto py-6 px-4 md:px-8">

        {/* Section header row */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-4">
          <span className="text-xs md:text-sm font-bold tracking-widest text-[#0B2545] uppercase">
            Trusted by Defence &amp; Government Sectors
          </span>

          {/* Compliance badge pill */}
          <span className="inline-flex items-center gap-1.5 bg-blue-50/80 border border-blue-200/60 px-3 py-1.5 rounded-full text-blue-900 text-xs font-semibold whitespace-nowrap">
            <span className="material-symbols-outlined text-[14px] text-blue-700">gavel</span>
            Aligned with Ministry of Defence &amp; Digital India Guidelines
          </span>
        </div>

        {/* Partner cards */}
        <div className="grid grid-cols-2 md:grid-cols-5 gap-3 md:gap-4 mt-4">
          {partners.map(({ name, sub }) => (
            <div
              key={name}
              className="bg-white border border-slate-200/70 rounded-xl p-3.5 shadow-sm hover:shadow-md hover:-translate-y-0.5 hover:border-blue-300 transition-all duration-200 flex flex-col items-center justify-center text-center cursor-default"
            >
              <span className="font-extrabold text-[#0B2545] text-base tracking-wide leading-tight">
                {name}
              </span>
              <span className="text-[10px] text-slate-500 font-medium mt-0.5">
                {sub}
              </span>
            </div>
          ))}
        </div>

      </div>
    </section>
  )
}


/* ─────────────────────────────────────────────────────────
   SECTION 3: FEATURES  (code.html lines 415-498)
───────────────────────────────────────────────────────── */
function FeaturesSection() {
  const cards = [
    {
      icon: 'badge',
      title: 'Decentralized Identity',
      desc: 'Each user gets a unique decentralized identifier, independent of centralized authorities',
      tag: 'W3C COMPLIANT SPEC',
    },
    {
      icon: 'token',
      title: 'NFT Asset Ownership',
      desc: 'Digital assets represented as NFTs, ensuring unique, traceable, permanent ownership records',
      tag: 'CRYPTOGRAPHIC PROVENANCE',
    },
    {
      icon: 'policy',
      title: 'Smart Contract Governance',
      desc: 'Automated operations governed by smart contracts, allowing only authorized transactions',
      tag: 'ZERO TRUST AUTOMATION',
    },
  ]

  return (
    <section className="w-full py-24 px-8 border-t border-[#E2E8F0] bg-[#FFFDF5]" id="features">
      <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
        <div className="inline-block px-4 py-2 rounded-full bg-[#E8F1FB] font-label-md text-label-md font-bold text-secondary uppercase tracking-wider mb-4 border border-[#3B82C4]/20">
          COMPREHENSIVE SECURITY ENGINE
        </div>
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary-container mb-4 tracking-tight max-w-3xl">
          Everything Required for Secure Digital Governance
        </h2>
        <p className="text-[20px] font-medium text-on-surface-variant max-w-4xl mx-auto mb-16 leading-relaxed tracking-wide">
          Detect vulnerabilities, ensure identity authenticity, and maintain transparent ownership records
          before threats emerge
        </p>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 text-left w-full">
          {cards.map(({ icon, title, desc, tag }) => (
            <div
              key={title}
              className="bg-white border border-slate-200/80 p-8 rounded-2xl shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col relative group"
            >
              <div className="w-12 h-12 rounded-lg bg-[#E8F1FB] flex items-center justify-center text-secondary mb-6 group-hover:scale-105 transition-transform">
                <span className="material-symbols-outlined text-[32px]">{icon}</span>
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary-container mb-3">{title}</h3>
              <p className="font-body-lg text-body-lg text-on-surface-variant leading-relaxed">{desc}</p>
              <div className="mt-6 pt-4 border-t border-slate-100 flex items-center text-secondary font-label-sm text-label-sm font-bold gap-1">
                <span>{tag}</span>
                <span className="material-symbols-outlined text-[14px]">arrow_right_alt</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

function HowItWorksSection() {
  const steps = [
    {
      num: '01',
      title: 'User Registration',
      desc: 'Decentralized ID creation with cryptographic biometric verification',
      icon: (
        /* UserPlus */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" /><circle cx="9" cy="7" r="4" /><line x1="19" y1="8" x2="19" y2="14" /><line x1="22" y1="11" x2="16" y2="11" />
        </svg>
      ),
      iconColor: 'text-blue-600',
      ringColor: 'ring-blue-100',
    },
    {
      num: '02',
      title: 'Identity Verification',
      desc: 'Multi-layer zero-trust authentication using blockchain proofs and HSM signatures',
      icon: (
        /* ShieldCheck */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" /><polyline points="9 12 11 14 15 10" />
        </svg>
      ),
      iconColor: 'text-blue-600',
      ringColor: 'ring-blue-100',
    },
    {
      num: '03',
      title: 'Asset Minting',
      desc: 'Digital assets tokenized as immutable NFTs on the sovereign blockchain ledger',
      icon: (
        /* Coins */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <circle cx="8" cy="8" r="6" /><path d="M18.09 10.37A6 6 0 1 1 10.34 18" /><path d="M7 6h1v4" /><path d="m16.71 13.88.7.71-2.82 2.82" />
        </svg>
      ),
      iconColor: 'text-amber-600',
      ringColor: 'ring-amber-100',
    },
    {
      num: '04',
      title: 'Smart Governance',
      desc: 'Automated access control and audit trails enforced by post-quantum smart contracts',
      icon: (
        /* Cpu */
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <rect x="4" y="4" width="16" height="16" rx="2" /><rect x="9" y="9" width="6" height="6" /><path d="M15 2v2M9 2v2M15 20v2M9 20v2M2 15h2M2 9h2M20 15h2M20 9h2" />
        </svg>
      ),
      iconColor: 'text-emerald-600',
      ringColor: 'ring-emerald-100',
    },
  ]

  return (
    <section id="technology" className="w-full bg-[#E8F1FB] py-20 px-8 border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto flex flex-col items-center text-center">

        {/* Top pill badge */}
        <div className="inline-flex items-center gap-2 bg-[#0F284E] text-white text-[11px] font-bold px-4 py-1.5 rounded-full tracking-widest uppercase mb-5 shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400 animate-pulse" />
          Sovereign Workflow Pipeline
        </div>

        {/* Heading */}
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary-container tracking-tight mb-3">
          How SecureChain Works
        </h2>

        {/* Sub-heading */}
        <p className="text-sm text-slate-500 font-medium max-w-xl mb-14 leading-relaxed">
          An automated zero-trust protocol — from biometric verification to cryptographic ledger issuance.
        </p>

        {/* Steps grid with connector line */}
        <div className="relative w-full">

          {/* Dashed horizontal connector (desktop only) */}
          <div
            aria-hidden="true"
            className="hidden md:block absolute top-[28px] left-[12.5%] right-[12.5%] border-t-2 border-dashed border-blue-200 z-0"
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 relative z-10">
            {steps.map(({ num, title, desc, icon, iconColor, ringColor }) => (
              <div
                key={num}
                className="bg-white border border-slate-200/90 rounded-2xl p-6 shadow-md hover:shadow-xl hover:-translate-y-1 transition-all duration-300 flex flex-col items-center text-center relative"
              >
                {/* Step number pill */}
                <div className={`ring-4 ${ringColor} bg-[#0F284E] text-white font-bold text-sm w-10 h-10 rounded-full flex items-center justify-center shadow-sm mb-4 shrink-0`}>
                  {num}
                </div>

                {/* Micro icon */}
                <div className={`${iconColor} mb-3`}>
                  {icon}
                </div>

                {/* Title */}
                <h3 className="text-base font-bold text-[#0B2545] mb-2 leading-snug">
                  {title}
                </h3>

                {/* Description */}
                <p className="text-xs text-slate-600 leading-relaxed">
                  {desc}
                </p>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  )
}


/* ─────────────────────────────────────────────────────────
   SECTION 5: PROBLEM STATEMENT  (code.html lines 600-651)
───────────────────────────────────────────────────────── */
function ProblemSection() {
  const challenges = [
    {
      title: 'Siloed & Centralized Identity',
      desc: 'Single points of failure vulnerable to state-sponsored cyber incursions and credential spoofing.',
    },
    {
      title: 'Unverified Asset Provenance',
      desc: 'Defence inventory & sensitive documentation prone to forgery across legacy, disconnected channels.',
    },
    {
      title: 'Latency in Inter-Agency Trust',
      desc: 'Slow, paper-bound authorization chains lacking cryptographic speed and tamper-proof audit trails.',
    },
  ]

  const solutions = [
    {
      title: 'W3C Decentralized Identifiers (DIDs)',
      desc: 'Self-sovereign, tamper-proof biometric identity verification — zero reliance on centralized authorities.',
    },
    {
      title: 'Cryptographic NFT Asset Ledgers',
      desc: 'Real-time, immutable tracking of defence equipment & security clearances on the sovereign blockchain.',
    },
    {
      title: 'BFT Smart Contract Governance',
      desc: 'Zero-trust automated execution with air-gapped Byzantine Fault Tolerant consensus and full audit logs.',
    },
  ]

  return (
    <section id="use-cases" className="w-full bg-surface-container-lowest py-20 px-8" data-problem-anchor>
      <div id="problem-statement" style={{ position: 'relative', top: '-80px', visibility: 'hidden', pointerEvents: 'none' }} aria-hidden="true" />
      <div className="max-w-6xl mx-auto">
        <div className="bg-[#FFFDF8] border border-amber-200/50 border-l-4 border-l-blue-600 rounded-2xl p-8 md:p-10 shadow-lg relative overflow-hidden">

          {/* Decorative background glow */}
          <div aria-hidden="true" className="absolute -top-16 -right-16 w-56 h-56 rounded-full bg-blue-50 opacity-50 blur-3xl pointer-events-none" />

          {/* Header */}
          <span className="text-xs font-bold tracking-widest text-blue-900 uppercase">
            Problem &amp; Sovereign Resolution
          </span>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#0B2545] mt-1 mb-8">
            The Challenge We Solve
          </h2>

          {/* 2-Column grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">

            {/* ── Column 1: Challenges ── */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-red-500 text-[18px]">warning</span>
                <span className="text-xs font-bold tracking-widest text-red-700 uppercase">
                  Critical Infrastructure Bottlenecks
                </span>
              </div>
              {challenges.map(({ title, desc }) => (
                <div
                  key={title}
                  className="bg-red-50/60 border border-red-100 rounded-xl p-4 flex items-start gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-red-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-red-500 text-[15px]">report</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0B2545] mb-0.5">{title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            {/* ── Column 2: Solutions ── */}
            <div className="flex flex-col gap-4">
              <div className="flex items-center gap-2 mb-1">
                <span className="material-symbols-outlined text-blue-600 text-[18px]" style={{ fontVariationSettings: '"FILL" 1' }}>verified_user</span>
                <span className="text-xs font-bold tracking-widest text-blue-800 uppercase">
                  The BELTAL Sovereign Answer
                </span>
              </div>
              {solutions.map(({ title, desc }) => (
                <div
                  key={title}
                  className="bg-blue-50/60 border border-blue-100 rounded-xl p-4 flex items-start gap-3 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200"
                >
                  <div className="mt-0.5 shrink-0 w-7 h-7 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="material-symbols-outlined text-blue-600 text-[15px]" style={{ fontVariationSettings: '"FILL" 1' }}>shield</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-[#0B2545] mb-0.5">{title}</p>
                    <p className="text-xs text-slate-600 leading-relaxed">{desc}</p>
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   SECTION 6: ORG BAR  (code.html lines 652-671)
───────────────────────────────────────────────────────── */
function OrgBar() {
  return (
    <section className="w-full bg-primary-container py-14 px-8 text-center text-on-primary">
      <div className="max-w-4xl mx-auto flex flex-col items-center justify-center">
        <div className="font-headline-md text-headline-md font-bold text-on-primary tracking-wide mb-2 flex items-center justify-center gap-3">
          <span className="material-symbols-outlined text-tertiary-container text-[28px]">token</span>
          <span>Bharat Electronics Limited</span>
        </div>
        <p className="font-body-md text-body-md text-[#A8C8E8] font-medium mb-2">
          Government of India | Ministry of Defence | A Navratna Company
        </p>
        <p className="font-code-sm text-code-sm text-on-primary-container font-normal">
          Category: Software | Theme: Blockchain &amp; Cybersecurity
        </p>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   SECTION 7: INNER FOOTER  (code.html lines 672-727)
───────────────────────────────────────────────────────── */
function InnerFooter() {
  const cols = [
    { heading: 'Platform', links: [{ label: 'Overview', href: '#' }, { label: 'Features', href: '#features' }, { label: 'Technology', href: '#' }, { label: 'Use Cases', href: '#' }] },
    { heading: 'Organization', links: [{ label: 'About BEL', href: '#' }, { label: 'Leadership', href: '#' }, { label: 'Careers', href: '#' }, { label: 'Contact', href: '#' }] },
    { heading: 'Legal', links: [{ label: 'Privacy Policy', href: '#' }, { label: 'Terms of Use', href: '#' }, { label: 'Security', href: '#' }, { label: 'Compliance', href: '#' }] },
  ]

  return (
    <section id="about-bel" className="w-full bg-primary-container py-16 px-8 border-t-2 border-tertiary-container">
      <div className="max-w-7xl mx-auto flex flex-col">
        {/* BEL logo + columns grid */}
        <div className="flex flex-col md:flex-row gap-10 mb-12">
          {/* Square badge */}
          <div className="flex flex-col items-start gap-3 shrink-0">
            <BELFooterBadge />
            <div className="flex flex-col" style={{ maxWidth: '140px' }}>
              <span style={{ fontSize: '13px', fontWeight: 700, color: '#ffffff', lineHeight: 1.2 }}>Bharat Electronics Limited</span>
              <span style={{ fontSize: '10px', color: '#7ab0fe', marginTop: '3px' }}>A Navratna Company</span>
            </div>
          </div>

          {/* Nav columns */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 flex-1">
            {cols.map(({ heading, links }) => (
              <div key={heading} className="flex flex-col">
                <h4 className="font-title-md text-title-md font-bold text-on-primary mb-4">{heading}</h4>
                <div className="space-y-2">
                  {links.map(({ label, href }) => (
                    <a key={label} className="font-body-md text-body-md text-[#A8C8E8] hover:text-on-primary block transition-colors" href={href}>
                      {label}
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div className="pt-8 border-t border-white/10 text-center">
          <p className="font-code-sm text-code-sm text-on-primary-container">
            © 2026 Bharat Electronics Limited. All rights reserved. | CIN: L32309KA1954GOI000787
          </p>
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   BOTTOM FOOTER  (code.html lines 730-740)
───────────────────────────────────────────────────────── */
function BottomFooter() {
  return (
    <footer className="w-full bg-primary text-on-primary border-t-2 border-tertiary-container">
      <div className="max-w-7xl mx-auto px-margin py-space-xl flex flex-col md:flex-row justify-between items-center gap-space-md">
        <div className="flex flex-col gap-space-xs text-center md:text-left">
          <span className="font-headline-sm text-headline-sm text-on-primary tracking-wide">
            Bharat Electronics Limited (BEL)
          </span>
          <span className="font-body-sm text-body-sm text-primary-fixed-dim">
            A Government of India Enterprise under Ministry of Defence
          </span>
        </div>
        <div className="font-code-sm text-code-sm text-on-primary-container text-center md:text-right">
          © 2025 Bharat Electronics Limited. Sovereign Defense Cryptography. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────────
   ROOT PAGE COMPONENT
───────────────────────────────────────────────────────── */
export default function LandingPage() {
  return (
    <div className="bg-surface font-body-md text-on-surface antialiased selection:bg-secondary-fixed selection:text-on-secondary-fixed">
      {/* Inline SVG defs container (from original code.html) */}
      <svg aria-hidden="true" style={{ position: 'absolute', width: 0, height: 0, overflow: 'hidden' }} />

      <GovBanner />
      <SiteHeader mode="home" />

      <main className="w-full max-w-7xl mx-auto px-margin py-space-lg bg-surface min-h-[calc(100vh-116px)]">
        <div className="flex flex-col w-full">
          <HeroSection />
          <TrustSection />
          <FeaturesSection />
          <HowItWorksSection />
          <ProblemSection />
          <OrgBar />
          <InnerFooter />
        </div>
      </main>

      <BottomFooter />
    </div>
  )
}
