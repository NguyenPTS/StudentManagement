import { lazy } from "react";
import { RouteObject } from "react-router-dom";

// Lazy load components
const StudentList = lazy(() => import("../pages/student/StudentList"));
const StudentForm = lazy(() => import("../pages/student/StudentForm"));
const StudentManagement = lazy(() => import("../pages/student/StudentManagement"));

export const studentRoutes: RouteObject[] = [
  {
    path: "/student",
    children: [
      {
        path: "management",
        element: <StudentManagement />,
      },
      {
        path: "list",
        element: <StudentList />,
      },
      {
        path: "add",
        element: <StudentForm />,
      },
      {
        path: "edit/:id",
        element: <StudentForm />,
      },
    ],
  },
]; 