import React, { useState, useEffect } from 'react';
import { getSettings, saveSettings } from '../../data';
import { SunIcon, MoonIcon } from './Icons';
import { AppSettings } from '../../types';

const ThemeToggleButton: React.FC = () => {
  // Initialize state from localStorage, falling back to system preference
  const [isDarkModeActive, setIsDarkModeActive] = useState(() => {
    const settings = getSettings();
    if (settings.theme === 'dark') return true;
    if (settings.theme === 'light') return false;
    // For 'system', check the media query
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  // Effect to apply the theme class to the document root
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkModeActive);
  }, [isDarkModeActive]);

  const handleThemeChange = (mode: 'light' | 'dark') => {
    const newIsDarkMode = mode === 'dark';
    setIsDarkModeActive(newIsDarkMode);
    saveSettings({ theme: mode });
  };

  return (
    <div className="flex items-center rounded-full bg-slate-200 dark:bg-slate-800 p-1">
      <button
        onClick={() => handleThemeChange('light')}
        className={`p-1.5 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-200 dark:focus:ring-offset-slate-800 focus:ring-teal-500 ${
          !isDarkModeActive
            ? 'bg-white dark:bg-slate-600 shadow text-yellow-500'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
        }`}
        aria-pressed={!isDarkModeActive}
        aria-label="Switch to light theme"
      >
        <SunIcon className="h-5 w-5" />
      </button>
      <button
        onClick={() => handleThemeChange('dark')}
        className={`p-1.5 rounded-full transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-offset-1 focus:ring-offset-slate-200 dark:focus:ring-offset-slate-800 focus:ring-teal-500 ${
          isDarkModeActive
            ? 'bg-white dark:bg-slate-600 shadow text-blue-500'
            : 'text-slate-500 dark:text-slate-400 hover:bg-slate-300 dark:hover:bg-slate-700'
        }`}
        aria-pressed={isDarkModeActive}
        aria-label="Switch to dark theme"
      >
        <MoonIcon className="h-5 w-5" />
      </button>
    </div>
  );
};

export default ThemeToggleButton;
