import axiosInstance from './axiosInstance';

export interface Teacher {
  _id: string;
  name: string;
  email: string;
  phone?: string;
  role: 'teacher';
  status: 'active' | 'inactive';
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

interface TeacherResponse {
  teachers: Teacher[];
  pagination: {
    total: number;
    page: number;
    pages: number;
  };
}

const teacherService = {
  getAll: async (): Promise<Teacher[]> => {
    try {
      const response = await axiosInstance.get<TeacherResponse>('/teachers');
      if (response.data && Array.isArray(response.data.teachers)) {
        return response.data.teachers;
      }
      console.error('Expected array of teachers but got:', response.data);
      return [];
    } catch (error) {
      console.error('Error fetching teachers:', error);
      return [];
    }
  },

  getById: async (id: string): Promise<Teacher> => {
    const response = await axiosInstance.get(`/teachers/${id}`);
    return response.data;
  },

  create: async (data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<Teacher> => {
    const response = await axiosInstance.post('/teachers', data);
    return response.data;
  },

  update: async (id: string, data: Partial<Teacher>): Promise<Teacher> => {
    const response = await axiosInstance.put(`/teachers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axiosInstance.delete(`/teachers/${id}`);
  }
};

export default teacherService; 