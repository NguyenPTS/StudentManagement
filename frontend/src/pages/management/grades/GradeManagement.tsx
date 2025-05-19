import React, { useState } from 'react';
import { Table, Select, Button, message, InputNumber, Form } from 'antd';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../../../context/AuthContext';
import classService from '../../../services/classService';
import { Class, Grade } from '../../../types/class';

const { Option } = Select;

interface GradeData {
  students: {
    id: string;
    name: string;
    mssv: string;
    grades: {
      assignments: {
        id: string;
        name: string;
        score: number;
      }[];
      finalGrade?: number;
    };
  }[];
}

const GradeManagement: React.FC = () => {
  const [selectedClass, setSelectedClass] = useState<string>();
  const [loading, setLoading] = useState(false);
  const { user } = useAuth();
  const [form] = Form.useForm();
  const queryClient = useQueryClient();

  const { data: classes } = useQuery({
    queryKey: ['classes'],
    queryFn: () => classService.getAll(),
  });

  const { data: students, isLoading } = useQuery({
    queryKey: ['grades', selectedClass],
    queryFn: () => (selectedClass ? classService.getGrades(selectedClass) : null),
    enabled: !!selectedClass,
  });

  const updateGradesMutation = useMutation({
    mutationFn: (values: { grades: Grade[] }) => {
      if (!selectedClass) throw new Error('No class selected');
      return classService.updateGrades(selectedClass, values.grades);
    },
    onSuccess: () => {
      message.success('Grades updated successfully');
      queryClient.invalidateQueries({ queryKey: ['grades', selectedClass] });
    },
    onError: () => {
      message.error('Failed to update grades');
    },
  });

  const handleClassChange = (value: string) => {
    setSelectedClass(value);
  };

  const handleSaveGrades = async () => {
    try {
      if (!selectedClass) return;
      
      const values = form.getFieldsValue();
      const updatedGrades: Grade[] = Object.entries(values).map(([key, value]) => {
        const [studentId, assignmentId] = key.split('-');
        return {
          studentId,
          assignmentId,
          score: value as number,
        };
      });

      updateGradesMutation.mutate({ grades: updatedGrades });
    } catch (error) {
      message.error('Failed to update grades');
    }
  };

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
    },
    ...(students?.students[0]?.grades.assignments || []).map((assignment) => ({
      title: assignment.name,
      dataIndex: ['grades', 'assignments'],
      key: assignment.id,
      render: (assignments: any[], record: GradeData['students'][0]) => (
        <Form.Item
          name={`${record.id}-${assignment.id}`}
          initialValue={assignments.find(a => a.id === assignment.id)?.score}
          style={{ margin: 0 }}
        >
          <InputNumber
            min={0}
            max={100}
            disabled={user?.role !== 'admin' && user?.role !== 'teacher'}
          />
        </Form.Item>
      ),
    })),
    {
      title: 'Final Grade',
      dataIndex: ['grades', 'finalGrade'],
      key: 'finalGrade',
      render: (finalGrade: number) => finalGrade?.toFixed(2) || '-',
    },
  ];

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Grade Management</h1>
        <Select
          style={{ width: 300 }}
          placeholder="Select a class"
          onChange={handleClassChange}
          value={selectedClass}
        >
          {classes?.map((cls: Class) => (
            <Option key={cls.id} value={cls.id}>
              {cls.name}
            </Option>
          ))}
        </Select>
      </div>

      {selectedClass && (
        <Form form={form}>
          <Table
            columns={columns}
            dataSource={students?.students}
            rowKey="id"
            loading={loading || isLoading}
            pagination={false}
            scroll={{ x: 'max-content' }}
          />
          {(user?.role === 'admin' || user?.role === 'teacher') && (
            <Button
              type="primary"
              onClick={handleSaveGrades}
              className="mt-4"
            >
              Save Grades
            </Button>
          )}
        </Form>
      )}
    </div>
  );
};

export default GradeManagement; 