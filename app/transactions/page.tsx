'use client';

import { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { formatCurrency, formatDate } from '@/utils/helpers';
import AddTransactionModal from '@/components/AddTransactionModal';
import { toast } from 'react-hot-toast';
import React from 'react';
import { X, Pencil, Trash2 } from 'lucide-react';
import UpdateTransactionModal from '@/components/UpdateTransactionModal';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
}

interface Category {
  id: string;
  name: string;
  descriptions: string[];
}

interface FilterState {
  category: string;
  startDate: string;
  endDate: string;
  minAmount: string;
  maxAmount: string;
  searchTerm: string;
}

export default function TransactionsPage() {
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
    searchTerm: '',
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<Transaction | null>(null);
  const [showUpdateModal, setShowUpdateModal] = useState<string | null>(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const itemsPerPage = 10;
  const queryClient = useQueryClient();

  const { data: categories = [] } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json();
    },
  });

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      return response.json();
    },
  });

  // Set default date range to current month
  React.useEffect(() => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setFilters(prev => ({
      ...prev,
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0],
    }));
  }, []);

  const filteredTransactions = transactions
    .filter((transaction) => {
      if (filters.category && transaction.category !== filters.category) return false;
      if (filters.startDate && new Date(transaction.date) < new Date(filters.startDate)) return false;
      if (filters.endDate && new Date(transaction.date) > new Date(filters.endDate)) return false;
      if (filters.minAmount && transaction.amount < parseFloat(filters.minAmount)) return false;
      if (filters.maxAmount && transaction.amount > parseFloat(filters.maxAmount)) return false;
      if (
        filters.searchTerm &&
        !transaction.description.toLowerCase().includes(filters.searchTerm.toLowerCase()) &&
        !transaction.category.toLowerCase().includes(filters.searchTerm.toLowerCase())
      )
        return false;
      return true;
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  const totalPages = Math.ceil(filteredTransactions.length / itemsPerPage);
  const paginatedTransactions = filteredTransactions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setCurrentPage(1);
  };

  const clearAllFilters = () => {
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    
    setFilters({
      category: '',
      startDate: startOfMonth.toISOString().split('T')[0],
      endDate: endOfMonth.toISOString().split('T')[0],
      minAmount: '',
      maxAmount: '',
      searchTerm: '',
    });
    setCurrentPage(1);
  };

  const removeFilter = (filterName: keyof FilterState) => {
    if (filterName === 'startDate' || filterName === 'endDate') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      
      setFilters(prev => ({
        ...prev,
        startDate: filterName === 'startDate' ? startOfMonth.toISOString().split('T')[0] : prev.startDate,
        endDate: filterName === 'endDate' ? endOfMonth.toISOString().split('T')[0] : prev.endDate,
      }));
    } else {
      setFilters(prev => ({ ...prev, [filterName]: '' }));
    }
    setCurrentPage(1);
  };

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });
      
      if (!response.ok) throw new Error('Failed to delete transaction');
      
      await queryClient.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transaction deleted successfully');
      setShowDeleteConfirm(null);
    } catch (error) {
      toast.error('Failed to delete transaction');
    }
  };

  const handleUpdate = async (id: string) => {
    setShowUpdateModal(id);
  };

  const getAmountColor = (category: string, amount: number) => {
    if (category.toLowerCase() === 'income') return 'text-green-600';
    if (category.toLowerCase() === 'investment') return 'text-emerald-800';
    return 'text-red-600';
  };

  const hasActiveFilters = Object.entries(filters).some(([key, value]) => {
    if (key === 'startDate' || key === 'endDate') {
      const now = new Date();
      const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
      const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 0);
      return value !== (key === 'startDate' ? startOfMonth.toISOString().split('T')[0] : endOfMonth.toISOString().split('T')[0]);
    }
    return value !== '';
  });

  const isToday = (date: string) => {
    const today = new Date();
    const transactionDate = new Date(date);
    return (
      transactionDate.getDate() === today.getDate() &&
      transactionDate.getMonth() === today.getMonth() &&
      transactionDate.getFullYear() === today.getFullYear()
    );
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <p className="mt-2 text-gray-600">View and manage your transactions</p>
      </div>

      <div className="mb-8">
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Add Transaction
        </button>
      </div>

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => {
          setIsAddModalOpen(false);
          setCurrentPage(1);
        }}
      />

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden mt-8">
        <div className="p-6 border-b border-gray-200">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
              <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                Category
              </label>
              <select
                id="category"
                name="category"
                value={filters.category}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">All Categories</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.name}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 mb-1">
                Start Date
              </label>
              <input
                type="date"
                id="startDate"
                name="startDate"
                value={filters.startDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 mb-1">
                End Date
              </label>
              <input
                type="date"
                id="endDate"
                name="endDate"
                value={filters.endDate}
                onChange={handleFilterChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="minAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Min Amount
              </label>
              <input
                type="number"
                id="minAmount"
                name="minAmount"
                value={filters.minAmount}
                onChange={handleFilterChange}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="maxAmount" className="block text-sm font-medium text-gray-700 mb-1">
                Max Amount
              </label>
              <input
                type="number"
                id="maxAmount"
                name="maxAmount"
                value={filters.maxAmount}
                onChange={handleFilterChange}
                placeholder="0.00"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label htmlFor="searchTerm" className="block text-sm font-medium text-gray-700 mb-1">
                Search
              </label>
              <input
                type="text"
                id="searchTerm"
                name="searchTerm"
                value={filters.searchTerm}
                onChange={handleFilterChange}
                placeholder="Search description or category..."
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>

          {hasActiveFilters && (
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                onClick={clearAllFilters}
                className="px-3 py-1 text-sm text-blue-600 hover:text-blue-800"
              >
                Clear All Filters
              </button>
              {filters.category && (
                <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  Category: {filters.category}
                  <button
                    onClick={() => removeFilter('category')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {filters.startDate && new Date(filters.startDate).getTime() !== new Date(new Date().getFullYear(), new Date().getMonth(), 1).getTime() && (
                <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  From: {new Date(filters.startDate).toLocaleDateString()}
                  <button
                    onClick={() => removeFilter('startDate')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {filters.endDate && new Date(filters.endDate).getTime() !== new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getTime() && (
                <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  To: {new Date(filters.endDate).toLocaleDateString()}
                  <button
                    onClick={() => removeFilter('endDate')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {filters.minAmount && (
                <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  Min: {formatCurrency(parseFloat(filters.minAmount))}
                  <button
                    onClick={() => removeFilter('minAmount')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {filters.maxAmount && (
                <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  Max: {formatCurrency(parseFloat(filters.maxAmount))}
                  <button
                    onClick={() => removeFilter('maxAmount')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
              {filters.searchTerm && (
                <div className="inline-flex items-center bg-gray-100 rounded-full px-3 py-1 text-sm">
                  Search: {filters.searchTerm}
                  <button
                    onClick={() => removeFilter('searchTerm')}
                    className="ml-2 text-gray-500 hover:text-gray-700"
                  >
                    <X size={14} />
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Description
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Amount
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {isLoading ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
                    </div>
                  </td>
                </tr>
              ) : paginatedTransactions.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No transactions found
                  </td>
                </tr>
              ) : (
                paginatedTransactions.map((transaction) => (
                  <tr 
                    key={transaction.id} 
                    className={`hover:bg-gray-50 ${isToday(transaction.date) ? 'bg-green-50' : ''}`}
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {formatDate(new Date(transaction.date))}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {transaction.category}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      {transaction.description}
                      {transaction.comment && (
                        <span className="ml-2 text-gray-500">({transaction.comment})</span>
                      )}
                    </td>
                    <td
                      className={`px-6 py-4 whitespace-nowrap text-sm text-right ${getAmountColor(
                        transaction.category,
                        transaction.amount
                      )}`}
                    >
                      {formatCurrency(transaction.amount)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                      <div className="flex items-center justify-center space-x-2">
                        <button
                          onClick={() => handleUpdate(transaction.id)}
                          className="text-blue-600 hover:text-blue-800"
                        >
                          <Pencil size={16} />
                        </button>
                        <button
                          onClick={() => setShowDeleteConfirm(transaction)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage(1)}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                >
                  First
                </button>
                <button
                  onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                  disabled={currentPage === 1}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
              </div>

              <div className="flex items-center space-x-1">
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-md text-sm font-medium ${
                      currentPage === page
                        ? 'bg-blue-600 text-white'
                        : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    {page}
                  </button>
                ))}
              </div>

              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
                <button
                  onClick={() => setCurrentPage(totalPages)}
                  disabled={currentPage === totalPages}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 disabled:opacity-50 hover:bg-gray-50"
                >
                  Last
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      {showUpdateModal && (
        <UpdateTransactionModal
          transaction={transactions.find(t => t.id === showUpdateModal)!}
          onClose={() => setShowUpdateModal(null)}
          onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ['transactions'] });
            setShowUpdateModal(null);
          }}
        />
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
            <p className="mb-4">Do you really want to delete the following record?</p>
            
            <div className="mb-4 space-y-2">
              <div className="flex justify-between">
                <span className="font-medium">Date:</span>
                <span>{formatDate(new Date(showDeleteConfirm.date))}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Category:</span>
                <span>{showDeleteConfirm.category}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Description:</span>
                <span>{showDeleteConfirm.description}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Amount:</span>
                <span className={getAmountColor(showDeleteConfirm.category, showDeleteConfirm.amount)}>
                  {formatCurrency(showDeleteConfirm.amount)}
                </span>
              </div>
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-yellow-700 bg-yellow-100 border border-yellow-300 rounded-md hover:bg-yellow-200"
              >
                Cancel
              </button>
              <button
                onClick={() => handleDelete(showDeleteConfirm.id)}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
} 