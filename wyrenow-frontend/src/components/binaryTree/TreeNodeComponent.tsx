import React, { memo, useState, useRef, useMemo } from 'react';
import { ChevronDown, ChevronRight, UserPlus, User } from 'lucide-react';
import { TreeNode } from '../../types/index';
import { useNavigate } from 'react-router-dom';

interface TreeNodeComponentProps {
  node: TreeNode;
  onNodeClick: (node: TreeNode) => void;
  isExpanded: boolean;
  onToggleExpand: (nodeId: string) => void;
  expandedNodes: Set<string>;
  level?: number;
}

interface TooltipProps {
  node: TreeNode;
  isVisible: boolean;
  position: { x: number; y: number };
}

// Modern Tooltip Component
const Tooltip: React.FC<TooltipProps> = ({ node, isVisible, position }) => {
  if (!isVisible) return null;

  return (
    <div
      className="fixed z-50 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border border-white/20 dark:border-gray-700/50 rounded-2xl shadow-2xl p-5 max-w-sm animate-in fade-in slide-in-from-top-2 duration-300"
      style={{
        left: `${position.x}px`,
        top: `${position.y}px`,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="space-y-4">
        {/* Header */}
        <div className="text-center">
          <h4 className="font-bold text-gray-900 dark:text-white text-lg mb-1">
            {node.user.firstName} {node.user.lastName}
          </h4>
          <p className="text-sm text-gray-600 dark:text-gray-400">{node.user.email}</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">{node.user.phone}</p>
        </div>
        
        {/* Modern Stats Grid */}
        <div className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/30 dark:to-emerald-800/20 p-3 rounded-xl border border-emerald-200/50 dark:border-emerald-700/50">
            <p className="text-emerald-700 dark:text-emerald-300 font-semibold text-xs mb-1">Left PV</p>
            <p className="font-bold text-emerald-900 dark:text-emerald-100 text-lg">{node.totalLeftPV}</p>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/20 p-3 rounded-xl border border-blue-200/50 dark:border-blue-700/50">
            <p className="text-blue-700 dark:text-blue-300 font-semibold text-xs mb-1">Right PV</p>
            <p className="font-bold text-blue-900 dark:text-blue-100 text-lg">{node.totalRightPV}</p>
          </div>
          <div className="bg-gradient-to-br from-violet-50 to-violet-100 dark:from-violet-900/30 dark:to-violet-800/20 p-3 rounded-xl border border-violet-200/50 dark:border-violet-700/50">
            <p className="text-violet-700 dark:text-violet-300 font-semibold text-xs mb-1">Left BV</p>
            <p className="font-bold text-violet-900 dark:text-violet-100 text-lg">{node.totalLeftBV || 0}</p>
          </div>
          <div className="bg-gradient-to-br from-cyan-50 to-cyan-100 dark:from-cyan-900/30 dark:to-cyan-800/20 p-3 rounded-xl border border-cyan-200/50 dark:border-cyan-700/50">
            <p className="text-cyan-700 dark:text-cyan-300 font-semibold text-xs mb-1">Right BV</p>
            <p className="font-bold text-cyan-900 dark:text-cyan-100 text-lg">{node.totalRightBV || 0}</p>
          </div>
        </div>
      </div>
    </div>
  );
};

// Modern Register New User Card Component
const RegisterNewUserCard: React.FC<{ onRegister: () => void }> = ({ onRegister }) => (
  <div 
    className="w-40 h-40 border-2 border-dashed border-indigo-300 dark:border-indigo-500 rounded-2xl flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 via-purple-50 to-blue-50 dark:from-indigo-900/30 dark:via-purple-900/20 dark:to-blue-900/30 hover:from-indigo-100 hover:via-purple-100 hover:to-blue-100 dark:hover:from-indigo-800/40 dark:hover:via-purple-800/30 dark:hover:to-blue-800/40 transition-all duration-300 cursor-pointer group hover:border-indigo-400 dark:hover:border-indigo-400 hover:shadow-xl hover:-translate-y-1"
    onClick={onRegister}
  >
    <div className="w-16 h-16 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-2xl flex items-center justify-center mb-3 group-hover:scale-110 group-hover:rotate-3 transition-all duration-300 shadow-lg group-hover:shadow-xl">
      <UserPlus className="w-8 h-8 text-white" />
    </div>
    <p className="text-sm font-bold text-indigo-700 dark:text-indigo-300 text-center px-3 leading-tight">
      Register New User
    </p>
    <div className="mt-2 w-8 h-1 bg-gradient-to-r from-indigo-400 to-purple-500 rounded-full group-hover:w-12 transition-all duration-300"></div>
  </div>
);

// Calculate the total width needed for a subtree including ALL descendants
const calculateTotalSubtreeWidth = (node: TreeNode | undefined, expandedNodes: Set<string>): number => {
  if (!node) {
    return 160; // Width for register card
  }

  const nodeWidth = 160; // Base width for a single node
  const isExpanded = expandedNodes.has(node.user.id);
  
  if (!isExpanded || (!node.leftChild && !node.rightChild)) {
    return nodeWidth;
  }

  // Recursively calculate widths for all descendants
  const leftWidth = calculateTotalSubtreeWidth(node.leftChild, expandedNodes);
  const rightWidth = calculateTotalSubtreeWidth(node.rightChild, expandedNodes);
  
  const minSpacing = 96; // Minimum spacing between subtrees
  const totalWidth = leftWidth + rightWidth + minSpacing;
  
  return Math.max(totalWidth, nodeWidth);
};

// Calculate positions for immediate children based on their total subtree widths
const calculateChildPositions = (node: TreeNode, expandedNodes: Set<string>) => {
  if (!expandedNodes.has(node.user.id)) {
    return { leftOffset: 0, rightOffset: 0, spacing: 0 };
  }

  // Calculate the TOTAL width needed for each child's entire subtree
  const leftTotalWidth = calculateTotalSubtreeWidth(node.leftChild, expandedNodes);
  const rightTotalWidth = calculateTotalSubtreeWidth(node.rightChild, expandedNodes);
  
  const minSpacing = 96; // Minimum spacing between the two subtrees
  const totalSpacing = leftTotalWidth / 2 + rightTotalWidth / 2 + minSpacing;
  
  const leftOffset = -totalSpacing / 2;
  const rightOffset = totalSpacing / 2;
  
  return {
    leftOffset,
    rightOffset,
    spacing: totalSpacing
  };
};

// Modern Tree Node Component with Proper Propagating Connection Lines
const TreeNodeComponent: React.FC<TreeNodeComponentProps> = memo(({ 
  node, 
  onNodeClick, 
  isExpanded, 
  onToggleExpand, 
  expandedNodes,
  level = 0
}) => {
  const [showTooltip, setShowTooltip] = useState(false);
  const [tooltipPosition, setTooltipPosition] = useState({ x: 0, y: 0 });
  const nodeRef = useRef<HTMLDivElement>(null);
  
  const canExpand = true;
 const navigate = useNavigate();
  // Calculate child positions - this will now consider ALL descendants
  const childPositions = useMemo(() => {
    return calculateChildPositions(node, expandedNodes);
  }, [node, expandedNodes]);

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = rect.left + rect.width / 2;
    const y = rect.top;
    
    const adjustedX = Math.min(Math.max(x, 200), window.innerWidth - 200);
    const adjustedY = Math.max(y - 10, 10);
    
    setTooltipPosition({ x: adjustedX, y: adjustedY });
    setShowTooltip(true);
  };

  const handleMouseLeave = () => {
    setShowTooltip(false);
  };

  const handleRegisterNewUser = (leg: 'left' | 'right') => {
    // alert('Register new user functionality would be implemented here'+ leg + node.user.id +node.user.firstName + node.user.lastName + node.user.sponsorUsername);
    navigate(`/user-registration?placementUserId=${node.user.id}&placementLeg=${leg}&sponsorUsername=${node.user.sponsorUsername}&placementName=${node.user.firstName}${node.user.lastName}`);
  };

  const renderChildNode = (childNode: TreeNode | undefined, position: 'left' | 'right') => {
    return childNode ? (
      <TreeNodeComponent
        node={childNode}
        onNodeClick={onNodeClick}
        isExpanded={expandedNodes.has(childNode.user.id)}
        onToggleExpand={onToggleExpand}
        expandedNodes={expandedNodes}
        level={level + 1}
      />
    ) : (
      <RegisterNewUserCard onRegister={() => { handleRegisterNewUser(position)}} />
    );
  };

  return (
    <>
      <div className="flex flex-col items-center relative">
        {/* Modern Node Card */}
        <div 
          ref={nodeRef}
          className="relative bg-gradient-to-br from-white via-gray-50 to-gray-100 dark:from-gray-800 dark:via-gray-750 dark:to-gray-700 rounded-2xl p-5 shadow-xl border border-white/50 dark:border-gray-600/50 hover:border-blue-300 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-300 cursor-pointer w-40 group hover:-translate-y-1 backdrop-blur-sm z-20"
          onClick={() => onNodeClick(node)}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
        >
          {/* Expand/Collapse Button */}
          {canExpand && (
            <button
              className="absolute -top-3 -right-3 w-8 h-8 bg-gradient-to-br from-blue-500 to-indigo-600 text-white rounded-xl flex items-center justify-center hover:from-blue-600 hover:to-indigo-700 transition-all duration-200 shadow-lg z-30 group-hover:scale-110"
              onClick={(e) => {
                e.stopPropagation();
                onToggleExpand(node.user.id);
              }}
            >
              {isExpanded ? 
                <ChevronDown className="w-4 h-4" /> : 
                <ChevronRight className="w-4 h-4" />
              }
            </button>
          )}

          {/* User Icon */}
          <div className="flex flex-col items-center">
            <div className="relative mb-3">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center shadow-lg transition-all duration-300 group-hover:scale-105 ${
                node.user.isActive 
                  ? 'bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600' 
                  : 'bg-gradient-to-br from-gray-400 to-gray-600'
              }`}>
                <User className="w-8 h-8 text-white" />
              </div>
            </div>
            
            {/* User Name */}
            <h4 className="font-bold text-gray-900 dark:text-white text-sm text-center leading-tight">
              {node.user.firstName}
            </h4>
            <h4 className="font-bold text-gray-900 dark:text-white text-sm text-center leading-tight">
              {node.user.lastName}
            </h4>
          </div>

          {/* Gradient overlay */}
          <div className="absolute inset-0 rounded-2xl bg-gradient-to-br from-white/20 to-transparent pointer-events-none"></div>
        </div>

        {/* Children with Properly Propagating Connection Lines */}
        {isExpanded && (
          <div className="relative mt-8">
            {/* Main vertical line from parent */}
            <div className="absolute -top-8 left-1/2 transform -translate-x-0.5 w-0.5 h-8 bg-gradient-to-b from-blue-400 to-blue-600 rounded-full z-10"></div>
            
            {/* Dynamic Horizontal connector line - now properly calculated based on ALL descendants */}
            {childPositions.spacing > 0 && (
              <div 
                className="absolute top-0 left-1/2 transform -translate-x-1/2 h-0.5 bg-gradient-to-r from-transparent via-blue-500 to-transparent rounded-full z-10 transition-all duration-500 ease-out"
                style={{ width: `${childPositions.spacing}px` }}
              ></div>
            )}
            
            <div className="flex justify-center items-start pt-0 relative">
              {/* Left Child */}
              <div 
                className="flex flex-col items-center relative transition-all duration-500 ease-out"
                style={{ 
                  transform: `translateX(${childPositions.leftOffset}px)`
                }}
              >
                {/* Vertical line to left child */}
                <div className="absolute top-0 left-1/2 transform -translate-x-0.5 w-0.5 h-12 bg-gradient-to-b from-blue-500 to-emerald-400 rounded-full z-10"></div>
                
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-4 bg-gradient-to-r from-emerald-100 to-emerald-200 dark:from-emerald-900/50 dark:to-emerald-800/50 px-4 py-2 rounded-full border border-emerald-200 dark:border-emerald-700 relative z-20 shadow-sm">
                  LEFT
                </div>
                {renderChildNode(node.leftChild, 'left')}
              </div>

              {/* Right Child */}
              <div 
                className="flex flex-col items-center relative transition-all duration-500 ease-out"
                style={{ 
                  transform: `translateX(${childPositions.rightOffset}px)`
                }}
              >
                {/* Vertical line to right child */}
                <div className="absolute top-0 left-1/2 transform -translate-x-0.5 w-0.5 h-12 bg-gradient-to-b from-blue-500 to-blue-400 rounded-full z-10"></div>
                
                <div className="text-xs font-bold text-gray-500 dark:text-gray-400 mb-4 bg-gradient-to-r from-blue-100 to-blue-200 dark:from-blue-900/50 dark:to-blue-800/50 px-4 py-2 rounded-full border border-blue-200 dark:border-blue-700 relative z-20 shadow-sm">
                  RIGHT
                </div>
                {renderChildNode(node.rightChild, 'right')}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Tooltip */}
      <Tooltip 
        node={node} 
        isVisible={showTooltip} 
        position={tooltipPosition} 
      />
    </>
  );
});

TreeNodeComponent.displayName = 'TreeNodeComponent';

export default TreeNodeComponent;