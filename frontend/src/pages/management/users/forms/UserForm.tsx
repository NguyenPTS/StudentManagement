import React from 'react';
import { Form, Input, Select, Button, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import userService, { UpdateUserDTO } from '../../../../services/userService';

const { Option } = Select;

type UserRole = 'admin' | 'teacher' | 'student';
type UserStatus = 'active' | 'inactive' | 'blocked';

interface UserFormData extends UpdateUserDTO {
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
}

const UserForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<UserFormData>();

  const { data: user } = useQuery({
    queryKey: ['user', id],
    queryFn: () => (id ? userService.getById(id) : null),
    enabled: !!id,
    onSettled: (data) => {
      if (data) {
        form.setFieldsValue(data);
      }
    },
  });

  const updateMutation = useMutation({
    mutationFn: (data: UserFormData) => {
      if (!id) throw new Error('No ID provided');
      return userService.update(id, data);
    },
    onSuccess: () => {
      message.success('Cập nhật người dùng thành công');
      navigate('/users');
      queryClient.invalidateQueries({ queryKey: ['users'] });
    },
    onError: () => {
      message.error('Không thể cập nhật người dùng');
    },
  });

  const onFinish = (values: UserFormData) => {
    if (id) {
      updateMutation.mutate(values);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Chỉnh sửa người dùng' : 'Thêm người dùng mới'}
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'active' as UserStatus }}
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
              {id ? 'Cập nhật' : 'Tạo mới'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default UserForm; 