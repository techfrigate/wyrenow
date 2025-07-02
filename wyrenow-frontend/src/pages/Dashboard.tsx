import React from 'react';
import { 
  TrendingUp, 
  Users, 
  Award, 
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  Package,
  Crown,
  Target,
  Calendar,
  DollarSign,
  GitBranch
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useApp } from '../contexts/AppContext';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell } from 'recharts';
import { useAppSelector } from '../hooks/redux';

// Mock data for charts
const earningsData = [
  { month: 'Jan', earnings: 45000, bonuses: 12000 },
  { month: 'Feb', earnings: 52000, bonuses: 15000 },
  { month: 'Mar', earnings: 48000, bonuses: 13000 },
  { month: 'Apr', earnings: 61000, bonuses: 18000 },
  { month: 'May', earnings: 55000, bonuses: 16000 },
  { month: 'Jun', earnings: 67000, bonuses: 21000 },
];

const teamGrowthData = [
  { month: 'Jan', direct: 5, indirect: 15 },
  { month: 'Feb', direct: 8, indirect: 24 },
  { month: 'Mar', direct: 12, indirect: 36 },
  { month: 'Apr', direct: 15, indirect: 45 },
  { month: 'May', direct: 18, indirect: 54 },
  { month: 'Jun', direct: 22, indirect: 66 },
];

const bonusBreakdown = [
  { name: 'Direct Sponsor', value: 35, color: '#3b82f6' },
  { name: 'Business Bonus', value: 25, color: '#14b8a6' },
  { name: 'Indirect Sponsor', value: 20, color: '#f97316' },
  { name: 'Roll-up', value: 15, color: '#eab308' },
  { name: 'Unilevel', value: 5, color: '#8b5cf6' },
];

