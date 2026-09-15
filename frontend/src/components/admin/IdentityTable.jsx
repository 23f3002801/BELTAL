import { useState, useEffect, useCallback, useRef } from 'react';
import Table from '../ui/Table';
import Modal from '../ui/Modal';
import Button from '../ui/button';
import { useToast } from '../ui/Toast';
import { adminApi } from '../../services/api';

/* ── Constants ───────────────────────────────────────────── */
const ROLES    = ['ADMIN', 'OFFICER', 'AUDITOR', 'SYSTEM_CONNECTOR'];
const TIERS    = [1, 2, 3, 4, 5];

const ROLE_COLORS = {
  ADMIN:            'text-amber-300  bg-amber-900/30  border-amber-700/40',
  OFFICER:          'text-blue-300   bg-blue-900/30   border-blue-700/40',
  AUDITOR:          'text-purple-300 bg-purple-900/30 border-purple-700/40',
  SYSTEM_CONNECTOR: 'text-teal-300   bg-teal-900/30   border-teal-700/40',
};

const TIER_COLORS = {
  1: 'text-slate-400  bg-slate-800/40  border-slate-600/30',
  2: 'text-sky-400    bg-sky-900/30    border-sky-700/30',
  3: 'text-blue-300   bg-blue-900/30   border-blue-700/40',
  4: 'text-violet-300 bg-violet-900/30 border-violet-700/40',
  5: 'text-amber-300  bg-amber-900/30  border-amber-700/40',
};

/* ── Truncate wallet address ─────────────────────────────── */
function truncateAddr(addr = '') {
  if (!addr || addr.length < 12) return addr;
  return `${addr.slice(0, 6)}…${addr.slice(-4)}`;
}

/* ── CopyButton ──────────────────────────────────────────── */
function CopyButton({ text }) {
  const [copied, setCopied] = useState(false);
  const handle = (e) => {
    e.stopPropagation();
    navigator.clipboard.writeText(text).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    });
  };
  return (
    <button
      onClick={handle}
      title="Copy full address"
      className="ml-1.5 p-0.5 rounded text-slate-600 hover:text-[#7ab0fe] transition-colors"
    >
      <span className="material-symbols-outlined text-[13px]">
        {copied ? 'check' : 'content_copy'}
      </span>
    </button>
  );
}

/* ── EditRoleModal ───────────────────────────────────────── */
function EditRoleModal({ identity, open, onClose, onSaved }) {
  const toast   = useToast();
  const [role,  setRole]  = useState(identity?.role ?? 'OFFICER');
  const [tier,  setTier]  = useState(identity?.clearanceLevel ?? 1);
  const [busy,  setBusy]  = useState(false);

  /* Sync when identity changes */
  useEffect(() => {
    if (identity) {
      setRole(identity.role ?? 'OFFICER');
      setTier(identity.clearanceLevel ?? 1);
    }
  }, [identity]);

  const handleSave = async () => {
    setBusy(true);
    try {
      await adminApi.updateRole(identity.id, { role, clearanceLevel: tier });
      toast.success(
        `Identity ${truncateAddr(identity.walletAddress)} updated on the sovereign ledger.`,
        'Role Updated'
      );
      onSaved?.();
      onClose();
    } catch (err) {
      toast.error(err?.uiMessage ?? 'Failed to update role. Please retry.', 'Update Failed');
    } finally {
      setBusy(false);
    }
  };

  const selectCls =
    'w-full bg-[#060D1A] border border-[#1E2E48] rounded-lg px-3 py-2 text-[13px] text-slate-200 ' +
    'focus:outline-none focus:border-[#1E5FA8] focus:ring-1 focus:ring-[#1E5FA8]/40 transition-colors';

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Modify Identity Clearance"
      size="sm"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={onClose} disabled={busy}>
            Cancel
          </Button>
          <Button size="sm" loading={busy} onClick={handleSave}>
            {busy ? 'Recording to Ledger…' : 'Save Changes'}
          </Button>
        </>
      }
    >
      {/* Identity context strip */}
      <div className="mb-5 px-3 py-2.5 rounded-lg bg-[#040A14] border border-[#1E2E48] flex items-center gap-3">
        <span
          className="material-symbols-outlined text-[18px] text-[#D4AF37]"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          badge
        </span>
        <div>
          <p className="text-[11px] text-slate-500 font-bold tracking-wider uppercase">Identity</p>
          <code className="text-[12px] text-[#7ab0fe]">{truncateAddr(identity?.walletAddress)}</code>
          {identity?.displayName && (
            <span className="ml-2 text-[11px] text-slate-400">— {identity.displayName}</span>
          )}
        </div>
      </div>

      <div className="space-y-4">
        {/* Role */}
        <div>
          <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">
            Role
          </label>
          <select
            id="edit-role-select"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            className={selectCls}
          >
            {ROLES.map((r) => (
              <option key={r} value={r}>{r}</option>
            ))}
          </select>
        </div>

        {/* Clearance Tier */}
        <div>
          <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-1.5">
            Clearance Tier
          </label>
          <select
            id="edit-tier-select"
            value={tier}
            onChange={(e) => setTier(Number(e.target.value))}
            className={selectCls}
          >
            {TIERS.map((t) => (
              <option key={t} value={t}>
                Tier {t}{t === 5 ? ' — Sovereign' : t === 1 ? ' — Basic' : ''}
              </option>
            ))}
          </select>
        </div>
      </div>

      <p className="mt-4 text-[11px] text-slate-600 leading-relaxed">
        Changes are recorded on the BELTAL sovereign ledger and propagated to all consensus nodes.
      </p>
    </Modal>
  );
}

