import React, { ReactNode } from 'react';

interface FormInputProps {
  label: string;
  id?: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
  maxLength?: number;
  icon?: ReactNode;
  iconPosition?: 'left' | 'right';
  onIconClick?: () => void;
}

const FormInput: React.FC<FormInputProps> = ({
  label,
  id,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = false,
  error,
  className = '',
  maxLength,
  icon,
  iconPosition = 'right',
  onIconClick
}) => {
  return (
    <div className={className}>
      <label 
        htmlFor={id || name} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label} {required && '*'}
      </label>
      <div className="relative">
        <input
          id={id || name}
          name={name}
          type={type}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          maxLength={maxLength}
          className={`w-full px-4 py-3 ${icon && iconPosition === 'right' ? 'pr-12' : ''} ${icon && iconPosition === 'left' ? 'pl-12' : ''} border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
        />
        {icon && (
          <button
            type="button"
            onClick={onIconClick}
            className={`absolute ${iconPosition === 'right' ? 'right-3' : 'left-3'} top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300`}
          >
            {icon}
          </button>
        )}
      </div>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default FormInput;