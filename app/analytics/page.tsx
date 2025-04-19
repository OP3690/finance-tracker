'use client';

import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/utils/helpers';
import { DetailedSummary } from '@/components/DetailedSummary';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
}

export default function AnalyticsPage() {
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      return response.json();
    },
  });

  const totalIncome = transactions
    .filter((t) => t.category.toLowerCase() === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.category.toLowerCase() !== 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  const stats = [
    { name: 'Total Income', amount: totalIncome, color: 'text-green-600' },
    { name: 'Total Expenses', amount: totalExpenses, color: 'text-red-600' },
    { name: 'Balance', amount: balance, color: balance >= 0 ? 'text-blue-600' : 'text-red-600' },
    {
      name: 'Savings Rate',
      amount: totalIncome ? (balance / totalIncome) * 100 : 0,
      isPercentage: true,
      color: 'text-purple-600',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
        <p className="mt-2 text-gray-600">Analyze your financial data and trends</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg border border-gray-200">
            <dt className="text-sm font-medium text-gray-500">{stat.name}</dt>
            <dd className={`mt-1 text-3xl font-semibold ${stat.color}`}>
              {stat.isPercentage
                ? `${stat.amount.toFixed(1)}%`
                : formatCurrency(stat.amount)}
            </dd>
          </div>
        ))}
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h2 className="text-xl font-semibold mb-4">Detailed Summary</h2>
        <DetailedSummary />
      </div>
    </div>
  );
} 