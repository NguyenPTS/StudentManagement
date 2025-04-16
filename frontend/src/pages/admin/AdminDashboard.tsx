import React, { useState, useEffect } from "react";
import { Card, Row, Col, Statistic, Table, Button, Space } from "antd";
import { UserOutlined, TeamOutlined, BookOutlined } from "@ant-design/icons";
import { Link, useNavigate } from "react-router-dom";
import userService from "../../services/userService";
import { User } from "../../services/userService";

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

  const recentUsersColumns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) =>
        role === "admin" ? "Quản trị viên" : "Giáo viên",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <span
          className={status === "active" ? "text-green-600" : "text-red-600"}
        >
          {status === "active" ? "Hoạt động" : "Đã khóa"}
        </span>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
      render: (_: any, record: User) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/admin/users/${record._id}/edit`)}
          >
            Chỉnh sửa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Space>
          <Button type="primary" onClick={() => navigate("/admin/users")}>
            Quản lý người dùng
          </Button>
          <Button type="primary" onClick={() => navigate("/admin/students")}>
            Quản lý sinh viên
          </Button>
          <Button
            type="primary"
            onClick={() => navigate("/admin/users/create")}
          >
            Thêm người dùng mới
          </Button>
        </Space>
      </div>

      <Row gutter={[16, 16]} className="mb-6">
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <Statistic
              title="Tổng số giáo viên"
              value={stats.totalTeachers}
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={8}>
          <Card>
            <div 
              onClick={() => navigate("/admin/students")}
              style={{ cursor: 'pointer' }}
            >
              <Statistic
                title="Quản lý sinh viên"
                value="Xem danh sách"
                prefix={<BookOutlined />}
                loading={loading}
                valueStyle={{ color: '#1890ff' }}
              />
            </div>
          </Card>
        </Col>
      </Row>

      <Card
        title="Người dùng gần đây"
        loading={loading}
        extra={
          <Button type="link" onClick={() => navigate("/admin/users")}>
            Xem tất cả
          </Button>
        }
      >
        <Table
          columns={recentUsersColumns}
          dataSource={stats.recentUsers}
          rowKey="_id"
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default AdminDashboard;
