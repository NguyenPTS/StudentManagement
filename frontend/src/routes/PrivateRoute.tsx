import React from "react";
import { Navigate, useLocation } from "react-router-dom";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userStatus = localStorage.getItem("userStatus");
  const location = useLocation();

  if (!token || !userRole || userStatus === "inactive" || userStatus === "blocked") {
    return <Navigate to="/auth/login" replace />;
  }

  if (roles && !roles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    if (userRole === "admin") {
      return <Navigate to="/admin" replace />;
    } else if (userRole === "teacher") {
      return <Navigate to="/teacher" replace />;
    } else {
      return <Navigate to="/auth/login" replace />;
    }
  }

  return <>{children}</>;
};

export default PrivateRoute;
