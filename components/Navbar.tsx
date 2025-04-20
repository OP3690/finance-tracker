'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { FaChartLine, FaMoneyBillWave, FaCog, FaHome } from 'react-icons/fa';

const Navbar = () => {
  const pathname = usePathname();

  const navItems = [
    { href: '/', label: 'Dashboard', icon: FaHome },
    { href: '/transactions', label: 'Transactions', icon: FaMoneyBillWave },
    { href: '/analytics', label: 'Analytics', icon: FaChartLine },
    { href: '/budget', label: 'Budget', icon: FaChartLine },
    { href: '/settings', label: 'Settings', icon: FaCog },
  ];

  return (
    <nav className="glass-effect rounded-xl p-2 mb-8">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <span className="text-2xl font-bold glow-text">$</span>
          <span className="text-xl font-semibold text-foreground">Finance Tracker</span>
        </div>
        <div className="flex space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center px-4 py-2 rounded-lg transition-all duration-200 ${
                  isActive
                    ? 'bg-primary/20 text-primary'
                    : 'text-foreground/70 hover:text-primary hover:bg-primary/10'
                }`}
              >
                <Icon className="w-5 h-5 mr-2" />
                <span className="hidden md:inline">{item.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </nav>
  );
};

export default Navbar; 