import { useState } from 'react';
import IdentityTable from '../../components/admin/IdentityTable';
import CreateIdentityModal from '../../components/admin/CreateIdentityModal';
import Card, { CardContent, CardHeader, CardTitle } from '../../components/ui/Card';

export default function IdentityLedger() {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [refreshKey, setRefreshKey] = useState(0); // To refresh table after creation

    const handleIdentityCreated = () => {
        setIsModalOpen(false);
        setRefreshKey(prev => prev + 1); // Trigger table refresh
    };

    return (
        <div className="p-6 space-y-6">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <span className="h-px w-12 bg-gradient-to-r from-[#D4AF37]/40 to-transparent" />
                        <span className="text-[9px] font-black tracking-[0.22em] text-[#D4AF37]/60 uppercase">
                            RESTRICTED — ADMIN CLEARANCE
                        </span>
                    </div>
                    <h1 className="text-2xl font-black text-white tracking-wide">Identity Ledger</h1>
                    <p className="text-sm text-slate-400 mt-1">Manage sovereign identities and clearance levels</p>
                </div>

                <button
                    onClick={() => setIsModalOpen(true)}
                    className="px-4 py-2 bg-[#D4AF37] hover:bg-[#b8962e] text-black font-black uppercase tracking-widest text-xs rounded transition-colors"
                >
                    + Register Identity
                </button>
            </div>

            {/* Table Section */}
            <Card goldAccent>
                <CardHeader>
                    <CardTitle>Sovereign Identity Registry</CardTitle>
                </CardHeader>
                <CardContent>
                    {/* Assuming IdentityTable handles its own fetching, pass refreshKey to force reload */}
                    <IdentityTable key={refreshKey} />
                </CardContent>
            </Card>

            {/* Modal */}
            {isModalOpen && (
                <CreateIdentityModal
                    onClose={() => setIsModalOpen(false)}
                    onSuccess={handleIdentityCreated}
                />
            )}
        </div>
    );
}