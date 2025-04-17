import React, { Suspense, lazy } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import Layout from "../components/layout/Layout";
import Loading from "../components/Loading";
import ErrorBoundary from "../components/ErrorBoundary";
import PrivateRoute from "./PrivateRoute";

// Lazy load components
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/Register"));
const Profile = lazy(() => import("../pages/Profile"));
const AdminDashboard = lazy(() => import("../pages/admin/AdminDashboard"));
const UserList = lazy(() => import("../pages/admin/UserList"));
const UserForm = lazy(() => import("../pages/admin/UserForm"));
const StudentList = lazy(() => import("../pages/admin/StudentList"));
const StudentForm = lazy(() => import("../pages/admin/StudentForm"));
const TeacherDashboard = lazy(() => import("../pages/teacher/TeacherDashboard"));
const TeacherStudentList = lazy(() => import("../pages/teacher/StudentList"));
const TeacherStudentForm = lazy(() => import("../pages/teacher/StudentForm"));
const ClassList = lazy(() => import("../pages/teacher/ClassList"));
const ClassStudents = lazy(() => import("../pages/teacher/ClassStudents"));
const NotFound = lazy(() => import("../pages/NotFound"));

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
    element: <Navigate to="/auth/login" replace />,
    errorElement: <ErrorBoundary />,
  },
  {
    path: "/auth",
    element: <AuthLayout />,
    errorElement: <ErrorBoundary />,
    children: [
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "register",
        element: <Register />,
      },
    ],
  },
  {
    path: "/profile",
    element: (
      <PrivateRoute roles={["admin", "teacher"]}>
        <Layout showSidebar={false}>
          <Suspense fallback={<Loading />}>
            <Profile />
          </Suspense>
        </Layout>
      </PrivateRoute>
    ),
  },
  {
    path: "/admin",
    element: (
      <PrivateRoute roles={["admin"]}>
        <Layout showSidebar={true} role="admin">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Layout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <AdminDashboard />,
      },
      {
        path: "users",
        children: [
          {
            index: true,
            element: <UserList />,
          },
          {
            path: "create",
            element: <UserForm />,
          },
          {
            path: ":id/edit",
            element: <UserForm />,
          },
        ],
      },
      {
        path: "students",
        children: [
          {
            index: true,
            element: <StudentList />,
          },
          {
            path: "create",
            element: <StudentForm />,
          },
          {
            path: ":id/edit",
            element: <StudentForm />,
          },
        ],
      },
    ],
  },
  {
    path: "/teacher",
    element: (
      <PrivateRoute roles={["teacher"]}>
        <Layout showSidebar={true} role="teacher">
          <Suspense fallback={<Loading />}>
            <Outlet />
          </Suspense>
        </Layout>
      </PrivateRoute>
    ),
    errorElement: <ErrorBoundary />,
    children: [
      {
        index: true,
        element: <TeacherDashboard />,
      },
      {
        path: "students",
        children: [
          {
            index: true,
            element: <TeacherStudentList />,
          },
          {
            path: "create",
            element: <TeacherStudentForm />,
          },
          {
            path: ":id/edit",
            element: <TeacherStudentForm />,
          },
        ],
      },
      {
        path: "classes",
        children: [
          {
            index: true,
            element: <ClassList />,
          },
          {
            path: ":id/students",
            element: <ClassStudents />,
          },
        ],
      },
    ],
  },
  {
    path: "*",
    element: (
      <Layout showSidebar={false}>
        <NotFound />
      </Layout>
    ),
    errorElement: <ErrorBoundary />,
  },
]);
