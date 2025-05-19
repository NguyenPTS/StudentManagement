import React from 'react';
import { Form, Input, Button, Select, DatePicker, message } from 'antd';
import { useNavigate, useParams } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import classService from '../../../../services/classService';
import teacherService from '../../../../services/teacherService';
import { Class } from '../../../../types/class';
import { Teacher } from '../../../../types/teacher';
import dayjs, { Dayjs } from 'dayjs';

const { Option } = Select;
const { TextArea } = Input;

interface ClassFormData {
  name: string;
  code: string;
  description: string;
  teacherId: string;
  schedule: {
    dayOfWeek: number;
    startTime: Dayjs;
    endTime: Dayjs;
  };
  semester: number;
  status: 'active' | 'inactive';
  maxStudents: number;
  academicYear: string;
  subject: string;
}

const ClassForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const queryClient = useQueryClient();
  const [form] = Form.useForm<ClassFormData>();

  const { data: teachers } = useQuery({
    queryKey: ['teachers'],
    queryFn: () => teacherService.getAll(),
  });

  const { data: classData } = useQuery({
    queryKey: ['class', id],
    queryFn: () => (id ? classService.getById(id) : null),
    enabled: !!id,
    onSuccess: (data: Class | null) => {
      if (data) {
        form.setFieldsValue({
          ...data,
          schedule: {
            ...data.schedule,
            startTime: dayjs(data.schedule.startTime, 'HH:mm'),
            endTime: dayjs(data.schedule.endTime, 'HH:mm'),
          },
        });
      }
    },
  });

  const createMutation = useMutation({
    mutationFn: (values: ClassFormData) => {
      const formattedValues = {
        ...values,
        schedule: {
          ...values.schedule,
          startTime: values.schedule.startTime.format('HH:mm'),
          endTime: values.schedule.endTime.format('HH:mm'),
        },
      };
      return classService.create(formattedValues);
    },
    onSuccess: () => {
      message.success('Class created successfully');
      navigate('/classes');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    onError: () => {
      message.error('Failed to create class');
    },
  });

  const updateMutation = useMutation({
    mutationFn: (values: ClassFormData) => {
      const formattedValues = {
        ...values,
        schedule: {
          ...values.schedule,
          startTime: values.schedule.startTime.format('HH:mm'),
          endTime: values.schedule.endTime.format('HH:mm'),
        },
      };
      return id ? classService.update(id, formattedValues) : Promise.reject('No ID provided');
    },
    onSuccess: () => {
      message.success('Class updated successfully');
      navigate('/classes');
      queryClient.invalidateQueries({ queryKey: ['classes'] });
    },
    onError: () => {
      message.error('Failed to update class');
    },
  });

  const onFinish = (values: ClassFormData) => {
    if (id) {
      updateMutation.mutate(values);
    } else {
      createMutation.mutate(values);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">
        {id ? 'Edit Class' : 'Create New Class'}
      </h1>
      <Form
        form={form}
        layout="vertical"
        onFinish={onFinish}
        initialValues={{
          status: 'active',
          maxStudents: 40,
          semester: 1,
        }}
      >
        <Form.Item
          name="name"
          label="Class Name"
          rules={[{ required: true, message: 'Please enter class name' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="code"
          label="Class Code"
          rules={[{ required: true, message: 'Please enter class code' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
          rules={[{ required: true, message: 'Please enter description' }]}
        >
          <TextArea rows={4} />
        </Form.Item>

        <Form.Item
          name="subject"
          label="Subject"
          rules={[{ required: true, message: 'Please enter subject' }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="teacherId"
          label="Teacher"
          rules={[{ required: true, message: 'Please select a teacher' }]}
        >
          <Select>
            {teachers?.map((teacher: Teacher) => (
              <Option key={teacher.id} value={teacher.id}>
                {teacher.name}
              </Option>
            ))}
          </Select>
        </Form.Item>

        <Form.Item
          name={['schedule', 'dayOfWeek']}
          label="Day of Week"
          rules={[{ required: true, message: 'Please select day of week' }]}
        >
          <Select>
            <Option value={1}>Monday</Option>
            <Option value={2}>Tuesday</Option>
            <Option value={3}>Wednesday</Option>
            <Option value={4}>Thursday</Option>
            <Option value={5}>Friday</Option>
            <Option value={6}>Saturday</Option>
            <Option value={0}>Sunday</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name={['schedule', 'startTime']}
          label="Start Time"
          rules={[{ required: true, message: 'Please select start time' }]}
        >
          <DatePicker.TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item
          name={['schedule', 'endTime']}
          label="End Time"
          rules={[{ required: true, message: 'Please select end time' }]}
        >
          <DatePicker.TimePicker format="HH:mm" />
        </Form.Item>

        <Form.Item
          name="semester"
          label="Semester"
          rules={[{ required: true, message: 'Please enter semester' }]}
        >
          <Select>
            <Option value={1}>Semester 1</Option>
            <Option value={2}>Semester 2</Option>
            <Option value={3}>Semester 3</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="academicYear"
          label="Academic Year"
          rules={[{ required: true, message: 'Please select academic year' }]}
        >
          <Select>
            <Option value="2023">2023</Option>
            <Option value="2024">2024</Option>
          </Select>
        </Form.Item>

        <Form.Item
          name="maxStudents"
          label="Maximum Students"
          rules={[{ required: true, message: 'Please enter maximum number of students' }]}
        >
          <Input type="number" min={1} />
        </Form.Item>

        <Form.Item
          name="status"
          label="Status"
          rules={[{ required: true, message: 'Please select status' }]}
        >
          <Select>
            <Option value="active">Active</Option>
            <Option value="inactive">Inactive</Option>
          </Select>
        </Form.Item>

        <Form.Item>
          <div className="flex justify-end space-x-4">
            <Button onClick={() => navigate('/classes')}>Cancel</Button>
            <Button type="primary" htmlType="submit">
              {id ? 'Update' : 'Create'}
            </Button>
          </div>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ClassForm; 