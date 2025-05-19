import React from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import studentService from '../../../../services/studentService';
import { Student } from '../../../../types/student';
import dayjs from 'dayjs';

const { Option } = Select;

interface StudentFormData {
  name: string;
  email: string;
  mssv: string;
  phone: string;
  dateOfBirth: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  status: 'active' | 'inactive';
}

const StudentForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<StudentFormData>();

  const { data: student } = useQuery({
    queryKey: ['student', id],
    queryFn: () => (id ? studentService.getById(id) : null),
    enabled: !!id,
    onSuccess: (data: Student | null) => {
      if (data) {
        form.setFieldsValue({
          ...data,
          dateOfBirth: dayjs(data.dateOfBirth),
        });
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: StudentFormData) => {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth,
      };
      return studentService.create(formattedValues);
    },
    onSuccess: () => {
      message.success('Student created successfully');
      navigate('/students');
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: () => {
      message.error('Failed to create student');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: StudentFormData) => {
      const formattedValues = {
        ...values,
        dateOfBirth: values.dateOfBirth,
      };
      return id ? studentService.update(id, formattedValues) : Promise.reject('No ID provided');
    },
    onSuccess: () => {
      message.success('Student updated successfully');
      navigate('/students');
      queryClient.invalidateQueries({ queryKey: ['students'] });
    },
    onError: () => {
      message.error('Failed to update student');
    },
  });

  const onFinish = (values: StudentFormData) => {
    if (id) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Edit Student' : 'Create New Student'}
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: 'active',
          gender: 'other',
        }}
      >
        <Form.Item
          name="name"
          label="Full Name"
          rules={[{ required: true, message: 'Please enter student name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please enter email' },
            { type: 'email', message: 'Please enter a valid email' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="mssv"
          label="Student ID"
          rules={[{ required: true, message: 'Please enter student ID' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone Number"
          rules={[{ required: true, message: 'Please enter phone number' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="dateOfBirth"
          label="Date of Birth"
          rules={[{ required: true, message: 'Please select date of birth' }]}
        >
          <DatePicker format="YYYY-MM-DD" />
        </Form.Item>

        <Form.Item
          name="gender"
          label="Gender"
          rules={[{ required: true, message: 'Please select gender' }]}
        >
          <Select>
            <Option value="male">Male</Option>
            <Option value="female">Female</Option>
            <Option value="other">Other</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="address"
          label="Address"
          rules={[{ required: true, message: 'Please enter address' }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end space-x-4">
            <Button onClick={() => navigate('/students')}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {id ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default StudentForm; 