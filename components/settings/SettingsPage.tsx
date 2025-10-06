import React, { useState } from 'react';
import { MealIcon, SunIcon, DatabaseIcon, ChevronRightIcon, ChevronLeftIcon } from '../ui/Icons';
import MealSettings from './MealSettings';
import ThemeSettings from './ThemeSettings';
import DataSettings from './DataSettings';

type SettingsView = 'main' | 'meals' | 'theme' | 'data';

interface SettingsPageProps {
  onDataReset: () => void;
}

interface SettingsLinkProps {
    icon: React.ReactNode;
    title: string;
    description: string;
    onClick: () => void;
}

const SettingsLink: React.FC<SettingsLinkProps> = ({ icon, title, description, onClick }) => (
    <button onClick={onClick} className="w-full flex items-center p-4 text-left bg-slate-50 hover:bg-slate-100 dark:bg-slate-800 dark:hover:bg-slate-700 rounded-lg transition-colors border border-slate-200 dark:border-slate-700">
        <div className="p-2 bg-slate-200 dark:bg-slate-600 rounded-full mr-4 text-slate-600 dark:text-slate-300">
            {icon}
        </div>
        <div className="flex-grow">
            <h3 className="font-bold text-slate-800 dark:text-slate-100 text-lg">{title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{description}</p>
        </div>
        <ChevronRightIcon className="h-5 w-5 text-slate-400" />
    </button>
);

const SettingsPage: React.FC<SettingsPageProps> = ({ onDataReset }) => {
    const [view, setView] = useState<SettingsView>('main');

    const pageDetails: Record<SettingsView, { title: string, component: React.ReactNode }> = {
        main: { 
            title: 'Settings', 
            component: (
                <div className="space-y-4">
                    <SettingsLink 
                        icon={<MealIcon />} 
                        title="Meal Options" 
                        description="Customize visible meals and default values."
                        onClick={() => setView('meals')}
                    />
                    <SettingsLink 
                        icon={<SunIcon />} 
                        title="Theme" 
                        description="Switch between light and dark mode."
                        onClick={() => setView('theme')}
                    />
                    <SettingsLink 
                        icon={<DatabaseIcon />} 
                        title="Data Management" 
                        description="Reset all application data."
                        onClick={() => setView('data')}
                    />
                </div>
            )
        },
        meals: { title: 'Meal Options', component: <MealSettings /> },
        theme: { title: 'Appearance', component: <ThemeSettings /> },
        data: { title: 'Data Management', component: <DataSettings onReset={onDataReset} /> },
    };

    const handleBack = () => setView('main');

    return (
        <div className="space-y-6">
            {view !== 'main' && (
                <div className="mb-4">
                    <button onClick={handleBack} className="flex items-center text-sm font-semibold text-slate-600 hover:text-slate-800 dark:text-slate-300 dark:hover:text-white">
                        <ChevronLeftIcon className="h-5 w-5 mr-1" />
                        Back to Settings
                    </button>
                </div>
            )}
            {pageDetails[view].component}
        </div>
    );
};

export default SettingsPage;