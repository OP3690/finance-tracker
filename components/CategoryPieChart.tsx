'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { Transaction } from '@/types/transaction';

interface CategoryPieChartProps {
  transactions: Transaction[];
}

const CategoryPieChart = ({ transactions }: CategoryPieChartProps) => {
  if (transactions.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 bg-gray-50 rounded-lg">
        <p className="text-gray-500">No transactions to display</p>
      </div>
    );
  }

  // Calculate category totals
  const categoryTotals = transactions.reduce((acc, transaction) => {
    const amount = Math.abs(transaction.amount);
    acc[transaction.category] = (acc[transaction.category] || 0) + amount;
    return acc;
  }, {} as Record<string, number>);

  // Convert to array and sort by amount
  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);

  // Calculate total for percentage
  const total = data.reduce((sum, item) => sum + item.value, 0);

  // Add percentage to each item
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: ((item.value / total) * 100).toFixed(1)
  }));

  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8', '#82CA9D'];

  return (
    <div className="w-full h-64">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={dataWithPercentage}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={({ name, percentage }) => `${name} (${percentage}%)`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
          >
            {dataWithPercentage.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            formatter={(value: number) => [`₹${value.toLocaleString()}`, 'Amount']}
          />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default CategoryPieChart; 