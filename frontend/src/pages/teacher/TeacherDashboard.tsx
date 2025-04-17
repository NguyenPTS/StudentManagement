import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Table, Button, message } from 'antd';
import { TeamOutlined, UserOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import studentService from '../../services/studentService';
import { Student } from '../../services/studentService';
import { StatsSkeleton, TableSkeleton } from '../../components/ui/Skeleton';
import { useTheme } from '../../context/ThemeContext';

const TeacherDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({
    totalStudents: 0,
    activeStudents: 0,
    recentStudents: [] as Student[],
  });
  const { theme } = useTheme();

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const students = await studentService.getAll();
      const activeStudents = students.filter(student => student.status === 'active');
      const recentStudents = students.slice(0, 5);
      
      setStats({
        totalStudents: students.length,
        activeStudents: activeStudents.length,
        recentStudents,
      });
    } catch (error: any) {
      console.error('Error fetching dashboard data:', error);
      message.error('Không thể tải dữ liệu. Vui lòng thử lại sau.');
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
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        const statusColors = {
          active: 'text-green-600 bg-green-100 dark:bg-green-900/30',
          inactive: 'text-red-600 bg-red-100 dark:bg-red-900/30',
          graduated: 'text-blue-600 bg-blue-100 dark:bg-blue-900/30',
        };
        const statusText = {
          active: 'Đang học',
          inactive: 'Nghỉ học',
          graduated: 'Đã tốt nghiệp',
        };
        return (
          <span className={`px-2 py-1 rounded-full text-sm ${statusColors[status as keyof typeof statusColors]}`}>
            {statusText[status as keyof typeof statusText]}
          </span>
        );
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <StatsSkeleton />
        <TableSkeleton />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 dark:bg-gray-900 min-h-screen transition-colors duration-200">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-2xl font-bold mb-6 text-gray-900 dark:text-white">
          Quản lý sinh viên
        </h1>
      </motion.div>
      
      <Row gutter={16} className="mb-6">
        <Col xs={24} sm={12}>
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <TeamOutlined className="text-2xl text-blue-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Tổng số sinh viên</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalStudents}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
        <Col xs={24} sm={12}>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="hover:shadow-lg transition-shadow duration-200 dark:bg-gray-800 dark:border-gray-700">
              <div className="flex items-center space-x-4">
                <UserOutlined className="text-2xl text-green-500" />
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Sinh viên đang học</p>
                  <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.activeStudents}</p>
                </div>
              </div>
            </Card>
          </motion.div>
        </Col>
      </Row>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <Card
          title={
            <span className="text-gray-900 dark:text-white">
              Danh sách sinh viên gần đây
            </span>
          }
          extra={
            <Link to="/teacher/students">
              <Button type="primary">Xem tất cả</Button>
            </Link>
          }
          className="dark:bg-gray-800 dark:border-gray-700"
          bodyStyle={{ padding: 0 }}
        >
          <Table
            columns={recentStudentsColumns}
            dataSource={stats.recentStudents}
            rowKey="id"
            pagination={false}
            className="dark:text-gray-300"
          />
        </Card>
      </motion.div>
    </div>
  );
};

export default TeacherDashboard; 