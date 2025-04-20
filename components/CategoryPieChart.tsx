'use client';

import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { formatCurrency } from '@/utils/helpers';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
}

interface CategoryPieChartProps {
  transactions: Transaction[];
}

const COLORS = [
  '#3b82f6', // blue-500
  '#8b5cf6', // violet-500
  '#10b981', // emerald-500
  '#f59e0b', // amber-500
  '#ef4444', // red-500
  '#06b6d4', // cyan-500
  '#d946ef', // fuchsia-500
  '#84cc16', // lime-500
];

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const categoryTotals = transactions.reduce((acc, transaction) => {
    if (transaction.category === 'Income') return acc;
    acc[transaction.category] = (acc[transaction.category] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(categoryTotals)
    .map(([name, value]) => ({
      name,
      value,
    }))
    .sort((a, b) => b.value - a.value);

  const total = data.reduce((sum, item) => sum + item.value, 0);
  const dataWithPercentage = data.map(item => ({
    ...item,
    percentage: (item.value / total) * 100
  }));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-foreground/50">No transactions to display</p>
      </div>
    );
  }

  return (
    <ResponsiveContainer width="100%" height="100%">
      <PieChart>
        <Pie
          data={dataWithPercentage}
          cx="50%"
          cy="50%"
          innerRadius={60}
          outerRadius={80}
          paddingAngle={5}
          dataKey="value"
        >
          {dataWithPercentage.map((entry, index) => (
            <Cell
              key={`cell-${index}`}
              fill={COLORS[index % COLORS.length]}
              stroke="var(--card)"
              strokeWidth={2}
            />
          ))}
        </Pie>
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="bg-white p-4 rounded-lg shadow-lg">
                  <p className="font-semibold">{data.name}</p>
                  <p className="text-sm text-gray-600">
                    Amount: {formatCurrency(data.value)}
                  </p>
                  <p className="text-sm text-gray-600">
                    Percentage: {data.percentage.toFixed(2)}%
                  </p>
                </div>
              );
            }
            return null;
          }}
        />
      </PieChart>
    </ResponsiveContainer>
  );
} 