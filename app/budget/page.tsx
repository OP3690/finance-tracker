'use client';

import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/utils/helpers';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

interface Budget {
  category: string;
  limit: number;
}

export default function BudgetPage() {
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [editingCategory, setEditingCategory] = useState<string | null>(null);

  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      return response.json();
    },
  });

  useEffect(() => {
    if (transactions.length > 0) {
      // Get unique categories excluding 'Income'
      const categories = Array.from(new Set(transactions
        .map(t => t.category)
        .filter(c => c.toLowerCase() !== 'income')));
      
      // Initialize budgets with default value of 5000
      const initialBudgets = categories.map(category => ({
        category,
        limit: 5000
      }));
      
      setBudgets(initialBudgets);
    }
  }, [transactions]);

  const currentDate = new Date();
  const currentMonthTransactions = transactions.filter(
    (t) =>
      new Date(t.date).getMonth() === currentDate.getMonth() &&
      new Date(t.date).getFullYear() === currentDate.getFullYear()
  );

  const spendingByCategory = currentMonthTransactions.reduce((acc, transaction) => {
    if (transaction.category.toLowerCase() !== 'income') {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleBudgetChange = (category: string, newLimit: string) => {
    setBudgets((prev) =>
      prev.map((b) => (b.category === category ? { ...b, limit: parseFloat(newLimit) || 0 } : b))
    );
  };

  const calculateProgress = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage <= 50) return 'bg-green-500';
    if (percentage <= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Budget</h1>
        <p className="mt-2 text-gray-600">Set and track your monthly spending limits</p>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Budgets</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {budgets.map((budget) => {
            const spent = spendingByCategory[budget.category] || 0;
            const percentage = Math.min((spent / budget.limit) * 100, 100);

            return (
              <div key={budget.category} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{budget.category}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500">
                        {formatCurrency(spent)} of {formatCurrency(budget.limit)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="ml-4">
                    {editingCategory === budget.category ? (
                      <input
                        type="number"
                        value={budget.limit}
                        onChange={(e) => handleBudgetChange(budget.category, e.target.value)}
                        onBlur={() => setEditingCategory(null)}
                        autoFocus
                        className="w-24 px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <button
                        onClick={() => setEditingCategory(budget.category)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                  </div>
                </div>
                <div className="relative pt-1">
                  <div className="overflow-hidden h-2 text-xs flex rounded bg-gray-100">
                    <div
                      style={{ width: `${percentage}%` }}
                      className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${calculateProgress(
                        spent,
                        budget.limit
                      )}`}
                    ></div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        <div className="px-6 py-4 bg-gray-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total Budget</h3>
              <p className="text-sm text-gray-500">
                {formatCurrency(budgets.reduce((sum, b) => sum + b.limit, 0))}
              </p>
            </div>
            <div>
              <h3 className="text-sm font-medium text-gray-900">Total Spent</h3>
              <p className="text-sm text-gray-500">
                {formatCurrency(
                  Object.values(spendingByCategory).reduce((sum, amount) => sum + amount, 0)
                )}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8 bg-blue-50 rounded-lg p-6 border border-blue-200">
        <h2 className="text-lg font-semibold text-blue-900 mb-2">Budget Tips</h2>
        <ul className="space-y-2 text-sm text-blue-800">
          <li>• Aim to save at least 20% of your income</li>
          <li>• Keep essential expenses under 50% of your income</li>
          <li>• Review and adjust your budgets monthly</li>
          <li>• Track your spending regularly to stay within limits</li>
          <li>• Consider using the 50/30/20 rule: 50% needs, 30% wants, 20% savings</li>
        </ul>
      </div>
    </div>
  );
} 