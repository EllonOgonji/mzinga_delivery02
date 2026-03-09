import React, { useEffect } from "react";
import { Outlet, useNavigate, useLocation, useLoaderData } from "react-router-dom";
import useAuth from "@/hooks/useAuth";

type Props = { requiredRole?: string };

const ProtectedRoute = ({ requiredRole }: Props) => {
  const { isAuthenticated, role } = useAuth();
  const navigate = useNavigate();
  const location = useLocation()
  const path = location.pathname

  useEffect(() => {
    if (!isAuthenticated) {
      if (path == "/"){
        navigate("/auth/login", {
          replace: true
        })
      }else {
        navigate("/auth/login", {
          replace: true,
          state: {
            authToast: {
              title: "Unauthorized",
              description: "You must be logged in to access this page.",
            },
          },
        });
      }
      return;
    }

    if (requiredRole && requiredRole !== role) {
      navigate("/auth/login", {
        replace: true,
        state: {
          authToast: {
            title: "Unauthorized",
            description: "You don't have access to this page.",
          },
        },
      });
      return;
    }
  }, [isAuthenticated, role, requiredRole, navigate]);

  if (!isAuthenticated || (requiredRole && requiredRole !== role)) return null;
  
  return <Outlet />;
};

export default ProtectedRoute;