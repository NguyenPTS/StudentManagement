export interface Student {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  dateOfBirth?: string; // Optional for backward compatibility
  dob?: string; // Server field name
  status: 'active' | 'inactive' | 'graduated';
  createdAt: string;
  updatedAt: string;
  mssv?: string;
  class?: string;
} 