import React, { useState } from 'react';
import { 
  Package, 
  Crown, 
  TrendingUp, 
  Check,
  Star,
  Gift,
  ShoppingCart,
  CreditCard,
  ArrowRight
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { allPackages } from '../data/mockData';

export default function Packages() {
  const { user } = useAuth();
  const { currency } = useApp();
  const [selectedPackage, setSelectedPackage] = useState<string | null>(null);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const getCurrentPackageIndex = () => {
    return allPackages.findIndex(pkg => pkg.id === user?.package.id) || 0;
  };

  const getUpgradeCost = (targetPackage: any) => {
    const currentCost = currency === 'NGN' ? user?.package.costNGN || 0 : user?.package.costGHS || 0;
    const targetCost = currency === 'NGN' ? targetPackage.costNGN : targetPackage.costGHS;
    return Math.max(0, targetCost - currentCost);
  };

  const canUpgrade = (packageIndex: number) => {
    return packageIndex > getCurrentPackageIndex();
  };

  const packageColors = [
    'from-gray-400 to-gray-600',      // Beginner
    'from-blue-400 to-blue-600',     // Starter
    'from-green-400 to-green-600',   // Regular
    'from-purple-400 to-purple-600', // Executive
    'from-pink-400 to-pink-600',     // Premium
    'from-indigo-400 to-indigo-600', // Platinum
    'from-yellow-400 to-yellow-600', // Diamond
    'from-red-400 to-red-600'        // Legend
  ];

  const handleUpgrade = (packageId: string) => {
    setSelectedPackage(packageId);
    setShowUpgradeModal(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Packages</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Choose the perfect package for your MLM journey
          </p>
        </div>
      </div>

      {/* Current Package */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold mb-2">Your Current Package</h2>
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span className="font-medium">{user?.package.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5" />
                <span>{user?.package.pv} PV / {user?.package.bv} BV</span>
              </div>
              <div className="flex items-center space-x-2">
                <Gift className="w-5 h-5" />
                <span>{user?.package.bottles} Bottles</span>
              </div>
            </div>
            <p className="text-primary-100 mt-2">
              Package Value: {formatCurrency(currency === 'NGN' ? user?.package.costNGN || 0 : user?.package.costGHS || 0)}
            </p>
          </div>
          <div className="hidden md:block">
            <div className="w-20 h-20 bg-white/20 rounded-full flex items-center justify-center">
              <Crown className="w-10 h-10" />
            </div>
          </div>
        </div>
      </div>

      {/* Package Comparison */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          All Available Packages
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {allPackages.map((pkg, index) => {
            const isCurrentPackage = pkg.id === user?.package.id;
            const canUpgradeToThis = canUpgrade(index);
            const upgradeCost = getUpgradeCost(pkg);
            
            return (
              <div
                key={pkg.id}
                className={`relative rounded-xl p-6 border-2 transition-all duration-200 ${
                  isCurrentPackage
                    ? 'border-primary-500 bg-primary-50 dark:bg-primary-900/20'
                    : canUpgradeToThis
                    ? 'border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 hover:border-primary-300 dark:hover:border-primary-600 hover:shadow-lg'
                    : 'border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-700/50 opacity-75'
                }`}
              >
                {isCurrentPackage && (
                  <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
                    <span className="bg-primary-500 text-white px-3 py-1 rounded-full text-xs font-medium">
                      Current Package
                    </span>
                  </div>
                )}

                {/* Package Header */}
                <div className="text-center mb-4">
                  <div className={`w-16 h-16 mx-auto mb-3 rounded-full bg-gradient-to-r ${packageColors[index]} flex items-center justify-center`}>
                    <Package className="w-8 h-8 text-white" />
                  </div>
                  <h4 className="text-xl font-bold text-gray-900 dark:text-white">{pkg.name}</h4>
                  <p className="text-2xl font-bold text-primary-600 dark:text-primary-400 mt-2">
                    {formatCurrency(currency === 'NGN' ? pkg.costNGN : pkg.costGHS)}
                  </p>
                  {canUpgradeToThis && upgradeCost > 0 && (
                    <p className="text-sm text-green-600 dark:text-green-400 mt-1">
                      Upgrade for {formatCurrency(upgradeCost)}
                    </p>
                  )}
                </div>

                {/* Package Stats */}
                <div className="space-y-3 mb-6">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">PV/BV Points</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {pkg.pv}/{pkg.bv}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Bottles</span>
                    <span className="font-semibold text-gray-900 dark:text-white">
                      {pkg.bottles}
                    </span>
                  </div>
                </div>

                {/* Benefits */}
                <div className="space-y-2 mb-6">
                  <h5 className="font-medium text-gray-900 dark:text-white">Benefits:</h5>
                  {pkg.benefits.slice(0, 3).map((benefit, idx) => (
                    <div key={idx} className="flex items-center space-x-2">
                      <Check className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="text-sm text-gray-600 dark:text-gray-400">{benefit}</span>
                    </div>
                  ))}
                  {pkg.benefits.length > 3 && (
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      +{pkg.benefits.length - 3} more benefits
                    </p>
                  )}
                </div>

                {/* Action Button */}
                <div className="mt-auto">
                  {isCurrentPackage ? (
                    <button
                      disabled
                      className="w-full py-2 px-4 bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg font-medium cursor-not-allowed"
                    >
                      Current Package
                    </button>
                  ) : canUpgradeToThis ? (
                    <button
                      onClick={() => handleUpgrade(pkg.id)}
                      className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white rounded-lg font-medium transition-colors flex items-center justify-center space-x-2"
                    >
                      <span>Upgrade Now</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  ) : (
                    <button
                      disabled
                      className="w-full py-2 px-4 bg-gray-200 dark:bg-gray-600 text-gray-500 dark:text-gray-400 rounded-lg font-medium cursor-not-allowed"
                    >
                      Lower Package
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Package Comparison Table */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Detailed Package Comparison
          </h3>
        </div>
        
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Package</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Cost ({currency})</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">PV/BV</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Bottles</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Benefits</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {allPackages.map((pkg, index) => {
                const isCurrentPackage = pkg.id === user?.package.id;
                const canUpgradeToThis = canUpgrade(index);
                
                return (
                  <tr key={pkg.id} className={`border-b border-gray-100 dark:border-gray-700 ${
                    isCurrentPackage ? 'bg-primary-50 dark:bg-primary-900/20' : ''
                  }`}>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <div className={`w-10 h-10 rounded-full bg-gradient-to-r ${packageColors[index]} flex items-center justify-center`}>
                          <Package className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">{pkg.name}</p>
                          {isCurrentPackage && (
                            <span className="text-xs text-primary-600 dark:text-primary-400">Current</span>
                          )}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6 font-medium text-gray-900 dark:text-white">
                      {formatCurrency(currency === 'NGN' ? pkg.costNGN : pkg.costGHS)}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {pkg.pv}/{pkg.bv}
                    </td>
                    <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                      {pkg.bottles}
                    </td>
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        {pkg.benefits.slice(0, 2).map((benefit, idx) => (
                          <div key={idx} className="flex items-center space-x-1">
                            <Check className="w-3 h-3 text-green-500" />
                            <span className="text-xs text-gray-600 dark:text-gray-400">{benefit}</span>
                          </div>
                        ))}
                        {pkg.benefits.length > 2 && (
                          <span className="text-xs text-gray-500 dark:text-gray-400">
                            +{pkg.benefits.length - 2} more
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      {isCurrentPackage ? (
                        <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                          Active
                        </span>
                      ) : canUpgradeToThis ? (
                        <button
                          onClick={() => handleUpgrade(pkg.id)}
                          className="inline-flex items-center px-3 py-1 bg-primary-600 text-white text-xs rounded-lg hover:bg-primary-700 transition-colors"
                        >
                          Upgrade
                        </button>
                      ) : (
                        <span className="text-xs text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && selectedPackage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            {(() => {
              const pkg = allPackages.find(p => p.id === selectedPackage);
              const upgradeCost = pkg ? getUpgradeCost(pkg) : 0;
              
              return (
                <>
                  <div className="text-center mb-6">
                    <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-r ${packageColors[allPackages.findIndex(p => p.id === selectedPackage)]} flex items-center justify-center`}>
                      <Package className="w-8 h-8 text-white" />
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                      Upgrade to {pkg?.name}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mt-2">
                      Confirm your package upgrade
                    </p>
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">Current Package:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{user?.package.name}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                      <span className="text-gray-600 dark:text-gray-400">New Package:</span>
                      <span className="font-medium text-gray-900 dark:text-white">{pkg?.name}</span>
                    </div>
                    <div className="flex justify-between items-center p-3 bg-primary-50 dark:bg-primary-900/20 rounded-lg">
                      <span className="text-primary-700 dark:text-primary-300 font-medium">Upgrade Cost:</span>
                      <span className="font-bold text-primary-800 dark:text-primary-200">
                        {formatCurrency(upgradeCost)}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                      <CreditCard className="w-5 h-5" />
                      <span>Pay with Card</span>
                    </button>
                    <button className="w-full flex items-center justify-center space-x-2 py-3 px-4 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors">
                      <ShoppingCart className="w-5 h-5" />
                      <span>Pay with Wallet</span>
                    </button>
                    <button
                      onClick={() => setShowUpgradeModal(false)}
                      className="w-full py-3 px-4 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                    >
                      Cancel
                    </button>
                  </div>
                </>
              );
            })()}
          </div>
        </div>
      )}
    </div>
  );
}