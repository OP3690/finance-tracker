'use client';

import React, { useState } from 'react';
import { Transaction } from '@/types/transaction';
import { formatCurrency, formatDate } from '@/utils/helpers';
import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight, Edit2, Pencil, Trash2 } from 'lucide-react';
import { UpdateTransactionModal } from './UpdateTransactionModal';
import { DeleteTransactionModal } from './DeleteTransactionModal';

interface TransactionTableProps {
  transactions: Transaction[];
  onPageChange: (page: number) => void;
  currentPage: number;
  totalPages: number;
  onUpdate: (updatedTransaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
}

export default function TransactionTable({
  transactions,
  onPageChange,
  currentPage,
  totalPages,
  onUpdate,
  onDelete,
}: TransactionTableProps) {
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedTransaction, setSelectedTransaction] = useState<Transaction | null>(null);

  const handlePageChange = (page: number) => {
    onPageChange(page);
  };

  const handleUpdate = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsUpdateModalOpen(true);
  };

  const handleDelete = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsDeleteModalOpen(true);
  };

  const handleUpdateSubmit = async (updatedTransaction: Transaction) => {
    try {
      const response = await fetch('/api/transactions', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...updatedTransaction,
          date: updatedTransaction.date.toISOString(),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to update transaction');
      }

      onUpdate(updatedTransaction);
      setIsUpdateModalOpen(false);
    } catch (error) {
      console.error('Error updating transaction:', error);
    }
  };

  const handleDeleteSubmit = async () => {
    if (!selectedTransaction) return;

    try {
      const response = await fetch(`/api/transactions?id=${selectedTransaction.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete transaction');
      }

      onDelete(selectedTransaction.id);
      setIsDeleteModalOpen(false);
    } catch (error) {
      console.error('Error deleting transaction:', error);
    }
  };

  return (
    <div className="space-y-4">
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
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Amount
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Comment
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {transactions.map((transaction) => (
              <tr key={transaction.id} className="hover:bg-gray-50">
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.date.toLocaleDateString()}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.category}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.description}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.amount.toFixed(2)}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  {transaction.comment || '-'}
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                  <div className="flex space-x-2">
                    <button
                      onClick={() => handleUpdate(transaction)}
                      className="text-blue-600 hover:text-blue-900"
                    >
                      <Pencil className="h-4 w-4" />
                    </button>
                    <button
                      onClick={() => handleDelete(transaction)}
                      className="text-red-600 hover:text-red-900"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="flex items-center justify-between">
        <button
          onClick={() => handlePageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronLeft className="h-4 w-4" />
        </button>
        <span className="text-sm text-gray-700">
          Page {currentPage} of {totalPages}
        </span>
        <button
          onClick={() => handlePageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50"
        >
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {selectedTransaction && (
        <UpdateTransactionModal
          isOpen={isUpdateModalOpen}
          onClose={() => setIsUpdateModalOpen(false)}
          transaction={selectedTransaction}
          onUpdate={handleUpdateSubmit}
        />
      )}

      {selectedTransaction && (
        <DeleteTransactionModal
          isOpen={isDeleteModalOpen}
          onClose={() => setIsDeleteModalOpen(false)}
          transaction={selectedTransaction}
          onDelete={handleDeleteSubmit}
        />
      )}
    </div>
  );
} 