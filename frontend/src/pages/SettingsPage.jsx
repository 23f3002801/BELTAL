import { useEffect, useState } from 'react';

export default function SettingsPage() {
  const [theme, setTheme] = useState(() => localStorage.getItem('beltal-theme') || 'dark');

  useEffect(() => {
    localStorage.setItem('beltal-theme', theme);
    window.dispatchEvent(new CustomEvent('beltal:theme-change', { detail: theme }));
  }, [theme]);

  return (
    <section className="mx-auto max-w-4xl space-y-6 text-slate-100">
      <header>
        <p className="text-xs font-bold tracking-[0.18em] text-emerald-400 uppercase">Officer Console</p>
        <h1 className="mt-2 text-3xl font-black">Settings</h1>
        <p className="mt-2 text-sm text-slate-400">Personal display preferences are stored only in this browser.</p>
      </header>
      <div className="rounded-xl border border-[#1F293D] bg-[#0D1F38] p-6">
        <h2 className="text-base font-bold">Dashboard appearance</h2>
        <p className="mt-1 text-sm text-slate-400">Choose the theme used by the officer console.</p>
        <div className="mt-5 flex flex-wrap gap-3">
          {['dark', 'light'].map((option) => (
            <button key={option} onClick={() => setTheme(option)} className={`rounded-lg border px-5 py-3 text-sm font-bold capitalize transition-colors ${theme === option ? 'border-[#1E5FA8] bg-[#1E5FA8] text-white' : 'border-[#1F293D] bg-[#060D1A] text-slate-300 hover:border-slate-500'}`}>
              <span className="material-symbols-outlined mr-2 align-middle text-[18px]">{option === 'dark' ? 'dark_mode' : 'light_mode'}</span>{option}
            </button>
          ))}
        </div>
      </div>
    </section>
  );
}
