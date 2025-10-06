import React from 'react';
import { TransactionType } from '../../types';

interface BadgeProps {
  type: TransactionType;
}

const Badge: React.FC<BadgeProps> = ({ type }) => {
  const config = {
    expense: 'bg-red-500 text-white',
    deposit: 'bg-sky-500 text-white',
    meal: 'bg-teal-100 text-teal-800',
    'shared-expense': 'bg-purple-500 text-white',
  };
  
  const label = type === 'shared-expense' ? 'Shared' : (type.charAt(0).toUpperCase() + type.slice(1));

  return (
    <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${config[type]}`}>
      {label}
    </span>
  );
};

export default Badge;
