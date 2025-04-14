import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, message } from 'antd';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import studentService from '../../services/studentService';
import { Student } from '../../services/studentService';

const TeacherDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    recentStudents: [] as Student[],
  });

  const fetchDashboardData = async () => {
    try {
      console.log('Starting to fetch dashboard data...');
      setLoading(true);
      
      // Check if token exists
      const token = localStorage.getItem('token');
      console.log('Token exists:', !!token);
      
      // Fetch all students
      console.log('Fetching students...');
      const students = await studentService.getAll();
      console.log('Fetched students:', students);
      
      // Filter active students
      const activeStudents = students.filter(student => student.status === 'active');
      console.log('Active students:', activeStudents);
      
      // Get recent students (last 5)
      const recentStudents = students.slice(0, 5);
      console.log('Recent students:', recentStudents);
      
      setStats({
        totalStudents: students.length,
        activeStudents: activeStudents.length,
        recentStudents,
      });
      console.log('Dashboard data updated successfully');
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    console.log('TeacherDashboard mounted');
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        switch (status) {
          case 'active':
            return 'Đang học';
          case 'inactive':
            return 'Nghỉ học';
          case 'graduated':
            return 'Đã tốt nghiệp';
          default:
            return status;
        }
      },
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Student) => (
        <Link to={`/teacher/students/${record.id}`}>
          <Button type="link">Xem chi tiết</Button>
        </Link>
      ),
    },
  ];

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Quản lý sinh viên</h1>
      
      <Row gutter={16} className="mb-6">
        <Col span={12}>
          <Card>
            <Statistic
              title="Tổng số sinh viên"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
        <Col span={12}>
          <Card>
            <Statistic
              title="Sinh viên đang học"
              value={stats.activeStudents}
              prefix={<UserOutlined />}
              loading={loading}
            />
          </Card>
        </Col>
      </Row>

      <Card
        title="Danh sách sinh viên gần đây"
        extra={
          <Link to="/teacher/students">
            <Button type="primary">Xem tất cả</Button>
          </Link>
        }
      >
        <Table
          columns={recentStudentsColumns}
          dataSource={stats.recentStudents}
          rowKey="id"
          loading={loading}
          pagination={false}
        />
      </Card>
    </div>
  );
};

export default TeacherDashboard; 