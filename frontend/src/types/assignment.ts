export interface Assignment {
  id: string;
  title: string;
  description?: string;
  dueDate: Date;
  totalPoints: number;
  weight: number;
  status: 'pending' | 'completed';
} 