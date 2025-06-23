import React from 'react';
import { 
  Users, 
  Crown, 
  Award, 
  TrendingUp, 
  Target,
  Star,
  Zap,
  UserCheck
} from 'lucide-react';

export default function Leadership() {
  const leadershipStats = [
    {
      title: 'Team Size',
      value: '1,247',
      change: '+89 this month',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Leaders',
      value: '23',
      change: '+5 promoted',
      icon: Crown,
      color: 'bg-purple-500'
    },
    {
      title: 'Leadership Bonus',
      value: '₦185,000',
      change: '+15% from last month',
      icon: Award,
      color: 'bg-green-500'
    },
    {
      title: 'Team Performance',
      value: '94%',
      change: 'Excellent',
      icon: TrendingUp,
      color: 'bg-emerald-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Leadership Development</h1>
            <p className="text-indigo-100 mb-4">
              Build and mentor your team, develop future leaders, and maximize team performance
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Team Growth: +89 this month</span>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Active Rate: 94%</span>
              </div>
            </div>
          </div>
          <Crown className="w-16 h-16 text-white/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {leadershipStats.map((stat, index) => (
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

      <div className="bg-white dark:bg-gray-800 rounded-xl p-8 shadow-sm border border-gray-200 dark:border-gray-700 text-center">
        <div className="w-24 h-24 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Crown className="w-12 h-12 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Leadership Development Coming Soon!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Access comprehensive leadership tools, team training resources, performance analytics, 
          and mentoring systems to build a thriving organization.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <UserCheck className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Team Training</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Comprehensive training modules for your team
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Zap className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance Tracking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time team performance analytics
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Target className="w-8 h-8 text-indigo-600 dark:text-indigo-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Goal Setting</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Set and track team goals and milestones
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}