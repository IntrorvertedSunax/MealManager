import React, { useState } from 'react';
import Button from '../ui/Button';
import { Input } from '../forms/FormControls';
import { ExclamationIcon } from '../ui/Icons';

interface ResetConfirmationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

const ResetConfirmationDialog: React.FC<ResetConfirmationDialogProps> = ({ isOpen, onClose, onConfirm }) => {
  const [confirmationText, setConfirmationText] = useState('');
  const isConfirmed = confirmationText === 'reset';

  if (!isOpen) return null;

  const handleConfirm = () => {
    if (isConfirmed) {
      onConfirm();
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[70] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-slate-800 rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center text-red-500 dark:text-red-400 mb-3">
            <ExclamationIcon className="h-6 w-6 mr-2" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-slate-100">Are you absolutely sure?</h2>
          </div>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-2">
            This action <strong className="font-bold">cannot</strong> be undone. This will permanently delete all members, meals, and financial data.
          </p>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-4">
            Please type <strong className="font-bold text-red-600 dark:text-red-400">reset</strong> to confirm.
          </p>
          <div className="mt-4">
            <Input
              type="text"
              value={confirmationText}
              onChange={(e) => setConfirmationText(e.target.value)}
              placeholder="reset"
              autoFocus
            />
          </div>
        </div>
        <div className="bg-slate-50 dark:bg-slate-700/50 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleConfirm}
            disabled={!isConfirmed}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 disabled:bg-red-300 dark:disabled:bg-red-800 disabled:cursor-not-allowed"
          >
            Confirm Reset
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResetConfirmationDialog;