'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Transaction } from '@/types/transaction';

interface DailySpendChartProps {
  transactions: Transaction[];
}

const DailySpendChart = ({ transactions }: DailySpendChartProps) => {
  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No transactions to display</p>
      </div>
    );
  }

  // Group transactions by date and calculate daily totals
  const dailyTotals = transactions.reduce((acc, transaction) => {
    const date = transaction.date.split('T')[0]; // Get just the date part
    const amount = Math.abs(transaction.amount);
    acc[date] = (acc[date] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and sort by date
  const data = Object.entries(dailyTotals)
    .map(([date, amount]) => ({
      date: new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      amount: parseFloat(amount.toFixed(2)),
    }))
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
          />
          <Line
            type="monotone"
            dataKey="amount"
            stroke="#8884d8"
            strokeWidth={2}
            dot={{ r: 4 }}
            activeDot={{ r: 8 }}
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default DailySpendChart; 