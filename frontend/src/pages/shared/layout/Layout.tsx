import { ReactNode, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { useTheme } from "../../../context/ThemeContext";
import Header from "../../../components/layout/Header";
import Sidebar from "../../../components/layout/Sidebar";
import { Button } from "antd";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { motion, AnimatePresence } from "framer-motion";

interface LayoutProps {
  children: ReactNode;
  showSidebar?: boolean;
  role?: 'admin' | 'teacher';
}

const Layout = ({ children, showSidebar = true, role }: LayoutProps) => {
  // Copy nội dung từ file cũ
  return (
    <div>
      {/* Copy nội dung từ file cũ */}
    </div>
  );
};

export default Layout; 