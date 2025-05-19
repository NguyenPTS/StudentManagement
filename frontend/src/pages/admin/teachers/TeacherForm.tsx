import { Form, Input, Button, Select, message } from 'antd';
import { useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import teacherService from '../../../services/teacherService';

interface TeacherFormData {
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
}

const TeacherForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { id } = useParams();

  useEffect(() => {
    if (id) {
      const fetchTeacher = async () => {
        try {
          const teacher = await teacherService.getById(id);
          form.setFieldsValue({
            name: teacher.name,
            email: teacher.email,
            phone: teacher.phone,
            status: teacher.status,
          });
        } catch (error) {
          message.error('Failed to fetch teacher details');
          console.error('Error fetching teacher:', error);
        }
      };
      fetchTeacher();
    }
  }, [id, form]);

  const onFinish = async (values: TeacherFormData) => {
    try {
      if (id) {
        await teacherService.update(id, values);
        message.success('Teacher updated successfully');
      } else {
        const teacherData = {
          ...values,
          role: 'teacher' as const,
          emailVerified: false,
        };
        await teacherService.create(teacherData);
        message.success('Teacher created successfully');
      }
      navigate('/admin/teachers');
    } catch (error) {
      message.error('Failed to save teacher');
      console.error('Error saving teacher:', error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: '0 auto', padding: '24px' }}>
      <h2>{id ? 'Edit Teacher' : 'Create Teacher'}</h2>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{ status: 'active' }}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true, message: 'Please input teacher name!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="email"
          label="Email"
          rules={[
            { required: true, message: 'Please input email!' },
            { type: 'email', message: 'Please enter a valid email!' }
          ]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="phone"
          label="Phone"
          rules={[{ pattern: /^\+?[\d\s-]+$/, message: 'Please enter a valid phone number!' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status!' }]}
        >
          <Select>
            <Select.Option value="active">Active</Select.Option>
            <Select.Option value="inactive">Inactive</Select.Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <Button type="primary" htmlType="submit">
            {id ? 'Update' : 'Create'}
          </Button>
          <Button 
            style={{ marginLeft: 8 }} 
            onClick={() => navigate('/admin/teachers')}
          >
            Cancel
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default TeacherForm; 