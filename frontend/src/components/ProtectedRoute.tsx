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

    // if (requiredRole) {
    //   if (requiredRole == "admin"){
    //     navigate("/admin/dashboard", {
    //       replace: true
    //     });
    //   }else if (requiredRole == "vendor"){
    //      navigate("/vendor/dashboard", {
    //       replace: true
    //     });
    //   }else if(requiredRole == "customer"){
    //     navigate("/", {
    //       replace: true
    //     });
    //   }else{
    //     console.log(requiredRole)
    //   }
    // }
  }, [isAuthenticated, role, requiredRole, navigate]);

  if (!isAuthenticated || (requiredRole != role)) return null;
  
  return <Outlet />;
};

export default ProtectedRoute;