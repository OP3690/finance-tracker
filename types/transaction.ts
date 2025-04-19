export interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
} 