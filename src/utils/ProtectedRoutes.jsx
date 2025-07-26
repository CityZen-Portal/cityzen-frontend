import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ role, requiredRole, children }) => {
  if (!role || !role.includes(requiredRole)) {
    return <Navigate to="/unauthorized" />;
  }
  return children;
};

export default ProtectedRoute;
