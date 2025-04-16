import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import type { User } from '../services/userService';

interface ProtectedRouteProps {
  children: React.ReactNode;
  roles?: User['role'][];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, roles }) => {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/auth/login" state={{ from: location }} replace />;
  }

  if (roles && (!user?.role || !roles.includes(user.role))) {
    // Redirect to dashboard based on user role
    const dashboardPath = user?.role === 'admin' ? '/admin/dashboard' : '/teacher/dashboard';
    return <Navigate to={dashboardPath} replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute; 