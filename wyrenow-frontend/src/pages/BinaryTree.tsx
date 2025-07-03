import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { GitBranch, Users, TrendingUp, Search, Filter, Eye, DivideIcon as LucideIcon, ZoomIn, ZoomOut, RotateCcw, Menu, X } from 'lucide-react';
import { useApp } from '../contexts/AppContext';
import { binaryTreeData, binaryTreeStats } from '../data/mockData';
import { TreeNode } from '../types';
import Button from '../components/ui/Button';
import StatCard from '../components/binaryTree/StatCard';
import TreeNodeComponent from '../components/binaryTree/TreeNodeComponent';
import NodeDetailsModal from '../components/binaryTree/NodeDetailsModal';

import { clearError, fetchBinaryTree } from '../redux/slices/binaryTreeSlice';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import LoadingScreen from '../components/Layout/LoadingScreen';
import toast from 'react-hot-toast';
import LoadingSpinner from '../components/Layout/LoadingSpinner';
interface StatItem {
  title: string;
  value: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  isPVBVCard?: false;
}

interface PVBVStatItem {
  title: string;
  pvValue: string;
  bvValue: string;
  change: string;
  icon: React.ComponentType<any>;
  color: string;
  isPVBVCard: true;
}

interface ViewModeButtonProps {
  mode: string;
  currentMode: string;
  onClick: () => void;
  icon: React.ReactNode;
  label: string;
}

interface LegInfoCardProps {
  title: string;
  members: number;
  pv: number;
  colorClass: string;
  textColorClass: string;
}

interface BalanceStatusCardProps {
  leftLegPV: number;
  rightLegPV: number;
}

interface InfoRowProps {
  label: string;
  value: number;
  valueClass?: string;
}

type StatsType = StatItem | PVBVStatItem;

// Responsive UI components
const ViewModeButton: React.FC<ViewModeButtonProps> = ({ mode, currentMode, onClick, icon, label }) => (
  <button
    onClick={onClick}
    className={`flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-all duration-200 ${
      currentMode === mode
        ? 'bg-white dark:bg-gray-700 text-gray-900 dark:text-white shadow-md scale-105'
        : 'text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700/50'
    }`}
  >
    <span className="w-4 h-4">{icon}</span>
    <span className="hidden sm:inline">{label}</span>
  </button>
);

const LegInfoCard: React.FC<LegInfoCardProps> = ({ title, members, pv, colorClass, textColorClass }) => (
  <div className={`flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 ${colorClass} rounded-xl shadow-sm`}>
    <div className="mb-2 sm:mb-0">
      <p className={`font-semibold text-lg ${textColorClass}-800 dark:${textColorClass}-300`}>{title}</p>
      <p className={`text-sm ${textColorClass}-600 dark:${textColorClass}-400`}>
        {members} members
      </p>
    </div>
    <div className="text-left sm:text-right">
      <p className={`text-2xl sm:text-3xl font-bold ${textColorClass}-800 dark:${textColorClass}-300`}>
        {pv.toLocaleString()}
      </p>
      <p className={`text-sm ${textColorClass}-600 dark:${textColorClass}-400`}>PV</p>
    </div>
  </div>
);

const BalanceStatusCard: React.FC<BalanceStatusCardProps> = ({ leftLegPV, rightLegPV }) => {
  const difference = Math.abs(leftLegPV - rightLegPV);
  const percentage = Math.min(leftLegPV, rightLegPV) / Math.max(leftLegPV, rightLegPV) * 100;
  
  return (
    <div className="p-4 bg-gradient-to-r from-purple-50 to-indigo-50 dark:from-purple-900/20 dark:to-indigo-900/20 rounded-xl shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
        <p className="font-semibold text-purple-800 dark:text-purple-300 mb-1 sm:mb-0">Balance Status</p>
        <p className="text-sm text-purple-600 dark:text-purple-400">
          {difference.toLocaleString()} PV difference
        </p>
      </div>
      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
        <div
          className="bg-gradient-to-r from-purple-500 to-indigo-500 h-3 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
      <p className="text-xs text-purple-600 dark:text-purple-400 mt-2">
        {percentage.toFixed(1)}% balanced
      </p>
    </div>
  );
};

