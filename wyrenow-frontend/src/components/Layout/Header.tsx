import React from 'react';
import { Menu, Bell, Wallet, Sun, Moon, Globe, ChevronDown } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useApp } from '../../contexts/AppContext';

interface HeaderProps {
  onMenuClick: () => void;
}

export default function Header({ onMenuClick }: HeaderProps) {
  const { user, logout } = useAuth();
  const { wallet, currency, setCurrency, darkMode, toggleDarkMode } = useApp();

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <header className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 px-4 lg:px-6 h-16 flex items-center justify-between">
      {/* Left section */}
      <div className="flex items-center space-x-4">
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          <Menu className="w-5 h-5 text-gray-600 dark:text-gray-400" />
        </button>
        
        <div className="hidden sm:block">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
            Welcome back, {user?.firstName}!
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {user?.rank.name} • {user?.package.name} Package
          </p>
        </div>
      </div>

      {/* Right section */}
      <div className="flex items-center space-x-4">
        {/* Wallet balances */}
        <div className="hidden md:flex items-center space-x-4">
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <Wallet className="w-4 h-4 text-green-600 dark:text-green-400" />
            <div className="text-sm">
              <p className="font-medium text-green-800 dark:text-green-300">
                {formatCurrency(wallet.earningsBalance)}
              </p>
              <p className="text-xs text-green-600 dark:text-green-400">Earnings</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2 px-3 py-1.5 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
            <Wallet className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <div className="text-sm">
              <p className="font-medium text-amber-800 dark:text-amber-300">
                {formatCurrency(wallet.awaitingBalance)}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">Awaiting</p>
            </div>
          </div>
        </div>

        {/* Currency selector */}
        <div className="relative">
          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value as 'NGN' | 'GHS')}
            className="appearance-none bg-gray-100 dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg px-3 py-1.5 text-sm font-medium text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="NGN">₦ NGN</option>
            <option value="GHS">GH₵ GHS</option>
          </select>
          <Globe className="absolute right-2 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        </div>

        {/* Dark mode toggle */}
        <button
          onClick={toggleDarkMode}
          className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
        >
          {darkMode ? (
            <Sun className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          ) : (
            <Moon className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          )}
        </button>

        {/* Notifications */}
        <button className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors relative">
          <Bell className="w-5 h-5 text-gray-600 dark:text-gray-400" />
          <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
        </button>

        {/* User menu */}
        <div className="relative group">
          <button className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors">
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.firstName}+${user?.lastName}&background=3b82f6&color=white`}
              alt={`${user?.firstName} ${user?.lastName}`}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="hidden sm:block text-left">
              <p className="text-sm font-medium text-gray-900 dark:text-white">
                {user?.firstName} {user?.lastName}
              </p>
              <p className="text-xs text-gray-500 dark:text-gray-400">{user?.rank.name}</p>
            </div>
            <ChevronDown className="w-4 h-4 text-gray-400" />
          </button>

          {/* Dropdown menu */}
          <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50">
            <div className="py-2">
              <a href="/profile" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                View Profile
              </a>
              <a href="/settings" className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                Settings
              </a>
              <hr className="my-1 border-gray-200 dark:border-gray-600" />
              <button
                onClick={logout}
                className="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}