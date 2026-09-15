import { useState, useEffect } from 'react';
import { adminApi, assetApi } from '../../services/api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function MintAsset() {
    const [identities, setIdentities] = useState([]);
    const [formData, setFormData] = useState({
        name: '',
        description: '',
        classificationTier: 1,
        sbu: 'SBU_RADAR',
        custodianId: '',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        const fetchIdentities = async () => {
            try {
                const data = await adminApi.listIdentities({ limit: 100 });
                setIdentities(data.users || []);
            } catch (err) {
                console.error("Failed to fetch identities", err);
            }
        };
        fetchIdentities();
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await assetApi.mint(formData);
            alert("Asset minted successfully and linked to custodian!");
            setFormData({ name: '', description: '', classificationTier: 1, sbu: 'SBU_RADAR', custodianId: '' });
        } catch (err) {
            alert("Failed to mint asset: " + (err.uiMessage || err.message));
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6 max-w-3xl mx-auto space-y-6">
            <div className="flex items-center gap-2 mb-3">
                <span className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                <span className="text-[9px] font-black tracking-[0.22em] text-[#D4AF37]/60 uppercase">
                    ◈ RESTRICTED — ADMIN CLEARANCE
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-[#D4AF37]/40 to-transparent" />
            </div>

            <h1 className="text-2xl font-black text-white tracking-wide">Mint Defence Asset NFT</h1>

            <Card goldAccent>
                <CardHeader>
                    <CardTitle>Asset Provisioning Form</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Asset Name</label>
                            <input
                                required
                                type="text"
                                value={formData.name}
                                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                className="w-full bg-[#0D1F38] border border-[#1F293D] rounded px-3 py-2 text-white focus:border-[#1E5FA8] outline-none"
                                placeholder="e.g., AN/TPQ-53 Radar System"
                            />
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Description / Metadata</label>
                            <textarea
                                required
                                value={formData.description}
                                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                className="w-full bg-[#0D1F38] border border-[#1F293D] rounded px-3 py-2 text-white focus:border-[#1E5FA8] outline-none h-24"
                                placeholder="Serial number, calibration date, etc."
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Classification Tier</label>
                                <select
                                    value={formData.classificationTier}
                                    onChange={(e) => setFormData({ ...formData, classificationTier: parseInt(e.target.value) })}
                                    className="w-full bg-[#0D1F38] border border-[#1F293D] rounded px-3 py-2 text-white focus:border-[#1E5FA8] outline-none"
                                >
                                    <option value={1}>1 - Restricted</option>
                                    <option value={2}>2 - Confidential</option>
                                    <option value={3}>3 - Secret</option>
                                    <option value={4}>4 - Top Secret</option>
                                </select>
                            </div>

                            <div>
                                <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Strategic Business Unit (SBU)</label>
                                <select
                                    value={formData.sbu}
                                    onChange={(e) => setFormData({ ...formData, sbu: e.target.value })}
                                    className="w-full bg-[#0D1F38] border border-[#1F293D] rounded px-3 py-2 text-white focus:border-[#1E5FA8] outline-none"
                                >
                                    <option value="SBU_RADAR">Radar</option>
                                    <option value="SBU_EW">Electronic Warfare</option>
                                    <option value="SBU_MILCOMM">Military Comm</option>
                                    <option value="SBU_CYBER">Cyber Security</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Assign Custodian (Identity)</label>
                            <select
                                required
                                value={formData.custodianId}
                                onChange={(e) => setFormData({ ...formData, custodianId: e.target.value })}
                                className="w-full bg-[#0D1F38] border border-[#1F293D] rounded px-3 py-2 text-white focus:border-[#1E5FA8] outline-none"
                            >
                                <option value="">-- Select an Identity --</option>
                                {identities.map(user => (
                                    <option key={user.id} value={user.id}>
                                        {user.displayName || 'Unknown'} ({user.walletAddress.slice(0, 6)}...{user.walletAddress.slice(-4)})
                                    </option>
                                ))}
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-[#D4AF37] hover:bg-[#b8962e] text-black font-black uppercase tracking-widest py-3 rounded transition-colors disabled:opacity-50"
                        >
                            {loading ? 'Minting to Blockchain...' : 'Mint Asset NFT'}
                        </button>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}