import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button } from 'antd';
import { UserOutlined, BookOutlined, TeamOutlined, BarChartOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import userService from '../services/userService';
import studentService from '../services/studentService';

const Dashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalTeachers: 0,
    totalUsers: 0,
    recentStudents: [] as any[],
  });

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      
      // Fetch users to count teachers
      const users = await userService.getAll();
      const teachers = users.filter(user => user.role === 'teacher');
      
      // Fetch students
      const students = await studentService.getAll();
      
      // Get recent students (last 5)
      const recentStudents = students.slice(0, 5);
      
      setStats({
        totalStudents: students.length,
        totalTeachers: teachers.length,
        totalUsers: users.length,
        recentStudents,
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const recentStudentsColumns = [
    {
      title: 'MSSV',
      dataIndex: 'mssv',
      key: 'mssv',
    },
    {
      title: 'Họ và tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Lớp',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: any) => (
        <Link to={`/student/${record._id}`}>
          <Button type="link">Xem chi tiết</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Tổng quan hệ thống</h1>
      
      <Row gutter={16} className="mb-6">
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số sinh viên"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số giáo viên"
              value={stats.totalTeachers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tổng số người dùng"
              value={stats.totalUsers}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Tỷ lệ sinh viên/giáo viên"
              value={stats.totalTeachers > 0 ? (stats.totalStudents / stats.totalTeachers).toFixed(1) : 0}
              prefix={<BarChartOutlined />}
              suffix=":1"
              loading={loading}
            />
          </Card>
        </Col>
      </Row>
      
      <Row gutter={16}>
        <Col span={24}>
          <Card 
            title="Sinh viên mới thêm gần đây" 
            extra={
              <Link to="/students">
                <Button type="primary">Xem tất cả</Button>
              </Link>
            }
          >
            <Table
              columns={recentStudentsColumns}
              dataSource={stats.recentStudents}
              rowKey="_id"
              loading={loading}
              pagination={false}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default Dashboard; 