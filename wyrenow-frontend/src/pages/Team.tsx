import React, { useState } from 'react';
import { 
  Users, 
  Search, 
  Filter,
  Download,
  UserPlus,
  Crown,
  Package,
  Calendar,
  TrendingUp,
  Eye,
  Mail,
  Phone
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { teamMembers, enhancedUsers } from '../data/mockData';
import { TeamMember } from '../data/mockData';

export default function Team() {
  const { currency } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedGeneration, setSelectedGeneration] = useState<number | 'all'>('all');
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);
  const [viewMode, setViewMode] = useState<'list' | 'grid'>('list');

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const filteredMembers = teamMembers.filter(member => {
    const matchesSearch = 
      member.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.user.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesGeneration = selectedGeneration === 'all' || member.generation === selectedGeneration;
    
    return matchesSearch && matchesGeneration;
  });

  const teamStats = [
    {
      title: 'Total Team Members',
      value: '156',
      change: '+8 this month',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-blue-500'
    },
    {
      title: 'Direct Referrals',
      value: '22',
      change: '+3 this month',
      changeType: 'positive' as const,
      icon: UserPlus,
      color: 'bg-green-500'
    },
    {
      title: 'Active Members',
      value: '142',
      change: '91% active rate',
      changeType: 'neutral' as const,
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      title: 'Team Volume',
      value: '1,920 PV',
      change: '+12.5% this month',
      changeType: 'positive' as const,
      icon: Package,
      color: 'bg-orange-500'
    }
  ];

  const generationStats = [
    { generation: 1, count: 22, totalPV: 1320, active: 22 },
    { generation: 2, count: 45, totalPV: 1800, active: 43 },
    { generation: 3, count: 38, totalPV: 1520, active: 35 },
    { generation: 4, count: 28, totalPV: 1120, active: 25 },
    { generation: 5, count: 23, totalPV: 920, active: 17 }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">My Team</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Manage and track your team members across all generations
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
            <Download className="w-4 h-4 mr-2" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
            <UserPlus className="w-4 h-4 mr-2" />
            Invite Member
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {teamStats.map((stat, index) => (
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

      {/* Generation Overview */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          Generation Overview
        </h3>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Generation</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Members</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Active</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Total PV</th>
                <th className="text-left py-3 px-4 font-medium text-gray-900 dark:text-white">Activity Rate</th>
              </tr>
            </thead>
            <tbody>
              {generationStats.map((gen) => (
                <tr key={gen.generation} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td className="py-3 px-4">
                    <span className="font-medium text-gray-900 dark:text-white">
                      Generation {gen.generation}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-gray-600 dark:text-gray-400">
                    {gen.count}
                  </td>
                  <td className="py-3 px-4">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300">
                      {gen.active}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-medium text-gray-900 dark:text-white">
                    {gen.totalPV.toLocaleString()}
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center">
                      <div className="w-16 bg-gray-200 dark:bg-gray-700 rounded-full h-2 mr-2">
                        <div
                          className="bg-green-500 h-2 rounded-full"
                          style={{ width: `${(gen.active / gen.count) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm text-gray-600 dark:text-gray-400">
                        {Math.round((gen.active / gen.count) * 100)}%
                      </span>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search team members..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <select
              value={selectedGeneration}
              onChange={(e) => setSelectedGeneration(e.target.value === 'all' ? 'all' : parseInt(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Generations</option>
              <option value={1}>Generation 1</option>
              <option value={2}>Generation 2</option>
              <option value={3}>Generation 3</option>
              <option value={4}>Generation 4</option>
              <option value={5}>Generation 5</option>
            </select>
          </div>

          <div className="flex items-center space-x-3">
            <div className="flex bg-gray-100 dark:bg-gray-700 rounded-lg p-1">
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'list'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                List
              </button>
              <button
                onClick={() => setViewMode('grid')}
                className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                  viewMode === 'grid'
                    ? 'bg-white dark:bg-gray-600 text-gray-900 dark:text-white shadow-sm'
                    : 'text-gray-600 dark:text-gray-400'
                }`}
              >
                Grid
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Team Members */}
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="p-6 border-b border-gray-200 dark:border-gray-700">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Team Members ({filteredMembers.length})
          </h3>
        </div>

        {viewMode === 'list' ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Member</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Generation</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Package</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Rank</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Team Size</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Status</th>
                  <th className="text-left py-4 px-6 font-medium text-gray-900 dark:text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredMembers.map((member) => (
                  <tr key={member.user.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50">
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-3">
                        <img
                          src={member.user.profileImage || `https://ui-avatars.com/api/?name=${member.user.firstName}+${member.user.lastName}&background=3b82f6&color=white`}
                          alt={`${member.user.firstName} ${member.user.lastName}`}
                          className="w-10 h-10 rounded-full object-cover"
                        />
                        <div>
                          <p className="font-medium text-gray-900 dark:text-white">
                            {member.user.firstName} {member.user.lastName}
                          </p>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {member.user.email}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                        Gen {member.generation}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300">
                        <Package className="w-3 h-3 mr-1" />
                        {member.user.package.name}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                        <Crown className="w-3 h-3 mr-1" />
                        {member.user.rank.name}
                      </span>
                    </td>
                    <td className="py-4 px-6 text-gray-900 dark:text-white font-medium">
                      {member.totalTeamSize}
                    </td>
                    <td className="py-4 px-6">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                        member.isActive
                          ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                          : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                      }`}>
                        {member.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="py-4 px-6">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setSelectedMember(member)}
                          className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                        >
                          <Eye className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Mail className="w-4 h-4" />
                        </button>
                        <button className="p-1 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300">
                          <Phone className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredMembers.map((member) => (
              <div key={member.user.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4 hover:shadow-md transition-shadow">
                <div className="flex items-center space-x-3 mb-4">
                  <img
                    src={member.user.profileImage || `https://ui-avatars.com/api/?name=${member.user.firstName}+${member.user.lastName}&background=3b82f6&color=white`}
                    alt={`${member.user.firstName} ${member.user.lastName}`}
                    className="w-12 h-12 rounded-full object-cover"
                  />
                  <div className="flex-1">
                    <h4 className="font-medium text-gray-900 dark:text-white">
                      {member.user.firstName} {member.user.lastName}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Generation {member.generation}
                    </p>
                  </div>
                  <span className={`w-3 h-3 rounded-full ${
                    member.isActive ? 'bg-green-400' : 'bg-red-400'
                  }`}></span>
                </div>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Package:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {member.user.package.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Rank:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {member.user.rank.name}
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Team Size:</span>
                    <span className="font-medium text-gray-900 dark:text-white">
                      {member.totalTeamSize}
                    </span>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setSelectedMember(member)}
                    className="flex-1 px-3 py-2 bg-primary-600 text-white text-sm rounded-lg hover:bg-primary-700 transition-colors"
                  >
                    View Details
                  </button>
                  <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 text-sm rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                    Contact
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Member Details Modal */}
      {selectedMember && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Member Details
              </h3>
              <button
                onClick={() => setSelectedMember(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Basic Info */}
              <div className="flex items-center space-x-4">
                <img
                  src={selectedMember.user.profileImage || `https://ui-avatars.com/api/?name=${selectedMember.user.firstName}+${selectedMember.user.lastName}&background=3b82f6&color=white`}
                  alt={`${selectedMember.user.firstName} ${selectedMember.user.lastName}`}
                  className="w-20 h-20 rounded-full object-cover"
                />
                <div>
                  <h4 className="text-xl font-semibold text-gray-900 dark:text-white">
                    {selectedMember.user.firstName} {selectedMember.user.lastName}
                  </h4>
                  <p className="text-gray-600 dark:text-gray-400">{selectedMember.user.email}</p>
                  <p className="text-gray-600 dark:text-gray-400">{selectedMember.user.phone}</p>
                  <div className="flex items-center space-x-2 mt-2">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      selectedMember.isActive
                        ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                        : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                    }`}>
                      {selectedMember.isActive ? 'Active' : 'Inactive'}
                    </span>
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300">
                      Generation {selectedMember.generation}
                    </span>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Package</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedMember.user.package.name}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Rank</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedMember.user.rank.name}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Team Size</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedMember.totalTeamSize}
                  </p>
                </div>
                <div className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">Join Date</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {new Date(selectedMember.joinDate).toLocaleDateString()}
                  </p>
                </div>
              </div>

              {/* Additional Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">Package Details</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">PV/BV:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedMember.user.package.pv}/{selectedMember.user.package.bv}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Bottles:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedMember.user.package.bottles}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Cost:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {formatCurrency(currency === 'NGN' ? selectedMember.user.package.costNGN : selectedMember.user.package.costGHS)}
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h5 className="font-medium text-gray-900 dark:text-white mb-3">Activity</h5>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Position:</span>
                      <span className="font-medium text-gray-900 dark:text-white capitalize">
                        {selectedMember.position} Leg
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Last Activity:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {new Date(selectedMember.lastActivity).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600 dark:text-gray-400">Country:</span>
                      <span className="font-medium text-gray-900 dark:text-white">
                        {selectedMember.user.country}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Actions */}
              <div className="flex space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  View in Tree
                </button>
                <button className="flex-1 px-4 py-2 bg-secondary-600 text-white rounded-lg hover:bg-secondary-700 transition-colors">
                  Send Message
                </button>
                <button className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Export Data
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}