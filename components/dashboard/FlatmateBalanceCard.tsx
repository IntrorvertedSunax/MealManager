import React from 'react';
import { User } from '../../types';
import { ClipboardListIcon } from '../ui/Icons';
import Avatar from '../ui/Avatar';

interface FlatmateBalanceCardProps {
  user: User;
  balance: number;
  onHistoryClick: () => void;
}

const FlatmateBalanceCard: React.FC<FlatmateBalanceCardProps> = ({
  user,
  balance,
  onHistoryClick
}) => {
  const balanceColor = balance >= 0 ? 'text-green-600 dark:text-green-400' : 'text-red-500 dark:text-red-400';

  return (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Avatar name={user.name} avatar={user.avatar} />
          <div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 capitalize">{user.name}</h3>
            <div className="flex items-baseline gap-1.5 mt-0.5">
                <span className="text-sm font-medium text-slate-500 dark:text-slate-400">Current Balance:</span>
                <p className={`font-extrabold text-xl ${balanceColor}`}>
                    {balance < 0 && '-'}<span className="font-black">৳</span>{Math.abs(balance).toFixed(0)}
                </p>
            </div>
          </div>
        </div>
        <button 
            onClick={onHistoryClick} 
            className="text-slate-400 hover:text-slate-700 dark:hover:text-slate-200 transition-colors"
            aria-label={`View history for ${user.name}`}
        >
          <div className="w-5 h-5">
            <ClipboardListIcon />
          </div>
        </button>
      </div>
    </div>
  );
};

export default FlatmateBalanceCard;