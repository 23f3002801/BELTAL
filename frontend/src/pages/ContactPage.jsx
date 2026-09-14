import { Link } from 'react-router-dom'
import SiteHeader from '../components/SiteHeader'

/* ─────────────────────────────────────────────────────────
   GOV BANNER  (local copy — same markup as LandingPage)
───────────────────────────────────────────────────────── */
function GovBanner() {
  return (
    <div className="w-full bg-primary-container h-9 border-b-2 border-tertiary-container px-margin-desktop flex items-center justify-between z-50 relative">
      <span className="text-on-primary font-code-sm text-code-sm tracking-wider uppercase opacity-95">
        Government of India | Ministry of Defence
      </span>
      <span className="text-on-primary font-code-sm text-code-sm tracking-wide opacity-90">
        A Navratna Company | CIN: L32309KA1954GOI000787
      </span>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   BREADCRUMB
───────────────────────────────────────────────────────── */
function Breadcrumb() {
  return (
    <nav
      aria-label="Breadcrumb"
      className="w-full bg-[#F0F3FF] border-b border-[#DAE3F7]"
    >
      <div className="max-w-6xl mx-auto px-4 py-2.5 flex items-center gap-1.5 text-sm">
        <Link
          to="/"
          className="flex items-center gap-1 text-[#1E5FA8] hover:text-[#0B2545] font-medium transition-colors"
        >
          {/* Home icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
            className="w-4 h-4 shrink-0"
          >
            <path
              fillRule="evenodd"
              d="M9.293 2.293a1 1 0 0 1 1.414 0l7 7A1 1 0 0 1 17 11h-1v6a1 1 0 0 1-1 1h-3a1 1 0 0 1-1-1v-3H9v3a1 1 0 0 1-1 1H5a1 1 0 0 1-1-1v-6H3a1 1 0 0 1-.707-1.707l7-7Z"
              clipRule="evenodd"
            />
          </svg>
          Home
        </Link>
        <span className="text-slate-400 font-medium">»</span>
        <span className="text-[#0B2545] font-semibold">Contact Us</span>
      </div>
    </nav>
  )
}

/* ─────────────────────────────────────────────────────────
   HERO BANNER
───────────────────────────────────────────────────────── */
function HeroBanner() {
  return (
    <div className="relative w-full overflow-hidden" style={{ minHeight: '200px' }}>
      {/* Dark defense-tech backdrop */}
      <div
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(135deg, #001631 0%, #0D2B4E 45%, #0a1e38 70%, #071325 100%)',
        }}
      />

      {/* Grid overlay */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage:
            'linear-gradient(rgba(59,130,196,0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59,130,196,0.5) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* Radial glow accent */}
      <div
        className="absolute right-0 top-0 w-96 h-96 opacity-20"
        style={{
          background:
            'radial-gradient(ellipse at 80% 20%, #1E5FA8 0%, transparent 70%)',
        }}
      />

      {/* Watermark icons row — right side */}
      <div className="absolute right-8 inset-y-0 flex items-center gap-6 opacity-10 pointer-events-none select-none">
        {/* Phone icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="white" viewBox="0 0 24 24" className="w-16 h-16">
          <path d="M6.6 10.8c1.4 2.8 3.8 5.1 6.6 6.6l2.2-2.2c.3-.3.7-.4 1-.2 1.1.4 2.3.6 3.6.6.6 0 1 .4 1 1V20c0 .6-.4 1-1 1-9.4 0-17-7.6-17-17 0-.6.4-1 1-1h3.5c.6 0 1 .4 1 1 0 1.3.2 2.5.6 3.6.1.3 0 .7-.2 1L6.6 10.8z" />
        </svg>
        {/* Mail icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24" className="w-16 h-16">
          <rect x="2" y="4" width="20" height="16" rx="2" />
          <path d="m2 7 10 6 10-6" />
        </svg>
        {/* Globe icon */}
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" stroke="white" strokeWidth="1.5" viewBox="0 0 24 24" className="w-16 h-16">
          <circle cx="12" cy="12" r="10" />
          <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
        </svg>
      </div>

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 py-12 flex items-center">
        {/* Title badge — solid navy rounded pill */}
        <div className="inline-flex items-center gap-3">
          <span
            className="bg-[#0B1E36] text-white text-xl font-bold px-6 py-2.5 rounded-full tracking-wide shadow-lg border border-[#3B82C4]/30"
            style={{ letterSpacing: '0.04em' }}
          >
            Contact Us
          </span>

          {/* Decorative accent line */}
          <div className="hidden sm:flex flex-col gap-1 ml-2">
            <div className="w-16 h-0.5 bg-[#C8A74C] rounded" />
            <div className="w-10 h-0.5 bg-[#C8A74C]/50 rounded" />
          </div>
        </div>

        {/* Live status chip */}
        <div className="ml-auto hidden md:flex items-center gap-2 bg-white/5 border border-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
          </span>
          <span className="text-[11px] font-semibold text-emerald-300 tracking-wider uppercase">
            Helpdesk Active
          </span>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   INFO CARD  (shared wrapper for left-column sections)
───────────────────────────────────────────────────────── */
function InfoCard({ children, className = '' }) {
  return (
    <div className={`bg-white rounded-2xl border border-slate-200 shadow-sm p-7 ${className}`}>
      {children}
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   MAIN CONTENT
───────────────────────────────────────────────────────── */
function ContactContent() {
  return (
    <div className="max-w-6xl mx-auto px-4 py-10 grid grid-cols-1 md:grid-cols-2 gap-10">

      {/* ── LEFT COLUMN ── */}
      <div className="flex flex-col gap-7">

        {/* Section 1: Contact Numbers */}
        <InfoCard>
          <div className="h-1 w-16 rounded-full bg-[#1E5FA8] mb-5" />

          <h2 className="text-xl font-bold text-[#0B62A4] mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#1E5FA8]">call</span>
            Contact Us
          </h2>

          {/* Primary Phone */}
          <div className="flex items-start gap-3 mb-1">
            <span className="material-symbols-outlined text-[18px] text-slate-400 mt-0.5">phone_in_talk</span>
            <div>
              <p className="text-[13px] text-slate-500 font-medium mb-0.5">Main Office</p>
              <p className="font-medium text-slate-800 text-[15px] tracking-wide">
                +91- 80-25039300
              </p>
            </div>
          </div>

          {/* Divider */}
          <div className="border-b border-slate-300 my-4" />

          {/* Toll-free */}
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[18px] text-[#1E5FA8] mt-0.5">support_agent</span>
            <div>
              <p className="font-medium text-slate-800 text-[15px] tracking-wide">
                18004250433{' '}
                <span className="text-[12px] font-semibold text-emerald-600 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full ml-1">
                  Toll Free
                </span>
              </p>
              <p className="text-sm text-slate-600 mt-1.5 leading-relaxed">
                BEL Customer complaints registration only
              </p>
            </div>
          </div>

          {/* Quick info chips */}
          <div className="mt-5 flex flex-wrap gap-2">
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-[#0B2545] bg-[#E8F1FB] px-3 py-1 rounded-full border border-[#3B82C4]/20">
              <span className="material-symbols-outlined text-[12px]">schedule</span>
              Mon – Fri, 9 AM – 6 PM IST
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-slate-600 bg-slate-50 px-3 py-1 rounded-full border border-slate-200">
              <span className="material-symbols-outlined text-[12px]">language</span>
              English · Hindi
            </span>
          </div>
        </InfoCard>

        {/* Section 2: Registered Office */}
        <InfoCard>
          <div className="h-1 w-16 rounded-full bg-[#C8A74C] mb-5" />

          <h2 className="text-xl font-bold text-[#0B62A4] mt-0 mb-3 flex items-center gap-2">
            <span className="material-symbols-outlined text-[22px] text-[#1E5FA8]">corporate_fare</span>
            Registered Office
          </h2>

          <p className="font-semibold text-slate-900 text-[15px]">
            Bharat Electronics Limited
          </p>

          {/* Divider */}
          <div className="border-b border-slate-300 my-4" />

          {/* Address */}
          <div className="flex items-start gap-3">
            <span className="material-symbols-outlined text-[18px] text-slate-400 mt-0.5">location_on</span>
            <address className="not-italic text-slate-700 text-[14px] leading-relaxed">
              <span className="block font-semibold text-slate-800">Corporate Office</span>
              Outer Ring Road, Nagavara<br />
              Bangalore – 560045<br />
              Karnataka, India
            </address>
          </div>

          {/* Email */}
          <div className="border-b border-slate-300 my-4" />

          <div className="flex items-center gap-3">
            <span className="material-symbols-outlined text-[18px] text-slate-400">mail</span>
            <a
              href="mailto:webmaster@bel.co.in"
              className="text-[14px] text-[#1E5FA8] hover:underline font-medium"
            >
              webmaster@bel.co.in
            </a>
          </div>

          {/* CIN */}
          <div className="mt-4 text-[11px] text-slate-400 font-mono">
            CIN: L32309KA1954GOI000787 &nbsp;|&nbsp; A Navratna Company
          </div>
        </InfoCard>

        {/* Compliance strip */}
        <div className="flex items-center gap-2 bg-[#E8F1FB] border border-[#3B82C4]/20 rounded-xl px-4 py-3">
          <span className="material-symbols-outlined text-[18px] text-[#1E5FA8]">verified_user</span>
          <span className="text-[12px] font-semibold text-[#0B2545]">
            ISO 27001 Compliant &nbsp;•&nbsp; Government of India Enterprise &nbsp;•&nbsp; MoD Registered
          </span>
        </div>
      </div>

      {/* ── RIGHT COLUMN — Interactive Map ── */}
      <div className="flex flex-col gap-4">
        {/* Map label */}
        <div className="flex items-center gap-2">
          <span className="material-symbols-outlined text-[20px] text-[#1E5FA8]">map</span>
          <h3 className="text-[15px] font-bold text-[#0B2545] tracking-wide uppercase">
            Corporate Office — Bengaluru
          </h3>
        </div>

        {/* Map card */}
        <div className="w-full h-80 rounded-xl overflow-hidden border border-slate-300 shadow-md">
          <iframe
            title="BEL Corporate Office Bangalore"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.643695277884!2d77.6148!3d13.0402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae171542f7c6e1%3A0x6d9f8c68c4d29c89!2sBharat%20Electronics%20Limited!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
            width="100%"
            height="100%"
            style={{ border: 0 }}
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
          />
        </div>

        {/* Directions CTA */}
        <a
          href="https://maps.google.com/?q=Bharat+Electronics+Limited+Bangalore"
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center justify-center gap-2 bg-[#1E5FA8] hover:bg-[#0D2B4E] text-white font-semibold text-sm px-5 py-2.5 rounded-lg transition-all shadow-sm"
        >
          <span className="material-symbols-outlined text-[18px]">directions</span>
          Get Directions
        </a>

        {/* Mini contact quick-ref card */}
        <div className="bg-white border border-slate-200 rounded-xl p-5 shadow-sm">
          <p className="text-[11px] font-bold tracking-widest text-slate-400 uppercase mb-3">
            Quick Reference
          </p>
          <div className="grid grid-cols-1 gap-3">
            {[
              { icon: 'phone', label: 'Main', value: '+91 80 2503 9300' },
              { icon: 'headset_mic', label: 'Toll-Free', value: '1800 425 0433' },
              { icon: 'mail', label: 'Email', value: 'webmaster@bel.co.in' },
              { icon: 'public', label: 'Web', value: 'www.bel.co.in' },
            ].map(({ icon, label, value }) => (
              <div key={label} className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-[#E8F1FB] flex items-center justify-center shrink-0">
                  <span className="material-symbols-outlined text-[16px] text-[#1E5FA8]">{icon}</span>
                </div>
                <div>
                  <p className="text-[11px] text-slate-400 font-semibold leading-none">{label}</p>
                  <p className="text-[13px] text-slate-700 font-medium mt-0.5">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────────────────────
   BOTTOM FOOTER  (mirrors LandingPage)
───────────────────────────────────────────────────────── */
function BottomFooter() {
  return (
    <footer className="w-full bg-[#001631] text-white border-t-2 border-[#C8A74C]">
      <div className="max-w-7xl mx-auto px-6 py-6 flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex flex-col gap-1 text-center md:text-left">
          <span className="font-bold text-[15px] tracking-wide">
            Bharat Electronics Limited (BEL)
          </span>
          <span className="text-[12px] text-[#7993BC]">
            A Government of India Enterprise under Ministry of Defence
          </span>
        </div>
        <div className="text-[11px] text-[#7993BC] text-center md:text-right font-mono">
          © 2025 Bharat Electronics Limited. Sovereign Defense Cryptography. All Rights Reserved.
        </div>
      </div>
    </footer>
  )
}

/* ─────────────────────────────────────────────────────────
   ROOT EXPORT
───────────────────────────────────────────────────────── */
export default function ContactPage() {
  return (
    <div className="min-h-screen flex flex-col">
      <GovBanner />
      <SiteHeader mode="page" />

      {/* ── Dark hero banner ── */}
      <HeroBanner />

      {/* ── White content area directly below banner ── */}
      <div className="bg-white py-10 px-4 md:px-8 flex-1">
        <div className="max-w-6xl mx-auto">

          {/* Breadcrumb */}
          <div className="text-xs text-slate-500 mb-8 flex items-center gap-1 font-sans">
            <span>🏠 Home</span>
            <span className="mx-1 font-bold">»</span>
            <span className="text-slate-800 font-medium">Contact Us</span>
          </div>

          {/* 2-Column Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-10 items-start">

            {/* ── Left Column: Contact Numbers + Registered Office ── */}
            <div className="space-y-8">

              {/* Contact Numbers */}
              <div>
                <h2 className="text-2xl font-bold text-[#0B62A4] pb-2 border-b border-slate-200">
                  Contact Us
                </h2>
                <div className="mt-4 space-y-3">
                  <p className="text-lg font-semibold text-slate-800">
                    +91- 80-25039300
                  </p>
                  <div className="border-b border-slate-200 pt-2 pb-4">
                    <p className="text-base font-bold text-slate-900">
                      18004250433{' '}
                      <span className="font-normal text-slate-600">(Toll Free)</span>
                    </p>
                    <p className="text-xs text-slate-500 mt-0.5">
                      BEL Customer complaints registration only
                    </p>
                  </div>
                </div>
              </div>

              {/* Registered Office */}
              <div>
                <h2 className="text-2xl font-bold text-[#0B62A4] pb-2 border-b border-slate-200">
                  Registered Office
                </h2>
                <div className="mt-4 space-y-1 text-slate-700 leading-relaxed text-sm">
                  <p className="font-bold text-slate-900 text-base">Bharat Electronics Limited</p>
                  <div className="border-b border-slate-200 my-3" />
                  <p className="text-slate-600">Corporate Office</p>
                  <p className="text-slate-600">Outer Ring Road, Nagavara</p>
                  <p className="text-slate-600">Bangalore - 560045</p>
                  <p className="text-slate-600">Karnataka, India</p>
                </div>
              </div>

            </div>

            {/* ── Right Column: Google Maps Embed ── */}
            <div className="w-full h-[360px] rounded-xl overflow-hidden border border-slate-300 shadow-md">
              <iframe
                title="BEL Corporate Office Bangalore"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3886.643695277884!2d77.6148!3d13.0402!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bae171542f7c6e1%3A0x6d9f8c68c4d29c89!2sBharat%20Electronics%20Limited!5e0!3m2!1sen!2sin!4v1700000000000!5m2!1sen!2sin"
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              />
            </div>

          </div>
        </div>
      </div>

      <BottomFooter />
    </div>
  )
}
