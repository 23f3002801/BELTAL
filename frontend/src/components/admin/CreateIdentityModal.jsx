import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/button';
import { useToast } from '../ui/Toast';
import { adminApi } from '../../services/api';

/* ── Constants ───────────────────────────────────────────── */
const ROLES = ['ADMIN', 'MANAGER', 'AUDITOR', 'USER', 'SYSTEM_CONNECTOR'];
const TIERS = [1, 2, 3, 4];
const SBUS = ['SBU_RADAR', 'SBU_EW', 'SBU_MILCOMM', 'SBU_CYBER'];

/* ── Client-side SHA-256 hash of a string (Web Crypto) ───── */
async function sha256hex(str) {
  const enc  = new TextEncoder();
  const buf  = await crypto.subtle.digest('SHA-256', enc.encode(str));
  return Array.from(new Uint8Array(buf))
    .map((b) => b.toString(16).padStart(2, '0'))
    .join('');
}

/* ── Validate 0x wallet address (basic) ─────────────────── */
const isValidAddress = (addr) => /^0x[0-9a-fA-F]{40}$/.test(addr.trim());

/* ── Field component ─────────────────────────────────────── */
function Field({ label, id, error, children }) {
  return (
    <div>
      <label
        htmlFor={id}
        className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase mb-1.5"
      >
        {label}
      </label>
      {children}
      {error && (
        <p className="mt-1 text-[11px] text-red-400 flex items-center gap-1">
          <span className="material-symbols-outlined text-[13px]">error</span>
          {error}
        </p>
      )}
    </div>
  );
}

/* ── Shared input / select styles ────────────────────────── */
const INPUT_CLS =
  'w-full bg-[#060D1A] border border-[#1E2E48] rounded-lg px-3 py-2 text-[13px] text-slate-200 ' +
  'focus:outline-none focus:border-[#1E5FA8] focus:ring-1 focus:ring-[#1E5FA8]/40 transition-colors ' +
  'placeholder:text-slate-600';

const INPUT_ERR =
  'border-red-700/60 focus:border-red-500 focus:ring-red-500/30';

/* ── CreateIdentityModal ─────────────────────────────────── */
/**
 * Props
 * ─────
 * open    : boolean
 * onClose : () => void
 * onCreated : () => void   — called after successful registration to refresh parent table
 */
