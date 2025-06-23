import React from 'react';
import { 
  Building2, 
  Target, 
  TrendingUp, 
  Users, 
  DollarSign,
  MapPin,
  Crown,
  Award,
  Percent
} from 'lucide-react';

export default function ServiceCenter() {
  const centerStats = [
    {
      title: 'Monthly Target',
      value: '1,500 PV',
      progress: '75%',
      icon: Target,
      color: 'bg-blue-500'
    },
    {
      title: 'Commission Rate',
      value: '6%',
      progress: '100%',
      icon: Percent,
      color: 'bg-emerald-500'
    },
    {
      title: 'Current Performance',
      value: '1,125 PV',
      progress: '75%',
      icon: TrendingUp,
      color: 'bg-orange-500'
    },
    {
      title: 'This Month Earnings',
      value: '₦600,000',
      progress: '80%',
      icon: DollarSign,
      color: 'bg-green-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Service Center Management</h1>
            <p className="text-blue-100 mb-4">
              Build your local market presence and earn 6% commission on monthly sales
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Requirement: 1,500 PV/month</span>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">1,200 PV Unilevel + 200 PV Binary</span>
              </div>
            </div>
          </div>
          <Building2 className="w-16 h-16 text-white/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {centerStats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {stat.progress}
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
        <div className="w-24 h-24 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Building2 className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Service Centers & Megastores Coming Soon!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Expand your local market reach with Service Centers (6% commission) and upgrade to Megastores 
          (9% commission + leadership bonuses). Build your business empire across Nigeria and Ghana.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div className="p-6 border-2 border-blue-200 dark:border-blue-700 rounded-lg">
            <Building2 className="w-10 h-10 text-blue-600 dark:text-blue-400 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Service Center</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• 1,500 PV/month requirement</p>
              <p>• 6% commission on sales</p>
              <p>• 1,200 PV unilevel + 200 PV binary</p>
              <p>• Local market expansion</p>
            </div>
          </div>
          <div className="p-6 border-2 border-emerald-200 dark:border-emerald-700 rounded-lg">
            <Crown className="w-10 h-10 text-emerald-600 dark:text-emerald-400 mx-auto mb-4" />
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-2">Megastore</h3>
            <div className="space-y-2 text-sm text-gray-600 dark:text-gray-400">
              <p>• 6,000 PV/month requirement</p>
              <p>• 9% commission + leadership bonus</p>
              <p>• 4,800 PV unilevel + 1,200 PV binary</p>
              <p>• 10% bonus from Service Centers under you</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}