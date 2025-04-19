'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import {
  parseAmount,
  parseDate,
  formatCurrency,
  calculatePercentageChange,
  generatePeriods,
  COLORS
} from '@/utils/helpers';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

interface Transaction {
  id: string;
  date: string;
  category: string;
  description: string;
  amount: number;
  comment?: string;
}

interface GroupedData {
  [category: string]: {
    [description: string]: number[];
  };
}

interface SummaryRow {
  category: string;
  description: string;
  amounts: number[];
  percentages: string[];
}

export function DetailedSummary() {
  const { data: transactions, isLoading } = useQuery<Transaction[]>({
    queryKey: ['transactions'],
    queryFn: async () => {
      const response = await fetch('/api/transactions');
      return response.json();
    },
  });

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (!transactions?.length) {
    return (
      <div className="text-center py-8">
        <div className="text-gray-500 text-lg">No transactions found</div>
        <p className="text-gray-400 mt-2">Add your first transaction to get started</p>
      </div>
    );
  }

  const periods = generatePeriods();
  const groupedData: GroupedData = {};
  let totalIncome = new Array(5).fill(0);
  let totalExpenses = new Array(5).fill(0);

  // Group transactions by category and description
  transactions.forEach(transaction => {
    const date = parseDate(transaction.date);
    if (!date) return;

    const category = transaction.category.trim();
    const description = transaction.description.trim();
    const amount = parseAmount(transaction.amount);

    if (!category || !description) return;

    let periodIndex = periods.findIndex(p => p.match(date));
    if (periodIndex < 0) return;

    if (!groupedData[category]) {
      groupedData[category] = {};
    }
    if (!groupedData[category][description]) {
      groupedData[category][description] = new Array(5).fill(0);
    }
    groupedData[category][description][periodIndex] += amount;

    if (category.toLowerCase() === 'income') {
      totalIncome[periodIndex] += amount;
    } else {
      totalExpenses[periodIndex] += amount;
    }
  });

  // Convert grouped data to rows for display
  const summaryRows: SummaryRow[] = [];
  const categories = Object.keys(groupedData).sort((a, b) => {
    if (a.toLowerCase() === 'income') return -1;
    if (b.toLowerCase() === 'income') return 1;
    return a.localeCompare(b);
  });

  categories.forEach(category => {
    const descriptions = Object.keys(groupedData[category]).sort();
    const categoryTotals = new Array(5).fill(0);

    // Add category row
    descriptions.forEach(desc => {
      const amounts = groupedData[category][desc];
      amounts.forEach((amt, i) => categoryTotals[i] += amt);
    });

    summaryRows.push({
      category,
      description: '',
      amounts: categoryTotals,
      percentages: [
        calculatePercentageChange(categoryTotals[1], categoryTotals[2]),
        calculatePercentageChange(categoryTotals[2], categoryTotals[3]),
        calculatePercentageChange(categoryTotals[3], categoryTotals[4])
      ]
    });

    // Add description rows
    descriptions.forEach(desc => {
      const amounts = groupedData[category][desc];
      summaryRows.push({
        category: '',
        description: desc,
        amounts,
        percentages: [
          calculatePercentageChange(amounts[1], amounts[2]),
          calculatePercentageChange(amounts[2], amounts[3]),
          calculatePercentageChange(amounts[3], amounts[4])
        ]
      });
    });
  });

  // Add total expenditure row
  summaryRows.push({
    category: 'Total Expenditure',
    description: '',
    amounts: totalExpenses,
    percentages: [
      calculatePercentageChange(totalExpenses[1], totalExpenses[2]),
      calculatePercentageChange(totalExpenses[2], totalExpenses[3]),
      calculatePercentageChange(totalExpenses[3], totalExpenses[4])
    ]
  });

  // Add balance row
  const balance = totalIncome.map((inc, i) => inc - totalExpenses[i]);
  summaryRows.push({
    category: 'Balance',
    description: '',
    amounts: balance,
    percentages: [
      calculatePercentageChange(balance[1], balance[2]),
      calculatePercentageChange(balance[2], balance[3]),
      calculatePercentageChange(balance[3], balance[4])
    ]
  });

  // Prepare data for trend chart
  const chartData = Object.entries(groupedData)
    .filter(([category]) => category.toLowerCase() !== 'income')
    .flatMap(([category, descMap]) =>
      Object.entries(descMap).map(([description, amounts]) => ({
        description,
        total: amounts.reduce((sum, amount) => sum + amount, 0),
        ...periods.reduce((acc, period, i) => ({
          ...acc,
          [period.label]: amounts[i]
        }), {})
      }))
    )
    .sort((a, b) => b.total - a.total);

  return (
    <div className="space-y-8">
      <div className="overflow-x-auto rounded-lg border border-gray-200">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-blue-600">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Category
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                Description
              </th>
              {periods.map((period, i) => (
                <React.Fragment key={period.label}>
                  <th className="px-4 py-3 text-right text-xs font-medium text-white uppercase tracking-wider">
                    {period.label}
                  </th>
                  {i > 0 && i < 4 && (
                    <th className="px-4 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                      % Change
                    </th>
                  )}
                </React.Fragment>
              ))}
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {summaryRows.map((row, index) => {
              const isCategory = row.description === '';
              const isIncome = row.category.toLowerCase() === 'income';
              const isTotalExpenditure = row.category === 'Total Expenditure';
              const isBalance = row.category === 'Balance';

              let rowClassName = '';
              if (isCategory) {
                if (isIncome) rowClassName = 'bg-green-50';
                else if (!isTotalExpenditure && !isBalance) rowClassName = 'bg-gray-50';
              }
              if (isTotalExpenditure) rowClassName = 'bg-yellow-50';
              if (isBalance) rowClassName = 'bg-blue-50';

              return (
                <tr key={index} className={rowClassName}>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${isCategory ? 'font-bold text-right' : ''}`}>
                    {row.category}
                  </td>
                  <td className={`px-4 py-3 whitespace-nowrap text-sm ${!isCategory ? 'italic' : ''}`}>
                    {row.description}
                  </td>
                  {row.amounts.map((amount, i) => (
                    <React.Fragment key={i}>
                      <td className="px-4 py-3 whitespace-nowrap text-sm text-right">
                        {formatCurrency(amount)}
                      </td>
                      {i > 0 && i < 4 && (
                        <td className={`px-4 py-3 whitespace-nowrap text-sm text-center ${
                          row.percentages[i-1].startsWith('+') ? 
                            (isIncome || isBalance ? 'text-green-600' : 'text-red-600') :
                            (isIncome || isBalance ? 'text-red-600' : 'text-green-600')
                        }`}>
                          {row.percentages[i-1]}
                        </td>
                      )}
                    </React.Fragment>
                  ))}
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      <div className="bg-white p-6 rounded-lg border border-gray-200">
        <h3 className="text-lg font-semibold mb-4">Monthly Trend by Description</h3>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="description" 
                angle={-45} 
                textAnchor="end" 
                height={100}
                tick={{ fontSize: 10 }}
                interval={0}
              />
              <YAxis 
                tickFormatter={(value) => {
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
                }}
              />
              <Tooltip formatter={(value) => formatCurrency(Number(value))} />
              <Legend />
              {periods.map((period, index) => (
                <Bar
                  key={period.label}
                  dataKey={period.label}
                  fill={`hsl(${index * 60}, 70%, 50%)`}
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
} 