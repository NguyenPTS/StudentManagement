import { ReactNode } from "react";
import { useAuth } from "../../context/AuthContext";
import Header from "./Header";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  role?: 'admin' | 'teacher';
}

const Layout = ({ children, showSidebar = true, role }: LayoutProps) => {
  const { isAuthenticated } = useAuth();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="flex">
        {isAuthenticated && showSidebar && role && (
          <Sidebar role={role} />
        )}
        <main className={`flex-1 p-6 ${!isAuthenticated || !showSidebar ? 'w-full' : ''}`}>
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout; 