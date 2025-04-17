import React, { useState } from "react";
import {
  Table,
  Button,
  Space,
  Modal,
  Form,
  Input,
  Select,
  message,
  Popconfirm,
  Alert,
  Tag,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  PlusOutlined,
  LockOutlined,
  UnlockOutlined,
  KeyOutlined,
  CheckCircleOutlined,
  PauseCircleOutlined,
  StopOutlined,
} from "@ant-design/icons";
import userService, {
  User,
  CreateUserDTO,
  UpdateUserDTO,
} from "../../services/userService";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";

const { Option } = Select;

type UserStatus = "active" | "inactive" | "blocked";

const UserManagement: React.FC = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const [resetPasswordModalVisible, setResetPasswordModalVisible] =
    useState(false);
  const [resetPasswordMethod, setResetPasswordMethod] = useState<
    "email" | "manual"
  >("email");
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [form] = Form.useForm();
  const [resetPasswordForm] = Form.useForm();
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  // Fetch users with React Query
  const {
    data: users = [],
    isLoading,
    error,
  } = useQuery({
    queryKey: ["users"],
    queryFn: userService.getAll,
  });

  // Create user mutation
  const createMutation = useMutation({
    mutationFn: (data: CreateUserDTO) => userService.create(data),
    onSuccess: () => {
      message.success("Tạo người dùng thành công");
      setModalVisible(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Không thể tạo người dùng"
      );
    },
  });

  // Update user mutation
  const updateMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: UpdateUserDTO }) =>
      userService.update(id, data),
    onSuccess: () => {
      message.success("Cập nhật người dùng thành công");
      setModalVisible(false);
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Không thể cập nhật người dùng");
    },
  });

  // Delete user mutation
  const deleteMutation = useMutation({
    mutationFn: (id: string) => userService.delete(id),
    onSuccess: () => {
      message.success("Xóa người dùng thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      message.error(error.message || "Không thể xóa người dùng");
    },
  });

  // Toggle status mutation
  const toggleStatusMutation = useMutation({
    mutationFn: (id: string) => {
      const user = users.find((u) => u._id === id);
      if (!user) throw new Error("User not found");
      return userService.updateStatus(
        id,
        user.status === "active" ? "blocked" : "active"
      );
    },
    onSuccess: () => {
      message.success("Thay đổi trạng thái tài khoản thành công");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message ||
          "Không thể thay đổi trạng thái tài khoản"
      );
    },
  });

  // Request password reset mutation
  const requestPasswordResetMutation = useMutation({
    mutationFn: (email: string) => userService.requestPasswordReset(email),
    onSuccess: () => {
      message.success("Đã gửi email đặt lại mật khẩu");
      setResetPasswordModalVisible(false);
      resetPasswordForm.resetFields();
    },
    onError: (error: any) => {
      message.error(error.message || "Không thể gửi yêu cầu đặt lại mật khẩu");
    },
  });

  // Reset password mutation
  const resetPasswordMutation = useMutation({
    mutationFn: (data: { id: string; password: string }) =>
      userService.resetPassword(data.id),
    onSuccess: () => {
      message.success("Đặt lại mật khẩu thành công");
      setResetPasswordModalVisible(false);
    },
    onError: (error: any) => {
      message.error(
        error.response?.data?.message || "Không thể đặt lại mật khẩu"
      );
    },
  });

  const handleAdd = () => {
    console.log("handleAdd called");
    setEditingUser(null);
    form.resetFields();
    setModalVisible(true);
    console.log("modalVisible set to true");
  };

  const handleEdit = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      name: user.name,
      email: user.email,
      role: user.role,
      status: user.status,
    });
    setModalVisible(true);
  };

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id);
  };

  const handleModalOk = async () => {
    try {
      const values = await form.validateFields();
      if (editingUser) {
        updateMutation.mutate({ id: editingUser._id, data: values });
      } else {
        createMutation.mutate(values);
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleResetPassword = (user: User) => {
    setEditingUser(user);
    resetPasswordForm.resetFields();
    setResetPasswordMethod("email");
    setResetPasswordModalVisible(true);
  };

  const handleResetPasswordSubmit = async () => {
    try {
      const values = await resetPasswordForm.validateFields();
      if (resetPasswordMethod === "email" && editingUser) {
        requestPasswordResetMutation.mutate(editingUser.email);
      } else if (resetPasswordMethod === "manual" && editingUser) {
        resetPasswordMutation.mutate({
          id: editingUser._id,
          password: values.newPassword,
        });
      }
    } catch (error) {
      console.error("Form validation failed:", error);
    }
  };

  const handleToggleStatus = (user: User) => {
    Modal.confirm({
      title: "Xác nhận thay đổi trạng thái",
      content: `Bạn có chắc chắn muốn ${
        user.status === "active" ? "khóa" : "mở khóa"
      } tài khoản này?`,
      okText: "Có",
      cancelText: "Không",
      onOk: () => toggleStatusMutation.mutate(user._id),
    });
  };

  const handleStatusChange = async (id: string, currentStatus: string) => {
    try {
      let newStatus: "active" | "inactive" | "blocked";
      switch (currentStatus) {
        case "active":
          newStatus = "inactive";
          break;
        case "inactive":
          newStatus = "blocked";
          break;
        case "blocked":
          newStatus = "active";
          break;
        default:
          newStatus = "active";
      }
      return userService.updateStatus(id, newStatus);
    } catch (error) {
      console.error("Error updating user status:", error);
      message.error("Có lỗi xảy ra khi cập nhật trạng thái người dùng");
      throw error;
    }
  };

  const getStatusColor = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "success";
      case "inactive":
        return "warning";
      case "blocked":
        return "error";
      default:
        return "default";
    }
  };

  const getStatusIcon = (status: UserStatus) => {
    switch (status) {
      case "active":
        return <CheckCircleOutlined />;
      case "inactive":
        return <PauseCircleOutlined />;
      case "blocked":
        return <StopOutlined />;
      default:
        return null;
    }
  };

  const getStatusText = (status: UserStatus) => {
    switch (status) {
      case "active":
        return "Hoạt động";
      case "inactive":
        return "Không hoạt động";
      case "blocked":
        return "Đã khóa";
      default:
        return "Không xác định";
    }
  };

  const columns = [
    {
      title: "Tên",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Vai trò",
      dataIndex: "role",
      key: "role",
      render: (role: string) =>
        role === "admin" ? "Quản trị viên" : "Giáo viên",
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      key: "status",
      render: (status: UserStatus, record: User) => (
        <Select
          value={status}
          onChange={(value: UserStatus) => {
            Modal.confirm({
              title: "Xác nhận thay đổi trạng thái",
              content: `Bạn có chắc chắn muốn chuyển sang trạng thái "${getStatusText(value)}"?`,
              okText: "Có",
              cancelText: "Không",
              onOk: () =>
                userService
                  .updateStatus(record._id, value)
                  .then(() => {
                    message.success("Đã cập nhật trạng thái");
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                  })
                  .catch((error) => {
                    message.error(
                      "Cập nhật thất bại: " +
                        (error?.response?.data?.message || error.message)
                    );
                  }),
            });
          }}
          style={{ width: 150 }}
          dropdownStyle={{ minWidth: 200 }}
        >
          <Select.Option value="active">
            <Space>
              <CheckCircleOutlined style={{ color: "#52c41a" }} />
              <span>Hoạt động</span>
            </Space>
          </Select.Option>
          <Select.Option value="inactive">
            <Space>
              <PauseCircleOutlined style={{ color: "#faad14" }} />
              <span>Không hoạt động</span>
            </Space>
          </Select.Option>
          <Select.Option value="blocked">
            <Space>
              <StopOutlined style={{ color: "#ff4d4f" }} />
              <span>Đã khóa</span>
            </Space>
          </Select.Option>
        </Select>
      ),
    },
    {
      title: "Thao tác",
      key: "action",
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
            onClick={() => handleResetPassword(record)}
          >
            Đặt lại mật khẩu
          </Button>
          <Select
            value={record.status}
            onChange={(value: UserStatus) => {
              Modal.confirm({
                title: "Xác nhận thay đổi trạng thái",
                content: `Bạn có chắc chắn muốn chuyển sang trạng thái "${getStatusText(value)}"?`,
                okText: "Có",
                cancelText: "Không",
                onOk: async () => {
                  try {
                    await userService.updateStatus(record._id, value);
                    message.success("Đã cập nhật trạng thái");
                    queryClient.invalidateQueries({ queryKey: ["users"] });
                  } catch (error: any) {
                    message.error(
                      "Cập nhật thất bại: " +
                        (error?.response?.data?.message || error.message)
                    );
                  }
                },
              });
            }}
            style={{ width: 130 }}
            dropdownStyle={{ minWidth: 200 }}
          >
            <Select.Option value="active">
              <Space>
                <CheckCircleOutlined style={{ color: "#52c41a" }} />
                <span>Hoạt động</span>
              </Space>
            </Select.Option>
            <Select.Option value="inactive">
              <Space>
                <PauseCircleOutlined style={{ color: "#faad14" }} />
                <span>Không hoạt động</span>
              </Space>
            </Select.Option>
            <Select.Option value="blocked">
              <Space>
                <StopOutlined style={{ color: "#ff4d4f" }} />
                <span>Đã khóa</span>
              </Space>
            </Select.Option>
          </Select>
          <Popconfirm
            title="Xác nhận xóa người dùng"
            description="Bạn có chắc chắn muốn xóa người dùng này?"
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
          Thêm người dùng mới
        </Button>
      </div>

      {error && (
        <Alert
          message="Lỗi"
          description={
            error instanceof Error
              ? error.message
              : "Không thể tải danh sách người dùng"
          }
          type="error"
          showIcon
          className="mb-4"
        />
      )}

      <Table
        columns={columns}
        dataSource={users}
        rowKey="_id"
        loading={isLoading}
      />

      <Modal
        title={editingUser ? "Chỉnh sửa người dùng" : "Thêm người dùng"}
        open={modalVisible}
        onOk={handleModalOk}
        onCancel={() => {
          console.log("Modal cancel clicked");
          setModalVisible(false);
        }}
        confirmLoading={createMutation.isPending || updateMutation.isPending}
      >
        <Form form={form} layout="vertical">
          <Form.Item
            name="name"
            label="Tên"
            rules={[{ required: true, message: "Vui lòng nhập tên" }]}
          >
            <Input />
          </Form.Item>
          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Vui lòng nhập email" },
              { type: "email", message: "Email không hợp lệ" },
            ]}
          >
            <Input />
          </Form.Item>
          {!editingUser && (
            <Form.Item
              name="password"
              label="Mật khẩu"
              rules={[{ required: true, message: "Vui lòng nhập mật khẩu" }]}
            >
              <Input.Password />
            </Form.Item>
          )}
          <Form.Item
            name="role"
            label="Vai trò"
            rules={[{ required: true, message: "Vui lòng chọn vai trò" }]}
          >
            <Select>
              <Option value="admin">Quản trị viên</Option>
              <Option value="teacher">Giáo viên</Option>
            </Select>
          </Form.Item>
          <Form.Item
            name="status"
            label="Trạng thái"
            rules={[{ required: true, message: "Vui lòng chọn trạng thái" }]}
          >
            <Select>
              <Option value="active">Hoạt động</Option>
              <Option value="blocked">Đã khóa</Option>
            </Select>
          </Form.Item>
        </Form>
      </Modal>

      <Modal
        title="Đặt lại mật khẩu"
        open={resetPasswordModalVisible}
        onOk={handleResetPasswordSubmit}
        onCancel={() => setResetPasswordModalVisible(false)}
        confirmLoading={
          requestPasswordResetMutation.isPending ||
          resetPasswordMutation.isPending
        }
      >
        <Form form={resetPasswordForm} layout="vertical">
          <Form.Item label="Phương thức đặt lại mật khẩu">
            <Select
              value={resetPasswordMethod}
              onChange={(value) => setResetPasswordMethod(value)}
            >
              <Option value="email">Gửi email đặt lại mật khẩu</Option>
              <Option value="manual">Nhập mật khẩu mới</Option>
            </Select>
          </Form.Item>

          {resetPasswordMethod === "manual" && (
            <Form.Item
              name="newPassword"
              label="Mật khẩu mới"
              rules={[
                { required: true, message: "Vui lòng nhập mật khẩu mới" },
                { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự" },
              ]}
            >
              <Input.Password />
            </Form.Item>
          )}
        </Form>
      </Modal>
    </div>
  );
};

export default UserManagement;
