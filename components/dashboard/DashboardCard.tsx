import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
  formatAs?: 'currency';
  precision?: number;
  onClick?: () => void;
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, formatAs, precision = 0, onClick }) => {
  const content = (
    <>
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">
        {formatAs === 'currency' && <span className="font-black">৳</span>}
        {formatAs === 'currency' ? value.toFixed(precision) : value}
      </p>
    </>
  );

  const baseClasses = "bg-white p-4 rounded-xl shadow-md text-center w-full h-full flex flex-col justify-center";

  if (onClick) {
    return (
      <button 
        onClick={onClick} 
        className={`${baseClasses} transition-transform transform hover:scale-105 hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
        aria-label={`View details for ${title}`}
      >
        {content}
      </button>
    );
  }

  return (
    <div className={baseClasses}>
      {content}
    </div>
  );
};

export default DashboardCard;