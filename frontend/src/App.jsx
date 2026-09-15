import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { ToastProvider } from "./components/ui/Toast";
import ProtectedRoute from "./components/ProtectedRoute";
import BaseLayout from "./components/layout/BaseLayout";
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";
import UIKitPage from "./pages/UIKitPage";
import AdminDashboard from "./pages/admin/AdminDashboard";
import ManagerDashboard from "./pages/manager/ManagerDashboard";
import IdentityLedger from "./pages/admin/IdentityLedger";
import RoleAssignment from "./pages/admin/RoleAssignment";
import MintAsset from "./pages/admin/MintAsset";
import AssetList from "./pages/admin/AssetList";
import TransferApprovals from "./pages/admin/TransferApprovals";

/**
 * Role strings must match backend DB values (uppercase):
 *   ADMIN | MANAGER | AUDITOR | USER | SYSTEM_CONNECTOR
 */
export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <ToastProvider>
          <Routes>
            {/* ── Public Routes ── */}
            <Route path="/" element={<LandingPage />} />
            <Route path="/login" element={<LandingPage autoOpenLogin />} />
            <Route path="/contact" element={<ContactPage />} />

            {/* ── Protected Area wrapped in BaseLayout ── */}
            <Route element={<ProtectedRoute allowedRoles={["ADMIN", "MANAGER", "AUDITOR", "USER"]} />}>
              <Route element={<BaseLayout />}>

                {/* UI Kit — any authenticated role */}
                <Route path="/ui-kit" element={<UIKitPage />} />

                {/* Admin-only */}
                <Route element={<ProtectedRoute allowedRoles={["ADMIN"]} />}>
                  <Route path="/admin" element={<AdminDashboard />} />
                  <Route path="/admin/dashboard" element={<AdminDashboard />} />
                  <Route path="/admin/identities" element={<IdentityLedger />} />
                  <Route path="/admin/users" element={<AdminDashboard />} />

                  {/* Issue #57 Routes */}
                  <Route path="/admin/roles" element={<RoleAssignment />} />
                  <Route path="/admin/mint-asset" element={<MintAsset />} />

                  {/* Issue #58 Routes */}
                  <Route path="/admin/assets" element={<AssetList />} />
                  <Route path="/admin/transfers" element={<TransferApprovals />} />

                  {/* Coming Soon */}
                  <Route path="/admin/nodes" element={<div className="p-8 text-slate-200">Sovereign Nodes — Coming Soon</div>} />
                  <Route path="/admin/audit" element={<div className="p-8 text-slate-200">Audit Vault — Coming Soon</div>} />
                </Route>

                {/* Manager / Admin — Primary /dashboard route */}
                <Route element={<ProtectedRoute allowedRoles={["ADMIN", "MANAGER"]} />}>
                  <Route path="/dashboard" element={<ManagerDashboard />} />
                  <Route path="/assets/ledger" element={<AssetList />} />
                  <Route path="/transfers" element={<TransferApprovals />} />
                  <Route path="/did/issue" element={<div className="p-8 text-slate-200">DID Issuance — Coming Soon</div>} />
                  <Route path="/dispatch/sign" element={<div className="p-8 text-slate-200">Sign Dispatch — Coming Soon</div>} />
                </Route>

                {/* Auditor / Admin */}
                <Route element={<ProtectedRoute allowedRoles={["ADMIN", "AUDITOR"]} />}>
                  <Route path="/audit/ledgers" element={<div className="p-8 text-slate-200">Read-Only Ledgers</div>} />
                  <Route path="/audit/logs" element={<div className="p-8 text-slate-200">Verification Logs</div>} />
                </Route>

                {/* User-only fallback dashboard */}
                <Route element={<ProtectedRoute allowedRoles={["USER"]} />}>
                  <Route path="/dashboard" element={<div className="p-8 text-slate-200">User Dashboard — Coming Soon</div>} />
                </Route>

              </Route>
            </Route>

            {/* Fallback */}
            <Route path="*" element={<LandingPage />} />
          </Routes>
        </ToastProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}