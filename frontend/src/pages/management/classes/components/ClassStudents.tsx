import React from 'react';
import { Table, Button, Space, message } from 'antd';
import { useQuery } from '@tanstack/react-query';
import { useParams } from 'react-router-dom';
import classService from '../../../../services/classService';
import { Student } from '../../../../types/student';

const ClassStudents: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  const { data: students, isLoading } = useQuery({
    queryKey: ['class-students', id],
    queryFn: () => (id ? classService.getStudents(id) : []),
    enabled: !!id,
  });

  const columns = [
    {
      title: 'MSSV',
      dataIndex: 'mssv',
      key: 'mssv',
    },
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
      title: 'Điểm trung bình',
      dataIndex: 'averageGrade',
      key: 'averageGrade',
      render: (grade: number) => grade?.toFixed(2) || '-',
    },
  ];

  return (
    <div>
      <Table
        columns={columns}
        dataSource={students}
        rowKey="id"
        loading={isLoading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng ${total} sinh viên`,
        }}
      />
    </div>
  );
};

export default ClassStudents; 