import React from 'react';
import { User } from '../types';
import { HistoryIcon } from './Icons';

interface FlatmateBalanceCardProps {
  user: User;
  balance: number;
  mealCount: number;
  totalDeposit: number;
  totalExpenses: number;
  onHistoryClick: () => void;
}

const FlatmateBalanceCard: React.FC<FlatmateBalanceCardProps> = ({
  user,
  balance,
  mealCount,
  totalDeposit,
  totalExpenses,
  onHistoryClick
}) => {
  const balanceColor = balance >= 0 ? 'text-green-600' : 'text-red-500';
  const avatarInitial = user.name.charAt(0).toUpperCase();

  return (
    <div className="bg-white p-4 rounded-2xl border border-gray-200/80 shadow-sm">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center font-bold text-gray-500 text-lg">
            {avatarInitial}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 capitalize">{user.name}</h3>
            <p className={`font-bold text-lg ${balanceColor}`}>
              {balance < 0 && '-'}<span className="font-black">৳</span>{Math.abs(balance).toFixed(2)}
            </p>
          </div>
        </div>
        <button 
            onClick={onHistoryClick} 
            className="text-gray-400 hover:text-gray-700 transition-colors"
            aria-label={`View history for ${user.name}`}
        >
          <div className="w-5 h-5">
            <HistoryIcon />
          </div>
        </button>
      </div>
      
      <hr className="my-3 border-gray-100" />

      <div className="grid grid-cols-3 text-center">
        <div>
          <p className="text-gray-500 text-sm">Total Meal</p>
          <p className="font-bold text-gray-800 text-lg">{mealCount}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Deposit</p>
          <p className="font-bold text-gray-800 text-lg"><span className="font-black">৳</span>{totalDeposit}</p>
        </div>
        <div>
          <p className="text-gray-500 text-sm">Total Expenses</p>
          <p className="font-bold text-gray-800 text-lg"><span className="font-black">৳</span>{totalExpenses.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};

export default FlatmateBalanceCard;