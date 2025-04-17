import { studentApi } from './studentApi';
import type { Student, CreateStudentDTO, UpdateStudentDTO, StudentQueryParams } from '../types/student';

export type { Student, CreateStudentDTO, UpdateStudentDTO, StudentQueryParams };

const studentService = {
  getAll: async (params?: StudentQueryParams) => {
    try {
      const response = await studentApi.getAll(params);
      return response || [];
    } catch (error) {
      console.error('Error in getAll:', error);
      return [];
    }
  },

  getById: async (id: string) => {
    return studentApi.getById(id);
  },

  create: async (data: CreateStudentDTO) => {
    return studentApi.create(data);
  },

  update: async (id: string, data: UpdateStudentDTO) => {
    return studentApi.update(id, data);
  },

  delete: async (id: string) => {
    return studentApi.delete(id);
  },

  softDelete: async (id: string) => {
    return studentApi.softDelete(id);
  },

  restore: async (id: string) => {
    return studentApi.restore(id);
  },

  bulkDelete: async (ids: string[]) => {
    return studentApi.bulkDelete(ids);
  },

  bulkSoftDelete: async (ids: string[]) => {
    return studentApi.bulkSoftDelete(ids);
  },

  bulkRestore: async (ids: string[]) => {
    return studentApi.bulkRestore(ids);
  }
};

export default studentService; 