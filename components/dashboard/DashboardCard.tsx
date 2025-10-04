import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
  formatAs?: 'currency';
  precision?: number;
  onClick?: () => void;
  variant?: 'neutral' | 'positive' | 'negative' | 'highlight';
  icon?: React.ReactNode;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, formatAs, precision = 0, onClick, variant = 'neutral', icon }) => {
  
  const variantStyles = {
    neutral: 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-100',
    positive: 'bg-green-50 dark:bg-green-900/50 text-green-800 dark:text-green-300',
    negative: 'bg-red-50 dark:bg-red-900/50 text-red-800 dark:text-red-300',
    highlight: 'bg-blue-50 dark:bg-blue-900/50 text-blue-800 dark:text-blue-300',
  };

  const titleColorStyles = {
      neutral: 'text-gray-500 dark:text-gray-400',
      positive: 'text-green-600 dark:text-green-400',
      negative: 'text-red-600 dark:text-red-400',
      highlight: 'text-blue-600 dark:text-blue-400',
  }

  const formattedValue = formatAs === 'currency' ? value.toFixed(precision) : value;

  const content = (
    <div className="text-left w-full">
      <div className="flex items-start justify-between">
        <p className={`text-sm font-medium ${titleColorStyles[variant]}`}>{title}</p>
        {icon}
      </div>
      <p className="text-2xl font-bold mt-1">
        {formatAs === 'currency' && <span className="font-black">৳</span>}
        {formattedValue}
      </p>
    </div>
  );

  const baseClasses = "p-4 rounded-xl shadow-md w-full h-full flex flex-col justify-center";
  const combinedClasses = `${baseClasses} ${variantStyles[variant]}`;

  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className={`${combinedClasses} transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        aria-label={`View details for ${title}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={combinedClasses}>
      {content}
    </div>
  );
};

export default DashboardCard;