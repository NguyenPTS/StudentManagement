import { Form, Input, Button, Select, Switch, Card, message } from 'antd';
import { useState } from 'react';

interface SystemSettings {
  systemName: string;
  emailNotifications: boolean;
  gradeScale: 'percentage' | '4.0' | '10.0';
  academicYear: string;
  semester: string;
}

const Settings = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: SystemSettings) => {
    try {
      setLoading(true);
      // TODO: Implement settings update API
      console.log('Settings updated:', values);
      message.success('Settings updated successfully');
    } catch (error) {
      message.error('Failed to update settings');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">System Settings</h1>
      <div className="max-w-2xl">
        <Card>
          <Form
            form={form}
            layout="vertical"
            onFinish={onFinish}
            initialValues={{
              systemName: 'Student Management System',
              emailNotifications: true,
              gradeScale: 'percentage',
              academicYear: '2023-2024',
              semester: '1',
            }}
          >
            <Form.Item
              name="systemName"
              label="System Name"
              rules={[{ required: true, message: 'Please enter system name' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="emailNotifications"
              label="Email Notifications"
              valuePropName="checked"
            >
              <Switch />
            </Form.Item>

            <Form.Item
              name="gradeScale"
              label="Grade Scale"
              rules={[{ required: true, message: 'Please select grade scale' }]}
            >
              <Select>
                <Select.Option value="percentage">Percentage (0-100)</Select.Option>
                <Select.Option value="4.0">4.0 Scale</Select.Option>
                <Select.Option value="10.0">10.0 Scale</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item
              name="academicYear"
              label="Academic Year"
              rules={[{ required: true, message: 'Please enter academic year' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="semester"
              label="Current Semester"
              rules={[{ required: true, message: 'Please enter semester' }]}
            >
              <Select>
                <Select.Option value="1">Semester 1</Select.Option>
                <Select.Option value="2">Semester 2</Select.Option>
                <Select.Option value="3">Semester 3</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item>
              <Button type="primary" htmlType="submit" loading={loading}>
                Save Settings
              </Button>
            </Form.Item>
          </Form>
        </Card>
      </div>
    </div>
  );
};

export default Settings; 