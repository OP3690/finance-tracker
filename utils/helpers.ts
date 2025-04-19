// Helper functions for finance tracker

export const parseAmount = (amount: string | number): number => {
  if (typeof amount === 'number') return amount;
  return parseFloat(amount.replace(/[^0-9.-]+/g, ''));
};

export const formatCurrency = (amount: number): string => {
  return `₹${Math.abs(amount).toLocaleString('en-IN', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
};

export const parseDate = (date: string | Date): Date => {
  return typeof date === 'string' ? new Date(date) : date;
};

export const calculatePercentageChange = (current: number, previous: number): string => {
  if (previous === 0) return current === 0 ? "0%" : "N/A";
  const change = ((current - previous) / previous) * 100;
  return `${change >= 0 ? "+" : ""}${change.toFixed(2)}%`;
};

export const formatDate = (date: Date, format: string = "dd/MM/yyyy"): string => {
  const day = date.getDate().toString().padStart(2, "0");
  const month = (date.getMonth() + 1).toString().padStart(2, "0");
  const year = date.getFullYear();
  return format
    .replace("dd", day)
    .replace("MM", month)
    .replace("yyyy", year.toString())
    .replace("yy", year.toString().slice(-2));
};

export const formatMonthYear = (date: Date): string => {
  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
  return `${months[date.getMonth()]}-${date.getFullYear().toString().slice(-2)}`;
};

export const getWeekNumber = (date: Date): number => {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const firstThursday = target.valueOf();
  target.setMonth(0, 1);
  if (target.getDay() !== 4) {
    target.setMonth(0, 1 + ((4 - target.getDay() + 7) % 7));
  }
  return 1 + Math.ceil((firstThursday - target.valueOf()) / 604800000);
};

export interface Period {
  label: string;
  match: (date: Date) => boolean;
}

export const generatePeriods = (today: Date = new Date()): Period[] => {
  return [
    {
      label: `Today (${formatDate(today)})`,
      match: (date: Date) => {
        const d = new Date(date);
        d.setHours(0, 0, 0, 0);
        const t = new Date(today);
        t.setHours(0, 0, 0, 0);
        return d.getTime() === t.getTime();
      }
    },
    {
      label: `Current Month (${formatMonthYear(today)})`,
      match: (date: Date) => 
        date.getFullYear() === today.getFullYear() && 
        date.getMonth() === today.getMonth()
    },
    ...[1, 2, 3].map(i => {
      const dt = new Date(today.getFullYear(), today.getMonth() - i, 1);
      return {
        label: formatMonthYear(dt),
        match: (date: Date) =>
          date.getFullYear() === dt.getFullYear() && 
          date.getMonth() === dt.getMonth()
      };
    })
  ];
};

export const COLORS = {
  // Chart colors
  income: '#4CAF50',
  expense: '#F44336',
  investment: '#2196F3',
  total: '#9C27B0',
  balance: '#FF9800',
  positive: '#4CAF50',
  negative: '#F44336',
  neutral: '#9E9E9E',
  chart: [
    '#2196F3',
    '#4CAF50',
    '#F44336',
    '#FFC107',
    '#9C27B0',
    '#00BCD4',
    '#FF5722',
    '#795548',
    '#607D8B',
    '#E91E63',
  ],
  // Tailwind classes
  header: "bg-blue-600",
  headerText: "text-white",
  totalExpenditure: "bg-yellow-100",
  categoryHeader: "bg-gray-100",
  incomeHeader: "bg-green-50"
}; 