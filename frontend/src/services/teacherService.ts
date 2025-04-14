import axios from 'axios';
import { API_URL } from '../config';

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

const teacherService = {
  getAll: async (): Promise<Teacher[]> => {
    const response = await axios.get(`${API_URL}/teachers`);
    return response.data;
  },

  getById: async (id: string): Promise<Teacher> => {
    const response = await axios.get(`${API_URL}/teachers/${id}`);
    return response.data;
  },

  create: async (data: Omit<Teacher, 'id' | 'createdAt' | 'updatedAt'>): Promise<Teacher> => {
    const response = await axios.post(`${API_URL}/teachers`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<Teacher>): Promise<Teacher> => {
    const response = await axios.put(`${API_URL}/teachers/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/teachers/${id}`);
  }
};

export default teacherService; 