import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu } from 'antd';
import {
  DashboardOutlined,
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  SettingOutlined,
} from '@ant-design/icons';
import { motion } from 'framer-motion';

interface SidebarProps {
  role: 'admin' | 'teacher';
  collapsed: boolean;
}

const Sidebar = ({ role, collapsed }: SidebarProps) => {
  const location = useLocation();

  const adminMenuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: collapsed ? '' : <Link to="/admin">Tổng quan</Link>,
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: collapsed ? '' : <Link to="/admin/users">Quản lý người dùng</Link>,
    },
    {
      key: '/admin/students',
      icon: <UserOutlined />,
      label: collapsed ? '' : <Link to="/admin/students">Quản lý sinh viên</Link>,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: collapsed ? '' : <Link to="/admin/settings">Cài đặt</Link>,
    },
  ];

  const teacherMenuItems = [
    {
      key: '/teacher',
      icon: <DashboardOutlined />,
      label: collapsed ? '' : <Link to="/teacher">Tổng quan</Link>,
    },
    {
      key: '/teacher/students',
      icon: <UserOutlined />,
      label: collapsed ? '' : <Link to="/teacher/students">Quản lý sinh viên</Link>,
    },
    {
      key: '/teacher/classes',
      icon: <BookOutlined />,
      label: collapsed ? '' : <Link to="/teacher/classes">Quản lý lớp học</Link>,
    },
    {
      key: '/teacher/settings',
      icon: <SettingOutlined />,
      label: collapsed ? '' : <Link to="/teacher/settings">Cài đặt</Link>,
    },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : teacherMenuItems;

  return (
    <motion.div
      initial={false}
      animate={{ width: collapsed ? 80 : 250 }}
      className="h-full"
    >
      <div className="p-4 h-16 flex items-center justify-center border-b border-gray-200 dark:border-gray-700">
        {!collapsed && (
          <h2 className="text-lg font-semibold text-gray-800 dark:text-white">
            {role === 'admin' ? 'Admin Panel' : 'Teacher Panel'}
          </h2>
        )}
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="border-r-0 dark:bg-gray-800 dark:text-white"
        inlineCollapsed={collapsed}
        style={{
          height: 'calc(100% - 4rem)',
        }}
      />
    </motion.div>
  );
};

export default Sidebar; 