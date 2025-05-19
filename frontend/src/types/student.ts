import { Teacher } from './teacher';
import { Schedule } from './schedule';
import { Assignment } from './assignment';

export interface Class {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacher?: Teacher;
  students?: Student[];
  schedule?: Schedule[];
  semester?: string;
  status?: string;
  assignments?: Assignment[];
}

export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
}

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  address?: string;
  dateOfBirth?: Date;
  gender?: 'male' | 'female' | 'other';
  status: 'active' | 'inactive';
  teacher?: Teacher;
}

export interface CreateStudentDTO {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  status: 'active' | 'inactive' | 'graduated';
  mssv?: string;
  class: string;
  teacherId?: string;
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

export type UpdateStudentDTO = Partial<CreateStudentDTO>;

export interface StudentQueryParams {
  page?: number;
  limit?: number;
  search?: string;
  status?: string;
  sortBy?: string;
  order?: 'asc' | 'desc';
  classId?: string;
} 