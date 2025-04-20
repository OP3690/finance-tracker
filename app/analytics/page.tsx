'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths } from 'date-fns';
import { FaMoneyBillWave, FaPiggyBank, FaChartLine } from 'react-icons/fa';
import KeyFigureCard from '@/components/KeyFigureCard';
import { DailySpendChart } from '@/components/DailySpendChart';
import { formatCurrency } from '@/utils/helpers';
import { DetailedSummary } from '@/components/DetailedSummary';
import { Card, CardContent } from '@/components/ui/card';
import { CategoryPieChart } from '@/components/CategoryPieChart';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
}

export default function AnalyticsPage() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        throw new Error('Failed to fetch transactions');
      }
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const totalIncome = transactions
    .filter((t) => t.category.toLowerCase() === 'income')
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.category.toLowerCase() !== 'income')
    .reduce((sum, t) => sum + Math.abs(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  // Calculate 3-month average spending
  const threeMonthsAgo = subMonths(new Date(), 3);
  const monthlyAverages = Array.from({ length: 3 }, (_, i) => {
    const month = subMonths(new Date(), i);
    const monthTransactions = transactions.filter(t => {
      const date = new Date(t.date);
      return date.getMonth() === month.getMonth() && 
             date.getFullYear() === month.getFullYear() &&
             t.category.toLowerCase() !== 'income' &&
             t.category.toLowerCase() !== 'investment';
    });
    const total = monthTransactions.reduce((sum, t) => sum + Math.abs(t.amount), 0);
    return {
      month: format(month, 'MMM yyyy'),
      average: total / monthTransactions.length || 0
    };
  }).reverse();

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
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">Analytics</h1>
      
      {/* Monthly Averages */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {monthlyAverages.map(({ month, average }) => (
          <div key={month} className="bg-white p-6 rounded-lg border border-gray-200">
            <dt className="text-sm font-medium text-gray-500">Daily Avg. Spent ({month})</dt>
            <dd className="mt-1 text-3xl font-semibold text-primary">
              {formatCurrency(average)}
            </dd>
          </div>
        ))}
      </div>

      {/* Stats */}
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

      {/* Detailed Summary */}
      <div className="space-y-8">
        <div className="glass-effect rounded-xl p-6">
          <h2 className="text-2xl font-bold mb-6">Detailed Summary</h2>
          <DetailedSummary />
        </div>
      </div>
    </div>
  );
} 