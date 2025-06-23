import React, { useState } from 'react';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  DollarSign,
  Calendar,
  Download,
  Filter,
  Eye,
  Package,
  Target
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';

export default function SponsorReports() {
  const { currency } = useApp();
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'quarter' | 'year'>('month');
  const [selectedReport, setSelectedReport] = useState<'overview' | 'registrations' | 'repurchases' | 'commissions'>('overview');

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  // Mock data for charts
  const registrationData = [
    { month: 'Jan', registrations: 8, revenue: 240000, commission: 72000 },
    { month: 'Feb', registrations: 12, revenue: 360000, commission: 108000 },
    { month: 'Mar', registrations: 6, revenue: 180000, commission: 54000 },
    { month: 'Apr', registrations: 15, revenue: 450000, commission: 135000 },
    { month: 'May', registrations: 10, revenue: 300000, commission: 90000 },
    { month: 'Jun', registrations: 18, revenue: 540000, commission: 162000 }
  ];

  const repurchaseData = [
    { month: 'Jan', orders: 25, revenue: 125000, commission: 12500 },
    { month: 'Feb', orders: 32, revenue: 160000, commission: 16000 },
    { month: 'Mar', orders: 28, revenue: 140000, commission: 14000 },
    { month: 'Apr', orders: 35, revenue: 175000, commission: 17500 },
    { month: 'May', orders: 30, revenue: 150000, commission: 15000 },
    { month: 'Jun', orders: 42, revenue: 210000, commission: 21000 }
  ];

  const packageDistribution = [
    { name: 'Starter', value: 35, count: 15, color: '#3b82f6' },
    { name: 'Regular', value: 40, count: 18, color: '#14b8a6' },
    { name: 'Executive', value: 25, count: 12, color: '#f97316' }
  ];

  const topPerformers = [
    { username: 'johnsmith', registrations: 8, repurchases: 15, totalCommission: 45000 },
    { username: 'janesmith', registrations: 6, repurchases: 12, totalCommission: 38000 },
    { username: 'mikejohnson', registrations: 5, repurchases: 10, totalCommission: 32000 },
    { username: 'sarahwilson', registrations: 4, repurchases: 8, totalCommission: 28000 },
    { username: 'davidbrown', registrations: 3, repurchases: 6, totalCommission: 22000 }
  ];

  const summaryStats = [
    {
      title: 'Total Registrations',
      value: '47',
      change: '+8 this month',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Registration Revenue',
      value: formatCurrency(1425000),
      change: '+15.2%',
      changeType: 'positive' as const,
      icon: DollarSign,
      color: 'bg-green-500'
    },
    {
      title: 'Repurchase Orders',
      value: '192',
      change: '+12 this month',
      changeType: 'positive' as const,
      icon: Package,
      color: 'bg-purple-500'
    },
    {
      title: 'Total Commission',
      value: formatCurrency(427500),
      change: '+18.5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sponsor Reports</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Comprehensive analytics and performance reports
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value as any)}
            className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="week">This Week</option>
            <option value="month">This Month</option>
            <option value="quarter">This Quarter</option>
            <option value="year">This Year</option>
          </select>
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {summaryStats.map((stat, index) => (
          <div
            key={stat.title}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${stat.color} rounded-lg flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <span className={`text-sm font-medium ${
                stat.changeType === 'positive' ? 'text-green-600 dark:text-green-400' :
                stat.changeType === 'negative' ? 'text-red-600 dark:text-red-400' :
                'text-gray-600 dark:text-gray-400'
              }`}>
                {stat.change}
              </span>
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

      {/* Report Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: BarChart3 },
              { id: 'registrations', name: 'Registrations', icon: Users },
              { id: 'repurchases', name: 'Repurchases', icon: Package },
              { id: 'commissions', name: 'Commissions', icon: DollarSign }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setSelectedReport(tab.id as any)}
                className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  selectedReport === tab.id
                    ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                    : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {selectedReport === 'overview' && (
            <div className="space-y-6">
              {/* Performance Overview */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Registration Performance
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <BarChart data={registrationData}>
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
                      <Bar dataKey="registrations" fill="#3b82f6" name="Registrations" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                    Package Distribution
                  </h3>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={packageDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={100}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {packageDistribution.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="mt-4 space-y-2">
                    {packageDistribution.map((item) => (
                      <div key={item.name} className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <div
                            className="w-3 h-3 rounded-full"
                            style={{ backgroundColor: item.color }}
                          ></div>
                          <span className="text-sm text-gray-600 dark:text-gray-400">{item.name}</span>
                        </div>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {item.count} ({item.value}%)
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Top Performers */}
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Top Performing Team Members
                </h3>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700">
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Rank</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Username</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Registrations</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Repurchases</th>
                        <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total Commission</th>
                      </tr>
                    </thead>
                    <tbody>
                      {topPerformers.map((performer, index) => (
                        <tr key={performer.username} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                          <td className="py-3 px-4">
                            <div className="flex items-center">
                              <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold text-white ${
                                index === 0 ? 'bg-yellow-500' :
                                index === 1 ? 'bg-gray-400' :
                                index === 2 ? 'bg-orange-600' :
                                'bg-gray-300'
                              }`}>
                                {index + 1}
                              </span>
                            </div>
                          </td>
                          <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                            {performer.username}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {performer.registrations}
                          </td>
                          <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                            {performer.repurchases}
                          </td>
                          <td className="py-3 px-4 font-medium text-green-600 dark:text-green-400">
                            {formatCurrency(performer.totalCommission)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'registrations' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Registration Trends
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <LineChart data={registrationData}>
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
                    <Line type="monotone" dataKey="registrations" stroke="#3b82f6" strokeWidth={3} name="Registrations" />
                    <Line type="monotone" dataKey="revenue" stroke="#14b8a6" strokeWidth={3} name="Revenue" />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                  <h4 className="font-medium text-blue-800 dark:text-blue-300 mb-2">Average per Month</h4>
                  <p className="text-2xl font-bold text-blue-900 dark:text-blue-200">11.5</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">registrations</p>
                </div>
                <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                  <h4 className="font-medium text-green-800 dark:text-green-300 mb-2">Best Month</h4>
                  <p className="text-2xl font-bold text-green-900 dark:text-green-200">18</p>
                  <p className="text-sm text-green-600 dark:text-green-400">June 2024</p>
                </div>
                <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                  <h4 className="font-medium text-purple-800 dark:text-purple-300 mb-2">Growth Rate</h4>
                  <p className="text-2xl font-bold text-purple-900 dark:text-purple-200">+25%</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">vs last quarter</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'repurchases' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Repurchase Performance
                </h3>
                <ResponsiveContainer width="100%" height={400}>
                  <BarChart data={repurchaseData}>
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
                    <Bar dataKey="orders" fill="#14b8a6" name="Orders" />
                    <Bar dataKey="revenue" fill="#f97316" name="Revenue" />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="p-4 bg-teal-50 dark:bg-teal-900/20 rounded-lg">
                  <h4 className="font-medium text-teal-800 dark:text-teal-300 mb-2">Total Orders</h4>
                  <p className="text-2xl font-bold text-teal-900 dark:text-teal-200">192</p>
                  <p className="text-sm text-teal-600 dark:text-teal-400">this period</p>
                </div>
                <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
                  <h4 className="font-medium text-orange-800 dark:text-orange-300 mb-2">Average Order Value</h4>
                  <p className="text-2xl font-bold text-orange-900 dark:text-orange-200">
                    {formatCurrency(5208)}
                  </p>
                  <p className="text-sm text-orange-600 dark:text-orange-400">per order</p>
                </div>
                <div className="p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-lg">
                  <h4 className="font-medium text-indigo-800 dark:text-indigo-300 mb-2">Repeat Rate</h4>
                  <p className="text-2xl font-bold text-indigo-900 dark:text-indigo-200">78%</p>
                  <p className="text-sm text-indigo-600 dark:text-indigo-400">customer retention</p>
                </div>
              </div>
            </div>
          )}

          {selectedReport === 'commissions' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                  Commission Breakdown
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-6 bg-gradient-to-br from-green-500 to-green-600 rounded-xl text-white">
                    <h4 className="font-semibold mb-2">Registration Commissions</h4>
                    <p className="text-3xl font-bold mb-1">{formatCurrency(321000)}</p>
                    <p className="text-green-100 text-sm">30% of registration fees</p>
                  </div>
                  <div className="p-6 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl text-white">
                    <h4 className="font-semibold mb-2">Repurchase Commissions</h4>
                    <p className="text-3xl font-bold mb-1">{formatCurrency(106500)}</p>
                    <p className="text-blue-100 text-sm">10% of repurchase orders</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 dark:text-white mb-4">Monthly Commission Trend</h4>
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={registrationData}>
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
                    <Line type="monotone" dataKey="commission" stroke="#10b981" strokeWidth={3} name="Commission" />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}