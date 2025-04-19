'use client';

import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { formatCurrency } from '@/utils/helpers';

interface Transaction {
  id: string;
  date: Date;
  category: string;
  description: string;
  amount: number;
  comment?: string;
}

interface DailySpendChartProps {
  transactions: Transaction[];
}

const formatYAxisValue = (value: number) => {
  if (value >= 500000) return '>5L';
  if (value >= 450000) return '>4.5L';
  if (value >= 400000) return '>4L';
  if (value >= 350000) return '>3.5L';
  if (value >= 300000) return '3L';
  if (value >= 250000) return '2.5L';
  if (value >= 200000) return '2.0L';
  if (value >= 150000) return '1.5L';
  if (value >= 100000) return '1L';
  if (value >= 50000) return '50K';
  if (value >= 25000) return '25K';
  if (value >= 10000) return '10K';
  if (value >= 5000) return '5K';
  if (value >= 3000) return '3K';
  if (value >= 1000) return '1K';
  return value.toString();
};

export default function DailySpendChart({ transactions }: DailySpendChartProps) {
  if (!transactions || transactions.length === 0) {
    return <div className="text-center p-4">No transactions to display</div>;
  }

  const dailyTotals = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toISOString().split('T')[0];
    acc[date] = (acc[date] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(dailyTotals)
    .map(([date, amount]) => ({
      date,
      amount: Math.abs(amount),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const yAxisTicks = [1000, 3000, 5000, 10000, 25000, 50000, 100000, 150000, 200000, 250000, 300000, 400000, 450000, 500000];

  return (
    <div className="h-[300px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            dataKey="date" 
            tickFormatter={(date) => new Date(date).toLocaleDateString()}
            tick={{ fontSize: 12 }}
          />
          <YAxis 
            tickFormatter={formatYAxisValue}
            ticks={yAxisTicks}
            tick={{ fontSize: 12 }}
          />
          <Tooltip 
            formatter={(value: number) => formatCurrency(value)}
            labelFormatter={(date) => new Date(date).toLocaleDateString()}
            contentStyle={{ fontSize: '12px' }}
          />
          <Line 
            type="monotone" 
            dataKey="amount" 
            stroke="#8884d8" 
            strokeWidth={2}
            dot={false}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
} 