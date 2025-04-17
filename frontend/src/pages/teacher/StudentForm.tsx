import React, { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { Form, Input, Button, DatePicker, message } from "antd";
import studentService from "../../services/studentService";
import type { Student, CreateStudentDTO } from "../../services/studentService";
import dayjs from "dayjs";

interface FormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  status: 'active' | 'inactive' | 'graduated';
  mssv?: string;
  classId?: string;
}

const StudentForm = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [student, setStudent] = useState<Student | null>(null);
  const [formData, setFormData] = useState<FormData>({
    name: "",
    email: "",
    phone: "",
    address: "",
    dateOfBirth: "",
    status: "active",
  });

  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      loadStudent();
    }
  }, [id]);

  useEffect(() => {
    if (student) {
      setFormData({
        name: student.name || "",
        email: student.email || "",
        phone: student.phone || "",
        address: student.address || "",
        dateOfBirth: student.dob ? dayjs(student.dob).format('YYYY-MM-DD') : "",
        status: student.status || "active",
        mssv: student.mssv || "",
        classId: student.class
      });
    }
  }, [student]);

  const loadStudent = async () => {
    try {
      const loadedStudent = await studentService.getById(id!);
      const formattedData: FormData = {
        name: loadedStudent.name,
        email: loadedStudent.email,
        phone: loadedStudent.phone || "",
        address: loadedStudent.address || "",
        dateOfBirth: loadedStudent.dob ? dayjs(loadedStudent.dob).format('YYYY-MM-DD') : "",
        status: loadedStudent.status,
        mssv: loadedStudent.mssv || "",
        classId: loadedStudent.class
      };

      setStudent(loadedStudent);
      setFormData(formattedData);
    } catch (error: any) {
      console.error("Error loading student:", error);
      message.error(error.message || "Không thể tải thông tin sinh viên");
    }
  };

  const validateField = (name: string, value: string | undefined) => {
    if (!value) return "Trường này là bắt buộc";

    switch (name) {
      case "name":
        return !value.trim() ? "Vui lòng nhập họ tên sinh viên" : "";
      case "email":
        if (!value.trim()) return "Vui lòng nhập email sinh viên";
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value))
          return "Email không hợp lệ";
        return "";
      case "phone":
        if (!value.trim()) return "Vui lòng nhập số điện thoại sinh viên";
        if (!/^[0-9]{10}$/.test(value))
          return "Số điện thoại phải có 10 chữ số";
        return "";
      case "address":
        return !value.trim() ? "Vui lòng nhập địa chỉ sinh viên" : "";
      case "dateOfBirth":
        return !value ? "Vui lòng nhập ngày sinh" : "";
      default:
        return "";
    }
  };

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    if (name === 'classId') {
      setFormData(prev => ({
        ...prev,
        classId: value
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }

    // Validate field on change
    const error = validateField(name, value);
    setFieldErrors((prev) => ({
      ...prev,
      [name]: error,
    }));

    // Clear global error when user starts typing
    if (error) setError("");
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.name) newErrors.name = "Vui lòng nhập tên sinh viên";
    if (!formData.email) newErrors.email = "Vui lòng nhập email";
    if (!formData.phone) newErrors.phone = "Vui lòng nhập số điện thoại";
    if (!formData.address) newErrors.address = "Vui lòng nhập địa chỉ";
    if (!formData.dateOfBirth) newErrors.dateOfBirth = "Vui lòng nhập ngày sinh";
    if (!formData.mssv) newErrors.mssv = "Vui lòng nhập mã số sinh viên";
    if (!formData.classId) newErrors.classId = "Vui lòng nhập tên lớp";
    return newErrors;
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const errors = validateForm();
      if (Object.keys(errors).length > 0) {
        setFieldErrors(errors);
        setError("Vui lòng điền đầy đủ thông tin bắt buộc");
        return;
      }

      if (!formData.classId) {
        setError("Vui lòng chọn lớp cho sinh viên");
        return;
      }

      // Transform data to match server expectations
      const studentData: CreateStudentDTO = {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
        dob: dayjs(formData.dateOfBirth).toISOString(),
        class: formData.classId,  // Now we know it's not undefined
        status: formData.status === 'graduated' ? 'inactive' : formData.status,
        mssv: formData.mssv
      };

      console.log("[StudentForm] Submitting data:", studentData);

      if (id) {
        await studentService.update(id, studentData);
        message.success("Cập nhật sinh viên thành công");
      } else {
        await studentService.create(studentData);
        message.success("Thêm sinh viên thành công");
      }
      navigate("/teacher/students");
    } catch (error: any) {
      console.error("[StudentForm] Error submitting form:", error);
      const errorMessage = error.response?.data?.message || error.message || "Có lỗi xảy ra khi lưu thông tin sinh viên";
      message.error(errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  if (loading && id) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-gray-50 py-8"
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white rounded-lg shadow-lg p-6 sm:p-8">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {id ? "Cập nhật sinh viên" : "Thêm sinh viên mới"}
            </h1>
            <Button
              onClick={() => navigate("/teacher")}
              className="bg-gray-100 text-gray-700 hover:bg-gray-200"
            >
              Quay lại
            </Button>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-red-50 border-l-4 border-red-400 p-4 mb-6"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-red-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-red-700">{error}</p>
                </div>
              </div>
            </motion.div>
          )}

          {success && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-green-50 border-l-4 border-green-400 p-4 mb-6"
            >
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg
                    className="h-5 w-5 text-green-400"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div className="ml-3">
                  <p className="text-sm text-green-700">{success}</p>
                </div>
              </div>
            </motion.div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-medium text-gray-700"
                >
                  Họ và tên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                  placeholder="Nhập họ và tên sinh viên"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    fieldErrors.name
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                />
                {fieldErrors.name && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.name}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-gray-700"
                >
                  Email <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@email.com"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    fieldErrors.email
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                />
                {fieldErrors.email && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.email}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="phone"
                  className="block text-sm font-medium text-gray-700"
                >
                  Số điện thoại <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="0123456789"
                  pattern="[0-9]{10}"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    fieldErrors.phone
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                />
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.phone}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="dateOfBirth"
                  className="block text-sm font-medium text-gray-700"
                >
                  Ngày sinh <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  id="dateOfBirth"
                  name="dateOfBirth"
                  value={formData.dateOfBirth ? dayjs(formData.dateOfBirth) : null}
                  onChange={(date) => {
                    setFormData(prev => ({
                      ...prev,
                      dateOfBirth: date ? date.format('YYYY-MM-DD') : '',
                    }));
                    setFieldErrors(prev => ({
                      ...prev,
                      dateOfBirth: date ? '' : 'Vui lòng nhập ngày sinh',
                    }));
                  }}
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    fieldErrors.dateOfBirth
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                />
                {fieldErrors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.dateOfBirth}
                  </p>
                )}
              </div>

              <div>
                <label
                  htmlFor="mssv"
                  className="block text-sm font-medium text-gray-700"
                >
                  Mã số sinh viên <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  id="mssv"
                  name="mssv"
                  value={formData.mssv}
                  onChange={handleChange}
                  required
                  placeholder="Nhập mã số sinh viên"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    fieldErrors.mssv
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                />
                {fieldErrors.mssv && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.mssv}</p>
                )}
              </div>

              <div>
                <label
                  htmlFor="classId"
                  className="block text-sm font-medium text-gray-700"
                >
                  Lớp
                </label>
                <input
                  type="text"
                  id="classId"
                  name="classId"
                  value={formData.classId}
                  onChange={handleChange}
                  placeholder="Nhập tên lớp"
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
                />
              </div>

              <div className="sm:col-span-2">
                <label
                  htmlFor="address"
                  className="block text-sm font-medium text-gray-700"
                >
                  Địa chỉ <span className="text-red-500">*</span>
                </label>
                <textarea
                  id="address"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  rows={3}
                  placeholder="Nhập địa chỉ sinh viên"
                  className={`mt-1 block w-full rounded-md shadow-sm sm:text-sm ${
                    fieldErrors.address
                      ? "border-red-300 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-indigo-500 focus:ring-indigo-500"
                  }`}
                />
                {fieldErrors.address && (
                  <p className="mt-1 text-sm text-red-600">
                    {fieldErrors.address}
                  </p>
                )}
              </div>

              <div>
                <label className="block text-gray-700 text-sm font-bold mb-2">
                  Trạng thái
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleChange}
                  className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                >
                  <option value="active">Đang học</option>
                  <option value="inactive">Nghỉ học</option>
                  <option value="graduated">Đã tốt nghiệp</option>
                </select>
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-6">
              <Button onClick={() => navigate("/teacher")}>Hủy</Button>
              <Button 
                type="primary" 
                onClick={handleSubmit}
                loading={loading}
                disabled={loading}
              >
                {id ? "Cập nhật" : "Tạo mới"}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </motion.div>
  );
};

export default StudentForm;
