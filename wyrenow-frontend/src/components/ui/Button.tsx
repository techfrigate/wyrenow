import React, { ReactNode } from 'react';

interface ButtonProps {
  children: ReactNode;
  onClick: () => void;
  variant?: 'primary' | 'secondary' | 'success';
  disabled?: boolean;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  className?: string;
  type?: 'button' | 'submit' | 'reset';
}

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  variant = 'primary',
  disabled = false,
  icon,
  iconPosition = 'left',
  className = '',
  type = 'button'
}) => {
  const baseClasses = 'flex items-center space-x-2 px-6 py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed';
  
  const variantClasses = {
    primary: 'bg-primary-600 text-white hover:bg-primary-700',
    secondary: 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700',
    success: 'bg-green-600 text-white hover:bg-green-700'
  };
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${className}`}
    >
      {icon && iconPosition === 'left' && icon}
      <span>{children}</span>
      {icon && iconPosition === 'right' && icon}
    </button>
  );
};

export default Button;