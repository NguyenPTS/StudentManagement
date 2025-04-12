import axios from 'axios';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  status: 'active' | 'inactive';
  createdAt: string;
  updatedAt: string;
  mssv?: string;
  class?: string;
}

export type CreateStudentDTO = Omit<Student, 'id' | 'createdAt' | 'updatedAt'>;
export type UpdateStudentDTO = Partial<CreateStudentDTO>;

const API_URL = 'http://localhost:5000/api/students';

const studentApi = {
  getAll: async (): Promise<Student[]> => {
    const response = await axios.get(API_URL);
    return response.data;
  },

  getById: async (id: string): Promise<Student> => {
    const response = await axios.get(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (student: CreateStudentDTO): Promise<Student> => {
    const response = await axios.post(API_URL, student);
    return response.data;
  },

  update: async (id: string, student: UpdateStudentDTO): Promise<Student> => {
    const response = await axios.put(`${API_URL}/${id}`, student);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await axios.delete(`${API_URL}/${id}`);
  },

  softDelete: async (id: string): Promise<Student> => {
    const response = await axios.patch(`${API_URL}/${id}/soft-delete`);
    return response.data;
  }
};

export default studentApi; 