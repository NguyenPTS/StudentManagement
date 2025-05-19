import { Assignment } from './assignment';

export interface Schedule {
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  room?: string;
}

export type ClassStatus = 'active' | 'inactive' | 'completed';

export interface Student {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'inactive';
  averageScore?: number;
  attendance?: {
    present: number;
    total: number;
  };
}

export interface Grade {
  studentId: string;
  assignments: Assignment[];
  finalGrade?: number;
}

export interface ActivityLog {
  id: string;
  classId: string;
  userId: string;
  action: 'create' | 'update' | 'delete' | 'import' | 'export' | 'grade_update' | 'notification_sent';
  details: any;
  timestamp: Date;
}

export interface ClassStatistics {
  totalStudents: number;
  activeStudents: number;
  averageGrade: number;
  excellentCount: number;  // 9.0-10
  goodCount: number;       // 8.0-8.9
  aboveAverageCount: number; // 7.0-7.9
  averageCount: number;    // 5.0-6.9
  belowAverageCount: number; // <5.0
}

export interface Class {
  id: string;
  name: string;
  code: string;
  description?: string;
  teacherId?: string;
  teacher?: {
    id: string;
    name: string;
    email: string;
  };
  studentCount: number;
  maxStudents: number;
  academicYear: string;
  semester: number;
  subject: string;
  schedule: Schedule[];
  status: ClassStatus;
  grades?: Grade[];
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateClassDTO {
  name: string;
  code: string;
  description?: string;
  teacherId?: string;
  maxStudents: number;
  academicYear: string;
  semester: number;
  subject: string;
  schedule: Schedule[];
  status?: ClassStatus;
}

export interface UpdateClassDTO extends Partial<CreateClassDTO> {}

export interface ClassFilters {
  academicYear?: string;
  semester?: number;
  subject?: string;
  status?: ClassStatus;
  teacherId?: string;
} 