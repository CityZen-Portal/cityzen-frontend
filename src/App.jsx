import React, { useEffect } from "react";

import CitizenLayout from "layouts/citizen";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import HomePage from "views/HomePage";
import StaffLayout from "layouts/staff";
import ScrollToTop from "views/citizen/news/components/ScrollToTop";
import ProtectedRoute from "utils/ProtectedRoutes";
import Unauthorized from "views/error/UnauthorizedError";
import { Route, Routes, useNavigate } from "react-router-dom";

const App = () => {
  const role = JSON.stringify(localStorage.getItem("role"));
  const navigate = useNavigate();
  useEffect(() => {
    if (!role) navigate("/auth/signin");
  }, [role, navigate]);
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="citizen/*" element={<CitizenLayout />} />
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
              <ProtectedRoute requiredRole="ROLE_ADMIN" role={role}>
              <AdminLayout />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="staff/*"
          element={
             <ProtectedRoute requiredRole="ROLE_STAFF" role={role}>
              <StaffLayout />
              </ProtectedRoute>
          }
        />
        <Route path="/*" element={<CitizenLayout />} />
        <Route path="/unauthorized" element={<Unauthorized />} />
      </Routes>
    </>
  );
};

export default App;
