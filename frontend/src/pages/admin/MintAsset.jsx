import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useTransaction } from '../../context/TransactionContext';
import { useFormValidation } from '../../hooks/useFormValidation';
import { assetApi, adminApi } from '../../services/api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function MintAsset() {
    const { user } = useAuth();
    const { showPending, showSuccess, showError, removeToast } = useTransaction();
    const { errors, touched, validateForm, handleBlur, clearErrors } = useFormValidation();
    const navigate = useNavigate();
    const [submitting, setSubmitting] = useState(false);

    const [formData, setFormData] = useState({
        name: '',
        assetType: '',
        classificationTier: 1,
        sbu: user?.sbu || '',
        recipientId: '',
        metadata: '',
    });

    const validationRules = {
        name: { required: true, minLength: 3, label: 'Asset Name' },
        assetType: { required: true, label: 'Asset Type' },
        classificationTier: { required: true, number: true, label: 'Classification Tier' },
        recipientId: { required: true, label: 'Recipient' },
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const isValid = validateForm(formData, validationRules);
        if (!isValid) {
            showError('Please fix the form errors');
            return;
        }

        setSubmitting(true);
        const pendingId = showPending('Minting asset on blockchain...');

        try {
            await assetApi.mint({
                ...formData,
                classificationTier: Number(formData.classificationTier),
                metadata: formData.metadata ? JSON.parse(formData.metadata) : {},
            });

            removeToast(pendingId);
            showSuccess('Asset minted successfully!');
            navigate('/admin/assets');
        } catch (err) {
            removeToast(pendingId);
            showError(`Failed to mint asset: ${err.uiMessage || err.message}`);
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="p-4 sm:p-6 max-w-3xl mx-auto space-y-6">
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <span className="h-px w-12 bg-gradient-to-r from-blue-500/40 to-transparent" />
                    <span className="text-[9px] font-black tracking-[0.22em] text-blue-500/60 uppercase">
                        SYSTEM ADMINISTRATOR — MINT ASSET
                    </span>
                </div>
                <h1 className="text-xl sm:text-2xl font-black text-white tracking-wide">Mint New Asset</h1>
                <p className="text-sm text-slate-400 mt-1">
                    Create a new sovereign asset on the blockchain
                </p>
            </div>

            <Card goldAccent={false}>
                <CardHeader>
                    <CardTitle>Asset Details</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        {/* Name */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Asset Name *
                            </label>
                            <input
                                type="text"
                                value={formData.name}
                                onChange={(e) => {
                                    setFormData({ ...formData, name: e.target.value });
                                    clearErrors('name');
                                }}
                                onBlur={() => handleBlur('name')}
                                className="w-full bg-[#0D1F38] border border-[#1F293D] rounded px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                                placeholder="Enter asset name"
                            />
                            {touched.name && errors.name && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.name.join(', ')}</p>
                            )}
                        </div>

                        {/* Asset Type */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Asset Type *
                            </label>
                            <select
                                value={formData.assetType}
                                onChange={(e) => {
                                    setFormData({ ...formData, assetType: e.target.value });
                                    clearErrors('assetType');
                                }}
                                onBlur={() => handleBlur('assetType')}
                                className="w-full bg-[#0D1F38] border border-[#1F293D] rounded px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                            >
                                <option value="">Select type</option>
                                <option value="WEAPON">Weapon System</option>
                                <option value="ELECTRONIC">Electronic Equipment</option>
                                <option value="COMMUNICATION">Communication Device</option>
                                <option value="VEHICLE">Vehicle</option>
                                <option value="OTHER">Other</option>
                            </select>
                            {touched.assetType && errors.assetType && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.assetType.join(', ')}</p>
                            )}
                        </div>

                        {/* Classification Tier */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Classification Tier *
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="5"
                                value={formData.classificationTier}
                                onChange={(e) => {
                                    setFormData({ ...formData, classificationTier: e.target.value });
                                    clearErrors('classificationTier');
                                }}
                                onBlur={() => handleBlur('classificationTier')}
                                className="w-full bg-[#0D1F38] border border-[#1F293D] rounded px-3 py-2.5 text-sm text-white focus:border-blue-500 outline-none"
                            />
                            {touched.classificationTier && errors.classificationTier && (
                                <p className="text-red-400 text-xs mt-1.5">{errors.classificationTier.join(', ')}</p>
                            )}
                        </div>

                        {/* Metadata (Optional JSON) */}
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
                                Metadata (JSON)
                            </label>
                            <textarea
                                value={formData.metadata}
                                onChange={(e) => setFormData({ ...formData, metadata: e.target.value })}
                                rows={4}
                                className="w-full bg-[#0D1F38] border border-[#1F293D] rounded px-3 py-2 text-sm text-white focus:border-blue-500 outline-none resize-none font-mono"
                                placeholder='{"serialNumber": "SN123", "manufacturer": "BEL"}'
                            />
                            <p className="text-xs text-slate-500 mt-1">Optional JSON metadata</p>
                        </div>

                        {/* Submit Buttons */}
                        <div className="flex flex-col sm:flex-row gap-3 pt-4">
                            <button
                                type="button"
                                onClick={() => navigate('/admin/assets')}
                                className="flex-1 px-4 py-3 border border-[#1F293D] text-slate-400 hover:text-white hover:bg-white/5 rounded font-bold text-sm transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                type="submit"
                                disabled={submitting}
                                className="flex-1 px-4 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-slate-700 disabled:cursor-not-allowed text-white font-black uppercase tracking-widest rounded transition-colors"
                            >
                                {submitting ? 'Minting...' : 'Mint Asset'}
                            </button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}