/* ── Filter / Search Bar ─────────────────────────────────── */
function FilterBar({ search, sbu, clearance, onSearchChange, onSbuChange, onClearanceChange }) {
  const inputCls =
    'bg-[#060D1A] border border-[#1E2E48] rounded-lg px-3 py-2 text-[13px] text-slate-300 ' +
    'focus:outline-none focus:border-[#1E5FA8] focus:ring-1 focus:ring-[#1E5FA8]/40 transition-colors ' +
    'placeholder:text-slate-600';

  return (
    <div className="flex flex-wrap gap-3 mb-4">
      {/* Search */}
      <div className="relative flex-1 min-w-[220px]">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 material-symbols-outlined text-[16px] text-slate-600">
          search
        </span>
        <input
          id="identity-search"
          type="text"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search wallet address or DID…"
          className={`${inputCls} pl-8 w-full`}
        />
      </div>

      {/* SBU Filter */}
      <select
        id="identity-sbu-filter"
        value={sbu}
        onChange={(e) => onSbuChange(e.target.value)}
        className={`${inputCls} min-w-[140px]`}
      >
        <option value="">All SBUs</option>
        {['ALPHA', 'BRAVO', 'CHARLIE', 'DELTA', 'ECHO', 'FOXTROT', 'SIERRA'].map((s) => (
          <option key={s} value={s}>{s}</option>
        ))}
      </select>

      {/* Clearance Filter */}
      <select
        id="identity-clearance-filter"
        value={clearance}
        onChange={(e) => onClearanceChange(e.target.value)}
        className={`${inputCls} min-w-[140px]`}
      >
        <option value="">All Tiers</option>
        {TIERS.map((t) => (
          <option key={t} value={t}>Tier {t}</option>
        ))}
      </select>
    </div>
  );
}

