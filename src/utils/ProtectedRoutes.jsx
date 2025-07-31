import React from "react";
import { Navigate } from "react-router-dom";
import { useUser } from "../contexts/UserContext";

const ProtectedRoute = ({ requiredRole, children }) => {
  const { role, ready } = useUser();

  if (!ready) return null; // or a loader

  const hasRole = Array.isArray(role)
    ? role.includes(requiredRole)
    : typeof role === "string"
    ? role.includes(requiredRole)
    : false;

  if (!hasRole) {
    return <Navigate to="/unauthorized" />;
  }

  return children;
};

export default ProtectedRoute;
