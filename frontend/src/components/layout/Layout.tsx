import { ReactNode, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useTheme } from "../../context/ThemeContext";
import Header from "./Header";
import Sidebar from "./Sidebar";
import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  role?: 'admin' | 'teacher';
}

const Layout = ({ children, showSidebar = true, role }: LayoutProps) => {
  const { user } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarCollapsed(!sidebarCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  // Helper function to ensure role is either 'admin' or 'teacher'
  const getSafeRole = (userRole?: string): 'admin' | 'teacher' => {
    if (userRole === 'admin' || userRole === 'teacher') {
      return userRole;
    }
    return 'teacher'; // Default to teacher if role is invalid
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
      <Header 
        onToggleTheme={toggleTheme} 
        theme={theme}
        onToggleMobileMenu={toggleMobileMenu}
      />
      
      <div className="flex">
        {showSidebar && (
          <>
            {/* Desktop Sidebar */}
            <div className="hidden md:block">
              <motion.div
                initial={false}
                animate={{
                  width: sidebarCollapsed ? 80 : 250,
                }}
                transition={{ duration: 0.2 }}
                className="fixed top-16 left-0 h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700"
              >
                <Sidebar 
                  role={getSafeRole(role || user?.role)}
                  collapsed={sidebarCollapsed}
                />
              </motion.div>
            </div>

            {/* Mobile Sidebar */}
            <AnimatePresence>
              {isMobileMenuOpen && (
                <motion.div
                  initial={{ x: -300 }}
                  animate={{ x: 0 }}
                  exit={{ x: -300 }}
                  transition={{ duration: 0.2 }}
                  className="fixed top-16 left-0 w-[250px] h-[calc(100vh-4rem)] bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 md:hidden z-50"
                >
                  <Sidebar 
                    role={getSafeRole(role || user?.role)}
                    collapsed={false}
                  />
                </motion.div>
              )}
            </AnimatePresence>
          </>
        )}

        <main className={`flex-1 transition-all duration-200 ${
          showSidebar ? 'md:ml-[250px]' : ''
        } ${sidebarCollapsed ? 'md:ml-20' : ''}`}>
          <div className="container mx-auto px-4 py-8">
            {showSidebar && (
              <Button
                type="text"
                icon={sidebarCollapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
                onClick={toggleSidebar}
                className="fixed top-20 left-[260px] z-50 hidden md:block dark:text-white dark:hover:text-gray-300"
                style={{
                  left: sidebarCollapsed ? '90px' : '260px',
                }}
              />
            )}
            {children}
          </div>
        </main>

        {/* Mobile menu backdrop */}
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black md:hidden z-40"
            onClick={toggleMobileMenu}
          />
        )}
      </div>
    </div>
  );
};

export default Layout; 