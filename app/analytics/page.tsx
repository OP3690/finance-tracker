'use client';

import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/utils/helpers';
import { DetailedSummary } from '@/components/DetailedSummary';
import { Transaction } from '@/types/transaction';

export default function AnalyticsPage() {
  const { data: transactions = [], isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      return response.json();
    },
  });

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Analytics</h1>
      <DetailedSummary />
    </div>
  );
} 