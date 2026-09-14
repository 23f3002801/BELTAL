import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import BaseLayout from "./components/layout/BaseLayout";
import LandingPage from "./pages/LandingPage";
import ContactPage from "./pages/ContactPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
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