'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths } from 'date-fns';
import { FaMoneyBillWave, FaPiggyBank, FaChartLine, FaHome, FaCreditCard } from 'react-icons/fa';
import KeyFigureCard from '@/components/KeyFigureCard';
import CategoryPieChart from '@/components/CategoryPieChart';
import DailySpendChart from '@/components/DailySpendChart';
import { formatCurrency, calculatePercentageChange } from '@/utils/helpers';
import { Plus, Trash2, Edit2 } from 'lucide-react';
import AddTransactionModal from '@/components/AddTransactionModal';
import UpdateTransactionModal from '@/components/UpdateTransactionModal';
import { Transaction } from '@/types/transaction';
import { CATEGORIES_WITH_DESCRIPTIONS } from '@/lib/constants';

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [previousMonths, setPreviousMonths] = useState<Date[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const months = Array.from({ length: 3 }, (_, i) => subMonths(currentMonth, i + 1));
    setPreviousMonths(months);
  }, [currentMonth]);

  const { data: transactionsData = [], isLoading: queryLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      return Array.isArray(data) ? data : [];
    },
  });

  useEffect(() => {
    fetchTransactions();
  }, []);

  const fetchTransactions = async () => {
    try {
      const response = await fetch('/api/transactions');
      const data = await response.json();
      setTransactions(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Error fetching transactions:', error);
      setTransactions([]);
    } finally {
      setIsLoading(false);
    }
  };

  const getMonthlyTotal = (month: Date, category?: string) => {
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === month.getMonth() &&
               transactionDate.getFullYear() === month.getFullYear() &&
               (!category || t.category === category);
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCurrentMonthIncome = () => {
    return getMonthlyTotal(currentMonth, 'Income');
  };

  const getCurrentMonthInvestments = () => {
    return getMonthlyTotal(currentMonth, 'Investment');
  };

  const getCurrentMonthEMIs = () => {
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth.getMonth() &&
               transactionDate.getFullYear() === currentMonth.getFullYear() &&
               t.category === 'Recharge/Bill/EMI Payment' &&
               t.description.includes('Loan');
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getCurrentMonthHouseholdExpenses = () => {
    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth.getMonth() &&
               transactionDate.getFullYear() === currentMonth.getFullYear() &&
               !['Income', 'Investment', 'Recharge/Bill/EMI Payment'].includes(t.category);
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getOpeningBalance = () => {
    const previousMonth = subMonths(currentMonth, 1);
    const previousMonthIncome = getMonthlyTotal(previousMonth, 'Income');
    const previousMonthExpenses = getMonthlyTotal(previousMonth) - previousMonthIncome;
    return previousMonthIncome - previousMonthExpenses;
  };

  const getTodayTotal = (category?: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return transactions
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= today &&
               transactionDate < tomorrow &&
               (!category || t.category === category);
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const handleAddTransaction = async (formData: {
    category: string;
    description: string;
    amount: number;
    date: string;
    comment?: string;
  }) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      const newTransaction = await response.json();
      setTransactions([...transactions, newTransaction]);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  const handleUpdateTransaction = async (formData: {
    id: string;
    category: string;
    description: string;
    amount: number;
    date: string;
    comment?: string;
  }) => {
    try {
      const response = await fetch(`/api/transactions/${formData.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: Number(formData.amount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      const updatedTransaction = await response.json();
      setTransactions(
        transactions.map((t) =>
          t.id === updatedTransaction.id ? updatedTransaction : t
        )
      );
      setIsUpdateModalOpen(false);
      setSelectedTransaction(null);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteTransaction = async (id: string) => {
    try {
      const response = await fetch(`/api/transactions/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      setTransactions((prev) => prev.filter((t) => t.id !== id));
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  if (queryLoading || isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  const totalIncome = transactions
    .filter((t) => t.type === 'income')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const totalExpenses = transactions
    .filter((t) => t.type === 'expense')
    .reduce((sum, t) => sum + parseFloat(t.amount), 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-4">
        <h1 className="text-2xl font-bold text-gray-900 mb-4">Dashboard</h1>
        
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
          <div className="bg-gradient-to-r from-green-500 to-green-600 rounded-lg shadow-lg p-4 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Income</h3>
            <p className="text-3xl font-bold">{formatCurrency(totalIncome)}</p>
          </div>
          <div className="bg-gradient-to-r from-red-500 to-red-600 rounded-lg shadow-lg p-4 text-white">
            <h3 className="text-lg font-semibold mb-2">Total Expenses</h3>
            <p className="text-3xl font-bold">{formatCurrency(totalExpenses)}</p>
          </div>
          <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg shadow-lg p-4 text-white">
            <h3 className="text-lg font-semibold mb-2">Balance</h3>
            <p className="text-3xl font-bold">{formatCurrency(balance)}</p>
          </div>
        </div>

        {/* Key Figure Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mb-4">
          <KeyFigureCard
            title="Income (Salary)"
            amount={getCurrentMonthIncome()}
            icon={<FaMoneyBillWave className="text-blue-600" />}
            bgColor="bg-gradient-to-r from-blue-500 to-blue-600"
          />
          <KeyFigureCard
            title="Opening Balance"
            amount={getOpeningBalance()}
            icon={<FaPiggyBank className="text-green-600" />}
            bgColor="bg-gradient-to-r from-green-500 to-green-600"
          />
          <KeyFigureCard
            title="Investments"
            amount={getCurrentMonthInvestments()}
            icon={<FaChartLine className="text-purple-600" />}
            bgColor="bg-gradient-to-r from-purple-500 to-purple-600"
          />
          <KeyFigureCard
            title="Loan EMI Payments"
            amount={getCurrentMonthEMIs()}
            icon={<FaCreditCard className="text-red-600" />}
            bgColor="bg-gradient-to-r from-red-500 to-red-600"
          />
          <KeyFigureCard
            title="Household Expenses"
            amount={getCurrentMonthHouseholdExpenses()}
            icon={<FaHome className="text-orange-600" />}
            bgColor="bg-gradient-to-r from-orange-500 to-orange-600"
          />
        </div>

        {/* Summary Table */}
        <div className="bg-white rounded-lg shadow overflow-hidden mb-4">
          <h2 className="text-xl font-bold text-blue-600 p-4 bg-blue-50">Monthly Summary</h2>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Today
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  {format(currentMonth, 'MMM-yy')}
                </th>
                {previousMonths.map((month, index) => (
                  <th key={index} className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {format(month, 'MMM-yy')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {['Income', 'Groceries', 'Healthcare', 'Transportation', 'Investment', 'Insurance', 'Recharge/Bill/EMI Payment', 'Other Expenses'].map((category) => (
                <tr key={category} className={category === 'Investment' ? 'bg-green-50' : ''}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {formatCurrency(getTodayTotal(category))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                    {formatCurrency(getMonthlyTotal(currentMonth, category))}
                  </td>
                  {previousMonths.map((month, index) => (
                    <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-500">
                      {formatCurrency(getMonthlyTotal(month, category))}
                    </td>
                  ))}
                </tr>
              ))}
              <tr className="bg-red-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Total Expenditure
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(getTodayTotal() - getTodayTotal('Income'))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(getMonthlyTotal(currentMonth) - getMonthlyTotal(currentMonth, 'Income'))}
                </td>
                {previousMonths.map((month, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(getMonthlyTotal(month) - getMonthlyTotal(month, 'Income'))}
                  </td>
                ))}
              </tr>
              <tr className="bg-red-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-red-600">
                  Net Expense
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-red-600">
                  {formatCurrency((getTodayTotal() - getTodayTotal('Income')) - getTodayTotal('Investment'))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-red-600">
                  {formatCurrency((getMonthlyTotal(currentMonth) - getMonthlyTotal(currentMonth, 'Income')) - getMonthlyTotal(currentMonth, 'Investment'))}
                </td>
                {previousMonths.map((month, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-right font-bold text-red-600">
                    {formatCurrency((getMonthlyTotal(month) - getMonthlyTotal(month, 'Income')) - getMonthlyTotal(month, 'Investment'))}
                  </td>
                ))}
              </tr>
              <tr className="bg-yellow-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                  Balance
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(getTodayTotal('Income') - (getTodayTotal() - getTodayTotal('Income')))}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                  {formatCurrency(getMonthlyTotal(currentMonth, 'Income') - (getMonthlyTotal(currentMonth) - getMonthlyTotal(currentMonth, 'Income')))}
                </td>
                {previousMonths.map((month, index) => (
                  <td key={index} className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900">
                    {formatCurrency(getMonthlyTotal(month, 'Income') - (getMonthlyTotal(month) - getMonthlyTotal(month, 'Income')))}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-4">
          <div className="bg-white rounded-lg shadow-lg p-4 h-[400px]">
            <h2 className="text-xl font-semibold mb-4">Spending by Category</h2>
            <div className="h-[300px]">
              <CategoryPieChart transactions={transactions} />
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-4 h-[400px]">
            <h2 className="text-xl font-semibold mb-4">Daily Spending Trend</h2>
            <div className="h-[300px]">
              <DailySpendChart transactions={transactions} />
            </div>
          </div>
        </div>

        {/* Floating Action Button */}
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="fixed bottom-8 right-8 bg-gradient-to-r from-purple-500 to-purple-600 text-white p-4 rounded-full shadow-lg hover:from-purple-600 hover:to-purple-700 transition-colors"
        >
          <Plus size={24} />
        </button>

        {/* Add Transaction Modal */}
        <AddTransactionModal 
          isOpen={isAddModalOpen} 
          onClose={() => setIsAddModalOpen(false)} 
          onAddTransaction={handleAddTransaction} 
        />

        {/* Update Transaction Modal */}
        <UpdateTransactionModal
          isOpen={isUpdateModalOpen}
          onClose={() => {
            setIsUpdateModalOpen(false);
            setSelectedTransaction(null);
          }}
          onUpdate={handleUpdateTransaction}
          transaction={selectedTransaction}
        />
      </div>
    </div>
  );
} 