import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import BaseLayout from "./components/layout/BaseLayout";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Protected Area wrapped in BaseLayout */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "manager", "auditor", "user"]} />}>
            <Route element={<BaseLayout />}>
              <Route path="/dashboard" element={<div className="p-8 text-slate-200">Secure Dashboard Area</div>} />
            </Route>
          </Route>
          
          {/* Fallback */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}