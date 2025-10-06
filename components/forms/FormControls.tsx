import React from 'react';
import { UpDownIcon } from '../ui/Icons';

export const Input: React.FC<React.InputHTMLAttributes<HTMLInputElement> & { leadingIcon?: React.ReactNode, trailingIcon?: React.ReactNode }> = ({ leadingIcon, trailingIcon, className, ...props }) => {
  const baseStyles = "peer w-full py-3 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition";
  const paddingClasses = `${leadingIcon ? 'pl-10' : 'pl-4'} ${trailingIcon ? 'pr-10' : 'pr-4'}`;
  
  return (
    <div className="relative">
      {leadingIcon && (
        <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3 text-slate-400 transition-colors peer-focus:text-teal-600 dark:peer-focus:text-teal-400">
          {leadingIcon}
        </div>
      )}
      <input {...props} className={`${baseStyles} ${paddingClasses} ${className || ''}`} />
      {trailingIcon && (
        <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-slate-400 transition-colors peer-focus:text-teal-600 dark:peer-focus:text-teal-400">
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
        className={`w-full appearance-none px-3 py-3 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition ${className || ''}`}
      >
        {children}
      </select>
      <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-700 dark:text-slate-300">
        <UpDownIcon />
      </div>
    </div>
  );
};

export const Textarea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = ({ className, ...props }) => {
  const baseStyles = "peer w-full py-3 px-4 bg-white dark:bg-slate-700 dark:text-white dark:border-slate-600 border border-slate-300 rounded-xl shadow-sm focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition resize-none";
  return (
    <textarea {...props} className={`${baseStyles} ${className || ''}`} />
  );
};

export const FormField: React.FC<{label: string, children: React.ReactNode, description?: string, error?: string}> = ({label, children, description, error}) => (
    <div>
        <label className="block text-sm font-semibold text-slate-700 dark:text-slate-300 mb-1">{label}</label>
        {description && <p className="text-xs text-teal-700 dark:text-teal-400 mb-1">{description}</p>}
        {children}
        {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
    </div>
);