export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  status: 'active' | 'inactive' | 'graduated';
  mssv?: string;
  class?: string;
}

export interface CreateStudentDTO {
  name: string;
  email: string;
  phone: string;
  address: string;
  dob: string;
  status: 'active' | 'inactive' | 'graduated';
  mssv?: string;
  class?: string;
}

export interface UpdateStudentDTO extends Partial<CreateStudentDTO> {} 