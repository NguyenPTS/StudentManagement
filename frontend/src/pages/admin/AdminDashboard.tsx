import React, { useState } from 'react';
import { Layout, Menu, Card, Row, Col, Statistic, Table, Button, Avatar, Dropdown } from 'antd';
import {
  UserOutlined,
  BookOutlined,
  SettingOutlined,
  DashboardOutlined,
  TeamOutlined,
  LogoutOutlined,
  BellOutlined,
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

const { Header, Sider, Content } = Layout;

const AdminDashboard: React.FC = () => {
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
            <h2 className="text-lg font-semibold">Tổng quan hệ thống</h2>
          </div>
          <Dropdown menu={{ items: userMenuItems }} placement="bottomRight">
            <div className="flex items-center cursor-pointer">
              <Avatar icon={<UserOutlined />} />
              <span className="ml-2">Admin</span>
            </div>
          </Dropdown>
        </Header>
        <Content className="m-6">
          <Row gutter={[16, 16]}>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng số sinh viên"
                  value={1234}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Tổng số giáo viên"
                  value={56}
                  prefix={<TeamOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Lớp học"
                  value={45}
                  prefix={<BookOutlined />}
                />
              </Card>
            </Col>
            <Col span={6}>
              <Card>
                <Statistic
                  title="Sinh viên mới"
                  value={89}
                  prefix={<UserOutlined />}
                />
              </Card>
            </Col>
          </Row>

          <Card title="Hoạt động gần đây" className="mt-6">
            <Table
              columns={[
                {
                  title: 'Thời gian',
                  dataIndex: 'time',
                  key: 'time',
                },
                {
                  title: 'Người dùng',
                  dataIndex: 'user',
                  key: 'user',
                },
                {
                  title: 'Hành động',
                  dataIndex: 'action',
                  key: 'action',
                },
                {
                  title: 'Chi tiết',
                  dataIndex: 'details',
                  key: 'details',
                },
              ]}
              dataSource={[
                {
                  key: '1',
                  time: '10:30',
                  user: 'Nguyễn Văn A',
                  action: 'Thêm sinh viên mới',
                  details: 'Thêm sinh viên: Trần Thị B',
                },
                {
                  key: '2',
                  time: '09:15',
                  user: 'Trần Văn C',
                  action: 'Cập nhật thông tin',
                  details: 'Cập nhật thông tin lớp: Lớp A1',
                },
              ]}
            />
          </Card>
        </Content>
      </Layout>
    </Layout>
  );
};

export default AdminDashboard; 