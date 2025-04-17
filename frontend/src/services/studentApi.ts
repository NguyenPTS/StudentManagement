import { Student, CreateStudentDTO, UpdateStudentDTO, StudentQueryParams } from '../types/student';
import axiosInstance from './axiosInstance';

const API_URL = 'http://localhost:5000/students';

export const studentApi = {
  getAll: async (params?: StudentQueryParams) => {
    const response = await axiosInstance.get<Student[]>(API_URL, { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await axiosInstance.get<Student>(`${API_URL}/${id}`);
    return response.data;
  },

  create: async (data: CreateStudentDTO) => {
    const response = await axiosInstance.post<Student>(API_URL, data);
    return response.data;
  },

  update: async (id: string, data: UpdateStudentDTO) => {
    const response = await axiosInstance.put<Student>(`${API_URL}/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await axiosInstance.delete<void>(`${API_URL}/${id}`);
    return response.data;
  },

  softDelete: async (id: string) => {
    const response = await axiosInstance.patch<Student>(`${API_URL}/${id}/soft-delete`);
    return response.data;
  },

  restore: async (id: string) => {
    const response = await axiosInstance.patch<Student>(`${API_URL}/${id}/restore`);
    return response.data;
  },

  bulkDelete: async (ids: string[]) => {
    const response = await axiosInstance.delete<void>(API_URL, { data: { ids } });
    return response.data;
  },

  bulkSoftDelete: async (ids: string[]) => {
    const response = await axiosInstance.patch<void>(`${API_URL}/soft-delete`, { ids });
    return response.data;
  },

  bulkRestore: async (ids: string[]) => {
    const response = await axiosInstance.patch<void>(`${API_URL}/restore`, { ids });
    return response.data;
  }
}; 