const InfoRow: React.FC<InfoRowProps> = ({ label, value, valueClass = "text-gray-900 dark:text-white" }) => (
  <div className="flex items-center justify-between p-4 border border-gray-200 dark:border-gray-600 rounded-xl hover:bg-gray-50 dark:hover:bg-gray-700/30 transition-colors">
    <span className="text-gray-600 dark:text-gray-400 text-sm sm:text-base">{label}</span>
    <span className={`font-bold text-lg ${valueClass}`}>{value.toLocaleString()}</span>
  </div>
);

const BinaryTree: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currency } = useApp();
  
  // Redux selectors with proper typing
  const { treeData, stats, loading, error } = useAppSelector((state) => state.binaryTree);
  const { user } = useAppSelector((state) => state.auth);
  // Get current user ID (you might get this from auth context or props)
  const currentUserId: number = Number(user?.id) || 0 // Replace with actual current user ID
  
  // State variables
  const [selectedNode, setSelectedNode] = useState<TreeNode | null>(null);
  const [expandedNodes, setExpandedNodes] = useState<Set<string>>(new Set(['1']));
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [viewMode, setViewMode] = useState<'tree' | 'stats'>('tree');
  const [zoomLevel, setZoomLevel] = useState<number>(1);
  const [panPosition, setPanPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [dragStart, setDragStart] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showMobileControls, setShowMobileControls] = useState<boolean>(false);

  // Fetch data on component mount
  useEffect(() => {
    dispatch(fetchBinaryTree(currentUserId));
  }, [dispatch, currentUserId]);

  useEffect(()=>{
    if(error){
      toast.error(error);
      setTimeout(()=>{
      dispatch(clearError())
      },2000)
    }
  },[error])
// Auto-expand ALL nodes when data loads

const collectAllNodeIds = useCallback((node: TreeNode): string[] => {
  const ids = [node.user.id];
  
  if (node.leftChild) {
    ids.push(...collectAllNodeIds(node.leftChild));
  }
  
  if (node.rightChild) {
    ids.push(...collectAllNodeIds(node.rightChild));
  }
  
  return ids;
}, []);


