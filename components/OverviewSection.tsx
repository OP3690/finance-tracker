'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth } from 'date-fns';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
}

export function OverviewSection() {
  const currentMonth = new Date();
  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ['transactions', format(currentMonth, 'yyyy-MM')],
    queryFn: async () => {
      const response = await fetch(`/api/transactions?month=${currentMonth.toISOString()}`);
      return response.json();
    },
  });

  if (!transactions) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  const totalIncome = transactions
    .filter(t => t.category === 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter(t => t.category !== 'Income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalInvestments = transactions
    .filter(t => t.category === 'Investment')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalSpending = totalExpenses - totalInvestments;

  const stats = [
    { label: 'Total Income', value: totalIncome, color: 'text-green-600' },
    { label: 'Total Spending', value: totalSpending, color: 'text-red-600' },
    { label: 'Total Investment', value: totalInvestments, color: 'text-blue-600' },
    { label: 'Net Savings', value: totalIncome - totalExpenses, color: 'text-purple-600' },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((stat) => (
        <div key={stat.label} className="bg-gray-50 rounded-lg p-4">
          <h3 className="text-sm font-medium text-gray-500">{stat.label}</h3>
          <p className={`text-2xl font-bold ${stat.color}`}>
            ₹{stat.value.toLocaleString()}
          </p>
        </div>
      ))}
    </div>
  );
} 