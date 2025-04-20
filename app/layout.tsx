import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/Navbar';
import Providers from './providers';

const inter = Inter({ subsets: ['latin'] });

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${inter.className} min-h-screen`}>
        <Providers>
          <div className="container mx-auto px-4 py-8">
            <Navbar />
            <main className="mt-8">
              {children}
            </main>
          </div>
        </Providers>
      </body>
    </html>
  );
} 