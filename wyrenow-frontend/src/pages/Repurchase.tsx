import React from 'react';
import { 
  RefreshCw, 
  Calendar, 
  Percent, 
  Package, 
  Clock,
  CheckCircle,
  AlertCircle,
  Settings
} from 'lucide-react';

export default function Repurchase() {
  const repurchaseStats = [
    {
      title: 'Monthly Requirement',
      value: '1 Bottle (10 PV)',
      status: 'Required',
      icon: Package,
      color: 'bg-orange-500'
    },
    {
      title: 'Personal Discount',
      value: '5-10%',
      status: 'Savings',
      icon: Percent,
      color: 'bg-green-500'
    },
    {
      title: 'Awaiting Wallet Release',
      value: '₦45,000',
      status: 'Pending Repurchase',
      icon: Clock,
      color: 'bg-yellow-500'
    },
    {
      title: 'Next Due Date',
      value: '15 days',
      status: 'Upcoming',
      icon: Calendar,
      color: 'bg-blue-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-orange-600 to-amber-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Monthly Repurchase System</h1>
            <p className="text-orange-100 mb-4">
              Maintain activity and unlock your Awaiting Wallet bonuses with monthly repurchases
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Minimum: 1 Bottle/Month</span>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Discount: Up to 10%</span>
              </div>
            </div>
          </div>
          <RefreshCw className="w-16 h-16 text-white/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {repurchaseStats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-xs px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded-full text-gray-600 dark:text-gray-400">
                {stat.status}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
          </div>
        ))}
      </div>

      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <div className="w-24 h-24 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <RefreshCw className="w-12 h-12 text-orange-600 dark:text-orange-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Repurchase System Coming Soon!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Automate your monthly repurchases, track your Awaiting Wallet releases, and never miss a deadline. 
          Enjoy personal discounts and maintain your active status effortlessly.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Settings className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Auto-Repurchase</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set up automatic monthly bottle orders
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <CheckCircle className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Wallet Release</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Automatic Awaiting Wallet fund release
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <AlertCircle className="w-8 h-8 text-orange-600 dark:text-orange-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Deadline Alerts</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Never miss repurchase deadlines
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}