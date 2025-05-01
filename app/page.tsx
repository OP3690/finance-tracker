'use client';

import React, { useEffect, useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { format, subMonths } from 'date-fns';
import { FaMoneyBillWave, FaPiggyBank, FaChartLine, FaHome, FaCreditCard } from 'react-icons/fa';
import KeyFigureCard from '@/components/KeyFigureCard';
import { CategoryPieChart } from '@/components/CategoryPieChart';
import { DailySpendChart } from '@/components/DailySpendChart';
import { formatCurrency, calculatePercentageChange } from '@/utils/helpers';
import { Plus } from 'lucide-react';
import AddTransactionModal from '@/components/AddTransactionModal';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
}

export default function Dashboard() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [previousMonths, setPreviousMonths] = useState<Date[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const months = Array.from({ length: 3 }, (_, i) => subMonths(currentMonth, i + 1));
    setPreviousMonths(months);
  }, [currentMonth]);

  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      console.log('Fetching transactions for dashboard...');
      const response = await fetch('/api/transactions');
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Failed to fetch transactions:', errorText);
        throw new Error('Failed to fetch transactions');
      }
      const data = await response.json();
      console.log('Received transactions:', data);
      return Array.isArray(data) ? data : [];
    },
  });

  const getMonthlyTotal = (month: Date, category?: string) => {
    console.log('Getting monthly total for:', {
      month: format(month, 'yyyy-MM'),
      category,
      transactions: transactions.length
    });
    
    return (Array.isArray(transactions) ? transactions : [])
      .filter(t => {
        const transactionDate = new Date(t.date);
        const isMatchingMonth = transactionDate.getFullYear() === month.getFullYear() &&
                              transactionDate.getMonth() === month.getMonth();
        const isMatchingCategory = !category || t.category === category;
        
        console.log('Filtering transaction:', {
          id: t.id,
          date: format(transactionDate, 'yyyy-MM-dd'),
          transactionMonth: format(transactionDate, 'yyyy-MM'),
          targetMonth: format(month, 'yyyy-MM'),
          category: t.category,
          amount: t.amount,
          isMatchingMonth,
          isMatchingCategory
        });
        
        return isMatchingMonth && isMatchingCategory;
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
    return (Array.isArray(transactions) ? transactions : [])
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
    return (Array.isArray(transactions) ? transactions : [])
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === currentMonth.getMonth() &&
               transactionDate.getFullYear() === currentMonth.getFullYear() &&
               !['Income', 'Investment', 'Recharge/Bill/EMI Payment'].includes(t.category);
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  const getOpeningBalance = () => {
    // Get the last day of previous month
    const today = new Date();
    const firstDayOfCurrentMonth = new Date(today.getFullYear(), today.getMonth(), 1);
    const lastDayOfPreviousMonth = new Date(firstDayOfCurrentMonth);
    lastDayOfPreviousMonth.setDate(0); // This will set to the last day of previous month

    // Calculate all income and expenses up to the last day of previous month
    const previousMonthTransactions = (Array.isArray(transactions) ? transactions : [])
      .filter((t) => {
        const transactionDate = new Date(t.date);
        return transactionDate.getMonth() === lastDayOfPreviousMonth.getMonth() &&
               transactionDate.getFullYear() === lastDayOfPreviousMonth.getFullYear();
      });

    const previousMonthIncome = previousMonthTransactions
      .filter(t => t.category === 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    const previousMonthExpenses = previousMonthTransactions
      .filter(t => t.category !== 'Income')
      .reduce((sum, t) => sum + t.amount, 0);

    console.log('Opening Balance Calculation:', {
      lastDayOfPreviousMonth: format(lastDayOfPreviousMonth, 'yyyy-MM-dd'),
      previousMonthIncome,
      previousMonthExpenses,
      openingBalance: previousMonthIncome - previousMonthExpenses
    });

    return previousMonthIncome - previousMonthExpenses;
  };

  const getTodayTotal = (category?: string) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return (Array.isArray(transactions) ? transactions : [])
      .filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate >= today &&
               transactionDate < tomorrow &&
               (!category || t.category === category);
      })
      .reduce((sum, t) => sum + t.amount, 0);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-pulse text-primary">Loading...</div>
      </div>
    );
  }

  const totalIncome = (Array.isArray(transactions) ? transactions : [])
    .filter((t) => {
      const transactionDate = new Date(t.date);
      const now = new Date();
      return t.category === 'Income' && 
             transactionDate.getMonth() === now.getMonth() &&
             transactionDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0) + getOpeningBalance();

  const totalExpenses = (Array.isArray(transactions) ? transactions : [])
    .filter((t) => {
      const transactionDate = new Date(t.date);
      const now = new Date();
      return t.category !== 'Income' && 
             transactionDate.getMonth() === now.getMonth() &&
             transactionDate.getFullYear() === now.getFullYear();
    })
    .reduce((sum, t) => sum + t.amount, 0);

  const balance = totalIncome - totalExpenses;

  return (
    <div className="space-y-8">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card gradient-border p-6">
          <h3 className="text-lg font-semibold text-foreground/80 mb-2">Total Income (Inc. Opening Balance)</h3>
          <p className="text-3xl font-bold glow-text">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="card gradient-border p-6">
          <h3 className="text-lg font-semibold text-foreground/80 mb-2">Total Expenses</h3>
          <p className="text-3xl font-bold text-red-400">{formatCurrency(totalExpenses)}</p>
        </div>
        <div className="card gradient-border p-6">
          <h3 className="text-lg font-semibold text-foreground/80 mb-2">Balance</h3>
          <p className={`text-3xl font-bold ${balance >= 0 ? 'glow-text' : 'text-red-400'}`}>
            {formatCurrency(balance)}
          </p>
        </div>
      </div>

      {/* Key Figure Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
        <KeyFigureCard
          title="Income (Salary)"
          amount={getCurrentMonthIncome()}
          icon={<FaMoneyBillWave className="text-primary" />}
          bgColor="bg-primary/10"
        />
        <KeyFigureCard
          title="Opening Balance"
          amount={getOpeningBalance()}
          icon={<FaPiggyBank className="text-accent" />}
          bgColor="bg-accent/10"
        />
        <KeyFigureCard
          title="Investments"
          amount={getCurrentMonthInvestments()}
          icon={<FaChartLine className="text-secondary" />}
          bgColor="bg-secondary/10"
        />
        <KeyFigureCard
          title="Loan EMI Payments"
          amount={getCurrentMonthEMIs()}
          icon={<FaCreditCard className="text-red-400" />}
          bgColor="bg-red-400/10"
        />
        <KeyFigureCard
          title="Household Expenses"
          amount={getCurrentMonthHouseholdExpenses()}
          icon={<FaHome className="text-orange-400" />}
          bgColor="bg-orange-400/10"
        />
      </div>

      {/* Summary Table */}
      <div className="card overflow-hidden">
        <h2 className="text-xl font-bold text-white p-4 bg-blue-500 bg-opacity-90">Monthly Summary</h2>
        <div className="table-container">
          <table className="min-w-full divide-y divide-border/20">
            <thead className="table-header">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider">
                  Category
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  Today
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                  {format(currentMonth, 'MMM-yy')}
                </th>
                {previousMonths.map((month, index) => (
                  <th key={index} className="px-6 py-3 text-right text-xs font-medium uppercase tracking-wider">
                    {format(month, 'MMM-yy')}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
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
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Spending by Category (Current Month)</h2>
          <div className="h-[300px]">
            <CategoryPieChart 
              transactions={transactions.filter(t => {
                const transactionDate = new Date(t.date);
                const now = new Date();
                return transactionDate.getMonth() === now.getMonth() &&
                       transactionDate.getFullYear() === now.getFullYear();
              })} 
            />
          </div>
        </div>
        <div className="card p-6">
          <h2 className="text-xl font-semibold mb-4 text-foreground">Daily Spending Trend (Current Month)</h2>
          <div className="h-[300px]">
            <DailySpendChart 
              transactions={transactions.filter(t => {
                const transactionDate = new Date(t.date);
                const now = new Date();
                return transactionDate.getMonth() === now.getMonth() &&
                       transactionDate.getFullYear() === now.getFullYear();
              })} 
            />
          </div>
        </div>
      </div>

      {/* Floating Action Button */}
      <button
        onClick={() => setIsModalOpen(true)}
        className="fixed bottom-8 right-8 btn-primary rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-200"
      >
        <Plus size={24} />
      </button>

      {/* Add Transaction Modal */}
      <AddTransactionModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
} 