import React, { useState, useEffect } from 'react';
import { Form, Input, Select, Button, Card, message } from 'antd';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import userService from '../../services/userService';
import type { User } from '../../services/userService';

const { Option } = Select;

const UserForm: React.FC = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [loading, setLoading] = useState(false);
  const [initialValues, setInitialValues] = useState<Partial<User>>({});

  // Xác định mode từ URL
  const isEditing = location.pathname.includes('/edit');
  const mode = isEditing ? 'edit' : 'add';

  useEffect(() => {
    if (isEditing && id) {
      console.log('Bắt đầu fetch thông tin user để chỉnh sửa:', id);
      fetchUser();
    }
  }, [id, isEditing]);

  const fetchUser = async () => {
    try {
      console.log('Đang lấy thông tin user...');
      const user = await userService.getById(id!);
      console.log('Đã nhận được thông tin user:', user);
      setInitialValues(user);
      form.setFieldsValue({
        name: user.name,
        email: user.email,
        role: user.role,
      });
    } catch (error) {
      console.error('Lỗi khi lấy thông tin user:', error);
      message.error('Không thể tải thông tin người dùng');
      navigate('/admin/users');
    }
  };

  const handleSubmit = async (values: any) => {
    try {
      console.log('Bắt đầu xử lý form:', values);
      setLoading(true);
      
      if (isEditing) {
        console.log('Đang cập nhật thông tin user:', id);
        await userService.update(id!, values);
        console.log('Đã cập nhật thông tin user thành công');
        message.success('Cập nhật thông tin người dùng thành công');
      } else {
        console.log('Đang tạo user mới...');
        await userService.create(values);
        console.log('Đã tạo user mới thành công');
        message.success('Tạo người dùng mới thành công');
      }
      
      navigate('/admin/users');
    } catch (error) {
      console.error('Lỗi khi xử lý form:', error);
      message.error(isEditing ? 'Không thể cập nhật thông tin người dùng' : 'Không thể tạo người dùng mới');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <Card title={isEditing ? 'Chỉnh sửa thông tin người dùng' : 'Tạo tài khoản mới'}>
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          initialValues={initialValues}
        >
          <Form.Item
            name="name"
            label="Họ tên"
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
            <Input 
              placeholder="Nhập địa chỉ email" 
              disabled={isEditing && initialValues.emailVerified}
            />
          </Form.Item>

          {!isEditing && (
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

          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select placeholder="Chọn vai trò">
              <Option value="admin">Quản trị viên</Option>
              <Option value="teacher">Giáo viên</Option>
            </Select>
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading}>
              {isEditing ? 'Cập nhật' : 'Tạo tài khoản'}
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

export default UserForm; 