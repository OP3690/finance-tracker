'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { Toaster } from 'react-hot-toast';
import { Home, Receipt, PieChart, Wallet, Settings } from 'lucide-react';

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <>
      <nav className="sticky top-0 left-0 right-0 z-50 bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg backdrop-blur-sm bg-opacity-80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Link href="/" className="text-xl font-bold text-white flex items-center space-x-2 hover:opacity-90 transition-opacity">
                <Wallet className="w-8 h-8" />
                <span>Finance Tracker</span>
              </Link>
            </div>
            <div className="flex space-x-1">
              <Link
                href="/"
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
                  pathname === '/' 
                    ? 'bg-white text-blue-600' 
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Home className="w-4 h-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                href="/transactions"
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
                  pathname === '/transactions'
                    ? 'bg-white text-blue-600'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Receipt className="w-4 h-4" />
                <span>Transactions</span>
              </Link>
              <Link
                href="/analytics"
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
                  pathname === '/analytics'
                    ? 'bg-white text-blue-600'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <PieChart className="w-4 h-4" />
                <span>Analytics</span>
              </Link>
              <Link
                href="/budget"
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
                  pathname === '/budget'
                    ? 'bg-white text-blue-600'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Wallet className="w-4 h-4" />
                <span>Budget</span>
              </Link>
              <Link
                href="/settings"
                className={`px-4 py-2 rounded-lg text-sm font-medium flex items-center space-x-2 transition-all duration-200 ${
                  pathname === '/settings'
                    ? 'bg-white text-blue-600'
                    : 'text-white/90 hover:bg-white/10'
                }`}
              >
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </Link>
            </div>
          </div>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 3000,
          style: {
            background: '#fff',
            color: '#363636',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
            borderRadius: '0.5rem',
            fontSize: '0.875rem',
          },
          success: {
            iconTheme: {
              primary: '#059669',
              secondary: '#fff',
            },
          },
          error: {
            iconTheme: {
              primary: '#DC2626',
              secondary: '#fff',
            },
          },
        }}
      />
    </>
  );
} 