import React, { useState } from 'react';
import { 
  Users, 
  Wallet, 
  UserPlus, 
  Package, 
  TrendingUp,
  ArrowUpRight,
  ArrowDownLeft,
  Clock,
  CheckCircle,
  DollarSign,
  ShoppingCart,
  CreditCard
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

export default function SponsorDashboard() {
  const { currency } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'register' | 'wallets'>('overview');

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const sponsorStats = [
    {
      title: 'Registration Wallet',
      value: formatCurrency(125000),
      change: '+5 registrations',
      changeType: 'positive' as const,
      icon: Wallet,
      color: 'bg-blue-500'
    },
    {
      title: 'Repurchase Wallet',
      value: formatCurrency(85000),
      change: '+12 repurchases',
      changeType: 'positive' as const,
      icon: Package,
      color: 'bg-green-500'
    },
    {
      title: 'Total Registrations',
      value: '47',
      change: '+3 this month',
      changeType: 'positive' as const,
      icon: UserPlus,
      color: 'bg-purple-500'
    },
    {
      title: 'Commission Earned',
      value: formatCurrency(45000),
      change: '+15.2%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  const recentRegistrations = [
    {
      id: 'REG001',
      username: 'newuser123',
      sponsorName: 'John Doe',
      package: 'Executive Package',
      amount: 31500,
      status: 'completed',
      date: '2024-01-20',
      commission: 9450
    },
    {
      id: 'REG002',
      username: 'member456',
      sponsorName: 'Jane Smith',
      package: 'Premium Package',
      amount: 42000,
      status: 'pending',
      date: '2024-01-19',
      commission: 12600
    },
    {
      id: 'REG003',
      username: 'user789',
      sponsorName: 'Mike Johnson',
      package: 'Regular Package',
      amount: 21000,
      status: 'completed',
      date: '2024-01-18',
      commission: 6300
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300';
      case 'pending':
        return 'bg-amber-100 dark:bg-amber-900/30 text-amber-800 dark:text-amber-300';
      case 'failed':
        return 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300';
      default:
        return 'bg-gray-100 dark:bg-gray-900/30 text-gray-800 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sponsor Dashboard</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage registrations, wallets, and sponsor activities
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <UserPlus className="w-4 h-4 mr-2" />
            New Registration
          </button>
          <button className="flex items-center px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors">
            <Wallet className="w-4 h-4 mr-2" />
            Fund Wallet
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {sponsorStats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                stat.changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {stat.change}
              </span>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: TrendingUp },
              { id: 'register', name: 'Register User', icon: UserPlus },
              { id: 'wallets', name: 'Manage Wallets', icon: Wallet }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Recent Registrations */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Registrations
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Registration ID</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Username</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Package</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Commission</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRegistrations.map((registration) => (
                        <tr key={registration.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {registration.id}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {registration.username}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {registration.package}
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {formatCurrency(registration.amount)}
                          </td>
                          <td className="py-3 px-4 font-medium text-green-600 dark:text-green-400">
                            {formatCurrency(registration.commission)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(registration.status)}`}>
                              {registration.status}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {new Date(registration.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <UserPlus className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Register New User</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <ArrowUpRight className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Fund Registration Wallet</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Package className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Manage Repurchases</span>
                  </button>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'register' && (
            <div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Register New User
              </h3>
              <div className="max-w-2xl">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg mb-6">
                  <p className="text-blue-800 dark:text-blue-300 text-sm">
                    Use the dedicated registration form to register new users under your sponsorship.
                    This will guide you through the complete registration process including sponsor verification,
                    package selection, and payment processing.
                  </p>
                </div>
                <button className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors font-medium">
                  Open Registration Form
                </button>
              </div>
            </div>
          )}

          {activeTab === 'wallets' && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Wallet Management
              </h3>
              
              {/* Wallet Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Registration Wallet */}
                <div className="bg-blue-50 dark:bg-blue-900/20 rounded-xl p-6 border border-blue-200 dark:border-blue-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                        <Wallet className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-blue-800 dark:text-blue-300">Registration Wallet</h4>
                        <p className="text-sm text-blue-600 dark:text-blue-400">For user registrations</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
                      {formatCurrency(125000)}
                    </p>
                    <p className="text-sm text-blue-600 dark:text-blue-400">Available Balance</p>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
                      Fund Wallet
                    </button>
                    <button className="w-full py-2 px-4 border border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors">
                      View Transactions
                    </button>
                  </div>
                </div>

                {/* Repurchase Wallet */}
                <div className="bg-green-50 dark:bg-green-900/20 rounded-xl p-6 border border-green-200 dark:border-green-800">
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
                        <Package className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <h4 className="font-semibold text-green-800 dark:text-green-300">Repurchase Wallet</h4>
                        <p className="text-sm text-green-600 dark:text-green-400">For product repurchases</p>
                      </div>
                    </div>
                  </div>
                  <div className="mb-4">
                    <p className="text-2xl font-bold text-green-900 dark:text-green-200">
                      {formatCurrency(85000)}
                    </p>
                    <p className="text-sm text-green-600 dark:text-green-400">Available Balance</p>
                  </div>
                  <div className="space-y-2">
                    <button className="w-full py-2 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                      Fund Wallet
                    </button>
                    <button className="w-full py-2 px-4 border border-green-300 dark:border-green-600 text-green-700 dark:text-green-300 rounded-lg hover:bg-green-100 dark:hover:bg-green-900/30 transition-colors">
                      View Transactions
                    </button>
                  </div>
                </div>
              </div>

              {/* Recent Transactions */}
              <div>
                <h4 className="font-semibold text-gray-900 dark:text-white mb-4">Recent Wallet Transactions</h4>
                <div className="space-y-3">
                  {[
                    {
                      id: 'TXN001',
                      type: 'Fund Registration Wallet',
                      amount: 50000,
                      status: 'completed',
                      date: '2024-01-20',
                      wallet: 'registration'
                    },
                    {
                      id: 'TXN002',
                      type: 'User Registration Payment',
                      amount: -31500,
                      status: 'completed',
                      date: '2024-01-20',
                      wallet: 'registration'
                    },
                    {
                      id: 'TXN003',
                      type: 'Fund Repurchase Wallet',
                      amount: 25000,
                      status: 'completed',
                      date: '2024-01-19',
                      wallet: 'repurchase'
                    }
                  ].map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center ${
                          transaction.wallet === 'registration' ? 'bg-blue-100 dark:bg-blue-900/30' : 'bg-green-100 dark:bg-green-900/30'
                        }`}>
                          {transaction.wallet === 'registration' ? 
                            <Wallet className={`w-5 h-5 ${transaction.wallet === 'registration' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} /> :
                            <Package className={`w-5 h-5 ${transaction.wallet === 'registration' ? 'text-blue-600 dark:text-blue-400' : 'text-green-600 dark:text-green-400'}`} />
                          }
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.type}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {transaction.id} • {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                        }`}>
                          {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                        </p>
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}