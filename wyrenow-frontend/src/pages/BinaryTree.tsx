import React, { useState } from 'react';
import { 
  GitBranch, 
  Users, 
  TrendingUp, 
  Search, 
  Filter,
  ChevronDown,
  ChevronRight,
  Package,
  Crown,
  Eye,
  UserPlus,
  BarChart3
} from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { binaryTreeData, binaryTreeStats, enhancedUsers } from '../data/mockData';
import { TreeNode } from '../types';

interface TreeNodeComponentProps {
  node: TreeNode;
  onNodeClick: (node: TreeNode) => void;
  isExpanded: boolean;
  onToggleExpand: (nodeId: string) => void;
}

function TreeNodeComponent({ node, onNodeClick, isExpanded, onToggleExpand }: TreeNodeComponentProps) {
  const { currency } = useApp();
  const hasChildren = node.leftChild || node.rightChild;

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  return (
    <div className="flex flex-col items-center">
      {/* Node */}
      <div 
        className="relative bg-white dark:bg-gray-800 rounded-xl p-4 shadow-lg border-2 border-gray-200 dark:border-gray-700 hover:border-primary-300 dark:hover:border-primary-600 transition-all duration-200 cursor-pointer min-w-[280px]"
        onClick={() => onNodeClick(node)}
      >
        {/* Expand/Collapse Button */}
        {hasChildren && (
          <button
            className="absolute -top-2 -right-2 w-6 h-6 bg-primary-500 text-white rounded-full flex items-center justify-center hover:bg-primary-600 transition-colors"
            onClick={(e) => {
              e.stopPropagation();
              onToggleExpand(node.user.id);
            }}
          >
            {isExpanded ? <ChevronDown className="w-3 h-3" /> : <ChevronRight className="w-3 h-3" />}
          </button>
        )}

        {/* User Info */}
        <div className="flex items-center space-x-3 mb-3">
          <img
            src={node.user.profileImage || `https://ui-avatars.com/api/?name=${node.user.firstName}+${node.user.lastName}&background=3b82f6&color=white`}
            alt={`${node.user.firstName} ${node.user.lastName}`}
            className="w-12 h-12 rounded-full object-cover border-2 border-primary-200"
          />
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white">
              {node.user.firstName} {node.user.lastName}
            </h4>
            <p className="text-sm text-gray-600 dark:text-gray-400">{node.user.email}</p>
            <div className="flex items-center space-x-2 mt-1">
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300">
                <Crown className="w-3 h-3 mr-1" />
                {node.user.rank.name}
              </span>
              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-secondary-100 dark:bg-secondary-900/30 text-secondary-800 dark:text-secondary-300">
                <Package className="w-3 h-3 mr-1" />
                {node.user.package.name}
              </span>
            </div>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 gap-3">
          <div className="text-center p-2 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <p className="text-xs text-green-600 dark:text-green-400 font-medium">Left PV</p>
            <p className="text-sm font-bold text-green-800 dark:text-green-300">{node.totalLeftPV}</p>
          </div>
          <div className="text-center p-2 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-xs text-blue-600 dark:text-blue-400 font-medium">Right PV</p>
            <p className="text-sm font-bold text-blue-800 dark:text-blue-300">{node.totalRightPV}</p>
          </div>
        </div>

        {/* Status Indicator */}
        <div className="absolute top-2 right-2">
          <div className={`w-3 h-3 rounded-full ${node.user.isActive ? 'bg-green-400' : 'bg-gray-400'}`}></div>
        </div>
      </div>

      {/* Children */}
      {isExpanded && hasChildren && (
        <div className="mt-8 flex justify-center space-x-16">
          {/* Left Child */}
          <div className="flex flex-col items-center">
            {node.leftChild && (
              <>
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">LEFT</div>
                <TreeNodeComponent
                  node={node.leftChild}
                  onNodeClick={onNodeClick}
                  isExpanded={true}
                  onToggleExpand={onToggleExpand}
                />
              </>
            )}
            {!node.leftChild && (
              <div className="mt-8 w-64 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <UserPlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available Position</p>
                  <button className="mt-2 px-3 py-1 bg-primary-500 text-white text-xs rounded-lg hover:bg-primary-600 transition-colors">
                    Place Member
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Right Child */}
          <div className="flex flex-col items-center">
            {node.rightChild && (
              <>
                <div className="w-px h-8 bg-gray-300 dark:bg-gray-600"></div>
                <div className="text-xs text-gray-500 dark:text-gray-400 mb-2 font-medium">RIGHT</div>
                <TreeNodeComponent
                  node={node.rightChild}
                  onNodeClick={onNodeClick}
                  isExpanded={true}
                  onToggleExpand={onToggleExpand}
                />
              </>
            )}
            {!node.rightChild && (
              <div className="mt-8 w-64 h-32 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-xl flex items-center justify-center">
                <div className="text-center">
                  <UserPlus className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <p className="text-sm text-gray-500 dark:text-gray-400">Available Position</p>
                  <button className="mt-2 px-3 py-1 bg-primary-500 text-white text-xs rounded-lg hover:bg-primary-600 transition-colors">
                    Place Member
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function BinaryTree() {
  const { currency } = useApp();
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1']));
  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState<'tree' | 'stats'>('tree');

  const formatCurrency = (amount: number) => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  };

  const handleNodeClick = (node: TreeNode) => {
    setSelectedNode(node);
  };

  const handleToggleExpand = (nodeId: string) => {
    const newExpanded = new Set(expandedNodes);
    if (newExpanded.has(nodeId)) {
      newExpanded.delete(nodeId);
    } else {
      newExpanded.add(nodeId);
    }
    setExpandedNodes(newExpanded);
  };

  const stats = [
    {
      title: 'Left Leg PV',
      value: binaryTreeStats.leftLegPV.toLocaleString(),
      change: '+12.5%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-green-500'
    },
    {
      title: 'Right Leg PV',
      value: binaryTreeStats.rightLegPV.toLocaleString(),
      change: '+8.3%',
      changeType: 'positive' as const,
      icon: TrendingUp,
      color: 'bg-blue-500'
    },
    {
      title: 'Total Pairs',
      value: binaryTreeStats.totalPairs.toString(),
      change: '+5 this week',
      changeType: 'positive' as const,
      icon: GitBranch,
      color: 'bg-purple-500'
    },
    {
      title: 'Team Members',
      value: (binaryTreeStats.leftLegMembers + binaryTreeStats.rightLegMembers).toString(),
      change: '+3 this week',
      changeType: 'positive' as const,
      icon: Users,
      color: 'bg-orange-500'
    }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Binary Tree</h1>
          <p className="text-gray-600 dark:text-gray-400 mt-1">
            Visualize and manage your binary tree structure
          </p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <div className="flex bg-gray-100 dark:bg-gray-800 rounded-lg p-1">
            <button
              onClick={() => setViewMode('tree')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'tree'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <GitBranch className="w-4 h-4 mr-2 inline" />
              Tree View
            </button>
            <button
              onClick={() => setViewMode('stats')}
              className={`px-3 py-1.5 text-sm font-medium rounded-md transition-colors ${
                viewMode === 'stats'
                  ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-sm'
                  : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
              }`}
            >
              <BarChart3 className="w-4 h-4 mr-2 inline" />
              Statistics
            </button>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
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
            <div>
              <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-1">
                {stat.value}
              </h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">{stat.title}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Search and Filters */}
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search team members..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="flex items-center space-x-3">
            <button className="flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <Filter className="w-4 h-4 mr-2" />
              Filter
            </button>
            <button className="flex items-center px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Eye className="w-4 h-4 mr-2" />
              Full Screen
            </button>
          </div>
        </div>
      </div>

      {viewMode === 'tree' ? (
        /* Tree Visualization */
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
          <div className="overflow-x-auto">
            <div className="min-w-max p-8">
              <TreeNodeComponent
                node={binaryTreeData}
                onNodeClick={handleNodeClick}
                isExpanded={expandedNodes.has(binaryTreeData.user.id)}
                onToggleExpand={handleToggleExpand}
              />
            </div>
          </div>
        </div>
      ) : (
        /* Statistics View */
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Leg Comparison */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Leg Comparison
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-green-800 dark:text-green-300">Left Leg</p>
                  <p className="text-sm text-green-600 dark:text-green-400">
                    {binaryTreeStats.leftLegMembers} members
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-green-800 dark:text-green-300">
                    {binaryTreeStats.leftLegPV}
                  </p>
                  <p className="text-sm text-green-600 dark:text-green-400">PV</p>
                </div>
              </div>
              
              <div className="flex items-center justify-between p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div>
                  <p className="font-medium text-blue-800 dark:text-blue-300">Right Leg</p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">
                    {binaryTreeStats.rightLegMembers} members
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-2xl font-bold text-blue-800 dark:text-blue-300">
                    {binaryTreeStats.rightLegPV}
                  </p>
                  <p className="text-sm text-blue-600 dark:text-blue-400">PV</p>
                </div>
              </div>

              <div className="p-4 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-medium text-purple-800 dark:text-purple-300">Balance Status</p>
                  <p className="text-sm text-purple-600 dark:text-purple-400">
                    {Math.abs(binaryTreeStats.leftLegPV - binaryTreeStats.rightLegPV)} PV difference
                  </p>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                  <div
                    className="bg-purple-500 h-2 rounded-full"
                    style={{
                      width: `${Math.min(binaryTreeStats.leftLegPV, binaryTreeStats.rightLegPV) / Math.max(binaryTreeStats.leftLegPV, binaryTreeStats.rightLegPV) * 100}%`
                    }}
                  ></div>
                </div>
              </div>
            </div>
          </div>

          {/* Pairing Information */}
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Pairing Information
            </h3>
            <div className="space-y-4">
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Total Pairs This Month</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {binaryTreeStats.monthlyPairs}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Pairs This Week</span>
                <span className="font-semibold text-gray-900 dark:text-white">
                  {binaryTreeStats.weeklyPairs}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Unused Left PV</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {binaryTreeStats.unusedLeftPV}
                </span>
              </div>
              
              <div className="flex items-center justify-between p-3 border border-gray-200 dark:border-gray-600 rounded-lg">
                <span className="text-gray-600 dark:text-gray-400">Unused Right PV</span>
                <span className="font-semibold text-orange-600 dark:text-orange-400">
                  {binaryTreeStats.unusedRightPV}
                </span>
              </div>

              <div className="p-4 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <p className="text-sm text-amber-800 dark:text-amber-300 font-medium mb-1">
                  Business Bonus Potential
                </p>
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  Next pair will generate {formatCurrency(500)} business bonus
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Selected Node Details Modal */}
      {selectedNode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                Member Details
              </h3>
              <button
                onClick={() => setSelectedNode(null)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
              >
                ×
              </button>
            </div>
            
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <img
                  src={selectedNode.user.profileImage || `https://ui-avatars.com/api/?name=${selectedNode.user.firstName}+${selectedNode.user.lastName}&background=3b82f6&color=white`}
                  alt={`${selectedNode.user.firstName} ${selectedNode.user.lastName}`}
                  className="w-16 h-16 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-gray-900 dark:text-white">
                    {selectedNode.user.firstName} {selectedNode.user.lastName}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedNode.user.email}
                  </p>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {selectedNode.user.phone}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Package</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedNode.user.package.name}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Rank</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedNode.user.rank.name}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Left PV</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedNode.totalLeftPV}
                  </p>
                </div>
                <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <p className="text-xs text-gray-600 dark:text-gray-400">Right PV</p>
                  <p className="font-semibold text-gray-900 dark:text-white">
                    {selectedNode.totalRightPV}
                  </p>
                </div>
              </div>

              <div className="flex space-x-3">
                <button className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
                  View Profile
                </button>
                <button className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
                  Contact
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}