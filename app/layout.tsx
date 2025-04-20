import { Inter } from 'next/font/google';
import './globals.css';
import type { Metadata } from 'next';
import ClientLayout from './components/ClientLayout';

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
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.className} min-h-screen`}>
        <div className="min-h-screen bg-gray-50">
          <ClientLayout>
            {children}
          </ClientLayout>
        </div>
      </body>
    </html>
  );
} 