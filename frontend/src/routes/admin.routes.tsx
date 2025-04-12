import React from 'react';
import { RouteObject } from 'react-router-dom';
import UserManagement from '../pages/admin/UserManagement';
import ProtectedRoute from '../components/ProtectedRoute';

const adminRoutes: RouteObject[] = [
  {
    path: '/admin/users',
    element: (
      <ProtectedRoute requiredRole="admin">
        <UserManagement />
      </ProtectedRoute>
    ),
  },
];

export default adminRoutes; 