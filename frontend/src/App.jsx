import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";

export default function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Route */}
          <Route path="/" element={<LandingPage />} />

          {/* Role-Protected Route Wrapper */}
          <Route element={<ProtectedRoute allowedRoles={["admin", "user"]} />}>
            {/* Future role-protected pages yahan aayenge */}
          </Route>

          {/* Fallback Route */}
          <Route path="*" element={<LandingPage />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  );
}