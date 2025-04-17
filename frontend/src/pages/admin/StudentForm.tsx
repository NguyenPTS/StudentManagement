import { Form, Input, Button, message, DatePicker } from "antd";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useState, useEffect } from "react";
import studentService, { CreateStudentDTO } from "../../services/studentService";
import classService from "../../services/classService";
import { Class } from "../../types/class";
import teacherService from "../../services/teacherService";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../../components/ui/select";
import dayjs from "dayjs";
import { Student, StudentFormData } from "../../types/student";

const formSchema = z.object({
  name: z.string().min(1, "Name is required"),
  email: z.string().email("Invalid email address").optional(),
  password: z.string().min(6, "Password must be at least 6 characters").optional(),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  status: z.enum(["active", "inactive", "graduated"]),
  mssv: z.string().optional(),
  classId: z.string().optional(),
  teacherId: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

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
  const [classes, setClasses] = useState<Class[]>([]);
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const [loading, setLoading] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      phone: "",
      address: "",
      dateOfBirth: "",
      status: "active",
      mssv: "",
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

  const onSubmit = async (data: FormData) => {
    try {
      setLoading(true);
      if (!data.classId) {
        message.error("Vui lòng chọn lớp cho sinh viên");
        return;
      }

      const studentData: CreateStudentDTO = {
        name: data.name,
        email: data.email,
        phone: data.phone,
        address: data.address,
        dob: dayjs(data.dateOfBirth).toISOString(),
        class: data.classId,
        status: data.status,
        mssv: data.mssv,
        teacherId: data.teacherId
      };

      await studentService.create(studentData);
      message.success("Student created successfully");
    } catch (error) {
      console.error("Error creating student:", error);
      message.error("Failed to create student");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="max-w-lg mx-auto p-6">
      <Form.Item
        label="Student ID"
        validateStatus={errors.mssv ? "error" : ""}
        help={errors.mssv?.message}
      >
        <Controller
          name="mssv"
          control={control}
          render={({ field }) => <Input {...field} placeholder="Enter student ID" />}
        />
      </Form.Item>

      <Form.Item
        label="Name"
        validateStatus={errors.name ? "error" : ""}
        help={errors.name?.message}
      >
        <Controller
          name="name"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Email"
        validateStatus={errors.email ? "error" : ""}
        help={errors.email?.message}
      >
        <Controller
          name="email"
          control={control}
          render={({ field }) => <Input {...field} disabled className="bg-gray-100" />}
        />
      </Form.Item>

      <Form.Item
        label="Password"
        validateStatus={errors.password ? "error" : ""}
        help={errors.password?.message}
      >
        <Controller
          name="password"
          control={control}
          render={({ field }) => <Input.Password {...field} placeholder="Leave blank to keep current password" />}
        />
      </Form.Item>

      <Form.Item
        label="Date of Birth"
        validateStatus={errors.dateOfBirth ? "error" : ""}
        help={errors.dateOfBirth?.message}
      >
        <Controller
          name="dateOfBirth"
          control={control}
          render={({ field }) => (
            <DatePicker 
              value={field.value ? dayjs(field.value) : null}
              style={{ width: '100%' }}
              format="YYYY-MM-DD"
              onChange={(date) => field.onChange(date ? date.format('YYYY-MM-DD') : '')}
            />
          )}
        />
      </Form.Item>

      <Form.Item
        label="Phone"
        validateStatus={errors.phone ? "error" : ""}
        help={errors.phone?.message}
      >
        <Controller
          name="phone"
          control={control}
          render={({ field }) => <Input {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Address"
        validateStatus={errors.address ? "error" : ""}
        help={errors.address?.message}
      >
        <Controller
          name="address"
          control={control}
          render={({ field }) => <Input.TextArea {...field} />}
        />
      </Form.Item>

      <Form.Item
        label="Status"
        validateStatus={errors.status ? "error" : ""}
        help={errors.status?.message}
      >
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="inactive">Inactive</SelectItem>
                <SelectItem value="graduated">Graduated</SelectItem>
              </SelectContent>
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label="Class"
        validateStatus={errors.classId ? "error" : ""}
        help={errors.classId?.message}
      >
        <Controller
          name="classId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a class" />
              </SelectTrigger>
              <SelectContent>
                {classes.map((cls) => (
                  <SelectItem key={cls.id} value={cls.id}>
                    {cls.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Form.Item>

      <Form.Item
        label="Teacher"
        validateStatus={errors.teacherId ? "error" : ""}
        help={errors.teacherId?.message}
      >
        <Controller
          name="teacherId"
          control={control}
          render={({ field }) => (
            <Select onValueChange={field.onChange} value={field.value}>
              <SelectTrigger>
                <SelectValue placeholder="Select a teacher" />
              </SelectTrigger>
              <SelectContent>
                {teachers.map((teacher) => (
                  <SelectItem key={teacher._id} value={teacher._id}>
                    {teacher.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        />
      </Form.Item>

      <Button type="primary" htmlType="submit" loading={loading} block>
        Create Student
      </Button>
    </form>
  );
};

export default StudentForm;
