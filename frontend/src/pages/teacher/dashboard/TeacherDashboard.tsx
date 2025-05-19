import React, { useState, useEffect } from 'react';
import { Card, Row, Col, Statistic, Table, Button, Space } from 'antd';
import { TeamOutlined, BookOutlined, CheckCircleOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../../context/AuthContext';
import classService from '../../../services/classService';
import { Class } from '../../../types/class';

const TeacherDashboard: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [classes, setClasses] = useState<Class[]>([]);
  const { user } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    fetchClasses();
  }, []);

  const fetchClasses = async () => {
    try {
      setLoading(true);
      const data = await classService.getAll();
      setClasses(data.filter(cls => cls.teacher?.id === user?.id));
    } catch (error) {
      console.error('Error fetching classes:', error);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: 'Class Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Subject',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Students',
      dataIndex: 'studentCount',
      key: 'studentCount',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={`capitalize ${status === 'active' ? 'text-green-600' : 'text-gray-500'}`}>
          {status}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Class) => (
        <Space>
          <Button type="link" onClick={() => navigate(`/teacher/classes/${record.id}`)}>
            View
          </Button>
          <Button type="link" onClick={() => navigate(`/teacher/classes/${record.id}/grades`)}>
            Grades
          </Button>
        </Space>
      ),
    },
  ];

  const stats = {
    totalClasses: classes.length,
    activeClasses: classes.filter(c => c.status === 'active').length,
    totalStudents: classes.reduce((acc, curr) => acc + (curr.studentCount || 0), 0),
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Teacher Dashboard</h1>

      <Row gutter={[16, 16]} className="mb-6">
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Classes"
              value={stats.totalClasses}
              prefix={<BookOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Active Classes"
              value={stats.activeClasses}
              prefix={<CheckCircleOutlined />}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              prefix={<TeamOutlined />}
            />
          </Card>
        </Col>
      </Row>

      <Card title="My Classes" className="mb-6">
        <Table
          columns={columns}
          dataSource={classes}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Row gutter={[16, 16]}>
        <Col xs={24} md={12}>
          <Card title="Quick Actions">
            <Space direction="vertical" style={{ width: '100%' }}>
              <Button
                type="primary"
                block
                onClick={() => navigate('/teacher/grades')}
              >
                Manage Grades
              </Button>
              <Button
                block
                onClick={() => navigate('/teacher/students')}
              >
                View Students
              </Button>
            </Space>
          </Card>
        </Col>
        <Col xs={24} md={12}>
          <Card title="Recent Activity">
            <p>No recent activity</p>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default TeacherDashboard; 