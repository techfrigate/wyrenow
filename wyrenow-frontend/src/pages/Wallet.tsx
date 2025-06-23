import React, { useState } from 'react';
import { Wallet as WalletIcon, ArrowUpRight, ArrowDownLeft, Clock, CheckCircle, XCircle, CreditCard, Ban as Bank, Download, Eye, Plus, Minus } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { walletData, allTransactions } from '../data/mockData';

export default function Wallet() {
  const { currency } = useApp();
  const [activeTab, setActiveTab] = useState<'overview' | 'transactions' | 'withdraw'>('overview');
  const [withdrawAmount, setWithdrawAmount] = useState('');
  const [selectedBank, setSelectedBank] = useState('');

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const walletStats = [
    {
      title: 'Earnings Wallet',
      value: formatCurrency(walletData.earningsBalance),
      description: 'Available for withdrawal',
      icon: WalletIcon,
      color: 'bg-green-500',
      bgColor: 'bg-green-50 dark:bg-green-900/20',
      textColor: 'text-green-800 dark:text-green-300'
    },
    {
      title: 'Awaiting Wallet',
      value: formatCurrency(walletData.awaitingBalance),
      description: '20% bonus holding (requires repurchase)',
      icon: Clock,
      color: 'bg-amber-500',
      bgColor: 'bg-amber-50 dark:bg-amber-900/20',
      textColor: 'text-amber-800 dark:text-amber-300'
    },
    {
      title: 'Total Earnings',
      value: formatCurrency(walletData.totalEarnings),
      description: 'Lifetime earnings',
      icon: ArrowUpRight,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50 dark:bg-blue-900/20',
      textColor: 'text-blue-800 dark:text-blue-300'
    }
  ];

  const bankAccounts = [
    { id: '1', name: 'First Bank Nigeria', accountNumber: '****7890', type: 'Savings' },
    { id: '2', name: 'GTBank Nigeria', accountNumber: '****4321', type: 'Current' },
    { id: '3', name: 'Access Bank Nigeria', accountNumber: '****5678', type: 'Savings' }
  ];

  const recentTransactions = allTransactions.slice(0, 10);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'pending':
        return <Clock className="w-5 h-5 text-amber-500" />;
      case 'failed':
        return <XCircle className="w-5 h-5 text-red-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

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

  const handleWithdraw = () => {
    if (!withdrawAmount || !selectedBank) {
      alert('Please enter amount and select bank account');
      return;
    }
    
    const amount = parseFloat(withdrawAmount);
    if (amount > walletData.earningsBalance) {
      alert('Insufficient balance');
      return;
    }
    
    alert(`Withdrawal request of ${formatCurrency(amount)} submitted successfully!`);
    setWithdrawAmount('');
    setSelectedBank('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wallet</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your earnings and withdrawals
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Wallet Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {walletStats.map((stat, index) => (
          <div
            key={stat.title}
            className={`${stat.bgColor} rounded-xl p-6 border border-gray-200 dark:border-gray-700`}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
            </div>
            <div>
              <h3 className={`text-2xl font-bold ${stat.textColor} mb-1`}>
                {stat.value}
              </h3>
              <p className="text-sm font-medium text-gray-900 dark:text-white">{stat.title}</p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">{stat.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Awaiting Wallet Alert */}
      <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-800 rounded-xl p-6">
        <div className="flex items-start space-x-3">
          <Clock className="w-6 h-6 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
          <div className="flex-1">
            <h3 className="font-medium text-amber-800 dark:text-amber-300 mb-2">
              Awaiting Wallet Release
            </h3>
            <p className="text-sm text-amber-700 dark:text-amber-400 mb-3">
              You have {formatCurrency(walletData.awaitingBalance)} in your awaiting wallet. 
              Complete your monthly repurchase by February 15th to release these funds to your earnings wallet.
            </p>
            <div className="flex items-center space-x-4">
              <div className="flex-1 bg-amber-200 dark:bg-amber-800 rounded-full h-2">
                <div className="bg-amber-500 h-2 rounded-full" style={{ width: '60%' }}></div>
              </div>
              <span className="text-sm font-medium text-amber-800 dark:text-amber-300">
                15 days left
              </span>
            </div>
            <button className="mt-3 px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 transition-colors">
              Complete Repurchase
            </button>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: WalletIcon },
              { id: 'transactions', name: 'Transactions', icon: ArrowUpRight },
              { id: 'withdraw', name: 'Withdraw', icon: ArrowDownLeft }
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
              {/* Quick Actions */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Quick Actions
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <ArrowDownLeft className="w-5 h-5 text-primary-600 dark:text-primary-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Withdraw Funds</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Plus className="w-5 h-5 text-secondary-600 dark:text-secondary-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Add Bank Account</span>
                  </button>
                  <button className="flex items-center justify-center space-x-2 p-4 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    <Download className="w-5 h-5 text-orange-600 dark:text-orange-400" />
                    <span className="font-medium text-gray-900 dark:text-white">Download Statement</span>
                  </button>
                </div>
              </div>

              {/* Recent Activity */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Recent Activity
                </h3>
                <div className="space-y-3">
                  {recentTransactions.slice(0, 5).map((transaction) => (
                    <div key={transaction.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <div className="flex items-center space-x-3">
                        {getStatusIcon(transaction.status)}
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {transaction.description}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {new Date(transaction.date).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className={`font-medium ${
                          transaction.type === 'earning' ? 'text-green-600 dark:text-green-400' : 
                          transaction.type === 'withdrawal' ? 'text-red-600 dark:text-red-400' :
                          'text-gray-900 dark:text-white'
                        }`}>
                          {transaction.type === 'earning' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                          {formatCurrency(transaction.amount)}
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

          {activeTab === 'transactions' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  All Transactions
                </h3>
                <div className="flex items-center space-x-3">
                  <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>All Types</option>
                    <option>Earnings</option>
                    <option>Withdrawals</option>
                    <option>Purchases</option>
                  </select>
                  <select className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last 6 months</option>
                    <option>Last year</option>
                  </select>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700">
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Description</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {recentTransactions.map((transaction) => (
                      <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                        <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                          {new Date(transaction.date).toLocaleDateString()}
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            transaction.type === 'earning' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                            transaction.type === 'withdrawal' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                            'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                          }`}>
                            {transaction.type}
                          </span>
                        </td>
                        <td className="py-3 px-4 text-gray-900 dark:text-white">
                          {transaction.description}
                        </td>
                        <td className="py-3 px-4 font-medium">
                          <span className={
                            transaction.type === 'earning' ? 'text-green-600 dark:text-green-400' : 
                            transaction.type === 'withdrawal' ? 'text-red-600 dark:text-red-400' :
                            'text-gray-900 dark:text-white'
                          }>
                            {transaction.type === 'earning' ? '+' : transaction.type === 'withdrawal' ? '-' : ''}
                            {formatCurrency(transaction.amount)}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                            {transaction.status}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                            <Eye className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'withdraw' && (
            <div className="max-w-2xl">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
                Withdraw Funds
              </h3>

              <div className="space-y-6">
                {/* Available Balance */}
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <div className="flex items-center justify-between">
                    <span className="text-green-700 dark:text-green-300 font-medium">Available Balance:</span>
                    <span className="text-2xl font-bold text-green-800 dark:text-green-200">
                      {formatCurrency(walletData.earningsBalance)}
                    </span>
                  </div>
                </div>

                {/* Withdrawal Form */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Withdrawal Amount
                    </label>
                    <div className="relative">
                      <input
                        type="number"
                        value={withdrawAmount}
                        onChange={(e) => setWithdrawAmount(e.target.value)}
                        placeholder="Enter amount"
                        className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                      />
                      <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                        <span className="text-gray-500 dark:text-gray-400">{currency}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2 mt-2">
                      <button
                        onClick={() => setWithdrawAmount((walletData.earningsBalance * 0.25).toString())}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        25%
                      </button>
                      <button
                        onClick={() => setWithdrawAmount((walletData.earningsBalance * 0.5).toString())}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        50%
                      </button>
                      <button
                        onClick={() => setWithdrawAmount((walletData.earningsBalance * 0.75).toString())}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        75%
                      </button>
                      <button
                        onClick={() => setWithdrawAmount(walletData.earningsBalance.toString())}
                        className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600"
                      >
                        Max
                      </button>
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                      Bank Account
                    </label>
                    <select
                      value={selectedBank}
                      onChange={(e) => setSelectedBank(e.target.value)}
                      className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="">Select bank account</option>
                      {bankAccounts.map((account) => (
                        <option key={account.id} value={account.id}>
                          {account.name} - {account.accountNumber} ({account.type})
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Withdrawal Info */}
                  <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                    <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">
                      Withdrawal Information
                    </h4>
                    <ul className="text-sm text-blue-700 dark:text-blue-400 space-y-1">
                      <li>• Minimum withdrawal: {formatCurrency(10000)}</li>
                      <li>• Processing time: 1-3 business days</li>
                      <li>• Processing fee: {formatCurrency(500)} or 1% (whichever is higher)</li>
                      <li>• Daily withdrawal limit: {formatCurrency(500000)}</li>
                    </ul>
                  </div>

                  {/* Summary */}
                  {withdrawAmount && selectedBank && (
                    <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <h4 className="font-medium text-gray-900 dark:text-white mb-3">
                        Withdrawal Summary
                      </h4>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(parseFloat(withdrawAmount) || 0)}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-gray-600 dark:text-gray-400">Processing Fee:</span>
                          <span className="font-medium text-gray-900 dark:text-white">
                            {formatCurrency(Math.max(500, (parseFloat(withdrawAmount) || 0) * 0.01))}
                          </span>
                        </div>
                        <div className="flex justify-between border-t border-gray-200 dark:border-gray-600 pt-2">
                          <span className="font-medium text-gray-900 dark:text-white">You'll receive:</span>
                          <span className="font-bold text-green-600 dark:text-green-400">
                            {formatCurrency((parseFloat(withdrawAmount) || 0) - Math.max(500, (parseFloat(withdrawAmount) || 0) * 0.01))}
                          </span>
                        </div>
                      </div>
                    </div>
                  )}

                  <button
                    onClick={handleWithdraw}
                    disabled={!withdrawAmount || !selectedBank}
                    className="w-full py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-medium"
                  >
                    Submit Withdrawal Request
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}