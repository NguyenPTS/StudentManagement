export interface Assignment {
  id: string;
  name: string;
  description?: string;
  dueDate: Date;
  maxScore: number;
  weight: number;
  type: 'homework' | 'quiz' | 'exam' | 'project';
  status: 'active' | 'inactive';
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateAssignmentDTO {
  name: string;
  description?: string;
  dueDate: Date;
  maxScore: number;
  weight: number;
  type: 'homework' | 'quiz' | 'exam' | 'project';
  status: 'active' | 'inactive';
}

export interface UpdateAssignmentDTO extends Partial<CreateAssignmentDTO> {} 