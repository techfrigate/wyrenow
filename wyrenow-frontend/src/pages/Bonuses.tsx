import React, { useState } from 'react';
import { 
  DollarSign, 
  Users, 
  GitBranch, 
  TrendingUp,
  Repeat,
  Award,
  Calendar,
  Filter,
  Download,
  Eye,
  Info
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { allBonuses, earningsBreakdown } from '../data/mockData';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';

export default function Bonuses() {
  const { currency } = useApp();
  const [selectedBonusType, setSelectedBonusType] = useState<string>('all');
  const [selectedPeriod, setSelectedPeriod] = useState<'week' | 'month' | 'year'>('month');

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const bonusTypes = [
    {
      id: 'DSB',
      name: 'Direct Sponsor Bonus',
      description: '30% commission from direct referral package purchases',
      icon: Users,
      color: 'bg-blue-500',
      amount: earningsBreakdown.directSponsorBonus,
      percentage: 35
    },
    {
      id: 'ISB',
      name: 'Indirect Sponsor Bonus',
      description: 'Commission from 2nd to 6th generation referrals',
      icon: Users,
      color: 'bg-purple-500',
      amount: earningsBreakdown.indirectSponsorBonus,
      percentage: 10
    },
    {
      id: 'Business',
      name: 'Business Bonus',
      description: 'Binary tree pairing bonus from left and right legs',
      icon: GitBranch,
      color: 'bg-green-500',
      amount: earningsBreakdown.businessBonus,
      percentage: 25
    },
    {
      id: 'Rollup',
      name: 'Roll-up Bonus',
      description: 'Bonus from downline package upgrades',
      icon: TrendingUp,
      color: 'bg-orange-500',
      amount: earningsBreakdown.rollupBonus,
      percentage: 12
    },
    {
      id: 'Unilevel',
      name: 'Unilevel Bonus',
      description: 'Commission from team monthly repurchases',
      icon: Repeat,
      color: 'bg-teal-500',
      amount: earningsBreakdown.unilevelBonus,
      percentage: 8
    }
  ];

  const filteredBonuses = selectedBonusType === 'all' 
    ? allBonuses 
    : allBonuses.filter(bonus => bonus.type === selectedBonusType);

  // Mock data for bonus trends
  const bonusTrendData = [
    { month: 'Jul', DSB: 35000, ISB: 12000, Business: 25000, Rollup: 8000, Unilevel: 5000 },
    { month: 'Aug', DSB: 42000, ISB: 15000, Business: 28000, Rollup: 10000, Unilevel: 6000 },
    { month: 'Sep', DSB: 38000, ISB: 13000, Business: 32000, Rollup: 12000, Unilevel: 7000 },
    { month: 'Oct', DSB: 55000, ISB: 18000, Business: 35000, Rollup: 15000, Unilevel: 8000 },
    { month: 'Nov', DSB: 75000, ISB: 25000, Business: 42000, Rollup: 18000, Unilevel: 10000 },
    { month: 'Dec', DSB: 98000, ISB: 35000, Business: 55000, Rollup: 22000, Unilevel: 12000 },
    { month: 'Jan', DSB: 125000, ISB: 45000, Business: 85000, Rollup: 35000, Unilevel: 25000 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Bonuses</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Track all your bonus earnings and commission types
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

      {/* Bonus Type Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {bonusTypes.map((bonus) => (
          <div
            key={bonus.id}
            className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700 hover:shadow-md transition-all duration-200"
          >
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 ${bonus.color} rounded-lg flex items-center justify-center`}>
                <bonus.icon className="w-6 h-6 text-white" />
              </div>
              <div className="text-right">
                <span className="text-sm text-gray-600 dark:text-gray-400">{bonus.percentage}% of total</span>
              </div>
            </div>
            
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                {bonus.name}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
                {bonus.description}
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">
                {formatCurrency(bonus.amount)}
              </p>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-3">
                <div
                  className={`h-2 rounded-full ${bonus.color.replace('bg-', 'bg-')}`}
                  style={{ width: `${bonus.percentage}%` }}
                ></div>
              </div>
              <button
                onClick={() => setSelectedBonusType(bonus.id)}
                className="text-sm text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300 font-medium"
              >
                View Details
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Bonus Trends Chart */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Bonus Trends
          </h3>
          <div className="flex items-center space-x-2">
            <button className="px-3 py-1.5 text-sm bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 rounded-lg">
              Monthly
            </button>
            <button className="px-3 py-1.5 text-sm text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg">
              Quarterly
            </button>
          </div>
        </div>
        
        <ResponsiveContainer width="100%" height={400}>
          <BarChart data={bonusTrendData}>
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
            <Bar dataKey="DSB" stackId="a" fill="#3b82f6" name="Direct Sponsor" />
            <Bar dataKey="Business" stackId="a" fill="#14b8a6" name="Business" />
            <Bar dataKey="ISB" stackId="a" fill="#8b5cf6" name="Indirect Sponsor" />
            <Bar dataKey="Rollup" stackId="a" fill="#f97316" name="Roll-up" />
            <Bar dataKey="Unilevel" stackId="a" fill="#14b8a6" name="Unilevel" />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Bonus Details */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Bonus Calculation Rules */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Bonus Calculation Rules
          </h3>
          
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-blue-600 dark:text-blue-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-blue-800 dark:text-blue-300">Direct Sponsor Bonus</h4>
                  <p className="text-sm text-blue-700 dark:text-blue-400 mt-1">
                    Earn 30% commission on all direct referral package purchases. Paid instantly upon purchase.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <GitBranch className="w-5 h-5 text-green-600 dark:text-green-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-green-800 dark:text-green-300">Business Bonus</h4>
                  <p className="text-sm text-green-700 dark:text-green-400 mt-1">
                    ₦500 per pair from binary tree matching. Maximum 20 pairs per day. Requires active status.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <Users className="w-5 h-5 text-purple-600 dark:text-purple-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-purple-800 dark:text-purple-300">Indirect Sponsor Bonus</h4>
                  <p className="text-sm text-purple-700 dark:text-purple-400 mt-1">
                    2nd Gen: 10%, 3rd Gen: 5%, 4th Gen: 3%, 5th Gen: 2%, 6th Gen: 1% of package value.
                  </p>
                </div>
              </div>
            </div>

            <div className="p-4 bg-orange-50 dark:bg-orange-900/20 rounded-lg">
              <div className="flex items-start space-x-3">
                <TrendingUp className="w-5 h-5 text-orange-600 dark:text-orange-400 mt-0.5" />
                <div>
                  <h4 className="font-medium text-orange-800 dark:text-orange-300">Roll-up Bonus</h4>
                  <p className="text-sm text-orange-700 dark:text-orange-400 mt-1">
                    30% direct, 15% indirect from downline package upgrades. Paid on upgrade difference.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Bonus Activity */}
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Recent Bonus Activity
            </h3>
            <select
              value={selectedBonusType}
              onChange={(e) => setSelectedBonusType(e.target.value)}
              className="px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Bonuses</option>
              <option value="DSB">Direct Sponsor</option>
              <option value="ISB">Indirect Sponsor</option>
              <option value="Business">Business Bonus</option>
              <option value="Rollup">Roll-up Bonus</option>
              <option value="Unilevel">Unilevel Bonus</option>
            </select>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredBonuses.map((bonus) => (
              <div key={bonus.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                <div className="flex items-center space-x-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    bonus.type === 'DSB' ? 'bg-blue-100 dark:bg-blue-900/30' :
                    bonus.type === 'ISB' ? 'bg-purple-100 dark:bg-purple-900/30' :
                    bonus.type === 'Business' ? 'bg-green-100 dark:bg-green-900/30' :
                    bonus.type === 'Rollup' ? 'bg-orange-100 dark:bg-orange-900/30' :
                    'bg-teal-100 dark:bg-teal-900/30'
                  }`}>
                    {bonus.type === 'DSB' && <Users className="w-4 h-4 text-blue-600 dark:text-blue-400" />}
                    {bonus.type === 'ISB' && <Users className="w-4 h-4 text-purple-600 dark:text-purple-400" />}
                    {bonus.type === 'Business' && <GitBranch className="w-4 h-4 text-green-600 dark:text-green-400" />}
                    {bonus.type === 'Rollup' && <TrendingUp className="w-4 h-4 text-orange-600 dark:text-orange-400" />}
                    {bonus.type === 'Unilevel' && <Repeat className="w-4 h-4 text-teal-600 dark:text-teal-400" />}
                  </div>
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white text-sm">
                      {bonus.type} Bonus
                    </p>
                    <p className="text-xs text-gray-600 dark:text-gray-400">
                      {bonus.fromUser && `From ${bonus.fromUser}`}
                      {bonus.generation && ` (Gen ${bonus.generation})`}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(bonus.date).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600 dark:text-green-400">
                    +{formatCurrency(bonus.amount)}
                  </p>
                  <button className="text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                    <Eye className="w-3 h-3" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bonus Performance Metrics */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-6">
          Bonus Performance Metrics
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="text-center">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Calendar className="w-8 h-8 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">28</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Days Active</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <TrendingUp className="w-8 h-8 text-green-600 dark:text-green-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">156%</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Growth Rate</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-purple-100 dark:bg-purple-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <Award className="w-8 h-8 text-purple-600 dark:text-purple-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">45</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Pairs</p>
          </div>
          
          <div className="text-center">
            <div className="w-16 h-16 bg-orange-100 dark:bg-orange-900/30 rounded-full flex items-center justify-center mx-auto mb-3">
              <DollarSign className="w-8 h-8 text-orange-600 dark:text-orange-400" />
            </div>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              {formatCurrency(earningsBreakdown.totalEarnings)}
            </p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Total Bonuses</p>
          </div>
        </div>
      </div>
    </div>
  );
}