import axios from 'axios';
import { 
  Class, 
  CreateClassDTO, 
  UpdateClassDTO, 
  Grade, 
  ClassStatistics, 
  ActivityLog,
  ClassFilters,
  Student
} from '../types/class';
import { Student as StudentType } from '../types/student';
import axiosInstance from './axiosInstance';

export interface CreateClassData {
  name: string;
  code: string;
  description?: string;
  teacherId?: string;
}

export interface UpdateClassData extends Partial<CreateClassData> {}

class ClassService {
  private transformClass(data: any): Class {
    if (!data) return data;
    return {
      ...data,
      id: data._id,
      teacher: data.teacher ? {
        ...data.teacher,
        id: data.teacher._id
      } : undefined
    };
  }

  private transformClassList(data: any[]): Class[] {
    return data.map(item => this.transformClass(item));
  }

  private logApiCall(method: string, endpoint: string, data?: any) {
    console.log(`[Quản lý lớp học] API Call - ${method} ${endpoint}`, {
      timestamp: new Date().toISOString(),
      data: data || 'No data'
    });
  }

  private logApiError(method: string, endpoint: string, error: any) {
    console.error(`[Quản lý lớp học] API Error - ${method} ${endpoint}`, {
      timestamp: new Date().toISOString(),
      error: error.response?.data || error.message
    });
  }

  async getAll(filters?: ClassFilters): Promise<Class[]> {
    try {
      this.logApiCall('GET', '/classes', filters);
      const response = await axiosInstance.get('/classes', { params: filters });
      return this.transformClassList(response.data);
    } catch (error) {
      this.logApiError('GET', '/classes', error);
      throw error;
    }
  }

  async getById(id: string): Promise<Class> {
    try {
      this.logApiCall('GET', `/classes/${id}`);
      const response = await axiosInstance.get(`/classes/${id}`);
      return this.transformClass(response.data);
    } catch (error) {
      this.logApiError('GET', `/classes/${id}`, error);
      throw error;
    }
  }

  async create(data: CreateClassDTO): Promise<Class> {
    try {
      this.logApiCall('POST', '/classes', data);
      const response = await axiosInstance.post('/classes', data);
      return this.transformClass(response.data);
    } catch (error) {
      this.logApiError('POST', '/classes', error);
      throw error;
    }
  }

  async update(id: string, data: UpdateClassDTO): Promise<Class> {
    try {
      this.logApiCall('PUT', `/classes/${id}`, data);
      const response = await axiosInstance.put(`/classes/${id}`, data);
      return this.transformClass(response.data);
    } catch (error) {
      this.logApiError('PUT', `/classes/${id}`, error);
      throw error;
    }
  }

  async delete(id: string): Promise<void> {
    try {
      this.logApiCall('DELETE', `/classes/${id}`);
      await axiosInstance.delete(`/classes/${id}`);
    } catch (error) {
      this.logApiError('DELETE', `/classes/${id}`, error);
      throw error;
    }
  }

  // New methods
  async importStudents(classId: string, file: File): Promise<void> {
    try {
      this.logApiCall('POST', `/classes/${classId}/import-students`, { fileName: file.name });
      const formData = new FormData();
      formData.append('file', file);
      await axiosInstance.post(`/classes/${classId}/import-students`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
    } catch (error) {
      this.logApiError('POST', `/classes/${classId}/import-students`, error);
      throw error;
    }
  }

  async exportClassData(classId: string): Promise<Blob> {
    try {
      this.logApiCall('GET', `/classes/${classId}/export`);
      const response = await axiosInstance.get(`/classes/${classId}/export`, {
        responseType: 'blob',
      });
      return response.data;
    } catch (error) {
      this.logApiError('GET', `/classes/${classId}/export`, error);
      throw error;
    }
  }

  async sendNotification(classId: string, message: string): Promise<void> {
    try {
      this.logApiCall('POST', `/classes/${classId}/notify`, { message });
      await axiosInstance.post(`/classes/${classId}/notify`, { message });
    } catch (error) {
      this.logApiError('POST', `/classes/${classId}/notify`, error);
      throw error;
    }
  }

  async updateGrades(classId: string, grades: Grade[]): Promise<void> {
    try {
      this.logApiCall('POST', `/classes/${classId}/grades`, { gradesCount: grades.length });
      await axiosInstance.post(`/classes/${classId}/grades`, { grades });
    } catch (error) {
      this.logApiError('POST', `/classes/${classId}/grades`, error);
      throw error;
    }
  }

  async getGrades(classId: string): Promise<Grade[]> {
    try {
      this.logApiCall('GET', `/classes/${classId}/grades`);
      const response = await axiosInstance.get(`/classes/${classId}/grades`);
      return response.data;
    } catch (error) {
      this.logApiError('GET', `/classes/${classId}/grades`, error);
      throw error;
    }
  }

  async getStatistics(classId: string): Promise<ClassStatistics> {
    try {
      this.logApiCall('GET', `/classes/${classId}/statistics`);
      const response = await axiosInstance.get(`/classes/${classId}/statistics`);
      return response.data;
    } catch (error) {
      this.logApiError('GET', `/classes/${classId}/statistics`, error);
      throw error;
    }
  }

  async getActivityLogs(classId: string): Promise<ActivityLog[]> {
    try {
      this.logApiCall('GET', `/classes/${classId}/logs`);
      const response = await axiosInstance.get(`/classes/${classId}/logs`);
      return response.data;
    } catch (error) {
      this.logApiError('GET', `/classes/${classId}/logs`, error);
      throw error;
    }
  }

  async getClassStudents(classId: string): Promise<Student[]> {
    try {
      this.logApiCall('GET', `/classes/${classId}/students`);
      const response = await axiosInstance.get(`/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      this.logApiError('GET', `/classes/${classId}/students`, error);
      throw error;
    }
  }

  async addStudent(classId: string, studentId: string): Promise<void> {
    try {
      this.logApiCall('POST', `/classes/${classId}/students`, { studentId });
      await axiosInstance.post(`/classes/${classId}/students`, { studentId });
    } catch (error) {
      this.logApiError('POST', `/classes/${classId}/students`, error);
      throw error;
    }
  }

  async removeStudent(classId: string, studentId: string): Promise<void> {
    try {
      this.logApiCall('DELETE', `/classes/${classId}/students/${studentId}`);
      await axiosInstance.delete(`/classes/${classId}/students/${studentId}`);
    } catch (error) {
      this.logApiError('DELETE', `/classes/${classId}/students/${studentId}`, error);
      throw error;
    }
  }

  async getStudents(classId: string): Promise<StudentType[]> {
    try {
      this.logApiCall('GET', `/classes/${classId}/students`);
      const response = await axiosInstance.get(`/classes/${classId}/students`);
      return response.data;
    } catch (error) {
      this.logApiError('GET', `/classes/${classId}/students`, error);
      throw error;
    }
  }
}

export default new ClassService(); 