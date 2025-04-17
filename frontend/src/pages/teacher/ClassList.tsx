import React, { useState, useEffect, useCallback } from 'react';
import { 
  Table, 
  Button, 
  Card, 
  Modal, 
  Form, 
  Input, 
  Space, 
  Tag, 
  Typography, 
  Tooltip, 
  Select,
  Upload,
  message as antMessage
} from 'antd';
import { 
  PlusOutlined, 
  EditOutlined, 
  DeleteOutlined, 
  TeamOutlined, 
  InfoCircleOutlined, 
  SearchOutlined, 
  ReloadOutlined,
  UploadOutlined,
  DownloadOutlined,
  BellOutlined
} from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import { Class, ClassFilters, ClassStatistics, CreateClassDTO } from '../../types/class';
import classService from '../../services/classService';
import teacherService, { Teacher } from '../../services/teacherService';
import ClassPreview from '../../components/class/ClassPreview';

const { Title, Text } = Typography;
const { Option } = Select;

const ClassList: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [filteredClasses, setFilteredClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [previewVisible, setPreviewVisible] = useState(false);
  const [selectedClass, setSelectedClass] = useState<Class | null>(null);
  const [classStatistics, setClassStatistics] = useState<ClassStatistics | null>(null);
  const [form] = Form.useForm();
  const [filters, setFilters] = useState<ClassFilters>({});
  const [teachers, setTeachers] = useState<Teacher[]>([]);
  const navigate = useNavigate();
  const [createModalVisible, setCreateModalVisible] = useState(false);
  const [newClassData, setNewClassData] = useState<CreateClassDTO>({
    name: '',
    code: '',
    subject: '',
    teacherId: '',
    maxStudents: 30,
    academicYear: new Date().getFullYear().toString(),
    semester: 1,
    schedule: [
      {
        dayOfWeek: 1,
        startTime: '09:00',
        endTime: '10:30'
      }
    ],
    description: '',
    status: 'active'
  });

  // Fetch classes data
  const fetchClasses = useCallback(async () => {
    setLoading(true);
    try {
      const data = await classService.getAll(filters);
      setClasses(data);
      setFilteredClasses(data);
    } catch (error) {
      console.error('Error fetching classes:', error);
      antMessage.error('Có lỗi xảy ra khi tải danh sách lớp');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Fetch teachers data
  const fetchTeachers = useCallback(async () => {
    try {
      const response = await teacherService.getAll();
      console.log('Teacher response:', response); // Debug log
      if (Array.isArray(response)) {
        setTeachers(response);
      } else {
        console.error('Expected array of teachers but got:', response);
        setTeachers([]);
      }
    } catch (error) {
      console.error('Error fetching teachers:', error);
      antMessage.error('Có lỗi xảy ra khi tải danh sách giáo viên');
      setTeachers([]);
    }
  }, []);

  // Initial data loading
  useEffect(() => {
    fetchClasses();
    fetchTeachers();
  }, [fetchClasses, fetchTeachers]);

  // Handle preview class
  const handlePreviewClass = async (record: Class) => {
    if (!record || !record.id) {
      antMessage.error('Không thể xem chi tiết lớp học. ID lớp học không hợp lệ.');
      return;
    }
    setSelectedClass(record);
    try {
      const statistics = await classService.getStatistics(record.id);
      setClassStatistics(statistics);
      setPreviewVisible(true);
    } catch (error) {
      console.error('Error fetching class statistics:', error);
      antMessage.error('Có lỗi xảy ra khi tải thống kê lớp học');
    }
  };

  // Handle import students
  const handleImportStudents = async (file: File, classId: string) => {
    try {
      await classService.importStudents(classId, file);
      antMessage.success('Import danh sách học sinh thành công');
      fetchClasses();
    } catch (error) {
      console.error('Error importing students:', error);
      antMessage.error('Có lỗi xảy ra khi import danh sách học sinh');
    }
  };

  // Handle export class data
  const handleExportClass = async (classId: string) => {
    try {
      const blob = await classService.exportClassData(classId);
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `class-${classId}-data.xlsx`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting class data:', error);
      antMessage.error('Có lỗi xảy ra khi xuất dữ liệu lớp học');
    }
  };

  // Handle send notification
  const handleSendNotification = async (classId: string, message: string) => {
    try {
      await classService.sendNotification(classId, message);
      antMessage.success('Gửi thông báo thành công');
    } catch (error) {
      console.error('Error sending notification:', error);
      antMessage.error('Có lỗi xảy ra khi gửi thông báo');
    }
  };

  // Function to handle opening the create class modal
  const openCreateModal = () => {
    setCreateModalVisible(true);
  };

  // Function to handle closing the create class modal
  const closeCreateModal = () => {
    setCreateModalVisible(false);
    setNewClassData({
      name: '',
      code: '',
      subject: '',
      teacherId: '',
      maxStudents: 30,
      academicYear: new Date().getFullYear().toString(),
      semester: 1,
      schedule: [
        {
          dayOfWeek: 1,
          startTime: '09:00',
          endTime: '10:30'
        }
      ],
      description: '',
      status: 'active'
    });
  };

  // Function to handle form submission for creating a new class
  const handleCreateClass = async () => {
    try {
      await classService.create(newClassData);
      antMessage.success('Lớp học mới đã được tạo thành công');
      fetchClasses(); // Refresh the class list
      closeCreateModal();
    } catch (error) {
      console.error('Error creating class:', error);
      antMessage.error('Có lỗi xảy ra khi tạo lớp học mới');
    }
  };

  // Table columns
  const columns = [
    {
      title: 'Tên lớp',
      dataIndex: 'name',
      key: 'name',
      render: (text: string, record: Class) => (
        <div>
          <Text strong>{text}</Text>
          <div>
            <Text type="secondary" style={{ fontSize: '12px' }}>
              Mã: {record.code}
            </Text>
          </div>
        </div>
      ),
    },
    {
      title: 'Môn học',
      dataIndex: 'subject',
      key: 'subject',
    },
    {
      title: 'Năm học',
      dataIndex: 'academicYear',
      key: 'academicYear',
    },
    {
      title: 'Học kỳ',
      dataIndex: 'semester',
      key: 'semester',
    },
    {
      title: 'Sĩ số',
      key: 'students',
      render: (text: string, record: Class) => (
        <Tag color={record.studentCount >= record.maxStudents ? 'red' : 'blue'}>
          {record.studentCount}/{record.maxStudents}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <Tag color={
          status === 'active' ? 'green' : 
          status === 'completed' ? 'blue' : 
          'red'
        }>
          {status === 'active' ? 'Đang học' :
           status === 'completed' ? 'Đã kết thúc' :
           'Đã hủy'}
        </Tag>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Class) => (
        <Space size="middle">
          <Tooltip key={`preview-tooltip-${record.id}`} title="Xem chi tiết">
            <Button
              key={`preview-${record.id}`}
              type="text"
              icon={<InfoCircleOutlined />}
              onClick={() => handlePreviewClass(record)}
            />
          </Tooltip>
          <Tooltip key={`students-tooltip-${record.id}`} title="Danh sách học sinh">
            <Button
              key={`students-${record.id}`}
              type="text"
              icon={<TeamOutlined />}
              onClick={() => navigate(`/teacher/classes/${record.id}/students`)}
            />
          </Tooltip>
          <Tooltip key={`import-tooltip-${record.id}`} title="Import học sinh">
            <Upload
              key={`import-${record.id}`}
              showUploadList={false}
              beforeUpload={(file) => {
                handleImportStudents(file, record.id);
                return false;
              }}
            >
              <Button type="text" icon={<UploadOutlined />} />
            </Upload>
          </Tooltip>
          <Tooltip key={`export-tooltip-${record.id}`} title="Xuất dữ liệu">
            <Button
              key={`export-${record.id}`}
              type="text"
              icon={<DownloadOutlined />}
              onClick={() => handleExportClass(record.id)}
            />
          </Tooltip>
          <Tooltip key={`notify-tooltip-${record.id}`} title="Gửi thông báo">
            <Button
              key={`notify-${record.id}`}
              type="text"
              icon={<BellOutlined />}
              onClick={() => {
                Modal.confirm({
                  title: 'Gửi thông báo cho lớp',
                  content: (
                    <Input.TextArea
                      placeholder="Nhập nội dung thông báo"
                      onChange={(e) => {
                        Modal.confirm({
                          content: e.target.value,
                        });
                      }}
                    />
                  ),
                  onOk: (close) => {
                    const textArea = document.querySelector('.ant-modal-confirm-content textarea') as HTMLTextAreaElement;
                    const content = textArea?.value;
                    if (content) {
                      handleSendNotification(record.id, content);
                      close();
                    }
                  },
                });
              }}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title={
          <div className="flex items-center justify-between">
            <div>
              <Title level={4} style={{ margin: 0 }}>Quản lý lớp học</Title>
              <Text type="secondary">Quản lý thông tin các lớp học</Text>
            </div>
            <Button type="primary" icon={<PlusOutlined />} onClick={openCreateModal}>
              Thêm lớp học mới
            </Button>
          </div>
        }
        className="shadow-md"
      >
        <div className="mb-4 flex flex-wrap gap-4">
          <Input
            placeholder="Tìm kiếm theo tên hoặc mã lớp"
            prefix={<SearchOutlined />}
            style={{ width: 250 }}
            onChange={(e) => {
              const searchText = e.target.value.toLowerCase();
              const filtered = classes.filter(c => 
                c.name.toLowerCase().includes(searchText) ||
                c.code.toLowerCase().includes(searchText)
              );
              setFilteredClasses(filtered);
            }}
          />
          <Select
            placeholder="Năm học"
            style={{ width: 150 }}
            onChange={(value) => setFilters({ ...filters, academicYear: value })}
          >
            <Option key="2023-2024-year-filter" value="2023-2024">2023-2024</Option>
            <Option key="2024-2025-year-filter" value="2024-2025">2024-2025</Option>
          </Select>
          <Select
            placeholder="Học kỳ"
            style={{ width: 120 }}
            onChange={(value) => setFilters({ ...filters, semester: value })}
          >
            <Option key="semester-1-filter" value={1}>Học kỳ 1</Option>
            <Option key="semester-2-filter" value={2}>Học kỳ 2</Option>
          </Select>
          <Select
            placeholder="Trạng thái"
            style={{ width: 150 }}
            onChange={(value) => setFilters({ ...filters, status: value })}
          >
            <Option key="status-active-filter" value="active">Đang học</Option>
            <Option key="status-completed-filter" value="completed">Đã kết thúc</Option>
            <Option key="status-cancelled-filter" value="cancelled">Đã hủy</Option>
          </Select>
          <Button
            icon={<ReloadOutlined />}
            onClick={() => {
              setFilters({});
              fetchClasses();
            }}
          >
            Làm mới
          </Button>
        </div>

        <Table
          columns={columns}
          dataSource={filteredClasses}
          rowKey="id"
          loading={loading}
          pagination={{
            pageSize: 10,
            showSizeChanger: true,
            showTotal: (total) => `Tổng số ${total} lớp học`,
          }}
        />
      </Card>

      {selectedClass && classStatistics && (
        <ClassPreview
          class={selectedClass}
          visible={previewVisible}
          onClose={() => setPreviewVisible(false)}
          statistics={classStatistics}
        />
      )}

      <Modal
        title="Thêm lớp học mới"
        visible={createModalVisible}
        onCancel={closeCreateModal}
        onOk={handleCreateClass}
      >
        <Form layout="vertical">
          <Form.Item label="Tên lớp" required>
            <Input
              value={newClassData.name}
              onChange={(e) => setNewClassData({ ...newClassData, name: e.target.value })}
              placeholder="Nhập tên lớp"
            />
          </Form.Item>
          <Form.Item label="Mã lớp" required>
            <Input
              value={newClassData.code}
              onChange={(e) => setNewClassData({ ...newClassData, code: e.target.value })}
              placeholder="Nhập mã lớp"
            />
          </Form.Item>
          <Form.Item label="Môn học" required>
            <Input
              value={newClassData.subject}
              onChange={(e) => setNewClassData({ ...newClassData, subject: e.target.value })}
              placeholder="Nhập tên môn học"
            />
          </Form.Item>
          <Form.Item label="Giáo viên" required>
            <Select
              value={newClassData.teacherId}
              onChange={(value) => setNewClassData({ ...newClassData, teacherId: value })}
              placeholder="Chọn giáo viên"
            >
              {Array.isArray(teachers) && teachers.map((teacher, index) => (
                <Option key={teacher._id || `teacher-${index}`} value={teacher._id}>
                  {teacher.name}
                </Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item label="Sĩ số tối đa" required>
            <Input
              type="number"
              min={1}
              value={newClassData.maxStudents}
              onChange={(e) => setNewClassData({ ...newClassData, maxStudents: Number(e.target.value) })}
            />
          </Form.Item>
          <Form.Item label="Năm học" required>
            <Select
              value={newClassData.academicYear}
              onChange={(value) => setNewClassData({ ...newClassData, academicYear: value })}
            >
              <Option key="2023-2024-year-create" value="2023-2024">2023-2024</Option>
              <Option key="2024-2025-year-create" value="2024-2025">2024-2025</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Học kỳ" required>
            <Select
              value={newClassData.semester}
              onChange={(value) => setNewClassData({ ...newClassData, semester: Number(value) })}
            >
              <Option key="semester-1-create" value={1}>Học kỳ 1</Option>
              <Option key="semester-2-create" value={2}>Học kỳ 2</Option>
            </Select>
          </Form.Item>
          <Form.Item label="Lịch học" required>
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <Form.Item label="Thứ" className="mb-0">
                  <Select
                    value={newClassData.schedule[0].dayOfWeek}
                    onChange={(value) => setNewClassData({
                      ...newClassData,
                      schedule: [{
                        ...newClassData.schedule[0],
                        dayOfWeek: Number(value)
                      }]
                    })}
                  >
                    <Option key="schedule-monday" value={1}>Thứ 2</Option>
                    <Option key="schedule-tuesday" value={2}>Thứ 3</Option>
                    <Option key="schedule-wednesday" value={3}>Thứ 4</Option>
                    <Option key="schedule-thursday" value={4}>Thứ 5</Option>
                    <Option key="schedule-friday" value={5}>Thứ 6</Option>
                    <Option key="schedule-saturday" value={6}>Thứ 7</Option>
                    <Option key="schedule-sunday" value={0}>Chủ nhật</Option>
                  </Select>
                </Form.Item>
                <Form.Item label="Giờ bắt đầu" className="mb-0">
                  <Input
                    type="time"
                    value={newClassData.schedule[0].startTime}
                    onChange={(e) => setNewClassData({
                      ...newClassData,
                      schedule: [{
                        ...newClassData.schedule[0],
                        startTime: e.target.value
                      }]
                    })}
                  />
                </Form.Item>
                <Form.Item label="Giờ kết thúc" className="mb-0">
                  <Input
                    type="time"
                    value={newClassData.schedule[0].endTime}
                    onChange={(e) => setNewClassData({
                      ...newClassData,
                      schedule: [{
                        ...newClassData.schedule[0],
                        endTime: e.target.value
                      }]
                    })}
                  />
                </Form.Item>
              </div>
            </div>
          </Form.Item>
          <Form.Item label="Mô tả">
            <Input.TextArea
              value={newClassData.description}
              onChange={(e) => setNewClassData({ ...newClassData, description: e.target.value })}
              placeholder="Nhập mô tả lớp học"
            />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassList; 