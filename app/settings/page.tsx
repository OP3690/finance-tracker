'use client';

import { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Plus, Trash2, Edit2, ChevronRight, Save, X, BarChart2, AlertTriangle } from 'lucide-react';

interface Category {
  id: string;
  name: string;
  descriptions: string[];
}

interface DescriptionUsage {
  description: string;
  count: number;
  percentage: number;
  lastThreeMonthsCount: number;
}

export default function SettingsPage() {
  const [newCategory, setNewCategory] = useState('');
  const [newDescription, setNewDescription] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [editingDescription, setEditingDescription] = useState<{ id: string; text: string; originalText: string } | null>(null);
  const [isAddingDescription, setIsAddingDescription] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState<{
    description: string;
    categoryId: string;
    descriptionId: string;
    lastThreeMonthsCount: number;
  } | null>(null);
  const queryClient = useQueryClient();

  const { data: categories = [], isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: async () => {
      const response = await fetch('/api/categories');
      return response.json();
    },
  });

  const { data: transactions = [] } = useQuery({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      return response.json();
    },
  });

  // Calculate description usage analytics with last 3 months count
  const descriptionUsage: DescriptionUsage[] = transactions.reduce((acc: DescriptionUsage[], transaction: { description: string; date: string }) => {
    const existing = acc.find(item => item.description === transaction.description);
    const transactionDate = new Date(transaction.date);
    const threeMonthsAgo = new Date();
    threeMonthsAgo.setMonth(threeMonthsAgo.getMonth() - 3);

    if (existing) {
      existing.count++;
      if (transactionDate >= threeMonthsAgo) {
        existing.lastThreeMonthsCount++;
      }
    } else {
      acc.push({ 
        description: transaction.description, 
        count: 1, 
        percentage: 0,
        lastThreeMonthsCount: transactionDate >= threeMonthsAgo ? 1 : 0
      });
    }
    return acc;
  }, []);

  // Calculate percentages
  const totalTransactions = transactions.length;
  descriptionUsage.forEach(item => {
    item.percentage = (item.count / totalTransactions) * 100;
  });

  // Sort by usage
  descriptionUsage.sort((a, b) => b.count - a.count);

  const addCategoryMutation = useMutation({
    mutationFn: async (name: string) => {
      const response = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, descriptions: [] }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewCategory('');
    },
  });

  const addDescriptionMutation = useMutation({
    mutationFn: async ({ categoryId, description }: { categoryId: string; description: string }) => {
      const response = await fetch(`/api/categories/${categoryId}/descriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setNewDescription('');
      setIsAddingDescription(false);
    },
  });

  const updateDescriptionMutation = useMutation({
    mutationFn: async ({ categoryId, descriptionId, newDescription }: { 
      categoryId: string; 
      descriptionId: string; 
      newDescription: string 
    }) => {
      const response = await fetch(`/api/categories/${categoryId}/descriptions/${descriptionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description: newDescription }),
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
      setEditingDescription(null);
    },
  });

  const deleteDescriptionMutation = useMutation({
    mutationFn: async ({ categoryId, descriptionId }: { categoryId: string; descriptionId: string }) => {
      const response = await fetch(`/api/categories/${categoryId}/descriptions/${descriptionId}`, {
        method: 'DELETE',
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const moveDescriptionMutation = useMutation({
    mutationFn: async ({ 
      fromCategoryId, 
      toCategoryId, 
      description 
    }: { 
      fromCategoryId: string; 
      toCategoryId: string; 
      description: string 
    }) => {
      // First delete from old category
      await fetch(`/api/categories/${fromCategoryId}/descriptions`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
      // Then add to new category
      await fetch(`/api/categories/${toCategoryId}/descriptions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ description }),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['categories'] });
    },
  });

  const handleDeleteClick = (categoryId: string, descriptionId: string, description: string) => {
    const usage = descriptionUsage.find(item => item.description === description);
    setShowDeleteModal({
      description,
      categoryId,
      descriptionId,
      lastThreeMonthsCount: usage?.lastThreeMonthsCount || 0
    });
  };

  const handleConfirmDelete = () => {
    if (showDeleteModal) {
      deleteDescriptionMutation.mutate({
        categoryId: showDeleteModal.categoryId,
        descriptionId: showDeleteModal.descriptionId,
      });
      setShowDeleteModal(null);
    }
  };

  const getDescriptionColor = (lastThreeMonthsCount: number, totalTransactions: number) => {
    const percentage = (lastThreeMonthsCount / totalTransactions) * 100;
    if (percentage > 25) {
      return 'bg-green-50 hover:bg-green-100';
    } else if (percentage > 0) {
      return 'bg-yellow-50 hover:bg-yellow-100';
    } else {
      return 'bg-red-50 hover:bg-red-100';
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Category Settings</h1>
        <p className="mt-2 text-gray-600">Manage your transaction categories and descriptions</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Categories List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Categories</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {categories.map((category) => (
              <div
                key={category.id}
                className={`px-6 py-4 cursor-pointer hover:bg-gray-50 ${
                  selectedCategory?.id === category.id ? 'bg-blue-50' : ''
                }`}
                onClick={() => setSelectedCategory(category)}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-sm font-medium text-gray-900">{category.name}</span>
                    <span className="ml-2 text-xs text-gray-500">
                      ({category.descriptions.length})
                    </span>
                  </div>
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                </div>
              </div>
            ))}
          </div>
          <div className="px-6 py-4 border-t border-gray-200">
            <div className="flex">
              <input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
                placeholder="Add new category"
                className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <button
                onClick={() => addCategoryMutation.mutate(newCategory)}
                disabled={!newCategory.trim()}
                className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50"
              >
                <Plus className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Descriptions List */}
        <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-200 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-gray-900">
              {selectedCategory ? `${selectedCategory.name} Descriptions` : 'Select a Category'}
            </h2>
            {selectedCategory && (
              <button
                onClick={() => setShowAnalytics(!showAnalytics)}
                className="flex items-center text-sm text-blue-600 hover:text-blue-800"
              >
                <BarChart2 className="h-4 w-4 mr-1" />
                {showAnalytics ? 'Hide Analytics' : 'Show Analytics'}
              </button>
            )}
          </div>
          {selectedCategory ? (
            <>
              {showAnalytics && (
                <div className="px-6 py-4 border-b border-gray-200">
                  <h3 className="text-sm font-medium text-gray-900 mb-3">Description Usage Analytics</h3>
                  <div className="space-y-2">
                    {descriptionUsage
                      .filter(item => selectedCategory.descriptions.includes(item.description))
                      .map((item, index) => (
                        <div key={index} className="flex items-center">
                          <div className="flex-1">
                            <div className="text-sm text-gray-900">{item.description}</div>
                            <div className="text-xs text-gray-500">
                              Used {item.count} times ({item.percentage.toFixed(1)}%)
                            </div>
                          </div>
                          <div className="w-32 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div
                              className="h-full bg-blue-500"
                              style={{ width: `${item.percentage}%` }}
                            ></div>
                          </div>
                        </div>
                      ))}
                  </div>
                </div>
              )}
              <div className="divide-y divide-gray-200">
                {selectedCategory.descriptions.map((description, index) => {
                  const usage = descriptionUsage.find(item => item.description === description);
                  const totalTransactions = transactions.length;
                  const colorClass = getDescriptionColor(usage?.lastThreeMonthsCount || 0, totalTransactions);
                  
                  return (
                    <div key={index} className={`px-6 py-4 ${colorClass}`}>
                      <div className="flex items-center justify-between">
                        {editingDescription?.id === `${selectedCategory.id}-${index}` ? (
                          <div className="flex-1 flex items-center space-x-2">
                            <input
                              type="text"
                              value={editingDescription.text}
                              onChange={(e) => setEditingDescription({ ...editingDescription, text: e.target.value })}
                              className="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                              autoFocus
                            />
                            <button
                              onClick={() => {
                                if (editingDescription.text.trim()) {
                                  updateDescriptionMutation.mutate({
                                    categoryId: selectedCategory.id,
                                    descriptionId: `${selectedCategory.id}-${index}`,
                                    newDescription: editingDescription.text,
                                  });
                                }
                              }}
                              className="p-2 text-green-600 hover:text-green-700"
                            >
                              <Save className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => setEditingDescription(null)}
                              className="p-2 text-red-600 hover:text-red-700"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </div>
                        ) : (
                          <>
                            <span className="text-sm text-gray-900">{description}</span>
                            <div className="flex items-center space-x-2">
                              <button
                                onClick={() => setEditingDescription({ 
                                  id: `${selectedCategory.id}-${index}`, 
                                  text: description,
                                  originalText: description
                                })}
                                className="text-gray-400 hover:text-gray-500"
                              >
                                <Edit2 className="h-4 w-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteClick(selectedCategory.id, `${selectedCategory.id}-${index}`, description)}
                                className="text-gray-400 hover:text-red-500"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
              <div className="px-6 py-4 border-t border-gray-200">
                {isAddingDescription ? (
                  <div className="flex">
                    <input
                      type="text"
                      value={newDescription}
                      onChange={(e) => setNewDescription(e.target.value)}
                      placeholder="Add new description"
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                    <button
                      onClick={() => {
                        if (newDescription.trim()) {
                          addDescriptionMutation.mutate({
                            categoryId: selectedCategory.id,
                            description: newDescription,
                          });
                        }
                      }}
                      className="px-4 py-2 bg-blue-600 text-white rounded-r-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <Plus className="h-5 w-5" />
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => setIsAddingDescription(true)}
                    className="w-full px-4 py-2 text-sm text-blue-600 hover:text-blue-800"
                  >
                    + Add Description
                  </button>
                )}
              </div>
            </>
          ) : (
            <div className="px-6 py-8 text-center text-gray-500">
              Select a category to view and manage its descriptions
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <div className="flex items-center mb-4">
              <AlertTriangle className="h-6 w-6 text-red-500 mr-2" />
              <h3 className="text-lg font-semibold">Confirm Deletion</h3>
            </div>
            <p className="mb-4">
              Do You Really Want to Remove{' '}
              <span className="text-red-500 font-bold underline">
                {showDeleteModal.description}
              </span>
              {' '}Sub Category
              {showDeleteModal.lastThreeMonthsCount > 0 && (
                <span className="text-gray-600">
                  ? It has been used{' '}
                  <span className="text-black font-bold">
                    {showDeleteModal.lastThreeMonthsCount}
                  </span>
                  {' '}times in the last 3 months.
                </span>
              )}
            </p>
            <div className="flex justify-end space-x-4">
              <button
                onClick={() => setShowDeleteModal(null)}
                className="px-4 py-2 text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
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