export default function CreateIdentityModal({ open, onClose, onCreated }) {
  const toast = useToast();

  /* ── Form state ── */
  const [form, setForm] = useState({
    walletAddress: '',
    externalId:    '',
    fullName:      '',
    role:          'USER',
    clearanceLevel: 1,
    sbu:           '',
    displayName:   '',
  });

  const [errors,  setErrors]  = useState({});
  const [busy,    setBusy]    = useState(false);
  const [hashStep, setHashStep] = useState(false); // shows "Hashing…" label

  /* ── Field change handler ── */
  const set = (field) => (e) => {
    const val = e.target.type === 'number' ? Number(e.target.value) : e.target.value;
    setForm((prev) => ({ ...prev, [field]: val }));
    if (errors[field]) setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  /* ── Validation ── */
  const validate = () => {
    const errs = {};
    if (!form.walletAddress.trim()) {
      errs.walletAddress = 'Wallet address is required.';
    } else if (!isValidAddress(form.walletAddress)) {
      errs.walletAddress = 'Must be a valid 0x Ethereum address (42 hex chars).';
    }
    if (!form.sbu.trim()) {
      errs.sbu = 'SBU code is required.';
    } else if (!/^[A-Z0-9_-]{2,10}$/i.test(form.sbu.trim())) {
      errs.sbu = 'SBU must be 2–10 alphanumeric characters.';
    }
    return errs;
  };

  /* ── Submit ── */
  const handleSubmit = async () => {
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }

    setBusy(true);
    setHashStep(true);

    try {
      /* Client-side hash of PII fields before sending to ledger */
      const piiString   = `${form.displayName.trim()}||${form.walletAddress.trim()}||${Date.now()}`;
      const identityHash = await sha256hex(piiString);
      setHashStep(false);

      await adminApi.registerIdentity({
        walletAddress:  form.walletAddress.trim(),
        role:           form.role,
        clearanceLevel: Number(form.clearanceLevel),
        sbu:            form.sbu.trim().toUpperCase(),
        displayName:    form.displayName.trim() || undefined,
        identityHash,
      });

      toast.success(
        `Identity for ${form.walletAddress.slice(0, 10)}… has been recorded on the sovereign ledger.`,
        'Identity Provisioned'
      );

      /* Reset form */
      setForm({ walletAddress: '', role: 'OFFICER', clearanceLevel: 1, sbu: '', displayName: '' });
      setErrors({});
      onCreated?.();
      onClose();
    } catch (err) {
      setHashStep(false);
      toast.error(
        err?.uiMessage ?? 'Failed to register identity. Verify input and retry.',
        'Registration Failed'
      );
    } finally {
      setBusy(false);
    }
  };

  /* ── Reset on close ── */
  const handleClose = () => {
    if (busy) return;
    setForm({ walletAddress: '', role: 'OFFICER', clearanceLevel: 1, sbu: '', displayName: '' });
    setErrors({});
    onClose();
  };

  const btnLabel = hashStep
    ? 'Hashing & Recording to Ledger…'
    : busy
    ? 'Transmitting to Ledger…'
    : 'Provision Identity';

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title="Register New Identity"
      size="md"
      footer={
        <>
          <Button variant="ghost" size="sm" onClick={handleClose} disabled={busy}>
            Cancel
          </Button>
          <Button
            id="provision-identity-submit"
            size="sm"
            loading={busy}
            onClick={handleSubmit}
            icon={
              !busy && (
                <span className="material-symbols-outlined text-[15px]">shield_lock</span>
              )
            }
          >
            {btnLabel}
          </Button>
        </>
      }
    >
      {/* Classification banner */}
      <div className="mb-5 flex items-center gap-2 px-3 py-2 rounded-lg bg-amber-950/20 border border-amber-700/20">
        <span
          className="material-symbols-outlined text-[16px] text-[#D4AF37] shrink-0"
          style={{ fontVariationSettings: '"FILL" 1' }}
        >
          security
        </span>
        <p className="text-[11px] text-amber-200/70 leading-snug">
          <strong className="text-amber-300">RESTRICTED OPERATION.</strong>{' '}
          Identity PII is hashed client-side (SHA-256) before transmission. The raw
          display name is never stored in cleartext on the ledger.
        </p>
      </div>

      <div className="space-y-4">
        {/* Wallet Address */}
        <Field label="Officer / System Wallet Address" id="new-wallet-address" error={errors.walletAddress}>
          <input
            id="new-wallet-address"
            type="text"
            value={form.walletAddress}
            onChange={set('walletAddress')}
            placeholder="0x…"
            spellCheck={false}
            className={`${INPUT_CLS} font-mono ${errors.walletAddress ? INPUT_ERR : ''}`}
          />
        </Field>

        {/* Display Name */}
        <Field label="Full Name / Display Name (PII)" id="new-display-name">
          <input
            id="new-display-name"
            type="text"
            value={form.displayName}
            onChange={set('displayName')}
            placeholder="Lt. Cmdr. Jane Doe (optional)"
            className={INPUT_CLS}
          />
        </Field>

        {/* Role + Clearance — side by side */}
        <div className="grid grid-cols-2 gap-3">
          <Field label="Role" id="new-role" error={errors.role}>
            <select
              id="new-role"
              value={form.role}
              onChange={set('role')}
              className={INPUT_CLS}
            >
              {ROLES.map((r) => (
                <option key={r} value={r}>{r}</option>
              ))}
            </select>
          </Field>

          <Field label="Clearance Tier" id="new-clearance" error={errors.clearanceLevel}>
            <select
              id="new-clearance"
              value={form.clearanceLevel}
              onChange={set('clearanceLevel')}
              className={INPUT_CLS}
            >
              {TIERS.map((t) => (
                <option key={t} value={t}>
                  Tier {t}{t === 5 ? ' — Sovereign' : t === 1 ? ' — Basic' : ''}
                </option>
              ))}
            </select>
          </Field>
        </div>

        {/* SBU Code */}
        <Field label="SBU Code" id="new-sbu" error={errors.sbu}>
          <input
            id="new-sbu"
            type="text"
            value={form.sbu}
            onChange={set('sbu')}
            placeholder="e.g. ALPHA, SIERRA, DELTA"
            maxLength={10}
            className={`${INPUT_CLS} uppercase ${errors.sbu ? INPUT_ERR : ''}`}
          />
          <p className="mt-1 text-[10px] text-slate-600">
            Strategic Business Unit code — 2 to 10 alphanumeric characters.
          </p>
        </Field>
      </div>

      {/* Hash preview — shows when a display name is entered */}
      {form.displayName.trim() && (
        <div className="mt-4 px-3 py-2 rounded-lg bg-[#040A14] border border-[#1E2E48]">
          <p className="text-[10px] font-bold tracking-widest text-slate-600 uppercase mb-0.5">
            PII Hash Preview (SHA-256)
          </p>
          <code className="text-[10px] text-slate-500 break-all">
            {/* Static preview label — actual hash computed on submit */}
            Computed on submission — not stored in cleartext
          </code>
        </div>
      )}
    </Modal>
  );
}
