import { useAuth, shortenAddress } from '../context/AuthContext';

export default function ProfilePage() {
  const { user } = useAuth();
  const details = [
    ['Wallet address', user?.walletAddress || 'Not available'],
    ['Assigned role', user?.role || 'USER'],
    ['Clearance level', String(user?.clearanceLevel ?? 1)],
    ['Strategic business unit', user?.sbu || 'Not assigned'],
    ['Identity status', user?.isRegistered ? 'Registered identity' : 'Wallet verified — onboarding pending'],
  ];

  return (
    <section className="mx-auto max-w-4xl space-y-6 text-slate-100">
      <header>
        <p className="text-xs font-bold tracking-[0.18em] text-emerald-400 uppercase">Officer Console</p>
        <h1 className="mt-2 text-3xl font-black">My Profile</h1>
        <p className="mt-2 text-sm text-slate-400">Your identity attributes are issued by an administrator and secured by your wallet signature.</p>
      </header>
      <div className="rounded-xl border border-[#1F293D] bg-[#0D1F38] overflow-hidden">
        <div className="flex items-center gap-4 border-b border-[#1F293D] p-6">
          <div className="flex h-14 w-14 items-center justify-center rounded-full bg-[#1E3E62] text-xl font-black text-[#7ab0fe]">
            {shortenAddress(user?.walletAddress || 'OF').slice(0, 2).toUpperCase()}
          </div>
          <div>
            <h2 className="font-bold text-slate-100">{user?.name || 'Officer'}</h2>
            <p className="mt-1 font-mono text-xs text-slate-400">{shortenAddress(user?.walletAddress)}</p>
          </div>
        </div>
        <dl className="divide-y divide-[#1F293D]">
          {details.map(([label, value]) => (
            <div key={label} className="grid gap-1 px-6 py-4 sm:grid-cols-3 sm:gap-4">
              <dt className="text-sm text-slate-400">{label}</dt>
              <dd className="break-all text-sm font-semibold text-slate-100 sm:col-span-2">{value}</dd>
            </div>
          ))}
        </dl>
      </div>
      {!user?.isRegistered && <p className="rounded-lg border border-amber-700/40 bg-amber-950/20 p-4 text-sm text-amber-200">Your wallet is authenticated but has not yet been provisioned as a database identity. Ask an administrator to register it before requesting elevated access.</p>}
    </section>
  );
}
