import React from "react";
import { Routes, Route, useNavigate } from "react-router-dom";

import CitizenLayout from "layouts/citizen";
import AdminLayout from "layouts/admin";
import AuthLayout from "layouts/auth";
import HomePage from "views/HomePage";
import StaffLayout from "layouts/staff";
import ScrollToTop from "views/citizen/news/components/ScrollToTop";
import ProtectedRoute from "utils/ProtectedRoutes";

const App = () => {
  const role = localStorage.getItem("role");
  const navigate = useNavigate();
  if (role == null || role == undefined) {
    navigate("/auth/signin");
  }
  return (
    <>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route
          path="citizen/*"
          element={
            <ProtectedRoute requiredRole="user" Role={role}>
              <CitizenLayout />
            </ProtectedRoute>
          }
        />
        <Route path="auth/*" element={<AuthLayout />} />
        <Route
          path="admin/*"
          element={
            <ProtectedRoute requiredRole="admin" Role={role}>
              <AdminLayout />
            </ProtectedRoute>
          }
        ></Route>
        <Route
          path="staff/*"
          element={
            <ProtectedRoute requiredRole="staff" Role={role}>
              <StaffLayout />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<CitizenLayout />} />
      </Routes>
    </>
  );
};

export default App;
