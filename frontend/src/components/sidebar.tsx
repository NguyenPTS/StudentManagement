import { Link } from "react-router-dom";

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow">
      <nav className="mt-5 px-2">
        <Link
          to="/"
          className="group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          Dashboard
        </Link>
        <Link
          to="/student/list"
          className="mt-1 group flex items-center px-2 py-2 text-base font-medium rounded-md text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        >
          Students
        </Link>
      </nav>
    </aside>
  );
}; 