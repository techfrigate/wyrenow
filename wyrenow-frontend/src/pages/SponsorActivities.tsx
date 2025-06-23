import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { 
  Wallet, 
  CreditCard, 
  DollarSign, 
  RefreshCw, 
  CheckCircle,
  AlertCircle,
  Plus,
  Eye,
  EyeOff
} from 'lucide-react';

interface FundWalletFormData {
  amount: number;
  paymentMethod: string;
  walletPin: string;
}

export default function SponsorActivities() {
  const [activeTab, setActiveTab] = useState<'registration' | 'repurchase'>('registration');
  const [showWalletPin, setShowWalletPin] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transactionStatus, setTransactionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  
  // Mock wallet balances - replace with actual data from your context/API
  const [walletBalances, setWalletBalances] = useState({
    registration: 0.00,
    repurchase: 0.00
  });

  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<FundWalletFormData>();
  const watchAmount = watch('amount');

  const paymentMethods = [
    { id: 'card', name: 'Credit/Debit Card', icon: CreditCard },
    { id: 'bank', name: 'Bank Transfer', icon: DollarSign },
    { id: 'mobile', name: 'Mobile Money', icon: Wallet }
  ];

  const onSubmit = async (data: FundWalletFormData) => {
    setIsLoading(true);
    setTransactionStatus('idle');
    
    try {
      // Simulate API call - replace with actual payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Update wallet balance (mock)
      setWalletBalances(prev => ({
        ...prev,
        [activeTab]: prev[activeTab] + data.amount
      }));
      
      setTransactionStatus('success');
      reset();
      
      // Auto hide success message after 3 seconds
      setTimeout(() => setTransactionStatus('idle'), 3000);
    } catch (error) {
      setTransactionStatus('error');
    } finally {
      setIsLoading(false);
    }
  };

  const WalletCard = ({ type, balance }: { type: 'registration' | 'repurchase', balance: number }) => (
    <div className="bg-gradient-to-br from-primary-500 to-secondary-500 rounded-xl p-6 text-white">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-2">
          <Wallet className="w-6 h-6" />
          <h3 className="text-lg font-semibold capitalize">{type} Wallet</h3>
        </div>
        <button 
          className="p-2 hover:bg-white/10 rounded-lg transition-colors"
          onClick={() => {/* Add refresh functionality */}}
        >
          <RefreshCw className="w-4 h-4" />
        </button>
      </div>
      <div className="text-3xl font-bold mb-2">
        ${balance.toFixed(2)}
      </div>
      <p className="text-sm opacity-90">
        Available for {type === 'registration' ? 'new registrations' : 'product repurchases'}
      </p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Sponsor Activities
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Manage your registration and repurchase wallets for MLM activities
          </p>
        </div>

        {/* Wallet Balances */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          <WalletCard type="registration" balance={walletBalances.registration} />
          <WalletCard type="repurchase" balance={walletBalances.repurchase} />
        </div>

        {/* Tab Navigation */}
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl overflow-hidden">
          <div className="flex border-b border-gray-200 dark:border-gray-700">
            <button
              onClick={() => setActiveTab('registration')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'registration'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Fund Registration Wallet
            </button>
            <button
              onClick={() => setActiveTab('repurchase')}
              className={`flex-1 px-6 py-4 text-sm font-medium transition-colors ${
                activeTab === 'repurchase'
                  ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 border-b-2 border-primary-600'
                  : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              Fund Repurchase Wallet
            </button>
          </div>

          <div className="p-8">
            {/* Transaction Status Messages */}
            {transactionStatus === 'success' && (
              <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4 mb-6 animate-slide-up">
                <div className="flex items-center">
                  <CheckCircle className="w-5 h-5 text-green-500 mr-2" />
                  <p className="text-sm text-green-800 dark:text-green-300 font-medium">
                    Wallet funded successfully! Balance updated automatically.
                  </p>
                </div>
              </div>
            )}

            {transactionStatus === 'error' && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4 mb-6 animate-slide-up">
                <div className="flex items-center">
                  <AlertCircle className="w-5 h-5 text-red-500 mr-2" />
                  <p className="text-sm text-red-800 dark:text-red-300 font-medium">
                    Transaction failed. Please try again or contact support.
                  </p>
                </div>
              </div>
            )}

            {/* Fund Wallet Form */}
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="text-center mb-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Fund {activeTab === 'registration' ? 'Registration' : 'Repurchase'} Wallet
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {activeTab === 'registration' 
                    ? 'Add funds to register new team members'
                    : 'Add funds for product repurchases'
                  }
                </p>
              </div>

              {/* Amount Input */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Amount to Fund
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <DollarSign className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    {...register('amount', { 
                      required: 'Amount is required',
                      min: { value: 1, message: 'Minimum amount is $1' },
                      max: { value: 10000, message: 'Maximum amount is $10,000' }
                    })}
                    type="number"
                    step="0.01"
                    min="1"
                    max="10000"
                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter amount (e.g., 100.00)"
                  />
                </div>
                {errors.amount && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.amount.message}</p>
                )}
              </div>

              {/* Payment Method Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                  Payment Method
                </label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  {paymentMethods.map((method) => (
                    <label key={method.id} className="relative cursor-pointer">
                      <input
                        {...register('paymentMethod', { required: 'Please select a payment method' })}
                        type="radio"
                        value={method.id}
                        className="sr-only"
                      />
                      <div className="flex items-center p-4 border-2 border-gray-200 dark:border-gray-600 rounded-lg hover:border-primary-300 dark:hover:border-primary-600 transition-colors peer-checked:border-primary-500 peer-checked:bg-primary-50 dark:peer-checked:bg-primary-900/20">
                        <method.icon className="w-5 h-5 text-gray-500 dark:text-gray-400 mr-3" />
                        <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                          {method.name}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
                {errors.paymentMethod && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.paymentMethod.message}</p>
                )}
              </div>

              {/* Wallet PIN */}
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Wallet PIN
                </label>
                <div className="relative">
                  <input
                    {...register('walletPin', { 
                      required: 'Wallet PIN is required',
                      minLength: { value: 4, message: 'PIN must be at least 4 digits' },
                      maxLength: { value: 6, message: 'PIN must be at most 6 digits' }
                    })}
                    type={showWalletPin ? 'text' : 'password'}
                    className="block w-full pr-10 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
                    placeholder="Enter your wallet PIN"
                    maxLength={6}
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowWalletPin(!showWalletPin)}
                  >
                    {showWalletPin ? (
                      <EyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {errors.walletPin && (
                  <p className="mt-1 text-sm text-red-600 dark:text-red-400">{errors.walletPin.message}</p>
                )}
              </div>

              {/* Transaction Summary */}
              {watchAmount && watchAmount > 0 && (
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                  <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Transaction Summary
                  </h3>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Amount:</span>
                      <span className="font-medium text-gray-900 dark:text-white">${watchAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Processing Fee:</span>
                      <span className="font-medium text-gray-900 dark:text-white">$0.00</span>
                    </div>
                    <div className="border-t border-gray-200 dark:border-gray-600 pt-2 mt-2">
                      <div className="flex justify-between">
                        <span className="font-medium text-gray-700 dark:text-gray-300">Total:</span>
                        <span className="font-bold text-primary-600 dark:text-primary-400">${watchAmount.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full flex items-center justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-gradient-to-r from-primary-600 to-secondary-600 hover:from-primary-700 hover:to-secondary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
              >
                {isLoading ? (
                  <>
                    <RefreshCw className="w-4 h-4 mr-2 animate-spin" />
                    Processing Payment...
                  </>
                ) : (
                  <>
                    <Plus className="w-4 h-4 mr-2" />
                    Fund {activeTab === 'registration' ? 'Registration' : 'Repurchase'} Wallet
                  </>
                )}
              </button>
            </form>

            {/* Info Note */}
            <div className="mt-6 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
              <p className="text-sm text-blue-800 dark:text-blue-300">
                <strong>Note:</strong> Once payment is confirmed, your wallet balance will be updated automatically. 
                This wallet can be used for {activeTab === 'registration' ? 'registering new team members' : 'purchasing products'}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}