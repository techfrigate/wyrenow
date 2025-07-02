import React from 'react';
import { Users } from 'lucide-react';
import StatusBadge from './StatusBadge';

interface Position {
    user_id: number;
  username: string;
  name: string;
  leftLeg: 'available' | 'filled';
  rightLeg: 'available' | 'filled';
}

interface AvailablePositionsTableProps {
  positions: Position[];
  handlePlacementChange: ( id: number ,  leg: 'left' | 'right' ,username: string | null) => void;
  selectedPosition?: { username: string; leg: 'left' | 'right' ,user_id: number} | null;
  className?: string;
}

const AvailablePositionsTable: React.FC<AvailablePositionsTableProps> = ({
  positions,
  handlePlacementChange,
  selectedPosition,
  className = ''
}) => { 
 
  return (
    <div className={`bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden ${className}`}>
      {/* Header */}
      <div className="bg-gray-50 dark:bg-gray-700 px-6 py-4 border-b border-gray-200 dark:border-gray-600">
        <div className="flex items-center space-x-2">
          <Users className="w-5 h-5 text-primary-600 dark:text-primary-400" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Available Positions
          </h3>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead className="bg-gray-50 dark:bg-gray-700">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Username
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Name
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Left Leg
              </th>
              <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Right Leg
              </th>
            </tr>
          </thead>
          <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            {positions.length && positions.map((position, index) => (
              <tr 
                key={position.username}
                className="hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900 dark:text-white">
                    {position.username}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    {position.name}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <StatusBadge status={position.leftLeg} />
                    {position.leftLeg === 'available' && (
                        
                      <input
                        type="radio"
                        name="position-selection"
                        value={`${position.username}-left`}
                        checked={selectedPosition?.user_id === position.user_id && selectedPosition?.leg === 'left'}
                        onChange={() => handlePlacementChange(position.user_id, 'left', position.username)}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800   dark:bg-gray-700 dark:border-gray-600 ocus:outline-none focus:ring-0"
                      />
                    )}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap text-center">
                  <div className="flex items-center justify-center space-x-3">
                    <StatusBadge status={position.rightLeg} />
                    {position.rightLeg === 'available' && (    
                      <input
                        type="radio"
                        name="position-selection"
                        value={`${position.username}-right`}
                        checked={selectedPosition?.user_id === position.user_id && selectedPosition?.leg === 'right'}
                        onChange={() => handlePlacementChange(position.user_id, 'right', position.username)}
                        className="w-4 h-4 text-primary-600 bg-gray-100 border-gray-300 focus:ring-primary-500 dark:focus:ring-primary-600 dark:ring-offset-gray-800   dark:bg-gray-700 dark:border-gray-600 focus:outline-none focus:ring-0"
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
 
    </div>
  );
};

export default AvailablePositionsTable;