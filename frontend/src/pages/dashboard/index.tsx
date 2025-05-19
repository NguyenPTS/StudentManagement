import { Card, Col, Row, Statistic } from 'antd';
import { useEffect, useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import studentService from '../../services/studentService';
import classService from '../../services/classService';
import teacherService from '../../services/teacherService';

interface DashboardStats {
  totalStudents: number;
  totalClasses: number;
  totalTeachers: number;
  activeStudents: number;
}

const Dashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalStudents: 0,
    totalClasses: 0,
    totalTeachers: 0,
    activeStudents: 0,
  });

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const [students, classes, teachers] = await Promise.all([
          studentService.getAll(),
          classService.getAll(),
          teacherService.getAll(),
        ]);

        setStats({
          totalStudents: students.length,
          totalClasses: classes.length,
          totalTeachers: teachers.length,
          activeStudents: students.filter(s => s.status === 'active').length,
        });
      } catch (error) {
        console.error('Error fetching dashboard stats:', error);
      }
    };

    fetchStats();
  }, []);

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Dashboard</h1>
      <Row gutter={16}>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Students"
              value={stats.totalStudents}
              valueStyle={{ color: '#3f8600' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Active Students"
              value={stats.activeStudents}
              valueStyle={{ color: '#cf1322' }}
            />
          </Card>
        </Col>
        <Col span={6}>
          <Card>
            <Statistic
              title="Total Classes"
              value={stats.totalClasses}
              valueStyle={{ color: '#096dd9' }}
            />
          </Card>
        </Col>
        {user?.role === 'admin' && (
          <Col span={6}>
            <Card>
              <Statistic
                title="Total Teachers"
                value={stats.totalTeachers}
                valueStyle={{ color: '#722ed1' }}
              />
            </Card>
          </Col>
        )}
      </Row>
    </div>
  );
};

export default Dashboard; 