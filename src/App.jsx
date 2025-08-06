import React, { useEffect } from "react";
import {
  Route,
  Routes,
  useNavigate,
  useLocation,
  Navigate,
} from "react-router-dom";

import CitizenLayout from "layouts/citizen";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import HomePage from "views/HomePage";
import StaffLayout from "layouts/staff";
import ScrollToTop from "views/citizen/news/components/ScrollToTop";
import ProtectedRoute from "utils/ProtectedRoutes";
import Unauthorized from "views/error/UnauthorizedError";

import { useUser } from "./contexts/UserContext";

const App = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { role, ready } = useUser();

  useEffect(() => {
    if (!ready) return;

    const isPublicRoute =
      location.pathname === "/" ||
      location.pathname.startsWith("/auth") ||
      location.pathname === "/unauthorized";

    const isLoggedIn = role && !(Array.isArray(role) && role.length === 0);

    // Only redirect if user is not logged in and trying to access protected route
    if (!isLoggedIn && !isPublicRoute) {
      navigate("/auth/signin");
    }
  }, [role, ready, location.pathname, navigate]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        {/* Public routes accessible to everyone */}
        <Route path="/" element={<HomePage />} />
        <Route path="auth/*" element={<AuthLayout />} />
        <Route path="/unauthorized" element={<Unauthorized />} />

        {/* Protected routes */}
        <Route
          path="citizen/*"
          element={
            <ProtectedRoute requiredRole="CITIZEN">
              <CitizenLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="admin/*"
          element={
            <ProtectedRoute requiredRole="ADMIN">
              <AdminLayout />
            </ProtectedRoute>
          }
        />
        <Route
          path="staff/*"
          element={
            <ProtectedRoute requiredRole="STAFF">
              <StaffLayout />
            </ProtectedRoute>
          }
        />

        {/* Fallback routes */}
        <Route path="/*" element={<Navigate to="/" replace />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;