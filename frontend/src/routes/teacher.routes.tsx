import React from "react";
import { RouteObject } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import StudentList from "../pages/teacher/StudentList";
import StudentForm from "../pages/teacher/StudentForm";
import TeacherDashboard from "@/pages/teacher/TeacherDashboard";

const teacherRoutes: RouteObject[] = [
  {
    path: "/teacher",
    element: (
      <PrivateRoute roles={["teacher"]}>
        <StudentList />
      </PrivateRoute>
    ),
  },
  {
    path: "/teacher/create",
    element: (
      <PrivateRoute roles={["teacher"]}>
        <StudentForm />
      </PrivateRoute>
    ),
  },
  {
    path: "/teacher/create/:id/update",
    element: (
      <PrivateRoute roles={["teacher"]}>
        <StudentForm />
      </PrivateRoute>
    ),
    re,
  },
  {
    path: "/teacher/create/:id",
    element: (
      <PrivateRoute roles={["teacher"]}>
        <StudentList />
      </PrivateRoute>
    ),
  },
];

export default teacherRoutes;
