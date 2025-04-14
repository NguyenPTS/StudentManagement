import { Form, Input, Select, Button, message } from "antd";
import { useForm, Controller, SubmitHandler } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import studentService from "../../services/studentService";
import classService from "../../services/classService";
import teacherService from "../../services/teacherService";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  status: z.enum(["active", "inactive"]),
  classId: z.string().optional(),
  teacherId: z.string().optional(),
});

type StudentFormData = z.infer<typeof formSchema>;

interface Class {
  id: string;
  name: string;
}

interface Teacher {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'teacher';
  status: 'active' | 'inactive';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

const StudentForm = () => {
  const [form] = Form.useForm();
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  const { control, handleSubmit, formState: { errors } } = useForm<StudentFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      status: "active",
    },
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [classesData, teachersData] = await Promise.all([
          classService.getAll(),
          teacherService.getAll(),
        ]);
        setClasses(classesData);
        setTeachers(teachersData);
      } catch (error) {
        message.error("Failed to load form data");
      }
    };
    fetchData();
  }, []);

  const onSubmit: SubmitHandler<StudentFormData> = async (data) => {
    try {
      setLoading(true);
      await studentService.create(data);
      message.success("Student created successfully");
      form.resetFields();
    } catch (error) {
      message.error("Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      onFinish={handleSubmit(onSubmit)}
      layout="vertical"
      className="max-w-lg mx-auto p-6"
    >
      <Form.Item
        label="Name"
        name="name"
        rules={[{ required: true, message: "Please input student name!" }]}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        name="email"
        rules={[
          { required: true, message: "Please input student email!" },
          { type: "email", message: "Please enter a valid email!" },
        ]}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Password"
        name="password"
        rules={[{ required: true, message: "Please input password!" }]}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => <Input.Password {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Phone"
        name="phone"
        rules={[{ required: true, message: "Please input phone number!" }]}
      >
        <Controller
          name="phone"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Address"
        name="address"
        rules={[{ required: true, message: "Please input address!" }]}
      >
        <Controller
          name="address"
          control={control}
          render={({ field }) => <Input.TextArea {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Class"
        name="classId"
      >
        <Controller
          name="classId"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Select a class">
              {classes.map((cls) => (
                <Select.Option key={cls.id} value={cls.id}>
                  {cls.name}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label="Teacher"
        name="teacherId"
      >
        <Controller
          name="teacherId"
          control={control}
          render={({ field }) => (
            <Select {...field} placeholder="Select a teacher">
              {teachers.map((teacher) => (
                <Select.Option key={teacher._id} value={teacher._id}>
                  {teacher.name}
                </Select.Option>
              ))}
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label="Status"
        name="status"
        rules={[{ required: true, message: "Please select status!" }]}
      >
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select {...field}>
              <Select.Option value="active">Active</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item>
        <Button type="primary" htmlType="submit" loading={loading} block>
          Create Student
        </Button>
      </Form.Item>
    </Form>
  );
};

export default StudentForm;
