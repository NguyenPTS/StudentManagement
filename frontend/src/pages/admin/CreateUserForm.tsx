import React, { useState } from 'react';
import { Form, Input, Select, Button, Card, message, Switch } from 'antd';
import { useNavigate } from 'react-router-dom';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import userService from '../../services/userService';
import type { CreateUserDTO } from '../../services/userService';

const { Option } = Select;

const CreateUserForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [loading, setLoading] = useState(false);
  const [autoGeneratePassword, setAutoGeneratePassword] = useState(true);

  const createUserMutation = useMutation({
    mutationFn: (data: CreateUserDTO) => userService.create(data),
    onSuccess: () => {
      message.success('Tạo người dùng thành công');
      queryClient.invalidateQueries({ queryKey: ['users'] });
      navigate('/admin/users');
    },
    onError: (error: any) => {
      message.error(error.response?.data?.message || 'Không thể tạo người dùng');
    }
  });

  const generatePassword = () => {
    const length = 12;
    const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
    let password = '';
    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * charset.length);
      password += charset[randomIndex];
    }
    form.setFieldsValue({ password });
  };

  const handleSubmit = async (values: any) => {
    try {
      setLoading(true);
      const userData: CreateUserDTO = {
        name: values.name,
        email: values.email,
        password: values.password,
        role: values.role,
      };
      await createUserMutation.mutateAsync(userData);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title="Tạo người dùng mới">
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={{
            role: 'teacher',
            status: 'active'
          }}
        >
          <Form.Item
            name="name"
            label="Họ tên người dùng"
            rules={[
              { required: true, message: 'Vui lòng nhập họ tên' },
              { min: 2, message: 'Họ tên phải có ít nhất 2 ký tự' }
            ]}
          >
            <Input placeholder="Nhập họ tên người dùng" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input placeholder="Nhập địa chỉ email" />
          </Form.Item>

          <Form.Item label="Tự động tạo mật khẩu">
            <Switch
              checked={autoGeneratePassword}
              onChange={(checked) => {
                setAutoGeneratePassword(checked);
                if (checked) {
                  generatePassword();
                } else {
                  form.setFieldsValue({ password: '' });
                }
              }}
            />
          </Form.Item>

          {!autoGeneratePassword && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[
                { required: true, message: 'Vui lòng nhập mật khẩu' },
                { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
              ]}
            >
              <Input.Password placeholder="Nhập mật khẩu" />
            </Form.Item>
          )}

          {autoGeneratePassword && (
            <Form.Item
              name="password"
              label="Mật khẩu tự động"
            >
              <Input.Password
                placeholder="Mật khẩu sẽ được tạo tự động"
                disabled
                addonAfter={
                  <Button type="link" onClick={generatePassword}>
                    Tạo mới
                  </Button>
                }
              />
            </Form.Item>
          )}

          <Form.Item
            name="role"
            label="Quyền"
            rules={[{ required: true, message: 'Vui lòng chọn quyền' }]}
          >
            <Select placeholder="Chọn quyền">
              <Option value="admin">Quản trị viên</Option>
              <Option value="teacher">Giáo viên</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              Tạo người dùng
            </Button>
            <Button 
              className="ml-2" 
              onClick={() => navigate('/admin/users')}
            >
              Hủy
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default CreateUserForm; 