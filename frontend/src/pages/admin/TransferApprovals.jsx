import { useState, useEffect } from 'react';
import { transferApi } from '../../services/api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function TransferApprovals() {
    const [transfers, setTransfers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processing, setProcessing] = useState(null);

    useEffect(() => {
        fetchTransfers();
    }, []);

    const fetchTransfers = async () => {
        setLoading(true);
        try {
            // Fetch only pending transfers
            const data = await transferApi.list({ status: 'PENDING' });
            setTransfers(data.transfers || []);
        } catch (err) {
            console.error("Failed to fetch transfers", err);
            alert("Failed to load transfer requests");
        } finally {
            setLoading(false);
        }
    };

    const handleApprove = async (id) => {
        if (!confirm('Approve this transfer? This will execute the on-chain custody reassignment.')) {
            return;
        }

        setProcessing(id);
        try {
            await transferApi.approve(id);
            alert('Transfer approved and executed on-chain!');
            fetchTransfers(); // Refresh list
        } catch (err) {
            console.error("Approval failed", err);
            alert("Failed to approve: " + (err.uiMessage || err.message));
        } finally {
            setProcessing(null);
        }
    };

    const handleReject = async (id) => {
        if (!confirm('Reject this transfer request?')) {
            return;
        }

        setProcessing(id);
        try {
            await transferApi.reject(id);
            alert('Transfer request rejected');
            fetchTransfers(); // Refresh list
        } catch (err) {
            console.error("Rejection failed", err);
            alert("Failed to reject: " + (err.uiMessage || err.message));
        } finally {
            setProcessing(null);
        }
    };

    return (
        <div className="p-6 space-y-6">
            <div className="flex items-center gap-2 mb-3">
                <span className="h-px flex-1 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                <span className="text-[9px] font-black tracking-[0.22em] text-[#D4AF37]/60 uppercase">
                    ◈ RESTRICTED — ADMIN CLEARANCE
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-[#D4AF37]/40 to-transparent" />
            </div>

            <h1 className="text-2xl font-black text-white tracking-wide">Pending Transfer Approvals</h1>

            <Card goldAccent>
                <CardHeader>
                    <CardTitle>Custody Transfer Requests</CardTitle>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <p className="text-slate-400 text-center py-8">Loading transfer requests...</p>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full text-left text-sm text-slate-300">
                                <thead className="text-xs uppercase text-[#D4AF37] border-b border-[#1F293D]">
                                    <tr>
                                        <th className="px-4 py-3">Asset</th>
                                        <th className="px-4 py-3">From (Current)</th>
                                        <th className="px-4 py-3">To (New Custodian)</th>
                                        <th className="px-4 py-3">Requested By</th>
                                        <th className="px-4 py-3">Date</th>
                                        <th className="px-4 py-3">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-[#1F293D]">
                                    {transfers.length === 0 ? (
                                        <tr>
                                            <td colSpan="6" className="px-4 py-8 text-center text-slate-500">
                                                No pending transfer requests
                                            </td>
                                        </tr>
                                    ) : (
                                        transfers.map((transfer) => (
                                            <tr key={transfer.id} className="hover:bg-white/5 transition-colors">
                                                <td className="px-4 py-3 font-medium text-white">
                                                    {transfer.asset?.name || 'Unknown Asset'}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs">
                                                        <div className="text-white font-medium">
                                                            {transfer.fromUser?.displayName || 'Unknown'}
                                                        </div>
                                                        <div className="text-slate-400 font-mono text-[10px]">
                                                            {transfer.fromUser?.walletAddress?.slice(0, 6)}...
                                                            {transfer.fromUser?.walletAddress?.slice(-4)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="text-xs">
                                                        <div className="text-white font-medium">
                                                            {transfer.toUser?.displayName || 'Unknown'}
                                                        </div>
                                                        <div className="text-slate-400 font-mono text-[10px]">
                                                            {transfer.toUser?.walletAddress?.slice(0, 6)}...
                                                            {transfer.toUser?.walletAddress?.slice(-4)}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-4 py-3 text-xs">
                                                    {transfer.requestedBy?.displayName || 'Unknown'}
                                                </td>
                                                <td className="px-4 py-3 text-xs text-slate-400">
                                                    {new Date(transfer.createdAt).toLocaleString()}
                                                </td>
                                                <td className="px-4 py-3">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleApprove(transfer.id)}
                                                            disabled={processing === transfer.id}
                                                            className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                                                        >
                                                            {processing === transfer.id ? 'Processing...' : 'Approve'}
                                                        </button>
                                                        <button
                                                            onClick={() => handleReject(transfer.id)}
                                                            disabled={processing === transfer.id}
                                                            className="px-3 py-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-bold rounded transition-colors disabled:opacity-50"
                                                        >
                                                            {processing === transfer.id ? 'Processing...' : 'Reject'}
                                                        </button>
                                                    </div>
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
        </div>
    );
}