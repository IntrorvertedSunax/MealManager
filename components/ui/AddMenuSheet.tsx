import React from 'react';
import { ModalType } from '../../types';
import { XIcon, MealIcon, DepositIcon, ReceiptIcon, UserPlusIcon, ScaleIcon } from './Icons';

interface AddMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: ModalType) => void;
}

const AddMenuSheet: React.FC<AddMenuSheetProps> = ({ isOpen, onClose, onSelect }) => {

  const MenuButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center p-4 text-left bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 rounded-lg transition-colors"
    >
      <div className="p-2 bg-gray-200 dark:bg-gray-600 rounded-full mr-4 text-gray-600 dark:text-gray-300">
        {icon}
      </div>
      <span className="font-semibold text-gray-800 dark:text-gray-100 text-lg">{label}</span>
    </button>
  );

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div className={`bg-white dark:bg-gray-800 rounded-t-2xl shadow-xl w-full max-w-lg transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b dark:border-gray-700">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800 dark:text-gray-100">Add New</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">Log a new meal, deposit, expense or member.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-1"><XIcon /></button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <MenuButton icon={<MealIcon />} label="Add Meal" onClick={() => onSelect('meal')} />
          <MenuButton icon={<DepositIcon />} label="Add Deposit" onClick={() => onSelect('deposit')} />
          <MenuButton icon={<ReceiptIcon />} label="Add Expense" onClick={() => onSelect('expense')} />
          <MenuButton icon={<ScaleIcon />} label="Add Shared Expense" onClick={() => onSelect('shared-expense')} />
        </div>
      </div>
    </div>
  );
};

export default AddMenuSheet;