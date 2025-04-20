'use client';

import { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { X } from 'lucide-react';

interface AddTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_DESCRIPTIONS = {
  'Income': ['Salary', 'Bonus', 'Interest', 'Dividend', 'Other Income'],
  'Groceries': ['Eggs', 'Chicken', 'Meat', 'Vegetables', 'Fruits', 'Dairy', 'Snacks', 'Beverages'],
  'Transportation': ['Taxi', 'Train Fare', 'Fuel', 'Parking', 'Maintenance'],
  'Healthcare': ['Medicine', 'Doctor Visit', 'Hospital Bill', 'Health Checkup'],
  'Insurance': ['Health Insurance', 'Car Insurance', 'Home Insurance', 'Life Insurance'],
  'Investment': ['Mutual Funds', 'Stocks', 'Real Estate', 'Fixed Deposit'],
  'Recharge/Bill/EMI Payment': ['Electricity', 'Wifi-Internet', 'Mobile Recharge', 'Loan EMI', 'Subscription'],
  'Other Expenses': ['Repair - Electronics', 'Travel', 'Gifts', 'Entertainment']
};

export default function AddTransactionModal({ isOpen, onClose }: AddTransactionModalProps) {
  const [formData, setFormData] = useState({
    date: new Date().toISOString().split('T')[0],
    category: '',
    description: '',
    amount: '',
    comment: '',
  });

  const [descriptions, setDescriptions] = useState<string[]>([]);

  useEffect(() => {
    if (formData.category) {
      setDescriptions(CATEGORY_DESCRIPTIONS[formData.category as keyof typeof CATEGORY_DESCRIPTIONS] || []);
    } else {
      setDescriptions([]);
    }
  }, [formData.category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await fetch('/api/transactions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          amount: parseFloat(formData.amount),
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to add transaction');
      }

      onClose();
      // Invalidate and refetch
      window.location.reload();
    } catch (error) {
      console.error('Error adding transaction:', error);
    }
  };

  return (
    <Dialog open={isOpen} onClose={onClose} className="relative z-50">
      <div className="fixed inset-0 bg-black/50" aria-hidden="true" />
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <Dialog.Panel className="card w-full max-w-md mx-auto p-6">
          <div className="flex items-center justify-between mb-6">
            <Dialog.Title className="text-xl font-bold text-foreground">
              Add New Transaction
            </Dialog.Title>
            <button
              onClick={onClose}
              className="text-foreground/50 hover:text-foreground transition-colors"
            >
              <X size={24} />
            </button>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                Date
              </label>
              <input
                type="date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                Category
              </label>
              <select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value, description: '' })}
                className="input-field w-full"
                required
              >
                <option value="">Select a category</option>
                {Object.keys(CATEGORY_DESCRIPTIONS).map((category) => (
                  <option key={category} value={category}>
                    {category}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                Description
              </label>
              <select
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="input-field w-full"
                required
              >
                <option value="">Select a description</option>
                {descriptions.map((desc) => (
                  <option key={desc} value={desc}>
                    {desc}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                Amount
              </label>
              <input
                type="number"
                step="0.01"
                value={formData.amount}
                onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                className="input-field w-full"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-foreground/70 mb-1">
                Comment (Optional)
              </label>
              <textarea
                value={formData.comment}
                onChange={(e) => setFormData({ ...formData, comment: e.target.value })}
                className="input-field w-full"
                rows={3}
              />
            </div>

            <div className="flex justify-end space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="btn-secondary"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="btn-primary"
              >
                Add Transaction
              </button>
            </div>
          </form>
        </Dialog.Panel>
      </div>
    </Dialog>
  );
} 