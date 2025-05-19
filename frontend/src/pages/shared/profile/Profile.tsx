import { Form, Input, Button, message, Card, Avatar } from 'antd';
import { useAuth } from '../../../context/AuthContext';
import { useState } from 'react';
import { UserOutlined } from '@ant-design/icons';

interface ProfileFormData {
  name: string;
  email: string;
  phone?: string;
  currentPassword?: string;
  newPassword?: string;
  confirmPassword?: string;
}

const Profile = () => {
  const { user, updateProfile } = useAuth();
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: ProfileFormData) => {
    try {
      setLoading(true);
      await updateProfile(values);
      message.success('Profile updated successfully');
    } catch (error) {
      message.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <Card>
        <div className="text-center mb-6">
          <Avatar size={64} icon={<UserOutlined />} />
          <h1 className="text-2xl font-bold mt-4">{user?.name}</h1>
          <p className="text-gray-500">{user?.role}</p>
        </div>

        <Form
          form={form}
          layout="vertical"
          onFinish={onFinish}
          initialValues={{
            name: user?.name,
            email: user?.email,
            phone: user?.phone,
          }}
        >
          <Form.Item
            name="name"
            label="Name"
            rules={[{ required: true, message: 'Please input your name!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Please input your email!' },
              { type: 'email', message: 'Please enter a valid email!' }
            ]}
          >
            <Input disabled />
          </Form.Item>

          <Form.Item
            name="phone"
            label="Phone"
            rules={[{ pattern: /^\+?[\d\s-]+$/, message: 'Please enter a valid phone number!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            name="currentPassword"
            label="Current Password"
            rules={[
              { 
                required: true,
                message: 'Please input your current password!',
                validateTrigger: 'onSubmit'
              }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="newPassword"
            label="New Password"
            rules={[
              { min: 6, message: 'Password must be at least 6 characters!' }
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm New Password"
            dependencies={['newPassword']}
            rules={[
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('newPassword') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords do not match!'));
                },
              }),
            ]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Update Profile
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
};

export default Profile; 