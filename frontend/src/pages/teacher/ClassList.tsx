import React, { useState, useEffect } from 'react';
import { Table, Button, Card, Modal, Form, Input, message, Space, Tag } from 'antd';
import { PlusOutlined, EditOutlined, DeleteOutlined, TeamOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';

interface Class {
  id: string;
  name: string;
  description: string;
  studentCount: number;
  createdAt: string;
  updatedAt: string;
}

const ClassList: React.FC = () => {
  const [classes, setClasses] = useState<Class[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [form] = Form.useForm();
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const navigate = useNavigate();

  // Mock data - Thay thế bằng API call thực tế
  const fetchClasses = async () => {
    setLoading(true);
    try {
      // Giả lập dữ liệu
      const mockClasses: Class[] = [
        {
          id: '1',
          name: 'Lớp A1',
          description: 'Lớp chuyên Toán',
          studentCount: 30,
          createdAt: '2023-01-01',
          updatedAt: '2023-01-01',
        },
        {
          id: '2',
          name: 'Lớp A2',
          description: 'Lớp chuyên Lý',
          studentCount: 25,
          createdAt: '2023-01-02',
          updatedAt: '2023-01-02',
        },
        {
          id: '3',
          name: 'Lớp A3',
          description: 'Lớp chuyên Hóa',
          studentCount: 28,
          createdAt: '2023-01-03',
          updatedAt: '2023-01-03',
        },
      ];
      
      // Giả lập delay
      setTimeout(() => {
        setClasses(mockClasses);
        setLoading(false);
      }, 500);
    } catch (error) {
      console.error('Error fetching classes:', error);
      message.error('Có lỗi xảy ra khi tải danh sách lớp');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClasses();
  }, []);

  const handleAddClass = () => {
    setEditingClass(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEditClass = (record: Class) => {
    setEditingClass(record);
    form.setFieldsValue(record);
    setModalVisible(true);
  };

  const handleDeleteClass = (id: string) => {
    Modal.confirm({
      title: 'Xác nhận xóa',
      content: 'Bạn có chắc chắn muốn xóa lớp học này?',
      okText: 'Xóa',
      okType: 'danger',
      cancelText: 'Hủy',
      onOk: async () => {
        try {
          // Giả lập API call
          setTimeout(() => {
            setClasses(classes.filter(c => c.id !== id));
            message.success('Xóa lớp học thành công');
          }, 500);
        } catch (error) {
          console.error('Error deleting class:', error);
          message.error('Có lỗi xảy ra khi xóa lớp học');
        }
      },
    });
  };

  const handleViewStudents = (classId: string) => {
    navigate(`/teacher/classes/${classId}/students`);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      
      if (editingClass) {
        // Giả lập API call để cập nhật lớp
        setTimeout(() => {
          setClasses(classes.map(c => 
            c.id === editingClass.id ? { ...c, ...values } : c
          ));
          message.success('Cập nhật lớp học thành công');
          setModalVisible(false);
        }, 500);
      } else {
        // Giả lập API call để tạo lớp mới
        const newClass: Class = {
          id: Date.now().toString(),
          ...values,
          studentCount: 0,
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        };
        
        setTimeout(() => {
          setClasses([...classes, newClass]);
          message.success('Tạo lớp học thành công');
          setModalVisible(false);
        }, 500);
      }
    } catch (error) {
      console.error('Error saving class:', error);
    }
  };

  const columns = [
    {
      title: 'Tên lớp',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Mô tả',
      dataIndex: 'description',
      key: 'description',
    },
    {
      title: 'Số học sinh',
      dataIndex: 'studentCount',
      key: 'studentCount',
      render: (count: number) => (
        <Tag color="blue">{count} học sinh</Tag>
      ),
    },
    {
      title: 'Ngày tạo',
      dataIndex: 'createdAt',
      key: 'createdAt',
      render: (date: string) => new Date(date).toLocaleDateString('vi-VN'),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: Class) => (
        <Space size="middle">
          <Button 
            type="primary" 
            icon={<TeamOutlined />}
            onClick={() => handleViewStudents(record.id)}
          >
            Xem học sinh
          </Button>
          <Button 
            type="default" 
            icon={<EditOutlined />}
            onClick={() => handleEditClass(record)}
          >
            Sửa
          </Button>
          <Button 
            type="text" 
            danger 
            icon={<DeleteOutlined />}
            onClick={() => handleDeleteClass(record.id)}
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <Card
        title="Quản lý lớp học"
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />}
            onClick={handleAddClass}
          >
            Thêm lớp mới
          </Button>
        }
      >
        <Table
          columns={columns}
          dataSource={classes}
          rowKey="id"
          loading={loading}
        />
      </Card>

      <Modal
        title={editingClass ? 'Sửa lớp học' : 'Thêm lớp học mới'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
        okText={editingClass ? 'Cập nhật' : 'Thêm'}
        cancelText="Hủy"
      >
        <Form
          form={form}
          layout="vertical"
        >
          <Form.Item
            name="name"
            label="Tên lớp"
            rules={[{ required: true, message: 'Vui lòng nhập tên lớp' }]}
          >
            <Input placeholder="Nhập tên lớp" />
          </Form.Item>
          <Form.Item
            name="description"
            label="Mô tả"
          >
            <Input.TextArea placeholder="Nhập mô tả lớp học" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ClassList; 