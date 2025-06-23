import React, { useState } from 'react';
import { 
  Wallet, 
  Package, 
  ArrowUpRight, 
  ArrowDownLeft,
  CreditCard,
  Clock,
  CheckCircle,
  XCircle,
  Eye,
  EyeOff,
  Plus,
  Download,
  Filter,
  Search
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';

interface WalletTransaction {
  id: string;
  type: 'fund' | 'payment' | 'refund';
  walletType: 'registration' | 'repurchase';
  amount: number;
  description: string;
  status: 'pending' | 'completed' | 'failed';
  date: string;
  reference?: string;
}

export default function WalletManagement() {
  const { currency } = useApp();
  const [activeTab, setActiveTab] = useState<'registration' | 'repurchase'>('registration');
  const [showFundModal, setShowFundModal] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [fundAmount, setFundAmount] = useState('');
  const [walletPin, setWalletPin] = useState('');
  const [showPin, setShowPin] = useState(false);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('');
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const walletBalances = {
    registration: 125000,
    repurchase: 85000
  };

  const transactions: WalletTransaction[] = [
    {
      id: 'TXN001',
      type: 'fund',
      walletType: 'registration',
      amount: 50000,
      description: 'Wallet funding via bank transfer',
      status: 'completed',
      date: '2024-01-20',
      reference: 'REF123456'
    },
    {
      id: 'TXN002',
      type: 'payment',
      walletType: 'registration',
      amount: -31500,
      description: 'User registration payment - newuser123',
      status: 'completed',
      date: '2024-01-20'
    },
    {
      id: 'TXN003',
      type: 'fund',
      walletType: 'repurchase',
      amount: 25000,
      description: 'Wallet funding via card payment',
      status: 'completed',
      date: '2024-01-19',
      reference: 'REF789012'
    },
    {
      id: 'TXN004',
      type: 'payment',
      walletType: 'repurchase',
      amount: -15000,
      description: 'Product repurchase - user456',
      status: 'completed',
      date: '2024-01-19'
    },
    {
      id: 'TXN005',
      type: 'fund',
      walletType: 'registration',
      amount: 75000,
      description: 'Wallet funding via mobile money',
      status: 'pending',
      date: '2024-01-18',
      reference: 'REF345678'
    }
  ];

  const paymentMethods = [
    { id: 'bank', name: 'Bank Transfer', fee: '0%', processingTime: '1-3 hours' },
    { id: 'card', name: 'Debit/Credit Card', fee: '2.5%', processingTime: 'Instant' },
    { id: 'mobile', name: 'Mobile Money', fee: '1.5%', processingTime: '5-15 minutes' }
  ];

  const filteredTransactions = transactions.filter(transaction => {
    const matchesWallet = transaction.walletType === activeTab;
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         transaction.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || transaction.status === statusFilter;
    
    return matchesWallet && matchesSearch && matchesStatus;
  });

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

  const handleFundWallet = () => {
    if (!fundAmount || !selectedPaymentMethod) {
      alert('Please enter amount and select payment method');
      return;
    }
    setShowFundModal(false);
    setShowPinModal(true);
  };

  const confirmPayment = () => {
    if (!walletPin) {
      alert('Please enter your wallet PIN');
      return;
    }
    
    // Simulate payment processing
    alert(`Wallet funding of ${formatCurrency(parseFloat(fundAmount))} initiated successfully!`);
    setShowPinModal(false);
    setFundAmount('');
    setSelectedPaymentMethod('');
    setWalletPin('');
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Wallet Management</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage your registration and repurchase wallets
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button
            onClick={() => setShowFundModal(true)}
            className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus className="w-4 h-4 mr-2" />
            Fund Wallet
          </button>
        </div>
      </div>

      {/* Wallet Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Registration Wallet */}
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Wallet className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Registration Wallet</h3>
                <p className="text-blue-100 text-sm">For user registrations</p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold">{formatCurrency(walletBalances.registration)}</p>
            <p className="text-blue-100 text-sm">Available Balance</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setActiveTab('registration');
                setShowFundModal(true);
              }}
              className="flex-1 py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              Fund Wallet
            </button>
            <button
              onClick={() => setActiveTab('registration')}
              className="flex-1 py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              View Transactions
            </button>
          </div>
        </div>

        {/* Repurchase Wallet */}
        <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-xl p-6 text-white">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-white/20 rounded-lg flex items-center justify-center">
                <Package className="w-6 h-6" />
              </div>
              <div>
                <h3 className="font-semibold">Repurchase Wallet</h3>
                <p className="text-green-100 text-sm">For product repurchases</p>
              </div>
            </div>
          </div>
          <div className="mb-4">
            <p className="text-3xl font-bold">{formatCurrency(walletBalances.repurchase)}</p>
            <p className="text-green-100 text-sm">Available Balance</p>
          </div>
          <div className="flex space-x-2">
            <button
              onClick={() => {
                setActiveTab('repurchase');
                setShowFundModal(true);
              }}
              className="flex-1 py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              Fund Wallet
            </button>
            <button
              onClick={() => setActiveTab('repurchase')}
              className="flex-1 py-2 px-4 bg-white/20 rounded-lg hover:bg-white/30 transition-colors"
            >
              View Transactions
            </button>
          </div>
        </div>
      </div>

      {/* Transactions Section */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        {/* Tabs */}
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'registration', name: 'Registration Wallet', icon: Wallet },
              { id: 'repurchase', name: 'Repurchase Wallet', icon: Package }
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
          {/* Filters */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0 mb-6">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search transactions..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                />
              </div>
              
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                <option value="all">All Status</option>
                <option value="completed">Completed</option>
                <option value="pending">Pending</option>
                <option value="failed">Failed</option>
              </select>
            </div>

            <div className="flex items-center space-x-3">
              <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Download className="w-4 h-4 mr-2" />
                Export
              </button>
            </div>
          </div>

          {/* Transactions Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Transaction ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Type</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Description</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Reference</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((transaction) => (
                  <tr key={transaction.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                      {transaction.id}
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {transaction.type === 'fund' ? (
                          <ArrowUpRight className="w-4 h-4 text-green-500" />
                        ) : (
                          <ArrowDownLeft className="w-4 h-4 text-red-500" />
                        )}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          transaction.type === 'fund' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                          transaction.type === 'payment' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                          'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300'
                        }`}>
                          {transaction.type}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {transaction.description}
                    </td>
                    <td className="py-3 px-4 font-medium">
                      <span className={
                        transaction.amount > 0 ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
                      }>
                        {transaction.amount > 0 ? '+' : ''}{formatCurrency(Math.abs(transaction.amount))}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(transaction.status)}`}>
                          {transaction.status}
                        </span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {new Date(transaction.date).toLocaleDateString()}
                    </td>
                    <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                      {transaction.reference || '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {filteredTransactions.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500 dark:text-gray-400">No transactions found</p>
            </div>
          )}
        </div>
      </div>

      {/* Fund Wallet Modal */}
      {showFundModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Fund {activeTab === 'registration' ? 'Registration' : 'Repurchase'} Wallet
            </h3>
            
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount
                </label>
                <div className="relative">
                  <input
                    type="number"
                    value={fundAmount}
                    onChange={(e) => setFundAmount(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                    <span className="text-gray-500 dark:text-gray-400">{currency}</span>
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Payment Method
                </label>
                <div className="space-y-2">
                  {paymentMethods.map(method => (
                    <div
                      key={method.id}
                      className={`border-2 rounded-lg p-3 cursor-pointer transition-all ${
                        selectedPaymentMethod === method.id
                          ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                          : 'border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600'
                      }`}
                      onClick={() => setSelectedPaymentMethod(method.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{method.name}</p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            Fee: {method.fee} • {method.processingTime}
                          </p>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 ${
                          selectedPaymentMethod === method.id
                            ? 'border-primary-500 bg-primary-500'
                            : 'border-gray-300 dark:border-gray-600'
                        }`} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowFundModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleFundWallet}
                className="flex-1 py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        </div>
      )}

      {/* PIN Confirmation Modal */}
      {showPinModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
              Confirm Payment
            </h3>
            
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {formatCurrency(parseFloat(fundAmount) || 0)}
                  </span>
                </div>
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600 dark:text-gray-400">Payment Method:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {paymentMethods.find(m => m.id === selectedPaymentMethod)?.name}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600 dark:text-gray-400">Wallet:</span>
                  <span className="font-semibold text-gray-900 dark:text-white">
                    {activeTab === 'registration' ? 'Registration' : 'Repurchase'} Wallet
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Enter Wallet PIN
                </label>
                <div className="relative">
                  <input
                    type={showPin ? 'text' : 'password'}
                    value={walletPin}
                    onChange={(e) => setWalletPin(e.target.value)}
                    placeholder="Enter 4-digit PIN"
                    maxLength={4}
                    className="w-full px-4 py-3 pr-12 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPin(!showPin)}
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                  >
                    {showPin ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                </div>
              </div>
            </div>

            <div className="flex space-x-3 mt-6">
              <button
                onClick={() => setShowPinModal(false)}
                className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmPayment}
                className="flex-1 py-3 px-4 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Confirm Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}