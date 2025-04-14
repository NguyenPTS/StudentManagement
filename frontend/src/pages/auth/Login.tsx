import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Form, Input, Button, message, Typography, Divider } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from '@ant-design/icons';
import { useAuth } from "../../context/AuthContext";
import userService from "../../services/userService";
import SakuraEffect from "../../components/effects/SakuraEffect";
import LoadingSpinner from "../../components/effects/LoadingSpinner";

const { Title, Text } = Typography;

const Login = () => {
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();
  const [form] = Form.useForm();

  // Lấy email đã lưu từ localStorage khi component mount
  useEffect(() => {
    const savedEmail = localStorage.getItem('lastEmail');
    if (savedEmail) {
      form.setFieldsValue({ email: savedEmail });
    }
  }, [form]);

  const onFinish = async (values: { email: string; password: string }) => {
    try {
      setLoading(true);
      console.log('Đang gọi API đăng nhập...');
      
      const response = await userService.login({
        email: values.email,
        password: values.password
      });
      console.log('Response từ API:', response);
      
      // Kiểm tra trạng thái tài khoản
      if (response.user.status !== 'active') {
        const errorMessage = response.user.status === 'blocked' 
          ? 'Tài khoản của bạn đã bị khóa. Vui lòng liên hệ quản trị viên.'
          : 'Tài khoản của bạn chưa được kích hoạt. Vui lòng liên hệ quản trị viên.';
        message.error(errorMessage);
        return;
      }
      
      // Lưu token, role và email
      localStorage.setItem('token', response.token);
      localStorage.setItem('userRole', response.user.role);
      localStorage.setItem('lastEmail', values.email); // Lưu email để sử dụng lần sau
      console.log('Đã lưu token, role và email');
      
      // Cập nhật context với thông tin user
      login(response.user);
      console.log('Đã cập nhật context user');
      
      message.success('Đăng nhập thành công');
      
      // Chuyển trang dựa vào role của user
      console.log('Đang chuyển trang...');
      const redirectPath = response.user.role === 'admin' 
        ? '/admin'
        : response.user.role === 'teacher'
        ? '/teacher'
        : '/student';
      console.log('Redirect path:', redirectPath);
      navigate(redirectPath, { replace: true });
      
    } catch (error: any) {
      console.error('Lỗi đăng nhập:', error);
      // Xử lý các loại lỗi khác nhau
      if (error.response?.status === 403) {
        message.error(error.response.data.message || 'Tài khoản không thể truy cập');
      } else if (error.response?.status === 404) {
        message.error('Tài khoản không tồn tại');
      } else if (error.response?.status === 400) {
        message.error('Email hoặc mật khẩu không đúng');
      } else {
        message.error('Đăng nhập thất bại. Vui lòng thử lại sau.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center relative overflow-hidden">
      {/* Background div with image and gradient */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{
          backgroundImage: 'url(/images/background.jpg)',
          backgroundPosition: 'center 40%'
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-br from-black/50 via-black/30 to-transparent" />
      </div>

      {/* Sakura Effect */}
      <SakuraEffect />

      {/* Loading Spinner */}
      {loading && <LoadingSpinner />}

      {/* Login form */}
      <div className="max-w-md w-full p-8 bg-white/90 backdrop-blur-md rounded-xl shadow-2xl relative z-10 transform transition-all duration-300 hover:shadow-[0_20px_50px_rgba(255,_59,_48,_0.5)]">
        <div className="text-center mb-8">
          <Title level={2} className="text-4xl font-bold text-gray-800 mb-2 font-japanese">Japanese</Title>
          <Text className="text-gray-600 text-lg block">富士吉田市</Text>
          <Text className="text-gray-600 block mt-2">Đăng nhập để tiếp tục</Text>
        </div>

        <Form
          form={form}
          name="login"
          onFinish={onFinish}
          layout="vertical"
          requiredMark={false}
          className="space-y-6"
        >
          <Form.Item
            name="email"
            label={<span className="text-gray-700 font-medium">Email</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' }
            ]}
          >
            <Input 
              size="large"
              prefix={<UserOutlined className="text-gray-400" />}
              placeholder="Nhập email của bạn"
              className="rounded-md border-2 border-gray-300 focus:border-red-500 hover:border-red-400 transition-colors"
            />
          </Form.Item>

          <Form.Item
            name="password"
            label={<span className="text-gray-700 font-medium">Mật khẩu</span>}
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu' }
            ]}
          >
            <Input.Password 
              size="large"
              prefix={<LockOutlined className="text-gray-400" />}
              placeholder="Nhập mật khẩu của bạn"
              className="rounded-md border-2 border-gray-300 focus:border-red-500 hover:border-red-400 transition-colors"
            />
          </Form.Item>

          <div className="flex justify-between items-center mb-4">
            <Form.Item name="remember" valuePropName="checked" className="mb-0">
              <div className="flex items-center">
                <input type="checkbox" className="mr-2" />
                <span className="text-sm text-gray-600">Ghi nhớ đăng nhập</span>
              </div>
            </Form.Item>
            <a href="#" className="text-sm text-red-600 hover:text-red-700">Quên mật khẩu?</a>
          </div>

          <Form.Item className="mb-0">
            <Button
              type="primary"
              htmlType="submit"
              size="large"
              loading={loading}
              className="w-full bg-red-600 hover:bg-red-700 focus:bg-red-700 border-red-600 rounded-md h-12 text-lg font-medium shadow-lg hover:shadow-red-500/50 transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Đăng nhập
            </Button>
          </Form.Item>
        </Form>

        <Divider className="my-6">Hoặc đăng nhập với</Divider>

        <div className="flex justify-center space-x-4">
          <Button 
            icon={<GoogleOutlined />} 
            size="large" 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
          />
          <Button 
            icon={<FacebookOutlined />} 
            size="large" 
            className="flex items-center justify-center w-12 h-12 rounded-full bg-white shadow-md hover:shadow-lg transition-all"
          />
        </div>

        <div className="mt-6 text-center">
          <Text className="text-gray-600">
            Chưa có tài khoản? <a href="/auth/register" className="text-red-600 hover:text-red-700 font-medium">Đăng ký ngay</a>
          </Text>
        </div>
      </div>
    </div>
  );
};

export default Login;

