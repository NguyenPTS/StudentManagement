import axios from 'axios';

const API_URL = 'http://localhost:5000/api';

export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'admin' | 'teacher';
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  email: string;
  password: string;
  role: 'admin' | 'teacher';
  name: string;
}

export interface UpdateUserDTO {
  name?: string;
  role?: 'admin' | 'teacher';
  status?: 'active' | 'inactive';
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

// Create axios instance with default config
const axiosInstance = axios.create({
  baseURL: API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    console.log('Request:', {
      url: config.url,
      method: config.method,
      headers: config.headers,
      data: config.data
    });
    return config;
  },
  (error) => {
    console.error('Request error:', error);
    return Promise.reject(error);
  }
);

// Add response interceptor for error handling
axiosInstance.interceptors.response.use(
  (response) => {
    console.log('Response:', {
      status: response.status,
      data: response.data,
      headers: response.headers
    });
    return response;
  },
  (error) => {
    console.error('Response error:', {
      status: error.response?.status,
      data: error.response?.data,
      message: error.message
    });
    
    if (!error.response) {
      return Promise.reject(new Error('Không thể kết nối đến máy chủ'));
    }
    
    if (error.response.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
      return Promise.reject(new Error('Phiên đăng nhập đã hết hạn'));
    }
    
    return Promise.reject(error);
  }
);

const userService = {
  getAll: async (): Promise<User[]> => {
    try {
      const token = localStorage.getItem('token');
      console.log('Current token:', token);
      
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }
      
      const response = await axiosInstance.get('/users', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('Users response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error fetching users:', error);
      throw new Error(error.response?.data?.message || 'Không thể lấy danh sách người dùng');
    }
  },

  getById: async (id: string): Promise<User> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }
      const response = await axiosInstance.get(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error fetching user:', error);
      throw new Error(error.response?.data?.message || 'Không thể lấy thông tin người dùng');
    }
  },

  create: async (user: CreateUserDTO): Promise<User> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }
      const response = await axiosInstance.post('/users', user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error creating user:', error);
      throw new Error(error.response?.data?.message || 'Không thể tạo người dùng mới');
    }
  },

  update: async (id: string, user: UpdateUserDTO): Promise<User> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }
      const response = await axiosInstance.put(`/users/${id}`, user, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      return response.data;
    } catch (error: any) {
      console.error('Error updating user:', error);
      throw new Error(error.response?.data?.message || 'Không thể cập nhật thông tin người dùng');
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }
      await axiosInstance.delete(`/users/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.error('Error deleting user:', error);
      throw new Error(error.response?.data?.message || 'Không thể xóa người dùng');
    }
  },

  requestPasswordReset: async (email: string): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.post('/auth/request-reset-password', { email });
      return response.data;
    } catch (error: any) {
      console.error('Error requesting password reset:', error);
      throw new Error(error.response?.data?.message || 'Không thể gửi mã OTP');
    }
  },

  verifyOTP: async (email: string, otp: string): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.post('/auth/verify-otp', { email, otp });
      return response.data;
    } catch (error: any) {
      console.error('Error verifying OTP:', error);
      throw new Error(error.response?.data?.message || 'Mã OTP không hợp lệ');
    }
  },

  resetPassword: async (data: ResetPasswordDTO): Promise<{ message: string }> => {
    try {
      const response = await axiosInstance.post('/auth/reset-password', data);
      return response.data;
    } catch (error: any) {
      console.error('Error resetting password:', error);
      throw new Error(error.response?.data?.message || 'Không thể đặt lại mật khẩu');
    }
  },

  toggleStatus: async (id: string, status: 'active' | 'inactive'): Promise<void> => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('Không tìm thấy token xác thực');
      }
      await axiosInstance.put(`/users/${id}/status`, { status }, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.error('Error toggling user status:', error);
      throw new Error(error.response?.data?.message || 'Không thể thay đổi trạng thái người dùng');
    }
  },
};

export default userService; 