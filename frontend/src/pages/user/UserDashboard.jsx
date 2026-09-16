import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { assetApi, transferApi } from '../../services/api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function UserDashboard() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [myAssets, setMyAssets] = useState([]);
    const [pendingTransfers, setPendingTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    console.log("=== USER DASHBOARD RENDERED ===");
    console.log("USER:", user);
    console.log("LOADING:", loading);
    console.log("USER.WALLET:", user?.walletAddress);


    useEffect(() => {
        if (user?.walletAddress) {
            loadUserData();
        }
    }, [user]);

    const loadUserData = async () => {
        setLoading(true);
        try {
            // Fetch user's own assets
            const assetsData = await assetApi.list({
                owner: user.walletAddress,
                limit: 10
            });
            setMyAssets(assetsData.assets || []);

            // Fetch user's pending transfer requests
            const transfersData = await transferApi.list({
                fromUser: user.id || user.walletAddress,
                status: 'PENDING',
                limit: 5
            });
            setPendingTransfers(transfersData.transfers || []);
        } catch (err) {
            console.error("Failed to load user data", err);
        } finally {
            setLoading(false);
        }
    };

    const getAssetStatusColor = (status) => {
        switch (status?.toUpperCase()) {
            case 'ACTIVE': return 'bg-emerald-900/50 text-emerald-400';
            case 'INACTIVE': return 'bg-slate-700 text-slate-400';
            case 'MAINTENANCE': return 'bg-amber-900/50 text-amber-400';
            default: return 'bg-slate-700 text-slate-400';
        }
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <span className="h-px flex-1 bg-gradient-to-r from-emerald-500/40 to-transparent" />
                <span className="text-[9px] font-black tracking-[0.22em] text-emerald-500/60 uppercase">
                    ◈ REGISTERED PERSONNEL — STANDARD ACCESS
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-emerald-500/40 to-transparent" />
            </div>

            <div>
                <h1 className="text-2xl font-black text-white tracking-wide">
                    Welcome, {user?.displayName || 'User'}
                </h1>
                <p className="text-sm text-slate-400 mt-1">
                    Manage your identity and assets
                </p>
            </div>

            {/* Quick Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card goldAccent={false}>
                    <CardHeader>
                        <CardTitle className="text-xs text-slate-400">My Identity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-sm font-bold text-white mb-1">
                            {user?.displayName || 'Registered User'}
                        </div>
                        <div className="text-xs text-slate-500 font-mono mb-2">
                            {user?.walletAddress?.slice(0, 10)}...{user?.walletAddress?.slice(-8)}
                        </div>
                        <div className="text-[10px] text-emerald-400">
                            Clearance Level {user?.clearanceLevel || 'N/A'}
                        </div>
                    </CardContent>
                </Card>

                <Card goldAccent={false}>
                    <CardHeader>
                        <CardTitle className="text-xs text-slate-400">My Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{myAssets.length}</div>
                        <div className="text-[10px] text-slate-500 mt-1">Total assets in custody</div>
                    </CardContent>
                </Card>

                <Card goldAccent={false}>
                    <CardHeader>
                        <CardTitle className="text-xs text-slate-400">Pending Transfers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-amber-400">{pendingTransfers.length}</div>
                        <div className="text-[10px] text-slate-500 mt-1">Awaiting approval</div>
                    </CardContent>
                </Card>
            </div>

            {/* My Assets */}
            <Card goldAccent={false}>
                <CardHeader>
                    <CardTitle>My Assets</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-slate-400 text-center py-8">Loading your assets...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="text-xs uppercase text-emerald-500 border-b border-[#1F293D]">
                                    <tr>
                                        <th className="px-4 py-3">Asset Name</th>
                                        <th className="px-4 py-3">Type</th>
                                        <th className="px-4 py-3">Classification</th>
                                        <th className="px-4 py-3">Status</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1F293D]">
                                    {myAssets.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                                                You don't have any assets yet
                                            </td>
                                        </tr>
                                    ) : (
                                        myAssets.map((asset) => (
                                            <tr key={asset.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 font-medium text-white">
                                                    {asset.name}
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    {asset.assetType || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 rounded bg-[#1E3E62] text-[#7ab0fe] text-xs font-bold">
                                                        Tier {asset.classificationTier}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className={`px-2 py-1 rounded text-xs font-bold ${getAssetStatusColor(asset.status)}`}>
                                                        {asset.status || 'ACTIVE'}
                                                    </span>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <button
                                                        onClick={() => navigate(`/transfer/request?asset=${asset.id}`)}
                                                        className="text-[#1E5FA8] hover:text-[#7ab0fe] text-xs font-bold"
                                                    >
                                                        Request Transfer →
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Pending Transfer Requests */}
            <Card goldAccent={false}>
                <CardHeader>
                    <CardTitle>Pending Transfer Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-slate-400 text-center py-8">Loading transfers...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="text-xs uppercase text-amber-500 border-b border-[#1F293D]">
                                    <tr>
                                        <th className="px-4 py-3">Asset</th>
                                        <th className="px-4 py-3">To</th>
                                        <th className="px-4 py-3">Reason</th>
                                        <th className="px-4 py-3">Requested On</th>
                                        <th className="px-4 py-3">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1F293D]">
                                    {pendingTransfers.length === 0 ? (
                                        <tr>
                                            <td colSpan="5" className="px-4 py-8 text-center text-slate-500">
                                                No pending transfer requests
                                            </td>
                                        </tr>
                                    ) : (
                                        pendingTransfers.map((transfer) => (
                                            <tr key={transfer.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 font-medium text-white">
                                                    {transfer.asset?.name || 'Unknown Asset'}
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    <div className="text-white">
                                                        {transfer.toUser?.displayName || 'Unknown'}
                                                    </div>
                                                    <div className="text-slate-500 font-mono text-[10px]">
                                                        {transfer.toUser?.walletAddress?.slice(0, 6)}...
                                                        {transfer.toUser?.walletAddress?.slice(-4)}
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-400 max-w-[200px] truncate">
                                                    {transfer.reason || 'N/A'}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-400">
                                                    {new Date(transfer.createdAt).toLocaleDateString('en-IN')}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <span className="px-2 py-1 rounded bg-amber-900/50 text-amber-400 text-xs font-bold">
                                                        PENDING
                                                    </span>
                                                </td>
                                            </tr>
                                        ))
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}
                </CardContent>
            </Card>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => navigate('/profile')}
                    className="p-4 bg-[#0D1F38] border border-[#1F293D] hover:border-emerald-500/50 rounded-lg text-left transition-colors group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-emerald-400 group-hover:text-emerald-300">
                            person
                        </span>
                        <span className="text-sm font-bold text-white">Update Profile</span>
                    </div>
                    <p className="text-xs text-slate-400">Manage your identity details</p>
                </button>

                <button
                    onClick={() => navigate('/my-assets')}
                    className="p-4 bg-[#0D1F38] border border-[#1F293D] hover:border-emerald-500/50 rounded-lg text-left transition-colors group"
                >
                    <div className="flex items-center gap-3 mb-2">
                        <span className="material-symbols-outlined text-emerald-400 group-hover:text-emerald-300">
                            inventory_2
                        </span>
                        <span className="text-sm font-bold text-white">View All Assets</span>
                    </div>
                    <p className="text-xs text-slate-400">See complete asset list</p>
                </button>
            </div>
        </div>
    );
}