import React, { useEffect } from "react";
import { Route, Routes, useNavigate, useLocation, Navigate } from "react-router-dom";

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

    const isOnAuth = location.pathname.startsWith("/auth");
    const isLoggedIn = role && (!(Array.isArray(role) && role.length === 0));

    if (!isLoggedIn && !isOnAuth) {
      navigate("/auth/signin");
    }
  }, [role, ready, location.pathname, navigate]);

  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route
          path="/"
          element={
            (() => {
              if (!ready) return null;
              const hasRole = role && (!(Array.isArray(role) && role.length === 0));
              if (!hasRole) return <HomePage />;
              if (Array.isArray(role) && role.includes("ROLE_ADMIN"))
                return <Navigate to="/admin/dashboard" replace />;
              if (Array.isArray(role) && role.includes("ROLE_STAFF"))
                return <Navigate to="/staff/dashboard" replace />;
              if (Array.isArray(role) && role.includes("ROLE_USER"))
                return <Navigate to="/citizen/dashboard" replace />;
              return <HomePage />;
            })()
          }
        />
        <Route path="citizen/*" element={<CitizenLayout />} />
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
             <ProtectedRoute requiredRole="ROLE_ADMIN">
              <AdminLayout />
             </ProtectedRoute>
          }
        />
        <Route
          path="staff/*"
          element={
             <ProtectedRoute requiredRole="ROLE_STAFF">
              <StaffLayout />
             </ProtectedRoute>
          }
        />
        <Route path="/*" element={<CitizenLayout />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
};

export default App;
