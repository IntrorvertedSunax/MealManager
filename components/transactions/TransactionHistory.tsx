import React, { useMemo } from 'react';
import { Transaction, Member } from '../../types';
import { PencilIcon, TrashIcon } from '../ui/Icons';
import Badge from '../ui/Badge';

interface TransactionListItemProps {
  transaction: Transaction;
  members: Member[];
  onEdit: () => void;
  onDelete: () => void;
  runningBalance?: number;
  hideRunningBalance?: boolean;
}

const TransactionListItem: React.FC<TransactionListItemProps> = ({ transaction, members, onEdit, onDelete, runningBalance, hideRunningBalance }) => {
  const member = members.find(u => u.id === transaction.memberId);

  if (transaction.type === 'meal') {
    return null;
  }

  const isExpenseType = transaction.type === 'expense' || transaction.type === 'shared-expense';
  const amountColor = isExpenseType ? 'text-red-600 dark:text-red-400' : 'text-green-600 dark:text-green-400';
  const sign = isExpenseType ? '-' : '+';
  
  const date = new Date(transaction.date);
  const datePart = date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  const timePart = date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
  const formattedDateTime = `${datePart}, ${timePart}`;

  let title = '';
  if (transaction.type === 'expense' || transaction.type === 'shared-expense') {
    title = transaction.description;
  } else { // deposit
    title = member?.name || 'Unknown';
  }

  const paidByText = useMemo(() => {
    if (!isExpenseType) return null;
    
    if (transaction.payerIds && transaction.payerIds.length > 0) {
      return transaction.payerIds
        .map(id => members.find(m => m.id === id)?.name)
        .filter(Boolean)
        .join(', ');
    }
    
    return member?.name || null;
  }, [transaction, members, isExpenseType, member]);

  // Compact layout for Deposits & Expenses pages
  if (hideRunningBalance) {
    const sharedWithNames = transaction.type === 'shared-expense'
      ? transaction.sharedWith
          ?.map(id => members.find(u => u.id === id)?.name.split(' ')[0])
          .filter(Boolean)
          .join(', ')
      : null;

    return (
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-3">
        <div className="flex justify-between items-center">
          <div className="flex-grow pr-4">
            <div className="flex items-center gap-2 mb-0.5">
              <Badge type={transaction.type} />
              <h3 className="font-semibold text-slate-800 dark:text-slate-100 capitalize leading-tight">
                {title}
              </h3>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              {formattedDateTime}
            </p>
          </div>
          
          <div className="text-right flex-shrink-0">
            <p className={`font-extrabold text-lg ${amountColor}`}>
              {sign}<span className="font-black">৳</span>{transaction.amount.toFixed(2)}
            </p>
            {isExpenseType && paidByText && (
              <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                Paid by {paidByText}
              </p>
            )}
          </div>
        </div>

        {sharedWithNames && (
          <div className="mt-2 pt-2 border-t border-slate-200/80 dark:border-slate-700">
            <p className="text-xs text-slate-500 dark:text-slate-400">
              Shared with: <span className="font-medium">{sharedWithNames}</span>
            </p>
          </div>
        )}
      </div>
    );
  }

  // Original layout for Transaction History page
  let subtext: React.ReactNode = null;
  if (transaction.type === 'shared-expense') {
      const sharedWithNames = transaction.sharedWith
          ?.map(id => members.find(u => u.id === id)?.name.split(' ')[0])
          .filter(Boolean)
          .join(', ');
      subtext = (
          <p className="text-xs text-slate-500 dark:text-slate-400 pt-2 border-t border-slate-200/80 dark:border-slate-700">
              Shared with: <span className="font-medium">{sharedWithNames}</span>
          </p>
      );
  }


  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm p-4 space-y-3">
      {/* Top Section: Title, Date, Amount */}
      <div className="flex justify-between items-start">
        <div className="flex-grow pr-4">
          <div className="flex items-center gap-2 mb-1">
            <Badge type={transaction.type} />
            <h3 className="font-semibold text-slate-800 dark:text-slate-100 capitalize leading-tight">
              {title}
            </h3>
          </div>
          <p className="text-sm text-slate-500 dark:text-slate-400">
            {formattedDateTime}
          </p>
        </div>
        <div className="text-right flex-shrink-0">
          <p className={`font-extrabold text-xl ${amountColor}`}>
            {sign}<span className="font-black">৳</span>{transaction.amount.toFixed(2)}
          </p>
          {isExpenseType && paidByText && (
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
              Paid by {paidByText}
            </p>
          )}
        </div>
      </div>

      {subtext}
      
      {/* Divider and Bottom Section */}
      <div className={`pt-2 ${!subtext ? 'border-t border-slate-200/80 dark:border-slate-700' : ''}`}>
        <div className="flex justify-between items-center">
          {runningBalance !== undefined && !hideRunningBalance ? (
            <div>
              <p className="text-base">
                <span className="text-slate-600 dark:text-slate-300">Balance:</span>
                <span className="font-semibold text-slate-800 dark:text-slate-100 ml-1">
                  <span className="font-black">৳</span>
                  {runningBalance.toFixed(2)}
                </span>
              </p>
            </div>
          ) : <div />}
          <div className="flex items-center">
            <button 
              onClick={onEdit} 
              className="p-1.5 rounded-full text-teal-600 hover:bg-teal-100 dark:hover:bg-teal-900/50 transition-colors"
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