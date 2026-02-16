import React, { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type Props = { requiredRole?: string };

const ProtectedRoute = ({ requiredRole }: Props) => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/auth/login", {
        replace: true,
        state: {
          authToast: {
            title: "Unauthorized",
            description: "You must be logged in to access this page.",
            variant: "destructive",
          },
        },
      });
      return;
    }
    if (requiredRole && role !== requiredRole) {
      navigate("/", {
        replace: true,
        state: {
          authToast: {
            title: "Unauthorized",
            description: "You do not have permission to access this page.",
            variant: "destructive",
          },
        },
      });
    }
  }, [isAuthenticated, role, requiredRole, navigate]);

  if (!isAuthenticated || (requiredRole && role !== requiredRole)) return null;
  
  return <Outlet />;
};

export default ProtectedRoute;