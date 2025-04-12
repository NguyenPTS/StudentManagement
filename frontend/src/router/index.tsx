// src/router/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { authRoutes } from "../routes/auth.routes";
import { studentRoutes } from "../routes/student.routes";
import adminRoutes from "../routes/admin.routes";
import { RouteObject } from "react-router-dom";

// import Dashboard from "../pages/Dashboard"; // Tạo sau

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Auth routes */}
        {authRoutes.map((route: RouteObject) => (
          <Route key={route.path} path={route.path}>
            {route.children?.map((child: RouteObject) => (
              <Route
                key={child.path}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        ))}

        {/* Admin routes */}
        {adminRoutes.map((route: RouteObject) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}

        {/* Student routes */}
        {studentRoutes.map((route: RouteObject) => (
          <Route key={route.path} path={route.path}>
            {route.children?.map((child: RouteObject) => (
              <Route
                key={child.path}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        ))}

        {/* <Route path="/dashboard" element={<Dashboard />} /> */}
        <Route path="*" element={<Navigate to="/auth/login" replace />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
