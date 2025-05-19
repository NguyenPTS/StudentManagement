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
  specialization?: string[];
  qualifications?: string[];
  experience?: number;
  subjects?: string[];
  bio?: string;
  avatar?: string;
  address?: string;
  rating?: number;
  totalRatings?: number;
}

export interface TeacherFormData extends Omit<Teacher, '_id' | 'createdAt' | 'updatedAt'> {
  password?: string;
}

export interface TeacherFilters {
  status?: 'active' | 'inactive';
  subject?: string;
  specialization?: string;
} 