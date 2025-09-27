import React from 'react';
import { Transaction, User } from '../../types';
import { PencilIcon, TrashIcon, DepositIcon, ReceiptIcon } from '../ui/Icons';

interface TransactionListItemProps {
  transaction: Transaction;
  users: User[];
  onEdit: () => void;
  onDelete: () => void;
  runningBalance?: number;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction, users, onEdit, onDelete, runningBalance }) => {
  const user = users.find(u => u.id === transaction.userId);

  if (transaction.type === 'meal') {
    return null;
  }

  const isExpense = transaction.type === 'expense';
  
  const title = isExpense ? transaction.description : `Deposit from ${user?.name || 'Unknown'}`;
  const amountColor = isExpense ? 'text-red-500' : 'text-green-600';
  const sign = isExpense ? '-' : '+';
  
  const iconConfig = {
    expense: { icon: <ReceiptIcon />, bg: 'bg-red-50' },
    deposit: { icon: <DepositIcon />, bg: 'bg-green-50' },
  };
  const currentIcon = iconConfig[transaction.type];

  const formattedDate = new Date(transaction.date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
  });

  return (
    <li className="p-4 rounded-xl border border-gray-100 hover:bg-gray-50 transition-colors">
      <div className="flex items-center justify-between gap-4">
        {/* Left Side: Icon, Title, Subtitle */}
        <div className="flex items-center gap-4">
          <div className={`w-12 h-12 rounded-full flex items-center justify-center flex-shrink-0 ${currentIcon.bg} ${amountColor}`}>
            {currentIcon.icon}
          </div>
          <div>
            <h3 className="font-bold text-gray-800 capitalize">
              {title}
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              {formattedDate}
              {isExpense && ` • Paid by ${user?.name || 'Unknown'}`}
            </p>
          </div>
        </div>
        
        {/* Right Side: Amount and Running Balance */}
        <div className="text-right flex-shrink-0">
          <p className={`font-bold text-lg ${amountColor}`}>
            {sign}<span className="font-black">৳</span>{transaction.amount.toFixed(2)}
          </p>
          {runningBalance !== undefined && (
            <p className="text-xs text-gray-500">
              Balance: <span className="font-semibold">৳{runningBalance.toFixed(2)}</span>
            </p>
          )}
        </div>
      </div>
      
      {/* Action buttons on hover */}
      <div className="flex justify-end items-center space-x-2 pt-2 mt-2 border-t border-gray-100">
        <button onClick={onEdit} className="text-gray-400 hover:text-blue-500 transition-colors text-xs font-semibold flex items-center gap-1">
           <PencilIcon /> Edit
        </button>
        <button onClick={onDelete} className="text-gray-400 hover:text-red-500 transition-colors text-xs font-semibold flex items-center gap-1">
          <TrashIcon /> Delete
        </button>
      </div>
    </li>
  );
};

export default TransactionListItem;