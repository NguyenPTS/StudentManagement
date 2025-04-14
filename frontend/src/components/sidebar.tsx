import { Link, useLocation } from "react-router-dom";
import { UserOutlined, TeamOutlined, DashboardOutlined, BookOutlined } from "@ant-design/icons";

export const Sidebar = () => {
  const location = useLocation();
  const userRole = localStorage.getItem("userRole");
  const isAdmin = userRole === "admin";
  const isTeacher = userRole === "teacher";

  const isActive = (path: string) => {
    return location.pathname.startsWith(path);
  };

  return (
    <aside className="w-64 bg-white shadow">
      <nav className="mt-5 px-2">
        {isAdmin && (
          <>
            <Link
              to="/admin"
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive("/admin") && !isActive("/admin/users")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <DashboardOutlined className="mr-3 h-6 w-6" />
              Dashboard
            </Link>
            <Link
              to="/admin/users"
              className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive("/admin/users")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <UserOutlined className="mr-3 h-6 w-6" />
              Quản lý người dùng
            </Link>
          </>
        )}

        {isTeacher && (
          <>
            <Link
              to="/teacher"
              className={`group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive("/teacher") && !isActive("/teacher/students") && !isActive("/teacher/classes")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <DashboardOutlined className="mr-3 h-6 w-6" />
              Dashboard
            </Link>
            <Link
              to="/teacher/classes"
              className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive("/teacher/classes")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <BookOutlined className="mr-3 h-6 w-6" />
              Quản lý lớp học
            </Link>
            <Link
              to="/teacher/students"
              className={`mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md ${
                isActive("/teacher/students")
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              }`}
            >
              <TeamOutlined className="mr-3 h-6 w-6" />
              Quản lý học sinh
            </Link>
          </>
        )}
      </nav>
    </aside>
  );
}; 