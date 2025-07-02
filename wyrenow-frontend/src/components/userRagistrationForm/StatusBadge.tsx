import React from 'react';

interface StatusBadgeProps {
  status: 'available' | 'filled';
  className?: string;
}

const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className = '' }) => {
  const baseClasses = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium';
  const statusClasses = status === 'available' 
    ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
    : 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';

  return (
    <span className={`${baseClasses} ${statusClasses} ${className}`}>
      {status}
    </span>
  );
};

export default StatusBadge;