import React, { useState, useEffect } from 'react';
import { Table, Button, Space, Modal, message, Tag } from 'antd';
import { EditOutlined, LockOutlined, UnlockOutlined, DeleteOutlined, KeyOutlined, ExclamationCircleOutlined, PlusOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import userService from '../../services/userService';
import type { User } from '../../services/userService';
import { useQueryClient } from '@tanstack/react-query';
import axios from 'axios';
import { ColumnsType } from 'antd/es/table';

const { confirm } = Modal;

const UserList: React.FC = () => {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const fetchUsers = async () => {
    try {
      console.log('Bắt đầu fetch danh sách users...');
      setLoading(true);
      const data = await userService.getAll();
      console.log('Đã nhận được danh sách users:', data);
      setUsers(data);
    } catch (error) {
      console.error('Lỗi khi fetch users:', error);
      message.error('Không thể tải danh sách người dùng');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleResetPassword = async (userId: string) => {
    console.log('Bắt đầu reset password cho user:', userId);
    confirm({
      title: 'Bạn có chắc chắn muốn đặt lại mật khẩu?',
      icon: <ExclamationCircleOutlined />,
      content: 'Mật khẩu mới sẽ được gửi qua email của người dùng',
      async onOk() {
        try {
          console.log('Đang gửi yêu cầu reset password...');
          await userService.resetPassword(userId);
          console.log('Đã reset password thành công');
          message.success('Đã gửi mật khẩu mới qua email');
        } catch (error) {
          console.error('Lỗi khi reset password:', error);
          message.error('Không thể đặt lại mật khẩu');
        }
      },
    });
  };

  const handleToggleStatus = async (user: User) => {
    try {
      console.log('=== Toggle User Status ===');
      console.log('1. User details:', {
        id: user._id,
        name: user.name,
        currentStatus: user.status
      });

      let newStatus: 'active' | 'inactive' | 'blocked';
      switch (user.status) {
        case 'active':
          newStatus = 'inactive';
          break;
        case 'inactive':
          newStatus = 'blocked';
          break;
        case 'blocked':
          newStatus = 'active';
          break;
        default:
          newStatus = 'active';
      }

      console.log('2. Attempting to update status:', {
        from: user.status,
        to: newStatus
      });

      await userService.updateStatus(user._id, newStatus);
      console.log('3. Status updated successfully');

      message.success(`Đã ${getStatusMessage(newStatus)} tài khoản thành công`);
      fetchUsers();
    } catch (error) {
      console.error('4. Error in handleToggleStatus:', error);
      if (axios.isAxiosError(error)) {
        console.error('5. Error details:', {
          status: error.response?.status,
          message: error.response?.data?.message,
          url: error.config?.url
        });
      }
      message.error('Có lỗi xảy ra khi thay đổi trạng thái tài khoản');
    }
  };

  const getStatusMessage = (status: string): string => {
    switch (status) {
      case 'active':
        return 'kích hoạt';
      case 'inactive':
        return 'vô hiệu hóa';
      case 'blocked':
        return 'khóa';
      default:
        return 'thay đổi trạng thái';
    }
  };

  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active':
        return 'text-green-600';
      case 'inactive':
        return 'text-yellow-600';
      case 'blocked':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  const getStatusText = (status: string): string => {
    switch (status) {
      case 'active':
        return 'Hoạt động';
      case 'inactive':
        return 'Không hoạt động';
      case 'blocked':
        return 'Đã khóa';
      default:
        return 'Không xác định';
    }
  };

  const handleDelete = async (userId: string) => {
    console.log('Bắt đầu xóa tài khoản:', userId);
    confirm({
      title: 'Bạn có chắc chắn muốn xóa tài khoản này?',
      icon: <ExclamationCircleOutlined />,
      content: 'Hành động này không thể hoàn tác',
      async onOk() {
        try {
          console.log('Đang xóa tài khoản...');
          await userService.delete(userId);
          console.log('Đã xóa tài khoản thành công');
          message.success('Đã xóa tài khoản thành công');
          fetchUsers();
        } catch (error) {
          console.error('Lỗi khi xóa tài khoản:', error);
          message.error('Không thể xóa tài khoản');
        }
      },
    });
  };

  const handleAddUser = () => {
    console.log('Chuyển hướng đến trang thêm người dùng mới');
    navigate('/admin/users/create');
  };

  const handleEditUser = (userId: string) => {
    console.log('Chuyển hướng đến trang chỉnh sửa người dùng:', userId);
    navigate(`/admin/users/${userId}/edit`);
  };

  const columns: ColumnsType<User> = [
    {
      title: 'Tên tài khoản',
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
      render: (role: string) => (
        <Tag color={role === 'admin' ? 'red' : 'blue'}>
          {role === 'admin' ? 'Quản trị viên' : 'Giáo viên'}
        </Tag>
      ),
    },
    {
      title: 'Trạng thái',
      dataIndex: 'status',
      key: 'status',
      render: (status: string) => (
        <span className={getStatusColor(status)}>
          {getStatusText(status)}
        </span>
      ),
    },
    {
      title: 'Hành động',
      key: 'action',
      render: (_: any, record: User) => (
        <Space size="middle">
          <Button 
            type="link" 
            icon={<EditOutlined />}
            title="Chỉnh sửa"
            onClick={() => handleEditUser(record._id)}
          >
            Sửa
          </Button>
          <Button
            type="link"
            icon={<KeyOutlined />}
            onClick={() => handleResetPassword(record._id)}
            title="Đặt lại mật khẩu"
          >
            Reset
          </Button>
          <Button
            type="link"
            icon={record.status === 'active' ? <LockOutlined /> : <UnlockOutlined />}
            onClick={() => handleToggleStatus(record)}
            title={record.status === 'active' ? 'Khóa tài khoản' : 'Mở khóa tài khoản'}
          >
            {record.status === 'active' ? 'Khóa' : 'Mở khóa'}
          </Button>
          <Button
            type="link"
            danger
            icon={<DeleteOutlined />}
            onClick={() => handleDelete(record._id)}
            title="Xóa tài khoản"
          >
            Xóa
          </Button>
        </Space>
      ),
    },
  ];

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Quản lý tài khoản người dùng</h1>
        <Button 
          type="primary"
          icon={<PlusOutlined />}
          onClick={handleAddUser}
        >
          Thêm người dùng mới
        </Button>
      </div>

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={loading}
      />
    </div>
  );
};

export default UserList; 