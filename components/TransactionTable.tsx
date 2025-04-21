'use client';

import React, { useState, useEffect } from 'react';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit2 } from 'lucide-react';
import UpdateTransactionModal from './UpdateTransactionModal';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
  createdAt: string;
}

interface TransactionTableProps {
  transactions: Transaction[];
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
}

export function TransactionTable({ transactions, onPageChange, currentPage, totalPages }: TransactionTableProps) {
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());
  
  // Update current time every minute to handle day changes
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 60000); // Update every minute

    return () => clearInterval(timer);
  }, []);

  const itemsPerPage = 10;
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const isCreatedToday = (createdAt: string): boolean => {
    if (!createdAt) return false;
    
    const now = new Date();
    const created = new Date(createdAt);
    
    // Compare only the date parts (year, month, day)
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const createdDate = new Date(created.getFullYear(), created.getMonth(), created.getDate());
    
    return today.getTime() === createdDate.getTime();
  };

  const handleUpdateClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsUpdateModalOpen(true);
  };

  const renderPaginationButtons = () => {
    const buttons: React.ReactElement[] = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    buttons.push(
      <button
        key="first"
        onClick={() => onPageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronsLeft size={16} />
      </button>
    );

    buttons.push(
      <button
        key="prev"
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronLeft size={16} />
      </button>
    );

    for (let i = startPage; i <= endPage; i++) {
      buttons.push(
        <button
          key={i}
          onClick={() => onPageChange(i)}
          className={`px-3 py-1 rounded-md text-sm font-medium ${
            currentPage === i
              ? 'bg-blue-600 text-white'
              : 'text-gray-700 hover:bg-gray-100'
          }`}
        >
          {i}
        </button>
      );
    }

    buttons.push(
      <button
        key="next"
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight size={16} />
      </button>
    );

    buttons.push(
      <button
        key="last"
        onClick={() => onPageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronsRight size={16} />
      </button>
    );

    return buttons;
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden dark:bg-gray-800">
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead className="bg-gray-50 dark:bg-gray-900">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Date
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Category
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Description
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Amount
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
            {currentTransactions.map((transaction) => {
              return (
                <tr 
                  key={transaction.id}
                  className={`${
                    isCreatedToday(transaction.createdAt) ? 'bg-[#e8fbe8] dark:bg-[#1a3d1a]' : ''
                  } hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150`}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    <div className="flex items-center">
                      <span>{formatDate(new Date(transaction.date))}</span>
                      {isCreatedToday(transaction.createdAt) && (
                        <span className="ml-1 text-xs italic">
                          New
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                    {transaction.description}
                    {transaction.comment && (
                      <span className="ml-2 text-gray-500 dark:text-gray-400">({transaction.comment})</span>
                    )}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                    transaction.category === 'Investment' ? 'text-green-800 dark:text-green-400 font-semibold' : 'text-gray-900 dark:text-gray-100'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() => handleUpdateClick(transaction)}
                      className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 transition-colors duration-150"
                    >
                      <Edit2 size={16} />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200 dark:border-gray-700">
        <div className="text-sm text-gray-700 dark:text-gray-300">
          Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of{' '}
          {transactions.length} results
        </div>
        <div className="flex space-x-2">{renderPaginationButtons()}</div>
      </div>
      {selectedTransaction && (
        <UpdateTransactionModal
          transaction={selectedTransaction}
          onClose={() => setIsUpdateModalOpen(false)}
          onSuccess={() => {
            setIsUpdateModalOpen(false);
          }}
        />
      )}
    </div>
  );
} 