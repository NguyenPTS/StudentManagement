import { lazy, Suspense } from "react";
import { RouteObject } from "react-router-dom";

// Lazy load components
const Login = lazy(() => import("../pages/auth/Login"));
const Register = lazy(() => import("../pages/auth/register"));

export const authRoutes: RouteObject[] = [
  {
    path: "/auth",
    children: [
      {
        path: "login",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Login />
          </Suspense>
        ),
      },
      {
        path: "register",
        element: (
          <Suspense fallback={<div>Loading...</div>}>
            <Register />
          </Suspense>
        ),
      },
    ],
  },
];
