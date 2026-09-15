import { useState } from 'react';
import Modal from '../ui/Modal';
import Button from '../ui/button';
import { useToast } from '../ui/Toast';
import { assetApi } from '../../services/api';

const SBUS = ['SBU_RADAR', 'SBU_EW', 'SBU_MILCOMM', 'SBU_CYBER'];
const TIERS = [1, 2, 3, 4];

const inputClass =
  'w-full bg-[#060D1A] border border-[#1E2E48] rounded-lg px-3 py-2 text-[13px] text-slate-200 ' +
  'focus:outline-none focus:border-[#1E5FA8] focus:ring-1 focus:ring-[#1E5FA8]/40';

const initialForm = {
  name: '',
  classificationTier: 1,
  sbu: 'SBU_CYBER',
  ownerWalletAddress: '',
  assetTag: '',
  description: '',
};

export default function MintAssetModal({ open, onClose }) {
  const toast = useToast();
  const [form, setForm] = useState(initialForm);
  const [busy, setBusy] = useState(false);

  const set = (key) => (event) => {
    const value = key === 'classificationTier' ? Number(event.target.value) : event.target.value;
    setForm((previous) => ({ ...previous, [key]: value }));
  };

  const close = () => {
    if (busy) return;
    setForm(initialForm);
    onClose();
  };

  const submit = async () => {
    if (!form.name.trim() || !/^0x[\da-fA-F]{40}$/.test(form.ownerWalletAddress.trim())) {
      toast.error('Enter an asset name and a valid 42-character custodian wallet address.', 'Missing Details');
      return;
    }

    setBusy(true);
    try {
      const asset = await assetApi.mint({
        name: form.name.trim(),
        classificationTier: form.classificationTier,
        sbu: form.sbu,
        ownerWalletAddress: form.ownerWalletAddress.trim(),
        metadata: {
          assetTag: form.assetTag.trim() || form.name.trim(),
          description: form.description.trim(),
        },
      });
      toast.success(`Asset ${asset.name} has been pinned and assigned to its custodian.`, 'Asset Minted');
      close();
    } catch (error) {
      toast.error(error?.uiMessage ?? 'Asset minting failed. Please retry.', 'Minting Failed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <Modal
      open={open}
      onClose={close}
      title="Mint Defence Asset"
      size="md"
      footer={<><Button variant="ghost" size="sm" onClick={close} disabled={busy}>Cancel</Button><Button size="sm" loading={busy} onClick={submit}>{busy ? 'Pinning & Minting...' : 'Mint Asset'}</Button></>}
    >
      <p className="mb-5 text-[12px] text-slate-500">Metadata is pinned to IPFS before custody is recorded on the sovereign ledger.</p>
      <div className="space-y-4">
        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase">Asset name<input className={`${inputClass} mt-1.5`} value={form.name} onChange={set('name')} placeholder="e.g. Sentinel Radar Unit" /></label>
        <div className="grid grid-cols-2 gap-3">
          <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase">Classification tier<select className={`${inputClass} mt-1.5`} value={form.classificationTier} onChange={set('classificationTier')}>{TIERS.map((tier) => <option key={tier} value={tier}>Tier {tier}</option>)}</select></label>
          <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase">SBU<select className={`${inputClass} mt-1.5`} value={form.sbu} onChange={set('sbu')}>{SBUS.map((sbu) => <option key={sbu} value={sbu}>{sbu.replace('SBU_', '')}</option>)}</select></label>
        </div>
        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase">Custodian wallet address<input className={`${inputClass} mt-1.5 font-mono`} value={form.ownerWalletAddress} onChange={set('ownerWalletAddress')} placeholder="0x..." /></label>
        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase">Asset tag<input className={`${inputClass} mt-1.5`} value={form.assetTag} onChange={set('assetTag')} placeholder="Optional inventory / asset tag" /></label>
        <label className="block text-[11px] font-bold tracking-widest text-slate-500 uppercase">Description<textarea className={`${inputClass} mt-1.5 min-h-20 resize-y`} value={form.description} onChange={set('description')} placeholder="Non-sensitive asset metadata" /></label>
      </div>
    </Modal>
  );
}
