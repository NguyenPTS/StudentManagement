import React, { useState } from 'react';
import { Table, Button, Space, Input, Select, Tooltip, Modal, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import studentService from '../../../../services/studentService';
import { Student } from '../../../../types/student';
import { useAuth } from '../../../../context/AuthContext';
import { Key } from 'react';

const { Search } = Input;
const { Option } = Select;

interface StudentFilters {
  status?: string;
  gender?: string;
}

const StudentList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [filters, setFilters] = useState<StudentFilters>({});
  const [searchText, setSearchText] = useState('');

  const { data: students, isLoading } = useQuery({
    queryKey: ['students', filters],
    queryFn: () => studentService.getAll(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => studentService.delete(id),
    onSuccess: () => {
      message.success('Student deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: () => {
      message.error('Failed to delete student');
    },
  });

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this student?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const columns: ColumnsType<Student> = [
    {
      title: 'ID',
      dataIndex: 'id',
      key: 'id',
      render: (text) => <a>{text}</a>,
      onFilter: (value: boolean | Key, record) => record.id.includes(value.toString()),
      sorter: (a, b) => a.id.localeCompare(b.id),
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
      title: 'Gender',
      dataIndex: 'gender',
      key: 'gender',
      render: (gender: string) => gender.charAt(0).toUpperCase() + gender.slice(1),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={status === 'active' ? 'text-green-600' : 'text-red-600'}>
          {status.charAt(0).toUpperCase() + status.slice(1)}
        </span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_: any, record: Student) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/students/${record.id}`)}
            />
          </Tooltip>
          {user?.role === 'admin' && (
            <>
              <Tooltip title="Edit">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/students/edit/${record.id}`)}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  danger
                  icon={<DeleteOutlined />}
                  onClick={() => handleDelete(record.id)}
                />
              </Tooltip>
            </>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Student Management</h1>
        {user?.role === 'admin' && (
          <Button type="primary" onClick={() => navigate('/students/create')}>
            Create New Student
          </Button>
        )}
      </div>

      <div className="mb-4 flex space-x-4">
        <Search
          placeholder="Search by student ID or name"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 300 }}
        />
        <Select
          placeholder="Gender"
          allowClear
          style={{ width: 150 }}
          onChange={(value: string | undefined) =>
            setFilters((prev) => ({ ...prev, gender: value }))
          }
        >
          <Option value="male">Male</Option>
          <Option value="female">Female</Option>
          <Option value="other">Other</Option>
        </Select>
        <Select
          placeholder="Status"
          allowClear
          style={{ width: 150 }}
          onChange={(value: string | undefined) =>
            setFilters((prev) => ({ ...prev, status: value }))
          }
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} students`,
        }}
      />
    </div>
  );
};

export default StudentList; 