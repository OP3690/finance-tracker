'use client';

import React, { useState } from 'react';
import { Transaction } from '@prisma/client';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit2 } from 'lucide-react';
import UpdateTransactionModal from './UpdateTransactionModal';

interface TransactionTableProps {
  transactions: Transaction[];
}

export function TransactionTable({ transactions }: TransactionTableProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  
  const itemsPerPage = 10;
  const totalPages = Math.ceil(transactions.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentTransactions = transactions.slice(startIndex, endIndex);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleUpdateClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsUpdateModalOpen(true);
  };

  const renderPaginationButtons = () => {
    const buttons = [];
    const maxVisibleButtons = 5;
    let startPage = Math.max(1, currentPage - Math.floor(maxVisibleButtons / 2));
    let endPage = Math.min(totalPages, startPage + maxVisibleButtons - 1);

    if (endPage - startPage + 1 < maxVisibleButtons) {
      startPage = Math.max(1, endPage - maxVisibleButtons + 1);
    }

    buttons.push(
      <button
        key="first"
        onClick={() => handlePageChange(1)}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronsLeft size={16} />
      </button>
    );

    buttons.push(
      <button
        key="prev"
        onClick={() => handlePageChange(currentPage - 1)}
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
          onClick={() => handlePageChange(i)}
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
        onClick={() => handlePageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronRight size={16} />
      </button>
    );

    buttons.push(
      <button
        key="last"
        onClick={() => handlePageChange(totalPages)}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-100 disabled:opacity-50"
      >
        <ChevronsRight size={16} />
      </button>
    );

    return buttons;
  };

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
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
            {currentTransactions.map((transaction) => {
              const transactionDate = new Date(transaction.date);
              transactionDate.setHours(0, 0, 0, 0);
              const isToday = transactionDate.getTime() === today.getTime();

              return (
                <tr 
                  key={transaction.id}
                  className={isToday ? 'bg-orange-50' : ''}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {formatDate(new Date(transaction.date))}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.category}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {transaction.description}
                  </td>
                  <td className={`px-6 py-4 whitespace-nowrap text-sm text-right ${
                    transaction.category === 'Investment' ? 'text-green-800 font-semibold' : 'text-gray-900'
                  }`}>
                    {formatCurrency(transaction.amount)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-center">
                    <button
                      onClick={() => handleUpdateClick(transaction)}
                      className="text-blue-600 hover:text-blue-800"
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
      <div className="px-6 py-4 flex items-center justify-between border-t border-gray-200">
        <div className="text-sm text-gray-700">
          Showing {startIndex + 1} to {Math.min(endIndex, transactions.length)} of{' '}
          {transactions.length} results
        </div>
        <div className="flex space-x-2">{renderPaginationButtons()}</div>
      </div>
      {selectedTransaction && (
        <UpdateTransactionModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
} 