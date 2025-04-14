import axios from 'axios';
import axiosInstance from './axiosInstance';
import type { AxiosResponse } from 'axios';

export type UserStatus = 'active' | 'inactive' | 'blocked';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'teacher' | 'student';
  status: UserStatus;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CreateUserDTO {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'teacher';
  status?: UserStatus;
}

export interface UpdateUserDTO {
  name?: string;
  email?: string;
  password?: string;
  role?: 'admin' | 'teacher';
  status?: UserStatus;
}

export interface LoginDTO {
  email: string;
  password: string;
}

export interface ResetPasswordDTO {
  email: string;
  otp: string;
  newPassword: string;
}

const userService = {
  login: async (data: LoginDTO): Promise<{ token: string; user: User }> => {
    const response = await axiosInstance.post<{ token: string; user: User }>('/auth/login', data);
    return response.data;
  },

  getAll: async (): Promise<User[]> => {
    const response = await axiosInstance.get('/users');
    return response.data;
  },

  getById: async (id: string): Promise<User> => {
    const response = await axiosInstance.get(`/users/${id}`);
    return response.data;
  },

  create: async (data: CreateUserDTO): Promise<User> => {
    const response = await axiosInstance.post<User>('/users', data);
    return response.data;
  },

  update: async (id: string, data: UpdateUserDTO): Promise<User> => {
    const response = await axiosInstance.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/users/${id}`);
  },

  resetPassword: async (userId: string): Promise<void> => {
    await axiosInstance.post(`/users/${userId}/reset-password`);
  },

  resetUserPassword: async (data: ResetPasswordDTO): Promise<void> => {
    await axiosInstance.post('/users/reset-password', data);
  },

  updateStatus: async (id: string, status: UserStatus): Promise<User> => {
    console.log('=== Update Status API Call ===');
    console.log('Request details:', {
      method: 'PUT',
      url: `/users/${id}`,
      data: { status },
      headers: axiosInstance.defaults.headers,
      token: localStorage.getItem('token')
    });
    
    try {
      console.log('Sending request to server...');
      const response = await axiosInstance.put(`/users/${id}`, { status });
      console.log('Server response:', {
        status: response.status,
        data: response.data
      });
      return response.data;
    } catch (error) {
      console.error('Error in updateStatus:', error);
      if (axios.isAxiosError(error)) {
        console.error('Axios error details:', {
          status: error.response?.status,
          statusText: error.response?.statusText,
          data: error.response?.data,
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          requestData: error.config?.data
        });
      }
      throw error;
    }
  },

  requestPasswordReset: async (email: string): Promise<void> => {
    await axiosInstance.post('/users/request-reset-password', { email });
  },

  verifyEmail: async (token: string): Promise<void> => {
    await axiosInstance.post('/users/verify-email', { token });
  },

  resendVerification: async (email: string): Promise<void> => {
    await axiosInstance.post('/users/resend-verification', { email });
  },

  getProfile: async (): Promise<User> => {
    const response = await axiosInstance.get<User>('/users/profile');
    return response.data;
  },

  updateProfile: async (data: Partial<User>): Promise<User> => {
    const response = await axiosInstance.patch<User>('/users/profile', data);
    return response.data;
  },

  changePassword: async (data: { currentPassword: string; newPassword: string }): Promise<void> => {
    await axiosInstance.post('/users/change-password', data);
  }
};

export default userService; 