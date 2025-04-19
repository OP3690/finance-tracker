import React from 'react';
import { formatCurrency } from '@/utils/helpers';
import { format } from 'date-fns';

interface KeyFigureCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  bgColor?: string;
}

export default function KeyFigureCard({ title, amount, icon, bgColor = 'bg-gradient-to-r from-blue-500 to-blue-600' }: KeyFigureCardProps) {
  const currentMonth = format(new Date(), 'MMM yyyy');
  
  return (
    <div className={`${bgColor} rounded-lg shadow-lg p-4 text-white`}>
      <div className="flex items-center justify-between mb-2">
        <h3 className="text-sm font-medium">{title}</h3>
        {icon}
      </div>
      <p className="text-2xl font-bold">{formatCurrency(amount)}</p>
    </div>
  );
} 