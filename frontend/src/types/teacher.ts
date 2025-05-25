export interface Teacher {
  id: string;
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  experience?: number;
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
  emailVerified: boolean;
  subjects?: string[];
  bio?: string;
  avatar?: string;
  address?: string;
  rating?: number;
  totalRatings?: number;
}

export interface TeacherFormData extends Omit<Teacher, 'createdAt' | 'updatedAt'> {
  password?: string;
}

export interface TeacherFilters {
  status?: 'active' | 'inactive';
  subject?: string;
  specialization?: string;
}

export interface CreateTeacherDTO {
  name: string;
  email: string;
  phone?: string;
  specialization?: string;
  experience?: number;
}

export interface UpdateTeacherDTO extends Partial<CreateTeacherDTO> {} 