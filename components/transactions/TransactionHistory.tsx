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
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction, users, onEdit, onDelete, runningBalance }) => {
  const user = users.find(u => u.id === transaction.userId);

  if (transaction.type === 'meal') {
    return null;
  }

  const isExpense = transaction.type === 'expense';
  
  const title = isExpense ? transaction.description : (user?.name || 'Unknown');
  const amountColor = isExpense ? 'text-red-600' : 'text-green-600';
  const sign = isExpense ? '-' : '+';
  
  const date = new Date(transaction.date);
  const datePart = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', second: '2-digit', hour12: true });
  const formattedDateTime = `${datePart}, ${timePart}`;

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4 space-y-3">
      {/* Top Section: Title, Date, Amount */}
      <div className="flex justify-between items-start">
        <div className="flex-grow pr-4">
          <div className="flex items-center gap-2 mb-1">
            <Badge type={transaction.type} />
            <h3 className="font-bold text-gray-800 capitalize leading-tight">
              {title}
            </h3>
          </div>
          <p className="text-sm text-gray-500">
            {formattedDateTime}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`font-bold text-xl ${amountColor}`}>
            {sign}<span className="font-black">৳</span>{transaction.amount.toFixed(2)}
          </p>
          {isExpense && user && (
            <p className="text-sm text-gray-500 mt-0.5">
              Paid by {user.name}
            </p>
          )}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-200/80" />

      {/* Bottom Section: Balance and Actions */}
      <div className="flex justify-between items-center">
        <div>
          <p className="text-base">
            <span className="text-gray-600">Balance:</span>
            <span className="font-bold text-gray-800 ml-1">
              <span className="font-black">৳</span>
              {runningBalance !== undefined ? runningBalance.toFixed(0) : 'N/A'}
            </span>
          </p>
        </div>
        <div className="flex items-center">
          <button 
            onClick={onEdit} 
            className="p-1.5 rounded-full text-blue-600 hover:bg-blue-100 transition-colors"
            aria-label="Edit transaction"
          >
            <PencilIcon className="h-5 w-5" />
          </button>
          <button
            onClick={onDelete}
            className="p-1.5 rounded-full text-red-500 hover:bg-red-100 transition-colors"
            aria-label="Delete transaction"
          >
            <TrashIcon className="h-5 w-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default TransactionListItem;
