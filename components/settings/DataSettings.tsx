import React from 'react';
import Button from '../ui/Button';
import { ExclamationIcon } from '../ui/Icons';

interface DataSettingsProps {
    onReset: () => void;
}

const DataSettings: React.FC<DataSettingsProps> = ({ onReset }) => {
    return (
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-lg">
            <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100 mb-1">Data Management</h2>
            <p className="text-sm text-slate-500 dark:text-slate-400 mb-6">Manage your application's stored data.</p>
            
            <div className="bg-red-50 dark:bg-red-900/20 border-l-4 border-red-500 p-4 rounded-r-lg">
                <div className="flex">
                    <div className="flex-shrink-0">
                        <ExclamationIcon className="h-5 w-5 text-red-400" />
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-red-800 dark:text-red-200">Danger Zone</h3>
                        <div className="mt-2 text-sm text-red-700 dark:text-red-300">
                            <p>
                                Resetting your data will permanently delete all members, meals, deposits, and expenses. This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="mt-6 pt-6 border-t border-slate-200 dark:border-slate-700 flex justify-end">
                <Button 
                    onClick={onReset} 
                    className="bg-red-600 text-white hover:bg-red-700 focus:ring-red-500"
                >
                    Reset All Data
                </Button>
            </div>
        </div>
    );
};

export default DataSettings;