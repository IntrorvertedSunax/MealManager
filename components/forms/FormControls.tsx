import React from 'react';
import { SwitchVerticalIcon } from '../ui/Icons';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { leadingIcon?: React.ReactNode, trailingIcon?: React.ReactNode }> = ({ leadingIcon, trailingIcon, className, ...props }) => {
  const baseStyles = "w-full py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition";
  const paddingClasses = `${leadingIcon ? 'pl-8' : 'pl-3'} ${trailingIcon ? 'pr-10' : 'pr-3'}`;
  
  return (
    <div className="relative">
      {leadingIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
          {leadingIcon}
        </div>
      )}
      <input {...props} className={`${baseStyles} ${paddingClasses} ${className || ''}`} />
      {trailingIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
          {trailingIcon}
        </div>
      )}
    </div>
  );
};

export const Select: React.FC<React.SelectHTMLAttributes<HTMLSelectElement> & { children: React.ReactNode }> = ({ className, children, ...props }) => {
  return (
    <div className="relative">
      <select 
        {...props} 
        className={`w-full appearance-none px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition ${className || ''}`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-700">
        <SwitchVerticalIcon />
      </div>
    </div>
  );
};

export const FormField: React.FC<{label: string, children: React.ReactNode, description?: string, error?: string}> = ({label, children, description, error}) => (
    <div>
        <label className="block text-sm font-medium text-gray-700">{label}</label>
        {description && <p className="text-xs text-gray-500 mb-1">{description}</p>}
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);