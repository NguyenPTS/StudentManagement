export interface Class {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacherId?: string;
  status: 'active' | 'inactive' | 'completed';
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
  phone: string;
  address: string;
  dob: string;
  status: 'active' | 'inactive' | 'graduated';
  createdAt: string;
  updatedAt: string;
  mssv?: string;
  class?: string;
  teacherId?: string;
  classDetails?: Class;
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