'use client';

import { useQuery } from '@tanstack/react-query';
import { format } from 'date-fns';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
}

interface SummaryTableProps {
  selectedMonth: Date;
}

export function SummaryTable({ selectedMonth }: SummaryTableProps) {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions', selectedMonth],
    queryFn: async () => {
      const response = await fetch(`/api/transactions?month=${selectedMonth.toISOString()}`);
      return response.json();
    },
  });

  if (isLoading || !transactions) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const categories = Array.from(new Set(transactions.map(t => t.category))).sort();
  const summaryData = categories.map(category => {
    const categoryTransactions = transactions.filter(t => t.category === category);
    const total = categoryTransactions.reduce((sum, t) => sum + t.amount, 0);
    return { category, total };
  });

  const totalIncome = summaryData
    .filter(d => d.category === 'Income')
    .reduce((sum, d) => sum + d.total, 0);

  const totalExpenses = summaryData
    .filter(d => d.category !== 'Income')
    .reduce((sum, d) => sum + d.total, 0);

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
              Category
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
              Total Amount
            </th>
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {summaryData.map(({ category, total }) => (
            <tr key={category} className={category === 'Income' ? 'bg-gray-50' : ''}>
              <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {category}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                ₹{total.toLocaleString()}
              </td>
            </tr>
          ))}
          <tr className="bg-gray-100 font-semibold">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Total Expenses
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
              ₹{totalExpenses.toLocaleString()}
            </td>
          </tr>
          <tr className="bg-blue-50 font-semibold">
            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
              Balance
            </td>
            <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
              ₹{(totalIncome - totalExpenses).toLocaleString()}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  );
} 