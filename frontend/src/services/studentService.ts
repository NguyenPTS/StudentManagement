import axios from 'axios';

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

// API URL from environment or default to localhost:5000
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/students';
console.log('API URL:', API_URL);

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds timeout
});

// Add request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      console.log('Request with token:', config.url);
    } else {
      console.warn('No token found in localStorage');
    }
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

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
      const response = await api.get('/', { params });
      return response.data;
    } catch (error: any) {
      console.error('Error in getAll:', error);
      throw error;
    }
  },

  getById: async (id: string): Promise<Student> => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error in getById:', error);
      throw error;
    }
  },

  create: async (data: CreateStudentDTO): Promise<Student> => {
    try {
      const response = await api.post('/', data);
      return response.data;
    } catch (error: any) {
      console.error('Error in create:', error);
      throw error;
    }
  },

  update: async (id: string, data: UpdateStudentDTO): Promise<Student> => {
    try {
      const response = await api.put(`/${id}`, data);
      return response.data;
    } catch (error: any) {
      console.error('Error in update:', error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/${id}`);
    } catch (error: any) {
      console.error('Error in delete:', error);
      throw error;
    }
  },

  softDelete: async (id: string): Promise<Student> => {
    try {
      const response = await api.patch(`/${id}/soft-delete`);
      return response.data;
    } catch (error: any) {
      console.error('Error in softDelete:', error.response || error);
      throw error;
    }
  }
};

export default studentService; 