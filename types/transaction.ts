export interface Transaction {
  id: string;
  createdAt: string;
  updatedAt: string;
  category: string;
  date: string;
  description: string;
  amount: number;
  comment: string | null;
  type: 'income' | 'expense';
} 