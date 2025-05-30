import { RouteObject } from "react-router-dom";
import PrivateRoute from "../routes/PrivateRoute";
import AdminDashboard from "../pages/admin/AdminDashboard";
import UserList from "../pages/admin/UserList";
import UserForm from "../pages/admin/UserForm";
import StudentList from "../pages/teacher/StudentList";
import StudentForm from "../pages/admin/StudentForm";
const adminRoutes: RouteObject[] = [
  {
    path: "/admin",
    element: (
      <PrivateRoute roles={["admin"]}>
        <AdminDashboard />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/users",
    element: (
      <PrivateRoute roles={["admin"]}>
        <UserList />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/users/create",
    element: (
      <PrivateRoute roles={["admin"]}>
        <UserForm />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/users/:id/edit",
    element: (
      <PrivateRoute roles={["admin"]}>
        <UserForm />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/students",
    element: (
      <PrivateRoute roles={["admin"]}>
        <StudentList />
      </PrivateRoute>
    ),
  },
  {
    path: "/admin/students/create",
    element: (
      <PrivateRoute roles={["admin"]}>
        <StudentForm />
      </PrivateRoute>
    ),
  },

  {
    path: "/admin/students/:id/edit",
    element: (
      <PrivateRoute roles={["admin"]}>
        <StudentForm />
      </PrivateRoute>
    ),
  },
];

export default adminRoutes;
