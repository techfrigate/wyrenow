import React from 'react';
import { TreeNode } from '../../types';
import Button from '../ui/Button';
import { User } from 'lucide-react';

interface NodeDetailsModalProps {
  node: TreeNode;
  onClose: () => void;
}

const NodeDetailsModal: React.FC<NodeDetailsModalProps> = ({ node, onClose }) => {
  console.log(node)
  return (
    <div className="fixed   h-full border border-red-500 inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Member Details
          </h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-2xl leading-none"
          >
            ×
          </button>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center space-x-3">
            <div className="w-16 h-16 rounded-full bg-gradient-to-br from-emerald-400 via-blue-500 to-purple-600 flex items-center justify-center">
              <span className="text-white font-bold text-lg">
                {node.user.firstName.charAt(0)}{node.user.lastName.charAt(0)}
              </span>
            </div>
            <div>
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {node.user.firstName} {node.user.lastName}
              </h4>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {node.user.email}
              </p>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {node.user.phone}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">Left PV</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {node.totalLeftPV}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">Right PV</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {node.totalRightPV}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">Left BV</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {node.totalLeftBV || 0}
              </p>
            </div>
            <div className="p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
              <p className="text-xs text-gray-600 dark:text-gray-400">Right BV</p>
              <p className="font-semibold text-gray-900 dark:text-white">
                {node.totalRightBV || 0}
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NodeDetailsModal;