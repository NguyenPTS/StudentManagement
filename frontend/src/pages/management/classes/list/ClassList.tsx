import React, { useState } from 'react';
import { Table, Button, Space, Input, Select, Tooltip, Modal, message } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { EditOutlined, DeleteOutlined, EyeOutlined } from '@ant-design/icons';
import classService from '../../../../services/classService';
import { Class } from '../../../../types/class';
import { useAuth } from '../../../../context/AuthContext';

const { Search } = Input;
const { Option } = Select;

interface ClassFilters {
  academicYear: string | null;
  semester: number | null;
  status: 'active' | 'inactive' | null;
}

const ClassList: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [filters, setFilters] = useState<ClassFilters>({
    academicYear: null,
    semester: null,
    status: null,
  });
  const [searchText, setSearchText] = useState('');

  const { data: classes, isLoading } = useQuery({
    queryKey: ['classes', filters],
    queryFn: () => classService.getAll(filters),
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => classService.delete(id),
    onSuccess: () => {
      message.success('Class deleted successfully');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    onError: () => {
      message.error('Failed to delete class');
    },
  });

  const handleDelete = (id: string) => {
    Modal.confirm({
      title: 'Are you sure you want to delete this class?',
      content: 'This action cannot be undone.',
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => deleteMutation.mutate(id),
    });
  };

  const columns = [
    {
      title: 'Class Name',
      dataIndex: 'name',
      key: 'name',
      filteredValue: searchText ? [searchText] : null,
      onFilter: (value: string | number | boolean, record: Class) =>
        record.name.toLowerCase().includes(String(value).toLowerCase()),
    },
    {
      title: 'Code',
      dataIndex: 'code',
      key: 'code',
    },
    {
      title: 'Teacher',
      dataIndex: ['teacher', 'name'],
      key: 'teacher',
    },
    {
      title: 'Semester',
      dataIndex: 'semester',
      key: 'semester',
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
      render: (_: any, record: Class) => (
        <Space size="middle">
          <Tooltip title="View Details">
            <Button
              icon={<EyeOutlined />}
              onClick={() => navigate(`/classes/${record.id}`)}
            />
          </Tooltip>
          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <>
              <Tooltip title="Edit">
                <Button
                  icon={<EditOutlined />}
                  onClick={() => navigate(`/classes/edit/${record.id}`)}
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
        <h1 className="text-2xl font-bold">Class Management</h1>
        {(user?.role === 'admin' || user?.role === 'teacher') && (
          <Button type="primary" onClick={() => navigate('/classes/create')}>
            Create New Class
          </Button>
        )}
      </div>

      <div className="mb-4 flex space-x-4">
        <Search
          placeholder="Search by class name"
          allowClear
          onChange={(e) => setSearchText(e.target.value)}
          style={{ width: 200 }}
        />
        <Select
          placeholder="Academic Year"
          allowClear
          style={{ width: 150 }}
          onChange={(value: string | null) =>
            setFilters((prev) => ({ ...prev, academicYear: value }))
          }
        >
          <Option value="2023">2023</Option>
          <Option value="2024">2024</Option>
        </Select>
        <Select
          placeholder="Semester"
          allowClear
          style={{ width: 150 }}
          onChange={(value: number | null) =>
            setFilters((prev) => ({ ...prev, semester: value }))
          }
        >
          <Option value={1}>Semester 1</Option>
          <Option value={2}>Semester 2</Option>
          <Option value={3}>Semester 3</Option>
        </Select>
        <Select
          placeholder="Status"
          allowClear
          style={{ width: 150 }}
          onChange={(value: 'active' | 'inactive' | null) =>
            setFilters((prev) => ({ ...prev, status: value }))
          }
        >
          <Option value="active">Active</Option>
          <Option value="inactive">Inactive</Option>
        </Select>
      </div>

      <Table
        columns={columns}
        dataSource={classes}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} classes`,
        }}
      />
    </div>
  );
};

export default ClassList; 