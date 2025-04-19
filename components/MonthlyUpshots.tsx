'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, startOfMonth, endOfMonth, subMonths } from 'date-fns';
import { Transaction } from '@/types/transaction';

interface MonthlyStats {
  month: string;
  income: number;
  expenses: number;
  investments: number;
  savings: number;
}

export function MonthlyUpshots() {
  const { data: transactions } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
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

  const monthlyStats: { [key: string]: MonthlyStats } = {};
  const now = new Date();

  // Initialize last 6 months
  for (let i = 0; i < 6; i++) {
    const monthDate = subMonths(now, i);
    const monthKey = format(monthDate, 'MMM yyyy');
    monthlyStats[monthKey] = {
      month: monthKey,
      income: 0,
      expenses: 0,
      investments: 0,
      savings: 0
    };
  }

  // Calculate statistics
  transactions.forEach(transaction => {
    const txDate = new Date(transaction.date);
    const monthKey = format(txDate, 'MMM yyyy');
    
    if (monthlyStats[monthKey]) {
      if (transaction.category === 'Income') {
        monthlyStats[monthKey].income += transaction.amount;
      } else if (transaction.category === 'Investment') {
        monthlyStats[monthKey].investments += transaction.amount;
      } else {
        monthlyStats[monthKey].expenses += transaction.amount;
      }
    }
  });

  // Calculate savings
  Object.values(monthlyStats).forEach(stats => {
    stats.savings = stats.income - stats.expenses;
  });

  const sortedMonths = Object.values(monthlyStats).sort((a, b) => 
    new Date(b.month).getTime() - new Date(a.month).getTime()
  );

  return (
    <div className="space-y-6">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Month</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Income</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Expenses</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Investments</th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Savings</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedMonths.map((stats) => (
              <tr key={stats.month}>
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  {stats.month}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-green-600">
                  ₹{stats.income.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-red-600">
                  ₹{stats.expenses.toLocaleString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-blue-600">
                  ₹{stats.investments.toLocaleString()}
                </td>
                <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                  stats.savings >= 0 ? 'text-green-600' : 'text-red-600'
                }`}>
                  ₹{stats.savings.toLocaleString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Monthly Average</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Income</p>
              <p className="text-lg font-semibold text-green-600">
                ₹{(sortedMonths.reduce((acc, curr) => acc + curr.income, 0) / sortedMonths.length).toLocaleString()}
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Expenses</p>
              <p className="text-lg font-semibold text-red-600">
                ₹{(sortedMonths.reduce((acc, curr) => acc + curr.expenses, 0) / sortedMonths.length).toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-sm font-medium text-gray-500 mb-2">Savings Rate</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-xs text-gray-500">Average Monthly</p>
              <p className="text-lg font-semibold text-purple-600">
                {((sortedMonths.reduce((acc, curr) => acc + curr.savings, 0) / sortedMonths.length) / 
                  (sortedMonths.reduce((acc, curr) => acc + curr.income, 0) / sortedMonths.length) * 100).toFixed(1)}%
              </p>
            </div>
            <div>
              <p className="text-xs text-gray-500">Investment Rate</p>
              <p className="text-lg font-semibold text-blue-600">
                {((sortedMonths.reduce((acc, curr) => acc + curr.investments, 0) / sortedMonths.length) / 
                  (sortedMonths.reduce((acc, curr) => acc + curr.income, 0) / sortedMonths.length) * 100).toFixed(1)}%
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 