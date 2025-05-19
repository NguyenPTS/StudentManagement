import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Loading from "../components/Loading";
import ErrorBoundary from "../components/ErrorBoundary";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from '../layouts/DashboardLayout';
import RoleGuard from '../components/guards/RoleGuard';
import Login from '../pages/auth/Login';
import Dashboard from '../pages/dashboard';
import StudentList from '../pages/admin/StudentList';
import StudentForm from '../pages/admin/StudentForm';
import ClassList from '../pages/admin/ClassList';
import ClassForm from '../pages/admin/ClassForm';
import TeacherList from '../pages/admin/TeacherList';
import TeacherForm from '../pages/admin/TeacherForm';
import GradeManagement from '../pages/admin/GradeManagement';
import Settings from '../pages/admin/Settings';
import { ProtectedRoute } from '../components/auth';
import { Profile } from '../pages/shared/profile';
import { NotFound } from '../pages/shared/error';
import { UserList, UserForm } from '../pages/management';

// Lazy load components
const Register = lazy(() => import("../pages/auth/Register"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const TeacherDashboard = lazy(() => import("../pages/teacher/TeacherDashboard"));
const TeacherStudentList = lazy(() => import("../pages/teacher/StudentList"));
const TeacherStudentForm = lazy(() => import("../pages/teacher/StudentForm"));
const ClassStudents = lazy(() => import("../pages/teacher/ClassStudents"));

// Auth layout without header and sidebar
const AuthLayout: React.FC = () => (
  <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  </div>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        path: 'classes',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <ClassList />
              </ProtectedRoute>
            ),
          },
          {
            path: 'create',
            element: (
              <ProtectedRoute roles={['admin', 'teacher']}>
                <ClassForm />
              </ProtectedRoute>
            ),
          },
          {
            path: 'edit/:id',
            element: (
              <ProtectedRoute roles={['admin', 'teacher']}>
                <ClassForm />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'grades',
        element: (
          <ProtectedRoute roles={['admin', 'teacher']}>
            <GradeManagement />
          </ProtectedRoute>
        ),
      },
      {
        path: 'students',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <StudentList />
              </ProtectedRoute>
            ),
          },
          {
            path: 'create',
            element: (
              <ProtectedRoute roles={['admin']}>
                <StudentForm />
              </ProtectedRoute>
            ),
          },
          {
            path: 'edit/:id',
            element: (
              <ProtectedRoute roles={['admin']}>
                <StudentForm />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'teachers',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute>
                <TeacherList />
              </ProtectedRoute>
            ),
          },
          {
            path: 'create',
            element: (
              <ProtectedRoute roles={['admin']}>
                <TeacherForm />
              </ProtectedRoute>
            ),
          },
          {
            path: 'edit/:id',
            element: (
              <ProtectedRoute roles={['admin']}>
                <TeacherForm />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'users',
        children: [
          {
            index: true,
            element: (
              <ProtectedRoute roles={['admin']}>
                <UserList />
              </ProtectedRoute>
            ),
          },
          {
            path: 'create',
            element: (
              <ProtectedRoute roles={['admin']}>
                <UserForm />
              </ProtectedRoute>
            ),
          },
          {
            path: 'edit/:id',
            element: (
              <ProtectedRoute roles={['admin']}>
                <UserForm />
              </ProtectedRoute>
            ),
          },
        ],
      },
      {
        path: 'profile',
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
    ],
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/register",
    element: <Register />,
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);
