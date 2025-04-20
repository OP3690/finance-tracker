'use client';

import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export const metadata = {
  title: 'Expense Tracker',
  description: 'Track your expenses and manage your finances',
  icons: {
    icon: [
      {
        url: '/favicon.ico',
        sizes: 'any',
      },
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
      <head>
        <title>Expense Tracker</title>
        <link rel="icon" href="/icon.png" type="image/png" sizes="32x32" />
      </head>
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          <div className="min-h-screen">
            <Navbar />
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
} 