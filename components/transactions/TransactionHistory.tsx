import React from 'react';
import { Transaction, User } from '../../types';
import { PencilIcon, TrashIcon } from '../ui/Icons';
import Badge from '../ui/Badge';

interface TransactionListItemProps {
  transaction: Transaction;
  users: User[];
  onEdit: () => void;
  onDelete: () => void;
  runningBalance?: number;
  hideRunningBalance?: boolean;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction, users, onEdit, onDelete, runningBalance, hideRunningBalance }) => {
  const user = users.find(u => u.id === transaction.userId);

  if (transaction.type === 'meal') {
    return null;
  }

  const isExpenseType = transaction.type === 'expense' || transaction.type === 'shared-expense';
  
  let title = '';
  let subtext: React.ReactNode = null;
  const amountColor = isExpenseType ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
  const sign = isExpenseType ? '-' : '+';
  
  const date = new Date(transaction.date);
  const datePart = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const formattedDateTime = `${datePart}, ${timePart}`;

  if (transaction.type === 'shared-expense') {
      title = transaction.description;
      const sharedWithNames = transaction.sharedWith
          ?.map(id => users.find(u => u.id === id)?.name.split(' ')[0])
          .filter(Boolean)
          .join(', ');
      subtext = (
          <p className="text-xs text-gray-500 dark:text-gray-400 pt-2 border-t border-gray-200/80 dark:border-gray-700">
              Shared with: <span className="font-medium">{sharedWithNames}</span>
          </p>
      );
  } else if (transaction.type === 'expense') {
      title = transaction.description;
  } else { // deposit
      title = user?.name || 'Unknown';
  }


  return (
    <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 p-4 space-y-3">
      {/* Top Section: Title, Date, Amount */}
      <div className="flex justify-between items-start">
        <div className="flex-grow pr-4">
          <div className="flex items-center gap-2 mb-1">
            <Badge type={transaction.type} />
            <h3 className="font-bold text-gray-800 dark:text-gray-100 capitalize leading-tight">
              {title}
            </h3>
          </div>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {formattedDateTime}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`font-bold text-xl ${amountColor}`}>
            {sign}<span className="font-black">৳</span>{transaction.amount.toFixed(2)}
          </p>
          {isExpenseType && user && (
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-0.5">
              Paid by {user.name}
            </p>
          )}
        </div>
      </div>

      {subtext}
      
      {/* Divider and Bottom Section */}
      <div className={`pt-2 ${!subtext ? 'border-t border-gray-200/80 dark:border-gray-700' : ''}`}>
        <div className="flex justify-between items-center">
          {runningBalance !== undefined && !hideRunningBalance ? (
            <div>
              <p className="text-base">
                <span className="text-gray-600 dark:text-gray-300">Balance:</span>
                <span className="font-bold text-gray-800 dark:text-gray-100 ml-1">
                  <span className="font-black">৳</span>
                  {runningBalance.toFixed(0)}
                </span>
              </p>
            </div>
          ) : <div />}
          <div className="flex items-center">
            <button 
              onClick={onEdit} 
              className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors"
              aria-label="Edit transaction"
            >
              <PencilIcon className="h-5 w-5" />
            </button>
            <button
              onClick={onDelete}
              className="p-1.5 rounded-full text-red-500 hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors"
              aria-label="Delete transaction"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionListItem;
