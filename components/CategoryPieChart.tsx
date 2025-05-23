'use client';

import { useMemo } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, Legend } from 'recharts';
import { formatCurrency } from '@/utils/helpers';

interface Transaction {
  id: string;
  category: string;
  amount: number;
}

interface CategoryPieChartProps {
  transactions: Transaction[];
}

const COLORS = {
  'Income': '#22c55e',      // Green
  'Investment': '#0ea5e9',  // Blue
  'Groceries': '#f97316',   // Orange
  'Healthcare': '#ec4899',  // Pink
  'Transportation': '#8b5cf6', // Purple
  'Insurance': '#06b6d4',   // Cyan
  'Other Expenses': '#64748b', // Slate
  'Cloths': '#eab308',      // Yellow
  'Education - Books': '#6366f1', // Indigo
};

const defaultColor = '#94a3b8'; // Slate-400

export function CategoryPieChart({ transactions }: CategoryPieChartProps) {
  const data = useMemo(() => {
    if (!transactions.length) return [];

    const categoryTotals = transactions.reduce((acc, transaction) => {
      const { category, amount } = transaction;
      if (category === 'Income') return acc;
      
      if (!acc[category]) {
        acc[category] = { name: category, value: 0, total: 0 };
      }
      acc[category].value += Math.abs(amount);
      acc[category].total += amount;
      return acc;
    }, {} as Record<string, { name: string; value: number; total: number }>);

    const totalSpending = Object.values(categoryTotals).reduce((sum, cat) => sum + cat.value, 0);

    return Object.values(categoryTotals)
      .map(category => ({
        ...category,
        percentage: ((category.value / totalSpending) * 100).toFixed(1)
      }))
      .sort((a, b) => b.value - a.value);
  }, [transactions]);

  if (!transactions.length) {
    return (
      <div className="flex items-center justify-center h-[300px] bg-gray-50 rounded-lg border border-gray-200">
        <p className="text-gray-500">No transactions to display</p>
      </div>
    );
  }

  const CustomTooltip = ({ active, payload }: any) => {
    if (!active || !payload?.[0]) return null;

    const data = payload[0].payload;
    return (
      <div className="bg-white p-4 rounded-lg shadow-lg border border-gray-200">
        <p className="font-semibold text-gray-900">{data.name}</p>
        <p className="text-gray-600">
          Amount: {formatCurrency(data.total)}
        </p>
        <p className="text-gray-600">
          Percentage: {data.percentage}%
        </p>
      </div>
    );
  };

  const renderCustomizedLabel = ({
    cx,
    cy,
    midAngle,
    innerRadius,
    outerRadius,
    percent,
    name,
  }: any) => {
    const RADIAN = Math.PI / 180;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    if (percent < 0.05) return null; // Don't show labels for small segments

    return (
      <text
        x={x}
        y={y}
        fill="white"
        textAnchor="middle"
        dominantBaseline="middle"
        className="text-xs font-medium"
      >
        {`${(percent * 100).toFixed(1)}%`}
      </text>
    );
  };

  return (
    <div className="w-full h-[350px] p-2">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart margin={{ top: 0, right: 0, bottom: 0, left: 0 }}>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            label={renderCustomizedLabel}
            outerRadius={110}
            innerRadius={55}
            paddingAngle={1}
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={COLORS[entry.name as keyof typeof COLORS] || defaultColor}
                className="hover:opacity-80 transition-opacity duration-200"
              />
            ))}
          </Pie>
          <Tooltip content={<CustomTooltip />} />
          <Legend 
            layout="vertical" 
            align="right"
            verticalAlign="top"
            wrapperStyle={{
              paddingLeft: '20px',
              maxWidth: '160px',
              fontSize: '0.75rem',
              marginTop: '20px'
            }}
            formatter={(value, entry: any) => {
              const label = `${value} (${entry.payload.percentage}%)`;
              const fontSize = label.length > 20 ? '0.65rem' : '0.75rem';
              return (
                <span 
                  className="text-gray-700 truncate block" 
                  style={{ 
                    maxWidth: '140px',
                    fontSize
                  }}
                >
                  {label}
                </span>
              );
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
} 