'use client';

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { formatCurrency } from '@/utils/helpers';
import { Plus, X, AlertCircle, Pencil, ChevronDown, ChevronUp } from 'lucide-react';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

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

// Define category order
const CATEGORY_ORDER = [
  'Groceries',
  'Recharge/Bill/EMI Payment',
  'Healthcare',
  'Transportation',
  'Education - Books',
  'Cloths',
  'Insurance',
  'Other Expenses'
];

export default function BudgetPage() {
  const [editingBudget, setEditingBudget] = useState<string | null>(null);
  const [showAddSection, setShowAddSection] = useState(true);
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
    if (!['income', 'investment'].includes(transaction.category.toLowerCase())) {
      acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    }
    return acc;
  }, {} as Record<string, number>);

  const handleBudgetChange = (budgetId: string, newLimit: string) => {
    const value = parseFloat(newLimit);
    if (!isNaN(value) && value >= 0) {
      updateBudget.mutate({ id: budgetId, limit: value });
    }
  };

  const calculateProgress = (spent: number, limit: number) => {
    const percentage = (spent / limit) * 100;
    if (percentage <= 50) return 'bg-green-500';
    if (percentage <= 75) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  // Get categories that don't have a budget yet, excluding Income and Investment, and sort by defined order
  const availableCategories = categories
    .filter(
      category => 
        !['Income', 'Investment'].includes(category.name) && 
        !budgets.some(budget => budget.categoryId === category.id)
    )
    .sort((a, b) => {
      const orderA = CATEGORY_ORDER.indexOf(a.name);
      const orderB = CATEGORY_ORDER.indexOf(b.name);
      
      // If both categories are in the order list, sort by their position
      if (orderA !== -1 && orderB !== -1) {
        return orderA - orderB;
      }
      
      // If only one category is in the order list, prioritize it
      if (orderA !== -1) return -1;
      if (orderB !== -1) return 1;
      
      // If neither category is in the order list, sort alphabetically
      return a.name.localeCompare(b.name);
    });

  // Calculate totals excluding Investment category
  const totalBudget = budgets
    .filter(budget => budget.category.name !== 'Investment')
    .reduce((sum, b) => sum + b.limit, 0);

  const totalSpent = Object.values(spendingByCategory)
    .reduce((sum, amount) => sum + amount, 0);

  const totalPercentage = totalBudget > 0 ? Math.min((totalSpent / totalBudget) * 100, 100) : 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Budget</h1>
          <p className="mt-2 text-gray-600">Set and track your monthly spending limits</p>
        </div>
        <motion.div 
          className="flex items-center gap-2 text-sm font-medium"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600">Total Budget</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalBudget)}</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600">Total Spent</p>
            <p className="text-lg font-semibold text-gray-900">{formatCurrency(totalSpent)}</p>
          </div>
          <div className="px-4 py-2 bg-white rounded-lg border border-gray-200 shadow-sm">
            <p className="text-gray-600">Progress</p>
            <p className="text-lg font-semibold text-gray-900">{totalPercentage.toFixed(1)}%</p>
          </div>
        </motion.div>
      </div>

      {/* Add Budget Section */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div 
          className="px-6 py-4 border-b border-gray-200 flex items-center justify-between cursor-pointer hover:bg-gray-50 transition-colors"
          onClick={() => setShowAddSection(!showAddSection)}
        >
          <h2 className="text-lg font-semibold text-gray-900">Add Budget Category</h2>
          {showAddSection ? <ChevronUp className="h-5 w-5 text-gray-500" /> : <ChevronDown className="h-5 w-5 text-gray-500" />}
        </div>
        
        <AnimatePresence>
          {showAddSection && availableCategories.length > 0 && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: "auto", opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="overflow-hidden"
            >
              <div className="p-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {availableCategories.map(category => (
                  <motion.div
                    key={category.id}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    <button
                      onClick={() => createBudget.mutate({ categoryId: category.id, limit: 5000 })}
                      className="inline-flex items-center px-3 py-1.5 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Add Budget
                    </button>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {showAddSection && availableCategories.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="px-6 py-8 text-center"
          >
            <AlertCircle className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No Categories Available</h3>
            <p className="mt-1 text-sm text-gray-500">All categories have been added to your budget.</p>
          </motion.div>
        )}
      </div>

      {/* Budget List */}
      <div className="bg-white rounded-lg border border-gray-200 shadow-sm overflow-hidden">
        <div className="px-6 py-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Budgets</h2>
        </div>

        <div className="divide-y divide-gray-200">
          {budgets
            .filter(budget => budget.category.name !== 'Investment')
            .sort((a, b) => {
              const orderA = CATEGORY_ORDER.indexOf(a.category.name);
              const orderB = CATEGORY_ORDER.indexOf(b.category.name);
              
              // If both categories are in the order list, sort by their position
              if (orderA !== -1 && orderB !== -1) {
                return orderA - orderB;
              }
              
              // If only one category is in the order list, prioritize it
              if (orderA !== -1) return -1;
              if (orderB !== -1) return 1;
              
              // If neither category is in the order list, sort alphabetically
              return a.category.name.localeCompare(b.category.name);
            })
            .map((budget) => {
              const spent = spendingByCategory[budget.category.name] || 0;
              const percentage = Math.min((spent / budget.limit) * 100, 100);

              return (
                <motion.div
                  key={budget.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="px-6 py-4 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex-1">
                      <h3 className="text-sm font-medium text-gray-900">{budget.category.name}</h3>
                      <div className="flex items-center mt-1">
                        <span className="text-sm text-gray-500">
                          {formatCurrency(spent)} of {formatCurrency(budget.limit)}
                        </span>
                        <span className={`ml-2 text-sm ${percentage > 75 ? 'text-red-500 font-medium' : 'text-gray-500'}`}>
                          ({percentage.toFixed(1)}%)
                        </span>
                      </div>
                    </div>
                    <div className="ml-4 flex items-center space-x-4">
                      {editingBudget === budget.id ? (
                        <motion.input
                          initial={{ scale: 0.95 }}
                          animate={{ scale: 1 }}
                          type="text"
                          inputMode="numeric"
                          pattern="[0-9]*"
                          value={budget.limit}
                          onChange={(e) => {
                            const value = e.target.value.replace(/[^0-9]/g, '');
                            handleBudgetChange(budget.id, value);
                          }}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                              setEditingBudget(null);
                            }
                          }}
                          onBlur={() => setEditingBudget(null)}
                          autoFocus
                          className="w-32 px-3 py-1.5 text-right border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                        />
                      ) : (
                        <button
                          onClick={() => setEditingBudget(budget.id)}
                          className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 transition-colors"
                        >
                          <Pencil className="h-4 w-4 mr-1" />
                          Edit
                        </button>
                      )}
                      <button
                        onClick={() => deleteBudget.mutate(budget.id)}
                        className="text-sm text-red-600 hover:text-red-800 transition-colors"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                  <div className="relative pt-1">
                    <motion.div 
                      className="overflow-hidden h-2 text-xs flex rounded bg-gray-100"
                      initial={{ opacity: 0, scaleX: 0 }}
                      animate={{ opacity: 1, scaleX: 1 }}
                    >
                      <motion.div
                        style={{ width: `${percentage}%` }}
                        className={`shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center transition-all duration-500 ${calculateProgress(
                          spent,
                          budget.limit
                        )}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: 1 }}
                        transition={{ duration: 0.5 }}
                      ></motion.div>
                    </motion.div>
                  </div>
                </motion.div>
              );
            })}
        </div>
      </div>

      {/* Budget Tips */}
      <motion.div 
        className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100 shadow-sm"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <h2 className="text-lg font-semibold text-blue-900 mb-4">Budget Tips</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Savings Goal</h3>
            <p className="text-sm text-blue-800">Aim to save at least 20% of your income for long-term financial security.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
            <h3 className="text-sm font-medium text-blue-900 mb-2">Essential Expenses</h3>
            <p className="text-sm text-blue-800">Keep essential expenses under 50% of your income for better financial stability.</p>
          </div>
          <div className="bg-white/80 backdrop-blur-sm rounded-lg p-4 border border-blue-100">
            <h3 className="text-sm font-medium text-blue-900 mb-2">50/30/20 Rule</h3>
            <p className="text-sm text-blue-800">Allocate 50% for needs, 30% for wants, and 20% for savings and investments.</p>
          </div>
        </div>
      </motion.div>
    </div>
  );
} 