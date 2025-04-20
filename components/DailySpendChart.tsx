'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { format, parseISO } from 'date-fns';
import { formatCurrency } from '@/utils/helpers';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
}

interface DailySpendChartProps {
  transactions: Transaction[];
}

export function DailySpendChart({ transactions }: DailySpendChartProps) {
  const dailyTotals = transactions.reduce((acc, transaction) => {
    if (transaction.category === 'Income') return acc;
    const date = transaction.date.split('T')[0];
    acc[date] = (acc[date] || 0) + Math.abs(transaction.amount);
    return acc;
  }, {} as Record<string, number>);

  const data = Object.entries(dailyTotals)
    .map(([date, amount]) => ({
      date,
      amount,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-foreground/50">No transactions to display</p>
      </div>
    );
  }

  const formatYAxisValue = (value: number) => {
    if (value >= 100000) {
      return `${(value / 100000).toFixed(1)}L`;
    }
    return `${(value / 1000).toFixed(0)}K`;
  };

  return (
    <ResponsiveContainer width="100%" height="100%">
      <LineChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" />
        <XAxis
          dataKey="date"
          tickFormatter={(date) => format(parseISO(date), 'MMM d')}
          stroke="var(--foreground)"
          tick={{ fill: 'var(--foreground)' }}
        />
        <YAxis
          tickFormatter={formatYAxisValue}
          tick={{ fontSize: 12 }}
          axisLine={{ stroke: '#94a3b8' }}
          tickLine={{ stroke: '#94a3b8' }}
          domain={[0, 'dataMax']}
        />
        <Tooltip
          content={({ active, payload }) => {
            if (active && payload && payload.length) {
              const data = payload[0].payload;
              return (
                <div className="card p-3">
                  <p className="font-medium text-foreground">
                    {format(parseISO(data.date), 'MMMM d, yyyy')}
                  </p>
                  <p className="text-primary">{formatCurrency(data.amount)}</p>
                </div>
              );
            }
            return null;
          }}
        />
        <Line
          type="monotone"
          dataKey="amount"
          stroke="var(--primary)"
          strokeWidth={2}
          dot={false}
          activeDot={{ r: 4, fill: 'var(--primary)' }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
} 