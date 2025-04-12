import React, { useState } from 'react';
import { Layout, Menu, Avatar, Dropdown } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate, Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminLayout: React.FC = () => {
  const navigate = useNavigate();
  const [collapsed, setCollapsed] = useState(false);

  const menuItems = [
    {
      key: 'dashboard',
      icon: <DashboardOutlined />,
      label: 'Tổng quan',
    },
    {
      key: 'students',
      icon: <UserOutlined />,
      label: 'Quản lý sinh viên',
    },
    {
      key: 'teachers',
      icon: <TeamOutlined />,
      label: 'Quản lý giáo viên',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
  ];

  const userMenuItems = [
    {
      key: 'profile',
      icon: <UserOutlined />,
      label: 'Hồ sơ',
    },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: 'Cài đặt',
    },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Đăng xuất',
    },
  ];

  const handleMenuClick = (key: string) => {
    switch (key) {
      case 'dashboard':
        navigate('/admin');
        break;
      case 'students':
        navigate('/admin/students');
        break;
      case 'teachers':
        navigate('/admin/teachers');
        break;
      case 'settings':
        navigate('/admin/settings');
        break;
      default:
        break;
    }
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider collapsible collapsed={collapsed} onCollapse={setCollapsed}>
        <div className="p-4 h-16 flex items-center justify-center">
          <h1 className="text-white text-xl font-bold">Admin Panel</h1>
        </div>
        <Menu
          theme="dark"
          defaultSelectedKeys={['dashboard']}
          mode="inline"
          items={menuItems}
          onClick={({ key }) => handleMenuClick(key)}
        />
      </Sider>
      <Layout>
        <Header className="bg-white px-4 flex justify-between items-center">
          <div className="flex items-center">
            <BellOutlined className="text-xl mr-4" />
            <h2 className="text-lg font-semibold">Hệ thống quản lý</h2>
          </div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center cursor-pointer">
              <Avatar icon={<UserOutlined />} />
              <span className="ml-2">Admin</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="m-6">
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminLayout; 