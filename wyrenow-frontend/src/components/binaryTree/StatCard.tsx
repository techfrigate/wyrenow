// File: components/ui/StatCard.tsx
import React from 'react';
import { LucideIcon } from 'lucide-react';

interface StatCardProps {
  title: string;
  icon: LucideIcon;
  color: string;
  change?: string;
  // For leg stats that need both PV and BV
  isPVBVCard?: boolean;
  pvValue?: string;
  bvValue?: string;
  // For regular stats
  value?: string;
}

const StatCard: React.FC<StatCardProps> = ({ 
  title, 
  value, 
  change, 
  icon: Icon, 
  color,
  isPVBVCard = false,
  pvValue,
  bvValue
}) => {
  // Map colors to gradients and text colors
  const colorMap: Record<string, {gradient: string, textColor: string, lightColor: string}> = {
    'bg-green-500': {
      gradient: 'from-green-400 to-green-600',
      textColor: 'text-green-500',
      lightColor: 'text-green-400'
    },
    'bg-blue-500': {
      gradient: 'from-blue-400 to-blue-600',
      textColor: 'text-blue-500',
      lightColor: 'text-blue-400'
    },
    'bg-purple-500': {
      gradient: 'from-purple-400 to-purple-600',
      textColor: 'text-purple-500',
      lightColor: 'text-purple-400'
    },
    'bg-orange-500': {
      gradient: 'from-orange-400 to-orange-600',
      textColor: 'text-orange-500',
      lightColor: 'text-orange-400'
    },
  };
  
  const { gradient, textColor, lightColor } = colorMap[color] || 
    { gradient: 'from-gray-400 to-gray-600', textColor: 'text-gray-500', lightColor: 'text-gray-400' };
  
  return (
    <div className="group relative overflow-hidden bg-white dark:bg-gray-800 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 dark:border-gray-700">
      {/* Decorative accent */}
      <div className={`absolute top-0 left-0 w-full h-1 bg-gradient-to-r ${gradient}`}></div>
      
      {/* Card content */}
      <div className="p-4">
        {/* Header with title and icon */}
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300">{title}</h3>
          <div className={`${textColor} dark:${lightColor} bg-opacity-10 p-1.5 rounded-full bg-current`}>
            <Icon className="w-3.5 h-3.5 text-current" />
          </div>
        </div>
        
        {/* Main content */}
        {isPVBVCard ? (
          <div className="grid grid-cols-2 gap-3">
            <div className="relative p-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-gray-50 dark:group-hover:from-gray-800 dark:group-hover:to-gray-900 transition-all duration-300">
              <span className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full ${color.replace('bg', 'bg')} opacity-50 mt-1.5 mr-1.5`}></span>
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 font-medium">PV</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{pvValue}</p>
            </div>
            <div className="relative p-2 bg-gray-50 dark:bg-gray-900/30 rounded-lg group-hover:bg-gradient-to-br group-hover:from-white group-hover:to-gray-50 dark:group-hover:from-gray-800 dark:group-hover:to-gray-900 transition-all duration-300">
              <span className={`absolute top-0 right-0 w-1.5 h-1.5 rounded-full ${color.replace('bg', 'bg')} opacity-70 mt-1.5 mr-1.5`}></span>
              <p className="text-xs uppercase tracking-wider text-gray-500 dark:text-gray-400 mb-1 font-medium">BV</p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">{bvValue}</p>
            </div>
          </div>
        ) : (
          <div className="flex items-end justify-between">
            <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
            {change && (
              <div className="flex items-center space-x-1">
                <span className={`inline-block w-1.5 h-1.5 rounded-full bg-green-500`}></span>
                <span className="text-xs font-medium text-green-600 dark:text-green-400">
                  {change}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Change indicator for PV/BV cards */}
      {isPVBVCard && change && (
        <div className="absolute bottom-0 right-0 m-2">
          <div className="flex items-center space-x-1 bg-white dark:bg-gray-700 shadow-sm px-2 py-0.5 rounded-full">
            <span className={`inline-block w-1.5 h-1.5 rounded-full bg-green-500`}></span>
            <span className="text-xs font-medium text-green-600 dark:text-green-400">
              {change}
            </span>
          </div>
        </div>
      )}
    </div>
  );
};

export default StatCard;