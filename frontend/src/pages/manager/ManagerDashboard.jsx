import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { assetApi, transferApi, adminApi } from '../../services/api';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function ManagerDashboard() {
    const { user } = useAuth(); // Get current logged-in user (Manager/Officer)
    const [stats, setStats] = useState({
        teamMembers: 0,
        totalAssets: 0,
        pendingTransfers: 0,
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (user?.sbu) {
            loadTeamStats();
        }
    }, [user]);

    const loadTeamStats = async () => {
        setLoading(true);
        try {
            // 1. Get Team Members (Filter by Manager's SBU)
            // Note: If backend gives 403 for Officer here, we might need to mock this or ask backend guy.
            const identitiesData = await adminApi.listIdentities({ sbu: user.sbu, limit: 1000 }).catch(() => ({ users: [] }));
            const teamMembers = identitiesData.users?.length || 0;

            // 2. Get Total Team Assets (Filter by Manager's SBU)
            const assetsData = await assetApi.list({ sbu: user.sbu, limit: 1000 }).catch(() => ({ assets: [] }));
            const totalAssets = assetsData.assets?.length || 0;

            // 3. Get Pending Transfers (Filter by Manager's SBU)
            const transfersData = await transferApi.list({ status: 'PENDING', sbu: user.sbu }).catch(() => ({ transfers: [] }));
            const pendingTransfers = transfersData.transfers?.length || 0;

            setStats({ teamMembers, totalAssets, pendingTransfers });
        } catch (err) {
            console.error("Failed to load manager stats", err);
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <div className="p-6 flex justify-center items-center h-64">
                <p className="text-slate-400 animate-pulse">Loading Team Dashboard...</p>
            </div>
        );
    }

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center gap-2 mb-3">
                <span className="h-px flex-1 bg-gradient-to-r from-[#1E5FA8]/40 to-transparent" />
                <span className="text-[9px] font-black tracking-[0.22em] text-[#1E5FA8]/80 uppercase">
                    ◈ OFFICER CLEARANCE — {user?.sbu?.replace('SBU_', '') || 'TEAM'}
                </span>
                <span className="h-px flex-1 bg-gradient-to-l from-[#1E5FA8]/40 to-transparent" />
            </div>

            <h1 className="text-2xl font-black text-white tracking-wide">Manager Dashboard</h1>
            <p className="text-sm text-slate-400">Overview of your team's assets and pending actions.</p>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Team Members */}
                <Card goldAccent={false}>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-400">Team Members</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{stats.teamMembers}</div>
                        <div className="text-xs text-slate-500 mt-1">Active personnel in {user?.sbu}</div>
                    </CardContent>
                </Card>

                {/* Total Assets */}
                <Card goldAccent={false}>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-400">Total Team Assets</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-white">{stats.totalAssets}</div>
                        <div className="text-xs text-slate-500 mt-1">Under team custody</div>
                    </CardContent>
                </Card>

                {/* Pending Transfers */}
                <Card goldAccent={false}>
                    <CardHeader>
                        <CardTitle className="text-sm text-slate-400">Pending Transfers</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="text-3xl font-black text-amber-400">{stats.pendingTransfers}</div>
                        <div className="text-xs text-slate-500 mt-1">Awaiting your approval</div>
                    </CardContent>
                </Card>
            </div>

            {/* Quick Actions / Activity Feed Placeholder */}
            <Card goldAccent={false}>
                <CardHeader>
                    <CardTitle>Recent Team Activity</CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="text-center py-8 text-slate-500 text-sm">
                        Activity feed will be populated here once backend audit logs are connected.
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}