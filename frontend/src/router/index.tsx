// src/router/index.tsx
import { Routes, Route, Navigate } from "react-router-dom";
import { Suspense } from "react";
import { authRoutes } from "../routes/auth.routes";

import adminRoutes from "../routes/admin.routes";
import { RouteObject } from "react-router-dom";
import NotFound from "../pages/NotFound";
import teacherRoutes from "../routes/teacher.routes";

const AppRouter = () => {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <Routes>
        {/* Auth routes */}
        {authRoutes.map((route: RouteObject) => (
          <Route key={route.path} path={route.path} element={route.element}>
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
          <Route key={route.path} path={route.path} element={route.element}>
            {route.children?.map((child: RouteObject) => (
              <Route
                key={child.path}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        ))}

        {/* teacher routes */}
        {teacherRoutes.map((route: RouteObject) => (
          <Route key={route.path} path={route.path} element={route.element}>
            {route.children?.map((child: RouteObject) => (
              <Route
                key={child.path}
                path={child.path}
                element={child.element}
              />
            ))}
          </Route>
        ))}

        {/* Route mặc định */}
        <Route path="/" element={<Navigate to="/auth/login" replace />} />

        {/* Xử lý route không tồn tại */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
  );
};

export default AppRouter;
