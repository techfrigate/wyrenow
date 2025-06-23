import React from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Target, 
  Zap, 
  Eye,
  Brain,
  Activity,
  Lightbulb
} from 'lucide-react';

export default function Analytics() {
  const analyticsStats = [
    {
      title: 'Growth Rate',
      value: '23.5%',
      change: '+5.2% this month',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Team Efficiency',
      value: '87.3%',
      change: 'Above average',
      icon: Zap,
      color: 'bg-blue-500'
    },
    {
      title: 'Goal Achievement',
      value: '94%',
      change: 'On track',
      icon: Target,
      color: 'bg-purple-500'
    },
    {
      title: 'Insights Generated',
      value: '15',
      change: 'This week',
      icon: Brain,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="bg-gradient-to-r from-purple-600 to-indigo-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">Advanced Analytics</h1>
            <p className="text-purple-100 mb-4">
              AI-powered insights, predictive analytics, and data-driven recommendations for business growth
            </p>
            <div className="flex items-center space-x-4">
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">Real-time Analysis</span>
              </div>
              <div className="bg-white/20 rounded-lg px-3 py-1">
                <span className="text-sm font-medium">AI Insights</span>
              </div>
            </div>
          </div>
          <Brain className="w-16 h-16 text-white/80" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsStats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
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
        <div className="w-24 h-24 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-6">
          <Brain className="w-12 h-12 text-purple-600 dark:text-purple-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          AI-Powered Analytics Coming Soon!
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6 max-w-2xl mx-auto">
          Unlock the power of artificial intelligence to analyze your business patterns, predict trends, 
          and receive personalized recommendations for optimal growth strategies.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mt-8">
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Eye className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Predictive Insights</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              AI-powered future trend predictions
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Activity className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Performance Tracking</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Real-time business health monitoring
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <Lightbulb className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Smart Recommendations</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Personalized growth strategies
            </p>
          </div>
          <div className="p-6 border border-gray-200 dark:border-gray-700 rounded-lg">
            <BarChart3 className="w-8 h-8 text-purple-600 dark:text-purple-400 mx-auto mb-3" />
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Advanced Metrics</h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Deep dive analytics and KPIs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}