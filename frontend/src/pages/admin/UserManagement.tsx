import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, Form, Input, Select, message, Popconfirm, Switch, Tooltip, Alert } from 'antd';
import { EditOutlined, DeleteOutlined, PlusOutlined, LockOutlined, UnlockOutlined, KeyOutlined, UserOutlined } from '@ant-design/icons';
import userService, { User, CreateUserDTO, UpdateUserDTO, ResetPasswordDTO } from '../../services/userService';

const { Option } = Select;

const UserManagement: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [form] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();

  const fetchUsers = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Kiểm tra token
      const token = localStorage.getItem('token');
      console.log('Token in UserManagement:', token);
      
      if (!token) {
        setError('Không tìm thấy token xác thực. Vui lòng đăng nhập lại.');
        return;
      }
      
      const data = await userService.getAll();
      console.log('Fetched users:', data);
      
      if (Array.isArray(data)) {
        console.log('User data structure:', data.map(user => ({
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          status: user.status
        })));
        setUsers(data);
        setFilteredUsers(data);
      } else {
        console.error('Invalid data format received:', data);
        setError('Dữ liệu người dùng không hợp lệ');
      }
    } catch (error: any) {
      console.error('Error fetching users:', error);
      setError(error.message || 'Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleAdd = () => {
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status
    });
    setModalVisible(true);
  };

  const handleDelete = async (id: string) => {
    try {
      await userService.delete(id);
      message.success('Xóa người dùng thành công');
      fetchUsers();
    } catch (error: any) {
      message.error(error.message || 'Không thể xóa người dùng');
    }
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        await userService.update(editingUser._id, values as UpdateUserDTO);
        message.success('Cập nhật người dùng thành công');
      } else {
        const createData: CreateUserDTO = {
          ...values,
          password: values.password || '123456', // Default password
        };
        await userService.create(createData);
        message.success('Tạo người dùng thành công');
      }
      setModalVisible(false);
      fetchUsers();
    } catch (error: any) {
      message.error(error.message || 'Không thể lưu thông tin người dùng');
    }
  };

  const handleResetPassword = async () => {
    try {
      const values = await resetPasswordForm.validateFields();
      const data: ResetPasswordDTO = {
        email: editingUser!.email,
        otp: values.otp,
        newPassword: values.newPassword,
      };
      await userService.resetPassword(data);
      message.success('Đặt lại mật khẩu thành công');
      setResetPasswordModalVisible(false);
    } catch (error: any) {
      message.error(error.message || 'Không thể đặt lại mật khẩu');
    }
  };

  const handleToggleStatus = async (user: User) => {
    try {
      if (!user._id) {
        message.error('Không thể thay đổi trạng thái: ID người dùng không hợp lệ');
        return;
      }

      const newStatus = user.status === 'active' ? 'inactive' : 'active';
      await userService.toggleStatus(user._id, newStatus);
      message.success(`Đã ${newStatus === 'active' ? 'mở khóa' : 'khóa'} tài khoản thành công`);
      fetchUsers();
    } catch (error: any) {
      message.error(error.message || 'Không thể thay đổi trạng thái người dùng');
    }
  };

  const columns = [
    {
      title: 'Tên',
      dataIndex: 'name',
      key: 'name',
    },
    {
      title: 'Email',
      dataIndex: 'email',
      key: 'email',
    },
    {
      title: 'Vai trò',
      dataIndex: 'role',
      key: 'role',
      render: (role: string) => role === 'admin' ? 'Quản trị viên' : 'Giáo viên',
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={status === 'active' ? 'text-green-600' : 'text-red-600'}>
          {status === 'active' ? 'Hoạt động' : 'Đã khóa'}
        </span>
      ),
    },
    {
      title: 'Thao tác',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button
            type="text"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Sửa
          </Button>
          <Button
            type="text"
            icon={<KeyOutlined />}
            onClick={() => {
              setEditingUser(record);
              resetPasswordForm.resetFields();
              setResetPasswordModalVisible(true);
            }}
          >
            Đặt lại mật khẩu
          </Button>
          <Button
            type="text"
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleToggleStatus(record)}
          >
            {record.status === 'active' ? 'Khóa' : 'Mở khóa'}
          </Button>
          <Popconfirm
            title="Bạn có chắc chắn muốn xóa người dùng này?"
            onConfirm={() => handleDelete(record._id)}
            okText="Có"
            cancelText="Không"
          >
            <Button type="text" danger icon={<DeleteOutlined />}>
              Xóa
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-bold">Quản lý người dùng</h1>
        <Button type="primary" onClick={handleAdd}>
          Thêm người dùng
        </Button>
      </div>

      {error && (
        <Alert
          message="Lỗi"
          description={error}
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Table
        columns={columns}
        dataSource={users}
        rowKey={(record) => record._id || record.email}
        loading={loading}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Tổng số ${total} người dùng`,
        }}
      />

      <Modal
        title={editingUser ? 'Sửa người dùng' : 'Thêm người dùng'}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => setModalVisible(false)}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Họ tên"
            rules={[{ required: true, message: 'Vui lòng nhập họ tên' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: 'Vui lòng nhập email' },
              { type: 'email', message: 'Email không hợp lệ' },
            ]}
          >
            <Input disabled={!!editingUser} />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: 'Vui lòng nhập mật khẩu' }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: 'Vui lòng chọn vai trò' }]}
          >
            <Select>
              <Option value="admin">Quản trị viên</Option>
              <Option value="teacher">Giáo viên</Option>
            </Select>
          </Form.Item>
          {editingUser && (
            <Form.Item
              name="status"
              label="Trạng thái"
              rules={[{ required: true, message: 'Vui lòng chọn trạng thái' }]}
            >
              <Select>
                <Option value="active">Hoạt động</Option>
                <Option value="inactive">Đã khóa</Option>
              </Select>
            </Form.Item>
          )}
        </Form>
      </Modal>

      <Modal
        title="Đặt lại mật khẩu"
        open={resetPasswordModalVisible}
        onOk={handleResetPassword}
        onCancel={() => setResetPasswordModalVisible(false)}
      >
        <Form form={resetPasswordForm} layout="vertical">
          <Form.Item
            name="otp"
            label="Mã OTP"
            rules={[{ required: true, message: 'Vui lòng nhập mã OTP' }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="newPassword"
            label="Mật khẩu mới"
            rules={[
              { required: true, message: 'Vui lòng nhập mật khẩu mới' },
              { min: 8, message: 'Mật khẩu phải có ít nhất 8 ký tự' },
            ]}
          >
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement; 