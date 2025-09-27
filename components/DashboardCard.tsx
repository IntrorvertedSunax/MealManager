import React from 'react';

interface DashboardCardProps {
  title: string;
  value: number;
  formatAs?: 'currency';
}

const DashboardCard: React.FC<DashboardCardProps> = ({ title, value, formatAs }) => {
  return (
    <div className="bg-white p-4 rounded-xl shadow-md text-center">
      <p className="text-sm text-gray-500">{title}</p>
      <p className="text-2xl font-bold text-gray-800 mt-1">
        {formatAs === 'currency' && <span className="font-black">৳</span>}
        {formatAs === 'currency' ? value.toFixed(0) : value}
      </p>
    </div>
  );
};

export default DashboardCard;