import axios from 'axios';
import { API_URL } from '../config';

export interface Class {
  id: string;
  name: string;
  code: string;
  studentCount?: number;
  teacher?: {
    id: string;
    name: string;
  };
  createdAt: string;
  updatedAt: string;
}

const classService = {
  getAll: async (): Promise<Class[]> => {
    const response = await axios.get(`${API_URL}/classes`);
    return response.data;
  },

  getById: async (id: string): Promise<Class> => {
    const response = await axios.get(`${API_URL}/classes/${id}`);
    return response.data;
  },

  create: async (data: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<Class> => {
    const response = await axios.post(`${API_URL}/classes`, data);
    return response.data;
  },

  update: async (id: string, data: Partial<Class>): Promise<Class> => {
    const response = await axios.put(`${API_URL}/classes/${id}`, data);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/classes/${id}`);
  }
};

export default classService; 