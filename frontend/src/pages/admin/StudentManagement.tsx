import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import studentService from "../../services/studentService";
import classService from "../../services/classService";
import teacherService from "../../services/teacherService";
import type { Student } from "../../services/studentService";
import type { Class } from "../../types/class";
import type { Teacher } from "../../services/teacherService";
import { Button } from "../../components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../../components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs";
import { Badge } from "../../components/ui/badge";
import { toast } from "../../components/ui/use-toast";

const StudentManagement = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [student, setStudent] = useState<Student | null>(null);
  const [classInfo, setClassInfo] = useState<Class | null>(null);
  const [teacher, setTeacher] = useState<Teacher | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (id) {
      loadStudentData();
    }
  }, [id]);

  const loadStudentData = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      setError("");
      
      // Load student data
      const studentData = await studentService.getById(id);
      setStudent(studentData);
      
      // Load class data if student has a class
      if (studentData.classDetails?.id) {
        try {
          const classData = await classService.getById(studentData.classDetails.id);
          setClassInfo(classData);
        } catch (err) {
          console.error("Error loading class:", err);
        }
      }
      
      // Load teacher data if student has a teacher
      if (studentData.teacher?.id) {
        try {
          const teacherData = await teacherService.getById(studentData.teacher.id);
          setTeacher(teacherData);
        } catch (err) {
          console.error("Error loading teacher:", err);
        }
      }
    } catch (err) {
      console.error("Error loading student:", err);
      setError("Không thể tải thông tin học sinh");
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin học sinh",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    navigate(`/admin/students/${id}/edit`);
  };

  const handleDelete = async () => {
    if (!id || !window.confirm("Bạn có chắc chắn muốn xóa học sinh này?")) {
      return;
    }
    
    try {
      await studentService.delete(id);
      toast({
        title: "Thành công",
        description: "Đã xóa học sinh thành công",
      });
      navigate("/admin/students");
    } catch (err) {
      console.error("Error deleting student:", err);
      toast({
        title: "Lỗi",
        description: "Không thể xóa học sinh",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="container mx-auto px-4 py-8">
        <Card>
          <CardHeader>
            <CardTitle>Lỗi</CardTitle>
          </CardHeader>
          <CardContent>
            <p>{error || "Không tìm thấy thông tin học sinh"}</p>
          </CardContent>
          <CardFooter>
            <Button onClick={() => navigate("/admin/students")}>
              Quay lại danh sách
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="container mx-auto px-4 py-8"
    >
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Quản lý học sinh: {student.name}
        </h1>
        <div className="flex space-x-2">
          <Button
            variant="outline"
            onClick={() => navigate("/admin/students")}
          >
            Quay lại
          </Button>
          <Button
            onClick={handleEdit}
          >
            Chỉnh sửa
          </Button>
          <Button
            variant="destructive"
            onClick={handleDelete}
          >
            Xóa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="info">Thông tin cơ bản</TabsTrigger>
          <TabsTrigger value="class">Thông tin lớp học</TabsTrigger>
          <TabsTrigger value="teacher">Thông tin giáo viên</TabsTrigger>
        </TabsList>
        
        <TabsContent value="info">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin cơ bản</CardTitle>
              <CardDescription>
                Thông tin chi tiết về học sinh
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Họ và tên</h3>
                  <p className="mt-1 text-lg">{student.name}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Email</h3>
                  <p className="mt-1 text-lg">{student.email}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Số điện thoại</h3>
                  <p className="mt-1 text-lg">{student.phone || "Không có"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Địa chỉ</h3>
                  <p className="mt-1 text-lg">{student.address || "Không có"}</p>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
                  <div className="mt-1">
                    <Badge variant={student.status === "active" ? "success" : "destructive"}>
                      {student.status === "active" ? "Đang học" : "Đã nghỉ học"}
                    </Badge>
                  </div>
                </div>
                
                <div>
                  <h3 className="text-sm font-medium text-gray-500">Ngày tạo</h3>
                  <p className="mt-1 text-lg">
                    {new Date(student.createdAt).toLocaleDateString("vi-VN")}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="class">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin lớp học</CardTitle>
              <CardDescription>
                Thông tin về lớp học của học sinh
              </CardDescription>
            </CardHeader>
            <CardContent>
              {classInfo ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Tên lớp</h3>
                    <p className="mt-1 text-lg">{classInfo.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Mã lớp</h3>
                    <p className="mt-1 text-lg">{classInfo.code}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Số học sinh</h3>
                    <p className="mt-1 text-lg">{classInfo.studentCount || 0}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Giáo viên chủ nhiệm</h3>
                    <p className="mt-1 text-lg">{classInfo.teacher?.name || "Chưa phân công"}</p>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Học sinh chưa được phân vào lớp nào</p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate(`/admin/students/${id}/edit`)}
                  >
                    Phân lớp
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="teacher">
          <Card>
            <CardHeader>
              <CardTitle>Thông tin giáo viên</CardTitle>
              <CardDescription>
                Thông tin về giáo viên phụ trách học sinh
              </CardDescription>
            </CardHeader>
            <CardContent>
              {teacher ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Họ và tên</h3>
                    <p className="mt-1 text-lg">{teacher.name}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Email</h3>
                    <p className="mt-1 text-lg">{teacher.email}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Số điện thoại</h3>
                    <p className="mt-1 text-lg">{teacher.phone || "Không có"}</p>
                  </div>
                  
                  <div>
                    <h3 className="text-sm font-medium text-gray-500">Trạng thái</h3>
                    <div className="mt-1">
                      <Badge variant={teacher.status === "active" ? "success" : "destructive"}>
                        {teacher.status === "active" ? "Đang làm việc" : "Đã nghỉ việc"}
                      </Badge>
                    </div>
                  </div>
                </div>
              ) : (
                <div className="text-center py-6">
                  <p className="text-gray-500">Học sinh chưa được phân công giáo viên phụ trách</p>
                  <Button
                    className="mt-4"
                    onClick={() => navigate(`/admin/students/${id}/edit`)}
                  >
                    Phân công giáo viên
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
};

export default StudentManagement; 