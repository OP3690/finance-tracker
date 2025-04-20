import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import ClientLayout from './components/ClientLayout';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses and manage your finances',
  icons: {
    icon: [
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
      {
        url: '/icon.svg',
        type: 'image/svg+xml',
      },
    ],
    shortcut: [
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
    ],
    apple: [
      {
        url: '/icon.png',
        type: 'image/png',
        sizes: '32x32',
      },
    ],
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();

  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <div className="min-h-screen bg-gray-50">
          <nav className="fixed top-0 left-0 right-0 z-50 bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between h-16">
                <div className="flex items-center">
                  <Link href="/" className="text-xl font-bold text-gray-900">
                    Finance Tracker
                  </Link>
                </div>
                <div className="flex space-x-4">
                  <Link
                    href="/"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Dashboard
                  </Link>
                  <Link
                    href="/transactions"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/transactions' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Transactions
                  </Link>
                  <Link
                    href="/analytics"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/analytics' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Analytics
                  </Link>
                  <Link
                    href="/budget"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/budget' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Budget
                  </Link>
                  <Link
                    href="/settings"
                    className={`px-3 py-2 rounded-md text-sm font-medium ${
                      pathname === '/settings' ? 'bg-gray-100 text-gray-900' : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    Settings
                  </Link>
                </div>
              </div>
            </div>
          </nav>
          <main className="pt-16">
            <ClientLayout>
              {children}
            </ClientLayout>
          </main>
        </div>
      </body>
    </html>
  );
} 