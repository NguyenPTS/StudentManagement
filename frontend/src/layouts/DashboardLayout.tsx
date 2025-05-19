import { Layout, Menu } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  UserOutlined,
  BookOutlined,
  BarChartOutlined,
  SettingOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { Outlet } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

interface MenuItem {
  key: string;
  icon: React.ReactNode;
  label: string;
  path: string;
  roles: string[];
}

const menuItems: MenuItem[] = [
  {
    key: 'dashboard',
    icon: <BarChartOutlined />,
    label: 'Dashboard',
    path: '/dashboard',
    roles: ['admin', 'teacher'],
  },
  {
    key: 'students',
    icon: <UserOutlined />,
    label: 'Students',
    path: '/dashboard/students',
    roles: ['admin', 'teacher'],
  },
  {
    key: 'classes',
    icon: <BookOutlined />,
    label: 'Classes',
    path: '/dashboard/classes',
    roles: ['admin', 'teacher'],
  },
  {
    key: 'grades',
    icon: <BarChartOutlined />,
    label: 'Grades',
    path: '/dashboard/grades',
    roles: ['admin', 'teacher'],
  },
  {
    key: 'teachers',
    icon: <TeamOutlined />,
    label: 'Teachers',
    path: '/dashboard/teachers',
    roles: ['admin'],
  },
  {
    key: 'settings',
    icon: <SettingOutlined />,
    label: 'Settings',
    path: '/dashboard/settings',
    roles: ['admin'],
  },
];

const DashboardLayout = () => {
  const navigate = useNavigate();
  const { user } = useAuth();

  const filteredMenuItems = menuItems.filter(item => 
    item.roles.includes(user?.role || '')
  );

  const handleMenuClick = (path: string) => {
    navigate(path);
  };

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider width={250} theme="light">
        <div className="logo" style={{ height: 64, padding: 16 }}>
          Student Management
        </div>
        <Menu
          mode="inline"
          defaultSelectedKeys={['dashboard']}
          items={filteredMenuItems.map(item => ({
            key: item.key,
            icon: item.icon,
            label: item.label,
            onClick: () => handleMenuClick(item.path),
          }))}
        />
      </Sider>
      <Layout>
        <Header style={{ background: '#fff', padding: 0 }} />
        <Content style={{ margin: '24px 16px', padding: 24, background: '#fff' }}>
          <Outlet />
        </Content>
      </Layout>
    </Layout>
  );
};

export default DashboardLayout; 