import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Tag, Input, Select, message } from 'antd';
import { PlusOutlined, SearchOutlined, ReloadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import studentService from '../../../services/studentService';
import { Student } from '../../../types/student';

const { Option } = Select;

const StudentList: React.FC = () => {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const data = await studentService.getAll();
      setStudents(data);
    } catch (error) {
      message.error('Failed to fetch students');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (value: string) => {
    setSearchText(value);
  };

  const handleStatusFilter = (value: string) => {
    setStatusFilter(value);
  };

  const filteredStudents = students.filter(student => {
    const matchesSearch = student.name.toLowerCase().includes(searchText.toLowerCase()) ||
      student.email.toLowerCase().includes(searchText.toLowerCase()) ||
      (student.mssv && student.mssv.toLowerCase().includes(searchText.toLowerCase()));
    
    const matchesStatus = !statusFilter || student.status === statusFilter;

    return matchesSearch && matchesStatus;
  });

  const columns = [
    {
      title: 'Student ID',
      dataIndex: 'mssv',
      key: 'mssv',
    },
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a: Student, b: Student) => a.name.localeCompare(b.name),
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={status === 'active' ? 'green' : 'red'}>
          {status.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Student) => (
        <Space>
          <Button
            type="link"
            onClick={() => navigate(`/admin/students/${record.id}`)}
          >
            Edit
          </Button>
          <Button
            type="link"
            onClick={() => navigate(`/admin/students/${record.id}/grades`)}
          >
            Grades
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Students</h1>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => navigate('/admin/students/new')}
        >
          Add Student
        </Button>
      </div>

      <div className="mb-4 flex gap-4">
        <Input
          placeholder="Search by name, email, or student ID"
          prefix={<SearchOutlined />}
          onChange={e => handleSearch(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Filter by status"
          allowClear
          onChange={handleStatusFilter}
          style={{ width: 150 }}
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
        <Button
          icon={<ReloadOutlined />}
          onClick={fetchStudents}
        >
          Refresh
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={filteredStudents}
        rowKey="id"
        loading={loading}
      />
    </div>
  );
};

export default StudentList; 