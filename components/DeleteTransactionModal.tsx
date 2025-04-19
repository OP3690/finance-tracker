import { Transaction } from '@/types/transaction';

interface DeleteTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
  onDelete: () => void;
}

export function DeleteTransactionModal({
  isOpen,
  onClose,
  transaction,
  onDelete,
}: DeleteTransactionModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-semibold mb-4">Delete Transaction</h2>
        <p className="mb-4">
          Are you sure you want to delete this transaction?
          <br />
          <span className="font-medium">
            {transaction.description} - {transaction.amount.toFixed(2)}
          </span>
        </p>
        <div className="flex justify-end space-x-2">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
          >
            Cancel
          </button>
          <button
            onClick={onDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
} 