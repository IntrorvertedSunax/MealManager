import React from 'react';
import { Transaction, User } from '../types';
import { PencilIcon, TrashIcon } from './Icons';
import Badge from './Badge';

interface TransactionListItemProps {
  transaction: Transaction;
  users: User[];
  onEdit: (transaction: Transaction) => void;
  onDelete: (transactionId: string) => void;
  runningBalance?: number;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction, users, onEdit, onDelete, runningBalance }) => {
  const user = users.find(u => u.id === transaction.userId);

  // Meal transactions are converted to expenses before being displayed in history lists,
  // so we only need to handle expense and deposit types here.
  if (transaction.type === 'meal') {
    return null;
  }

  const isExpense = transaction.type === 'expense';
  
  const title = isExpense ? transaction.description : user?.name || 'Unknown User';
  const amountColor = isExpense ? 'text-red-500' : 'text-green-600';
  const sign = isExpense ? '-' : '+';

  const formattedDate = new Date(transaction.date).toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    second: 'numeric',
    hour12: true,
  });

  return (
    <li className="bg-white p-4 rounded-xl shadow-sm border border-gray-200/80">
      {/* Top Section */}
      <div className="flex justify-between items-start gap-4">
        {/* Left Side: Badge, Title, Date */}
        <div>
          <div className="flex items-center gap-3">
            <Badge type={transaction.type} />
            <h3 className="font-bold text-gray-900 text-lg capitalize">
              {title}
            </h3>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            {formattedDate.replace(',', '')}
          </p>
        </div>
        
        {/* Right Side: Amount, "Paid by" */}
        <div className="text-right flex-shrink-0">
          <p className={`font-bold text-xl ${amountColor}`}>
            {sign}<span className="font-black">৳</span>{transaction.amount.toFixed(2)}
          </p>
          {isExpense && (
            <p className="text-sm text-gray-500">Paid by {user?.name || 'Unknown'}</p>
          )}
        </div>
      </div>
      
      {/* Separator */}
      <hr className="my-3 border-gray-100" />
      
      {/* Bottom Section */}
      <div className="flex justify-between items-center">
        {/* Left Side: Balance */}
        <div>
          {runningBalance !== undefined && (
            <p className="text-sm text-gray-600">
              Balance: <span className="font-bold text-gray-900"><span className="font-black">৳</span>{runningBalance.toFixed(2)}</span>
            </p>
          )}
        </div>
        
        {/* Right Side: Actions */}
        <div className="flex items-center space-x-2">
          <button onClick={() => onEdit(transaction)} className="text-blue-500 hover:text-blue-700 transition-colors">
             <PencilIcon />
          </button>
          <button onClick={() => onDelete(transaction.id)} className="text-red-500 hover:text-red-700 transition-colors">
            <TrashIcon />
          </button>
        </div>
      </div>
    </li>
  );
};

export default TransactionListItem;