import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography } from "antd";
import { UserOutlined, LockOutlined, MailOutlined } from '@ant-design/icons';
import userService from "../../services/userService";

const { Title, Text } = Typography;

const Register = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const [form] = Form.useForm();

  const onFinish = async (values: { name: string; email: string; password: string; confirmPassword: string }) => {
    try {
      setLoading(true);
      
      // Kiểm tra mật khẩu
      if (values.password !== values.confirmPassword) {
        message.error("Mật khẩu không khớp");
        return;
      }
      
      // Gọi API đăng ký
      await userService.register({
        name: values.name,
        email: values.email,
        password: values.password,
        role: 'teacher' // Mặc định đăng ký là giáo viên
      });
      
      message.success("Đăng ký thành công! Vui lòng đăng nhập.");
      navigate("/auth/login");
    } catch (error: any) {
      console.error('Lỗi đăng ký:', error);
      message.error(error.response?.data?.message || 'Đăng ký thất bại. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
        <div className="text-center">
          <Title level={2}>Đăng ký tài khoản</Title>
          <Text className="text-gray-500">Tạo tài khoản mới để bắt đầu</Text>
        </div>
        
        <Form
          form={form}
          name="register"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
        >
          <Form.Item
            name="name"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input 
              prefix={<UserOutlined />} 
              placeholder="Họ tên" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input 
              prefix={<MailOutlined />} 
              placeholder="Email" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="password"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' },
              { min: 6, message: 'Mật khẩu phải có ít nhất 6 ký tự' }
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Mật khẩu" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item
            name="confirmPassword"
            rules={[
              { required: true, message: 'Vui lòng xác nhận mật khẩu' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('Mật khẩu không khớp'));
                },
              }),
            ]}
          >
            <Input.Password 
              prefix={<LockOutlined />} 
              placeholder="Xác nhận mật khẩu" 
              size="large"
            />
          </Form.Item>
          
          <Form.Item>
            <Button 
              type="primary" 
              htmlType="submit" 
              className="w-full" 
              size="large"
              loading={loading}
            >
              Đăng ký
            </Button>
          </Form.Item>
        </Form>
        
        <div className="text-center">
          <Text>Đã có tài khoản? </Text>
          <Link to="/auth/login" className="text-blue-600 hover:text-blue-800">
            Đăng nhập
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
