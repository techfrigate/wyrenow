import React, { ReactNode } from 'react';

interface CardProps {
  children: ReactNode;
  className?: string;
  variant?: 'default' | 'primary' | 'success' | 'warning' | 'error' | 'info';
}

const Card: React.FC<CardProps> = ({
  children,
  className = '',
  variant = 'default'
}) => {
  const variantClasses = {
    default: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700',
    primary: 'bg-primary-50 dark:bg-primary-900/20 border border-primary-200 dark:border-primary-800/30',
    success: 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800/30',
    warning: 'bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800/30',
    error: 'bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800/30',
    info: 'bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800/30'
  };
  
  return (
    <div className={`rounded-lg p-4 ${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  );
};

export default Card;