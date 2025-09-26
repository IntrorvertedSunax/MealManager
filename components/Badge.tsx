import React from 'react';
import { TransactionType } from '../types';

interface BadgeProps {
  type: TransactionType;
}

const Badge: React.FC<BadgeProps> = ({ type }) => {
  const config = {
    expense: 'bg-red-500 text-white',
    deposit: 'bg-gray-200 text-gray-800',
    meal: 'bg-blue-100 text-blue-800',
  };

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${config[type]}`}>
      {type.charAt(0).toUpperCase() + type.slice(1)}
    </span>
  );
};

export default Badge;