export default function Dashboard() {
  const { user } =  useAppSelector((state) => state.auth);
  type Wallet = {
    totalEarnings?: number;
    earningsBalance?: number;
    // add other wallet properties as needed
  };

  const { wallet = {}, recentBonuses = [], currency = 'NGN' } = (useApp() || {}) as { wallet?: Wallet, recentBonuses?: any[], currency?: string };
 
  // ✅ Fixed: Removed TypeScript syntax
  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount?.toLocaleString() || '0'}`;
  };

  // ✅ Added fallbacks for wallet data
  const stats = [
    {
      title: 'Total Earnings',
      value: formatCurrency(wallet.totalEarnings || 0),
      change: '+12.5%',
      changeType: 'positive',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Team Members',
      value: '156',
      change: '+8',
      changeType: 'positive',
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Current Rank',
      value: user?.rank?.name || 'Promoter',
      change: 'Next: Senior',
      changeType: 'neutral',
      icon: Award,
      color: 'bg-purple-500'
    },
    {
      title: 'Available Balance',
      value: formatCurrency(wallet.earningsBalance || 0),
      change: '+₦15,000',
      changeType: 'positive',
      icon: Wallet,
      color: 'bg-emerald-500'
    }
  ];

  const recentActivities = [
    {
      id: 1,
      type: 'bonus',
      description: 'Direct Sponsor Bonus from Jane Smith upgrade',
      amount: 15000,
      time: '2 hours ago',
      icon: DollarSign,
      color: 'text-green-600'
    },
    {
      id: 2,
      type: 'team',
      description: 'New team member joined under you',
      amount: null,
      time: '4 hours ago',
      icon: Users,
      color: 'text-blue-600'
    },
    {
      id: 3,
      type: 'pairing',
      description: 'Business Bonus - 17 pairs matched',
      amount: 8500,
      time: '1 day ago',
      icon: GitBranch,
      color: 'text-purple-600'
    },
    {
      id: 4,
      type: 'rank',
      description: 'Rank progress updated',
      amount: null,
      time: '2 days ago',
      icon: Award,
      color: 'text-orange-600'
    }
  ];

  // ✅ Added error boundary for missing user data
  if (!user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading user data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-2xl p-6 text-white">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              Welcome back, {user?.firstName || 'User'}! 👋
            </h1>
            <p className="text-primary-100 mb-4">
              You're doing great! Here's what's happening with your business today.
            </p>
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <Package className="w-5 h-5" />
                <span className="font-medium">{user?.package?.name || 'Basic'} Package</span>
              </div>
              <div className="flex items-center space-x-2">
                <Crown className="w-5 h-5" />
                <span className="font-medium">{user?.rank?.name || 'Promoter'} Rank</span>
              </div>
            </div>
          </div>
          <div className="hidden md:block">
            <img
              src={user?.profileImage || `https://ui-avatars.com/api/?name=${user?.firstName || 'User'}+${user?.lastName || ''}&background=ffffff&color=3b82f6&size=100`}
              alt="Profile"
              className="w-20 h-20 rounded-full border-4 border-white/20"
            />
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200 animate-slide-up"
            style={{ animationDelay: `${index * 100}ms` }}
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className="flex items-center space-x-1">
                {stat.changeType === 'positive' && <ArrowUpRight className="w-4 h-4 text-green-500" />}
                {stat.changeType === 'negative' && <ArrowDownRight className="w-4 h-4 text-red-500" />}
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                  stat.changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
                  'text-gray-600 dark:text-gray-400'
                }`}>
                  {stat.change}
                </span>
              </div>
            </div>
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Earnings Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Monthly Earnings Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={earningsData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(17 24 39)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Area
                type="monotone"
                dataKey="earnings"
                stackId="1"
                stroke="#3b82f6"
                fill="#3b82f6"
                fillOpacity={0.8}
              />
              <Area
                type="monotone"
                dataKey="bonuses"
                stackId="1"
                stroke="#14b8a6"
                fill="#14b8a6"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Team Growth Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Team Growth
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={teamGrowthData}>
              <CartesianGrid strokeDasharray="3 3" className="opacity-30" />
              <XAxis dataKey="month" className="text-gray-600 dark:text-gray-400" />
              <YAxis className="text-gray-600 dark:text-gray-400" />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'rgb(17 24 39)',
                  border: 'none',
                  borderRadius: '8px',
                  color: 'white'
                }}
              />
              <Bar dataKey="direct" fill="#3b82f6" name="Direct" />
              <Bar dataKey="indirect" fill="#14b8a6" name="Indirect" />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Bonus Breakdown */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bonus Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={bonusBreakdown}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={80}
                paddingAngle={5}
                dataKey="value"
              >
                {bonusBreakdown.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {bonusBreakdown.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <span className="text-sm font-medium text-gray-900 dark:text-white">
                  {item.value}%
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Recent Activities */}
        <div className="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Activities
            </h3>
            <button className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium">
              View All
            </button>
          </div>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors">
                <div className={`w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center ${activity.color}`}>
                  <activity.icon className="w-5 h-5" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 dark:text-white truncate">
                    {activity.description}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400">{activity.time}</p>
                </div>
                {activity.amount && (
                  <div className="text-sm font-medium text-green-600 dark:text-green-400">
                    +{formatCurrency(activity.amount)}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Quick Actions
        </h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="flex flex-col items-center p-4 rounded-lg bg-primary-50 dark:bg-primary-900/20 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-colors">
            <Package className="w-8 h-8 text-primary-600 dark:text-primary-400 mb-2" />
            <span className="text-sm font-medium text-primary-700 dark:text-primary-300">Upgrade Package</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg bg-secondary-50 dark:bg-secondary-900/20 hover:bg-secondary-100 dark:hover:bg-secondary-900/30 transition-colors">
            <GitBranch className="w-8 h-8 text-secondary-600 dark:text-secondary-400 mb-2" />
            <span className="text-sm font-medium text-secondary-700 dark:text-secondary-300">View Tree</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg bg-emerald-50 dark:bg-emerald-900/20 hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors">
            <Wallet className="w-8 h-8 text-emerald-600 dark:text-emerald-400 mb-2" />
            <span className="text-sm font-medium text-emerald-700 dark:text-emerald-300">Withdraw</span>
          </button>
          <button className="flex flex-col items-center p-4 rounded-lg bg-orange-50 dark:bg-orange-900/20 hover:bg-orange-100 dark:hover:bg-orange-900/30 transition-colors">
            <Target className="w-8 h-8 text-orange-600 dark:text-orange-400 mb-2" />
            <span className="text-sm font-medium text-orange-700 dark:text-orange-300">Set Goals</span>
          </button>
        </div>
      </div>
    </div>
  );
}