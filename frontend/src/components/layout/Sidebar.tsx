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

interface SidebarProps {
  role: 'admin' | 'teacher';
}

const Sidebar = ({ role }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();

  const adminMenuItems = [
    {
      key: '/admin',
      icon: <DashboardOutlined />,
      label: <Link to="/admin">Tổng quan</Link>,
    },
    {
      key: '/admin/users',
      icon: <TeamOutlined />,
      label: <Link to="/admin/users">Quản lý người dùng</Link>,
    },
    {
      key: '/admin/students',
      icon: <UserOutlined />,
      label: <Link to="/admin/students">Quản lý sinh viên</Link>,
    },
    {
      key: '/admin/settings',
      icon: <SettingOutlined />,
      label: <Link to="/admin/settings">Cài đặt</Link>,
    },
  ];

  const teacherMenuItems = [
    {
      key: '/teacher',
      icon: <DashboardOutlined />,
      label: <Link to="/teacher">Tổng quan</Link>,
    },
    {
      key: '/teacher/students',
      icon: <UserOutlined />,
      label: <Link to="/teacher/students">Quản lý sinh viên</Link>,
    },
    {
      key: '/teacher/courses',
      icon: <BookOutlined />,
      label: <Link to="/teacher/courses">Quản lý khóa học</Link>,
    },
    {
      key: '/teacher/settings',
      icon: <SettingOutlined />,
      label: <Link to="/teacher/settings">Cài đặt</Link>,
    },
  ];

  const menuItems = role === 'admin' ? adminMenuItems : teacherMenuItems;

  return (
    <aside className="bg-white shadow-sm h-screen">
      <div className="p-4 h-16 flex items-center justify-center border-b">
        <h2 className="text-lg font-semibold text-gray-800">
          {role === 'admin' ? 'Admin Panel' : 'Teacher Panel'}
        </h2>
      </div>
      <Menu
        mode="inline"
        selectedKeys={[location.pathname]}
        items={menuItems}
        className="border-r-0"
      />
    </aside>
  );
};

export default Sidebar; 