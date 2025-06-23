import React from 'react';
import { 
  FileText, 
  BarChart3, 
  TrendingUp, 
  Download, 
  Calendar,
  Filter,
  PieChart,
  DollarSign
} from 'lucide-react';

export default function Reports() {
  const reportStats = [
    {
      title: 'Monthly Earnings',
      value: '₦485,000',
      change: '+12.8%',
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Total Reports',
      value: '24',
      change: 'Generated',
      icon: FileText,
      color: 'bg-blue-500'
    },
    {
      title: 'Team Performance',
      value: '94.2%',
      change: 'Excellent',
      icon: TrendingUp,
      color: 'bg-emerald-500'
    },
    {
      title: 'Tax Documents',
      value: '12',
      change: 'Ready',
      icon: Download,
      color: 'bg-purple-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-emerald-600 to-teal-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Reports & Analytics</h1>
            <p className="text-emerald-100 mb-4">
              Comprehensive financial reports, performance analytics, and compliance documentation
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Real-time Data</span>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Export Available</span>
              </div>
            </div>
          </div>
          <BarChart3 className="w-16 h-16 text-white/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {reportStats.map((stat, index) => (
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
        <div className="w-24 h-24 bg-emerald-100 dark:bg-emerald-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <BarChart3 className="w-12 h-12 text-emerald-600 dark:text-emerald-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Advanced Reports Coming Soon!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Access detailed financial reports, team performance analytics, compliance documentation, 
          and tax-ready summaries with advanced filtering and export capabilities.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <PieChart className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Financial Reports</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Detailed earnings breakdowns and summaries
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <TrendingUp className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance Analytics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Team growth and achievement tracking
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Download className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Export & Print</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              PDF, Excel, and CSV export options
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}