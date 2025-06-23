import React, { useState } from 'react';
import { 
  TrendingUp, 
  DollarSign, 
  Calendar,
  Download,
  Filter,
  Eye,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  GitBranch,
  Award,
  Repeat
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { allBonuses, earningsBreakdown, earningsChartData, bonusBreakdownData } from '../data/mockData';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, BarChart, Bar } from 'recharts';

export default function Earnings() {
  const { currency } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');
  const [selectedBonusType, setSelectedBonusType] = useState<string>('all');

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const bonusTypes = [
    { id: 'all', name: 'All Bonuses', icon: DollarSign },
    { id: 'DSB', name: 'Direct Sponsor', icon: Users },
    { id: 'ISB', name: 'Indirect Sponsor', icon: Users },
    { id: 'Business', name: 'Business Bonus', icon: GitBranch },
    { id: 'Rollup', name: 'Roll-up Bonus', icon: TrendingUp },
    { id: 'Unilevel', name: 'Unilevel Bonus', icon: Repeat }
  ];

  const filteredBonuses = selectedBonusType === 'all' 
    ? allBonuses 
    : allBonuses.filter(bonus => bonus.type === selectedBonusType);

  const earningsStats = [
    {
      title: 'Total Earnings',
      value: formatCurrency(earningsBreakdown.totalEarnings),
      change: '+12.5%',
      changeType: 'positive' as 'positive' | 'negative',
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'This Month',
      value: formatCurrency(125000),
      change: '+8.3%',
      changeType: 'positive' as 'positive' | 'negative',
      icon: Calendar,
      color: 'bg-blue-500'
    },
    {
      title: 'Direct Sponsor Bonus',
      value: formatCurrency(earningsBreakdown.directSponsorBonus),
      change: '+15.2%',
      changeType: 'positive' as 'positive' | 'negative',
      icon: Users,
      color: 'bg-purple-500'
    },
    {
      title: 'Business Bonus',
      value: formatCurrency(earningsBreakdown.businessBonus),
      change: '+5.8%',
      changeType: 'positive' as 'positive' | 'negative',
      icon: GitBranch,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Earnings</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track your earnings and bonus performance
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as 'week' | 'month' | 'year')}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {earningsStats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
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
        {/* Earnings Trend Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Earnings Trend
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={earningsChartData}>
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
              <Area
                type="monotone"
                dataKey="retail"
                stackId="1"
                stroke="#f97316"
                fill="#f97316"
                fillOpacity={0.8}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Bonus Breakdown Pie Chart */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bonus Breakdown
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={bonusBreakdownData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={5}
                dataKey="value"
              >
                {bonusBreakdownData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
          <div className="mt-4 space-y-2">
            {bonusBreakdownData.map((item) => (
              <div key={item.name} className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <div
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: item.color }}
                  ></div>
                  <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-medium text-gray-900 dark:text-white">
                    {formatCurrency(item.amount)}
                  </span>
                  <span className="text-xs text-gray-500 dark:text-gray-400 ml-2">
                    ({item.value}%)
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Detailed Earnings Breakdown */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Detailed Earnings Breakdown
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-blue-800 dark:text-blue-300">Direct Sponsor Bonus</h4>
              <Users className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">
              {formatCurrency(earningsBreakdown.directSponsorBonus)}
            </p>
            <p className="text-sm text-blue-600 dark:text-blue-400 mt-1">
              30% from direct referrals
            </p>
          </div>

          <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-green-800 dark:text-green-300">Business Bonus</h4>
              <GitBranch className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-green-900 dark:text-green-200">
              {formatCurrency(earningsBreakdown.businessBonus)}
            </p>
            <p className="text-sm text-green-600 dark:text-green-400 mt-1">
              From binary tree pairs
            </p>
          </div>

          <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-purple-800 dark:text-purple-300">Indirect Sponsor Bonus</h4>
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">
              {formatCurrency(earningsBreakdown.indirectSponsorBonus)}
            </p>
            <p className="text-sm text-purple-600 dark:text-purple-400 mt-1">
              2nd-6th generation
            </p>
          </div>

          <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-orange-800 dark:text-orange-300">Roll-up Bonus</h4>
              <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">
              {formatCurrency(earningsBreakdown.rollupBonus)}
            </p>
            <p className="text-sm text-orange-600 dark:text-orange-400 mt-1">
              From package upgrades
            </p>
          </div>

          <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-teal-800 dark:text-teal-300">Unilevel Bonus</h4>
              <Repeat className="w-5 h-5 text-teal-600 dark:text-teal-400" />
            </div>
            <p className="text-2xl font-bold text-teal-900 dark:text-teal-200">
              {formatCurrency(earningsBreakdown.unilevelBonus)}
            </p>
            <p className="text-sm text-teal-600 dark:text-teal-400 mt-1">
              From repurchases
            </p>
          </div>

          <div className="p-4 bg-pink-50 dark:bg-pink-900/20 rounded-lg">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-medium text-pink-800 dark:text-pink-300">Retail Profit</h4>
              <Award className="w-5 h-5 text-pink-600 dark:text-pink-400" />
            </div>
            <p className="text-2xl font-bold text-pink-900 dark:text-pink-200">
              {formatCurrency(earningsBreakdown.retailProfit)}
            </p>
            <p className="text-sm text-pink-600 dark:text-pink-400 mt-1">
              30% retail margin
            </p>
          </div>
        </div>
      </div>

      {/* Recent Bonuses */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Bonuses
            </h3>
            <div className="flex items-center space-x-3">
              <select
                value={selectedBonusType}
                onChange={(e) => setSelectedBonusType(e.target.value)}
                className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              >
                {bonusTypes.map((type) => (
                  <option key={type.id} value={type.id}>{type.name}</option>
                ))}
              </select>
              <button className="flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                <Filter className="w-4 h-4 mr-1" />
                Filter
              </button>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Date</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Type</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Description</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">From</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Amount</th>
                <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredBonuses.map((bonus) => (
                <tr key={bonus.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {new Date(bonus.date).toLocaleDateString()}
                  </td>
                  <td className="py-4 px-6">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                      bonus.type === 'DSB' ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300' :
                      bonus.type === 'ISB' ? 'bg-purple-100 dark:bg-purple-900/30 text-purple-800 dark:text-purple-300' :
                      bonus.type === 'Business' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                      bonus.type === 'Rollup' ? 'bg-orange-100 dark:bg-orange-900/30 text-orange-800 dark:text-orange-300' :
                      'bg-teal-100 dark:bg-teal-900/30 text-teal-800 dark:text-teal-300'
                    }`}>
                      {bonus.type}
                    </span>
                  </td>
                  <td className="py-4 px-6 text-gray-900 dark:text-white">
                    {bonus.description}
                  </td>
                  <td className="py-4 px-6 text-gray-600 dark:text-gray-400">
                    {bonus.fromUser || '-'}
                    {bonus.generation && (
                      <span className="text-xs text-gray-500 dark:text-gray-400 ml-1">
                        (Gen {bonus.generation})
                      </span>
                    )}
                  </td>
                  <td className="py-4 px-6 font-medium text-green-600 dark:text-green-400">
                    +{formatCurrency(bonus.amount)}
                  </td>
                  <td className="py-4 px-6">
                    <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}