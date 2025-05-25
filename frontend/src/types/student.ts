import type { Teacher as TeacherType } from './teacher';
import { Schedule } from './schedule';
import { Assignment } from './assignment';

export interface Class {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacher?: TeacherType;
  students?: Student[];
  schedule?: Schedule[];
  semester?: string;
  status?: string;
  assignments?: Assignment[];
}

export interface Student {
  id: string;
  name: string;
  email: string;
  mssv: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  dateOfBirth: string;
  status: 'active' | 'inactive';
  class?: string;
  teacher?: TeacherType;
  schedule?: Schedule[];
  assignments?: Assignment[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateStudentDTO {
  name: string;
  email: string;
  mssv: string;
  phone: string;
  gender: 'male' | 'female' | 'other';
  address: string;
  dob: string;
  class: string;
}

export interface StudentFormData {
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth: string;
  status: 'active' | 'inactive' | 'graduated';
  mssv?: string;
  classId?: string;
  teacherId?: string;
}

export interface UpdateStudentDTO extends Partial<CreateStudentDTO> {}

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  classId?: string;
} 