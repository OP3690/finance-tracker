import React from 'react';
import { formatCurrency } from '@/utils/helpers';
import { format } from 'date-fns';

interface KeyFigureCardProps {
  title: string;
  amount: number;
  icon: React.ReactNode;
  bgColor?: string;
}

export default function KeyFigureCard({ title, amount, icon, bgColor = 'bg-primary/10' }: KeyFigureCardProps) {
  const currentMonth = format(new Date(), 'MMM yyyy');
  
  return (
    <div className={`card ${bgColor} p-4`}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-foreground/70">{title}</p>
          <p className="text-2xl font-bold text-foreground mt-1">
            {amount >= 0 ? formatCurrency(amount) : `-${formatCurrency(Math.abs(amount))}`}
          </p>
        </div>
        <div className="p-3 rounded-full bg-white/10">
          {icon}
        </div>
      </div>
    </div>
  );
} 