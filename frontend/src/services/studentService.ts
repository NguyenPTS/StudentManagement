import axios from 'axios';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string; // Optional for backward compatibility
  dob?: string; // Server field name
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  mssv?: string;
  class?: string;
}

export type CreateStudentDTO = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStudentDTO = Partial<CreateStudentDTO>;

const API_URL = 'http://localhost:5000/students';

// Create axios instance with default config
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to add token to headers
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    console.log('Current token in interceptor:', token);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
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
    console.log('Response received:', response);
    return response;
  },
  (error) => {
    if (error.response) {
      // The request was made and the server responded with a status code
      // that falls out of the range of 2xx
      console.error('Response error:', {
        status: error.response.status,
        data: error.response.data,
        headers: error.response.headers,
      });
    } else if (error.request) {
      // The request was made but no response was received
      console.error('Request error:', error.request);
    } else {
      // Something happened in setting up the request that triggered an Error
      console.error('Error:', error.message);
    }
    return Promise.reject(error);
  }
);

const studentService = {
  getAll: async (): Promise<Student[]> => {
    try {
      console.log('Making GET request to:', API_URL);
      const token = localStorage.getItem('token');
      console.log('Using token:', token);
      
      const response = await api.get('/', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      console.log('API Response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Error in getAll:', error.response || error);
      if (error.response?.status === 401) {
        console.error('Unauthorized: Token may be invalid or expired');
      }
      throw error;
    }
  },

  getById: async (id: string): Promise<Student> => {
    try {
      const response = await api.get(`/${id}`);
      return response.data;
    } catch (error: any) {
      console.error('Error in getById:', error.response || error);
      throw error;
    }
  },

  create: async (student: CreateStudentDTO): Promise<Student> => {
    try {
      // Format the data before sending
      const formattedData = {
        name: student.name?.trim(),
        email: student.email?.trim(),
        phone: student.phone?.trim(),
        address: student.address?.trim(),
        dob: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString() : null,
        status: student.status || 'active',
        mssv: student.mssv || null,
        class: student.class || null
      };

      // Validate required fields
      if (!formattedData.name || !formattedData.email || !formattedData.phone || !formattedData.address || !formattedData.dob) {
        throw new Error('Missing required fields');
      }

      console.log('Creating student with formatted data:', formattedData);
      const token = localStorage.getItem('token');
      console.log('Using token:', token);
      
      const response = await api.post('/', formattedData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });
      
      console.log('Create response:', response.data);
      return response.data;
    } catch (error: any) {
      console.error('Detailed create error:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        config: {
          url: error.config?.url,
          method: error.config?.method,
          headers: error.config?.headers,
          data: error.config?.data
        }
      });

      // Handle specific error cases
      if (error.response?.status === 500) {
        const errorMessage = error.response?.data?.message || 'Lỗi server. Vui lòng thử lại sau.';
        throw new Error(errorMessage);
      } else if (error.response?.status === 401) {
        throw new Error('Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.');
      } else if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      } else {
        throw new Error('Không thể tạo sinh viên. Vui lòng thử lại sau.');
      }
    }
  },

  update: async (id: string, student: UpdateStudentDTO): Promise<Student> => {
    try {
      const response = await api.put(`/${id}`, student);
      return response.data;
    } catch (error: any) {
      console.error('Error in update:', error.response || error);
      throw error;
    }
  },

  delete: async (id: string): Promise<void> => {
    try {
      await api.delete(`/${id}`);
    } catch (error: any) {
      console.error('Error in delete:', error.response || error);
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