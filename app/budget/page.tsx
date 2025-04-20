'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatCurrency } from '@/utils/helpers';
import { Plus, X } from 'lucide-react';
import toast from 'react-hot-toast';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
}

interface Category {
  id: string;
  name: string;
  descriptions: string[];
}

interface Budget {
  id: string;
  limit: number;
  categoryId: string;
  category: Category;
}

export default function BudgetPage() {
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const queryClient = useQueryClient();

  // Fetch budgets
  const { data: budgets = [] } = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: async () => {
      const response = await fetch('/api/budgets');
      return response.json();
    },
  });

  // Fetch all categories
  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json();
    },
  });

  // Fetch transactions
  const { data: transactions = [] } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      return response.json();
    },
  });

  // Create budget mutation
  const createBudget = useMutation({
    mutationFn: async ({ categoryId, limit }: { categoryId: string; limit: number }) => {
      const response = await fetch('/api/budgets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ categoryId, limit }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget added successfully');
    },
    onError: () => {
      toast.error('Failed to add budget');
    },
  });

  // Update budget mutation
  const updateBudget = useMutation({
    mutationFn: async ({ id, limit }: { id: string; limit: number }) => {
      const response = await fetch('/api/budgets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id, limit }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget updated successfully');
      setEditingBudget(null);
    },
    onError: () => {
      toast.error('Failed to update budget');
    },
  });

  // Delete budget mutation
  const deleteBudget = useMutation({
    mutationFn: async (id: string) => {
      const response = await fetch('/api/budgets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['budgets'] });
      toast.success('Budget removed successfully');
    },
    onError: () => {
      toast.error('Failed to remove budget');
    },
  });

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

  const handleBudgetChange = (budgetId: string, newLimit: string) => {
    updateBudget.mutate({ id: budgetId, limit: parseFloat(newLimit) || 0 });
  };

  const calculateProgress = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage <= 50) return 'bg-green-500';
    if (percentage <= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get categories that don't have a budget yet
  const availableCategories = categories.filter(
    category => !budgets.some(budget => budget.categoryId === category.id)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Budget</h1>
        <p className="mt-2 text-gray-600">Set and track your monthly spending limits</p>
      </div>

      {/* Add Budget Section */}
      {availableCategories.length > 0 && (
        <div className="mb-8 bg-white rounded-lg border border-gray-200 p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Add Budget Category</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {availableCategories.map(category => (
              <div key={category.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-900">{category.name}</span>
                <button
                  onClick={() => createBudget.mutate({ categoryId: category.id, limit: 5000 })}
                  className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Budget
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Budget List */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Budgets</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {budgets.map((budget) => {
            const spent = spendingByCategory[budget.category.name] || 0;
            const percentage = Math.min((spent / budget.limit) * 100, 100);

            return (
              <div key={budget.id} className="px-6 py-4">
                <div className="flex items-center justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="text-sm font-medium text-gray-900">{budget.category.name}</h3>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500">
                        {formatCurrency(spent)} of {formatCurrency(budget.limit)}
                      </span>
                      <span className="ml-2 text-sm text-gray-500">
                        ({percentage.toFixed(1)}%)
                      </span>
                    </div>
                  </div>
                  <div className="ml-4 flex items-center space-x-4">
                    {editingBudget === budget.id ? (
                      <input
                        type="number"
                        value={budget.limit}
                        onChange={(e) => handleBudgetChange(budget.id, e.target.value)}
                        onBlur={() => setEditingBudget(null)}
                        autoFocus
                        className="w-24 px-2 py-1 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <button
                        onClick={() => setEditingBudget(budget.id)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Edit
                      </button>
                    )}
                    <button
                      onClick={() => deleteBudget.mutate(budget.id)}
                      className="text-sm text-red-600 hover:text-red-800"
                    >
                      <X className="h-4 w-4" />
                    </button>
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