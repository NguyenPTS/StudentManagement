import type { Teacher } from './teacher';
import type { Student } from './student';
import { Assignment } from './assignment';

export type ClassStatus = 'active' | 'inactive' | 'completed';

export interface Schedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
}

export interface Class {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacher?: Teacher;
  students?: Student[];
  schedule: Schedule[];
  semester: number;
  status: ClassStatus;
  maxStudents: number;
  academicYear: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClassDTO {
  name: string;
  code: string;
  description?: string;
  teacherId?: string;
  schedule: Schedule[];
  semester: number;
  status: ClassStatus;
  maxStudents: number;
  academicYear: string;
  subject: string;
}

export interface UpdateClassDTO extends Partial<CreateClassDTO> {}

export interface ClassFilters {
  academicYear?: string;
  semester?: number;
  status?: ClassStatus;
  teacherId?: string;
  subject?: string;
}

export interface Grade {
  studentId: string;
  assignments: {
    id: string;
    name: string;
    score: number;
  }[];
  finalGrade?: number;
}

export interface ClassStatistics {
  totalStudents: number;
  averageGrade: number;
  excellentCount: number;
  goodCount: number;
  averageCount: number;
  belowAverageCount: number;
}

export interface ActivityLog {
  id: string;
  action: string;
  description: string;
  performedBy: string;
  timestamp: Date;
} 