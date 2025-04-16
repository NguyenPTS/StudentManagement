import React, { useState, useEffect } from 'react';
import { Table, Card, Button, message, Tag, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';
import studentService from '../../services/studentService';
import type { Student } from '../../services/studentService';

const ClassStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const fetchStudents = async () => {
    if (!classId) return;
    
    setLoading(true);
    try {
      const data = await studentService.getAll({ class: classId });
      setStudents(data);
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Có lỗi xảy ra khi tải danh sách học sinh');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [classId]);

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Số điện thoại',
      dataIndex: 'phone',
      key: 'phone',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status === 'active' ? 'Đang học' : 'Đã nghỉ'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Student) => (
        <Space size="middle">
          <Button type="link" onClick={() => navigate(`/teacher/students/${record.id}`)}>
            Chi tiết
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <Card
      title={
        <Space>
          <Button icon={<ArrowLeftOutlined />} onClick={() => navigate(-1)}>
            Quay lại
          </Button>
          <span>Danh sách học sinh</span>
        </Space>
      }
    >
      <Table
        columns={columns}
        dataSource={students}
        loading={loading}
        rowKey="id"
      />
    </Card>
  );
};

export default ClassStudents; 