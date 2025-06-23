import React from 'react';
import { 
  ShoppingCart, 
  Package, 
  TrendingUp, 
  Users, 
  DollarSign,
  Percent,
  BarChart3,
  Plus,
  Search,
  Filter
} from 'lucide-react';

export default function Retail() {
  const retailStats = [
    {
      title: 'Total Sales',
      value: '₦485,000',
      change: '+18.2%',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Products Sold',
      value: '92 Bottles',
      change: '+12 this week',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Retail Profit (30%)',
      value: '₦145,500',
      change: '+₦25,000',
      icon: Percent,
      color: 'bg-emerald-500'
    },
    {
      title: 'Active Customers',
      value: '28',
      change: '+5 new',
      icon: Users,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Retail Management</h1>
            <p className="text-emerald-100 mb-4">
              Manage your product sales and earn 30% retail profit on every bottle sold
            </p>
            <div className="flex items-center space-x-2">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">1 Bottle = 10 PV = ₦5,250</span>
              </div>
            </div>
          </div>
          <ShoppingCart className="w-16 h-16 text-white/80" />
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {retailStats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-green-600 dark:text-green-400">
                {stat.change}
              </span>
            </div>
            <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
              {stat.value}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Coming Soon Content */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <ShoppingCart className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Retail Management Coming Soon!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Manage your product inventory, track customer sales, and monitor your 30% retail profit. 
          Features will include product catalog, customer management, sales analytics, and automated profit calculations.
        </p>
        
        {/* Preview Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Package className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Product Catalog</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Manage bottle inventory with real-time PV calculations
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Users className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Customer Management</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Track customer purchases and build relationships
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <BarChart3 className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Sales Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Detailed reports on retail performance and profits
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}