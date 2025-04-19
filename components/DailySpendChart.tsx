'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/types/transaction';

interface DailySpendChartProps {
  transactions: Transaction[];
}

const DailySpendChart = ({ transactions }: DailySpendChartProps) => {
  if (!transactions.length) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  const dailyTotals = transactions.reduce((acc, transaction) => {
    const date = new Date(transaction.date).toLocaleDateString();
    acc[date] = (acc[date] || 0) + transaction.amount;
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(dailyTotals)
    .map(([date, amount]) => ({
      date,
      amount: Math.abs(amount),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySpendChart; 