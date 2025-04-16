import React, { Suspense } from "react";
import { Navigate, useLocation } from "react-router-dom";
import Loading from "../components/Loading";

interface PrivateRouteProps {
  children: React.ReactNode;
  roles?: string[];
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ children, roles }) => {
  const token = localStorage.getItem("token");
  const userRole = localStorage.getItem("userRole");
  const userStatus = localStorage.getItem("userStatus");
  const location = useLocation();

  // Show loading while checking authentication
  if (!token || !userRole || userStatus === "inactive" || userStatus === "blocked") {
    return (
      <Suspense fallback={<Loading />}>
        <Navigate 
          to="/auth/login" 
          replace 
          state={{ from: location.pathname }}
        />
      </Suspense>
    );
  }

  // Check role authorization
  if (roles && !roles.includes(userRole)) {
    // Redirect to appropriate dashboard based on role
    const redirectPath = userRole === "admin" ? "/admin" : "/teacher";
    return (
      <Suspense fallback={<Loading />}>
        <Navigate 
          to={redirectPath} 
          replace 
          state={{ from: location.pathname }}
        />
      </Suspense>
    );
  }

  // Wrap children with Suspense for lazy loading
  return (
    <Suspense fallback={<Loading />}>
      {children}
    </Suspense>
  );
};

export default PrivateRoute;
