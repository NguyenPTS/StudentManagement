import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Form, Input, Button, Checkbox, message } from "antd";
import { UserOutlined, LockOutlined, GoogleOutlined, FacebookOutlined } from "@ant-design/icons";
import userService from "../../services/userService";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    try {
      setLoading(true);
      const response = await userService.login(values);
      
      // Lưu thông tin người dùng
      localStorage.setItem("token", response.token);
      localStorage.setItem("userRole", response.user.role);
      localStorage.setItem("userStatus", response.user.status);
      
      // Cập nhật context
      login(response.user);
      
      // Chuyển hướng dựa vào role
      if (response.user.role === "admin") {
        navigate("/admin");
      } else if (response.user.role === "teacher") {
        navigate("/teacher");
      } else {
        message.error("Vai trò không được hỗ trợ");
      }
    } catch (error: any) {
      if (error.response?.data?.message) {
        message.error(error.response.data.message);
      } else {
        message.error("Đăng nhập thất bại. Vui lòng thử lại.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-3/4 max-w-6xl bg-white p-12 rounded-xl shadow-xl">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left side - Form */}
          <div className="space-y-8">
            <div>
              <h2 className="text-4xl font-extrabold text-gray-900 mb-2">
                Đăng nhập vào hệ thống
              </h2>
              <p className="text-lg text-gray-600">
                Hoặc{" "}
                <Link
                  to="/auth/register"
                  className="font-medium text-blue-600 hover:text-blue-500"
                >
                  đăng ký tài khoản mới
                </Link>
              </p>
            </div>
            <Form
              name="login"
              initialValues={{ remember: true }}
              onFinish={onFinish}
              layout="vertical"
              size="large"
              className="space-y-6"
            >
              <Form.Item
                name="email"
                rules={[
                  { required: true, message: "Vui lòng nhập email!" },
                  { type: "email", message: "Email không hợp lệ!" },
                ]}
              >
                <Input
                  prefix={<UserOutlined />}
                  placeholder="Email"
                  className="h-14 text-lg"
                />
              </Form.Item>

              <Form.Item
                name="password"
                rules={[{ required: true, message: "Vui lòng nhập mật khẩu!" }]}
              >
                <Input.Password
                  prefix={<LockOutlined />}
                  placeholder="Mật khẩu"
                  className="h-14 text-lg"
                />
              </Form.Item>

              <Form.Item>
                <div className="flex items-center justify-between">
                  <Form.Item name="remember" valuePropName="checked" noStyle>
                    <Checkbox className="text-lg">Ghi nhớ đăng nhập</Checkbox>
                  </Form.Item>

                  <Link
                    to="/auth/forgot-password"
                    className="text-lg font-medium text-blue-600 hover:text-blue-500"
                  >
                    Quên mật khẩu?
                  </Link>
                </div>
              </Form.Item>

              <Form.Item>
                <Button
                  type="primary"
                  htmlType="submit"
                  className="w-full h-14 text-xl"
                  loading={loading}
                >
                  Đăng nhập
                </Button>
              </Form.Item>
            </Form>

            <div className="space-y-4">
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-300" />
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-2 bg-white text-gray-500 text-lg">
                    Hoặc đăng nhập với
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Button
                  className="w-full h-14 text-lg"
                  icon={<GoogleOutlined className="text-xl" />}
                >
                  Google
                </Button>
                <Button
                  className="w-full h-14 text-lg"
                  icon={<FacebookOutlined className="text-xl" />}
                >
                  Facebook
                </Button>
              </div>
            </div>
          </div>

          {/* Right side - Image or Info */}
          <div className="hidden md:block bg-blue-50 rounded-lg p-8 flex items-center justify-center">
            <div className="text-center">
              <img 
                src="/images/3094352.jpg"
                alt="Login" 
                className="w-full max-w-md mx-auto mb-8"
              />
              <h3 className="text-2xl font-bold text-gray-900 mb-4">
                Chào mừng đến với Student Management
              </h3>
              <p className="text-lg text-gray-600">
                Hệ thống quản lý sinh viên toàn diện, giúp bạn theo dõi và quản lý thông tin sinh viên một cách hiệu quả.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

