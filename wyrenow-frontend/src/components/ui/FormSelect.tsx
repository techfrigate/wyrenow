import React from 'react';

interface SelectOption {
  value: string | number;
  label: string;
}

interface FormSelectProps {
  label: string;
  id?: string;
  name: string;
  value: string | number;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options: SelectOption[];
  placeholder?: string;
  required?: boolean;
  error?: string;
  className?: string;
}

const FormSelect: React.FC<FormSelectProps> = ({
  label,
  id,
  name,
  value,
  onChange,
  options,
  placeholder = 'Select an option',
  required = false,
  error,
  className = ''
}) => {
  return (
    <div className={className}>
      <label 
        htmlFor={id || name} 
        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
      >
        {label} {required && '*'}
      </label>
      <select
        id={id || name}
        name={name}
        value={value}
        onChange={onChange}
        className={`w-full px-4 py-3 border ${error ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'} rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white`}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <p className="mt-1 text-sm text-red-600 dark:text-red-400">{error}</p>}
    </div>
  );
};

export default FormSelect;