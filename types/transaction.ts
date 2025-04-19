export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  type: 'income' | 'expense';
  comment?: string;
  createdAt: string;
  updatedAt: string;
} 