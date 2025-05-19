import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../../../../services/userService';
import type { CreateUserDTO } from '../../../../services/userService';

const { Option } = Select;

const CreateUserForm: React.FC = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [form] = Form.useForm();

  const createMutation = useMutation({
    mutationFn: (data: CreateUserDTO) => userService.create(data),
    onSuccess: () => {
      message.success('Tạo người dùng thành công');
      navigate('/users');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Không thể tạo người dùng');
    },
  });

  const onFinish = (values: CreateUserDTO) => {
    createMutation.mutate(values);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Thêm người dùng mới</h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'active' }}
      >
        <Form.Item
          name="name"
          label="Tên"
          rules={[{ required: true, message: 'Vui lòng nhập tên' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Vui lòng nhập email' },
            { type: 'email', message: 'Email không hợp lệ' },
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="password"
          label="Mật khẩu"
          rules={[
            { required: true, message: 'Vui lòng nhập mật khẩu' },
            { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' },
          ]}
        >
          <Input.Password />
        </Form.Item>

        <Form.Item
          name="role"
          label="Vai trò"
          rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
        >
          <Select>
            <Option value="admin">Admin</Option>
            <Option value="teacher">Giáo viên</Option>
            <Option value="student">Sinh viên</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="status"
          label="Trạng thái"
          rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
        >
          <Select>
            <Option value="active">Hoạt động</Option>
            <Option value="inactive">Không hoạt động</Option>
            <Option value="blocked">Đã khóa</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end space-x-4">
            <Button onClick={() => navigate('/users')}>Hủy</Button>
            <Button type="primary" htmlType="submit">
              Tạo mới
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default CreateUserForm; 