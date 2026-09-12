import { useState, useEffect } from 'react'

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
   HEADER / NAV  (code.html lines 55-87)
───────────────────────────────────────────────────────── */
function Header() {
  const navLinks = [
    { label: 'Platform', path: 'platform', active: true },
    { label: 'Features', path: 'features' },
    { label: 'Technology', path: 'technology' },
    { label: 'Use Cases', path: 'use-cases' },
    { label: 'About BEL', path: 'about-bel' },
  ]

  return (
    <header className="sticky top-0 w-full z-40 border-b border-surface-container-highest shadow-[0_1px_8px_rgba(13,43,78,0.06)] bg-[#FFFDF5]">
      <div className="h-20 max-w-7xl mx-auto px-margin flex items-center justify-between">
        {/* Brand */}
        <div className="flex items-center gap-space-md">
          <img
            alt="BEL Official Brand Emblem"
            className="h-8 w-auto object-contain"
            src="https://lh3.googleusercontent.com/aida/AEtjO1UImd28C_QSqVlHoiQt8MunAS-5DfDyWAGa52B36aRC9-2FCj15bxVnFLMLxeuGJK3cVDbFl5qfXMTqRJWO4H7yStUU6NAoE1_LHkj-xFzDb-Y1qkxB-xPXr4QfXu5Oixh3nnxsgDTgmZD8FY6eH4-3mV8E9jmptZ18JvYLR5tW9mKpyvRlR4AR2jEw8QAyDhQ-Yu8-FUAKb4GoN86MussSzHx2Ad9m8a67WklPKHN6zlhl5VlKZXIkoA"
          />
          <div className="h-8 w-px bg-outline-variant" />
          <div className="flex flex-col">
            <span className="font-headline-md text-headline-md text-primary-container leading-none tracking-tight">
              Bharat SecureChain
            </span>
            <span className="font-label-sm text-label-sm text-secondary uppercase tracking-widest mt-1 font-semibold">
              Govt of India • BEL Sovereign Ledger
            </span>
          </div>
        </div>

        {/* Nav */}
        <nav className="hidden md:flex items-center gap-space-xl h-full">
          {navLinks.map(({ label, path, active }) => (
            <a
              key={path}
              href={`#${path}`}
              className={
                active
                  ? 'transition-colors py-space-sm text-secondary border-b-2 border-secondary font-bold'
                  : 'font-title-md text-title-md text-on-surface-variant hover:text-secondary transition-colors py-space-sm'
              }
            >
              {label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-space-md">
          <a
            className="bg-secondary text-on-secondary hover:bg-primary-container font-label-md text-label-md px-space-lg py-space-sm rounded-lg transition-colors flex items-center shadow-sm"
            href="#contact-us"
          >
            Contact Us
          </a>
          <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
            <span className="material-symbols-outlined text-on-primary text-[18px]">person</span>
          </div>
        </div>
      </div>
    </header>
  )
}

/* ─────────────────────────────────────────────────────────
   SECTION 1: HERO  (code.html lines 91-375)
───────────────────────────────────────────────────────── */
function HeroSection() {
  return (
    <section className="w-full bg-gradient-to-b from-[#E8F1FB] to-surface-container-lowest py-24 px-8 border-b border-surface-container-highest">
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
                className="bg-[#FFFDF5] border border-tertiary-container/40 py-3 px-5 rounded-lg shadow-sm flex items-center gap-3 flex-1 min-w-[150px]"
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
            <a
              className="bg-surface-container-lowest border-2 border-secondary text-secondary hover:bg-[#E8F1FB] font-headline-sm text-[18px] font-bold px-8 py-4 rounded-xl inline-flex items-center gap-2 transition-all shadow-xs"
              href="#problem-statement"
            >
              <span>View Problem Statement</span>
            </a>
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
  )
}

/* ─────────────────────────────────────────────────────────
   SECTION 2: TRUST STRIP  (code.html lines 377-413)
───────────────────────────────────────────────────────── */
function TrustSection() {
  const logos = ['BEL', 'DRDO', 'NIC', 'MeitY', 'Digital India']
  return (
    <section className="w-full py-12 px-8 border-t border-[#E2E8F0] bg-[#E8F1FB]">
      <div className="max-w-7xl mx-auto flex flex-col gap-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <span className="font-label-sm text-label-sm text-outline font-bold uppercase tracking-widest">
            TRUSTED BY DEFENCE &amp; GOVERNMENT SECTORS
          </span>
          <span className="font-label-md text-label-md font-semibold text-secondary flex items-center gap-2">
            <span className="material-symbols-outlined text-[18px]">gavel</span>
            <span>Aligned with Ministry of Defence &amp; Digital India Guidelines</span>
          </span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {logos.map((name, i) => (
            <div
              key={name}
              className={`${i === 4 ? 'col-span-2 sm:col-span-1' : ''} bg-surface-container-lowest border border-[#E2E8F0] rounded-lg py-3 px-6 h-12 flex items-center justify-center font-title-md text-title-md font-bold text-on-surface-variant shadow-xs hover:border-secondary transition-colors cursor-default`}
            >
              {name}
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
              className="bg-surface-container-lowest border border-[#E2E8F0] p-8 rounded-xl shadow-[0_2px_8px_rgba(0,0,0,0.06)] hover:border-secondary transition-all flex flex-col relative group"
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

/* ─────────────────────────────────────────────────────────
   SECTION 4: HOW IT WORKS  (code.html lines 500-598)
───────────────────────────────────────────────────────── */
function HowItWorksSection() {
  const steps = [
    { num: '01', title: 'User Registration', desc: 'Decentralized ID creation with cryptographic verification' },
    { num: '02', title: 'Identity Verification', desc: 'Multi-layer authentication using blockchain proofs' },
    { num: '03', title: 'Asset Minting', desc: 'Digital assets converted to NFTs on blockchain' },
    { num: '04', title: 'Smart Governance', desc: 'Automated access control via smart contracts' },
  ]

  return (
    <section className="w-full bg-[#E8F1FB] py-24 px-8 border-t border-[#E2E8F0]">
      <div className="max-w-7xl mx-auto text-center flex flex-col items-center">
        <h2 className="font-headline-lg text-headline-lg font-bold text-primary-container mb-14 tracking-tight">
          How SecureChain Works
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 items-start text-center relative w-full">
          {steps.map(({ num, title, desc }) => (
            <div key={num} className="flex flex-col items-center relative z-10">
              <div className="w-12 h-12 rounded-full bg-secondary text-on-secondary font-headline-sm text-headline-sm font-bold flex items-center justify-center mb-4 shadow-sm border-2 border-surface-container-lowest">
                {num}
              </div>
              <h3 className="font-headline-sm text-headline-sm font-bold text-primary-container mb-2">{title}</h3>
              <p className="font-body-md text-body-md text-on-surface-variant">{desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

/* ─────────────────────────────────────────────────────────
   SECTION 5: PROBLEM STATEMENT  (code.html lines 600-651)
───────────────────────────────────────────────────────── */
function ProblemSection() {
  const points = [
    'Centralized identity systems vulnerable to cyber attacks and single points of failure',
    'Digital asset ownership difficult to verify and track across disconnected systems',
    'Growing need for decentralized, tamper-proof identity and ownership management',
  ]

  return (
    <section className="w-full bg-surface-container-lowest py-20 px-8" id="problem-statement">
      <div className="max-w-4xl mx-auto">
        <div className="bg-[#FFFDF5] border-2 border-tertiary-container/40 border-l-4 border-l-secondary p-12 sm:p-14 rounded-2xl shadow-lg">
          <span className="font-label-md text-[14px] font-bold text-secondary uppercase tracking-wider block mb-4">
            PROBLEM STATEMENT
          </span>
          <h3 className="font-headline-lg text-[32px] leading-tight font-bold text-primary-container mb-8">
            The Challenge We Solve
          </h3>
          <div className="flex flex-col gap-6">
            {points.map((text) => (
              <div key={text} className="flex items-start gap-4">
                <div className="w-8 h-8 rounded-full bg-[#E8F1FB] flex items-center justify-center text-secondary shrink-0 mt-0.5 shadow-xs">
                  <span className="material-symbols-outlined text-[20px] font-bold">check</span>
                </div>
                <p className="font-body-lg text-[18px] text-on-surface-variant font-medium leading-relaxed">{text}</p>
              </div>
            ))}
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
    <section className="w-full bg-primary-container py-16 px-8 border-t-2 border-tertiary-container">
      <div className="max-w-7xl mx-auto flex flex-col">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
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
      <Header />

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