/* ── IdentityTable (main export) ─────────────────────────── */
export default function IdentityTable({ refreshTrigger, onRegisterClick }) {
  const toast = useToast();

  /* Filter state */
  const [search,    setSearch]    = useState('');
  const [sbu,       setSbu]       = useState('');
  const [clearance, setClearance] = useState('');

  /* Data state */
  const [rows,    setRows]    = useState([]);
  const [total,   setTotal]   = useState(0);
  const [page,    setPage]    = useState(1);
  const [loading, setLoading] = useState(false);

  /* Edit role modal state */
  const [editTarget, setEditTarget] = useState(null);
  const [editOpen,   setEditOpen]   = useState(false);

  /* Debounce search */
  const debounceRef = useRef(null);

  const fetchIdentities = useCallback(async (params) => {
    setLoading(true);
    try {
      const data = await adminApi.listIdentities(params);
      setRows(data.users ?? []);
      setTotal(data.total ?? 0);
    } catch (err) {
      toast.error(err?.uiMessage ?? 'Failed to load identity ledger.', 'Ledger Error');
      setRows([]);
    } finally {
      setLoading(false);
    }
  }, [toast]);

  /* Refetch on filter / page / external refresh change */
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      fetchIdentities({ search, sbu, clearance, page, limit: 20 });
    }, search ? 350 : 0);
    return () => clearTimeout(debounceRef.current);
  }, [search, sbu, clearance, page, refreshTrigger, fetchIdentities]);

  /* Reset page on filter change */
  const handleSearch    = (v) => { setSearch(v);    setPage(1); };
  const handleSbu       = (v) => { setSbu(v);       setPage(1); };
  const handleClearance = (v) => { setClearance(v); setPage(1); };

  const LIMIT = 20;
  const totalPages = Math.max(1, Math.ceil(total / LIMIT));

  /* ── Columns ── */
  const columns = [
    {
      key: 'walletAddress',
      label: 'Wallet Address',
      render: (val) => (
        <div className="flex items-center font-mono">
          <span className="text-[#7ab0fe]">{truncateAddr(val)}</span>
          {val && <CopyButton text={val} />}
        </div>
      ),
    },
    {
      key: 'role',
      label: 'Role',
      render: (val) => (
        <span
          className={`inline-block text-[10px] font-black tracking-widest uppercase px-2 py-0.5 rounded border
            ${ROLE_COLORS[val] ?? 'text-slate-400 bg-slate-800/30 border-slate-600/30'}`}
        >
          {val ?? '—'}
        </span>
      ),
    },
    {
      key: 'clearanceLevel',
      label: 'Clearance',
      align: 'center',
      render: (val) => (
        <span
          className={`inline-block text-[10px] font-black tracking-wider uppercase px-2 py-0.5 rounded-full border
            ${TIER_COLORS[val] ?? TIER_COLORS[1]}`}
        >
          T-{val ?? '?'}
        </span>
      ),
    },
    {
      key: 'sbu',
      label: 'SBU',
      align: 'center',
      render: (val) => (
        <span className="text-[12px] font-mono text-slate-400">{val ?? '—'}</span>
      ),
    },
    {
      key: 'isActive',
      label: 'On-Chain Status',
      align: 'center',
      render: (val) => (
        <span
          className={`inline-flex items-center gap-1.5 text-[11px] font-bold tracking-wide
            ${val ? 'text-emerald-400' : 'text-red-400'}`}
        >
          <span
            className={`w-1.5 h-1.5 rounded-full ${val ? 'bg-emerald-400 animate-pulse' : 'bg-red-400'}`}
          />
          {val ? 'ACTIVE' : 'REVOKED'}
        </span>
      ),
    },
    {
      key: '_actions',
      label: 'Actions',
      align: 'center',
      render: (_, row) => (
        <button
          id={`edit-role-${row.id}`}
          onClick={() => { setEditTarget(row); setEditOpen(true); }}
          className="inline-flex items-center gap-1 text-[11px] font-bold text-[#7ab0fe] hover:text-white
            bg-[#0D2245]/60 hover:bg-[#1E5FA8]/30 border border-[#1E5FA8]/30 hover:border-[#1E5FA8]/60
            px-2.5 py-1 rounded-lg transition-all"
        >
          <span className="material-symbols-outlined text-[13px]">edit</span>
          Edit Role
        </button>
      ),
    },
  ];

  return (
    <div className="dashboard-ledger">
      {/* Header row */}
      <div className="flex items-center justify-between mb-3">
        <div>
          <h2 className="text-[13px] font-black tracking-widest uppercase text-slate-300">
            Identity Ledger
          </h2>
          {!loading && (
            <p className="text-[11px] text-slate-600 mt-0.5">
              {total.toLocaleString()} {total === 1 ? 'identity' : 'identities'} provisioned
            </p>
          )}
        </div>
        <Button
          id="register-identity-btn"
          size="sm"
          icon={<span className="material-symbols-outlined text-[15px]">person_add</span>}
          onClick={onRegisterClick}
        >
          Register Identity
        </Button>
      </div>

      {/* Filters */}
      <FilterBar
        search={search}
        sbu={sbu}
        clearance={clearance}
        onSearchChange={handleSearch}
        onSbuChange={handleSbu}
        onClearanceChange={handleClearance}
      />

      {/* Table */}
      <Table
        className="dashboard-table"
        columns={columns}
        data={rows}
        loading={loading}
        emptyMessage="No identities found on the sovereign ledger."
      />

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-end gap-2 mt-3">
          <button
            id="identity-prev-page"
            disabled={page <= 1}
            onClick={() => setPage((p) => p - 1)}
            className="px-3 py-1.5 text-[12px] font-bold text-slate-400 hover:text-slate-200
              bg-[#0D1F38] hover:bg-[#152847] border border-[#1E2E48] rounded-lg
              disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            ← Prev
          </button>
          <span className="text-[12px] text-slate-500 font-mono">
            {page} / {totalPages}
          </span>
          <button
            id="identity-next-page"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => p + 1)}
            className="px-3 py-1.5 text-[12px] font-bold text-slate-400 hover:text-slate-200
              bg-[#0D1F38] hover:bg-[#152847] border border-[#1E2E48] rounded-lg
              disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            Next →
          </button>
        </div>
      )}

      {/* Edit Role Modal */}
      <EditRoleModal
        identity={editTarget}
        open={editOpen}
        onClose={() => setEditOpen(false)}
        onSaved={() => fetchIdentities({ search, sbu, clearance, page, limit: 20 })}
      />
    </div>
  );
}
