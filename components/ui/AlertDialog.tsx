import React from 'react';
import Button from './Button';
import { AlertDialogConfig } from '../../types';

interface AlertDialogProps {
  config: AlertDialogConfig;
  onClose: () => void;
}

const AlertDialog: React.FC<AlertDialogProps> = ({ config, onClose }) => {
  const { isOpen, title, description, onConfirm } = config;

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[70] p-4" onClick={onClose}>
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-sm" onClick={e => e.stopPropagation()}>
        <div className="p-6">
          <h2 className="text-lg font-bold text-gray-900 dark:text-gray-100">{title}</h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{description}</p>
        </div>
        <div className="bg-gray-50 dark:bg-gray-700/50 px-6 py-3 flex justify-end gap-3 rounded-b-lg">
          <Button type="button" onClick={onClose} variant="secondary">
            Cancel
          </Button>
          <Button
            type="button"
            onClick={onConfirm}
            className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
          >
            Remove
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AlertDialog;