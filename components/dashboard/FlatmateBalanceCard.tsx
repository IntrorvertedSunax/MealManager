import React from 'react';
import { User } from '../../types';
import { ClipboardListIcon } from '../ui/Icons';
import Avatar from '../ui/Avatar';

interface FlatmateBalanceCardProps {
  user: User;
  balance: number;
  mealCount: number;
  totalDeposit: number;
  mealCost: number;
  onHistoryClick: () => void;
}

const FlatmateBalanceCard: React.FC<FlatmateBalanceCardProps> = ({
  user,
  balance,
  mealCount,
  totalDeposit,
  mealCost,
  onHistoryClick
}) => {
  const balanceColor = balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-2xl border border-gray-200/80 dark:border-gray-700 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} avatar={user.avatar} />
          <div>
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100 capitalize">{user.name}</h3>
            <p className={`font-bold text-lg ${balanceColor}`}>
              {balance < 0 && '-'}<span className="font-black">৳</span>{Math.abs(balance).toFixed(0)}
            </p>
          </div>
        </div>
        <button 
            onClick={onHistoryClick} 
            className="text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition-colors"
            aria-label={`View history for ${user.name}`}
        >
          <div className="w-5 h-5">
            <ClipboardListIcon />
          </div>
        </button>
      </div>
      
      <hr className="my-3 border-gray-100 dark:border-gray-700" />

      <div className="grid grid-cols-3 text-center">
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Meal</p>
          <p className="font-bold text-gray-800 dark:text-gray-100 text-lg">{mealCount}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Deposit</p>
          <p className="font-bold text-gray-800 dark:text-gray-100 text-lg"><span className="font-black">৳</span>{totalDeposit}</p>
        </div>
        <div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">Total Cost</p>
          <p className="font-bold text-gray-800 dark:text-gray-100 text-lg"><span className="font-black">৳</span>{mealCost.toFixed(0)}</p>
        </div>
      </div>
    </div>
  );
};

export default FlatmateBalanceCard;