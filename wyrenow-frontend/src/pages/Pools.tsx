import React from 'react';
import { 
  Waves, 
  Crown, 
  Trophy, 
  Star, 
  DollarSign,
  TrendingUp,
  Users,
  Percent
} from 'lucide-react';

export default function Pools() {
  const poolStats = [
    {
      title: 'Leadership Pool (10%)',
      value: '₦5,250,000',
      share: 'Monthly Distribution',
      icon: Waves,
      color: 'bg-blue-500'
    },
    {
      title: 'Executive Board (5%)',
      value: '₦2,625,000',
      share: 'Executive Share',
      icon: Crown,
      color: 'bg-purple-500'
    },
    {
      title: 'Your Pool Share',
      value: '₦185,000',
      share: 'This Month',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Pool Participants',
      value: '156',
      share: 'Qualified Leaders',
      icon: Users,
      color: 'bg-emerald-500'
    }
  ];

  const poolDistribution = [
    { rank: 'Executives', percentage: 45, color: '#3b82f6' },
    { rank: 'Champions', percentage: 35, color: '#14b8a6' },
    { rank: 'Icons', percentage: 20, color: '#f97316' }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-blue-600 to-cyan-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Leadership Pools</h1>
            <p className="text-blue-100 mb-4">
              Share in company-wide success through Leadership Pool and Executive Board distributions
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Leadership Pool: 10% Monthly PV</span>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Executive Board: 5% Monthly PV</span>
              </div>
            </div>
          </div>
          <Waves className="w-16 h-16 text-white/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {poolStats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-blue-600 dark:text-blue-400">
                {stat.share}
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
          <Waves className="w-12 h-12 text-blue-600 dark:text-blue-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Leadership Pools Coming Soon!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Participate in company-wide profit sharing through Leadership Pools and Executive Board bonuses. 
          The higher your rank, the larger your share of monthly distributions.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Leadership Pool Distribution</h3>
            <div className="space-y-3">
              {poolDistribution.map((item) => (
                <div key={item.rank} className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div 
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-gray-900 dark:text-white font-medium">{item.rank}</span>
                  </div>
                  <span className="text-gray-600 dark:text-gray-400">{item.percentage}%</span>
                </div>
              ))}
            </div>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <h3 className="font-bold text-lg text-gray-900 dark:text-white mb-4">Executive Board Benefits</h3>
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>• 5% of total monthly PV shared equally</p>
              <p>• Exclusive executive privileges</p>
              <p>• Country leadership recognition</p>
              <p>• Equal distribution among all executives</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}