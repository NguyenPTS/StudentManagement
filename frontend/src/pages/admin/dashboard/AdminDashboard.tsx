import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Button, Space } from "antd";
import { UserOutlined, TeamOutlined, BookOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../../services/userService";
import { User } from "../../../services/userService";

const AdminDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTeachers: 0,
    recentUsers: [] as User[],
  });
  const navigate = useNavigate();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);

      // Fetch users
      const users = await userService.getAll();
      const teachers = users.filter((user) => user.role === "teacher");

      // Get recent users (last 5)
      const recentUsers = users.slice(0, 5);

      setStats({
        totalUsers: users.length,
        totalTeachers: teachers.length,
        recentUsers,
      });
    } catch (error: any) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <span className="capitalize">{role}</span>
      ),
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/admin/users/${record.id}`)}
          >
            View
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Users"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Teachers"
              value={stats.totalTeachers}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Classes"
              value={0}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="Recent Users" className="mb-6">
        <Table
          columns={columns}
          dataSource={stats.recentUsers}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
        <div className="mt-4">
          <Button type="primary" onClick={() => navigate("/admin/users")}>
            View All Users
          </Button>
        </div>
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                block
                onClick={() => navigate("/admin/teachers/new")}
              >
                Add New Teacher
              </Button>
              <Button
                block
                onClick={() => navigate("/admin/classes/new")}
              >
                Create New Class
              </Button>
              <Button
                block
                onClick={() => navigate("/admin/settings")}
              >
                System Settings
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="System Status">
            <p>All systems operational</p>
            <Button type="link" className="p-0">
              View System Status
            </Button>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default AdminDashboard; 