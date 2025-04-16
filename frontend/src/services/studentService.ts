import axios from 'axios';
import { API_URL } from '../config';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string; // Optional for backward compatibility
  dob?: string; // Server field name
  status: 'active' | 'inactive' | 'graduated';
  createdAt: string;
  updatedAt: string;
  mssv?: string;
  classId?: string;
  teacherId?: string;
  class?: {
    id: string;
    name: string;
  };
  teacher?: {
    id: string;
    name: string;
  };
}

export type CreateStudentDTO = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStudentDTO = Partial<CreateStudentDTO>;

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to include auth token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Add response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log('Response received:', response.config.url, response.status);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('API Error:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Network Error:', {
        url: error.config?.url,
        request: error.request,
      });
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

const studentService = {
  getAll: async (params?: { class?: string; status?: string; page?: number; limit?: number }): Promise<Student[]> => {
    try {
      console.log('Calling getAll students with params:', params);
      console.log('Current token:', localStorage.getItem('token'));
      const response = await api.get('/students', { params });
      console.log('Get all students response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error in getAll students:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  getById: async (id: string): Promise<Student> => {
    try {
      console.log('Calling getStudentById with id:', id);
      console.log('Current token:', localStorage.getItem('token'));
      const response = await api.get(`/students/${id}`);
      console.log('Get student by id response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error in getStudentById:', error);
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      });
      throw error;
    }
  },

  create: async (data: CreateStudentDTO): Promise<Student> => {
    try {
      const response = await api.post('/students', data);
      return response.data;
    } catch (error: any) {
      console.error('Error in create:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateStudentDTO): Promise<Student> => {
    try {
      const response = await api.put(`/students/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error in update:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/students/${id}`);
    } catch (error: any) {
      console.error('Error in delete:', error);
      throw error;
    }
  },

  softDelete: async (id: string): Promise<Student> => {
    try {
      const response = await api.patch(`/students/${id}/soft-delete`);
      return response.data;
    } catch (error: any) {
      console.error('Error in softDelete:', error.response || error);
      throw error;
    }
  }
};

export default studentService; 