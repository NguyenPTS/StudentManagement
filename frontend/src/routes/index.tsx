import React, { Suspense } from "react";
import { createBrowserRouter, Navigate, Outlet } from "react-router-dom";
import { Layout } from "../components/layout";
import Loading from "../components/Loading";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/register";
import PrivateRoute from "./PrivateRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserList from "../pages/admin/UserList";
import UserForm from "../pages/admin/UserForm";
import teacherRoutes from "./teacher.routes";

// Define TeacherLayout component
const TeacherLayout = () => (
  <Layout>
    <Suspense fallback={<Loading />}>
      <Outlet />
    </Suspense>
  </Layout>
);

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Navigate to="/auth/login" replace />,
  },
  {
    path: "/auth",
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
    path: "/admin",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <PrivateRoute roles={["admin"]}>
            <AdminDashboard />
          </PrivateRoute>
        ),
      },
      {
        path: "users",
        children: [
          {
            index: true,
            element: (
              <PrivateRoute roles={["admin"]}>
                <UserList />
              </PrivateRoute>
            ),
          },
          {
            path: "create",
            element: (
              <PrivateRoute roles={["admin"]}>
                <UserForm />
              </PrivateRoute>
            ),
          },
          {
            path: ":id/edit",
            element: (
              <PrivateRoute roles={["admin"]}>
                <UserForm />
              </PrivateRoute>
            ),
          },
        ],
      },
    ],
  },
  {
    path: "/teacher",
    element: (
      <PrivateRoute roles={["teacher"]}>
        <TeacherLayout />
      </PrivateRoute>
    ),
    children: teacherRoutes,
  },
]);
