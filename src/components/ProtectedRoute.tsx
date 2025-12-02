import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type Props = { requiredRole?: string };

const ProtectedRoute = ({ requiredRole }: Props) => {
  const { isAuthenticated, role } = useAuth();
  if (!isAuthenticated) return <Navigate to="/auth/login" replace />;
  if (requiredRole && role !== requiredRole) return <Navigate to="/" replace />;
  return <Outlet />;
};

export default ProtectedRoute;