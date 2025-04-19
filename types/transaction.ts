export interface Transaction {
  id: string;
  createdAt: Date;
  updatedAt: Date;
  category: string;
  date: Date;
  description: string;
  amount: number;
  comment: string | null;
} 