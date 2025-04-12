import React, { useEffect, useState } from 'react';
import { Table, Button, message, Space, Popconfirm } from 'antd';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Student } from '../../types/student';
import studentService from '../../services/studentService';
import { useNavigate } from 'react-router-dom';

const StudentManagement: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const fetchStudents = async () => {
    try {
      setLoading(true);
      console.log('Fetching students...');
      const data = await studentService.getAll();
      console.log('Fetched students:', data);
      
      // Map dob to dateOfBirth for display
      const mappedData = data.map(student => ({
        ...student,
        dateOfBirth: student.dob ? new Date(student.dob).toISOString().split('T')[0] : undefined
      }));
      
      setStudents(mappedData);
    } catch (error) {
      console.error('Error fetching students:', error);
      message.error('Failed to fetch students. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleDelete = async (id: string) => {
    try {
      await studentService.delete(id);
      message.success('Student deleted successfully');
      fetchStudents();
    } catch (error) {
      console.error('Error deleting student:', error);
      message.error('Failed to delete student');
    }
  };

  const handleEdit = (id: string) => {
    navigate(`/student/edit/${id}`);
  };

  const handleAdd = () => {
    navigate('/student/add');
  };

  const columns = [
    {
      title: 'MSSV',
      dataIndex: 'mssv',
      key: 'mssv',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Class',
      dataIndex: 'class',
      key: 'class',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => {
        let statusText = '';
        let statusColor = '';
        
        switch (status) {
          case 'active':
            statusText = 'Đang học';
            statusColor = 'green';
            break;
          case 'inactive':
            statusText = 'Nghỉ học';
            statusColor = 'red';
            break;
          case 'graduated':
            statusText = 'Đã tốt nghiệp';
            statusColor = 'blue';
            break;
          default:
            statusText = status;
            statusColor = 'gray';
        }
        
        return <span style={{ color: statusColor }}>{statusText}</span>;
      }
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Student) => (
        <Space>
          <Button
            type="primary"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record.id)}
          />
          <Popconfirm
            title="Are you sure you want to delete this student?"
            onConfirm={() => handleDelete(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button type="primary" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px' }}>
      <div style={{ marginBottom: '16px' }}>
        <Button type="primary" onClick={handleAdd}>
          Add Student
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={students}
        loading={loading}
        rowKey="id"
      />
    </div>
  );
};

export default StudentManagement; 