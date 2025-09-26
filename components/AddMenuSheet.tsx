import React from 'react';
import { ModalType } from '../types';
import { XIcon, MealIcon, DepositIcon, ReceiptIcon } from './Icons';

interface AddMenuSheetProps {
  isOpen: boolean;
  onClose: () => void;
  onSelect: (type: ModalType) => void;
}

const AddMenuSheet: React.FC<AddMenuSheetProps> = ({ isOpen, onClose, onSelect }) => {

  const MenuButton: React.FC<{ icon: React.ReactNode, label: string, onClick: () => void }> = ({ icon, label, onClick }) => (
    <button
      onClick={onClick}
      className="w-full flex items-center p-4 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
    >
      <div className="p-2 bg-gray-200 rounded-full mr-4 text-gray-600">
        {icon}
      </div>
      <span className="font-semibold text-gray-800 text-lg">{label}</span>
    </button>
  );

  return (
    <div className={`fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-end transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}`} onClick={onClose}>
      <div className={`bg-white rounded-t-2xl shadow-xl w-full max-w-lg transform transition-transform duration-300 ${isOpen ? 'translate-y-0' : 'translate-y-full'}`} onClick={e => e.stopPropagation()}>
        <div className="p-6 border-b">
          <div className="flex justify-between items-start">
            <div>
              <h2 className="text-xl font-bold text-gray-800">Add New</h2>
              <p className="text-sm text-gray-500">Log a new meal, deposit, or expense.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 p-1"><XIcon /></button>
          </div>
        </div>

        <div className="p-6 space-y-4">
          <MenuButton icon={<MealIcon />} label="Add Meal" onClick={() => onSelect('meal')} />
          <MenuButton icon={<DepositIcon />} label="Add Deposit" onClick={() => onSelect('deposit')} />
          <MenuButton icon={<ReceiptIcon />} label="Add Expense" onClick={() => onSelect('expense')} />
        </div>
      </div>
    </div>
  );
};

export default AddMenuSheet;