useEffect(() => {
  if (treeData) {
    const allNodeIds = collectAllNodeIds(treeData);
    setExpandedNodes(new Set(allNodeIds));
  }
}, [treeData, collectAllNodeIds]);

  const formatCurrency = useCallback((amount: number): string => {
    const symbol = currency === 'NGN' ? '₦' : 'GH₵';
    return `${symbol}${amount.toLocaleString()}`;
  }, [currency]);

  const handleNodeClick = useCallback((node: TreeNode): void => {
    setSelectedNode(node);
  }, []);


  

  const handleToggleExpand = useCallback((nodeId: string): void => {
    setExpandedNodes(prevExpanded => {
      const newExpanded = new Set(prevExpanded);
      if (newExpanded.has(nodeId)) {
        newExpanded.delete(nodeId);
      } else {
        newExpanded.add(nodeId);
      }
      return newExpanded;
    });
  }, []);

  const handleZoomIn = useCallback(() => {
    setZoomLevel(prev => Math.min(prev + 0.1, 5));
  }, []);

  const handleZoomOut = useCallback(() => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.1));
  }, []);

  const handleResetZoom = useCallback(() => {
    setZoomLevel(0.8);
    setPanPosition({ x: 0, y: 0 });
  }, []);

  // Pan functionality
  const handleMouseDown = useCallback((e: React.MouseEvent) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panPosition.x, y: e.clientY - panPosition.y });
  }, [panPosition]);

  const handleMouseMove = useCallback((e: React.MouseEvent) => {
    if (!isDragging) return;
    setPanPosition({
      x: e.clientX - dragStart.x,
      y: e.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleMouseUp = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Touch events for mobile
  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    if (e.touches.length === 1) {
      const touch = e.touches[0];
      setIsDragging(true);
      setDragStart({ x: touch.clientX - panPosition.x, y: touch.clientY - panPosition.y });
    }
  }, [panPosition]);

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isDragging || e.touches.length !== 1) return;
    e.preventDefault();
    const touch = e.touches[0];
    setPanPosition({
      x: touch.clientX - dragStart.x,
      y: touch.clientY - dragStart.y
    });
  }, [isDragging, dragStart]);

  const handleTouchEnd = useCallback(() => {
    setIsDragging(false);
  }, []);

  // Wheel zoom
  const handleWheel = useCallback((e: React.WheelEvent) => {
    e.preventDefault();
    const delta = e.deltaY > 0 ? -0.1 : 0.1;
    setZoomLevel(prev => Math.max(0.1, Math.min(5, prev + delta)));
  }, []);

  // Updated stats using Redux data with proper typing
  const statsData: StatsType[] = useMemo(() => {
    if (!stats) return [];
    
    return [
      {
        title: 'Left Leg',
        pvValue: stats.leftLegPV.toLocaleString(),
        bvValue: stats.leftLegBV.toLocaleString(),
        change: '',
        icon: TrendingUp,
        color: 'bg-emerald-500',
        isPVBVCard: true
      },
      {
        title: 'Right Leg',
        pvValue: stats.rightLegPV.toLocaleString(),
        bvValue: stats.rightLegBV.toLocaleString(),
        change: '',
        icon: TrendingUp,
        color: 'bg-blue-500',
        isPVBVCard: true
      },
      {
        title: 'Total Pairs',
        value: stats.totalPairs.toString(),
        change: `+${stats.weeklyPairs} this week`,
        icon: GitBranch,
        color: 'bg-purple-500'
      },
      {
        title: 'Team Members',
        value: (stats.leftLegMembers + stats.rightLegMembers).toString(),
        change: `+${stats.teamMembersThisWeek} this week`,
        icon: Users,
        color: 'bg-orange-500'
      }
    ];
  }, [stats]);

  const renderMobileZoomControls = (): JSX.Element => (
    <div className="fixed bottom-4 right-4 z-30 sm:hidden">
      <button
        onClick={() => setShowMobileControls(!showMobileControls)}
        className="w-12 h-12 bg-blue-500 text-white rounded-full shadow-2xl flex items-center justify-center hover:bg-blue-600 transition-all duration-300 hover:scale-110"
      >
        {showMobileControls ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>
      
      {showMobileControls && (
        <div className="absolute bottom-14 right-0 flex flex-col space-y-2">
          <button
            onClick={handleZoomIn}
            className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 rounded-xl shadow-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
            title="Zoom In"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={handleZoomOut}
            className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 rounded-xl shadow-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
            title="Zoom Out"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={handleResetZoom}
            className="w-10 h-10 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 rounded-xl shadow-xl flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-all"
            title="Reset View"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
          <div className="text-xs text-center font-bold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 rounded-xl px-2 py-1 shadow-xl">
            {Math.round(zoomLevel * 100)}%
          </div>
        </div>
      )}
    </div>
  );

  const renderDesktopZoomControls = (): JSX.Element => (
    <div className="absolute top-3 sm:top-4 lg:top-6 right-3 sm:right-4 lg:right-6 hidden sm:flex flex-col space-y-2 sm:space-y-3 z-20">
      <button
        onClick={handleZoomIn}
        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:scale-110 group"
        title="Zoom In"
      >
        <ZoomIn className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={handleZoomOut}
        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:scale-110 group"
        title="Zoom Out"
      >
        <ZoomOut className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
      </button>
      <button
        onClick={handleResetZoom}
        className="w-8 h-8 sm:w-10 sm:h-10 lg:w-12 lg:h-12 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 rounded-xl sm:rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-300 flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:scale-110 group"
        title="Reset View"
      >
        <RotateCcw className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 group-hover:scale-110 transition-transform" />
      </button>
      <div className="text-xs sm:text-sm text-center font-bold text-gray-700 dark:text-gray-300 bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-white/50 dark:border-gray-600/50 rounded-xl sm:rounded-2xl px-2 sm:px-3 py-1 sm:py-2 shadow-xl">
        {Math.round(zoomLevel * 100)}%
      </div>
    </div>
  );

  const renderTreeView = (): JSX.Element => (
    <div className="bg-white/70 dark:bg-gray-800/70 backdrop-blur-xl rounded-xl sm:rounded-2xl lg:rounded-3xl shadow-2xl border border-white/50 dark:border-gray-700/50 relative overflow-hidden">
      {renderDesktopZoomControls()}
      {renderMobileZoomControls()}
      
      <div 
        className="relative w-full select-none cursor-grab active:cursor-grabbing touch-pan-x touch-pan-y"
        style={{ 
          height: 'calc(100vh - 200px)',
          minHeight: '400px',
          maxHeight: '800px'
        }}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onWheel={handleWheel}
      >
        <div 
          className="absolute inset-0 flex justify-center items-start pt-4 sm:pt-6 lg:pt-12 transition-transform duration-300 ease-out"
          style={{ 
            transform: `scale(${zoomLevel}) translate(${panPosition.x / zoomLevel}px, ${panPosition.y / zoomLevel}px)`,
            transformOrigin: 'center top'
          }}
        >
          {loading ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-lg">Loading tree data...</div>
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-64">
              <div className="text-red-500">Error: {error}</div>
            </div>
          ) : treeData ? (
            <TreeNodeComponent
              node={treeData}
              onNodeClick={handleNodeClick}
              isExpanded={expandedNodes.has(treeData.user.id)}
              onToggleExpand={handleToggleExpand}
              expandedNodes={expandedNodes}
            />
          ) : null}
        </div>
      </div>
    </div>
  );

  const renderStatsView = (): JSX.Element => {
    if (!stats) return <div>Loading stats...</div>;
    
    return (
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4 sm:gap-6">
        {/* Leg Comparison */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
            <GitBranch className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-blue-500" />
            Leg Comparison
          </h3>
          <div className="space-y-4">
            <LegInfoCard 
              title="Left Leg"
              members={stats.leftLegMembers}
              pv={stats.leftLegPV}
              colorClass="bg-gradient-to-r from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20"
              textColorClass="text-emerald"
            />
            
            <LegInfoCard 
              title="Right Leg"
              members={stats.rightLegMembers}
              pv={stats.rightLegPV}
              colorClass="bg-gradient-to-r from-blue-50 to-cyan-50 dark:from-blue-900/20 dark:to-cyan-900/20"
              textColorClass="text-blue"
            />

            <BalanceStatusCard 
              leftLegPV={stats.leftLegPV}
              rightLegPV={stats.rightLegPV}
            />
          </div>
        </div>

        {/* Pairing Information */}
        <div className="bg-white/80 dark:bg-gray-800/80 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 shadow-lg border border-white/50 dark:border-gray-700/50">
          <h3 className="text-lg sm:text-xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 flex items-center">
            <Users className="w-5 h-5 sm:w-6 sm:h-6 mr-2 sm:mr-3 text-purple-500" />
            Pairing Information
          </h3>
          <div className="space-y-4">
            <InfoRow label="Total Pairs This Month" value={stats.monthlyPairs} />
            <InfoRow label="Pairs This Week" value={stats.weeklyPairs} />
            <InfoRow 
              label="Unused Left PV" 
              value={stats.unusedLeftPV} 
              valueClass="text-orange-600 dark:text-orange-400" 
            />
            <InfoRow 
              label="Unused Right PV" 
              value={stats.unusedRightPV} 
              valueClass="text-orange-600 dark:text-orange-400" 
            />

            <div className="p-3 sm:p-4 bg-gradient-to-r from-amber-50 to-yellow-50 dark:from-amber-900/20 dark:to-yellow-900/20 rounded-xl border border-amber-200 dark:border-amber-700/50">
              <p className="text-sm font-semibold text-amber-800 dark:text-amber-300 mb-1">
                💰 Business Bonus Potential
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-400">
                Next pair will generate {formatCurrency(500)} business bonus
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="  relative dark:border-gray-700 bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-slate-900 dark:to-indigo-950 p-2 sm:p-4 lg:p-6">
      {
          loading ?  
     <LoadingSpinner message="Loading Binary Tree..."  size='xl'/>
         :  <div className="max-w-full    mx-auto space-y-3 sm:space-y-4 lg:space-y-5">
        {/* Stats Cards using Redux data */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3 lg:gap-4">
          {statsData.map((stat) => (
            <StatCard key={stat.title} {...stat} />
          ))}
        </div>

        {/* Main Content */}
        <div className="relative w-full">
          {viewMode === 'tree' ? renderTreeView() : renderStatsView()}
        </div>

        {/* Selected Node Details Modal */}
        {selectedNode && (
          <NodeDetailsModal 
            node={selectedNode} 
            onClose={() => setSelectedNode(null)} 
          />
        )}
      </div>
      }
    
    </div>
  );
};

export default BinaryTree;