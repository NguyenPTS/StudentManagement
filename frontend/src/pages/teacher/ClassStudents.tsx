import React, { useState, useEffect } from 'react';
import { Table, Card, Button, message, Tag, Space } from 'antd';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeftOutlined } from '@ant-design/icons';

interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: 'active' | 'inactive';
  createdAt: string;
}

const ClassStudents: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const { classId } = useParams<{ classId: string }>();
  const navigate = useNavigate();

  const fetchStudents = async () => {
    setLoading(true);
    try {
      // Mock data - Thay thế bằng API call thực tế
      const mockStudents: Student[] = [
        {
          id: '1',
          name: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          phone: '0123456789',
          status: 'active',
          createdAt: '2023-01-01',
        },
        {
          id: '2',
          name: 'Trần Thị B',
          email: 'tranthib@example.com',
          phone: '0987654321',
          status: 'active',
          createdAt: '2023-01-02',
        },
        {
          id: '3',
          name: 'Lê Văn C',
          email: 'levanc@example.com',
          phone: '0369852147',
          status: 'inactive',
          createdAt: '2023-01-03',
        },
      ];

      // Giả lập delay
      setTimeout(() => {
        setStudents(mockStudents);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Có lỗi xảy ra khi tải danh sách học sinh');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [classId]);

  const columns = [
    {
      title: 'Họ và tên',
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
          {status === 'active' ? 'Đang học' : 'Nghỉ học'}
        </Tag>
      ),
    },
    {
      title: 'Ngày tham gia',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <Space>
            <Button 
              icon={<ArrowLeftOutlined />} 
              onClick={() => navigate('/teacher/classes')}
            >
              Quay lại
            </Button>
            <span>Danh sách học sinh lớp {classId}</span>
          </Space>
        }
      >
        <Table
          columns={columns}
          dataSource={students}
          rowKey="id"
          loading={loading}
        />
      </Card>
    </div>
  );
};

export default ClassStudents; 